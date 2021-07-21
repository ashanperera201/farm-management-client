import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { FarmService } from '../../../shared/services/farm.service';
import { keyPressNumbers } from '../../../shared/utils';
import {DailyFeedModel} from '../../../shared/models/daily-feed-model';
import {PondService} from '../../../shared/services/pond.service';
import {switchMap} from 'rxjs/operators';
import * as moment from 'moment';
import {HarvestService} from '../../../shared/services/harvest.service';

@Component({
  selector: 'app-harvest-add',
  templateUrl: './harvest-add.component.html',
  styleUrls: ['./harvest-add.component.scss']
})
export class HarvestAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() existingHarvest: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Harvest';
  feedBrandList: any[] = [];
  memberList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  existingData = new DailyFeedModel();
  harvestForm!: FormGroup;
  dailyFeedSubscriptions: Subscription[] = [];
  harvestTypes = [
    {
      code: 'PARTIAL',
      value: 'Partial'
    },
    {
      code: 'FULL',
      value: 'Full'
    }
  ];

  constructor(
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private harvestService: HarvestService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddDailyFeedForm();
    this.setEditModeValues();
    this.fetchInitialData();
  }

  initAddDailyFeedForm = () => {
    this.harvestForm = new FormGroup({
      clubMemberId: new FormControl(null, Validators.compose([Validators.required])),
      farmId: new FormControl(null, Validators.compose([Validators.required])),
      pondId: new FormControl(null, Validators.compose([Validators.required])),
      harvestDate: new FormControl(moment(new Date).format('YYYY-MM-DD'), Validators.compose([Validators.required])),
      harvestType: new FormControl(null, Validators.compose([Validators.required])),
      harvestQty: new FormControl(null, Validators.compose([Validators.required])),
      harvestAWB: new FormControl(null, Validators.compose([Validators.required])),
      salesPrice: new FormControl(null, Validators.compose([Validators.required]))
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
    }));
    this.blockUI.stop();
  }

  setEditModeValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Harvest";
      this.patchForm();
    }
  }

  patchForm = () => {
    if (this.existingHarvest) {
      this.harvestForm.patchValue(this.existingHarvest);
    }
  }

  saveHarvest = () => {
    console.log(this.harvestForm.value);
    this.blockUI.start('Start processing');
    const request = this.harvestForm.value;

    if(this.isEditMode) {
      request._id = this.existingHarvest._id;
      this.harvestService.updateHarvest(request).subscribe(res => {
        if (res && res.validity) {
          this.afterSave.emit(request);
          this.closeModal();
          this.toastrService.success("Harvest updated successfully", "Success");
        }
        this.blockUI.stop();
      }, error => {
        this.toastrService.error("Error occured", "Error");
        this.blockUI.stop();
      });
    } else {
      this.harvestService.updateHarvest(request).subscribe(res => {
        if (res && res.validity) {
          this.afterSave.emit(request);
          this.closeModal();
          this.toastrService.success("Harvest save successfully", "Success");
        }
        this.blockUI.stop();
      }, error => {
        this.toastrService.error("Error occured", "Error");
        this.blockUI.stop();
      });
    }
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  closeModal = () => {
    this.activeModal.close();
  }

  get numberOfPLs() {
    if (this.harvestForm.get('harvestType')?.value === 'FULL') {
      return 0;
    }
    if (this.harvestForm && this.harvestForm.get('harvestQty')?.value != null && this.harvestForm.get('harvestAWB')?.value != null) {
      return (this.harvestForm.get('harvestQty')?.value / this.harvestForm.get('harvestAWB')?.value).toFixed(2);
    }
    return '';
  }
}
