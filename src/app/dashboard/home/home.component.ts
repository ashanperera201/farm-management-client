import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PondService } from '../../shared/services/pond.service';
import { FarmService } from '../../shared/services/farm.service';
import { ClubMemberService } from '../../shared/services/club-member.service';
import { ApplicationsService } from '../../shared/services/applications.service';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

clubMemberCount : number = 0;
farmsCount : number = 0;
pondsCount : number = 0;
ApplicationsCount : number = 0;
dashboardSubscription: Subscription[] = [];

@BlockUI() blockUI!: NgBlockUI;

  constructor(
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private applicationService : ApplicationsService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.fetchWidgetData();
  }

  fetchWidgetData = () => {
    this.blockUI.start('Fetching Data...');
    this.dashboardSubscription.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.clubMemberCount = ownerRes.result.length ? ownerRes.result.length : 0;
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.pondsCount = resPonds.result.length ? resPonds.result.length : 0;
      }
      return this.applicationService.fetchApplications()
    })).pipe(switchMap((resApps: any) => {
      if (resApps && resApps.result) {
        this.ApplicationsCount = resApps.result.length ? resApps.result.length : 0;
      }
      return this.farmService.fetchFarms()
    })).subscribe((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.farmsCount = farmRes.result.length ? farmRes.result.length : 0;
      }
    }, () => {
      this.blockUI.stop();
      this.toastrService.error("Unable to load data","Error");
    }))
    this.blockUI.stop();
  }

  ngOnDestroy() {
    if (this.dashboardSubscription && this.dashboardSubscription.length > 0) {
      this.dashboardSubscription.forEach(s => {
        s.unsubscribe();
      })
    }
  }

}
