import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { ExportTypes } from '../../../shared/enums/export-type';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { FarmService } from '../../../shared/services/farm.service';
import { PondService } from '../../../shared/services/pond.service';
import { FileService } from '../../../shared/services/file.service';
import { FeedChartService } from '../../../shared/services/feed-chart.service';

@Component({
  selector: 'app-feed-chart-list',
  templateUrl: './feed-chart-list.component.html',
  styleUrls: ['./feed-chart-list.component.scss']
})
export class FeedChartListComponent implements OnInit {

  isAllChecked! : boolean;
  feedChartList: any[] = [];
  memberList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  feedChartSubscription: Subscription[] = [];

  @BlockUI() blockUI!: NgBlockUI;

  constructor(
    private feedChartService : FeedChartService,
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private toastrService: ToastrService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.fetchDailyFeed();
    this.fetchInitialData();
  }

  fetchDailyFeed = () => {
    this.blockUI.start('Fetching Daily Feed......');
    this.feedChartSubscription.push(this.feedChartService.fetchFeedCharts().subscribe(res=> {
      if(res && res.result){
        this.feedChartList = res.result;
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Failed to load Data","Error");
      this.blockUI.stop();
    }));
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.feedChartSubscription.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
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

  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const pfIds: string[] = (this.feedChartList.filter(x => x.isChecked === true)).map(x => x._id);
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
  
    this.feedChartSubscription.push(this.feedChartService.deleteFeedCharts(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        pfIds.forEach(e => { const index: number = this.feedChartList.findIndex((up: any) => up._id === e); this.feedChartList.splice(index, 1); });
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
      this.feedChartList = this.feedChartList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.feedChartList = this.feedChartList.map(up => { return { ...up, isChecked: false }; });
    }
  }
  
  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.feedChartList[index]['isChecked'] = !this.feedChartList[index]['isChecked'];
  }

  exportFeedChartList = (type: any) => {
    /////////////TO DO
    if (type === ExportTypes.CSV) {
      this.blockUI.start('Exporting Excel...');
      const csvData: any[] = this.feedChartList.map(x => {
        return {
          'Owner': x.owner,
          'Farm': x.farmer,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
        }
      });
      this.fileService.exportAsExcelFile(csvData, "Ponds_Data");
      this.blockUI.stop();
    }
    else {
      this.blockUI.start('Exporting Pdf...');
      const pdfData: any[] = this.feedChartList.map(x => {
        return {
          'Owner': x.owner,
          'Farm': x.farmer,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
        }
      });
      const headers: any[] = ['Owner', 'Farm', 'Created On', 'Pond Count','Area Of Pond', 'Grade of Pond','Fixed Cost' ];
      this.fileService.exportToPDF("Ponds Data", headers, pdfData, 'Pond_Data');
      this.blockUI.stop();
    }
  }

}