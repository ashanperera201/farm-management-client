import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FileService } from '../../../shared/services/file.service';
import { DailyFeedAddComponent } from '../daily-feed-add/daily-feed-add.component';

@Component({
  selector: 'app-daily-feed-list',
  templateUrl: './daily-feed-list.component.html',
  styleUrls: ['./daily-feed-list.component.scss']
})
export class DailyFeedListComponent implements OnInit {

  dailyFeedList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;

  @BlockUI() blockUI!: NgBlockUI;

  constructor(
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.fetchDailyFeed();
  }

  fetchDailyFeed = () => {
  }

  addNewDailyFeed = () => {
    const addDailyFeedrModal = this.modalService.open(DailyFeedAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addDailyFeedrModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res && res.percentageFeeding) {
        this.dailyFeedList.unshift(res.percentageFeeding);
      }
    });
  }

  updateDailyFeed = (dailyFeed: any) => {
    const updateDailyFeedrModal = this.modalService.open(DailyFeedAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    updateDailyFeedrModal.componentInstance.existingDailyFeed = dailyFeed;
    updateDailyFeedrModal.componentInstance.isEditMode = true;
  }

  deleteDailyFeed = (percentageFeedingID : any) => {
    
  } 

  exportDailyFeedList = (type: any) => {
    if(type === ExportTypes.CSV){

    }
    else{

    }
  }

  importDailyFeed = () => {

  }

}
