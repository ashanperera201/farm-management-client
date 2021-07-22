import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppState } from 'src/app/redux';
import { addWeeklyApplication, updateWeeklyApplication } from 'src/app/redux/actions/weekly-applications.action';
import { WeeklyApplicationModel } from 'src/app/shared/models/weekly-application';
import { ApplicationsService } from 'src/app/shared/services/applications.service';
import { ClubMemberService } from 'src/app/shared/services/club-member.service';
import { FarmService } from 'src/app/shared/services/farm.service';
import { PondService } from 'src/app/shared/services/pond.service';
import { WeeklyApplicationsService } from 'src/app/shared/services/weekly-applications.service';
import { keyPressDecimals, keyPressNumbers } from 'src/app/shared/utils';

@Component({
  selector: 'app-weekly-application-add',
  templateUrl: './weekly-application-add.component.html',
  styleUrls: ['./weekly-application-add.component.scss']
})
export class WeeklyApplicationAddComponent implements OnInit, OnDestroy {

  @Input() isEditMode: boolean = false;
  @Input() existingWeeklyApplication: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Weekly Application';
  feedBrandList: any[] = [];
  memberList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  applicationList: any[] = [];
  existingWeeklyApplications = new WeeklyApplicationModel();
  addWeeklyApplicationForm!: FormGroup;
  weeklyApplicationSubscriptions: Subscription[] = [];
  initialData: any = {
    farmList: [],
    memberList: [],
    pondList: [],
    applicationList: []
  }

  constructor(
    private weeklyApplicationsService: WeeklyApplicationsService,
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private pondService: PondService,
    private applicationsService: ApplicationsService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.initWeeklyApplicationForm();
    this.fetchInitialData();
  }

