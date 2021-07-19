import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FileService } from '../../../shared/services/file.service';
import { ExportTypes } from '../../../../app/shared/enums/export-type';
import { PondService } from '../../../../app/shared/services/pond.service';
import { PondAddComponent } from '../pond-add/pond-add.component';
import * as moment from 'moment';

@Component({
  selector: 'app-pond-list',
  templateUrl: './pond-list.component.html',
  styleUrls: ['./pond-list.component.scss']
})
export class PondListComponent implements OnInit {

  pondList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  
  constructor(
    private pondService: PondService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchPondsList();
  }

  fetchPondsList = () => {
    this.pondService.fetchPonds().subscribe(res => {
      if (res && res.result) {
        this.pondList = res.result;
      }
    }, () => {
      this.toastrService.error("Unable to load Pond data","Error");
    });
  }

  addNewPond = () => {
    const addPondModal = this.modalService.open(PondAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addPondModal.componentInstance.afterSave.subscribe((res: any) => {
      if(res){
        this.fetchPondsList();
      }
    });
  }

  updatePond = (pond: any) => {
    const addPondModal = this.modalService.open(PondAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addPondModal.componentInstance.existingPond = pond;
    addPondModal.componentInstance.isEditMode = true;
    if (addPondModal.componentInstance.afterSave) {
      addPondModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res && res.pond) {
          this.pondList.unshift(res.pond);
        }
      });
    }
  }


  deletePond = (pondIds: any) => {
    const pondDetailIds = JSON.stringify([].concat(pondIds));
    let form = new FormData();
    form.append("pondDetailIds", pondDetailIds);
  
     this.pondService.deletePonds(form).subscribe(res => {
       if(res && this.pondList.length > 0){
        let deletedIndex =  this.pondList.indexOf(this.pondList.filter(a=> a._id == pondIds)[0]);
        this.pondList.splice(deletedIndex, 1);
        this.toastrService.success("Pond Data deleted.","Success");
       }
     }, () => {
      this.toastrService.error("Unable to delete Pond data.","Error");
     });
  }

  exportPondList = (type: any) => {
    if (type === ExportTypes.CSV) {
      const csvData: any[] = this.pondList.map(x => {
        return {
          'Owner': x.owner,
          'Farm': x.farmer,
          'Client Tenent': x.clientTenentId,
          'Country Code': x.countryCode,
          'Created By': x.createdBy,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
          'Pond Count': x.pondCount,
          'Area Of Pond': x.areaOfPond,
          'Grade of Pond': x.gradeOfPond,
          'Fixed Cost': x.fixedCost
        }
      });
      this.fileService.exportAsExcelFile(csvData, "Ponds_Data");
    }
    else {
      const pdfData: any[] = this.pondList.map(x => {
        return {
          'Owner': x.owner,
          'Farm': x.farmer,
          'Client Tenent': x.clientTenentId,
          'Country Code': x.countryCode,
          'Created By': x.createdBy,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
          'Pond Count': x.pondCount,
          'Area Of Pond': x.areaOfPond,
          'Grade of Pond': x.gradeOfPond,
          'Fixed Cost': x.fixedCost
        }
      });
      const headers: any[] = ['Owner', 'Farm', 'Client Tenent', 'Country Code', 'Created By', 'Created On', 'Pond Count','Area Of Pond', 'Grade of Pond','Fixed Cost' ];
      this.fileService.exportToPDF("Ponds Data", headers, pdfData, 'Pond_Data');
    }
  }

  importPonds = () => {

  }

}
