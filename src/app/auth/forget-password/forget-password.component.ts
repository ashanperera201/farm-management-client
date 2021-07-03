import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  passwordResetForm! : FormGroup;

  constructor(private authService : AuthService,
    private toastrService : ToastrService,
    //public modalRef : NgbModalRef
    ) { }

  ngOnInit(): void {
    this.initPasswordResetForm();
  }

  initPasswordResetForm= () => {
    this.passwordResetForm = new FormGroup({
      email: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required])),
      reEnterPassword: new FormControl(null, Validators.compose([Validators.required])),
    });
  }

  closeResetPassword = () => {
    //this.modalRef.close();
  }

  resetPassword = () => {
    if(this.passwordResetForm.valid){
      this.authService.resetPassword(this.passwordResetForm.value).subscribe(res =>{
        if(res){
          this.toastrService.success("Password Reset Successfull.","Success");
          this.redirectToLogin();
        }
        else{
          this.toastrService.error("Password Reset was Unsuccessfull.","Rest Failed");
        }
      });
    }
  }

  redirectToLogin = () => {

  }

}
