import { Component, OnInit,Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AdminService } from '../_services/admin-main.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { D } from '@angular/cdk/keycodes';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AppComponent } from '@app/app.component';
import { AuthenticationService } from '@app/_services';


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
    providers: [DatePipe]
})
export class PendingAppointmentDetailsDialog {
//notes:any;
detailsData: any;
constructor(
  public dialogRef: MatDialogRef<PendingAppointmentDetailsDialog>,
  private AdminService: AdminService,
  private _snackBar: MatSnackBar,
  private datePipe: DatePipe,
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  fnRescheduleAppointment(){
    const dialogRef = this.dialog.open(RescheduleAppointment, {
      height: '700px',
     data : {appointmentDetails: this.detailsData}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  fnConfirmAppointment(){
      let requestObject = {
       "order_item_id":JSON.stringify(this.detailsData.id),
       "status":"CNF"
      };
      this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Confirmed", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.dialogRef.close();
        }
        else if(response.data == false){
          this._snackBar.open("Appointment not Confirmed", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
      })
    }


  fnCancelAppointment(){
    let requestObject = {
     "order_item_id":JSON.stringify(this.detailsData.id),
     "status":"C"
    };
    this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Cancelled", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
        this.dialogRef.close();
      }
      else if(response.data == false){
        this._snackBar.open("Appointment not Cancelled", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
      }
    })
  }
}


@Component({
  selector: 'interrupted-reschedule-dialog',
  templateUrl: '../_dialogs/interrupted-reschedule-dialog.html',
  providers: [DatePipe]
})
export class RescheduleAppointment {
formAppointmentRescheduleAdmin:FormGroup;
appointmentDetails:any;
businessId:any;
selectedDate:any;
selectedTimeSlot:any;
selectedStaff:any;
minDate = new Date();
timeSlotArr:any= [];
availableStaff:any= [];
constructor(
  public dialogRef: MatDialogRef<RescheduleAppointment>,
  private AdminService: AdminService,
  private datePipe: DatePipe,
  private _formBuilder: FormBuilder,
  private http: HttpClient,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.appointmentDetails =  this.data.appointmentDetails;
    this.businessId=localStorage.getItem('business_id');
    this.formAppointmentRescheduleAdmin = this._formBuilder.group({
      rescheduleDate: ['', Validators.required],
      rescheduleTime: ['', Validators.required],
      rescheduleStaff: ['', Validators.required],
      rescheduleNote: ['', Validators.required],
    });
    console.log(this.appointmentDetails);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  fnDateChange(event:MatDatepickerInputEvent<Date>) {
    console.log(this.datePipe.transform(new Date(event.value),"yyyy-MM-dd"));
    let date = this.datePipe.transform(new Date(event.value),"yyyy-MM-dd")
    this.formAppointmentRescheduleAdmin.controls['rescheduleTime'].setValue(null);
    this.formAppointmentRescheduleAdmin.controls['rescheduleStaff'].setValue(null);
    this.timeSlotArr= [];
    this.availableStaff= [];
    this.selectedDate=date;
    this.fnGetTimeSlots(date);
  }

  fnGetTimeSlots(selectedDate){
    let requestObject = {
      "business_id":this.businessId,
      "selected_date":selectedDate
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/list-availabel-timings`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
     // catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
          this.timeSlotArr=response.response;
          console.log(this.timeSlotArr);
        }
        else{
        }
      },
      (err) =>{
        console.log(err)
      })
    }
   
    fnChangeTimeSlot(selectedTimeSlot){
      console.log(selectedTimeSlot);
      this.formAppointmentRescheduleAdmin.controls['rescheduleStaff'].setValue(null);
      this.selectedTimeSlot=selectedTimeSlot;
      this.fnGetStaff(selectedTimeSlot);
    }

    fnGetStaff(selectedTimeSlot){
      let requestObject = {
        "postal_code":this.appointmentDetails.postal_code,
        "business_id":this.businessId,
        "service_id":JSON.stringify(this.appointmentDetails.service_id),
        "book_date":this.selectedDate,
        "book_time":this.selectedTimeSlot
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      this.http.post(`${environment.apiUrl}/service-staff`,requestObject,{headers:headers} ).pipe(
        map((res) => {
          return res;
        }),
        //catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
            this.availableStaff = response.response;
            console.log(JSON.stringify(this.availableStaff));
        }
        else{
          this.availableStaff.length=0;
        }
        },
        (err) =>{
          console.log(err)
        })
      }

    formRescheduleSubmit(){
      if(this.formAppointmentRescheduleAdmin.invalid){
        return false;
      }

      let requestObject = {
       "order_item_id":JSON.stringify(this.appointmentDetails.id),
       "staff_id":this.formAppointmentRescheduleAdmin.get('rescheduleStaff').value,
       "book_date":this.datePipe.transform(new Date(this.formAppointmentRescheduleAdmin.get('rescheduleDate').value),"yyyy-MM-dd"),
       "book_time":this.formAppointmentRescheduleAdmin.get('rescheduleTime').value,
       "book_notes":this.formAppointmentRescheduleAdmin.get('rescheduleNote').value
      };
      this.AdminService.rescheduleAppointment(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Rescheduled", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
            this.dialogRef.close();
       }
        else if(response.data == false){
          this._snackBar.open("Appointment not Rescheduled", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
      })
    }
}


@Component({
  selector: 'notassigned-appointment-details',
  templateUrl: '../_dialogs/notassigned-appointment-details.html',
  providers:[DatePipe]
})
export class NotAssignedAppointmentDetailsDialog {
//notes:any;
detailsData: any;
businessId: any;
selectedStaff: any;
availableStaff: any=[];
constructor(
  public dialogRef: MatDialogRef<NotAssignedAppointmentDetailsDialog>,
  private AdminService: AdminService,
  public dialog: MatDialog,
  private datePipe: DatePipe,
  private _formBuilder: FormBuilder,
  private http: HttpClient,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
    this.fnGetStaff(this.detailsData.booking_date,this.detailsData.booking_time,this.detailsData.service_id,this.detailsData.postal_code);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  fnRescheduleAppointment(){
    const dialogRef = this.dialog.open(RescheduleAppointment, {
      height: '700px',
     data : {appointmentDetails: this.detailsData}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  fnGetStaff(booking_date,booking_time,serviceId,postal_code){
    let requestObject = {
      "postal_code":postal_code,
      "business_id":this.detailsData.business_id,
      "service_id":JSON.stringify(serviceId),
      "book_date":this.datePipe.transform(new Date(booking_date),"yyyy-MM-dd"),
      "book_time":booking_time
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/service-staff`,requestObject,{headers:headers} ).pipe(
    map((res) => {
      return res;
    }),
    //catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        this.availableStaff = response.response;
        console.log(JSON.stringify(this.availableStaff));
      }
      else{
        this.availableStaff.length=0;
      }
    },
    (err) =>{
      console.log(err)
    })
  }

