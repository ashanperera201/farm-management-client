import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm! : FormGroup;
  constructor( private authService : AuthService,
    private toastrService:ToastrService,
  ) { }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm = () => {
    this.loginForm = new FormGroup({
      userName: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required])),
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
  }

  clearLoginForm = () => {
    this.loginForm.reset();
  }

  openRegisterPopup = () => {
    
  }

}
