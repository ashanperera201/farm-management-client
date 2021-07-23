import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ComponentsModule } from '../shared/components/components.module';
import { DashboardRoutingModule } from './dashboard.routing';
import { HomeComponent } from './home/home.component';
@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ComponentsModule,
    InlineSVGModule    
  ] 
})

export class DashboardModule { }
