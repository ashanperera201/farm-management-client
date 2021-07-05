import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { ClubMemberService } from '../../../shared/services/club-member.service';

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
    if(type == ExportTypes.CSV){

    }
    else{

    }
  }

  deleteClubMembers = () => {

  }
}
