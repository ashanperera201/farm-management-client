import { FarmService } from '../../../shared/services/farm.service';
import { pondModel } from './../../../shared/models/pond-model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PondService } from '../../../shared/services/pond.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pond-add',
  templateUrl: './pond-add.component.html',
  styleUrls: ['./pond-add.component.scss']
})
export class PondAddComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() existingPond: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Pond';
  feedBrandList: any[] = [];
  addPondForm!: FormGroup;
  farmList : any[] = [];
  ownerList : any [] = [];

  constructor(
    private pondService : PondService,
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private toastrService:ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddPondForm();
    this.configValues();
    this.fetchOwnersList();
    this.fetchFarmList();
  } 

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Pond";
      this.addPondForm.patchValue(this.existingPond);
    }
  }

  initAddPondForm = () => {
    this.addPondForm = new FormGroup({
      farmId : new FormControl(null,Validators.compose([Validators.required])),
      ownerId : new FormControl(null,Validators.compose([Validators.required])),
      pondCount : new FormControl(null,Validators.compose([Validators.required,Validators.min(0)])),
      areaOfPond : new FormControl(null,Validators.compose([Validators.required,Validators.min(0)])),
      gradeOfPond: new FormControl(null,Validators.compose([Validators.required])),
      fixedCost: new FormControl(null,Validators.compose([Validators.required,Validators.min(0)])),
    });
  }

  clearAddPondFormForm = () => {
    this.addPondForm.reset();
  }

  fetchOwnersList = () => {
    this.clubMemberService.fetchClubMembers().subscribe(res => {
      if(res && res.result){
        this.ownerList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load owners","Error");
    });
  }

  fetchFarmList = () => {
    this.farmService.fetchFarms().subscribe(res => {
      if(res && res.result){
        this.farmList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load owners","Error");
    });
  }

  fetchFarmsOwnerWise = (ownerId: number) => {
    this.farmService.fetchFarmByOwnerId(ownerId).subscribe(res => {
      if(res && res.result){
        this.farmList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load Farms","Error");
    });
  }

  savePond = () => {
    if(this.isEditMode){
      if(this.addPondForm.valid){
        const pond = this.existingPond;
        pond.ownerId = this.addPondForm.value.ownerId;
        pond.farmId = this.addPondForm.value.farmId;
        pond.pondCount = this.addPondForm.value.pondCount;
        pond.areaOfPond = this.addPondForm.value.areaOfPond;
        pond.gradeOfPond = this.addPondForm.value.gradeOfPond;
        pond.fixedCost = this.addPondForm.value.fixedCost;
  
        this.pondService.updatePond(pond).subscribe(res => {
          if(res){
            this.closeModal();
            this.toastrService.success("Pond data updated successfully.","Successfully Saved");
          }
        }, () => {
          this.toastrService.error("Unable to update pond data","Error");
        });
      }
    }
    else{
      if(this.addPondForm.valid){
        const pond = new pondModel();
        pond.ownerId = this.addPondForm.value.ownerId;
        pond.farmId = this.addPondForm.value.farmId;
        pond.pondCount = this.addPondForm.value.pondCount;
        pond.areaOfPond = this.addPondForm.value.areaOfPond;
        pond.gradeOfPond = this.addPondForm.value.gradeOfPond;
        pond.fixedCost = this.addPondForm.value.fixedCost;
  
        this.pondService.savePond(pond).subscribe(res => {
          if(res && res.result){
            this.afterSave.emit(res.result);
            this.closeModal();
            this.toastrService.success("Pond data saved successfully.","Successfully Saved");
          }
        }, () => {
          this.toastrService.error("Unable to save pond data","Error");
        });
      }
    }
  }

  closeModal = () => {
    this.activeModal.close();
  }

}
