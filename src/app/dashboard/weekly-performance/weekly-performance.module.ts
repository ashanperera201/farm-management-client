import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPermissionsModule } from 'ngx-permissions';
import { WeeklyPerformanceComponent } from './weekly-performance.component';
import { WeeklyPerformanceReportComponent } from './weekly-performance-report/weekly-performance-report.component';
import { WeeklyPerformanceShowComponent } from './weekly-performance-show/weekly-performance-show.component';
import { WeeklyPerformanceRoutingModule } from './weekly-performance.routing';

@NgModule({
  declarations: [
    WeeklyPerformanceComponent,
    WeeklyPerformanceShowComponent,
    WeeklyPerformanceReportComponent
  ],
  imports: [
    CommonModule,
    WeeklyPerformanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    NgbModule,
    NgxPermissionsModule.forChild()
  ]
})
export class WeeklyPerformanceModule { }