import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { FileService } from '../../../shared/services/file.service';
import { ReportingService } from '../../../shared/services/reporting.service';
@Component({
  selector: 'app-pond-detail-report',
  templateUrl: './pond-detail-report.component.html',
  styleUrls: ['./pond-detail-report.component.scss']
})
export class PondDetailReportComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  searchParam!: string;

  pageSize: number = 10;
  page: any = 1;
  pondDetailSubscriptions: Subscription[] = [];
  pondDetailList: any[] = [];

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
    this.fetchPondDetails();
  }

  private fetchPondDetails = () => {
    this.blockUI.start('Fetching data....');
    this.pondDetailSubscriptions.push(this.reportingService.getPondReportData(null).subscribe(serviceResult => {
      if (serviceResult && serviceResult.validity) {
        this.pondDetailList = serviceResult.result;
      }
      this.blockUI.stop();
    }, (e) => {
      console.log(e);
      this.blockUI.stop();
    }));
  }

  generateReport = () => {
    this.blockUI.start('Exporting Pdf...');

    const pdfData: any[] = this.pondDetailList.map(x => {
      return {
        'Owner First Name': x.owner.firstName,
        'Owner Last Name': x.owner.lastName,
        'Farm Name': x.farmer.farmName,
        'Area of pond': x.areaOfPond,
        'Grade Of pond': x.gradeOfPond,
        'Fixed Cost': x.fixedCost,
        'status': x.isActive ? 'Active' : 'In-Active',
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['Owner First Name', 'Owner Last Name', 'Farm Name', 'Area of pond', 'Grade Of pond', 'Fixed Cost', 'status', 'Created On'];
    this.fileService.exportToPDF("Pond Detail Report", headers, pdfData, 'pond_details_report', 'Pond details, xxxx pvt ltd', true);
    this.blockUI.stop();
  }

  ngOnDestroy() {
    if (this.pondDetailSubscriptions && this.pondDetailSubscriptions.length > 0) {
      this.pondDetailSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
