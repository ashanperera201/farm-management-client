import { userModel } from './../../../shared/models/user-model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/shared/services/user-management.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  addUserForm! : FormGroup;
  roleList : any[] = [];

  constructor(private userManagementService: UserManagementService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initAddUserForm();
  }

  initAddUserForm= () => {
    this.addUserForm = new FormGroup({
      userName: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required])),
      role: new FormControl(null, Validators.compose([Validators.required])),
      phoneNumber: new FormControl(null, Validators.compose([Validators.required])),
      email: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      isActive: new FormControl(0),
    });
  }

  addUser = () => {
    if(this.addUserForm.valid){
      const user = new userModel();
      user.userName = this.addUserForm.value.userName;
      user.password = this.addUserForm.value.password;
      //user.role = this.addUserForm.value.role;
      user.contact = this.addUserForm.value.phoneNumber;
      user.userEmail = this.addUserForm.value.email;
      //user.isActive = this.addUserForm.value.isActive;

      this.userManagementService.addUser(user).subscribe(res => {
        if(res){
          this.toastrService.success("User saved successfully","Error");
        }
      }, error => {
        this.toastrService.error("Unable to save user","Error");
      });
    }
  }

  generatePassword = () => {

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

  clearAddUserForm = () => {
    this.addUserForm.reset();
  }
}
