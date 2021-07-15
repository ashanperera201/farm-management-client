import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { ApplicationsService } from 'src/app/shared/services/applications.service';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {
  
 applicationList = [];
 
  constructor(private applicationService : ApplicationsService,
    private toastrService:ToastrService,) { }

 ngOnInit(): void {
  this.fetchApplicationsList();
}

fetchApplicationsList = () => {

}

 addNewApplication = () => {

 }

 updateApplication = (appId: any) => {

 }

 deleteApplication = (appId: any) => {
   
 }

 exportApplicationList = (type: any) => {

 }

 importApplications = () => {
   
 }
}
