import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { farmModel } from '../../../shared/models/farm-model';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { FarmService } from '../../../shared/services/farm.service';

@Component({
  selector: 'app-farm-add',
  templateUrl: './farm-add.component.html',
  styleUrls: ['./farm-add.component.scss']
})
export class FarmAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() existingFarm: any;
  @Output() feedAfterSave: EventEmitter<any> = new EventEmitter<any>();
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Farm';
  feedBrandList: any[] = [];
  farmList:any[] = [];
  ownerList:any[] = [];
  addFarmForm!: FormGroup;

  constructor(private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddFarmForm();
    this.configValues();
    this.fetchClubMembers();
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Farm";
      this.addFarmForm.patchValue(this.existingFarm);
    }
  }

  initAddFarmForm = () => {
    this.addFarmForm = new FormGroup({
      ownerId: new FormControl(null, Validators.compose([Validators.required])),
      farmName: new FormControl(null, Validators.compose([Validators.required])),
      contactNo: new FormControl(null, Validators.compose([Validators.required])),
      address: new FormControl(null, Validators.compose([Validators.required])),
      pondCount: new FormControl(null, Validators.compose([Validators.required])),
    });
  }

  fetchClubMembers = () => {
    this.clubMemberService.fetchClubMembers().subscribe(res => {
      if (res && res.result) {
        this.ownerList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load owners", "Error");
    });
  }

  saveFarm = () => {
    if (this.isEditMode) {
      const farm = this.existingFarm;
      farm.farmName = this.addFarmForm.value.farmName;
      farm.contactNo = this.addFarmForm.value.contactNo;
      farm.address = this.addFarmForm.value.address;
      farm.pondCount = this.addFarmForm.value.pondCount;
      farm.ownerId = this.addFarmForm.value.ownerId;
      this.farmService.updateFarm(farm).subscribe(res => {
        if (res) {
          this.closeModal();
          this.toastrService.success("Farm updated successfully", "Success");
        }
      }, error => {
        this.toastrService.error("Unable to update Farm", "Error");
      });
    }
    else {
      if (this.addFarmForm.valid) {
        const farm = new farmModel();
        farm.farmName = this.addFarmForm.value.farmName;
        farm.contactNo = this.addFarmForm.value.contactNo;
        farm.address = this.addFarmForm.value.address;
        farm.pondCount = this.addFarmForm.value.pondCount;
        farm.ownerId = this.addFarmForm.value.ownerId;
        this.farmService.saveFarm(farm).subscribe(res => {
          if (res) {
            this.closeModal();
            this.toastrService.success("Farm saved successfully", "Success");
          }
        }, error => {
          this.toastrService.error("Unable to save Farm", "Error");
        });
      }
    }
  }

  clearAddFarmForm = () => {
    this.addFarmForm.reset();
  }

  closeModal = () => {
    this.activeModal.close();
  }
}
