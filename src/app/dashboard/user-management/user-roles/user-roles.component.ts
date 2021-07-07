import { Component, OnInit } from '@angular/core';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { UserManagementService } from 'src/app/shared/services/user-management.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {

  constructor(private userManagementService: UserManagementService) { }

  ngOnInit(): void {
  }

  addRole = () => {

  }

  exportRoleList = (type: any) => {
    if(type == ExportTypes.CSV){

    }
    else{

    }
  }
}
