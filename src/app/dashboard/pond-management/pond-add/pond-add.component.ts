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
  @Input() pondId: any;
  @Output() feedAfterSave: EventEmitter<any> = new EventEmitter<any>();
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Pond';
  feedBrandList: any[] = [];
  existingData = new pondModel();
  addPondForm!: FormGroup;
  farmList!: [];
  ownerList!: [];

  constructor(private pondService : PondService,
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private toastrService:ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddPondForm();
    this.configValues();
    this.fetchOwnersList();
  } 

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Application";
      this.fetchPondData();
    }
  }

  fetchPondData = () => {

  }

  initAddPondForm = () => {
    this.addPondForm = new FormGroup({
      pond : new FormControl(null,Validators.compose([Validators.required])),
      farm : new FormControl(null,Validators.compose([Validators.required])),
      pondNumber : new FormControl(null,Validators.compose([Validators.required])),
      area : new FormControl(null,Validators.compose([Validators.required])),
      grade: new FormControl(null,Validators.compose([Validators.required])),
      cost: new FormControl(null,Validators.compose([Validators.required])),
    });
  }

  clearAddPondFormForm = () => {
    this.addPondForm.reset();
  }

  fetchOwnersList = () => {
    this.clubMemberService.fetchClubMembers().subscribe(res => {
      this.ownerList = res;
    }, error => {
      this.toastrService.error("Unable to load owners","Error");
    });
  }

  fetchFarmsOwnerWise = (ownerId: number) => {
    this.farmService.fetchFarmByOwnerId(ownerId).subscribe(res => {
      if(res){
        this.farmList = res;
      }
    }, error => {
      this.toastrService.error("Unable to load Farms","Error");
    });
  }

  savePond = () => {
    if(this.addPondForm.valid){
      const pond = new pondModel();
      pond.ownerId = this.addPondForm.value.owner;
      pond.farmId = this.addPondForm.value.farm;
      pond.pondNumber = this.addPondForm.value.pondNumber;
      pond.pondArea = this.addPondForm.value.area;
      pond.pondGrade = this.addPondForm.value.grade;
      pond.fixedCost = this.addPondForm.value.cost;

      this.pondService.savePond(pond).subscribe(res => {
        if(res){
          this.toastrService.success("Pond data saved successfully.","Successfully Saved");
        }
      }, error => {
        this.toastrService.error("Unable to save pond data","Error");
      });
    }
  }

  closeModal = () => {
    this.activeModal.close();
  }

}
