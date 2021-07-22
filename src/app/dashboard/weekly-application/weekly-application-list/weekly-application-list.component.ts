import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppState } from 'src/app/redux';
import { removeWeeklyApplication } from 'src/app/redux/actions/weekly-applications.action';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { ClubMemberService } from 'src/app/shared/services/club-member.service';
import { FarmService } from 'src/app/shared/services/farm.service';
import { FileService } from 'src/app/shared/services/file.service';
import { PondService } from 'src/app/shared/services/pond.service';
import { WeeklyApplicationsService } from 'src/app/shared/services/weekly-applications.service';
import { WeeklyApplicationAddComponent } from '../weekly-application-add/weekly-application-add.component';

@Component({
  selector: 'app-weekly-application-list',
  templateUrl: './weekly-application-list.component.html',
  styleUrls: ['./weekly-application-list.component.scss']
})
export class WeeklyApplicationListComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  weeklyApplicationSubscriptions: Subscription[] = [];
  isAllChecked!: boolean;
  weeklyApplicationList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  memberList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];

  constructor(private weeklyApplicationsService: WeeklyApplicationsService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private store: Store<AppState>,
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private pondService: PondService) { }

  ngOnInit(): void {
    this.fetchWeeklyApplication();
    this.fetchInitialData();
  }

  fetchWeeklyApplication = () => {
    this.blockUI.start('Fetching Data......');
    this.weeklyApplicationSubscriptions.push(this.weeklyApplicationsService.getAllWeeklyApplication().subscribe(res => {
      if (res && res.result) {
        this.weeklyApplicationList = res.result;
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Failed to load Data", "Error");
      this.blockUI.stop();
    }));
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.weeklyApplicationSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
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

  addNewWeeklyApplication = () => {
    const addWeeklyApplicationModal = this.modalService.open(WeeklyApplicationAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addWeeklyApplicationModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res && res.result) {
        this.weeklyApplicationList.unshift(res.result);
      }
    });
  }

  updateWeeklyApplication = (weeklyApplication: any) => {
    const updateWeeklyApplicationModal = this.modalService.open(WeeklyApplicationAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    updateWeeklyApplicationModal.componentInstance.existingWeeklyApplication = weeklyApplication;
    updateWeeklyApplicationModal.componentInstance.isEditMode = true;
    if (updateWeeklyApplicationModal.componentInstance.afterSave) {
      updateWeeklyApplicationModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
          const index = this.weeklyApplicationList.findIndex((up: any) => up._id === res._id);
          this.weeklyApplicationList[index].owner = res.owner;
          this.weeklyApplicationList[index].farmer = res.farmer;
          this.weeklyApplicationList[index].pondNo = res.pondNo;
        }
      });
    }
  }


  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const pfIds: string[] = (this.weeklyApplicationList.filter(x => x.isChecked === true)).map(x => x._id);
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

  proceedDelete = (weeklyApplicationIds: string[]) => {
    let form = new FormData();
    form.append("weeklyApplicationIds", JSON.stringify(weeklyApplicationIds));

    this.weeklyApplicationSubscriptions.push(this.weeklyApplicationsService.deleteWeeklyApplication(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        weeklyApplicationIds.forEach(e => { const index: number = this.weeklyApplicationList.findIndex((up: any) => up._id === e); this.weeklyApplicationList.splice(index, 1); });
        this.store.dispatch(removeWeeklyApplication(weeklyApplicationIds));
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
      this.weeklyApplicationList = this.weeklyApplicationList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.weeklyApplicationList = this.weeklyApplicationList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.weeklyApplicationList[index]['isChecked'] = !this.weeklyApplicationList[index]['isChecked'];
  }

  exportWeeklyApplicationsList = (type: any) => {
    const dataSet: any[] = this.weeklyApplicationList.map(x => {
      return {
        'Farm': `${x.farmer.farmName}`,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD')
      }
    });

    if (type === ExportTypes.CSV) {
      this.fileService.exportAsExcelFile(dataSet, "Ponds_Data");
    }
    else {
      const headers: any[] = ['Farm', 'Created On'];
      this.fileService.exportToPDF("Weekly Applications Data", headers, dataSet, 'Weekly_Applications_Data');
    }
  }

  importWeeklySampling = () => {

  }

}