import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { DailyFeedModel } from 'src/app/shared/models/daily-feed-model';
import { keyPressNumbers } from '../../../shared/utils';

@Component({
  selector: 'app-daily-feed-add',
  templateUrl: './daily-feed-add.component.html',
  styleUrls: ['./daily-feed-add.component.scss']
})
export class DailyFeedAddComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() existingDailyFeed: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Daily Feed';
  feedBrandList: any[] = [];
  existingData = new DailyFeedModel();
  addDailyFeedForm!: FormGroup;

  constructor(
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddDailyFeedForm();
    this.setEditModeValues();
  }

  initAddDailyFeedForm = () => {
    this.addDailyFeedForm = new FormGroup({
      clubMember: new FormControl(null, Validators.compose([Validators.required])),
      farm: new FormControl(null, Validators.compose([Validators.required])),
      pond: new FormControl(null, Validators.compose([Validators.email])),
      calculatedDailyFeed: new FormControl(null, Validators.compose([Validators.required])),
      actualNoOfKillos: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  setEditModeValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Daily Feed";
      this.patchForm();
    }
  }

  patchForm = () => {
    if (this.existingDailyFeed) {
      this.addDailyFeedForm.patchValue(this.existingDailyFeed);
    }
  }

  saveDailyFeed = () => {
    if(this.addDailyFeedForm.valid){
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
