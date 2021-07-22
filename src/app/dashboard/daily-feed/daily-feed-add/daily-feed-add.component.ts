import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DailyFeedModel } from 'src/app/shared/models/daily-feed-model';
import { keyPressDecimals, keyPressNumbers } from '../../../shared/utils';
import { PondService } from './../../../shared/services/pond.service';
import { FarmService } from './../../../shared/services/farm.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { DailyFeedService } from './../../../shared/services/daily-feed.service';

@Component({
  selector: 'app-daily-feed-add',
  templateUrl: './daily-feed-add.component.html',
  styleUrls: ['./daily-feed-add.component.scss']
})
export class DailyFeedAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() existingDailyFeed: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Daily Feed';
  feedBrandList: any[] = [];
  memberList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  existingData = new DailyFeedModel();
  addDailyFeedForm!: FormGroup;
  dailyFeedSubscriptions: Subscription[] = [];
  model: NgbDateStruct;
  //TODO
  calculatedDailyFeed = 25;

  constructor(
    private dailyFeedService : DailyFeedService,
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private parserFormatter: NgbDateParserFormatter) {
      this.model = {
        year: 0,
        month: 0,
        day: 0
      }
    }

  ngOnInit(): void {
    this.initAddDailyFeedForm();
    this.setEditModeValues();
    this.fetchInitialData();
  }

  initAddDailyFeedForm = () => {
    this.addDailyFeedForm = new FormGroup({
      owner: new FormControl(null, Validators.compose([Validators.required])),
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      pond: new FormControl(null, Validators.compose([Validators.required])),
      dailyFeedDate: new FormControl(null, Validators.compose([Validators.required])),
      calculatedDailyFeed: new FormControl(this.calculatedDailyFeed),
      actualNumberOfKilos: new FormControl(null, Validators.compose([Validators.required]))
    });
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

  setEditModeValues = () => {
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
  }

  patchForm = () => {
    if (this.existingDailyFeed) {
      this.addDailyFeedForm.patchValue(this.existingDailyFeed);
    }
  }

  saveDailyFeed = () => {
    if (this.addDailyFeedForm.valid) {
      if (this.isEditMode) {
        const dailyFeed = this.existingData;
        dailyFeed.owner = this.addDailyFeedForm.value.owner;
        dailyFeed.farmer = this.addDailyFeedForm.value.farmer;
        dailyFeed.pond = this.addDailyFeedForm.value.pond;
        dailyFeed.dailyFeedDate = this.parserFormatter.format(this.addDailyFeedForm.value.dailyFeedDate);
        dailyFeed.calculatedDailyFeed = this.addDailyFeedForm.value.calculatedDailyFeed;
        dailyFeed.actualNumberOfKilos = this.addDailyFeedForm.value.actualNumberOfKilos;

        this.dailyFeedService.updateDailyFeed(dailyFeed).subscribe(res => {
          if (res) {
            const dailyFeedData = this.setOtherData(dailyFeed);
            this.afterSave.emit(dailyFeedData);
            this.closeModal();
            this.toastrService.success("Percentage of Feeding data updated successfully", "Success");
          }
          this.blockUI.stop();
        }, () => {
          this.toastrService.error("Unable to update data", "Error");
          this.blockUI.stop();
        });
      }
      else {
        const dailyFeed = new DailyFeedModel();
        dailyFeed.owner = this.addDailyFeedForm.value.owner;
        dailyFeed.farmer = this.addDailyFeedForm.value.farmer;
        dailyFeed.pond = this.addDailyFeedForm.value.pond;
        dailyFeed.dailyFeedDate = this.parserFormatter.format(this.addDailyFeedForm.value.dailyFeedDate);
        dailyFeed.calculatedDailyFeed = this.addDailyFeedForm.value.calculatedDailyFeed;
        dailyFeed.actualNumberOfKilos = this.addDailyFeedForm.value.actualNumberOfKilos;

        this.dailyFeedService.saveDailyFeed(dailyFeed).subscribe(res => {
          if (res && res.result) {
            const dailyFeedData = this.setOtherData(res.result.dailyFeedData);
            this.afterSave.emit(dailyFeedData);
            this.closeModal();
            this.toastrService.success("Data saved successfully", "Success");
          }
          this.blockUI.stop();
        }, () => {
          this.toastrService.error("Unable to save data", "Error");
          this.blockUI.stop();
        });
      }
    }
  }

  setOtherData = (result: any): any => {
    const owner: any = this.memberList.find(x => x._id === result.owner);
    const farm: any = this.farmList.find(x => x._id === result.farmer);
    const pond: any = this.pondList.find(x => x._id === result.pond);
    if (owner || farm) {
      result.owner = owner;
      result.farmer = farm;
      result.pond = pond;
      return result;
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

}
