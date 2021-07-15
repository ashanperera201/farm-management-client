import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from '../../../shared/enums/export-type';
import { ClubMemberService } from '../../../shared/services/club-member.service';

@Component({
  selector: 'app-club-member-list',
  templateUrl: './club-member-list.component.html',
  styleUrls: ['./club-member-list.component.scss']
})
export class ClubMemberListComponent implements OnInit {
selectedClubmembers = [];
clubMemberList = [];
  constructor(private clubMemberService : ClubMemberService,
     private toastrService:ToastrService,) { }

  ngOnInit(): void {
    this.fetchClubMembers();
  }

  fetchClubMembers = () => {

  }

  addNewClubMember = () => {

  }

  importClubMembers = () => {

  }

  updateClubMember = (clubMemberId: any) =>{

  }

  deleteClubMember = (clubMemberId: any) => {

  }

  exportClubMemberList = (type: any) => {
    if(type == ExportTypes.CSV){

    }
    else{

    }
  }

}