  initWeeklyApplicationForm = () => {
    this.addWeeklyApplicationForm = new FormGroup({
      clubMember: new FormControl(null, Validators.compose([Validators.required])),
      farm: new FormControl(null, Validators.compose([Validators.required])),
      pond: new FormControl(null, Validators.compose([Validators.required])),
      weekNumber: new FormControl(null, Validators.compose([Validators.required])),
      applicationType: new FormControl(null, Validators.compose([Validators.required])),
      unit: new FormControl(null, Validators.compose([Validators.required])),
      numberUnits: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.weeklyApplicationSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.memberList = ownerRes.result;
        this.initialData.memberList = this.memberList;
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.pondList = resPonds.result;
        this.initialData.farmList = this.pondList;
      }
      return this.applicationsService.fetchApplications()
    })).pipe(switchMap((resApplication: any) => {
      if (resApplication && resApplication.result) {
        this.applicationList = resApplication.result;
        this.initialData.applicationList = this.applicationList;
      }
      return this.farmService.fetchFarms()
    })).subscribe((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.farmList = farmRes.result;
        this.initialData.farmList = this.farmList;
      }
    }))
    this.configValues();
    this.blockUI.stop();
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Weekly Application";

      if (this.existingWeeklyApplication) {
        const form = this.existingWeeklyApplication;
        form.owner = this.existingWeeklyApplication.owner._id;
        form.farmer = this.existingWeeklyApplication.farmer._id;
        form.pond = this.existingWeeklyApplication.pond._id;
        form.applicationType = this.existingWeeklyApplication.applicationType._id;

        this.addWeeklyApplicationForm.patchValue(form);
        this.clubMemberOnChange();
        this.farmOnChange();

        this.addWeeklyApplicationForm.get("clubMember")?.patchValue(form.clubMember);
        this.addWeeklyApplicationForm.get("farm")?.patchValue(form.farm);
        this.addWeeklyApplicationForm.get("pond")?.patchValue(form.pond);
        this.addWeeklyApplicationForm.get("applicationType")?.patchValue(form.applicationType);
      }
    }
  }

  clubMemberOnChange = () => {
    const clubMember = this.addWeeklyApplicationForm.get("clubMember")?.value;
    if (clubMember) {
      const filteredFarmList = this.initialData.farmList.filter((x: any) => x.clubMember && x.clubMember._id === clubMember);
      if (filteredFarmList && filteredFarmList.length > 0) {
        this.farmList = filteredFarmList;
      } else {
        this.farmList = [];
      }
    }
  }

  farmOnChange = () => {
    const clubMember = this.addWeeklyApplicationForm.get("clubMember")?.value;
    const farm = this.addWeeklyApplicationForm.get("farm")?.value;

    if (clubMember && farm) {
      // const stock = this.stockDetails.find(sd => sd.farmer._id === farmer);
      const pondList = this.initialData.pondList.filter((x: any) => (x.farmer && x.farmer._id === farm) && (x.clubMember && x.clubMember._id === clubMember));
      if (pondList && pondList.length > 0) {
        this.pondList = pondList;
      } else {
        this.pondList = [];
      }
    }
  }

  saveOrUpdateWeeklyApplication = () => {
    if (this.addWeeklyApplicationForm.valid) {
      const formRawValues: any = this.addWeeklyApplicationForm.getRawValue();

      const farmer = this.initialData.farmList.find((x: any) => x._id === formRawValues.farmer);
      const clubMember = this.initialData.memberList.find((x: any) => x._id === formRawValues.clubMember);
      const pond = this.initialData.pondList.find((x: any) => x._id === formRawValues.pond);
      const applicationType = this.initialData.applicationTypeList.find((x: any) => x._id === formRawValues.applicationType);

      if (this.isEditMode) {

        const existsWeeklyApplication = this.existingWeeklyApplications;
        existsWeeklyApplication.farmer = formRawValues.farmer;
        existsWeeklyApplication.owner = formRawValues.owner;
        existsWeeklyApplication.pond = formRawValues.pond;
        existsWeeklyApplication.applicationType = formRawValues.applicationType;
        existsWeeklyApplication.unit = formRawValues.unit;
        existsWeeklyApplication.numberOfUnit = formRawValues.numberOfUnit;

        this.weeklyApplicationSubscriptions.push(this.weeklyApplicationsService.updateWeeklyApplication(existsWeeklyApplication).subscribe(serviceRes => {
          if (serviceRes) {
            existsWeeklyApplication.farmer = farmer;
            existsWeeklyApplication.owner = clubMember;
            existsWeeklyApplication.pond = pond;
            existsWeeklyApplication.applicationType = applicationType;

            this.afterSave.emit(existsWeeklyApplication);
            this.store.dispatch(updateWeeklyApplication(existsWeeklyApplication));
            this.toastrService.success('Successfully updated.', 'Success');
            this.closeModal();
          }
        }, () => {
          this.toastrService.error('Failed to update.', 'Error');
        }))

      } else {
        this.blockUI.start('Saving in progress...');
        const formRawValues: any = this.addWeeklyApplicationForm.getRawValue();
        this.weeklyApplicationSubscriptions.push(this.weeklyApplicationsService.saveWeeklyApplication(formRawValues).subscribe((weeklyApplication: any) => {
          if (weeklyApplication && weeklyApplication.validity) {
            const savedResult = weeklyApplication.result.weeklyApplication;

            savedResult.farmer = farmer;
            savedResult.owner = clubMember;
            savedResult.pond = pond;
            savedResult.applicationType = applicationType;

            this.afterSave.emit(savedResult);
            this.store.dispatch(addWeeklyApplication(savedResult));
            this.toastrService.success("Successfully saved.", "Success");
            this.closeModal();
          }
          this.blockUI.stop();
        }, () => {
          this.toastrService.error("Failed to save.", "Error");
          this.blockUI.stop();
        }));
      }
    }
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  onKeyPressChangesDecimal = (event: any): boolean => {
    return keyPressDecimals(event);
  }

  closeModal = () => {
    this.activeModal.close();
  }

  ngOnDestroy(): void {
    if (this.weeklyApplicationSubscriptions && this.weeklyApplicationSubscriptions.length > 0) {
      this.weeklyApplicationSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }


}
