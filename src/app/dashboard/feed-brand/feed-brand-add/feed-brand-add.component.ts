import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { feedBrandModel } from 'src/app/shared/models/feed-brand-model';
import { FeedBrandService } from 'src/app/shared/services/feed-brand.service';

@Component({
  selector: 'app-feed-brand-add',
  templateUrl: './feed-brand-add.component.html',
  styleUrls: ['./feed-brand-add.component.scss']
})
export class FeedBrandAddComponent implements OnInit {
  addFeedBrandForm!: FormGroup;

  constructor(private feedBrandService : FeedBrandService,
    private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.initAddPondForm();
  } 

  initAddPondForm = () => {
    this.addFeedBrandForm = new FormGroup({
      brandName : new FormControl(null,Validators.compose([Validators.required])),
      grade : new FormControl(null,Validators.compose([Validators.required])),
      weight : new FormControl(null,Validators.compose([Validators.required])),
      price : new FormControl(null,Validators.compose([Validators.required])),
    });
  }

  clearAddFeedBrandsForm = () => {
    this.addFeedBrandForm.reset();
  }

  saveFeedBrand = () => {
    if(this.addFeedBrandForm.valid){
      const feedBrand = new feedBrandModel();
      feedBrand.brand = this.addFeedBrandForm.value.brandName;
      feedBrand.grade = this.addFeedBrandForm.value.grade;
      feedBrand.weight = this.addFeedBrandForm.value.weight;
      feedBrand.price = this.addFeedBrandForm.value.price;

      this.feedBrandService.saveFeedBand(feedBrand).subscribe(res => {
        if(res){
          this.toastrService.success("Feed Brand data saved successfully","Successfully Saved")
        }
      }, error => {
        this.toastrService.error("Unable to save feed brand data","Error");
      });
    }
  }

}
