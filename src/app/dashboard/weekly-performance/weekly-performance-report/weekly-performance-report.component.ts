import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { AppState, selectWeeklyApplication } from '../../../redux';

@Component({
  selector: 'app-weekly-performance-report',
  templateUrl: './weekly-performance-report.component.html',
  styleUrls: ['./weekly-performance-report.component.scss']
})
export class WeeklyPerformanceReportComponent implements OnInit {

  @Input() initialData: any;
  ownerForm! : FormGroup;
  owner! : any;
  farm! : any;
  pond! : any;
  week! : any;
  reportSubscription:  Subscription[] = [];
  applicationList: any[] = [];

  constructor(
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.fetchReportData();
    this.fetchApplicationData();
  }

  // initOwnerForm = () => {
  //   this.ownerForm = new FormGroup({
  //     owner : new FormControl(),
  //     farm: new FormControl(),
  //     pond: new FormControl(),
  //     weekNo: new FormControl()
  //   })
  // }

  fetchReportData = () => {
    this.week = this.initialData?.weekNumber;
    let x = this.initialData;
  }

  fetchApplicationData = () => {
    this.reportSubscription.push(this.store.select(selectWeeklyApplication).subscribe(res => {
      if(res){

      }
    }));
  }

  closeModal = () => {
    this.activeModal.close();
  }

}
