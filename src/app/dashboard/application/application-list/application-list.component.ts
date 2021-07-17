import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from '../../../shared/enums/export-type';
import { ApplicationsService } from '../../../../app/shared/services/applications.service';
import { ApplicationAddComponent } from '../application-add/application-add.component';
import { FileService } from '../../../shared/services/file.service';
import * as moment from 'moment';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {
  
  applicationList : any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  
  constructor(
    private applicationService : ApplicationsService,
    private toastrService:ToastrService,
    private modalService: NgbModal,
    private fileService: FileService) { }

 ngOnInit(): void {
  this.fetchApplicationsList();
}

fetchApplicationsList = () => {
  this.applicationService.fetchApplications().subscribe(res=> {
    if(res && res.result){
      this.applicationList = res.result;
    }
  }, () => {
    this.toastrService.error("Failed to load Application Data","Error");
  });
}

 addNewApplication = () => {
  const addApplicationModal = this.modalService.open(ApplicationAddComponent, {
    animation: true,
    keyboard: true,
    backdrop: true,
    modalDialogClass: 'modal-md',
  });
  if (addApplicationModal.componentInstance.afterSave) {
    addApplicationModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res && res.applications) {
        this.applicationList.unshift(res.applications);
      }
    })
  }
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
 }

 deleteApplication = (appId: any) => {
  const applicationIds = JSON.stringify([].concat(appId));
  let form = new FormData();
  form.append("applicationIds", applicationIds);

   this.applicationService.deleteApplication(form).subscribe(res => {
     if(res && this.applicationList.length > 0){
      let deletedIndex =  this.applicationList.indexOf(this.applicationList.filter(a=> a._id == appId)[0]);
      this.applicationList.splice(deletedIndex, 1);
      this.toastrService.success("Application deleted.","Success");
     }
   }, () => {
    this.toastrService.error("Unable to delete Application.","Error");
   });
 }

 exportApplicationList = (type: any) => {
  if(type === ExportTypes.CSV){
    const csvData: any[] = this.applicationList.map(x => {
      return {
        'Applicant Name': x.applicantName,
        'Client Tenent': x.clientTenentId,
        'Country Code': x.countryCode,
        'Created By': x.createdBy,
        'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
        'Application Type': x.applicationType,
        'Unit': x.unit,
        'Cost Per Unit': x.costPerUnit
      }
    });
    this.fileService.exportAsExcelFile(csvData, "Applications-file");
  }
  else {
    const pdfData: any[] = this.applicationList.map(x => {
      return {
        'Applicant Name': x.applicantName,
        'Client Tenent': x.clientTenentId,
        'Country Code': x.countryCode,
        'Created By': x.createdBy,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
        'Application Type': x.applicationType,
        'Unit': x.unit,
        'Cost Per Unit': x.costPerUnit
      }
    });
    const headers: any[] = ['Applicant Name', 'Client Tenent', 'Country Code', 'Created By', 'Created On', 'Application Type', 'Unit', 'Cost Per Unit'];
    this.fileService.exportToPDF("Applications", headers, pdfData, 'Applications');
 }
}

 importApplications = () => {
   
 }
}
