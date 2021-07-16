import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserRoleModel } from '../../../shared/models/user-role-model';
import { UserManagementService } from 'src/app/shared/services/user-management.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { RolePermissionService } from 'src/app/shared/services/role-permission.service';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() role: any;
  @Output() roleAfterSave: EventEmitter<any> = new EventEmitter<any>();
  addRoleForm!: FormGroup;
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Role';
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(private userManagementService: UserManagementService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private rolePermissionService: RolePermissionService) { }

  ngOnInit(): void {
    this.initRoleForm();
    this.patchExistsRole();
    this.fetchRolePermissionData();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  initRoleForm = () => {
    this.addRoleForm = new FormGroup({
      roleCode: new FormControl(null, Validators.compose([Validators.required])),
      roleDescription: new FormControl(null),
    });
  }

  patchExistsRole = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Role"
      this.addRoleForm.patchValue(this.role);
    }
  }

  addRole = () => {
    if (this.addRoleForm.valid) {
      const userRole = new UserRoleModel();
      userRole.roleCode = this.addRoleForm.value.roleCode;
      userRole.roleName = this.addRoleForm.value.roleCode;
      userRole.roleDescription = this.addRoleForm.value.roleDescription;

      if (this.isEditMode) {
        this.role.roleCode = this.addRoleForm.value.roleCode;;
        this.role.roleName = this.addRoleForm.value.roleCode;
        this.role.roleDescription = this.addRoleForm.value.roleDescription;

        this.userManagementService.updateRole(this.role).subscribe(res => {
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

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  fetchRolePermissionData = () => {
    this.rolePermissionService.fetchPermissionList().subscribe(res => {
      if (res) {
        this.dropdownList = res.result;
      }
    }, error => {
      this.toastrService.error("Unable to load Role permission data", "Error");
    });
  }

}
