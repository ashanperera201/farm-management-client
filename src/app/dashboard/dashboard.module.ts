import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard.routing';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})

export class DashboardModule { }
