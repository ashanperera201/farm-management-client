import { Component, OnInit } from '@angular/core';
import { ExportTypes } from '../../../shared/enums/export-type';
import { UserManagementService } from 'src/app/shared/services/user-management.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RoleAddComponent } from '../role-add/role-add.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
  addRoleModal!: NgbModalRef;
  roleList : any[] = [];
  
  constructor(private userManagementService: UserManagementService,
    private modalService: NgbModal,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.fetchUserRoles();
  }

  fetchUserRoles = () => {
    this.userManagementService.fetchRoleList().subscribe(res => {
      if(res && res.result){
        res.result.forEach((role: any) => {
          this.roleList.push(role);
        });
      }
    },error => {
      this.toastrService.error("Failed to load users","Error");
    });
  }

  addNewRole = () => {
    this.addRoleModal = this.modalService.open(RoleAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md'
    });
  }

  deleteRole = (roleId: any) => {
    this.userManagementService.deleteRole(roleId).subscribe(res => {
      if(res){
        this.toastrService.success("User role deleted","Success");
        this.roleList = [];
        this.fetchUserRoles();
      }
    }, errpr => {
      this.toastrService.error("Unable to delete user role","Error");
    });
  }

  updateRole = (roleId : any) => {
    this.userManagementService.updateRole(roleId).subscribe(res => {
      if(res){
        this.toastrService.success("User role updated","Success");
        this.fetchUserRoles();
      }
    }, errpr => {
      this.toastrService.error("Unable to update user role","Error");
    });
  }

  exportRoleList = (type: any) => {
    if(type == ExportTypes.CSV){

    }
    else{

    }
  }
}
