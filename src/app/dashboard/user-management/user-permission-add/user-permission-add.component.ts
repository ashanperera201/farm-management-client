import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from '../../../shared/services/user-management.service';

@Component({
  selector: 'app-user-permission-add',
  templateUrl: './user-permission-add.component.html',
  styleUrls: ['./user-permission-add.component.scss']
})
export class UserPermissionAddComponent implements OnInit, OnDestroy {

  @Input() isEditMode!: boolean;
  @Input() existingRecord!: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  permissionFormGroup!: FormGroup;
  headerText: string = 'Add Permission';
  saveButtonText: string = 'Save Permission';
  permissionSubscriptions: Subscription[] = [];

  constructor(private activeModal: NgbActiveModal, private userManagementService: UserManagementService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.fetchExistingRecord();
  }

  initializeFormGroup = () => {
    this.permissionFormGroup = new FormGroup({
      permissionCode: new FormControl(null, Validators.required),
      permissionName: new FormControl(null, Validators.required),
      permissionDescription: new FormControl(null, Validators.required)
    })
  }

  fetchExistingRecord = () => {
    if (this.existingRecord) {
      this.permissionFormGroup.patchValue(this.existingRecord);
    }
  }

  proceedSaveUpdate = () => {
    if (this.permissionFormGroup.valid) {
      const userPermission = this.permissionFormGroup.getRawValue();
      if (this.existingRecord) {
        this.existingRecord.permissionCode = userPermission.permissionCode;
        this.existingRecord.permissionName = userPermission.permissionName;
        this.existingRecord.permissionDescription = userPermission.permissionDescription;

        this.permissionSubscriptions.push(this.userManagementService.updateUserPermission(this.existingRecord).subscribe(updatedResult => {
          if (updatedResult) {
            this.toastrService.success('Successfully udpated.', 'Success');
            this.closeModal();
            this.afterSave.emit(this.existingRecord);
          }
        }));
      } else {
        this.permissionSubscriptions.push(this.userManagementService.saveUserPermission(userPermission).subscribe(savedResult => {
          if (savedResult) {
            this.toastrService.success('Successfully saved.', 'Success');
            this.closeModal();
            this.afterSave.emit(savedResult);
          }
        }, () => {
          this.toastrService.error('Failed to save.', 'Error');
        }));
      }
    }
  }

  closeModal = () => {
    this.activeModal.close();
  }

  ngOnDestroy() {
    if (this.permissionSubscriptions && this.permissionSubscriptions.length > 0) {
      this.permissionSubscriptions.forEach(res => {
        res.unsubscribe();
      })
    }
  }
}
