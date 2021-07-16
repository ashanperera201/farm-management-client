import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

    } else {

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
