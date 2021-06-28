import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { UserPermissionsComponent } from './user-permissions/user-permissions.component';
import { UserManagementRoutingModule } from './user-management.routing';

@NgModule({
  declarations: [
    UserManagementComponent,
    UserAddComponent,
    UserListComponent,
    UserRolesComponent,
    UserPermissionsComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule
  ]
})
export class UserManagementModule { }
