import { Component, OnInit } from '@angular/core';
import {ExportTypes} from '../../../shared/enums/export-type';
import {FarmAddComponent} from '../../farm-management/farm-add/farm-add.component';
import * as moment from 'moment';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ToastrService} from 'ngx-toastr';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileService} from '../../../shared/services/file.service';
import {HarvestService} from '../../../shared/services/harvest.service';
import {HarvestAddComponent} from '../harvest-add/harvest-add.component';

@Component({
  selector: 'app-harvest-list',
  templateUrl: './harvest-list.component.html',
  styleUrls: ['./harvest-list.component.scss']
})
export class HarvestListComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  isAllChecked!: boolean;
  harvestList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize = 10;
  page = 1;

  constructor(private harvestService: HarvestService,
              private toastrService: ToastrService,
              private modalService: NgbModal,
              private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchHarvestList();
  }

  fetchHarvestList = () => {
    this.blockUI.start('Fetching data....');
    this.harvestService.fetchHarvests().subscribe(res => {
      if (res && res.result) {
        this.harvestList = res.result;
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Unable to load Farm data", "Error');
      this.blockUI.stop();
    });
  }

  addNewHarvest = () => {
    const addFarmModal = this.modalService.open(HarvestAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    if (addFarmModal.componentInstance.afterSave) {
      addFarmModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
          this.harvestList.unshift(res);
        }
      });
    }
  }

  updateFarm = (harvest: any) => {
    const updateModal = this.modalService.open(FarmAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });

    updateModal.componentInstance.existingFarm = JSON.parse(JSON.stringify(harvest));
    updateModal.componentInstance.isEditMode = true;

    if (updateModal.componentInstance.afterSave) {
      updateModal.componentInstance.afterSave.subscribe((afterSaveRes: any) => {
        if (afterSaveRes) {
          const index = this.harvestList.findIndex((up: any) => up._id === afterSaveRes._id);

        }
      });
    }
  }

  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const harvestIds: string[] = (this.harvestList.filter(x => x.isChecked === true)).map(x => x._id);
    if (harvestIds && harvestIds.length > 0) {
      this.proceedDelete(harvestIds);
    } else {
      this.toastrService.error('Please select farms to delete.', 'Error');
      this.blockUI.stop();
    }
  }

  deleteHarvestRecord = (harvestId: any) => {
    this.blockUI.start('Deleting....');
    this.proceedDelete([].concat(harvestId));
  }

  proceedDelete = (harvestIds: string[]) => {
    let form = new FormData();
    form.append('harvestIds', JSON.stringify(harvestIds));

    this.harvestService.deleteHarvest(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        harvestIds.forEach(e => { const index: number = this.harvestList.findIndex((up: any) => up._id === e); this.harvestList.splice(index, 1); });
        this.toastrService.success('Successfully deleted.', 'Success');
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    });
  }

  onSelectionChange = () => {
    if (this.isAllChecked) {
      this.harvestList = this.harvestList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.harvestList = this.harvestList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.harvestList[index]['isChecked'] = !this.harvestList[index]['isChecked'];
  }

  exportFarmList = (type: any) => {
    if (type === ExportTypes.CSV) {
      const csvData: any[] = this.harvestList.map(x => {
        return {
          'Club Member': x.clubMember,
          'Farm': x.farm,
          'Pond': x.pond,
          'Harvest Date': moment(x.harvestDate).format('YYYY-MM-DD'),
          'Harvest Type': x.harvestType,
          'Harvest Qty': x.harvestQty,
          'Harvest AwB': x.harvestAwB,
          'Number of PL\'s Harvested': x.harvestQty / x.harvestAwB,
          'Harvest Sales Price': x.salesPrice
        };
      });
      this.fileService.exportAsExcelFile(csvData, "Farms_Data");
    }
    else {
      const pdfData: any[] = this.harvestList.map(x => {
        return {
          'Club Member': x.clubMember,
          'Farm': x.farm,
          'Pond': x.pond,
          'Harvest Date': moment(x.harvestDate).format('YYYY-MM-DD'),
          'Harvest Type': x.harvestType,
          'Harvest Qty': x.harvestQty,
          'Harvest AwB': x.harvestAwB,
          'Number of PL\'s Harvested': x.harvestQty / x.harvestAwB,
          'Harvest Sales Price': x.salesPrice
        };
      });
      const headers: any[] = ['Club Member', 'Farm', 'Pond', 'Harvest Date', 'Harvest Type'];
      this.fileService.exportToPDF('Harvest Data', headers, pdfData, 'Farms_Data');
    }
  }

  importHarvest = () => {

  }
}
