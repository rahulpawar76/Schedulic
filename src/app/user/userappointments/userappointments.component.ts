import { Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '@environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

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


  constructor(
    public dialog: MatDialog,
     private http: HttpClient
     ) {
  }


ngOnInit() {

}

private handleError(error: HttpErrorResponse) {
return throwError('Error! something went wrong.');
}


   ratenow() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }

  invoice() {
    const dialogRef = this.dialog.open(DialogInvoiceDialog, {
      width: '1000px',
      height: '800px',

    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }

  MyAppointmentDetails(){
    const dialogRef = this.dialog.open(DialogMyAppointmentDetails, {
     
      height: '700px',

    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }

  details_dialog() {
    const dialogRef = this.dialog.open(DialogCancelAppointmentDetails, {
     
      height: '700px',

    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }

  complete_details_dialog() {
    const dialogRef = this.dialog.open(DialogCompleteAppointmentDetails, {
     
      height: '700px',

    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }


}

	@Component({
	  selector: 'dialog-rate-review',
	  templateUrl: '../_dialogs/dialog-rate-review.html',
	})
	export class DialogOverviewExampleDialog {

	  constructor(
	    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
	    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

	  onNoClick(): void {
	    this.dialogRef.close();
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

    constructor(
      public dialogRef: MatDialogRef<DialogCancelAppointmentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

  @Component({
    selector: 'dialog-my-appointment-details',
    templateUrl: '../_dialogs/dialog-my-appointment-details.html',
  })
  export class DialogMyAppointmentDetails {

    constructor(
      public dialogRef: MatDialogRef<DialogMyAppointmentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

  @Component({
    selector: 'dialog-complete-appointment-details',
    templateUrl: '../_dialogs/dialog-complete-appointment-details.html',
  })
  export class DialogCompleteAppointmentDetails {

    constructor(
      public dialogRef: MatDialogRef<DialogCompleteAppointmentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }


