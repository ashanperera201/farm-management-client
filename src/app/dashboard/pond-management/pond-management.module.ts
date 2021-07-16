import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PondManagementComponent } from './pond-management.component';
import { PondListComponent } from './pond-list/pond-list.component';
import { PondAddComponent } from './pond-add/pond-add.component';
import { PondCardComponent } from './pond-card/pond-card.component';
import { PondRoutingModule } from './pond-management.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    PondManagementComponent,
    PondListComponent,
    PondAddComponent,
    PondCardComponent
  ],
  imports: [
    CommonModule,
    PondRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule
  ]
})
export class PondManagementModule { }
