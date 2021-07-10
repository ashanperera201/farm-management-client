import { pondModel } from './../../../shared/models/pond-model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PondService } from 'src/app/shared/services/pond.service';
import { ClubMemberService } from 'src/app/shared/services/club-member.service';

@Component({
  selector: 'app-pond-add',
  templateUrl: './pond-add.component.html',
  styleUrls: ['./pond-add.component.scss']
})
export class PondAddComponent implements OnInit {
  addPondForm!: FormGroup;

  constructor(private pondService : PondService,
    private clubMemberService : ClubMemberService,
    private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.initAddPondForm();
    this.fetchOwnersList();
  } 

  initAddPondForm = () => {
    this.addPondForm = new FormGroup({
      owner : new FormControl(null,Validators.compose([Validators.required])),
      farm : new FormControl(null,Validators.compose([Validators.required])),
      pondNumber : new FormControl(null,Validators.compose([Validators.required])),
      area : new FormControl(null,Validators.compose([Validators.required])),
      grade: new FormControl(null,Validators.compose([Validators.required])),
      cost: new FormControl(null,Validators.compose([Validators.required])),
    });
  }

  clearDddClubmembersForm = () => {
    this.addPondForm.reset();
  }

  fetchOwnersList = () => {
    this.clubMemberService.fetchClubMembers().subscribe(res => {

    }, error => {
      this.toastrService.error("Unable to load owners","Error");
    });
  }

  fetchFarmsOwnerWise = () => {
    
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
          this.toastrService.success("Ponda data saved successfully.","Successfully Saved");
        }
      }, _error => {
        this.toastrService.error("Unable to save pond data","Error")
      });
    }
  }

}
