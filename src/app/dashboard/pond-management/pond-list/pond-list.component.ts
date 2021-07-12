import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { PondService } from 'src/app/shared/services/pond.service';

@Component({
  selector: 'app-pond-list',
  templateUrl: './pond-list.component.html',
  styleUrls: ['./pond-list.component.scss']
})
export class PondListComponent implements OnInit {

  constructor(private pondService : PondService,
    private toastrService:ToastrService,) { }

 ngOnInit(): void {
   this.fetchPondsList();
 }

 fetchPondsList = () => {

 }

 addPonds = () => {

 }

 importPonds = () => {

 }

 updateRecord = () =>{

 }

 exportPondData = (type: any) => {
   if(type == ExportTypes.CSV){

   }
   else{

   }
 }

 deletePonds = () => {

 }

}
