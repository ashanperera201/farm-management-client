import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FileService } from '../../../shared/services/file.service';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FarmService } from '../../../shared/services/farm.service';
import { FarmAddComponent } from '../farm-add/farm-add.component';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState, removeFarmManagement, setFarmManagement, updateFarmManagement } from '../../../redux';
import { CustomAlertComponent } from 'src/app/shared/components/custom-alert/custom-alert.component';
import { CustomAlertService } from 'src/app/shared/components/custom-alert/custom-alert.service';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';

@Component({
  selector: 'app-farm-list',
  templateUrl: './farm-list.component.html',
  styleUrls: ['./farm-list.component.scss']
})
export class FarmListComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI!: NgBlockUI;

  isAllChecked!: boolean;
  farmList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  farmListSubscriptions: Subscription[] = [];
  isFarmer!: boolean | undefined;

  constructor(
    private farmService: FarmService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private store: Store<AppState>,
    private customAlertService: CustomAlertService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit(): void {
    this.isFarmer = this.loggedUserService.getUserRoles().some(x => x === 'FARMER');
    this.fetchFarmList();
  }

  fetchFarmList = () => {
    this.blockUI.start("Fetching data....");
    this.farmListSubscriptions.push(this.farmService.fetchFarms().subscribe(res => {
      if (res && res.result) {
        this.farmList = this.isFarmer ? res.result.filter((x: any) => x.createdBy === this.loggedUserService.getLoggedUserId()) : res.result;
        this.store.dispatch(setFarmManagement(res.result));
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Unable to load Farm data", "Error");
      this.blockUI.stop();
    }));
  }

  addNewFarm = () => {
    const addFarmModal = this.modalService.open(FarmAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    if (addFarmModal.componentInstance.afterSave) {
      this.farmListSubscriptions.push(addFarmModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
          this.farmList = Object.assign([], this.farmList)
          this.farmList.unshift(res);
        }
      }));
    }
  }

  updateFarm = (farm: any) => {
    this.blockUI.start("Fetching data.....");
    const updateModal = this.modalService.open(FarmAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });

    updateModal.componentInstance.existingFarm = JSON.parse(JSON.stringify(farm));
    updateModal.componentInstance.isEditMode = true;

    if (updateModal.componentInstance.afterSave) {
      updateModal.componentInstance.afterSave.subscribe((afterSaveRes: any) => {
        if (afterSaveRes) {
          const index = this.farmList.findIndex((up: any) => up._id === afterSaveRes._id);
          let farmRefs = JSON.parse(JSON.stringify(this.farmList));
          farmRefs[index].farmName = afterSaveRes.farmName;
          farmRefs[index].contactNo = afterSaveRes.contactNo;
          farmRefs[index].address = afterSaveRes.address;
          farmRefs[index].pondCount = afterSaveRes.pondCount;
          farmRefs[index].owner = afterSaveRes.owner;
          this.farmList = [...farmRefs]

          this.store.dispatch(updateFarmManagement(this.farmList[index]));
        }
      });
    }
  }

  deleteSelected = () => {
    const deleteModal = this.customAlertService.openDeleteconfirmation();

    (deleteModal.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {
      deleteModal.close();
    });

    (deleteModal.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
      this.blockUI.start('Deleting....');
      const farmIds: string[] = (this.farmList.filter(x => x.isChecked === true)).map(x => x._id);
      if (farmIds && farmIds.length > 0) {
        this.proceedDelete(farmIds);
      } else {
        this.toastrService.error("Please select farms to delete.", "Error");
        this.blockUI.stop();
      }
      deleteModal.close();
    });
  }

  deleteFarmRecord = (farmerId: any) => {
    const deleteModal = this.customAlertService.openDeleteconfirmation();

    (deleteModal.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {
      deleteModal.close();
    });

    (deleteModal.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
      this.blockUI.start('Deleting....');
      this.proceedDelete([].concat(farmerId));
      deleteModal.close();
    });
  }

  proceedDelete = (farmIds: string[]) => {
    let form = new FormData();
    form.append("farmDetailIds", JSON.stringify(farmIds));

    this.farmListSubscriptions.push(this.farmService.deleteFarms(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        this.blockUI.stop();
        farmIds.forEach(e => { const index: number = this.farmList.findIndex((up: any) => up._id === e); this.farmList.splice(index, 1); });
        this.store.dispatch(removeFarmManagement(farmIds));
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
      this.farmList = this.farmList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.farmList = this.farmList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.farmList[index]['isChecked'] = !this.farmList[index]['isChecked'];
  }

  exportFarmList = (type: any) => {
    if (type === ExportTypes.CSV) {
      const csvData: any[] = this.farmList.map(x => {
        return {
          'Owner': `${x.owner.firstName} ${x.owner.lastName}`,
          'Farm': x.farmName,
          'No of Pond': x.pondCount,
          'Created By': x.createdBy,
          'Contact No': x.contactNo,
          'Address': x.address,
        }
      });
      this.fileService.exportAsExcelFile(csvData, "Farms_Data");
    }
    else {
      const pdfData: any[] = this.farmList.map(x => {
        return {
          'Owner': `${x.owner.firstName} ${x.owner.lastName}`,
          'Farm': `${x.farmName}`,
          'No of Pond': x.pondCount,
          'Contact No': x.contactNo,
          'Address': x.address
        }
      });
      const headers: any[] = ['Owner', 'Farm', 'No of Pond', 'Contact No', 'Address'];
      this.fileService.exportToPDF("Farms Data", headers, pdfData, 'Farms_Data');
    }
  }

  importFarms = () => {
  }

  ngOnDestroy() {
    if (this.farmListSubscriptions && this.farmListSubscriptions.length > 0) {
      this.farmListSubscriptions.forEach(res => {
        res.unsubscribe();
      })
    }
  }
}
