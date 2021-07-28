import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { AppState } from '../../../redux';

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

  constructor(
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.fetchReportData();
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
    debugger
    this.week = this.initialData?.weekNumber;
    let x = this.initialData;
  }

  closeModal = () => {
    this.activeModal.close();
  }

}
