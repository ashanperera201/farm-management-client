import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { FarmService } from '../../../shared/services/farm.service';
import { PondService } from '../../../shared/services/pond.service';
import { keyPressNumbers } from '../../../shared/utils';

@Component({
  selector: 'app-weekly-sampling-add',
  templateUrl: './weekly-sampling-add.component.html',
  styleUrls: ['./weekly-sampling-add.component.scss']
})
export class WeeklySamplingAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() existingStock: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Weekly Sampling';
  pondList: any[] = [];
  addWeeklySamplingForm!: FormGroup;
  farmList: any[] = [];
  ownerList: any[] = [];
  modelSampling: NgbDateStruct;
  constructor(
    private pondService: PondService,
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private parserFormatter: NgbDateParserFormatter
  ) {
    this.modelSampling = {
      year: 0,
      month: 0,
      day: 0
    }
  }

  ngOnInit(): void {
    this.initAddWeeklySamplingForm();
    this.configValues();
    this.fetchOwnersList();
    this.fetchFarmList();
    this.fetchPondList();
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Weekly Sampling";
      // let dateFormat = moment(this.existingStock.dateOfStocking).format('YYYY-MM-DD').split('-')
      // this.model.year = +dateFormat[0];
      // this.model.month = +dateFormat[1];
      // this.model.day = +dateFormat[2];
      // this.existingStock.dateOfStocking = this.model;
      this.addWeeklySamplingForm.patchValue(this.existingStock);
    } else {
      const current = new Date();
      this.modelSampling = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };

      this.addWeeklySamplingForm.get('samplingDate')?.patchValue(this.modelSampling);

    }
  }

  initAddWeeklySamplingForm = () => {
    this.addWeeklySamplingForm = new FormGroup({
      samplingDate: new FormControl(null, Validators.compose([Validators.required])),
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      owner: new FormControl(null, Validators.compose([Validators.required])),
      pondId: new FormControl(null, Validators.compose([Validators.required])),
      dateOfCulture: new FormControl(null, Validators.compose([Validators.required])),
      totalWeight: new FormControl(null, Validators.compose([Validators.required])),
      totalShrimp: new FormControl(null, Validators.compose([Validators.required])),
      averageBodyWeight: new FormControl(null, Validators.compose([Validators.required])),
      previousAwb: new FormControl(null, Validators.compose([Validators.required])),
      gainInWeight: new FormControl(null, Validators.compose([Validators.required])),
      expectedSurvivalPercentage: new FormControl(null, Validators.compose([Validators.required]))
    });

    this.addWeeklySamplingForm.controls['dateOfCulture'].disable();
    this.addWeeklySamplingForm.controls['averageBodyWeight'].disable();
    this.addWeeklySamplingForm.controls['previousAwb'].disable();
    this.addWeeklySamplingForm.controls['gainInWeight'].disable();
  }

  fetchOwnersList = () => {
    this.clubMemberService.fetchClubMembers().subscribe(res => {
      if (res && res.result) {
        this.ownerList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load owners", "Error");
    });
  }

  fetchFarmList = () => {
    this.farmService.fetchFarms().subscribe(res => {
      if (res && res.result) {
        this.farmList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load Farm", "Error");
    });
  }

  fetchPondList = () => {
    this.pondService.fetchPonds().subscribe(res => {
      if (res && res.result) {
        this.pondList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load ponds", "Error");
    });
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  saveWeeklySampling = () => {
  }

  closeModal = () => {
    this.activeModal.close();
  }

}
