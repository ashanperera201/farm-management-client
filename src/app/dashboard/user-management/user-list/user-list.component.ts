import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserManagementService } from 'src/app/shared/services/user-management.service';
import { ExportTypes } from '../../../shared/enums/export-type';
import { UserAddComponent } from '../user-add/user-add.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  userListSubscription!: Subscription;
  addUserModal!: NgbModalRef;
  userList : any[] = [];
  
  constructor(private userManagementService: UserManagementService,
    private modalService: NgbModal,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  fetchAllUsers = () => {
    this.userListSubscription = this.userManagementService.fetchUserList().subscribe(userResult => {
      if(userResult && userResult.result){
        userResult.result.forEach((user: any) => {
          this.userList.push(user);
        });
      }
    }, error => {
      this.toastrService.error("Failed to load users","Error");
    })
  }

  addNewUser = () => {
    this.addUserModal = this.modalService.open(UserAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-xl'
    });
  }

  exportUserList = (type: any) => {
    if (type == ExportTypes.CSV) {

    }
    else {

    }
  }

  deleteUser = (userId: any) => {
    this.userManagementService.deleteUser(userId).subscribe(res => {
      if(res){
        this.toastrService.success("User deleted","Success");
        this.userList = [];
        this.fetchAllUsers();
      }
    }, errpr => {
      this.toastrService.error("Unable to delete user","Error");
    });
  }

  editUser = (userId : any) => {
      const addRoleModal = this.modalService.open(UserAddComponent, {
        animation: true,
        keyboard: true,
        backdrop: true,
        modalDialogClass: 'modal-lg',
      });
      addRoleModal.componentInstance.userId = userId;
      addRoleModal.componentInstance.isEditMode = true;
      //addRoleModal.componentInstance.afterSave = this.roleAfterSave();
  }


  ngOnDestroy() {
    if (this.userListSubscription) {
      this.userListSubscription.unsubscribe();
    }
  }
}
