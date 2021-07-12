import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { FeedBrandService } from 'src/app/shared/services/feed-brand.service';

@Component({
  selector: 'app-feed-brand-list',
  templateUrl: './feed-brand-list.component.html',
  styleUrls: ['./feed-brand-list.component.scss']
})
export class FeedBrandListComponent implements OnInit {

  constructor(private pondService : FeedBrandService,
    private toastrService:ToastrService,) { }

 ngOnInit(): void {
   this.fetchFeedBrandsList();
 }

 fetchFeedBrandsList = () => {

 }

 addFeedBrands = () => {

 }

 importFeedBrands = () => {

 }

 updateRecord = () =>{

 }

 exportFeedBrandData = (type: any) => {
   if(type == ExportTypes.CSV){

   }
   else{

   }
 }

 deleteFeedBrands = () => {

 }

}
