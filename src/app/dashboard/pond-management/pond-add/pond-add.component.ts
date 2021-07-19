import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { FarmService } from '../../../shared/services/farm.service';
import { pondModel } from './../../../shared/models/pond-model';
import { PondService } from '../../../shared/services/pond.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';

@Component({
  selector: 'app-pond-add',
  templateUrl: './pond-add.component.html',
  styleUrls: ['./pond-add.component.scss']
})
export class PondAddComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() existingPond: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Pond';
  feedBrandList: any[] = [];
  addPondForm!: FormGroup;
  farmList: any[] = [];
  ownerList: any[] = [];

  constructor(
    private pondService: PondService,
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddPondForm();
    this.configValues();
    this.fetchInitialData();
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Pond";
    }
  }

  patchExistsRecord = () => {
    const pond = Object.assign({}, this.existingPond);
    pond.owner = this.existingPond.owner._id;
    pond.farmer = this.existingPond.farmer._id;
    this.addPondForm.patchValue(pond);
  }

  initAddPondForm = () => {
    this.addPondForm = new FormGroup({
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      owner: new FormControl(null, Validators.compose([Validators.required])),
      pondNo: new FormControl(null, Validators.compose([Validators.required])),
      areaOfPond: new FormControl(null, Validators.compose([Validators.required])),
      gradeOfPond: new FormControl(null, Validators.compose([Validators.required])),
      fixedCost: new FormControl(null, Validators.compose([Validators.required, Validators.min(0)])),
    });
  }

  clearAddPondFormForm = () => {
    this.addPondForm.reset();
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.clubMemberService.fetchClubMembers().pipe(switchMap(ownerRes => {
      if (ownerRes && ownerRes.result) {
        this.ownerList = ownerRes.result;
      }
      return this.farmService.fetchFarms();
    })).subscribe(farmRes => {
      if (farmRes && farmRes.result) {
        this.farmList = farmRes.result;
        this.patchExistsRecord();
      }
    });
    this.blockUI.stop();
  }

  fetchFarmsOwnerWise = (owner: number) => {
    this.blockUI.start('Fetching Data...');
    this.farmService.fetchFarmByowner(owner).subscribe(res => {
      if (res && res.result) {
        this.farmList = res.result;
      }
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
      this.toastrService.error("Unable to load Farms", "Error");
    });
  }

  savePond = () => {
    this.blockUI.start('Prcessing.....');
    if (this.isEditMode) {
      if (this.addPondForm.valid) {
        const pond = this.existingPond;
        pond.owner = this.addPondForm.value.owner;
        pond.farmer = this.addPondForm.value.farmer;
        pond.pondNo = this.addPondForm.value.pondNo;
        pond.areaOfPond = this.addPondForm.value.areaOfPond;
        pond.gradeOfPond = this.addPondForm.value.gradeOfPond;
        pond.fixedCost = this.addPondForm.value.fixedCost;

        this.pondService.updatePond(pond).subscribe(res => {
          if (res) {
            this.closeModal();
            this.toastrService.success("Pond data updated successfully.", "Successfully Saved");
          }
          this.blockUI.stop();
        }, () => {
          this.blockUI.stop();
          this.toastrService.error("Unable to update pond data", "Error");
        });
      }
    }
    else {
      this.blockUI.start('Prcessing.....');
      if (this.addPondForm.valid) {
        const pond = new pondModel();
        pond.owner = this.addPondForm.value.owner;
        pond.farmer = this.addPondForm.value.farmer;
        pond.pondNo = this.addPondForm.value.pondNo;
        pond.areaOfPond = this.addPondForm.value.areaOfPond;
        pond.gradeOfPond = this.addPondForm.value.gradeOfPond;
        pond.fixedCost = this.addPondForm.value.fixedCost;

        this.pondService.savePond(pond).subscribe(res => {
          if (res && res.result) {
            this.afterSave.emit(res.result);
            this.closeModal();
            this.toastrService.success("Pond data saved successfully.", "Successfully Saved");
          }
          this.blockUI.stop();
        }, () => {
          this.blockUI.stop();
          this.toastrService.error("Unable to save pond data", "Error");
        });
      }
    }
  }

  closeModal = () => {
    this.activeModal.close();
  }

}
