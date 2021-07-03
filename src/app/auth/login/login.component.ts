import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../register/register.component';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
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
