import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from '../../../../app/shared/enums/export-type';
import { PondService } from '../../../../app/shared/services/pond.service';
import { PondAddComponent } from '../pond-add/pond-add.component';

@Component({
  selector: 'app-pond-list',
  templateUrl: './pond-list.component.html',
  styleUrls: ['./pond-list.component.scss']
})
export class PondListComponent implements OnInit {

  pondList: any[] = [];
  filterParam!: string;

  constructor(private pondService: PondService,
    private toastrService: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetchPondsList();
  }

  fetchPondsList = () => {
    this.pondService.fetchPonds().subscribe(res => {
      if (res && res.result) {
        this.pondList = res.result;
      }
    }, error => {
      this.toastrService.error("Unable ot load Pond data", "Error");
    });
  }

  addNewPond = () => {
    const addFeedBrandModal = this.modalService.open(PondAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
  }

  importPonds = () => {

  }

  updatePond = (pond: any) => {
    const addFeedBrandModal = this.modalService.open(PondAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addFeedBrandModal.componentInstance.existingPond = pond;
    addFeedBrandModal.componentInstance.isEditMode = true;
    if (addFeedBrandModal.componentInstance.afterSave) {
      addFeedBrandModal.componentInstance.afterSave.subscribe((result: any) => {

      });
    }
  }


  deletePond = (pondId: any) => {
    const pondIds = JSON.stringify([].concat(pondId));
    let form = new FormData();
    form.append("", pondIds);
  }

  exportPondList = (type: any) => {
    if (type == ExportTypes.CSV) {

    }
    else {

    }
  }

}
