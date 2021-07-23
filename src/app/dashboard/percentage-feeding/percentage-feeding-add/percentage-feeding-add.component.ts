import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { keyPressDecimals, keyPressNumbers } from '../../../shared/utils';
import { PercentageFeedModel } from '../../../shared/models/percentage-feed-modal';
import { PercentageFeedingService } from '../../../shared/services/percentage-feeding.service';
import { PondService } from './../../../shared/services/pond.service';
import { FarmService } from './../../../shared/services/farm.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';

@Component({
  selector: 'app-percentage-feeding-add',
  templateUrl: './percentage-feeding-add.component.html',
  styleUrls: ['./percentage-feeding-add.component.scss']
})
export class PercentageFeedingAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() existingPercentageFeed: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Percentage of Feeding';
  feedBrandList: any[] = [];
  memberList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  existingPercentageFeeding = new PercentageFeedModel();
  addPercentageFeedingForm!: FormGroup;
  percentageFeedingSubscriptions: Subscription[] = [];

  constructor(
    private percentageFeedingService : PercentageFeedingService,
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddPercentageFeedForm();
    this.fetchInitialData();
  }

  initAddPercentageFeedForm = () => {
    this.addPercentageFeedingForm = new FormGroup({
      owner: new FormControl(null, Validators.compose([Validators.required])),
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      pond: new FormControl(null, Validators.compose([Validators.required])),
      averageBodyWeight: new FormControl(null, Validators.compose([Validators.required])),
      feedPercentage: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.percentageFeedingSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
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
      this.setEditModeValues();
    }, () => {
      this.blockUI.stop();
    }))
    this.blockUI.stop();
  }

  setEditModeValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Percentage of Feeding";
      this.patchForm();
    }
  }

  patchForm = () => {
    if (this.existingPercentageFeed) {
      const percentage = Object.assign({}, this.existingPercentageFeed);
      percentage.owner = this.existingPercentageFeed.owner._id;
      percentage.farmer = this.existingPercentageFeed.farmer._id;
      percentage.pond = this.existingPercentageFeed.pond._id;
      this.addPercentageFeedingForm.patchValue(percentage);
    }
    this.blockUI.stop();
  }

  savePercentageFeeding = () => {
    if (this.addPercentageFeedingForm.valid) {
      if (this.isEditMode) {
        const percentageFeeding = this.existingPercentageFeed;
        percentageFeeding.owner = this.addPercentageFeedingForm.value.owner;
        percentageFeeding.farmer = this.addPercentageFeedingForm.value.farmer;
        percentageFeeding.pond = this.addPercentageFeedingForm.value.pond;
        percentageFeeding.averageBodyWeight = this.addPercentageFeedingForm.value.averageBodyWeight;
        percentageFeeding.feedPercentage = this.addPercentageFeedingForm.value.feedPercentage;

        this.percentageFeedingService.updatePercentageFeeding(percentageFeeding).subscribe(res => {
          if (res) {
            const percentageFeedingData = this.setOtherData(percentageFeeding);
            this.afterSave.emit(percentageFeedingData);
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
        const percentageFeeding = new PercentageFeedModel();
        percentageFeeding.owner = this.addPercentageFeedingForm.value.owner;
        percentageFeeding.farmer = this.addPercentageFeedingForm.value.farmer;
        percentageFeeding.pond = this.addPercentageFeedingForm.value.pond;
        percentageFeeding.averageBodyWeight = this.addPercentageFeedingForm.value.averageBodyWeight;
        percentageFeeding.feedPercentage = this.addPercentageFeedingForm.value.feedPercentage;

        this.percentageFeedingService.savePercentageFeeding(percentageFeeding).subscribe(res => {
          if (res && res.result) {
            const percentageFeedingData = this.setOtherData(res.result.feedingPercentage);
            this.afterSave.emit(percentageFeedingData);
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

  onKeyPressChangesDecimal = (event: any): boolean => {
    return keyPressDecimals(event);
  }

  closeModal = () => {
    this.activeModal.close();
  }


}
