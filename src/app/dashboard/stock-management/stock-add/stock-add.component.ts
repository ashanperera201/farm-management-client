import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { StockModel } from 'src/app/shared/models/stock-model';
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
  saveButtonText: string = 'Submit';
  headerText: string = 'Add Stocking';
  pondList: any[] = [];
  addStockForm!: FormGroup;
  farmList: any[] = [];
  ownerList: any[] = [];
  model: NgbDateStruct;

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
    this.configValues();
    this.fetchOwnersList();
    this.fetchFarmList();
    this.fetchPondList();
  }

  ngDoCheck() {
    this.addStockForm.get('actualPlRemains')?.patchValue(this.addStockForm.value.plCount);
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Stock";
      let dateFormat = moment(this.existingStock.dateOfStocking).format('YYYY-MM-DD').split('-')
      this.model.year = +dateFormat[0];
      this.model.month = +dateFormat[1];
      this.model.day = +dateFormat[2];
      this.existingStock.dateOfStocking = this.model;
      this.addStockForm.patchValue(this.existingStock);
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

  fetchOwnersList = () => {
    this.clubMemberService.fetchClubMembers().subscribe(res => {
      if (res && res.result) {
        this.ownerList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load owners", "Error");
    });
  }

  fetchFarmList = () => {
    this.farmService.fetchFarms().subscribe(res => {
      if (res && res.result) {
        this.farmList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load Farm", "Error");
    });
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

  fetchPondList = () => {
    this.pondService.fetchPonds().subscribe(res => {
      if (res && res.result) {
        this.pondList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load ponds", "Error");
    });
  }

  saveStock = () => {
    if (this.isEditMode) {
      if (this.addStockForm.valid) {
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
            this.closeModal();
            this.toastrService.success("Stock data updated successfully.", "Successfully Saved");
          }
        }, () => {
          this.toastrService.error("Unable to update stock data", "Error");
        });
      }
    }
    else {
      if (this.addStockForm.valid) {
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
