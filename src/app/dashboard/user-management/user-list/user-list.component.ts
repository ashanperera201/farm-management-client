import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';
import { UserManagementService } from '../../../../app/shared/services/user-management.service';
import { ExportTypes } from '../../../shared/enums/export-type';
import { UserAddComponent } from '../user-add/user-add.component';
import { FileService } from '../../../shared/services/file.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  exportTypes = ExportTypes;
  searchParam!: string;
  userSubscriptions: Subscription[] = [];
  userList: any[] = [];
  isAllChecked: boolean = false;
  pageSize: number = 10;
  page: any = 1;

  constructor(
    private userManagementService: UserManagementService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  fetchAllUsers = () => {
    this.blockUI.start('Fetching users......');
    this.userSubscriptions.push(this.userManagementService.fetchUserList().subscribe(userResult => {
      if (userResult && userResult.validity) {
        this.userList = userResult.result;
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Failed to load users", "Error");
      this.blockUI.stop();
    }));
  }

  addNewUser = () => {
    const addUserModal = this.modalService.open(UserAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-xl'
    });

    if (addUserModal.componentInstance.afterSave) {
      this.userSubscriptions.push(addUserModal.componentInstance.afterSave.subscribe((serviceResponse: any) => {
        if (serviceResponse && serviceResponse.result) {
          this.userList = [...this.userList, serviceResponse.result].sort((a, b) => this.getTime(new Date(b.createdOn)) - this.getTime(new Date(a.createdOn)));
        }
      }));
    }
  }

  private getTime = (date?: Date) => {
    return date ? date.getTime() : 0;
  }

  exportUserList = (type: any) => {
    if (type == ExportTypes.CSV) {
      this.blockUI.start('Exporting Excel...');
      const userList: any[] = this.userList.map(x => {
        return {
          firstName: x.firstName.toLowerCase(),
          lastName: x.lastName.toLowerCase(),
          userEmail: x.userEmail.toLowerCase(),
          contact: x.contact.toLowerCase(),
          passportId: x.passportId ? x.passportId : '-',
          middleName: x.middleName ? x.middleName : '-',
          createdOn: moment(x.createdOn).format('YYYY-MM-DD'),
          modifiedOn: x.modifiedOn ? moment(x.modifiedOn).format('YYYY-MM-DD') : "-"
        }
      });

      this.fileService.exportAsExcelFile(userList, "user-permissions");
      this.blockUI.stop();
    }
    else {
      this.blockUI.start('Exporting Pdf...');
      const userList: any[] = this.userList.map(x => {
        return {
          firstName: x.firstName.toLowerCase(),
          lastName: x.lastName.toLowerCase(),
          userEmail: x.userEmail.toLowerCase(),
          contact: x.contact.toLowerCase(),
          passportId: x.passportId ? x.passportId : '-',
          middleName: x.middleName ? x.middleName : '-',
          createdOn: moment(x.createdOn).format('YYYY-MM-DD'),
          modifiedOn: x.modifiedOn ? moment(x.modifiedOn).format('YYYY-MM-DD') : "-"
        }
      });
      const headers: any[] = ['firstName', 'lastName', 'userEmail', 'contact', 'passportId', 'middleName', 'createdOn', 'modifiedOn'];
      this.fileService.exportToPDF("System Users", headers, userList, "user-list");
      this.blockUI.stop();
    }
  }

  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const userIds: string[] = (this.userList.filter(x => x.isChecked === true)).map(x => x._id);
    if (userIds && userIds.length > 0) {
      this.proceedDelete(userIds);
    } else {
      this.toastrService.error("Please select permissions to delete.", "Error");
      this.blockUI.stop();
    }
  }

  deleteUser = (userId: any) => {
    this.blockUI.start('Deleting....');
    this.proceedDelete([].concat(userId));
  }

  proceedDelete = (userIds: string[]) => {
    let form = new FormData();
    form.append("userIds", JSON.stringify(userIds));

    this.userSubscriptions.push(this.userManagementService.deleteUser(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        userIds.forEach(e => { const index: number = this.userList.findIndex((up: any) => up._id === e); this.userList.splice(index, 1); });
        this.toastrService.success('Successfully deleted.', 'Success');
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    }));
  }

  onSelectionChange = () => {
    if (this.isAllChecked) {
      this.userList = this.userList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.userList = this.userList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.userList[index].isChecked = !this.userList[index].isChecked;
  }

  editUser = (user: any) => {
    const addRoleModal = this.modalService.open(UserAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-lg',
    });

    addRoleModal.componentInstance.existingUser = user;
    addRoleModal.componentInstance.isEditMode = true;
    if (addRoleModal.componentInstance.afterSave) {
      this.userSubscriptions.push(addRoleModal.componentInstance.afterSave.subscribe((afterSaveRes: any) => {
        if (afterSaveRes) {
          this.userList = [...this.userList, afterSaveRes.result].sort((a, b) => this.getTime(new Date(b.createdOn)) - this.getTime(new Date(a.createdOn)));
        }
      }));
    }
  }


  ngOnDestroy() {
    if (this.userSubscriptions && this.userSubscriptions.length > 0) {
      this.userSubscriptions.forEach(s => {
        s.unsubscribe();
      })
    }
  }
}
