import { FarmDetailReportComponent } from './../../reporting/farm-detail-report/farm-detail-report.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DailyFeedModel } from '../../../shared/models/daily-feed-model';
import { keyPressDecimals, keyPressNumbers } from '../../../shared/utils';
import { PondService } from './../../../shared/services/pond.service';
import { FarmService } from './../../../shared/services/farm.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { DailyFeedService } from './../../../shared/services/daily-feed.service';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { addDailyFeed, AppState, updateDailyFeed } from '../../../redux';
import { FeedBrandService } from 'src/app/shared/services/feed-brand.service';
import { CustomAlertComponent } from 'src/app/shared/components/custom-alert/custom-alert.component';

@Component({
  selector: 'app-daily-feed-add',
  templateUrl: './daily-feed-add.component.html',
  styleUrls: ['./daily-feed-add.component.scss']
})
export class DailyFeedAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() existingDailyFeed: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() dailyFeedData: any[] = [];

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Daily Feed';
  ownerList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  feedBrandList: any[] = [];
  existingData = new DailyFeedModel();
  addDailyFeedForm!: FormGroup;
  dailyFeedSubscriptions: Subscription[] = [];
  model: NgbDateStruct;
  initialData: any = {
    farmList: [],
    ownerList: [],
    pondList: []
  }
  //TODO
  calculatedDailyFeed = 25;
  weeks: any[] = [];

  constructor(
    private dailyFeedService : DailyFeedService,
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private parserFormatter: NgbDateParserFormatter,
    private feedbandService: FeedBrandService,
    private store: Store<AppState>,
    private modalService: NgbModal) {
      this.model = {
        year: 0,
        month: 0,
        day: 0
      }
    }

  ngOnInit(): void {
    this.initAddDailyFeedForm();
    this.fetchInitialData();
  }

  initAddDailyFeedForm = () => {
    this.addDailyFeedForm = new FormGroup({
      owner: new FormControl(null, Validators.compose([Validators.required])),
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      pond: new FormControl(null, Validators.compose([Validators.required])),
      // dailyFeedDate: new FormControl(null, Validators.compose([Validators.required])),
      week: new FormControl(null, Validators.compose([Validators.required])),
      // calculatedDailyFeed: new FormControl(this.calculatedDailyFeed),
      feedBrand: new FormControl(null, Validators.compose([Validators.required])),
      actualNumberOfKilos: new FormControl(null, Validators.compose([Validators.required])),
      remark: new FormControl(null)
    });
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.dailyFeedSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.ownerList = ownerRes.result;
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.initialData.pondList = resPonds.result;
      }
      return this.feedbandService.fetchFeedBands()
    })).pipe(switchMap((resFeed: any) => {
      if (resFeed && resFeed.result) {
        this.feedBrandList = resFeed.result;
      }
      return this.farmService.fetchFarms()
    })).subscribe((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.initialData.farmList = farmRes.result;
      }
      this.configValues();
      this.getWeekNumber();
    }, () => {
      this.blockUI.stop();
    }))
    this.blockUI.stop();
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Daily Feed";
      this.patchForm();
    }
    else{
      const current = new Date();
      this.model = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      this.addDailyFeedForm.get('dailyFeedDate')?.patchValue(this.model);
    }
    this.blockUI.stop();
  }

  patchForm = () => {
    let dateFormat = moment(this.existingDailyFeed.dailyFeedDate).format('YYYY-MM-DD').split('-')
    this.model.year = +dateFormat[0];
    this.model.month = +dateFormat[1];
    this.model.day = +dateFormat[2];
    
    if (this.existingDailyFeed) {
      const feed = JSON.parse(JSON.stringify(this.existingDailyFeed));
      feed.owner = this.existingDailyFeed.owner._id;
      feed.farmer = this.existingDailyFeed.farmer._id;
      feed.pond = this.existingDailyFeed.pond._id;
      // feed.dailyFeedDate =  this.model;
      feed.week = this.existingDailyFeed.week;
      // feed.calculatedDailyFeed = this.existingDailyFeed.calculatedDailyFeed;
      feed.feedBrand = this.existingDailyFeed.feedBrand;
      feed.actualNumberOfKilos = this.existingDailyFeed.actualNumberOfKilos;
      feed.remark = this.existingDailyFeed.remark;
      this.addDailyFeedForm.patchValue(feed);
      this.ownerOnChange();
      this.farmOnChange();
      this.addDailyFeedForm.get("farmer")?.patchValue(feed.farmer);
      this.addDailyFeedForm.get("pond")?.patchValue(feed.pond);
    }
    this.blockUI.stop();
  }

  saveDailyFeed = () => {
    if (this.addDailyFeedForm.valid) {
      if (this.isEditMode) {
        const dailyFeed = this.existingData;
        dailyFeed.owner = this.addDailyFeedForm.value.owner;
        dailyFeed.farmer = this.addDailyFeedForm.value.farmer;
        dailyFeed.pond = this.addDailyFeedForm.value.pond;
        // dailyFeed.dailyFeedDate = this.parserFormatter.format(this.addDailyFeedForm.value.dailyFeedDate);
        dailyFeed.week = this.addDailyFeedForm.value.week;
        // dailyFeed.calculatedDailyFeed = this.addDailyFeedForm.value.calculatedDailyFeed;
        dailyFeed.feedBrand = this.addDailyFeedForm.value.feedBrand;
        dailyFeed.actualNumberOfKilos = this.addDailyFeedForm.value.actualNumberOfKilos;
        dailyFeed.remark = this.addDailyFeedForm.value.remark;

        let validateWeek = this.validateWeekNumber();

        if (validateWeek) {
          this.dailyFeedService.updateDailyFeed(dailyFeed).subscribe(res => {
            if (res) {
              const dailyFeedData = this.setOtherData(dailyFeed);
              this.afterSave.emit(dailyFeedData);
              this.closeModal();
              this.store.dispatch(updateDailyFeed(dailyFeed));
              this.toastrService.success("Daily Feed data updated successfully", "Success");
            }
            this.blockUI.stop();
          }, () => {
            this.toastrService.error("Unable to update data", "Error");
            this.blockUI.stop();
          });
        } else {
          this.toastrService.error("Do not allow to update data", "Error");
        }

        
      }

      let customAlertModalRef = this.modalService.open(CustomAlertComponent, {
        animation: true,
        keyboard: true,
        backdrop: true
      });
      customAlertModalRef.componentInstance.title = 'Confirmation';
      customAlertModalRef.componentInstance.message = 'Do you have multiple feed brands for this week ';
      customAlertModalRef.componentInstance.saveButton = 'Yes';
      customAlertModalRef.componentInstance.cancelButton = 'No';

      (customAlertModalRef.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {        
        if (!this.isEditMode) {
          const dailyFeed = new DailyFeedModel();
          dailyFeed.owner = this.addDailyFeedForm.value.owner;
          dailyFeed.farmer = this.addDailyFeedForm.value.farmer;
          dailyFeed.pond = this.addDailyFeedForm.value.pond;
          // dailyFeed.dailyFeedDate = this.parserFormatter.format(this.addDailyFeedForm.value.dailyFeedDate);
          dailyFeed.week = this.addDailyFeedForm.value.week;
          // dailyFeed.calculatedDailyFeed = this.addDailyFeedForm.value.calculatedDailyFeed;
          dailyFeed.feedBrand = this.addDailyFeedForm.value.feedBrand;
          dailyFeed.actualNumberOfKilos = this.addDailyFeedForm.value.actualNumberOfKilos;
          dailyFeed.remark = this.addDailyFeedForm.value.remark;
  
          let validData = this.validateWeekNumber();
          if (validData) {
            this.dailyFeedService.saveDailyFeed(dailyFeed).subscribe(res => {
              if (res && res.result) {
                const dailyFeedData = this.setOtherData(res.result);
                this.afterSave.emit(dailyFeedData);
                this.closeModal();
                this.store.dispatch(addDailyFeed(res.result));
                this.toastrService.success("Data saved successfully", "Success");
              }
              this.blockUI.stop();
            }, () => {
              this.toastrService.error("Unable to save data", "Error");
              this.blockUI.stop();
            });
          } else {
            this.toastrService.error("Do not allow to save data", "Error");
          }
          
        }
        customAlertModalRef.close();
      });
  
      (customAlertModalRef.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
        if (!this.isEditMode) {
          const dailyFeed = new DailyFeedModel();
          dailyFeed.owner = this.addDailyFeedForm.value.owner;
          dailyFeed.farmer = this.addDailyFeedForm.value.farmer;
          dailyFeed.pond = this.addDailyFeedForm.value.pond;
          // dailyFeed.dailyFeedDate = this.parserFormatter.format(this.addDailyFeedForm.value.dailyFeedDate);
          dailyFeed.week = this.addDailyFeedForm.value.week;
          // dailyFeed.calculatedDailyFeed = this.addDailyFeedForm.value.calculatedDailyFeed;
          dailyFeed.feedBrand = this.addDailyFeedForm.value.feedBrand;
          dailyFeed.actualNumberOfKilos = this.addDailyFeedForm.value.actualNumberOfKilos;
          dailyFeed.remark = this.addDailyFeedForm.value.remark;
  
          let validData = this.validateWeekNumber();
          if (validData) {
            this.dailyFeedService.saveDailyFeed(dailyFeed).subscribe(res => {
              if (res && res.result) {
                const dailyFeedData = this.setOtherData(res.result);
                this.afterSave.emit(dailyFeedData);
                //this.closeModal();
                this.store.dispatch(addDailyFeed(res.result));
                this.toastrService.success("Data saved successfully", "Success");
                this.addDailyFeedForm.get("feedBrand")?.setValue('');
                this.addDailyFeedForm.get("actualNumberOfKilos")?.setValue('');
                this.addDailyFeedForm.get("remark")?.setValue('');
                this.bindTempData();
              }
              this.blockUI.stop();
            }, () => {
              this.toastrService.error("Unable to save data", "Error");
              this.blockUI.stop();
            });
          } else {
            this.toastrService.error("Do not allow to save data", "Error");
          }
        }

        customAlertModalRef.close();
      });
      
    }
  }

  setOtherData = (result: any): any => {
    const owner: any = this.ownerList.find(x => x._id === result.owner);
    const farm: any = this.farmList.find(x => x._id === result.farmer);
    const pond: any = this.pondList.find(x => x._id === result.pond);
    if (owner || farm) {
      result.owner = owner;
      result.farmer = farm;
      result.pond = pond;
      return result;
    }
  }

  ownerOnChange = () => {
    const owner = this.addDailyFeedForm.get("owner")?.value;
    if (owner) {
      const filteredFarmList = this.initialData.farmList.filter((x: any) => x.owner && x.owner._id === owner);
      if (filteredFarmList && filteredFarmList.length > 0) {
        this.farmList = filteredFarmList;
      } else {
        this.farmList = [];
      }
    }
  }

  farmOnChange = () => {
    const farmer = this.addDailyFeedForm.get("farmer")?.value;
    if (farmer) {
      const filteredPondList = this.initialData.pondList.filter((x: any) => x.farmer && x.farmer._id === farmer);
      if (filteredPondList && filteredPondList.length > 0) {
        this.pondList = filteredPondList;
      } else {
        this.pondList = [];
      }
    }
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  closeModal = () => {
    this.activeModal.close();
  }

  onKeyPressChangesDecimal = (event: any): boolean => {
    return keyPressDecimals(event);
  }

  getWeekNumber = () => {
    for (let i = 1; i <= 25; i++) {
      this.weeks.push(
        {
          value: 'week' + i,
          description: 'Week ' + i
        }
      );
    }
  }

  bindTempData = () => {
    this.addDailyFeedForm.get("owner")?.setValue(this.addDailyFeedForm.value.owner);
    this.addDailyFeedForm.get("farmer")?.setValue(this.addDailyFeedForm.value.farmer);
    this.addDailyFeedForm.get("pond")?.setValue(this.addDailyFeedForm.value.pond);
    this.addDailyFeedForm.get("week")?.setValue(this.addDailyFeedForm.value.week);
  }

  validateWeekNumber = () => {
    let owner = this.addDailyFeedForm.value.owner;
    let farmer = this.addDailyFeedForm.value.farmer;
    let pond = this.addDailyFeedForm.value.pond;
    let week = this.addDailyFeedForm.value.week;
    let valid = true;
    let returnData = null;

    if (this.dailyFeedData.length > 0) {
      returnData = this.dailyFeedData.filter(data => 
        data.owner._id == owner && data.farmer._id == farmer && data.pond._id == pond && data.week == week        
      );

      if (returnData.length > 0) {
        valid = false;
      } else {
        valid = true;
      }
    } else {
      valid = true;
    }

    return valid;

  }

}
