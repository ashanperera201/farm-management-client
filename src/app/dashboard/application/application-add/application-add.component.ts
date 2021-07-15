import { ApplicationModel } from './../../../shared/models/application-model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApplicationsService } from 'src/app/shared/services/applications.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-application-add',
  templateUrl: './application-add.component.html',
  styleUrls: ['./application-add.component.scss']
})
export class ApplicationAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() userId: any;
  @Output() feedAfterSave: EventEmitter<any> = new EventEmitter<any>();
  addApplicationForm!: FormGroup;
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Application';
  feedBrandList: any[] = [];
  existingData = new ApplicationModel();
  
  constructor(private applicationService : ApplicationsService,
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
      this.fetchApplicationData();
    }
  }

  fetchApplicationData = () => {

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

  closeModal = () => {
    this.activeModal.close();
  }
}
