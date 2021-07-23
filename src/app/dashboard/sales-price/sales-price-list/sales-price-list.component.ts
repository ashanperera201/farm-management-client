import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppState, removeSalesPrice } from 'src/app/redux';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { FileService } from 'src/app/shared/services/file.service';
import { SalesPriceService } from 'src/app/shared/services/sales-price.service';
import { SalesPriceAddComponent } from '../sales-price-add/sales-price-add.component';

@Component({
  selector: 'app-sales-price-list',
  templateUrl: './sales-price-list.component.html',
  styleUrls: ['./sales-price-list.component.scss']
})
export class SalesPriceListComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  salesPriceSubscriptions: Subscription[] = [];
  isAllChecked!: boolean;
  salesPriceList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;

  constructor(
    private salesPriceService: SalesPriceService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.fetchSalesPrice();
  }

  fetchSalesPrice = () => {
    this.blockUI.start('Fetching Data......');
    this.salesPriceSubscriptions.push(this.salesPriceService.fetchSalesPrice().subscribe(res => {
      if (res && res.result) {
        this.salesPriceList = res.result;
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Failed to load Data", "Error");
      this.blockUI.stop();
    }));
  }

  addNewSalesPrice = () => {
    const addSalesPriceModal = this.modalService.open(SalesPriceAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addSalesPriceModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res && res.result) {
        this.salesPriceList.unshift(res.result);
      }
    });
  }

  updateSalesPrice = (salesPrice: any) => {
    const updateSalesPriceModal = this.modalService.open(SalesPriceAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    updateSalesPriceModal.componentInstance.existingWeeklyApplication = salesPrice;
    updateSalesPriceModal.componentInstance.isEditMode = true;
    if (updateSalesPriceModal.componentInstance.afterSave) {
      updateSalesPriceModal.componentInstance.afterSave.subscribe((res: any) => {
        // if (res) {
        //   const index = this.salesPriceList.findIndex((up: any) => up._id === res._id);
        //   this.salesPriceList[index].owner = res.owner;
        // }
      });
    }
  }


  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const pfIds: string[] = (this.salesPriceList.filter(x => x.isChecked === true)).map(x => x._id);
    if (pfIds && pfIds.length > 0) {
      this.proceedDelete(pfIds);
    } else {
      this.toastrService.error("Please select items to delete.", "Error");
      this.blockUI.stop();
    }
  }

  deleteRecord = (pfId: any) => {
    this.blockUI.start('Deleting....');
    this.proceedDelete([].concat(pfId));
  }

  proceedDelete = (salesPriceIds: string[]) => {
    let form = new FormData();
    form.append("salesPriceIds", JSON.stringify(salesPriceIds));

    this.salesPriceSubscriptions.push(this.salesPriceService.deleteSalesPrice(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        salesPriceIds.forEach(e => { const index: number = this.salesPriceList.findIndex((up: any) => up._id === e); this.salesPriceList.splice(index, 1); });
        this.store.dispatch(removeSalesPrice(salesPriceIds));
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
      this.salesPriceList = this.salesPriceList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.salesPriceList = this.salesPriceList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.salesPriceList[index]['isChecked'] = !this.salesPriceList[index]['isChecked'];
  }

  exportSalesPriceList = (type: any) => {
    const dataSet: any[] = this.salesPriceList.map(x => {
      return {
        'Farm': `${x.farmer.farmName}`,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD')
      }
    });

    if (type === ExportTypes.CSV) {
      this.fileService.exportAsExcelFile(dataSet, "Sales_Price_Data");
    }
    else {
      const headers: any[] = ['Farm', 'Created On'];
      this.fileService.exportToPDF("Sales Price Data", headers, dataSet, 'Sales_Price_Data');
    }
  }

  importWeeklySampling = () => {

  }

}
