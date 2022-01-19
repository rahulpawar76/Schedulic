import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StaffService } from '../_services/staff.service';
import { DatePipe} from '@angular/common';
import { AuthenticationService } from '@app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

export interface status {
  
  statuses: string;
  value :string;
  viewValue:string;
  
}
export interface DialogData {
  animal: string;
  name: string;
 
}

@Component({
  selector: 'app-my-work-space',
  templateUrl: './my-work-space.component.html',
  styleUrls: ['./my-work-space.component.scss'],
  providers: [DatePipe]
})
export class MyWorkSpaceComponent implements OnInit {
  

  animal: string;
  todayAppointmentData: any;
  activeBooking: any;
  todayDate: any;
  bussinessId: any;
  settingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;
  staffId :any
  notes:any;
  isLoader:boolean= false;
  token :any;
  dashBGImage:any;
  currentUser:any;
  changeStatusObject : any = [];
  constructor(
    public dialog: MatDialog,
    private StaffService: StaffService,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private titleService: Title

  ) {
    this.currentUser = this.authenticationService.currentUserValue
    this.bussinessId=this.authenticationService.currentUserValue.business_id
    // this.dashBGImage = this.currentUser.staff_bg_image
    this.staffId=JSON.stringify(this.authenticationService.currentUserValue.user_id);
    this.token=this.authenticationService.currentUserValue.token;
  }

  ngOnInit() {
    this.titleService.setTitle('My Workspace');
    this.todayDate = this.datePipe.transform(new Date(),"yyyy/MM/dd");
    this.fnGetSettingValue();
    this.getTodayAppointment();
    this.getProfiledata();
  }

  getProfiledata(){
        this.isLoader=true;
    this.StaffService.getProfiledata().subscribe((response:any) => 
    {
      if(response.data == true){
        this.dashBGImage = response.response.staff_bg_image;
      }else{

      }
        this.isLoader=false;
    })
  }

  fnGetSettingValue(){
    this.isLoader=true;
    let requestObject = {
      "business_id":this.bussinessId
    };
    this.StaffService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr=response.response;
        this.currencySymbol = this.settingsArr.currency;
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        this.currencySymbolFormat = this.settingsArr.currency_format;
      }
      else if(response.data == false){
        
      }
    this.isLoader=false;
    })
  }
  changeBookingStatus(order_item_id, status){
    this.isLoader=true;
    this.changeStatusObject = {
      'order_item_id': order_item_id,
      'order_status': status,
      'notes' : this.notes,
      'staff_id' : this.staffId
    };
    
      this.StaffService.changeStatus(this.changeStatusObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });

          this.StaffService.sendNotification(this.changeStatusObject).subscribe((response: any) => {
            if (response.data == true) {
              this._snackBar.open("Notification Sent", "X", {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: ['green-snackbar']
              });
            }
            else if (response.data == false) {
              this._snackBar.open("Notification Not Sent", "X", {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: ['red-snackbar']
              });
            }
          });
          this.getTodayAppointment();
          
        }
        else if(response.data == false) {
          this._snackBar.open("Appointment Not Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          }); 
        }
        this.isLoader=false;
      });
  }

  getTodayAppointment(){
    this.isLoader=true;
    let requestObject = {
      'staff_id' : this.staffId,
      'business_id': this.bussinessId,
      'staff_token': this.token
    };
    this.StaffService.getTodayAppointment(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.todayAppointmentData = response.response
        this.todayAppointmentData.forEach( (element) => {
          var todayDateTime = new Date();
          element.booking_time=element.booking_date+" "+element.booking_time;
          var dateTemp = new Date(this.datePipe.transform(new Date(element.booking_time),"yyyy/MM/dd HH:mm"));
          var dateTemp1 = new Date(this.datePipe.transform(new Date(element.booking_time),"yyyy/MM/dd HH:mm"));
          dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time));
          dateTemp1.setMinutes( dateTemp1.getMinutes());
          var temp = dateTemp.getTime() - todayDateTime.getTime();
          var temp1 = dateTemp.getTime() - todayDateTime.getTime();
          element.timeToService=(temp1/3600000).toFixed();
          element.booking_time=this.datePipe.transform(new Date(element.booking_time),"HH:mm")
          element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"HH:mm")
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"yyyy/MM/dd")
          element.created_at=this.datePipe.transform(new Date(element.created_at),"yyyy/MM/dd @ HH:mm");

          let initials = element.customer.fullname.split(" ",2);
          element.customer.customerShortName = '';
          initials.forEach( (element2) => {
            element.customer.customerShortName = element.customer.customerShortName+element2.charAt(0);
          });
        });
        this.activeBooking = 0;
      }
      else if(response.data == false){
        this.todayAppointmentData = ''
      }
    this.isLoader=false;
    })
  }
  fnBookingActive(index){
    this.activeBooking = index;
  }
  todayAppointmentDetail(index){
    const dialogRef = this.dialog.open(DialogTodayAppointmentDetail, {
      height: '700px',
      data:{ fullData : this.todayAppointmentData[index]}
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  fnUploadDashBG(){
    const dialogRef = this.dialog.open(DialogStaffDashBGUpload, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
       if(result != undefined){
        this.dashBGImage = result;
        this.updateStaffBGImage();
       }
       
     });
  }
  updateStaffBGImage(){
    this.isLoader=true;
    let requestObject = {
      'image' : this.dashBGImage,
      'staff_id' : this.staffId
    };
    this.StaffService.updateStaffBGImage(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Dashboard image updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
      }
      else if(response.data == false) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        }); 
      }
    this.isLoader=false;
    })
  }

}


