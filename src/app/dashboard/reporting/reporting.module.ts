import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingComponent } from './reporting.component';
import { ReportingRouterModule } from './reporting.routing';
import { ClubMemberReportComponent } from './club-member-report/club-member-report.component';
import { FarmDetailReportComponent } from './farm-detail-report/farm-detail-report.component';
import { PondDetailReportComponent } from './pond-detail-report/pond-detail-report.component';
import { PondBrandDetailReportComponent } from './pond-brand-detail-report/pond-brand-detail-report.component';
import { ApplicationDetailReportComponent } from './application-detail-report/application-detail-report.component';
import { PercentageFeedingReportComponent } from './percentage-feeding-report/percentage-feeding-report.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { WeeklySampleReportComponent } from './weekly-sample-report/weekly-sample-report.component';
import { WeeklyApplicationReportComponent } from './weekly-application-report/weekly-application-report.component';
import { HarvestDetailReportComponent } from './harvest-detail-report/harvest-detail-report.component';
import { AwbDetailReportComponent } from './awb-detail-report/awb-detail-report.component';


@NgModule({
  declarations: [
    ReportingComponent,
    ClubMemberReportComponent,
    FarmDetailReportComponent,
    PondDetailReportComponent,
    PondBrandDetailReportComponent,
    ApplicationDetailReportComponent,
    PercentageFeedingReportComponent,
    SalesReportComponent,
    WeeklySampleReportComponent,
    WeeklyApplicationReportComponent,
    HarvestDetailReportComponent,
    AwbDetailReportComponent
  ],
  imports: [
    CommonModule,
    ReportingRouterModule
  ]
})
export class ReportingModule { }