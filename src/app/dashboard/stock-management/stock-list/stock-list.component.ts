import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, addStockDetail, setStockDetails, updateStockDetail, removeStockBulk } from '../../../redux';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FileService } from '../../../shared/services/file.service';
import { StockService } from '../../../shared/services/stock.service';
import { StockAddComponent } from '../stock-add/stock-add.component';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  isAllChecked!: boolean;
  stockList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  stockSubscriptions: Subscription[] = [];

  constructor(
    private stockService: StockService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.fetchStockList();
  }

  fetchStockList = () => {
    this.blockUI.start("Fetching.....");
    //  TODO **: CHECK WHETHER STORE HAS DATA SET OR NOT LATER : VERSIONS.
    this.stockSubscriptions.push(this.stockService.fetchStock().subscribe(res => {
      if (res && res.result) {
        this.stockList = res.result;
        this.store.dispatch(setStockDetails(this.stockList));
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Unable to load Stock data", "Error");
      this.blockUI.stop();
    }));
  }

  addNewStock = () => {
    const addStockModal = this.modalService.open(StockAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-lg',
    });

    if (addStockModal.componentInstance.afterSave) {
      this.stockSubscriptions.push(addStockModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
          this.fetchStockList();
        }
      }));
    }
  }

  updateStock = (stock: any) => {
    const addStockModal = this.modalService.open(StockAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-lg',
    });

    addStockModal.componentInstance.existingStock = JSON.parse(JSON.stringify(stock));
    addStockModal.componentInstance.isEditMode = true;

    if (addStockModal.componentInstance.afterSave) {
      this.stockSubscriptions.push(addStockModal.componentInstance.afterSave.subscribe((afterSaveRes: any) => {
        if (afterSaveRes && afterSaveRes.pond) {
          const index = this.stockList.findIndex((up: any) => up._id === afterSaveRes._id);
          this.stockList[index].farmName = afterSaveRes.farmName;
          this.stockList[index].contactNo = afterSaveRes.contactNo;
          this.stockList[index].address = afterSaveRes.address;
          this.stockList[index].pondNo = afterSaveRes.pondNo;
          this.stockList[index].owner = afterSaveRes.owner;
          // ** 
          this.store.dispatch(updateStockDetail(afterSaveRes));
        }
      }));
    }
  }

  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const stockIds: string[] = (this.stockList.filter(x => x.isChecked === true)).map(x => x._id);
    if (stockIds && stockIds.length > 0) {
      this.proceedDelete(stockIds);
    } else {
      this.toastrService.error("Please select stocks to delete.", "Error");
      this.blockUI.stop();
    }
  }

  deleteFarmRecord = (stockId: any) => {
    this.blockUI.start('Deleting....');
    this.proceedDelete([].concat(stockId));
  }

  proceedDelete = (stockIds: string[]) => {
    let form = new FormData();
    form.append("stockDetailIds", JSON.stringify(stockIds));

    this.stockSubscriptions.push(this.stockService.deleteStock(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        stockIds.forEach(e => { const index: number = this.stockList.findIndex((up: any) => up._id === e); this.stockList.splice(index, 1); });
        this.toastrService.success('Successfully deleted.', 'Success');
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    }));
  }

  onSelectionChange = () => {
    if (this.isAllChecked) {
      this.stockList = this.stockList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.stockList = this.stockList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.stockList[index]['isChecked'] = !this.stockList[index]['isChecked'];
  }

  exportStockList = (type: any) => {
    if (type === ExportTypes.CSV) {
      const csvData: any[] = this.stockList.map(x => {
        return {
          'Owner': `${x.owner.firstName} ${x.owner.lastName}`,
          'Farm': `${x.farmer.farmName}`,
          'Pond': `${x.pond.pondNo}`,
          'Number of PL`s': x.plCount,
          'PL Age': x.plAge,
          'Date of Stocking': moment(x.dateOfStocking).format('YYYY-MM-DD'),
          'Created By': x.createdBy,
          'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
          'Full Stocked': x.fullStocked,
          'PL Price': x.plPrice,
          'Actual PL`s Remain': x.actualPlRemains
        }
      });
      this.fileService.exportAsExcelFile(csvData, "Ponds_Data");
    }
    else {
      const pdfData: any[] = this.stockList.map(x => {
        return {
          'Owner': `${x.owner.firstName} ${x.owner.lastName}`,
          'Farm': `${x.farmer.farmName}`,
          'Pond': `${x.pond.pondNo}`,
          'pl count': x.plCount ? `${x.plCount}` : '-',
          'actual pls': x.actualPlRemains ? `${x.actualPlRemains}` : '-',
          'Date of Stocking': moment(x.dateOfStocking).format('YYYY-MM-DD'),
          'Created By': x.createdBy,
          'Created On': moment(x.createdOn).format('YYYY-MM-DD')
        }
      });
      const headers: any[] = ['Owner', 'Farm', 'Pond', 'pl count', 'actual pls', 'Date of Stocking', 'Created By', 'Created On'];
      this.fileService.exportToPDF("Stock Data", headers, pdfData, 'Stock_Data');
    }
  }

  importStock = () => {

  }

}
