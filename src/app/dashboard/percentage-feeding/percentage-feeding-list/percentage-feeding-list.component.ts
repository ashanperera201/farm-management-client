import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FileService } from '../../../shared/services/file.service';
import { PercentageFeedingAddComponent } from '../percentage-feeding-add/percentage-feeding-add.component';

@Component({
  selector: 'app-percentage-feeding-list',
  templateUrl: './percentage-feeding-list.component.html',
  styleUrls: ['./percentage-feeding-list.component.scss']
})
export class PercentageFeedingListComponent implements OnInit {

  percentageFeedingList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;

  @BlockUI() blockUI!: NgBlockUI;

  constructor(
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.fetchPercentageFeeding();
  }

  fetchPercentageFeeding = () => {
  }

  addNewPercentageFeeding = () => {
    const addPercentageFeedingrModal = this.modalService.open(PercentageFeedingAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addPercentageFeedingrModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res && res.percentageFeeding) {
        this.percentageFeedingList.unshift(res.percentageFeeding);
      }
    });
  }

  updatePercentageFeeding = (percentageFeeding: any) => {
    const updatePercentageFeedingrModal = this.modalService.open(PercentageFeedingAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    updatePercentageFeedingrModal.componentInstance.existingpercentageFeeding = percentageFeeding;
    updatePercentageFeedingrModal.componentInstance.isEditMode = true;
  }

  deletePercentageFeeding = (percentageFeedingID : any) => {
    
  }

  exportPercentageFeedingList = (type: any) => {
    if(type === ExportTypes.CSV){

    }
    else{

    }
  }

  importPercentageFeeding = () => {

  }
}
