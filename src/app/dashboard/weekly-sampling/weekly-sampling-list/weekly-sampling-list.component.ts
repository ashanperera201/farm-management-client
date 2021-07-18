import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { FileService } from 'src/app/shared/services/file.service';
import { WeeklySamplingAddComponent } from '../weekly-sampling-add/weekly-sampling-add.component';

@Component({
  selector: 'app-weekly-sampling-list',
  templateUrl: './weekly-sampling-list.component.html',
  styleUrls: ['./weekly-sampling-list.component.scss']
})
export class WeeklySamplingListComponent implements OnInit {

  weelySamplingList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;

  constructor(
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
  }

  addNewWeeklySampling = () => {
    const addWeeklySamplingModal = this.modalService.open(WeeklySamplingAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-lg',
    });
    addWeeklySamplingModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res) {
        // this.fetchStockList();
      }
    });
  }

  updateWeelySampling = (weeklySample: any) => {
    const addWeeklySamplingModal = this.modalService.open(WeeklySamplingAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-lg',
    });
    addWeeklySamplingModal.componentInstance.existingStock = weeklySample;
    addWeeklySamplingModal.componentInstance.isEditMode = true;
    if (addWeeklySamplingModal.componentInstance.afterSave) {
      addWeeklySamplingModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res && res.pond) {
          this.weelySamplingList.unshift(res.pond);
        }
      });
    }
  }

  deleteWeelySampling = (stockIds: any) => {
    // const stockDetailIds = JSON.stringify([].concat(stockIds));
    // let form = new FormData();
    // form.append("stockDetailIds", stockDetailIds);

    // this.stockService.deleteStock(form).subscribe(res => {
    //   if (res && this.stockList.length > 0) {
    //     let deletedIndex = this.stockList.indexOf(this.stockList.filter(a => a._id == stockIds)[0]);
    //     this.stockList.splice(deletedIndex, 1);
    //     this.toastrService.success("Stock Data deleted.", "Success");
    //   }
    // }, () => {
    //   this.toastrService.error("Unable to delete Stock data.", "Error");
    // });
  }

  exportWeeklySampling = (type: any) => {
    
  }

  importWeeklySampling = () => {

  }

}
