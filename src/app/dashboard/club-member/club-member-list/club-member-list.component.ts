import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClubMemberService } from '../club-member.service';

@Component({
  selector: 'app-club-member-list',
  templateUrl: './club-member-list.component.html',
  styleUrls: ['./club-member-list.component.scss']
})
export class ClubMemberListComponent implements OnInit {
selectedClubmembers = [];
  constructor(private clubMemberService : ClubMemberService,
     private toastrService:ToastrService,) { }

  ngOnInit(): void {
    this.fetchClubMembers();
  }

  fetchClubMembers = () => {

  }

  addClubMember = () => {

  }

  importClubMembers = () => {

  }

  updateRecord = () =>{

  }

  exportClubMembers = (type: any) => {
    //export types to be added to an enum
    if(type == "csv"){

    }
    else{

    }
  }

  deleteClubMembers = () => {

  }
}
