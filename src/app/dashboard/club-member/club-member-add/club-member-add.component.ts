import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { ClubMemberService } from '../../../shared/services/club-member.service';

@Component({
  selector: 'app-club-member-add',
  templateUrl: './club-member-add.component.html',
  styleUrls: ['./club-member-add.component.scss']
})
export class ClubMemberAddComponent implements OnInit {
  addClubmembersForm!: FormGroup;
  constructor(private clubMemberService : ClubMemberService,
    private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.initAddClubMembersForm();
  } 

  initAddClubMembersForm= () => {
    this.addClubmembersForm = new FormGroup({
      firstName: new FormControl(null, Validators.compose([Validators.required])),
      lastName: new FormControl(null, Validators.compose([Validators.required])),
      email: new FormControl(null),
      contact: new FormControl(null, Validators.compose([Validators.required])),
      address: new FormControl(null, Validators.compose([Validators.required])),
      city: new FormControl(null, Validators.compose([Validators.required])),
      addUser: new FormControl(0),
      userName: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  clearDddClubmembersForm = () => {
    this.addClubmembersForm.reset();
  }

  saveClubMember = () => {
    if(this.addClubmembersForm.valid){
      this.clubMemberService.saveClubMember(this.addClubmembersForm).subscribe(res=>{
        if(res){
          this.toastrService.success("Club member saved successfully.","Successfully Saved");
        }
      }, 
      error => {
        this.toastrService.error("Unable to save","Error")
      });
    }
  }

}
