import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExportTypes } from '../../../shared/enums/export-type';

@Component({
  selector: 'app-application-detail-report',
  templateUrl: './application-detail-report.component.html',
  styleUrls: ['./application-detail-report.component.scss']
})
export class ApplicationDetailReportComponent implements OnInit, OnDestroy {

  searchParam!: string;
  exportTypes = ExportTypes;

  pageSize: number = 10;
  page: any = 1;
  applicationDetailSubscriptions: Subscription[] = [];

  applicationDetailList: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  exportUserList = (fileType: number) => {

  }

  ngOnDestroy() {
    if (this.applicationDetailSubscriptions && this.applicationDetailSubscriptions.length > 0) {
      this.applicationDetailSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }

}
