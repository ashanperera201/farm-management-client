import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExportTypes } from '../../../shared/enums/export-type';
import { UserManagementService } from '../../../shared/services/user-management.service';
import { FileService } from '../../../shared/services/file.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleAddComponent } from '../role-add/role-add.component';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit, OnDestroy {

  exportTypes = ExportTypes;
  roleList: any[] = [];
  tempRoleList: any[] = [];
  afterSaveRef!: Subscription;
  searchParam!: string;

  constructor(
    private userManagementService: UserManagementService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.fetchUserRoles();
  }

  fetchUserRoles = () => {
    this.userManagementService.fetchRoleList().subscribe(res => {
      if (res && res.result) {
        this.roleList = res.result;
      }
    }, () => {
      this.toastrService.error("Failed to load Roles", "Error");
    });
  }

  addNewRole = () => {
    this.modalService.open(RoleAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md'
    });
  }

  deleteRole = (roleId: any) => {
    this.userManagementService.deleteRole(roleId).subscribe(res => {
      if (res) {
        this.toastrService.success("User role deleted", "Success");
        this.roleList = [];
        this.fetchUserRoles();
      }
    }, () => {
      this.toastrService.error("Unable to delete user role", "Error");
    });
  }

  updateRole = (role: any) => {
    const addRoleModal = this.modalService.open(RoleAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addRoleModal.componentInstance.role = role;
    addRoleModal.componentInstance.isEditMode = true;
    if (addRoleModal.componentInstance.roleAfterSave) {
      this.afterSaveRef = addRoleModal.componentInstance.roleAfterSave.subscribe((res: any) => {
        if (res) {
          this.fetchUserRoles();
        }
      })
    }
  }

  exportRoleList = (type: any) => {
    if (type === ExportTypes.CSV) {
      const roleList: any[] = this.roleList.map(x => {
        return {
          role_code: x.roleCode,
          role_description: x.roleDescription,
          role_name: x.roleName,
          created_by: x.createdBy,
          created_date: x.createdOn,
          modified_by: x.modifiedBy,
          modified_on: x.modifiedOn

        }
      });
      this.fileService.exportAsExcelFile(roleList, "roles-file");
    }
    else {
      const roleList: any[] = this.roleList.map(x => {
        return {
          role_code: x.roleCode,
          role_description: x.roleDescription,
          role_name: x.roleName,
          created_by: x.createdBy,
          created_date: moment(x.createdOn).format('YYYY-MM-DD'),
          modified_by: x.modifiedBy ? x.modifiedBy : '-',
          modified_on: x.modifiedOn ? moment(x.modifiedOn).format('YYYY-MM-DD') : "-"
        }
      });
      const headers: any[] = ['role_code', 'role_description', 'role_name', 'created_by', 'created_date', 'modified_by', 'modified_on'];
      this.fileService.exportToPDF("Feed Brand", headers, roleList, 'user_roles');
    }
  }

  ngOnDestroy() {
    if (this.afterSaveRef) {
      this.afterSaveRef.unsubscribe();
    }
  }
}
