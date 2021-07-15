import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from '../../../shared/enums/export-type';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { ClubMemberAddComponent } from '../club-member-add/club-member-add.component';

@Component({
  selector: 'app-club-member-list',
  templateUrl: './club-member-list.component.html',
  styleUrls: ['./club-member-list.component.scss']
})
export class ClubMemberListComponent implements OnInit {
selectedClubmembers = [];
clubMemberList = [];
  constructor(private clubMemberService : ClubMemberService,
     private toastrService:ToastrService,
     private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetchClubMembers();
  }

  fetchClubMembers = () => {

  }

  addNewClubMember = () => {
    const addFeedBrandModal = this.modalService.open(ClubMemberAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
  }

  updateClubMember = (clubMemberId: any) =>{
    const addFeedBrandModal = this.modalService.open(ClubMemberAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addFeedBrandModal.componentInstance.roleId = clubMemberId;
    addFeedBrandModal.componentInstance.isEditMode = true;
    addFeedBrandModal.componentInstance.afterSave = this.clubMemberfterSave();
  }

  clubMemberfterSave = () => {

  }

  deleteClubMember = (clubMemberId: any) => {

  }

  exportClubMemberList = (type: any) => {
    if(type == ExportTypes.CSV){

    }
    else{

    }
  }

  importClubMembers = () => {

  }
}
