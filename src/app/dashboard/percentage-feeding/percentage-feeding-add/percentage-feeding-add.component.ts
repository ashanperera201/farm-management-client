import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { keyPressNumbers } from '../../../shared/utils';
import { PercentageFeed } from '../../../shared/models/percentage-feed-modal';

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
  existingData = new PercentageFeed();
  addPercentageFeedingForm!: FormGroup;

  constructor(
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddPercentageFeedForm();
    this.setEditModeValues();
    this.patchForm();
  }

  initAddPercentageFeedForm = () => {
    this.addPercentageFeedingForm = new FormGroup({
      clubMember: new FormControl(null, Validators.compose([Validators.required])),
      farm: new FormControl(null, Validators.compose([Validators.required])),
      pond: new FormControl(null, Validators.compose([Validators.email])),
      averageBodyWeight: new FormControl(null, Validators.compose([Validators.required])),
      feedPercentage: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  setEditModeValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Percentage of Feeding";
    }
  }

  patchForm = () => {
    if (this.existingPercentageFeed) {
      this.addPercentageFeedingForm.patchValue(this.existingPercentageFeed);
    }
  }

  savePercentageFeeding = () => {
    if(this.addPercentageFeedingForm.valid){
      if(this.isEditMode){

      }
      else{
        
      }
    }
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  closeModal = () => {
    this.activeModal.close();
  }


}
