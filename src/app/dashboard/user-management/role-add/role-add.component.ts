import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/shared/services/user-management.service';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {
  addRoleForm! : FormGroup;
  constructor(private userManagementService: UserManagementService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initRoleForm();
  }

  initRoleForm= () => {
    this.addRoleForm = new FormGroup({
      roleName: new FormControl(null, Validators.compose([Validators.required])),
      description: new FormControl(null, Validators.compose([Validators.required])),
    });
  }

  addRole = () => {
    if(this.addRoleForm.valid){
      this.userManagementService.addRole(this.addRoleForm.value).subscribe(res=> {
        if(res){
          this.toastrService.success("Role saved successfully","Success");
          this.clearRoleForm();
        }
      }, error => {
        this.toastrService.error("Unable to save Role","Error");
      });
    }
  }

  clearRoleForm = () => {
    this.addRoleForm.reset();
  }

}
