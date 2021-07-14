import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserRoleModel } from 'src/app/shared/models/user-role-model';
import { UserManagementService } from 'src/app/shared/services/user-management.service';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {
  addRoleForm! : FormGroup;
  constructor(private userManagementService: UserManagementService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initRoleForm();
  }

  initRoleForm= () => {
    this.addRoleForm = new FormGroup({
      roleCode: new FormControl(null, Validators.compose([Validators.required])),
      description: new FormControl(null),
    });
  }

  addRole = () => {
    if(this.addRoleForm.valid){

      const userRole = new UserRoleModel();
      userRole.roleCode = this.addRoleForm.value.roleCode;
      userRole.roleName = this.addRoleForm.value.roleCode;
      userRole.roleDescription = this.addRoleForm.value.description;

      this.userManagementService.addRole(userRole).subscribe(res=> {
        if(res){
          this.toastrService.success("Role saved successfully","Success");
          this.clearRoleForm();
          this.closeModal();
        }
      }, error => {
        this.toastrService.error("Unable to save Role","Error");
      });
    }
  }

  clearRoleForm = () => {
    this.addRoleForm.reset();
  }

  closeModal = () => {
    this.activeModal.close();

  }

}
