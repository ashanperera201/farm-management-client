import { SalesPriceService } from './../../../shared/services/sales-price.service';
import { selectApplication } from './../../../redux/selectors/applications.selector';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { AppState, selectClubMember, selectDailyFeed, selectFarmManagement, selectStockDetails, selectWeeklyApplication, selectWeeklySamplings } from '../../../redux';
import { PondService } from '../../../shared/services/pond.service';
import { WeeklyApplicationsService } from '../../../shared/services/weekly-applications.service';

@Component({
  selector: 'app-weekly-performance-report',
  templateUrl: './weekly-performance-report.component.html',
  styleUrls: ['./weekly-performance-report.component.scss']
})
export class WeeklyPerformanceReportComponent implements OnInit {

  @Input() initialData: any;

  @BlockUI() blockUI!: NgBlockUI;

  ownerForm! : FormGroup;
  owner! : any;
  farm! : any;
  pond! : any;
  week! : any;
  stock!: any;
  reportSubscription:  Subscription[] = [];
  applicationList: any[] = [];
  ownerList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  stockList: any[] = [];
  salesList: any[] = [];
  dailyFeedList: any[] = [];
  weeklyApplicationList: any[] = [];

  //Report Data Weekly Sales
  gainInWeight : number = 0;
  totalBioMass : number = 0;
  expectedSurvivalPercentage : number = 0;
  averageBodyWeight : number = 0;
  salesPricePerABW : number = 0;
  noOfPl : number = 0;
  totalBioMassGain : number = 0;
  bioMassOnAverage : number = 0;
  weeklyBioMassValueGain : any;
  fromDate! : any;

  //Report Data Weekly Cost
  totalFeed : number = 0;
  weeklyFcr : number = 0; 
  FcrToDate : number = 0; 
  totalFeedCostWeekly : number = 0;
  
  applicationGrandTotal : number = 0;
  dailyFeedTotal : number = 0;
  totalFeedKilloPerWeek : number = 0;
  totalFeedUpToDate : number = 0;
  totalFeedCost : number = 0;
  feedBrandUnitPrice : number = 0;

  //Report Data after Application table
  otherCost : number = 0;
  plCost : number = 0;
  totalCost : number = 0;
  weeklyProfit : number = 0;
  profit : number = 0;
  plPrice : number = 0;

  constructor(
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private pondService: PondService,
    private salesPriceService: SalesPriceService,
    private weeklyApplicationsService: WeeklyApplicationsService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.fetchReportData();
    this.fetchInitialData();
    this.fetchWeeklyApplications();
    //this.fetchApplicationData();
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.reportSubscription.push(this.store.select(selectClubMember).pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.ownerList = ownerRes.result;
        this.owner = this.ownerList.filter(x => x._id == this.initialData?.owner)[0];
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.pondList = resPonds.result;
        this.pond = this.pondList.filter(x => x._id == this.initialData?.pondNo)[0];
      }
      return this.store.select(selectStockDetails)
    })).pipe(switchMap((resStock: any) => {
      if (resStock) {
       this.stock = resStock.filter((x:any)=> x.pond?._id == this.initialData?.pondNo)[0];// && x.createdOn > new Date(this.fromDate))[0];
      }
      return this.salesPriceService.fetchSalesPrice()
    })).pipe(switchMap((resSales: any) => {
      if(resSales && resSales.result){
        this.salesList = resSales.result;
      }
      return this.store.select(selectDailyFeed)
    })).pipe(switchMap((resDailyFeed:any) => {
      if(resDailyFeed){
        this.dailyFeedList = resDailyFeed;
      }
    return this.store.select(selectFarmManagement)
    })).subscribe((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.farmList = farmRes.result;
        this.farm = this.farmList.filter(x => x._id == this.initialData?.farmer)[0];
        this.fetchApplicationData();
      }
    }, () => {
      this.blockUI.stop();
      this.toastrService.error("Unable to fetch data", "Error");
    }))
    this.blockUI.stop();
  }

  fetchReportData = () => {
    this.week = this.initialData?.weekNumber;
    let today = new Date();
    let days = this.initialData?.weekNumber * 7;
    today.setDate(today.getDate() - days);
    this.fromDate = moment(today).format('YYYY-MM-DD');
  }

  fetchApplicationData = () => {
    this.blockUI.start('Fetching Data...');
    this.reportSubscription.push(this.store.select(selectWeeklySamplings).subscribe(res => {
      if(res){
        res.forEach((x:any) => {
          this.gainInWeight = this.gainInWeight + Number.parseInt(x.gainInWeight);
          this.expectedSurvivalPercentage = this.expectedSurvivalPercentage + x.expectedSurvivalPercentage;
          this.averageBodyWeight = this.averageBodyWeight + x.averageBodyWeight;
        }); 
      }
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
      this.toastrService.error("Unable to fetch Application data", "Error");
    }));

    // this.stockList.forEach((x:any) => {
    //   this.noOfPl = this.noOfPl + x.plCount;
    // });

    this.totalBioMass = (this.expectedSurvivalPercentage * this.averageBodyWeight * this.stock.plCount);
    this.salesPricePerABW = this.salesList.filter(y => y.averageBodyWeight == this.averageBodyWeight)[0].salesPrice;
    this.bioMassOnAverage = this.salesPricePerABW * this.totalBioMass;
    this.otherCost = this.totalBioMass * this.pond.fixedCost;
    this.plCost = this.stock.plCount * this.stock.plPrice;
    this.blockUI.stop();
  }

  fetchWeeklyApplications = () => {
    this.reportSubscription.push(this.weeklyApplicationsService.getAllWeeklyApplication().subscribe((res: any) => {
      if(res){
        this.weeklyApplicationList = res.result.filter((x:any) => x.createdOn > this.fromDate);
      }
    }));
  }

  closeModal = () => {
    this.activeModal.close();
  }

  ngOnDestroy() {
    if (this.reportSubscription && this.reportSubscription.length > 0) {
      this.reportSubscription.forEach(s => {
        s.unsubscribe();
      });
    }
  }

}
