import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from '../../../shared/services/user-management.service';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss']
})
export class UserPermissionsComponent implements OnInit {

  constructor(private userManagementService: UserManagementService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  fetchUserPermissions = (userId: number) => {
    this.userManagementService.fetchUserPermission(userId).subscribe(res => {
      if (res) {

      }
    }, error => {
      this.toastrService.error("Unable to load user permission","Error");
    });
  }

  saveUserPermission = (permission: any) => {
    this.userManagementService.saveUserPermission(permission).subscribe(res => {
      if(res){
        this.toastrService.success("User permissions saved successfully","Success");
      }
    }, error => {
      this.toastrService.error("Unable to save user permission","Error");
    });
  }
}
