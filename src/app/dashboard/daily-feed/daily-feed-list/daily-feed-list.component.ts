import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FileService } from '../../../shared/services/file.service';
import { DailyFeedAddComponent } from '../daily-feed-add/daily-feed-add.component';
import { PondService } from './../../../shared/services/pond.service';
import { FarmService } from './../../../shared/services/farm.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { DailyFeedService } from '../../../shared/services/daily-feed.service';

@Component({
  selector: 'app-daily-feed-list',
  templateUrl: './daily-feed-list.component.html',
  styleUrls: ['./daily-feed-list.component.scss']
})
export class DailyFeedListComponent implements OnInit {

  isAllChecked! : boolean;
  dailyFeedList: any[] = [];
  memberList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  dailyFeedSubscriptions: Subscription[] = [];

  @BlockUI() blockUI!: NgBlockUI;

  constructor(
    private dailyFeedService : DailyFeedService,
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.fetchDailyFeed();
    this.fetchInitialData();
  }

  fetchDailyFeed = () => {
    this.blockUI.start('Fetching Daily Feed......');
    this.dailyFeedSubscriptions.push(this.dailyFeedService.fetchDailyFeeds().subscribe(res=> {
      if(res && res.result){
        this.dailyFeedList = res.result;
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Failed to load Data","Error");
      this.blockUI.stop();
    }));
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.dailyFeedSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.memberList = ownerRes.result;
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.pondList = resPonds.result;
      }
      return this.farmService.fetchFarms()
    })).subscribe((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.farmList = farmRes.result;
      }
    }))
    this.blockUI.stop();
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

  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const pfIds: string[] = (this.dailyFeedList.filter(x => x.isChecked === true)).map(x => x._id);
    if (pfIds && pfIds.length > 0) {
      this.proceedDelete(pfIds);
    } else {
      this.toastrService.error("Please select items to delete.", "Error");
      this.blockUI.stop();
    }
  }
  
  deleteRecord = (pfId: any) => {
    this.blockUI.start('Deleting....');
    this.proceedDelete([].concat(pfId));
  }
  
  proceedDelete = (pfIds: string[]) => {
    let form = new FormData();
    form.append("dailyFeedIds", JSON.stringify(pfIds));
  
    this.dailyFeedSubscriptions.push(this.dailyFeedService.deleteDailyFeed(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        pfIds.forEach(e => { const index: number = this.dailyFeedList.findIndex((up: any) => up._id === e); this.dailyFeedList.splice(index, 1); });
        this.toastrService.success('Successfully deleted.', 'Success');
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    }));
  }
  
  onSelectionChange = () => {
    if (this.isAllChecked) {
      this.dailyFeedList = this.dailyFeedList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.dailyFeedList = this.dailyFeedList.map(up => { return { ...up, isChecked: false }; });
    }
  }
  
  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.dailyFeedList[index]['isChecked'] = !this.dailyFeedList[index]['isChecked'];
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
