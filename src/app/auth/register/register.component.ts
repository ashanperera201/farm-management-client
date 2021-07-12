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
        let userModelData = new userModel();
        userModelData.userName = (this.registerForm.value.userName).trim();
        userModelData.userEmail = this.registerForm.value.userEmail;
        userModelData.password = (this.registerForm.value.password).trim();
        userModelData.firstName = this.registerForm.value.firstName;
        userModelData.middleName = this.registerForm.value.middleName;
        userModelData.lastName = this.registerForm.value.lastName;
        userModelData.contact = this.registerForm.value.contact;
        userModelData.userAddress = this.registerForm.value.userAddress;
        userModelData.nic = this.registerForm.value.nic;
        userModelData.passportId = this.registerForm.value.passpordId;
        userModelData.profileImage = "";
        userModelData.countryCode = "SRI-LANKAN"
        this.authService.registerUser(userModelData).subscribe(res => {
          if (res) {
            this.toastrService.success("User registered successfully.", "Success")
            this.clearRegisterForm();
          }
        },
          error => {
            this.toastrService.error(error.error.error, "Unable to Save")
          });
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

  clearRegisterForm = () => {
    this.registerForm.reset();
  }

}
