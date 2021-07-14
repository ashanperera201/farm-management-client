import { UserModel } from './../../../shared/models/user-model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/shared/services/user-management.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  addUserForm! : FormGroup;
  roleList : any[] = [];

  constructor(private userManagementService: UserManagementService,
    private authService : AuthService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initAddUserForm();
  }

  initAddUserForm= () => {
    //COMMENTED code will be REMOVED after discussion
    // this.addUserForm = new FormGroup({
    //   userName: new FormControl(null, Validators.compose([Validators.required])),
    //   password: new FormControl(null, Validators.compose([Validators.required])),
    //   role: new FormControl(null, Validators.compose([Validators.required])),
    //   phoneNumber: new FormControl(null, Validators.compose([Validators.required])),
    //   email: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
    //   isActive: new FormControl(0),
    // });

    this.addUserForm = new FormGroup({
      userName: new FormControl(null, Validators.compose([Validators.required])),
      userEmail: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      firstName: new FormControl(null, Validators.compose([Validators.required])),
      middleName: new FormControl(null),
      lastName: new FormControl(null, Validators.compose([Validators.required])),
      contact: new FormControl(null, Validators.compose([Validators.required])),
      userAddress: new FormControl(null, Validators.compose([Validators.required])),
      nic: new FormControl(null, Validators.compose([Validators.required])),
      passpordId: new FormControl(null),
      password: new FormControl(null, Validators.compose([Validators.required])),
      rePassword: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  addUser = () => {
    if (this.addUserForm.valid) {
      if (this.checkPasswords(this.addUserForm.value)) {
        let userModelData = new UserModel();
        userModelData.userName = (this.addUserForm.value.userName).trim();
        userModelData.userEmail = this.addUserForm.value.userEmail;
        userModelData.password = (this.addUserForm.value.password).trim();
        userModelData.firstName = this.addUserForm.value.firstName;
        userModelData.middleName = this.addUserForm.value.middleName;
        userModelData.lastName = this.addUserForm.value.lastName;
        userModelData.contact = this.addUserForm.value.contact;
        userModelData.userAddress = this.addUserForm.value.userAddress;
        userModelData.nic = this.addUserForm.value.nic;
        userModelData.passportId = this.addUserForm.value.passpordId;
        userModelData.profileImage = "";
        userModelData.countryCode = "SRI-LANKAN"
        this.authService.registerUser(userModelData).subscribe(res => {
          if (res) {
            this.toastrService.success("User registered successfully.", "Success");
            this.clearAddUserForm();
            this.closeModal();
          }
        },
          error => {
            this.toastrService.error(error.error.error, "Unable to Save");
          });
      }
      else {
        this.toastrService.error("Re-entered password do not match", "Error");
      }
    }
  }

  checkPasswords = (formData: { password: any; rePassword: any; }) => {
    let result : boolean;
    result = formData.password == formData.rePassword ? true : false;
    return result;
  }

  generatePassword = () => {

  }

  fetchUserRoles = () => {
    this.userManagementService.fetchRoleList().subscribe(res => {
      if(res && res.result){
        res.result.forEach((role: any) => {
          this.roleList.push(role);
        });
      }
    },error => {
      this.toastrService.error("Failed to load users","Error");
    });
  }

  clearAddUserForm = () => {
    this.addUserForm.reset();
  }

  closeModal = () => {
    this.activeModal.close();
  }
}
