import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { FarmService } from '../../../shared/services/farm.service';
import { PondService } from '../../../shared/services/pond.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { keyPressNumbers } from './../../../shared/utils/keyboard-event';
import { AppState } from '../../../redux';


@Component({
  selector: 'app-weekly-performance-show',
  templateUrl: './weekly-performance-show.component.html',
  styleUrls: ['./weekly-performance-show.component.scss']
})
export class WeeklyPerformanceShowComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  weeklyApplicationForm!: FormGroup;
  farmList: any[] = [];
  ownerList: any[] = [];
  pondList: any[] = [];
  weeklyPerformanceSubscriptions: Subscription[] = [];
  initialData: any = {
    farmList: [],
    ownerList: [],
    pondList: []
  }

  constructor(
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService
  ) { }

  ngOnInit(): void {
    this.initAddPondForm();
    this.fetchInitialData();
  }

  initAddPondForm = () => {
    this.weeklyApplicationForm = new FormGroup({
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      owner: new FormControl(null, Validators.compose([Validators.required])),
      pondNo: new FormControl(null, Validators.compose([Validators.required])),
      weekNumber: new FormControl(null, Validators.compose([Validators.required])),
    });
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.weeklyPerformanceSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.ownerList = ownerRes.result;
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.initialData.pondList = resPonds.result;
      }
      return this.farmService.fetchFarms()
    })).subscribe((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.initialData.farmList = farmRes.result;
      }
    }, () => {
      this.blockUI.stop();
    }))
    this.blockUI.stop();
  }

  ownerOnChange = () => {
    const owner = this.weeklyApplicationForm.get("owner")?.value;
    if (owner) {
      const filteredFarmList = this.initialData.farmList.filter((x: any) => x.owner && x.owner._id === owner);
      if (filteredFarmList && filteredFarmList.length > 0) {
        this.farmList = filteredFarmList;
      } else {
        this.farmList = [];
      }
    }
  }

  farmOnChange = () => {
    const farmer = this.weeklyApplicationForm.get("farmer")?.value;
    if (farmer) {
      const filteredPondList = this.initialData.pondList.filter((x: any) => x.farmer && x.farmer._id === farmer);
      if (filteredPondList && filteredPondList.length > 0) {
        this.pondList = filteredPondList;
      } else {
        this.pondList = [];
      }
    }
  }

  showWeeklyPerformance = () => {
    //TO DO
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  ngOnDestroy() {
    if (this.weeklyPerformanceSubscriptions && this.weeklyPerformanceSubscriptions.length > 0) {
      this.weeklyPerformanceSubscriptions.forEach(res => {
        res.unsubscribe();
      });
    }
  }

}
