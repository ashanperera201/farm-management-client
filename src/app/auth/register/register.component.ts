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
      userEmail: new FormControl(null, Validators.compose([Validators.required])),
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
    if(this.registerForm.valid){
      if(this.checkExistingUser(this.registerForm.value)){
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
        this.authService.registerUser(userModelData).subscribe(res =>{
          if(res){

          }
        },
        error => {
          this.toastrService.error("Unable to save user.","Error")
        });
      }
      else{
        this.toastrService.error("This user already exists.","Error");
      }
    }
  }

  checkExistingUser = (userName: any): boolean => {
    let existingUser: boolean = false;
    this.authService.fetchUsers().subscribe(users => {
      if (users) {
        existingUser = users.filter((x: { userName: any; }) => x.userName == userName) ? false : true;
      }
    });
    return existingUser;
  }

  clearRegisterForm = () => {
    this.registerForm.reset();
  }

}
