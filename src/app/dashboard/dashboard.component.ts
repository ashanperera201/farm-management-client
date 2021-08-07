import { Component, OnInit, OnDestroy } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { NavigationModes } from '../shared/enums/navigation.enum';
import { StockService } from '../shared/services/stock.service';
import { ClubMemberService } from '../shared/services/club-member.service';
import { WeeklySamplingService } from '../shared/services/weekly-sampling.service';
import { AppState, selectUserDetails, setStockDetails, setWeeklySamplings } from '../redux';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  navigationModes = NavigationModes;
  asideMenuDropdown: any = 1;
  asideMenuScroll = 1;
  loggedUserName: string = '';

  menuItems: any[] = [];
  currentIndex!: number;
  dashboardSubscriptions: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private stockService: StockService,
    private clubMemberService: ClubMemberService,
    private weeklySamplingService: WeeklySamplingService
  ) { }

  ngOnInit(): void {
    this.fetchUser()
    this.fetchInitialDataSets();
  }

  fetchUser = () => {
    this.store.select(selectUserDetails).subscribe(user => {
      if(user){
        this.loggedUserName = user.firstName;
      }
    })
  }

  fetchInitialDataSets = () => {
    this.dashboardSubscriptions.push(this.stockService.fetchStock().pipe(switchMap(stockDetails => {
      if (stockDetails && stockDetails.validity) {
        const details = stockDetails.result;
        this.store.dispatch(setStockDetails(details));
      }
      return this.weeklySamplingService.getAllWeeklySamplings();
    })).pipe(switchMap((weeklySampling: any) => {
      if (weeklySampling && weeklySampling.validity) {
        const samplingDetails = weeklySampling.result;
        this.store.dispatch(setWeeklySamplings(samplingDetails));
      }
      return this.clubMemberService.fetchClubMembers()
    }))
      .subscribe((clubMemberServiceRes: any) => {
        // TODO dispatch later.
      }));
  }

  onMenuItemClick = (index: number) => {
    if (this.currentIndex >= 0) {
      this.menuItems[this.currentIndex].selected = !this.menuItems[this.currentIndex].selected;
      this.menuItems[this.currentIndex].activeClass = '';
      this.currentIndex = -1;
    }
    this.menuItems[index].selected = !this.menuItems[index].selected;
    this.menuItems[index].activeClass = this.menuItems[index].selected ? 'menu-item-active' : '';
    this.currentIndex = index;
  }

  ngOnDestroy() {
    if (this.dashboardSubscriptions && this.dashboardSubscriptions.length > 0) {
      this.dashboardSubscriptions.forEach(s => {
        s.unsubscribe();
      })
    }
  }

}
