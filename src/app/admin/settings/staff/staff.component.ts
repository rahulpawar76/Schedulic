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
  staffImageUrl: any;
  selectedServicesArr: any = [];
  selectedPostalCodeArr: any = [];
  selectedServiceNewStaff: any = [];
  staffInternalStatus: any;
  staffLoginStatus: any;
  selectedStaffId: any;
  singlePostalCodeStatus: any;
  selectedValue: any;
  categoryServiceList: any;
  newStaffData: any;
  updateStaffData: any;
  editStaffId: any;


  
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/

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

    this.StaffCreate = this._formBuilder.group({
      firstname : ['', Validators.required],
      lastname : ['', Validators.required],
      address : ['', Validators.required],
      email : ['', [Validators.required,Validators.pattern(this.emailFormat)]],
      phone : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
      description : [''],
      staff_id : [''],
    });
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
        this.selectedValue = undefined
        this.staffActionId.length = 0;
        this.getAllStaff();
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnChangeStaffStatus(event, staffId) {
    this.isLoaderAdmin = true;
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
    this.selectedStaffId = staffId
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
        console.log(this.selectedPostalCodeArr);

        this.staffListPage = false;
        this.singleStaffView = true;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnChangeInternalStaff(event, staffId) {
    this.isLoaderAdmin = true;
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
  fnChangeLoginAllowStaff(event, staffId) {
    this.isLoaderAdmin = true;
    if (event == true) {
      this.staffLoginStatus = 'Y'
    }
    else if (event == false) {
      this.staffLoginStatus = 'N'
    }
    this.adminSettingsService.fnChangeLoginAllowStaff(this.staffLoginStatus, staffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open(response.response, "X", {
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
  }
  fnAssignPostalToStaff(value) {
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnAssignPostalToStaff(value, this.addPostalCodeId, this.selectedStaffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.selectedPostalCodeArr.length = 0;
        this.fnViewSingleStaff(this.selectedStaffId)
        this.addPostalCodeId.length = 0;
        this.selectedValue = undefined
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnSingleAssignPostalCode(event, postalCodeId) {
    this.isLoaderAdmin = true;
    if (event == true) {
      this.singlePostalCodeStatus = 'E'
    } else if (event == false) {
      this.singlePostalCodeStatus = 'D'
    }
    this.addPostalCodeId.push(postalCodeId)
    this.adminSettingsService.fnAssignPostalToStaff(this.singlePostalCodeStatus, this.addPostalCodeId, this.selectedStaffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.selectedPostalCodeArr.length = 0;
        this.fnViewSingleStaff(this.selectedStaffId)
        this.addPostalCodeId.length = 0;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnAssignServiceToStaff(event, serviceId) {
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnAssignServiceToStaff(event, serviceId, this.selectedStaffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.fnViewSingleStaff(this.selectedStaffId)
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnBackStaffList(){
    this.isLoaderAdmin = true;
    this.addStaffPage = false;
    this.staffListPage = true;
    this.singleStaffView = false;
    this.getAllStaff();
    this.isLoaderAdmin = false;
  }

  fnAddNewStaff(){
    this.isLoaderAdmin = true;
    this.addStaffPage = true;
    this.staffListPage = false;
    this.singleStaffView = false;
    this.isLoaderAdmin = false;
    this.getCateServiceList();
  }

  getCateServiceList(){
    this.isLoaderAdmin = true;
    this.adminSettingsService.getCateServiceList().subscribe((response:any) => {
      if(response.data == true){
        this.categoryServiceList = response.response
        console.log(this.categoryServiceList);
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.categoryServiceList = ''
        this.isLoaderAdmin = false;
      }
    })
  }
  fnCheckService(event,serviceId){
    if(event == true){
      this.selectedServiceNewStaff.push(serviceId) 
    }else if(event == false){
      const index = this.selectedServiceNewStaff.indexOf(serviceId);
      this.selectedServiceNewStaff.splice(index, 1);
    }
    console.log(this.selectedServiceNewStaff);
  }
  fnSubmitCreateStaff(){
    if(this.StaffCreate.get('staff_id').value != ''){
      alert("Edit" + this.StaffCreate.get('staff_id').value);
      if(this.StaffCreate.valid){
        this.updateStaffData = {
          "staff_id" : this.StaffCreate.get('staff_id').value,
          "firstname" : this.StaffCreate.get('firstname').value,
          "lastname" : this.StaffCreate.get('lastname').value,
          "email" : this.StaffCreate.get('email').value,
          "phone" : this.StaffCreate.get('phone').value,
          "address" : this.StaffCreate.get('address').value,
          "servicelist" : this.selectedServiceNewStaff,
          "image" : this.staffImageUrl,
        }
        console.log(this.updateStaffData);
        this.updateStaff(this.updateStaffData);
      }
    }
    else{ 
      if(this.StaffCreate.valid){
        this.newStaffData = {
          "business_id" : this.businessId,
          "firstname" : this.StaffCreate.get('firstname').value,
          "lastname" : this.StaffCreate.get('lastname').value,
          "email" : this.StaffCreate.get('email').value,
          "phone" : this.StaffCreate.get('phone').value,
          "address" : this.StaffCreate.get('address').value,
          "servicelist" : this.selectedServiceNewStaff,
          "image" : this.staffImageUrl,
        }
        console.log(this.newStaffData);
        this.createNewStaff(this.newStaffData);
      }
    }
  }
  createNewStaff(newStaffData){
    this.isLoaderAdmin = true;
    this.adminSettingsService.createNewStaff(newStaffData).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
          });
         this.getAllStaff();
         this.addStaffPage = false;
         this.staffListPage = true;
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){

        this.isLoaderAdmin = false;
      }
    })
  }
  updateStaff(updateStaffData){
    alert("Hello 2")
    this.isLoaderAdmin = true;
    this.adminSettingsService.updateStaff(updateStaffData).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
          });
         this.getAllStaff();
         this.addStaffPage = false;
         this.staffListPage = true;
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){

        this.isLoaderAdmin = false;
      }
    })
  }
  fnDeleteStaff(staffId){
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnDeleteStaff(staffId).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
          });
         this.getAllStaff();
         this.singleStaffView = false;
         this.staffListPage = true;
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.isLoaderAdmin = false;
      }
    })
  }
  fnEditStaff(staffId){
    this.editStaffId = staffId
    this.isLoaderAdmin = true;
    this.addStaffPage = true;
    this.staffListPage = false;
    this.singleStaffView = false;
    this.StaffCreate.controls['firstname'].setValue(this.singleStaffDetail.staff[0].firstname);
    this.StaffCreate.controls['lastname'].setValue(this.singleStaffDetail.staff[0].lastname);
    this.StaffCreate.controls['phone'].setValue(this.singleStaffDetail.staff[0].phone);
    this.StaffCreate.controls['address'].setValue(this.singleStaffDetail.staff[0].address);
    this.StaffCreate.controls['description'].setValue(this.singleStaffDetail.staff[0].description);
    this.StaffCreate.controls['email'].setValue(this.singleStaffDetail.staff[0].email);
    this.StaffCreate.controls['staff_id'].setValue(staffId);
    this.getCateServiceList();
    this.isLoaderAdmin = false;
  }








  addTimeOff() {
    const dialogRef = this.dialog.open(DialogAddNewTimeOff, {
      width: '500px',

    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  staffImage() {
    const dialogRef = this.dialog.open(DialogStaffImageUpload, {
      width: '500px',

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.staffImageUrl = result;
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
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

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
