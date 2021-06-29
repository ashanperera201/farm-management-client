import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private toastrService:ToastrService,
    private authService : AuthService) { }

   ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm= () => {
    this.registerForm = new FormGroup({
      userName: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required])),
      rePassword: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  registerUser = () => {
    if(this.registerForm.valid){
      if(this.checkExistingUser(this.registerForm.value)){
        this.authService.registerUser(this.registerForm).subscribe(res =>{
          if(res){

          }
          else{
            this.toastrService.error("Unable to save user","Error");
          }
        });
      }
      else{
        this.toastrService.error("This user already exists.","Error")
      }
    }
    else{
      this.toastrService.error("Please enter required details.", "Error")
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

  clearLoginForm = () => {
    this.registerForm.reset();
  }

}
