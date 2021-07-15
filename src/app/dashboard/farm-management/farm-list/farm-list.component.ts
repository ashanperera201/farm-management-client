import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { FarmService } from 'src/app/shared/services/farm.service';
import { FarmAddComponent } from '../farm-add/farm-add.component';

@Component({
  selector: 'app-farm-list',
  templateUrl: './farm-list.component.html',
  styleUrls: ['./farm-list.component.scss']
})
export class FarmListComponent implements OnInit {

  farmList = [];

  constructor(private farmService: FarmService,
    private toastrService: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetchFarmList();
  }

  fetchFarmList = () => {

  }

  addNewFarm = () => {
    const addFeedBrandModal = this.modalService.open(FarmAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
  }


  updateFarm = (farmId: any) => {
    const addFeedBrandModal = this.modalService.open(FarmAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addFeedBrandModal.componentInstance.roleId = farmId;
    addFeedBrandModal.componentInstance.isEditMode = true;
    addFeedBrandModal.componentInstance.afterSave = this.farmAfterSave();
  }

  farmAfterSave = () => {

  }

  deleteFarm = (farmId: any) => {

  }


  exportFarmList = (type: any) => {
    if (type == ExportTypes.CSV) {

    }
    else {

    }
  }

  importFarms = () => {

  }
}