  fnOnClickStaff(event){
    console.log(event.value);
    let requestObject = {
      "order_item_id":this.detailsData.id,
      "staff_id":event.value
      };
    this.AdminService.assignStaffToOrder(requestObject).subscribe((response:any) => 
    {
      if(response.data == true){
          this._snackBar.open("Staff Assigned", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.dialogRef.close();
        }
        else if(response.data == false){
          this._snackBar.open("Staff not Assigned", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
    },
    (err) => {
      // this.error = err;
    })
  }


  fnCancelAppointment(){
    let requestObject = {
     "order_item_id":JSON.stringify(this.detailsData.id),
     "status":"C"
    };
    this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Cancelled", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
        this.dialogRef.close();
      }
      else if(response.data == false){
        this._snackBar.open("Appointment not Cancelled", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
      }
    })
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
  public dialog: MatDialog,
  private _formBuilder: FormBuilder,
  private http: HttpClient,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  fnRescheduleAppointment(){
    const dialogRef = this.dialog.open(RescheduleAppointment, {
      height: '700px',
     data : {appointmentDetails: this.detailsData}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  fnConfirmAppointment(){
      let requestObject = {
       "order_item_id":JSON.stringify(this.detailsData.id),
       "status":"CO"
      };
      this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Confirmed", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.dialogRef.close();
        }
        else if(response.data == false){
          this._snackBar.open("Appointment not Confirmed", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
      })
    }


  fnCancelAppointment(){
    let requestObject = {
     "order_item_id":JSON.stringify(this.detailsData.id),
     "status":"C"
    };
    this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Cancelled", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
        this.dialogRef.close();
      }
      else if(response.data == false){
        this._snackBar.open("Appointment not Cancelled", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
      }
    })
  }
}

@Component({
  selector: 'workstarted-appointment-details',
  templateUrl: '../_dialogs/workstarted-appointment-details.html',
})
export class WorkStartedAppointmentDetailsDialog {
//notes:any;
detailsData: any;
constructor(
  public dialogRef: MatDialogRef<WorkStartedAppointmentDetailsDialog>,
  private AdminService: AdminService,
  public dialog: MatDialog,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  fnRescheduleAppointment(){
    const dialogRef = this.dialog.open(RescheduleAppointment, {
      height: '700px',
     data : {appointmentDetails: this.detailsData}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  fnConfirmAppointment(){
      let requestObject = {
       "order_item_id":JSON.stringify(this.detailsData.id),
       "status":"CO"
      };
      this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Confirmed", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.dialogRef.close();
        }
        else if(response.data == false){
          this._snackBar.open("Appointment not Confirmed", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
      })
    }


  fnCancelAppointment(){
    let requestObject = {
     "order_item_id":JSON.stringify(this.detailsData.id),
     "status":"C"
    };
    this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Cancelled", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
        this.dialogRef.close();
      }
      else if(response.data == false){
        this._snackBar.open("Appointment not Cancelled", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
      }
    })
  }
}
