import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FileService } from '../../../shared/services/file.service';
import { ExportTypes } from '../../../shared/enums/export-type';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { ClubMemberAddComponent } from '../club-member-add/club-member-add.component';
import * as moment from 'moment';

@Component({
  selector: 'app-club-member-list',
  templateUrl: './club-member-list.component.html',
  styleUrls: ['./club-member-list.component.scss']
})
export class ClubMemberListComponent implements OnInit {
  selectedClubmembers = [];
  clubMemberList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;

  constructor(private clubMemberService: ClubMemberService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchClubMembers();
  }

  fetchClubMembers = () => {
    this.clubMemberService.fetchClubMembers().subscribe(res => {
      if (res && res.result) {
        this.clubMemberList = res.result;
      }
    }, () => {
      this.toastrService.error("Failed to load Club Members Data", "Error");
    });
  }

  addNewClubMember = () => {
    const addClubMemberModal = this.modalService.open(ClubMemberAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addClubMemberModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res && res.clubMember) {
        this.clubMemberList.unshift(res.clubMember);
      }
    });
  }

  updateClubMember = (clubMember: any) => {
    const addClubMemberModal = this.modalService.open(ClubMemberAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addClubMemberModal.componentInstance.existingClubMember = clubMember;
    addClubMemberModal.componentInstance.isEditMode = true;
  }

  deleteClubMember = (clubMemberId: any) => {
    const clubMemberIds = JSON.stringify([].concat(clubMemberId));
    let form = new FormData();
    form.append("clubMemberIds", clubMemberIds);

    this.clubMemberService.deleteClubMember(form).subscribe(res => {
      if (res && this.clubMemberList.length > 0) {
        let deletedIndex = this.clubMemberList.indexOf(this.clubMemberList.filter(a => a._id == clubMemberId)[0]);
        this.clubMemberList.splice(deletedIndex, 1);
        this.toastrService.success("Club Member deleted", "Success");
      }
    }, () => {
      this.toastrService.error("Unable to delete Club Member", "Error");
    });
  }

  exportClubMemberList = (type: any) => {
    if (type === ExportTypes.CSV) {
      const csvData: any[] = this.clubMemberList.map(x => {
        return {
          'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
          'First Name': x.firstName,
          'Last Name': x.lastName,
          'Email': x.email,
          'Contact No': x.contactNumber,
          'Address': x.address,
          'City': x.city,
          'Nic': x.nic
        }
      });
      this.fileService.exportAsExcelFile(csvData, "Club_Members_Data");
    }
    else {
      const pdfData: any[] = this.clubMemberList.map(x => {
        return {
          'First Name': x.firstName,
          'Last Name': x.lastName,
          'Email': x.email,
          'Contact No': x.contactNumber,
          'Nic': x.nic,
          'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
        }
      });
      const headers: any[] = ['First Name', 'Last Name', 'Email', 'Contact No', 'Nic', 'Created On',];
      this.fileService.exportToPDF("Club Members Data", headers, pdfData, 'Club_Members_Data');
    }
  }

  importClubMembers = () => {

  }
}
