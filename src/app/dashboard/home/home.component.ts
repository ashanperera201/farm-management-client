import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PondService } from '../../shared/services/pond.service';
import { FarmService } from '../../shared/services/farm.service';
import { ClubMemberService } from '../../shared/services/club-member.service';
import { ApplicationsService } from '../../shared/services/applications.service';
import { switchMap } from 'rxjs/operators';
import { PercentageFeedingService } from '../../shared/services/percentage-feeding.service';
import { SalesPriceService } from '../../shared/services/sales-price.service';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { DailyFeedService } from 'src/app/shared/services/daily-feed.service';
import { StockService } from 'src/app/shared/services/stock.service';


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
percentageFeedingList: any[] = [];
salesPriceList: any[] = [];
pageSize: number = 10;
page: any = 1;

@BlockUI() blockUI!: NgBlockUI;

// Pie
public pieChartOptions: ChartOptions = {
  responsive: true,
};
public pieChartLabels: Label[] = [['Other', 'Cost'], ['Total', 'Feed', 'Cost'], ['Total', 'Application', 'Cost'], ['PL', 'Cost']];
public pieChartPondData: SingleDataSet = [];
public pieChartFarmData: SingleDataSet = [];  
public pieChartType: ChartType = 'pie';
public pieChartLegend = true;
public pieChartPlugins = [];
public chartColors: Color[] = [
  {
    borderColor: 'black',
    backgroundColor: '#0074D9',
    //backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B"]
  },
];
  
  applicationPondCost = 0;
  applicationFarmCost = 0;
  applicationList = [];
  feedPondCost = 0;
  feedFarmCost = 0;
  feedList = [];
  plPondCost = 0;
  plFarmCost = 0;
  stockList = [];
  otherPondCost = 0;
  otherFarmCost = 0;
  pondList = [];

  constructor(
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private applicationService : ApplicationsService,
    private toastrService: ToastrService,
    private percentageFeedingService : PercentageFeedingService,
    private salesPriceService: SalesPriceService,
    private dailyFeedService: DailyFeedService,
    private stockService: StockService
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
   }

  ngOnInit(): void {
    this.fetchWidgetData();
    this.fetchPercentageFeeding();
    this.fetchSalesPrice();
  }

  fetchWidgetData = () => {
    this.blockUI.start('Fetching Data...');
    this.dashboardSubscription.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.clubMemberCount = ownerRes.result.length ? ownerRes.result.length : 0;
      }
      return this.farmService.fetchFarms()
    })).pipe(switchMap((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.farmsCount = farmRes.result.length ? farmRes.result.length : 0;
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.pondsCount = resPonds.result.length ? resPonds.result.length : 0;
        this.pondList = resPonds.result;
        this.calculateotherCost();
      }
      return this.dailyFeedService.fetchDailyFeeds()
    })).pipe(switchMap((resFeed: any) => {
      if (resFeed && resFeed.result) {
        this.feedList = resFeed.result;
        this.calculateTotalFeedCost();
      }
      return this.applicationService.fetchApplications()
    })).pipe(switchMap((resApps: any) => {
      if (resApps && resApps.result) {
        this.ApplicationsCount = resApps.result.length ? resApps.result.length : 0;
        this.applicationList = resApps.result;
        this.calculateTotalApplicationCost();
      }
      return this.stockService.fetchStock()
    })).subscribe((resStock: any) => {
      if (resStock && resStock.result) {
        this.stockList = resStock.result;
        this.calculateTotalPLCost();
      }
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
      this.toastrService.error("Unable to load data","Error");
    }))
  }

  fetchPercentageFeeding = () => {
    this.blockUI.start('Fetching Data......');
    this.dashboardSubscription.push(this.percentageFeedingService.fetchPercentageFeedings().subscribe(res=> {
      if(res && res.result){
        this.percentageFeedingList = res.result;
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Failed to load Data","Error");
      this.blockUI.stop();
    }));
  }

  fetchSalesPrice = () => {
    this.blockUI.start('Fetching Data......');
    this.dashboardSubscription.push(this.salesPriceService.fetchSalesPrice().subscribe(res => {
      if (res && res.result) {
        this.salesPriceList = res.result;
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Failed to load Data", "Error");
      this.blockUI.stop();
    }));
  }

  calculateTotalFeedCost() {
    this.feedList.forEach((feed: any) => {
      this.feedPondCost += feed.calculatedDailyFeed;
      this.feedFarmCost += feed.calculatedDailyFeed;
      this.feedPondCost = this.feedPondCost / this.pondsCount;
      this.feedFarmCost = this.feedFarmCost / this.farmsCount;
    });
    this.pieChartPondData.push(this.feedPondCost);
    this.pieChartFarmData.push(this.feedFarmCost);
  }

  calculateTotalApplicationCost() {
    this.applicationList.forEach((application: any) => {
      this.applicationPondCost += (application.unit * application.costPerUnit);
      this.applicationFarmCost += (application.unit * application.costPerUnit);
      this.applicationPondCost = this.applicationPondCost / this.pondsCount;
      this.applicationFarmCost = this.applicationFarmCost / this.farmsCount;
    });

    this.pieChartPondData.push(this.applicationPondCost);
    this.pieChartFarmData.push(this.applicationFarmCost);
  }

  calculateTotalPLCost() {
    this.stockList.forEach((stock: any) => {
      this.plPondCost += (stock.plCount * stock.plPrice);
      this.plFarmCost += (stock.plCount * stock.plPrice);
      this.plPondCost = this.plPondCost / this.pondsCount;
      this.plFarmCost = this.plFarmCost / this.farmsCount;
    });
    this.pieChartPondData.push(this.plPondCost);
    this.pieChartFarmData.push(this.plFarmCost);
  }

  calculateotherCost() {
    this.pondList.forEach((pond: any) => {
      this.otherPondCost += (pond.fixedCost);
      this.otherFarmCost += (pond.fixedCost);
      this.otherPondCost = this.otherPondCost / this.pondsCount;
      this.otherFarmCost = this.otherFarmCost / this.farmsCount;
    });
    this.pieChartPondData.push(this.otherPondCost);
    this.pieChartFarmData.push(this.otherFarmCost);
  }

  ngOnDestroy() {
    if (this.dashboardSubscription && this.dashboardSubscription.length > 0) {
      this.dashboardSubscription.forEach(s => {
        s.unsubscribe();
      })
    }
  }

}
