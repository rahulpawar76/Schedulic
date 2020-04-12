import { Component, OnInit,Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AdminService } from '../_services/admin-main.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { D } from '@angular/cdk/keycodes';


export interface DialogData {
  animal: string;
 
 
}
@Component({
  selector: 'app-appointment-live',
  templateUrl: './appointment-live.component.html',
  styleUrls: ['./appointment-live.component.scss'],
  providers: [DatePipe]
})
export class AppointmentLiveComponent implements OnInit {
 
  businessId: any;
  animal: string;
  isLoaderAdmin : boolean = false;
  pendingAppointments : any=[];
  notAssignedAppointments : any=[];
  onTheWayAppointments : any=[];
  workStartedAppointments : any=[];
  staffList:any;
  todayDate:any;
  todayTime:any;
  todayDays:any;
  todayPeriod:any;

  booking_date:any;
  settingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;

  constructor(
    private AdminService: AdminService,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    if(localStorage.getItem('business_id')){
      this.businessId=localStorage.getItem('business_id');
    }
    this.fnGetSettings();
    this.getPendingAppointments();
    this.getNotAssignedAppointments();
    this.getOnThewayAppointments();
    this.getWorkStartedAppointments();
    
    this.todayDate = this.datePipe.transform(new Date(),"MMMM d")
    this.todayTime = this.datePipe.transform(new Date(),"h:mm ")
    this.todayPeriod = this.datePipe.transform(new Date(),"a")
    this.todayDays = this.datePipe.transform(new Date(),"EEEE")

    
  }

  fnGetSettings(){
    let requestObject = {
      "business_id" : this.businessId
      };

    this.AdminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr = response.response;
        console.log(this.settingsArr);

        this.currencySymbol = this.settingsArr.currency;
        console.log(this.currencySymbol);
        
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        console.log(this.currencySymbolPosition);
        
        this.currencySymbolFormat = this.settingsArr.currency_format;
        console.log(this.currencySymbolFormat);
      }else{
      }
      },
      (err) =>{
        console.log(err)
      })
  }

  getPendingAppointments(){
    this.AdminService.getPendingAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.pendingAppointments = response.response

        this.pendingAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
        });
      }
      else if(response.data == false){
        this.pendingAppointments = [];
      }
    })
  }
  getNotAssignedAppointments(){
    this.AdminService.getNotAssignedAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.notAssignedAppointments = response.response
        this.notAssignedAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
          
        });
        
      }
      else if(response.data == false){
        this.notAssignedAppointments = [];
      }
    })
  }

  getOnThewayAppointments(){
    this.AdminService.getOnThewayAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.onTheWayAppointments = response.response
        this.onTheWayAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
          
        });
      }
      else if(response.data == false){
        this.onTheWayAppointments = [];
      }
    })
  }

  getWorkStartedAppointments(){
    this.AdminService.getWorkStartedAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.workStartedAppointments = response.response
        this.workStartedAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
          
        });
      }
      else if(response.data == false){
        this.workStartedAppointments = [];
      }
    })
  }


  fnOpenDetails(index){
    
    const dialogRef = this.dialog.open(PendingAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.pendingAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getPendingAppointments();
     
      });
  }

  fnOpenNotAssignedDetails(index){
    
    const dialogRef = this.dialog.open(NotAssignedAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.notAssignedAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getNotAssignedAppointments();
      
      });
  }

  
  fnOpenOnTheWayDetails(index){
    
    const dialogRef = this.dialog.open(OnTheWayAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.onTheWayAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getOnThewayAppointments();
      
      });
  }
  
  fnOpenWorkStartedDetails(index){
   
    const dialogRef = this.dialog.open(WorkStartedAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.workStartedAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getWorkStartedAppointments();
      
      });
  }
  
}

@Component({
  selector: 'pending-appointment-details',
  templateUrl: '../_dialogs/pending-appointment-details.html',
})
export class PendingAppointmentDetailsDialog {
//notes:any;
detailsData: any;
constructor(
  public dialogRef: MatDialogRef<PendingAppointmentDetailsDialog>,
  private AdminService: AdminService,
  //private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
  }
onNoClick(): void {
  this.dialogRef.close();
}
}


@Component({
  selector: 'notassigned-appointment-details',
  templateUrl: '../_dialogs/notassigned-appointment-details.html',
})
export class NotAssignedAppointmentDetailsDialog {
//notes:any;
detailsData: any;
constructor(
  public dialogRef: MatDialogRef<NotAssignedAppointmentDetailsDialog>,
  private AdminService: AdminService,
  //private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
  }
onNoClick(): void {
  this.dialogRef.close();
}
}

@Component({
  selector: 'ontheway-appointment-details',
  templateUrl: '../_dialogs/ontheway-appointment-details.html',
})
export class OnTheWayAppointmentDetailsDialog {
//notes:any;
detailsData: any;
constructor(
  public dialogRef: MatDialogRef<OnTheWayAppointmentDetailsDialog>,
  private AdminService: AdminService,
  //private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
  }
onNoClick(): void {
  this.dialogRef.close();
}
}

@Component({
  selector: 'ontheway-appointment-details',
  templateUrl: '../_dialogs/workstarted-appointment-details.html',
})
export class WorkStartedAppointmentDetailsDialog {
//notes:any;
detailsData: any;
constructor(
  public dialogRef: MatDialogRef<WorkStartedAppointmentDetailsDialog>,
  private AdminService: AdminService,
  //private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
  }
onNoClick(): void {
  this.dialogRef.close();
}
}
