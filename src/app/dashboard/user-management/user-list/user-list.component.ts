import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'src/app/shared/services/user-management.service';
import { ExportTypes } from '../../../shared/enums/export-type';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  constructor(private userManagementService: UserManagementService) { }

  ngOnInit(): void {
  }

  addUser = () => {

  }

  exportUserList = (type: any) => {
    if(type == ExportTypes.CSV){

    }
    else{

    }
  }
}
