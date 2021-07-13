import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { clubMemberModel } from 'src/app/shared/models/club-member-model';
import { ClubMemberService } from '../../../shared/services/club-member.service';

@Component({
  selector: 'app-club-member-add',
  templateUrl: './club-member-add.component.html',
  styleUrls: ['./club-member-add.component.scss']
})
export class ClubMemberAddComponent implements OnInit {
  addClubmembersForm!: FormGroup;
  showAddUser: boolean = false;

  constructor(private clubMemberService : ClubMemberService,
    private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.initAddClubMembersForm();
  } 

  initAddClubMembersForm= () => {
    this.addClubmembersForm = new FormGroup({
      firstName: new FormControl(null, Validators.compose([Validators.required])),
      lastName: new FormControl(null, Validators.compose([Validators.required])),
      email: new FormControl(null,  Validators.compose([Validators.email])),
      contact: new FormControl(null, Validators.compose([Validators.required])),
      address: new FormControl(null, Validators.compose([Validators.required])),
      city: new FormControl(null, Validators.compose([Validators.required])),
      addUser: new FormControl(0),
      userName: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  clearAddClubmembersForm = () => {
    this.addClubmembersForm.reset();
  }

  saveClubMember = () => {
    if(this.addClubmembersForm.valid){
      const clubMember = new clubMemberModel();
      clubMember.firstName = this.addClubmembersForm.value.firstName;
      clubMember.lastName = this.addClubmembersForm.value.lastName;
      clubMember.email = this.addClubmembersForm.value.email;
      clubMember.contact = this.addClubmembersForm.value.contact;
      clubMember.address = this.addClubmembersForm.value.address;
      clubMember.city = this.addClubmembersForm.value.city;
      clubMember.userName = this.addClubmembersForm.value.userName;
      clubMember.password = this.addClubmembersForm.value.password;

      this.clubMemberService.saveClubMember(clubMember).subscribe(res=>{
        if(res){
          this.toastrService.success("Club member saved successfully.","Successfully Saved");
        }
      }, 
      error => {
        this.toastrService.error("Unable to save","Error")
      });
    }
  }

  onAddUserChange = (event: any) => {
    if(event){
      this.showAddUser = true;
    }
  }

}
