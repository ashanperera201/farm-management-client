import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FileService } from '../../../shared/services/file.service';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FarmService } from '../../../shared/services/farm.service';
import { FarmAddComponent } from '../farm-add/farm-add.component';
import * as moment from 'moment';

@Component({
  selector: 'app-farm-list',
  templateUrl: './farm-list.component.html',
  styleUrls: ['./farm-list.component.scss']
})
export class FarmListComponent implements OnInit {

  farmList :any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  
  constructor(
    private farmService: FarmService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchFarmList();
  }

  fetchFarmList = () => {
    this.farmService.fetchFarms().subscribe(res => {
    if(res && res.result){
      this.farmList = res.result;
    }
    }, () => {
      this.toastrService.error("Unable to load Farm data","Error");
    });
  }

  addNewFarm = () => {
    const addFarmModal = this.modalService.open(FarmAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    if (addFarmModal.componentInstance.afterSave) {
      addFarmModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res && res.farmDetail) {
          this.farmList.unshift(res.farmDetail);
        }
      });
    }
  }


  updateFarm = (farm: any) => {
    const addFarmModal = this.modalService.open(FarmAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addFarmModal.componentInstance.existingFarm = farm;
    addFarmModal.componentInstance.isEditMode = true;
  }
  deleteFarm = (farmIds: any) => {
    const farmDetailIds = JSON.stringify([].concat(farmIds));
    let form = new FormData();
    form.append("farmDetailIds", farmDetailIds);
  
    this.farmService.deleteFarms(form).subscribe(res => {
       if(res && this.farmList.length > 0){
        let deletedIndex =  this.farmList.indexOf(this.farmList.filter(a=> a._id == farmIds)[0]);
        this.farmList.splice(deletedIndex, 1);
        this.toastrService.success("Farm deleted successfully","Success");
       }
     }, () => {
      this.toastrService.error("Unable to delete Farm","Error");
     });
  }


  exportFarmList = (type: any) => {
    if (type === ExportTypes.CSV) {
      const csvData: any[] = this.farmList.map(x => {
        return {
          'Owner': x.owner,
          'Farm': x.farmName,
          'Client Tenent': x.clientTenentId,
          'Country Code': x.countryCode,
          'Created By': x.createdBy,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
          'Contact No': x.contactNo,
          'Address': x.address,
          'Pond Count': x.pondCount
        }
      });
      this.fileService.exportAsExcelFile(csvData, "Farms_Data");
    }
    else {
      const pdfData: any[] = this.farmList.map(x => {
        return {
          'Owner': x.owner,
          'Farm': x.farmName,
          'Client Tenent': x.clientTenentId,
          'Country Code': x.countryCode,
          'Created By': x.createdBy,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
          'Contact No': x.contactNo,
          'Address': x.address,
          'Pond Count': x.pondCount
        }
      });
      const headers: any[] = ['Owner', 'Farm', 'Client Tenent', 'Country Code', 'Created By', 'Created On', 'Contact No','Address','Pond Count' ];
      this.fileService.exportToPDF("Farms Data", headers, pdfData, 'Farms_Data');
    }
  }

  importFarms = () => {

  }
}