@Component({
  selector: 'bg-image-upload-dialog',
  templateUrl: '../_dialogs/image-upload-dialog.html',
})
export class DialogStaffDashBGUpload {

  uploadForm: FormGroup;  
  isLoader:boolean=false;
  imageSrc: any;  
  profileImage: string;
  constructor(
    public dialogRef: MatDialogRef<DialogStaffDashBGUpload>,
    private _formBuilder:FormBuilder,
    private StaffService: StaffService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
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

    var file_type = event.target.files[0].type;

    if(file_type!='image/jpeg' &&  file_type!='image/png' && file_type!='image/jpg' &&  file_type!='image/gif'){
        
        this._snackBar.open("Sorry, only JPG, JPEG, PNG & GIF files are allowed", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
        });
        return;
    }
   
    
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
  uploadImage(){
    this.profileImage = this.imageSrc
    
  
    this.dialogRef.close(this.profileImage);
  }

}

@Component({
  selector: 'today-appointment-details',
  templateUrl: '../_dialogs/today-appointment-details.html',
})
export class DialogTodayAppointmentDetail {

appoDetail : any;
isLoader:boolean=false;
bussinessId: any;
settingsArr:any=[];
currencySymbol:any;
currencySymbolPosition:any;
currencySymbolFormat:any;
activityLog:any=[];
constructor(
  public dialogRef: MatDialogRef<DialogTodayAppointmentDetail>,
  private StaffService: StaffService,
  private authenticationService: AuthenticationService,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.appoDetail = this.data.fullData;
    this.fnGetActivityLog(this.appoDetail.id);
    this.bussinessId=this.authenticationService.currentUserValue.business_id
    this.fnGetSettingValue();
  }

onNoClick(): void {
  this.dialogRef.close();
}
    fnGetSettingValue(){
    this.isLoader=true;
      let requestObject = {
        "business_id":this.bussinessId
      };
      this.StaffService.getSettingValue(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.settingsArr=response.response;
          this.currencySymbol = this.settingsArr.currency;
          this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
          this.currencySymbolFormat = this.settingsArr.currency_format;
        }
        else if(response.data == false){
          
        }
    this.isLoader=false;
      })
    }

    fnGetActivityLog(orderItemId){
    this.isLoader=true;
      let requestObject = {
        "order_item_id":orderItemId
      };
      this.StaffService.getActivityLog(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.activityLog=response.response;
        }
        else if(response.data == false){
          this.activityLog=[];
        }
    this.isLoader=false;
      })
    }

}
