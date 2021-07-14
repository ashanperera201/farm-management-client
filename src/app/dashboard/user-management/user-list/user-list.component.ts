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
      modalDialogClass: 'modal-md'
    });
  }

  deleteUser = (event: any) => {

  }

  editUser = (event: any) => {
    
  }

  exportUserList = (type: any) => {
    if (type == ExportTypes.CSV) {

    }
    else {

    }
  }


  ngOnDestroy() {
    if (this.userListSubscription) {
      this.userListSubscription.unsubscribe();
    }
  }
}
