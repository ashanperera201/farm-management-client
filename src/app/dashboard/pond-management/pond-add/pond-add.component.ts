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
      farmer : new FormControl(null,Validators.compose([Validators.required])),
      owner : new FormControl(null,Validators.compose([Validators.required])),
      pondNo : new FormControl(null,Validators.compose([Validators.required])),
      areaOfPond : new FormControl(null,Validators.compose([Validators.required])),
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

  fetchFarmsOwnerWise = (owner: number) => {
    this.farmService.fetchFarmByowner(owner).subscribe(res => {
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
        pond.owner = this.addPondForm.value.owner;
        pond.farmer = this.addPondForm.value.farmer;
        pond.pondNo = this.addPondForm.value.pondNo;
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
        pond.owner = this.addPondForm.value.owner;
        pond.farmer = this.addPondForm.value.farmer;
        pond.pondNo = this.addPondForm.value.pondNo;
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
