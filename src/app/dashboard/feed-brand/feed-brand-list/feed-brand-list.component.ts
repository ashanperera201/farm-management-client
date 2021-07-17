import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FeedBrandService } from '../../../shared/services/feed-brand.service';
import { FeedBrandAddComponent } from '../feed-brand-add/feed-brand-add.component';
import { FileService } from '../../../shared/services/file.service';
import * as moment from 'moment';

@Component({
  selector: 'app-feed-brand-list',
  templateUrl: './feed-brand-list.component.html',
  styleUrls: ['./feed-brand-list.component.scss']
})
export class FeedBrandListComponent implements OnInit {

  feedBrandList: any[] = [];
  feedBrandIdList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;

  constructor(
    private feedbandService: FeedBrandService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchFeedBrandsList();
  }

  fetchFeedBrandsList = () => {
    this.feedbandService.fetchFeedBands().subscribe(res => {
      if (res && res.result) {
        this.feedBrandList = res.result;
      }
    }, () => {
      this.toastrService.error("Failed to load Feed Brands", "Error");
    });
  }

  addNewFeedBrand = () => {
    const addFeedBrandModal = this.modalService.open(FeedBrandAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    if (addFeedBrandModal.componentInstance.afterSave) {
      addFeedBrandModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res && res.feedBrand) {
          this.feedBrandList.unshift(res.feedBrand);
        }
      })
    }
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
  }

  deleteFeedBrand = (feedBrandId: any) => {
    const feedBrandIds = JSON.stringify([].concat(feedBrandId));
    let form = new FormData();
    form.append("feedBrandIds", feedBrandIds);

    this.feedbandService.deleteFeedBands(form).subscribe(res => {
      if (res && this.feedBrandList.length > 0) {
        let deletedIndex =  this.feedBrandList.indexOf(this.feedBrandList.filter(a=> a._id == feedBrandId)[0]);
        this.feedBrandList.splice(deletedIndex , 1);
        this.toastrService.success("Feed Brand deleted", "Success");
      }
    }, () => {
      this.toastrService.error("Unable to delete Feed Brand", "Error");
    });
  }

  exportFeedBrandList = (type: any) => {
    if (type === ExportTypes.CSV) {
      const csvData: any[] = this.feedBrandList.map(x => {
        return {
          'Brand Name': x.brandName,
          'Client Tenent': x.clientTenentId,
          'Country Code': x.countryCode,
          'Created By': x.createdBy,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
          'Grades': x.grades,
          'Price': x.price,
          'Shrimp Weight': x.shrimpWeight
        }
      });
      this.fileService.exportAsExcelFile(csvData, "feed_brands");
    }
    else {
      const pdfData: any[] = this.feedBrandList.map(x => {
        return {
          'Brand Name': x.brandName,
          'Client Tenent': x.clientTenentId,
          'Country Code': x.countryCode,
          'Created By': x.createdBy,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
          'Grades': x.grades,
          'Price': x.price,
          'Shrimp Weight': x.shrimpWeight
        }
      });
      const headers: any[] = ['Brand Name', 'Client Tenent', 'Country Code', 'Created By', 'Created On', 'Grades', 'Price', 'Shrimp Weight'];
      this.fileService.exportToPDF("Feed Brand Data", headers, pdfData, 'feed_brands');
    }
  }

  importFeedBands = () => {

  }
}
