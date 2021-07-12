import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserManagementComponent } from './user-management.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { UserPermissionsComponent } from './user-permissions/user-permissions.component';
import { UserManagementRoutingModule } from './user-management.routing';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

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
    UserManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbPaginationModule
  ]
})
export class UserManagementModule { }
