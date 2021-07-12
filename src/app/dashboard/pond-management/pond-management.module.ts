import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PondManagementComponent } from './pond-management.component';
import { PondListComponent } from './pond-list/pond-list.component';
import { PondAddComponent } from './pond-add/pond-add.component';
import { PondCardComponent } from './pond-card/pond-card.component';
import { PondRoutingModule } from './pond-management.routing';



@NgModule({
  declarations: [
    PondManagementComponent,
    PondListComponent,
    PondAddComponent,
    PondCardComponent
  ],
  imports: [
    CommonModule,
    PondRoutingModule
  ]
})
export class PondManagementModule { }
