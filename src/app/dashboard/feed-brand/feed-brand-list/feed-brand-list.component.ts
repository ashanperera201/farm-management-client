import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FeedBrandService } from '../../../shared/services/feed-brand.service';
import { FeedBrandAddComponent } from '../feed-brand-add/feed-brand-add.component';

@Component({
  selector: 'app-feed-brand-list',
  templateUrl: './feed-brand-list.component.html',
  styleUrls: ['./feed-brand-list.component.scss']
})
export class FeedBrandListComponent implements OnInit {

  feedBrandList : any[] = [];
  feedBrandIdList : any[] = [];

  constructor(private feedbandService: FeedBrandService,
    private toastrService: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetchFeedBrandsList();
  }

  fetchFeedBrandsList = () => {
    this.feedbandService.fetchFeedBands().subscribe(res =>{
      if(res && res.result){
        this.feedBrandList = res.result;
      }
    }, error => {
      this.toastrService.error("Failed to load Feed Brands","Error");
    });
  }

  addNewFeedBrand = () => {
    const addFeedBrandModal = this.modalService.open(FeedBrandAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
  }

  updateFeedBrand = (feedBrand: any) => {
    const addFeedBrandModal = this.modalService.open(FeedBrandAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addFeedBrandModal.componentInstance.existingFeedBrand = feedBrand;
    addFeedBrandModal.componentInstance.isEditMode = true;
    addFeedBrandModal.componentInstance.afterSave = this.feedBandAfterSave();
  }

  feedBandAfterSave = () => {

  }

  deleteFeedBrand = (feedBrandId: any) => {
    this.feedBrandList.push(feedBrandId);
    this.feedbandService.deleteFeedBands(this.feedBrandList).subscribe(res => {
      if(res){
        this.toastrService.success("Feed Brand deleted","Success");
        this.feedBrandList = [];
        this.fetchFeedBrandsList();
      }
    }, error => {
      this.toastrService.error("Unable to delete Feed Brand","Error");
    });
  }

  exportFeedBrandList = (type: any) => {
    if (type == ExportTypes.CSV) {

    }
    else {

    }
  }

  importFeedBands = () => {
    
  }

}
