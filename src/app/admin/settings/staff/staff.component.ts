import { Component, OnInit, Inject } from '@angular/core';
import { Subject, from } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';
import { AdminSettingsService } from '../_services/admin-settings.service'

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  animal: any;
  isLoaderAdmin: boolean = false;
  StaffCreate: FormGroup;
  addStaffPage: boolean = false;
  staffListPage: boolean = true;
  singleStaffView: boolean = false;
  businessId: any;
  allStaffList: any;
  staffActionId: any = [];
  addPostalCodeId: any = [];
  singleStaffStatus: any;
  singleStaffDetail: any;
  staffImageUrl:any;
  selectedServicesArr:any=[];
  selectedPostalCodeArr:any=[];
  staffInternalStatus : any;
  staffLoginStatus : any;

  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private adminSettingsService: AdminSettingsService,
  ) {
    localStorage.setItem('isBusiness', 'false');
    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
    }
  }

  ngOnInit() {
    this.getAllStaff();
  }

  getAllStaff() {
    this.isLoaderAdmin = true;
    this.adminSettingsService.getAllStaff().subscribe((response: any) => {
      if (response.data == true) {
        this.allStaffList = response.response
        console.log(this.allStaffList);
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.allStaffList = '';
        this.isLoaderAdmin = false;
      }
    })
  }

  fnAddStaffId(event, staffId) {
    if (event == true) {
      this.staffActionId.push(staffId)
    }
    else if (event == false) {
      const index = this.staffActionId.indexOf(staffId, 0);
      if (index > -1) {
        this.staffActionId.splice(index, 1);
      }
    }
  }
  fnActionStaff(action) {
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnActionStaff(action, this.staffActionId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Staff Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.getAllStaff();
        this.staffActionId.length = 0;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnChangeStaffStatus(event, staffId) {
    if (event == true) {
      this.singleStaffStatus = 'E'
    }
    else if (event == false) {
      this.singleStaffStatus = 'D'
    }
    this.staffActionId.push(staffId)
    this.adminSettingsService.fnActionStaff(this.singleStaffStatus, this.staffActionId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Staff Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.getAllStaff();
        this.staffActionId.length = 0;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnViewSingleStaff(staffId) {
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnViewSingleStaff(staffId).subscribe((response: any) => {
      if (response.data == true) {
        this.singleStaffDetail = response.response
        console.log(this.singleStaffDetail);
        this.singleStaffDetail.staff[0].services.forEach(element => {
          this.selectedServicesArr.push(element.id);
        });
        this.singleStaffDetail.staff[0].postal_codes.forEach(element => {
          this.selectedPostalCodeArr.push(element.id);
        });

        this.staffListPage = false;
        this.singleStaffView = true;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnChangeInternalStaff(event, staffId){
    if (event == true) {
      this.staffInternalStatus = 'Y'
    }
    else if (event == false) {
      this.staffInternalStatus = 'N'
    }
    this.adminSettingsService.fnChangeInternalStaff(this.staffInternalStatus, staffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Internal Staff Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnChangeLoginAllowStaff(event, staffId){
    if (event == true) {
      this.staffLoginStatus = 'Y'
    }
    else if (event == false) {
      this.staffLoginStatus = 'N'
    }
    this.adminSettingsService.fnChangeLoginAllowStaff(this.staffLoginStatus, staffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Login Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnAddPostalCodeId(event, postalCodeId) {
    if (event == true) {
      this.addPostalCodeId.push(postalCodeId)
    }
    else if (event == false) {
      const index = this.addPostalCodeId.indexOf(postalCodeId, 0);
      if (index > -1) {
        this.addPostalCodeId.splice(index, 1);
      }
    }
    console.log(this.addPostalCodeId)
  }


  addTimeOff() {
    const dialogRef = this.dialog.open(DialogAddNewTimeOff, {
      width: '500px',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  staffImage() {
    const dialogRef = this.dialog.open(DialogStaffImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.staffImageUrl = result;
            console.log(result);
           }
     });
  }
}
@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/add-new-time-off-dialog.html',
})
export class DialogAddNewTimeOff {

  constructor(
    public dialogRef: MatDialogRef<DialogAddNewTimeOff>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'staff-image-upload',
  templateUrl: '../_dialogs/staff-upload-profile-image-dialog.html',
})
export class DialogStaffImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogStaffImageUpload>,
  private _formBuilder:FormBuilder,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
      this.dialogRef.close(this.profileImage);
    }
    ngOnInit() {
      this.uploadForm = this._formBuilder.group({
        profile: ['']
      });
    }
    get f() {
      return this.uploadForm.controls;
    }
    
onFileChange(event) {
  const reader = new FileReader();
  if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.uploadForm.patchValue({
              fileSource: reader.result
          });
      };
  }
}
uploadImage() {
  this.profileImage = this.imageSrc
  this.dialogRef.close(this.profileImage);
}


}
