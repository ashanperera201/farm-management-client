import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

loginForm! : FormGroup;

  constructor(private toastrService:ToastrService,
    private authService : AuthService) { }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm = () => {
    this.loginForm = new FormGroup({
      userName: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  login = () => {
    if(this.loginForm.valid){
      this.authService.loginUser(this.loginForm.value).subscribe(res => {
        if(res){

        }
        else{
          this.toastrService.error("Login Failed","Error")
        }
      })
    }
    else{
      this.toastrService.error("Please enter login details.")
    }
  }

  clearLoginForm = () => {
    this.loginForm.reset();
  }
}
