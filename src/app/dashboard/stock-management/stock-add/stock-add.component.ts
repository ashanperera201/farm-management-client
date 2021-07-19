import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { StockModel } from '../../../shared/models/stock-model';
import { ClubMemberService } from 'src/app/shared/services/club-member.service';
import { FarmService } from 'src/app/shared/services/farm.service';
import { PondService } from 'src/app/shared/services/pond.service';
import { StockService } from 'src/app/shared/services/stock.service';

@Component({
  selector: 'app-stock-add',
  templateUrl: './stock-add.component.html',
  styleUrls: ['./stock-add.component.scss']
})
export class StockAddComponent implements OnInit, DoCheck {

  @Input() isEditMode: boolean = false;
  @Input() existingStock: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Stocking';
  pondList: any[] = [];
  addStockForm!: FormGroup;
  farmList: any[] = [];
  ownerList: any[] = [];
  model: NgbDateStruct;
  stockSubscriptions: Subscription[] = [];

  constructor(
    private pondService: PondService,
    private stockService: StockService,
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private parserFormatter: NgbDateParserFormatter) {
    this.model = {
      year: 0,
      month: 0,
      day: 0
    }
  }

  ngOnInit(): void {
    this.initAddStockForm();
    this.fetchInitialData();
    this.configValues();
  }

  ngDoCheck() {
    this.addStockForm.get('actualPlRemains')?.patchValue(this.addStockForm.value.plCount);
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Stock";
      this.patchExistsForm();
    } else {
      const current = new Date();
      this.model = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };
      this.addStockForm.get('dateOfStocking')?.patchValue(this.model);
    }
  }

  patchExistsForm = () => {
    let dateFormat = moment(this.existingStock.dateOfStocking).format('YYYY-MM-DD').split('-')
    this.model.year = +dateFormat[0];
    this.model.month = +dateFormat[1];
    this.model.day = +dateFormat[2];

    const stockForm = this.existingStock;
    stockForm.owner = stockForm.owner._id;
    stockForm.pond = stockForm.pond._id;
    stockForm.farmer = stockForm.farmer._id;
    stockForm.dateOfStocking = this.model;

    // TODO : CALCULATE ACTUAL PL'S REMAIINGS.

    // DO THIS IN BACK END.
    // TAKE DATE DATE
    // TAKE CURRENT DATE
    // MAKE DIFFERENCE BETWEEN CURRENT DATE AND TEH CREATED DATE
    // CHECK 28 DAYS
    // IF YES ? 
    // * TAKE EXPECTED SURVIVAL PERCENTAGE FROM WEEKLY SAMPLING FORM
    // * TAKE NO OF PL'S HARVEST FROM HARVEST MANAGEMENT FORM.
    // AND FORMULATE : ( EXPECTED SURVIVAL PERCENTAGE * NO PL'S ) - NO OF PL'S HARVEST

    this.addStockForm.patchValue(this.existingStock);
  }

  initAddStockForm = () => {
    this.addStockForm = new FormGroup({
      farmer: new FormControl(null, Validators.compose([Validators.required])),
      owner: new FormControl(null, Validators.compose([Validators.required])),
      pond: new FormControl(null, Validators.compose([Validators.required])),
      plCount: new FormControl(null, Validators.compose([Validators.required])),
      plAge: new FormControl(null, Validators.compose([Validators.required])),
      dateOfStocking: new FormControl(null, Validators.compose([Validators.required])),
      fullStocked: new FormControl(null, Validators.compose([Validators.required])),
      plPrice: new FormControl(null, Validators.compose([Validators.required])),
      actualPlRemains: new FormControl(null, Validators.compose([Validators.required])),
    });

    this.addStockForm.controls['actualPlRemains'].disable();
  }

  clearAddStockForm = () => {
    this.addStockForm.reset();
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching........');
    this.stockSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((clubMemberResults: any) => {
      if (clubMemberResults && clubMemberResults.result) {
        this.ownerList = clubMemberResults.result;
      }
      return this.farmService.fetchFarms();
    })).pipe(switchMap((farmResult: any) => {
      if (farmResult && farmResult.result) {
        this.farmList = farmResult.result;
      }
      return this.pondService.fetchPonds();
    })).subscribe((pondResult: any) => {
      if (pondResult && pondResult.result) {
        this.pondList = pondResult.result;
      }
      this.blockUI.stop();
    }, () => {
      console.log('Failed to load initial data.');
      this.blockUI.stop();
    }))
  }

  fetchFarmsOwnerWise = (owner: number) => {
    this.farmService.fetchFarmByowner(owner).subscribe(res => {
      if (res && res.result) {
        this.farmList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load Farms", "Error");
    });
  }

  saveStock = () => {

    if (this.addStockForm.valid) {

      const owner: any = this.ownerList.find(x => x._id === this.addStockForm.value.owner);
      const farmer: any = this.farmList.find(x => x._id === this.addStockForm.value.farmer);
      const pond: any = this.pondList.find(x => x._id === this.addStockForm.value.pond);

      if (this.isEditMode) {
        const stock = this.existingStock;
        stock.owner = this.addStockForm.value.owner;
        stock.farmer = this.addStockForm.value.farmer;
        stock.pond = this.addStockForm.value.pond;
        stock.plCount = this.addStockForm.value.plCount;
        stock.plAge = this.addStockForm.value.plAge;
        stock.dateOfStocking = this.parserFormatter.format(this.addStockForm.value.dateOfStocking);
        stock.fullStocked = this.addStockForm.value.fullStocked;
        stock.plPrice = this.addStockForm.value.plPrice;
        stock.actualPlRemains = this.addStockForm.value.actualPlRemains;

        this.stockService.updateStock(stock).subscribe(res => {
          if (res) {
            stock.owner = owner;
            stock.farmer = farmer;
            stock.pond = pond;
            this.afterSave.emit(stock);
            this.toastrService.success("Stock data updated successfully.", "Successfully Saved");
            this.closeModal();
          }
        }, () => {
          this.toastrService.error("Unable to update stock data", "Error");
        });
      } else {
        const stock = new StockModel();
        const stockForm = this.addStockForm.getRawValue();

        stock.owner = stockForm.owner;
        stock.farmer = stockForm.farmer;
        stock.pond = stockForm.pond;
        stock.plCount = stockForm.plCount;
        stock.plAge = stockForm.plAge;
        stock.dateOfStocking = this.parserFormatter.format(stockForm.dateOfStocking);
        stock.fullStocked = stockForm.fullStocked;
        stock.plPrice = stockForm.plPrice;
        stock.actualPlRemains = stockForm.actualPlRemains;

        this.stockService.saveStock(stock).subscribe(res => {
          if (res && res.result) {
            this.afterSave.emit(res.result);
            this.closeModal();
            this.toastrService.success("Stock data saved successfully.", "Successfully Saved");
          }
        }, () => {
          this.toastrService.error("Unable to save stock data", "Error");
        });
      }
    }
  }

  closeModal = () => {
    this.activeModal.close();
  }

}
