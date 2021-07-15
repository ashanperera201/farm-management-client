import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { ApplicationsService } from 'src/app/shared/services/applications.service';
import { ApplicationAddComponent } from '../application-add/application-add.component';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {
  
 applicationList = [];
 
  constructor(private applicationService : ApplicationsService,
    private toastrService:ToastrService,
    private modalService: NgbModal) { }

 ngOnInit(): void {
  this.fetchApplicationsList();
}

fetchApplicationsList = () => {

}

 addNewApplication = () => {
  const addFeedBrandModal = this.modalService.open(ApplicationAddComponent, {
    animation: true,
    keyboard: true,
    backdrop: true,
    modalDialogClass: 'modal-md',
  });
 }

 updateApplication = (appId: any) => {
  const addFeedBrandModal = this.modalService.open(ApplicationAddComponent, {
    animation: true,
    keyboard: true,
    backdrop: true,
    modalDialogClass: 'modal-md',
  });
  addFeedBrandModal.componentInstance.roleId = appId;
  addFeedBrandModal.componentInstance.isEditMode = true;
  addFeedBrandModal.componentInstance.afterSave = this.applicationAfterSave();
 }

 applicationAfterSave = () => {
   
 }

 deleteApplication = (appId: any) => {
   
 }

 exportApplicationList = (type: any) => {

 }

 importApplications = () => {
   
 }
}
