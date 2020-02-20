import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StaffService } from '../_services/staff.service'
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  selector: 'app-staff-appointment',
  templateUrl: './staff-appointment.component.html',
  styleUrls: ['./staff-appointment.component.scss']
})
export class StaffAppointmentComponent implements OnInit {
	animal: any;
  status: any;
  newAppointmentData: any;
  completedAppointmentData: any;
  onGoingAppointmentData: any;
  notes: any;

  statuses: status[] = [
    {value: 'OW', viewValue: 'On The Way',statuses:''},
    {value: 'WS', viewValue: 'Work Started',statuses:''},
    {value: 'ITR', viewValue: 'Interrupted',statuses:''}
  ];
  

  constructor(
    public dialog: MatDialog,
    private StaffService: StaffService,
    private _snackBar: MatSnackBar,
    
    ) { }

  ngOnInit() {

    this.getNewAppointment();
    this.getCompletedAppointment();
    this.getOnGoingAppointment();
  }

  getNewAppointment(){
    this.StaffService.getNewAppointment().subscribe((response:any) =>{
      if(response.data == true){
        this.newAppointmentData = response.response;
      }
      else if(response.data == false) {
        this.newAppointmentData = '';
      }
    })
  }
  getCompletedAppointment(){
    this.StaffService.getCompletedAppointment().subscribe((response:any) =>{
      if(response.data == true){
        this.completedAppointmentData = response.response;
      }
      else if(response.data == false) {
        this.completedAppointmentData = '';
      }
    })
  }
  getOnGoingAppointment(){
    this.StaffService.getOnGoingAppointment().subscribe((response:any) =>{
      if(response.data == true){
        this.onGoingAppointmentData = response.response;
      }
      else if(response.data == false) {
        this.onGoingAppointmentData = '';
      }
    })
  }
   someMethod(booking_id, status): void {
    if(status == 'OW'){
      const dialogRef = this.dialog.open(DialogONTheWay, {
        width: '500px',
        data: {booking_id :booking_id, status: status}
      });

       dialogRef.afterClosed().subscribe(result => {
        this.status = result;
        this.getOnGoingAppointment();
       });
    }
    if(status == 'WS'){
      const dialogRef = this.dialog.open(DialogWorkStarted, {
        width: '500px',
        data: {booking_id :booking_id, status: status}
      });

       dialogRef.afterClosed().subscribe(result => {
        this.status = result;
        this.getOnGoingAppointment();
       });
    }
    if(status == 'ITR'){
      const dialogRef = this.dialog.open(DialogInterrupted, {
        width: '500px',
        data: {booking_id :booking_id, status: status}
      });

       dialogRef.afterClosed().subscribe(result => {
        this.status = result;
        this.getOnGoingAppointment();
       });
    }
  }

