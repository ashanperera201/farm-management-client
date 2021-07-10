import { ApplicationModel } from './../../../shared/models/application-model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApplicationsService } from 'src/app/shared/services/applications.service';

@Component({
  selector: 'app-application-add',
  templateUrl: './application-add.component.html',
  styleUrls: ['./application-add.component.scss']
})
export class ApplicationAddComponent implements OnInit {

  addApplicationForm!: FormGroup;

  constructor(private applicationService : ApplicationsService,
    private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.initAddApplicationForm();
  } 

  initAddApplicationForm = () => {
    this.addApplicationForm = new FormGroup({
      type : new FormControl(null,Validators.compose([Validators.required])),
      name : new FormControl(null,Validators.compose([Validators.required])),
      unit : new FormControl(null),
      cost : new FormControl(null)
    });
  }

  clearAddApplicationForm = () => {
    this.addApplicationForm.reset();
  }

  saveApplication = () => {
    if(this.addApplicationForm.valid){
      const application = new ApplicationModel();
      this.applicationService.saveApplication(application).subscribe(res => {
        if(res){
          this.toastrService.success("Application saved successfully","Success")
        }
      }, error => {
        this.toastrService.error("Unable to save Application","Error")
      })
    }
  }
}
