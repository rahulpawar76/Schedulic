import { Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { UserService } from '../_services/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-userappointments',
  templateUrl: './userappointments.component.html',
  styleUrls: ['./userappointments.component.scss']
})
export class UserappointmentsComponent implements OnInit {
  animal: any;
  appointmentData : any;
  cancelAppointmentData: any;
  completedAppointmentData: any;

  constructor(
    public dialog: MatDialog,
     private http: HttpClient,
     private UserService: UserService,
     public router: Router,
     private _snackBar: MatSnackBar
     ) {
  }


ngOnInit() {

  this.getAllAppointments();
  this.getCancelAppointments();
  this.getCompletedAppointments();
}

private handleError(error: HttpErrorResponse) {
return throwError('Error! something went wrong.');
}



getAllAppointments(): void{
  this.UserService.getAllAppointments().subscribe((response:any) =>{
    if(response.data == true){
      this.appointmentData = response.response;
    }
  })
}
getCancelAppointments(): void{
  this.UserService.getCancelAppointments().subscribe((response:any) =>{
    if(response.data == true){
      this.cancelAppointmentData = response.response;
    }
  })
}
getCompletedAppointments(): void{
  this.UserService.getCompletedAppointments().subscribe((response:any) =>{
    if(response.data == true){
      this.completedAppointmentData = response.response;
    }
  })
}


// Dialogs

  ratenow(booking_id) {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data:{appoData: booking_id}
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  cancelAppo(booking_id) {
    const dialogRef = this.dialog.open(DialogCancelReason, {
      width: '500px',
      data:{appoData: booking_id}
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  invoice() {
    const dialogRef = this.dialog.open(DialogInvoiceDialog, {
      width: '1000px',
      height: '800px',

    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  MyAppointmentDetails(index){
    const dialogRef = this.dialog.open(DialogMyAppointmentDetails, {
      
      height: '700px',
      data: {fulldata: this.appointmentData[index]}

    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  details_dialog(index) {
    const dialogRef = this.dialog.open(DialogCancelAppointmentDetails, {
     
      height: '700px',
      data: {fulldata: this.cancelAppointmentData[index]}

    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  complete_details_dialog(index) {
    const dialogRef = this.dialog.open(DialogCompleteAppointmentDetails, {
     
      height: '700px',
      data: {fulldata: this.completedAppointmentData[index]}

    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  frontBooking(){
    this.router.navigate(['/booking']);
  }


}

@Component({
  selector: 'dialog-rate-review',
  templateUrl: '../_dialogs/dialog-rate-review.html',
})
export class DialogOverviewExampleDialog {

  appoId: any;
  ratingValueNo: any;
  ratingTitle: any;
  ratingDecreption: any;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private UserService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.appoId = this.data.appoData;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ratingValue(event){
    this.ratingValueNo = event.srcElement.value
  }
  fnRatingSubmit(){
    this.ratingToAppointment(this.appoId,this.ratingValueNo,this.ratingTitle,this.ratingDecreption);
  }
  ratingToAppointment(appoId,ratingValueNo,ratingTitle,ratingDecreption): void{
    this.UserService.ratingToAppointment(appoId,ratingValueNo,ratingTitle,ratingDecreption).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Review Submited", "X", {
          duration: 2000,
          verticalPosition:'bottom',
          panelClass :['green-snackbar']
          });
          window.location.reload();
      }
    })
  }

}
@Component({
  selector: 'cancel-reason-dialog',
  templateUrl: '../_dialogs/cancel-reason-dialog.html',
})
export class DialogCancelReason {

  appoId: any;
  cancelReason: any;
  constructor(
    public dialogRef: MatDialogRef<DialogCancelReason>,
    private UserService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.appoId = this.data.appoData;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  fnCancelsubmit(){
    this.cancelAppointment(this.appoId,this.cancelReason);
    
    this.dialogRef.close();
  }

  cancelAppointment(appoId,cancelReason): void{
    this.UserService.cancelAppointment(appoId,cancelReason).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Canceled", "X", {
          duration: 2000,
          verticalPosition:'bottom',
          panelClass :['green-snackbar']
          });
          window.location.reload();
      }
    })
  }
}


@Component({
	  selector: 'dialog-invoice',
	  templateUrl: '../_dialogs/dialog-invoice.html',
	})
	export class DialogInvoiceDialog {

	  constructor(
	    public dialogRef: MatDialogRef<DialogInvoiceDialog>,
	    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

	  onNoClick(): void {
	    this.dialogRef.close();
	  }

	}

  @Component({
    selector: 'dialog-cancel-appointment-details',
    templateUrl: '../_dialogs/dialog-cancel-appointment-details.html',
  })
  export class DialogCancelAppointmentDetails {
    myAppoDetailData: any;
    constructor(
      public dialogRef: MatDialogRef<DialogCancelAppointmentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
      }

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

  @Component({
    selector: 'dialog-my-appointment-details',
    templateUrl: '../_dialogs/dialog-my-appointment-details.html',
  })
  export class DialogMyAppointmentDetails {
    myAppoDetailData: any;

    constructor(
      public dialogRef: MatDialogRef<DialogMyAppointmentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
      }
    onNoClick(): void {
      this.dialogRef.close();
    }
  }

  @Component({
    selector: 'dialog-complete-appointment-details',
    templateUrl: '../_dialogs/dialog-complete-appointment-details.html',
  })
  export class DialogCompleteAppointmentDetails {
    myAppoDetailData: any;
    constructor(
      public dialogRef: MatDialogRef<DialogCompleteAppointmentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
      }

    onNoClick(): void {
      this.dialogRef.close();
    }

  }