  changeBookingStatus(order_item_id, status){
    this.StaffService.changeStatus(order_item_id, status, this.notes).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Updated", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        
        this.getNewAppointment();
        this.getCompletedAppointment();
        this.getOnGoingAppointment();
      }
      else if(response.data == false) {
        this._snackBar.open("Appointment Not Updated", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        }); 
      }
    })
  }



  AddAppointment() {
    const dialogRef = this.dialog.open(DialogAddNewAppointment, {
      width: '500px',
    });
     dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
     });
  }
  
  NewAppointment() {
    const dialogRef = this.dialog.open(DialogNewAppointment, {
      width: '500px',
    });
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }


  StaffMyAppointmentDetails(index){
    const dialogRef = this.dialog.open(DialogStaffMyAppointmentDetails, {
     height: '700px',
     data :{fulldata : this.newAppointmentData[index]}
    });
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      this.getNewAppointment();
      this.getCompletedAppointment();
      this.getOnGoingAppointment();
     });
  }

  OnGoingAppointmentDetails(index){
    const dialogRef = this.dialog.open(OnGoingAppointmentDetails, {
      height: '700px',
      data: {fuldata: this.onGoingAppointmentData[index]}
    });
      dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      });
  }

  CompleteAppointmentDetails(index){
    const dialogRef = this.dialog.open(CompleteAppointmentDetails, {
      height: '700px',
      data : {fuldata: this.completedAppointmentData[index]}
    });
    dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
    });

  }

  rescheduleAppointment(){
    const dialogRef = this.dialog.open(InterruptedReschedule, {
      height: '700px',
    });
    dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
    });

  }
  


   /*Payment Module*/

   CashPaymentMode() {
    const dialogRef = this.dialog.open(DialogCashPaymentMode, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
     });
  }

   OnlinePaymentMode() {
    const dialogRef = this.dialog.open(DialogOnlinePaymentMode, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
     });
  }

   CashPaymentDetails() {
    const dialogRef = this.dialog.open(DialogCashPaymentDetails, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
     });
  }

  OnlinePaymentDetails() {
    const dialogRef = this.dialog.open(DialogOnlinePaymentDetails, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
     });
  }



}

  @Component({
      selector: 'add-new-appointment',
      templateUrl: '../_dialogs/add-new-appointment.html',
  })
  export class DialogAddNewAppointment {

    constructor(
      public dialogRef: MatDialogRef<DialogAddNewAppointment>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

  @Component({
      selector: 'new-appointment',
      templateUrl: '../_dialogs/new-appointment.html',
  })
  export class DialogNewAppointment {
    constructor(
      public dialogRef: MatDialogRef<DialogNewAppointment>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

  @Component({
    selector: 'on-the-way-dialog',
    templateUrl: '../_dialogs/on-the-way-dialog.html',
  })
  export class DialogONTheWay {
    status: any;
    booking_id: any;
    notes: any;
    constructor(
      public dialogRef: MatDialogRef<DialogONTheWay>,
      public dialog: MatDialog,
      private StaffService: StaffService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {

        this.status = this.data.status;
        this.booking_id = this.data.booking_id 
      }

    onNoClick(): void {
      this.dialogRef.close();
    }
    changeBookingStatus(order_item_id, status){
      this.StaffService.changeStatus(order_item_id, status, this.notes).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
        }
        else if(response.data == false) {
          this._snackBar.open("Appointment Not Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          }); 
        }
      })
      this.dialogRef.close();
    }

  }



  @Component({
    selector: 'work-started-dialog',
    templateUrl: '../_dialogs/work-started-dialog.html',
  })
  export class DialogWorkStarted {
    
    status: any;
    booking_id: any;
    notes: any;
    constructor(
      public dialogRef: MatDialogRef<DialogWorkStarted>,
      public dialog: MatDialog,
      private StaffService: StaffService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        
        this.status = this.data.status;
        this.booking_id = this.data.booking_id 
      }

    onNoClick(): void {
      this.dialogRef.close();
      
    }
    changeBookingStatus(order_item_id, status){
      this.StaffService.changeStatus(order_item_id, status, this.notes).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
        }
        else if(response.data == false) {
          this._snackBar.open("Appointment Not Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          }); 
        }
      })
      this.dialogRef.close();
    }

  }
  
   @Component({
    selector: 'interrupted-dialog',
    templateUrl: '../_dialogs/interrupted-dialog.html',
  })
  export class DialogInterrupted {
     animal: any;
    
     status: any;
     booking_id: any;
     notes: any;
    constructor(
      public dialogRef: MatDialogRef<DialogInterrupted>,
      private StaffService: StaffService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        
        this.status = this.data.status;
        this.booking_id = this.data.booking_id 
      }

    onNoClick(): void {
      this.dialogRef.close();
    }
    
    changeBookingStatus(order_item_id, status){
      this.StaffService.changeStatus(order_item_id, status, this.notes).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
        }
        else if(response.data == false) {
          this._snackBar.open("Appointment Not Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          }); 
        }
      })
      this.dialogRef.close();
    }

  }


  @Component({
    selector: 'interrupted-reschedule',
    templateUrl: '../_dialogs/interrupted-reschedule.html',
  })
  export class InterruptedReschedule {

    constructor(
      public dialogRef: MatDialogRef<InterruptedReschedule>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }


/* on click my appointment details*/

   @Component({
      selector: 'new-appointment-details',
      templateUrl: '../_dialogs/new-appointment-details.html',
  })
  export class DialogStaffMyAppointmentDetails {
    notes:any;
    detailData: any;
    constructor(
      public dialogRef: MatDialogRef<DialogStaffMyAppointmentDetails>,
      private StaffService: StaffService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.detailData =  this.data.fulldata;
      }
    onNoClick(): void {
      this.dialogRef.close();
    }
    
    changeBookingStatus(order_item_id, status){
      this.StaffService.changeStatus(order_item_id, status, this.notes).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          this.dialogRef.close();
        }
        else if(response.data == false) {
          this._snackBar.open("Appointment Not Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          }); 
          this.dialogRef.close();
        }
      })
    }

  }



   @Component({
      selector: 'ongoing-appointmet-details',
      templateUrl: '../_dialogs/ongoing-appointmet-details.html',
  })
  export class OnGoingAppointmentDetails {
    
  status: any;
  appoDetail: any;
    constructor(
      public dialogRef: MatDialogRef<OnGoingAppointmentDetails>,
      public dialog: MatDialog,
      private StaffService: StaffService,
      @Inject(MAT_DIALOG_DATA) public data: any) {

        this.appoDetail = this.data.fuldata;
      }

      statuses: status[] = [
        {value: 'OW', viewValue: 'On The Way',statuses:''},
        {value: 'WS', viewValue: 'Work Started',statuses:''},
        {value: 'ITR', viewValue: 'Interrupted',statuses:''}
      ];

    onNoClick(): void {
      this.dialogRef.close();
    }

    someMethod(booking_id, status): void {
      if(status == 'OW'){
        const dialogRef = this.dialog.open(DialogONTheWay, {
          width: '500px',
          data: {booking_id :booking_id, status: status}
        });
  
         dialogRef.afterClosed().subscribe(result => {
          this.status = result;
         });
      }
      if(status == 'WS'){
        const dialogRef = this.dialog.open(DialogWorkStarted, {
          width: '500px',
          data: {booking_id :booking_id, status: status}
        });
  
         dialogRef.afterClosed().subscribe(result => {
          this.status = result;
         });
      }
      if(status == 'ITR'){
        const dialogRef = this.dialog.open(DialogInterrupted, {
          width: '500px',
          data: {booking_id :booking_id, status: status}
        });
  
         dialogRef.afterClosed().subscribe(result => {
          this.status = result;
         });
      }
    }

  }

  @Component({
      selector: 'complete-appointment-details',
      templateUrl: '../_dialogs/complete-appointment-details.html',
  })
  export class CompleteAppointmentDetails {
    detailData: any;
    constructor(
      public dialogRef: MatDialogRef<CompleteAppointmentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.detailData = this.data.fuldata;
      }

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

  /*Payment Module*/

  @Component({
      selector: 'cash-payment-mode',
      templateUrl: '../_dialogs/cash-payment-mode.html',
  })
  export class DialogCashPaymentMode {

    constructor(
      public dialogRef: MatDialogRef<DialogCashPaymentMode>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

  @Component({
      selector: 'online-payment-mode',
      templateUrl: '../_dialogs/online-payment-mode.html',
  })
  export class DialogOnlinePaymentMode {

    constructor(
      public dialogRef: MatDialogRef<DialogOnlinePaymentMode>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

   @Component({
      selector: 'cash-payment-details',
      templateUrl: '../_dialogs/cash-payment-details.html',
  })
  export class DialogCashPaymentDetails {

    constructor(
      public dialogRef: MatDialogRef<DialogCashPaymentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

   @Component({
      selector: 'online-payment-details',
      templateUrl: '../_dialogs/online-payment-details.html',
  })
  export class DialogOnlinePaymentDetails {

    constructor(
      public dialogRef: MatDialogRef<DialogOnlinePaymentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }



  
  
  

