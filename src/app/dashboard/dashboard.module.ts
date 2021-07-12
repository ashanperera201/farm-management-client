import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { DashboardRoutingModule } from './dashboard.routing';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ComponentsModule } from '../shared/components/components.module';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ComponentsModule,
    InlineSVGModule
  ]
})

export class DashboardModule { }
