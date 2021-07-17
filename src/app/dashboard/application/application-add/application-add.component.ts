import { ApplicationModel } from './../../../shared/models/application-model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApplicationsService } from '../../../shared/services/applications.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-application-add',
  templateUrl: './application-add.component.html',
  styleUrls: ['./application-add.component.scss']
})
export class ApplicationAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() existingApplication: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();
  addApplicationForm!: FormGroup;
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Application';
  feedBrandList: any[] = [];
  existingData = new ApplicationModel();
  
  constructor(
    private applicationService : ApplicationsService,
    private toastrService:ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddApplicationForm();
    this.configValues();
  }
  
  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Application";
      this.addApplicationForm.patchValue(this.existingApplication);
    }
  }

  initAddApplicationForm = () => {
    this.addApplicationForm = new FormGroup({
      applicationType : new FormControl(null,Validators.compose([Validators.required])),
      applicantName : new FormControl(null,Validators.compose([Validators.required])),
      unit : new FormControl(null),
      costPerUnit : new FormControl(null)
    });
  }

  clearAddApplicationForm = () => {
    this.addApplicationForm.reset();
  }

  saveApplication = () => {
    if(this.isEditMode){
      if(this.addApplicationForm.valid){
        const application = this.existingApplication;
        application.applicationType = this.addApplicationForm.value.applicationType;
        application.applicantName = this.addApplicationForm.value.applicantName;
        application.unit = this.addApplicationForm.value.unit;
        application.costPerUnit = this.addApplicationForm.value.costPerUnit;
        this.applicationService.updateApplication(application).subscribe(res => {
          if(res){
            this.closeModal();
            this.toastrService.success("Application data updated successfully","Success");
          }
        }, () => {
          this.toastrService.error("Unable to update Application","Error");
        });
      }
    }
    else{
      if(this.addApplicationForm.valid){
        const application = new ApplicationModel();
        application.applicationType = this.addApplicationForm.value.applicationType;
        application.applicantName = this.addApplicationForm.value.applicantName;
        application.unit = this.addApplicationForm.value.unit;
        application.costPerUnit = this.addApplicationForm.value.costPerUnit;
        this.applicationService.saveApplication(application).subscribe(res => {
          if(res && res.result){
            this.closeModal();
            this.toastrService.success("Application saved successfully","Success");
            this.afterSave.emit(res.result);
          }
        }, () => {
          this.toastrService.error("Unable to save Application","Error");
        });
      }
    }
  }

  closeModal = () => {
    this.activeModal.close();
  }
}
