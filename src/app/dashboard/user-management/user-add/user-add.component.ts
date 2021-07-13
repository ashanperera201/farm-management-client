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
  constructor(private userManagementService: UserManagementService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initAddUserForm();
  }

  initAddUserForm= () => {
    this.addUserForm = new FormGroup({
      userName: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required])),
      roll: new FormControl(null, Validators.compose([Validators.required])),
      phoneNumber: new FormControl(null, Validators.compose([Validators.required])),
      email: new FormControl(null, Validators.compose([Validators.email])),
      isActive: new FormControl(0),
    });
  }

  addUser = () => {
    this.userManagementService.addUser(this.addUserForm.value).subscribe(res => {
      if(res){
        this.toastrService.success("User saved successfully","Error")
      }
    }, error => {
      this.toastrService.error("Unable to save user","Error")
    });
  }

  generatePassword = () => {

  }

  fetchRoles = () => {
    this.userManagementService.fetchRoleList().subscribe(res => {
      if(res){

      }
    }, error => {
      this.toastrService.error("Unable to load user roles","Error")
    });
  }

  clearAddUserForm = () => {
    this.addUserForm.reset();
  }
}
