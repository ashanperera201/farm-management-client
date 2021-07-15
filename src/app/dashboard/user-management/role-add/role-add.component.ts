import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserRoleModel } from '../../../shared/models/user-role-model';
import { UserManagementService } from 'src/app/shared/services/user-management.service';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() roleId: any;
  @Output() roleAfterSave: EventEmitter<any> = new EventEmitter<any>();
  addRoleForm!: FormGroup;
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Role';

  constructor(private userManagementService: UserManagementService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initRoleForm();
    this.configValues();
  }

  initRoleForm = () => {
    this.addRoleForm = new FormGroup({
      roleCode: new FormControl(null, Validators.compose([Validators.required])),
      roleDescription: new FormControl(null),
    });
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Role"
      this.fetchRoleData();
    }
  }

  fetchRoleData = () => {
    this.userManagementService.fetchRole(this.roleId).subscribe(res => {
      if (res) {
        this.bindRoleData(res.result);
      }
    }, error => {
      this.toastrService.error("Unable to load Role data", "Error");
    });
  }

  bindRoleData = (roleData: any) => {
    const role = new UserRoleModel();
    role.roleCode = roleData.roleCode;
    role.roleName = roleData.roleName;
    role.roleDescription = roleData.roleDescription;
    this.addRoleForm.patchValue(role);
  }

  addRole = () => {
    if (this.addRoleForm.valid) {
      const userRole = new UserRoleModel();
      userRole.roleCode = this.addRoleForm.value.roleCode;
      userRole.roleName = this.addRoleForm.value.roleCode;
      userRole.roleDescription = this.addRoleForm.value.roleDescription;

      if (this.isEditMode) {
        this.userManagementService.updateRole(userRole).subscribe(res => {
          if (res) {
            this.toastrService.success("Role updated successfully", "Success");
            this.clearRoleForm();
            this.closeModal();
            this.roleAfterSave.emit(res);
          }
        }, error => {
          this.toastrService.error("Unable to update Role", "Error");
        });
      }
      else {
        this.userManagementService.addRole(userRole).subscribe(res => {
          if (res) {
            this.toastrService.success("Role saved successfully", "Success");
            this.clearRoleForm();
            this.closeModal();
            this.roleAfterSave.emit(res);
          }
        }, error => {
          this.toastrService.error("Unable to save Role", "Error");
        });
      }
    }
  }

  clearRoleForm = () => {
    this.addRoleForm.reset();
  }

  closeModal = () => {
    this.activeModal.close();
  }

}
