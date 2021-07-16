import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { feedBrandModel } from '../../../shared/models/feed-brand-model';
import { FeedBrandService } from '../../../shared/services/feed-brand.service';

@Component({
  selector: 'app-feed-brand-add',
  templateUrl: './feed-brand-add.component.html',
  styleUrls: ['./feed-brand-add.component.scss']
})
export class FeedBrandAddComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() existingFeedBrand: any;
  @Output() feedAfterSave: EventEmitter<any> = new EventEmitter<any>();
  addFeedBrandForm!: FormGroup;
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Feed Brand';
  feedBrandList: any[] = [];
  existingData = new feedBrandModel();

  constructor(private feedBrandService : FeedBrandService,
    private toastrService:ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddFeedBrandForm();
    this.configValues();
  } 

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Feed Brand";
      this.addFeedBrandForm.patchValue(this.existingFeedBrand);
    }
  }



  initAddFeedBrandForm = () => {
    this.addFeedBrandForm = new FormGroup({
      brandName : new FormControl(null,Validators.compose([Validators.required])),
      grades : new FormControl(null,Validators.compose([Validators.required])),
      shrimpWeight : new FormControl(null,Validators.compose([Validators.required])),
      price : new FormControl(null,Validators.compose([Validators.required])),
    });
  }

  clearAddFeedBrandsForm = () => {
    this.addFeedBrandForm.reset();
  }

  saveFeedBrand = () => {
    if(this.isEditMode){
      if(this.addFeedBrandForm.valid){
        const feedBrand = this.existingFeedBrand;
        feedBrand.brandName = this.addFeedBrandForm.value.brandName;
        feedBrand.grades = this.addFeedBrandForm.value.grades;
        feedBrand.shrimpWeight = this.addFeedBrandForm.value.shrimpWeight;
        feedBrand.price = this.addFeedBrandForm.value.price;
  
        this.feedBrandService.updateFeedBand(feedBrand).subscribe(res => {
          if(res){
            this.closeModal();
            this.feedAfterSave.emit(res);
            this.toastrService.success("Feed Brand data updated successfully","Successfully Saved");
          }
        }, error => {
          this.toastrService.error("Unable to update Feed Brand data","Error");
        });
      }
    }
    else{
      if(this.addFeedBrandForm.valid){
        const feedBrand = new feedBrandModel();
        feedBrand.brandName = this.addFeedBrandForm.value.brandName;
        feedBrand.grades = this.addFeedBrandForm.value.grades;
        feedBrand.shrimpWeight = this.addFeedBrandForm.value.shrimpWeight;
        feedBrand.price = this.addFeedBrandForm.value.price;
  
        this.feedBrandService.saveFeedBand(feedBrand).subscribe(res => {
          if(res){
            this.closeModal();
            this.feedAfterSave.emit(res);
            this.toastrService.success("Feed Brand data saved successfully","Successfully Saved");
          }
        }, error => {
          this.toastrService.error("Unable to save Feed Brand data","Error");
        });
      }
    }
  }

  closeModal = () => {
    this.activeModal.close();
  }

}
