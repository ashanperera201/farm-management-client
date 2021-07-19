import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarmManagementComponent } from './farm-management.component';
import { FarmListComponent } from './farm-list/farm-list.component';
import { FarmAddComponent } from './farm-add/farm-add.component';
import { FarmCardComponent } from './farm-card/farm-card.component';
import { FarmManagementRoutingModule } from './farm-management.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

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
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgbModalModule
  ]
})

export class FarmManagementModule { }
