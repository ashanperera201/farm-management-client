import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarmManagementComponent } from './farm-management.component';
import { FarmListComponent } from './farm-list/farm-list.component';
import { FarmAddComponent } from './farm-add/farm-add.component';
import { FarmCardComponent } from './farm-card/farm-card.component';
import { FarmManagementRoutingModule } from './farm-management.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FarmManagementComponent,
    FarmListComponent,
    FarmAddComponent,
    FarmCardComponent
  ],
  imports: [
    CommonModule,
    FarmManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class FarmManagementModule { }
