import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FileService } from '../../../shared/services/file.service';
import { WeeklySamplingService } from '../../../shared/services/weekly-sampling.service';
import { WeeklySamplingAddComponent } from '../weekly-sampling-add/weekly-sampling-add.component';

@Component({
  selector: 'app-weekly-sampling-list',
  templateUrl: './weekly-sampling-list.component.html',
  styleUrls: ['./weekly-sampling-list.component.scss']
})

export class WeeklySamplingListComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  weeklySamplingSubscriptions: Subscription[] = [];
  isAllChecked!: boolean;
  weelySamplingList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;

  constructor(
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private weeklySamplingService: WeeklySamplingService
  ) { }

  ngOnInit(): void {
    this.fetchWeeklySamplingData();
  }

  fetchWeeklySamplingData = () => {
    this.blockUI.start('Fetching....');
    this.weeklySamplingSubscriptions.push(this.weeklySamplingService.getAllWeeklySamplings().subscribe((samplingResponse: any) => {
      if (samplingResponse && samplingResponse.validity) {
        this.weelySamplingList = samplingResponse.result;
      }
      this.blockUI.stop();
    }, () => {
      console.log('Failed to fetch weekly sampling data.');
      this.blockUI.stop();
    }))
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

  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const weeklySamplingIds: string[] = (this.weelySamplingList.filter(x => x.isChecked === true)).map(x => x._id);
    if (weeklySamplingIds && weeklySamplingIds.length > 0) {
      this.proceedDelete(weeklySamplingIds);
    } else {
      this.toastrService.error("Please select weekly samplings to delete.", "Error");
      this.blockUI.stop();
    }
  }

  deleteWeeklySamplingRecord = (weeklySamplingIds: any) => {
    this.blockUI.start('Deleting....');
    this.proceedDelete([].concat(weeklySamplingIds));
  }

  proceedDelete = (weeklySamplingIds: string[]) => {
    let form = new FormData();
    form.append("weeklySampleIds", JSON.stringify(weeklySamplingIds));

    this.weeklySamplingSubscriptions.push(this.weeklySamplingService.deleteWeeklySampling(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        weeklySamplingIds.forEach(e => { const index: number = this.weelySamplingList.findIndex((up: any) => up._id === e); this.weelySamplingList.splice(index, 1); });
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
      this.weelySamplingList = this.weelySamplingList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.weelySamplingList = this.weelySamplingList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.weelySamplingList[index]['isChecked'] = !this.weelySamplingList[index]['isChecked'];
  }


  exportWeeklySampling = (type: any) => {

  }

  importWeeklySampling = () => {

  }

}
