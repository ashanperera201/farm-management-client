import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth-service.service';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  passwordResetForm! : FormGroup;
  
  constructor(private toastrService:ToastrService,
   private authService : AuthService ) { }

  ngOnInit(): void {
    this.initPasswordForm();
  }

  initPasswordForm= () => {
    this.passwordResetForm = new FormGroup({
      userName: new FormControl(null, Validators.compose([Validators.required])),
      newPassword: new FormControl(null, Validators.compose([Validators.required])),
      rePassword: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  requestPasswordChange = () => {
    this.authService.registerUser(this.passwordResetForm.value).subscribe(res =>{
      if(res){
        
      }
    });
  }

}
