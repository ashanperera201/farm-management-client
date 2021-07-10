import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../register/register.component';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { loginUserModel } from 'src/app/shared/models/user-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm! : FormGroup;
  signUpModal! : NgbModalRef;
  resetPasswordModal! : NgbModalRef;

  constructor( private authService : AuthService,
    private toastrService:ToastrService,
    private modalService : NgbModal
  ) { }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm = () => {
    this.loginForm = new FormGroup({
      userNameOrEmail: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required])),
    });
  }

  login = () => {
    if(this.loginForm.valid){
      const loginUser = new loginUserModel();
      loginUser.userNameOrEmail = this.loginForm.value.userNameOrEmail;
      loginUser.password = this.loginForm.value.password;
      this.authService.authenticateUser(loginUser).subscribe(res => {
        if(res){
          this.clearLoginForm();
        }
      }, 
      error => {
        this.toastrService.error("Login Failed","Error")
      });
    }
  }

  clearLoginForm = () => {
    this.loginForm.reset();
  }

  openSignUpPopup = () => {
    this.signUpModal = this.modalService.open(RegisterComponent,{
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-xl'
    });
  }

  openResetPassword = () => {
    this.resetPasswordModal = this.modalService.open(ForgetPasswordComponent,{
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md'
    });
  }

}
