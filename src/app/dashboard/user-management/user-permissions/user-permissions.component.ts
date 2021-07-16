import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../../../shared/services/file.service';
import { ExportTypes } from '../../../shared/enums/export-type';
import { UserManagementService } from '../../../shared/services/user-management.service';
import { UserPermissionAddComponent } from '../user-permission-add/user-permission-add.component';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss']
})
export class UserPermissionsComponent implements OnInit, OnDestroy {

  searchParam!: string;
  userPermissionList!: any[];
  exportTypes = ExportTypes;
  userPermissionSubscriptions: Subscription[] = [];

  constructor(
    private userManagementService: UserManagementService,
    private modalService: NgbModal,
    private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchUserPermission();
  }

  fetchUserPermission = () => {
    this.userPermissionSubscriptions.push(this.userManagementService.fetchUserPermission().subscribe(userPermissionResult => {
      if (userPermissionResult && userPermissionResult.validity) {
        this.userPermissionList = userPermissionResult.result;
      }
    }, () => {
      console.log("Failed to load user permission.");
    }))
  }

  addPermission = () => {
    const userPermissionAdd = this.modalService.open(UserPermissionAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md'
    });

    if (userPermissionAdd.componentInstance.afterSave) {
      this.userPermissionSubscriptions.push(userPermissionAdd.componentInstance.afterSave.subscribe((serviceResponse: any) => {
        if (serviceResponse && serviceResponse.result) {
          this.userPermissionList = [...this.userPermissionList, serviceResponse.result];
        }
      }));
    }
  }

  exportData = (fileType: number) => {
    if (fileType === ExportTypes.CSV) {
      this.fileService.exportAsExcelFile(this.userPermissionList, "user-permissions");
    } else {
      // const roleList: any[] = this.roleList.map(x => {
      //   return {
      //     role_code: x.roleCode,
      //     role_description: x.roleDescription,
      //     role_name: x.roleName,
      //     created_by: x.createdBy,
      //     created_date: moment(x.createdOn).format('YYYY-MM-DD'),
      //     modified_by: x.modifiedBy ? x.modifiedBy : '-',
      //     modified_on: x.modifiedOn ? moment(x.modifiedOn).format('YYYY-MM-DD') : "-"
      //   }
      // });
      // const headers: any[] = ['role_code', 'role_description', 'role_name', 'created_by', 'created_date', 'modified_by', 'modified_on'];
      // this.fileService.exportToPDF("User Permissions",)
    }
  }

  updatePermission = (permission: any) => {
    const userPermissionUpdate = this.modalService.open(UserPermissionAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md'
    });

    userPermissionUpdate.componentInstance.existingRecord = permission;
    if (userPermissionUpdate.componentInstance.afterSave) {
      this.userPermissionSubscriptions.push(userPermissionUpdate.componentInstance.afterSave.subscribe((result: any) => {
        if (result) {
          this.userPermissionList.map((up: any) => up._id === result._id ?
            { ...up, permissionCode: result.permissionCode, permissionName: result.permissionName, permissionDescription: result.permissionDescription } :
            up);
        }
      }));
    }
  }

  deletePermission = (permissionId: any) => {

  }

  ngOnDestroy() {
    if (this.userPermissionSubscriptions && this.userPermissionSubscriptions.length > 0) {
      this.userPermissionSubscriptions.forEach(s => {
        s.unsubscribe();
      })
    }
  }
}
