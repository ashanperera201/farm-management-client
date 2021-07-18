import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { clubMemberModel } from '../../../../app/shared/models/club-member-model';
import { ClubMemberService } from '../../../shared/services/club-member.service';

@Component({
  selector: 'app-club-member-add',
  templateUrl: './club-member-add.component.html',
  styleUrls: ['./club-member-add.component.scss']
})
export class ClubMemberAddComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() existingClubMember: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Club Member';
  feedBrandList: any[] = [];
  existingData = new clubMemberModel();
  clubMemberList!: [];
  addClubmembersForm!: FormGroup;
  showAddUser: boolean = false;

  constructor(
    private clubMemberService : ClubMemberService,
    private toastrService:ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddClubMembersForm();
    this.configValues();
  }
  
  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Club Member";
      this.addClubmembersForm.patchValue(this.existingClubMember);
    }
  }

  initAddClubMembersForm= () => {
    this.addClubmembersForm = new FormGroup({
      firstName: new FormControl(null, Validators.compose([Validators.required])),
      lastName: new FormControl(null, Validators.compose([Validators.required])),
      email: new FormControl(null,  Validators.compose([Validators.email])),
      contactNumber: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10),Validators.pattern(/^-?(0|[1-9]\d*)?$/)])),
      address: new FormControl(null, Validators.compose([Validators.required])),
      city: new FormControl(null, Validators.compose([Validators.required])),
      addUser: new FormControl(0),
      userName: new FormControl(null),
      password: new FormControl(null)
    });
  }

  clearAddClubmembersForm = () => {
    this.addClubmembersForm.reset();
  }

  saveClubMember = () => {
    if(this.isEditMode){
      if(this.addClubmembersForm.valid){
        const clubMember = this.existingClubMember;
        clubMember.firstName = this.addClubmembersForm.value.firstName;
        clubMember.lastName = this.addClubmembersForm.value.lastName;
        clubMember.email = this.addClubmembersForm.value.email;
        clubMember.contactNumber = this.addClubmembersForm.value.contactNumber;
        clubMember.address = this.addClubmembersForm.value.address;
        clubMember.city = this.addClubmembersForm.value.city;
        clubMember.userName = this.addClubmembersForm.value.userName;
        clubMember.password = this.addClubmembersForm.value.password;

        this.clubMemberService.updateClubMember(clubMember).subscribe(res=>{
          if(res){
            this.closeModal();
            this.toastrService.success("Club Member updated successfully.","Successfully Saved");
          }
        }, 
        () => {
          this.toastrService.error("Unable to update Club Member data","Error");
        });
      }
    }
    else{
      if(this.addClubmembersForm.valid){
        const clubMember = new clubMemberModel();
        clubMember.firstName = this.addClubmembersForm.value.firstName;
        clubMember.lastName = this.addClubmembersForm.value.lastName;
        clubMember.email = this.addClubmembersForm.value.email;
        clubMember.contactNumber = this.addClubmembersForm.value.contactNumber;
        clubMember.address = this.addClubmembersForm.value.address;
        clubMember.city = this.addClubmembersForm.value.city;
        clubMember.userName = this.addClubmembersForm.value.userName;
        clubMember.password = this.addClubmembersForm.value.password;
        clubMember.nic = '00';
  
        this.clubMemberService.saveClubMember(clubMember).subscribe(res=>{
          if(res && res.result){
            this.afterSave.emit(res.result);
            this.closeModal();
            this.toastrService.success("Club Member saved successfully.","Successfully Saved");
          }
        }, 
        () => {
          this.toastrService.error("Unable to save Club Member data","Error");
        });
      }
    }
  }

  onAddUserChange = (event: any) => {
    if(event && this.showAddUser){
      this.showAddUser = false;
    }
    else{
      this.showAddUser = true;
    }
  }

  closeModal = () => {
    this.activeModal.close();
  }

}
