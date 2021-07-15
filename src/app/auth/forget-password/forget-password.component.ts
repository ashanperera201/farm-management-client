import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  passwordResetForm! : FormGroup;

  constructor(private authService : AuthService,
    private toastrService : ToastrService,
    private activeModal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.initPasswordResetForm();
  }

  initPasswordResetForm= () => {
    this.passwordResetForm = new FormGroup({
      email: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      password: new FormControl(null, Validators.compose([Validators.required])),
      reEnterPassword: new FormControl(null, Validators.compose([Validators.required])),
    });
  }

  closeModal = () => {
    this.activeModal.close();
  }
  

  resetPassword = () => {
    if(this.passwordResetForm.valid){
      this.authService.resetPassword(this.passwordResetForm.value).subscribe(res =>{
        if(res){
          this.toastrService.success("Password Reset Successfull.","Success");
          this.redirectToLogin();
        }
      },
      error => {
        this.toastrService.error("Password Reset was Unsuccessfull.","Rest Failed");
      });
    }
  }

  redirectToLogin = () => {

  }

}
