import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { FarmService } from 'src/app/shared/services/farm.service';

@Component({
  selector: 'app-farm-list',
  templateUrl: './farm-list.component.html',
  styleUrls: ['./farm-list.component.scss']
})
export class FarmListComponent implements OnInit {

  farmList = [];

  constructor(private farmService: FarmService,
    private toastrService: ToastrService,) { }

  ngOnInit(): void {
    this.fetchFarmList();
  }

  fetchFarmList = () => {

  }

  addNewFarm = () => {

  }


  updateFarm = (farmId: any) => {

  }

  deleteFarm = (farmId: any) => {

  }

  importFarms = () => {

  }

  exportFarmList = (type: any) => {
    if (type == ExportTypes.CSV) {

    }
    else {

    }
  }
}
