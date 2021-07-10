import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { userModel } from '../../shared/models/user-model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private authService : AuthService,
    private toastrService:ToastrService,
    ) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm= () => {
    this.registerForm = new FormGroup({
      userName: new FormControl(null, Validators.compose([Validators.required])),
      userEmail: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      firstName: new FormControl(null, Validators.compose([Validators.required])),
      middleName: new FormControl(null),
      lastName: new FormControl(null, Validators.compose([Validators.required])),
      contact: new FormControl(null, Validators.compose([Validators.required])),
      userAddress: new FormControl(null, Validators.compose([Validators.required])),
      nic: new FormControl(null, Validators.compose([Validators.required])),
      passpordId: new FormControl(null),
      password: new FormControl(null, Validators.compose([Validators.required])),
      rePassword: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  registerUser = () => {
    if (this.registerForm.valid) {
      if (this.checkPasswords(this.registerForm.value)) {
        if (this.checkExistingUser(this.registerForm.value.userName)) {
          let userModelData = new userModel();
          userModelData.userName = this.registerForm.value.userName;
          userModelData.userEmail = this.registerForm.value.userEmail;
          userModelData.password = this.registerForm.value.userName;
          userModelData.firstName = this.registerForm.value.userName;
          userModelData.middleName = this.registerForm.value.userName;
          userModelData.contact = this.registerForm.value.userName;
          userModelData.userAddress = this.registerForm.value.userName;
          userModelData.nic = this.registerForm.value.userName;
          userModelData.passportId = this.registerForm.value.userName;
          userModelData.profileImage = "";
          userModelData.countryCode = "SRI-LANKAN"
          this.authService.registerUser(userModelData).subscribe(res => {
            if (res) {
              this.toastrService.success("User registered successfully.", "Success")
              this.clearRegisterForm();
            }
          },
            error => {
              this.toastrService.error("Unable to save user.", "Error")
            });
        }
        else {
          this.toastrService.error("This user already exists.", "Error");
        }
      }
      else {
        this.toastrService.error("Re-entered password do not match", "Error");
      }
    }
  }

  checkPasswords = (formData: { password: any; rePassword: any; }) => {
    let result : boolean;
    result = formData.password == formData.rePassword ? true : false;
    return result;
  }

  checkExistingUser = (userName: any): boolean => {
    let existingUser: boolean = false;
    this.authService.fetchUsers().subscribe(users => {
      if (users) {
        existingUser = users.filter((x: { userName: any; }) => x.userName == userName) ? false : true;
      }
    });
    //return existingUser;
    return true;
  }

  clearRegisterForm = () => {
    this.registerForm.reset();
  }

}
