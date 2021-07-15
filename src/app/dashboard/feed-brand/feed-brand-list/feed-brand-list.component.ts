import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { FeedBrandService } from 'src/app/shared/services/feed-brand.service';
import { FeedBrandAddComponent } from '../feed-brand-add/feed-brand-add.component';

@Component({
  selector: 'app-feed-brand-list',
  templateUrl: './feed-brand-list.component.html',
  styleUrls: ['./feed-brand-list.component.scss']
})
export class FeedBrandListComponent implements OnInit {

  feedBrandList = [];
  constructor(private feedbandService: FeedBrandService,
    private toastrService: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetchFeedBrandsList();
  }

  fetchFeedBrandsList = () => {
    this.feedbandService.fetchFeedBands().subscribe(res =>{
      if(res){

      }
    }, error => {

    })
  }

  addNewFeedBrand = () => {
    const addFeedBrandModal = this.modalService.open(FeedBrandAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
  }

  updateFeedBrand = (feedBrandId: any) => {
    const addFeedBrandModal = this.modalService.open(FeedBrandAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addFeedBrandModal.componentInstance.roleId = feedBrandId;
    addFeedBrandModal.componentInstance.isEditMode = true;
    addFeedBrandModal.componentInstance.afterSave = this.feedBandAfterSave();
  }

  feedBandAfterSave = () => {

  }

  importFeedBrands = () => {

  }

  deleteFeedBrand = (feedbBrandId: any) => {

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
