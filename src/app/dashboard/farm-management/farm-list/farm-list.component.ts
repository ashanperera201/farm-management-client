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
    this.farmService.fetchFarms().subscribe(res => {
    if(res && res.result){
      this.farmList = res.result;
    }
    }, error => {
      this.toastrService.error("Unable to load Farm data","Error");
    });
  }

  addNewFarm = () => {
    const addFeedBrandModal = this.modalService.open(FarmAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
  }


  updateFarm = (farm: any) => {
    const addFeedBrandModal = this.modalService.open(FarmAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addFeedBrandModal.componentInstance.existingFarm = farm;
    addFeedBrandModal.componentInstance.isEditMode = true;
    addFeedBrandModal.componentInstance.afterSave = this.farmAfterSave();
  }

  farmAfterSave = () => {

  }

  deleteFarm = (farmId: any) => {
    this.farmService.deleteFarms(farmId).subscribe(res => {
      if(res){
        this.toastrService.success("Farm deleted successfully","Success");
      }
    }, error => {
      this.toastrService.error("Unable to delete Farm","Error");
    });
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
