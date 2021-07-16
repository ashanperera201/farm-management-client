import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from '../../../shared/enums/export-type';
import { ApplicationsService } from '../../../../app/shared/services/applications.service';
import { ApplicationAddComponent } from '../application-add/application-add.component';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {
  
  applicationList : any[] = [];
  filterParam!: string;
 
  constructor(private applicationService : ApplicationsService,
    private toastrService:ToastrService,
    private modalService: NgbModal) { }

 ngOnInit(): void {
  this.fetchApplicationsList();
}

fetchApplicationsList = () => {
  this.applicationService.fetchApplications().subscribe(res=> {
    if(res && res.result){
      this.applicationList = res.result;
    }
  }, error => {
    this.toastrService.error("Failed to load Application Data","Error");
  });
}

 addNewApplication = () => {
  const addFeedBrandModal = this.modalService.open(ApplicationAddComponent, {
    animation: true,
    keyboard: true,
    backdrop: true,
    modalDialogClass: 'modal-md',
  });
 }

 updateApplication = (application: any) => {
  const addFeedBrandModal = this.modalService.open(ApplicationAddComponent, {
    animation: true,
    keyboard: true,
    backdrop: true,
    modalDialogClass: 'modal-md',
  });
  addFeedBrandModal.componentInstance.existingApplication = application;
  addFeedBrandModal.componentInstance.isEditMode = true;
  addFeedBrandModal.componentInstance.afterSave = this.applicationAfterSave();
 }

 applicationAfterSave = () => {
   
 }

 deleteApplication = (appId: any) => {
   this.applicationService.deleteApplication(appId).subscribe(res => {
     if(res){
      this.toastrService.success("Application deleted.","Success");
      this.fetchApplicationsList();
     }
   }, error => {
    this.toastrService.error("Unable to delete Application.","Error");
   });
 }

 exportApplicationList = (type: any) => {
  if(type = ExportTypes.CSV){

  }
  else{
    
  }
 }

 importApplications = () => {
   
 }
}
