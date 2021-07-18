import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { FileService } from 'src/app/shared/services/file.service';
import { StockService } from 'src/app/shared/services/stock.service';
import { StockAddComponent } from '../stock-add/stock-add.component';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent implements OnInit {
  stockList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  constructor(
    private stockService: StockService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.fetchStockList();
  }

  fetchStockList = () => {
    this.stockService.fetchStock().subscribe(res => {
      if (res && res.result) {
        this.stockList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load Stock data", "Error");
    });
  }

  addNewStock = () => {
    const addStockModal = this.modalService.open(StockAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-lg',
    });
    addStockModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res) {
        this.fetchStockList();
      }
    });
  }

  updateStock = (stock: any) => {
    const addStockModal = this.modalService.open(StockAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-lg',
    });
    addStockModal.componentInstance.existingStock = stock;
    addStockModal.componentInstance.isEditMode = true;
    if (addStockModal.componentInstance.afterSave) {
      addStockModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res && res.pond) {
          this.stockList.unshift(res.pond);
        }
      });
    }
  }

  deleteStock = (stockIds: any) => {
    const stockDetailIds = JSON.stringify([].concat(stockIds));
    let form = new FormData();
    form.append("stockDetailIds", stockDetailIds);

    this.stockService.deleteStock(form).subscribe(res => {
      if (res && this.stockList.length > 0) {
        let deletedIndex = this.stockList.indexOf(this.stockList.filter(a => a._id == stockIds)[0]);
        this.stockList.splice(deletedIndex, 1);
        this.toastrService.success("Stock Data deleted.", "Success");
      }
    }, () => {
      this.toastrService.error("Unable to delete Stock data.", "Error");
    });
  }

  exportStockList = (type: any) => {
    if (type === ExportTypes.CSV) {
      const csvData: any[] = this.stockList.map(x => {
        return {
          'Owner': x.owner,
          'Farm': x.farmId,
          'Pond': x.pondId,
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
          'Owner': x.owner,
          'Farm': x.farmId,
          'Pond': x.pondId,
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
      const headers: any[] = ['Owner', 'Farm', 'Pond', 'Number of PL`s', 'PL Age', 'Date of Stocking', 'Created By', 'Created On', 'Full Stocked', 'PL Price', 'Actual PL`s Remain'];
      this.fileService.exportToPDF("Stock Data", headers, pdfData, 'Stock_Data');
    }
  }

  importStock = () => {

  }

}
