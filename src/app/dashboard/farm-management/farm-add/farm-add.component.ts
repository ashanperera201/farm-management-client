import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { farmModel } from 'src/app/shared/models/farm-model';
import { ClubMemberService } from 'src/app/shared/services/club-member.service';
import { FarmService } from 'src/app/shared/services/farm.service';

@Component({
  selector: 'app-farm-add',
  templateUrl: './farm-add.component.html',
  styleUrls: ['./farm-add.component.scss']
})
export class FarmAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() farmId: any;
  @Output() feedAfterSave: EventEmitter<any> = new EventEmitter<any>();
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Farm';
  feedBrandList: any[] = [];
  existingData = new farmModel();
  farmList!: [];
  addFarmForm!: FormGroup;

  constructor(private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private toastrService:ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddFarmForm();
    this.configValues();
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Farm";
      this.fetchFarmData();
    }
  }

  fetchFarmData = () => {

  }

  initAddFarmForm= () => {
    this.addFarmForm = new FormGroup({
      owner: new FormControl(null, Validators.compose([Validators.required])),
      farmName: new FormControl(null, Validators.compose([Validators.required])),
      contact: new FormControl(null, Validators.compose([Validators.required])),
      address: new FormControl(null, Validators.compose([Validators.required])),
      ponds: new FormControl(null, Validators.compose([Validators.required])),
      city: new FormControl(null, Validators.compose([Validators.required])),
    });
  }

  fetchClubMembers = () => {
    this.clubMemberService.fetchClubMembers().subscribe(res=> {
      if(res){

      }
    }, error => {
      this.toastrService.error("Unable to load owners","Error");
    });
  }

  saveFarm = () => {
    if(this.addFarmForm.valid){
      const farm = new farmModel();
      this.farmService.saveFarm(farm).subscribe(res => {
        if(res){

        }
      }, error => {
        this.toastrService.error("Unable to save Farm","Error");
      });
    }
  }

  clearAddFarmForm = () => {
    this.addFarmForm.reset();
  }

  closeModal = () => {
    this.activeModal.close();
  }
}
