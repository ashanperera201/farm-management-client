import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { FileService } from '../../../shared/services/file.service';
import { ReportingService } from '../../../shared/services/reporting.service';
@Component({
  selector: 'app-pond-brand-detail-report',
  templateUrl: './pond-brand-detail-report.component.html',
  styleUrls: ['./pond-brand-detail-report.component.scss']
})
export class PondBrandDetailReportComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI!: NgBlockUI;

  searchParam!: string;

  pageSize: number = 10;
  page: any = 1;
  brandSubscriptions: Subscription[] = [];
  brandDetailList: any[] = [];

  test: any[] = [
    {
      'id': '5a15b13c36e7a7f00cf0d7cb',
      'index': 2,
      'isActive': true,
      'picture': 'http://placehold.it/32x32',
      'age': 23,
      'name': 'Karyn Wright',
      'gender': 'female',
      'company': 'ZOLAR',
      'email': 'karynwright@zolar.com',
      'phone': '+1 (851) 583-2547'
    },
    {
      'id': '5a15b13c2340978ec3d2c0ea',
      'index': 3,
      'isActive': false,
      'picture': 'http://placehold.it/32x32',
      'age': 35,
      'name': 'Rochelle Estes',
      'disabled': true,
      'gender': 'female',
      'company': 'EXTRAWEAR',
      'email': 'rochelleestes@extrawear.com',
      'phone': '+1 (849) 408-2029'
    },
  ]

  constructor(private reportingService: ReportingService, private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchBrandDetails();
  }

  private fetchBrandDetails = () => {
    this.blockUI.start('Fetching data....');
    this.brandSubscriptions.push(this.reportingService.getPondBrandDetailReportData(null).subscribe(serviceResult => {
      if (serviceResult && serviceResult.validity) {
        this.brandDetailList = serviceResult.result;
      }
      this.blockUI.stop();
    }, (e) => {
      console.log(e);
      this.blockUI.stop();
    }));
  }

  generateReport = () => {
    this.blockUI.start('Exporting Pdf...');

    const pdfData: any[] = this.brandDetailList.map(x => {
      return {
        'Brand Name': x.brandName,
        'Grades': x.grades,
        'Shrimp Weight': x.shrimpWeight,
        'Price': x.price,
        'status': x.isActive ? 'Active' : 'In-Active',
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['Brand Name', 'Grades', 'Shrimp Weight', 'Price', 'status', 'Created On'];
    this.fileService.exportToPDF("Brand Detail Report", headers, pdfData, 'brand_details_report', 'brand details, xxxx pvt ltd', true);
    this.blockUI.stop();
  }

  ngOnDestroy() {
    if (this.brandSubscriptions && this.brandSubscriptions.length > 0) {
      this.brandSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }

}
