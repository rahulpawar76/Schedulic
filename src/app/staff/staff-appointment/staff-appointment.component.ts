import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

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
 

  statuses: status[] = [
    {value: 'ontheway', viewValue: 'On The Way',statuses:''},
    {value: 'workstarted', viewValue: 'Work Started',statuses:''},
    {value: 'interrupted', viewValue: 'Interrupted',statuses:''}
  ];
  

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

   someMethod(event): void {
    if(event == 'ontheway'){
      const dialogRef = this.dialog.open(DialogONTheWay, {
        width: '500px',
      });

       dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.status = result;
       });
    }
    if(event == 'workstarted'){
      const dialogRef = this.dialog.open(DialogWorkStarted, {
        width: '500px',
      });

       dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.status = result;
       });
    }
    if(event == 'interrupted'){
      const dialogRef = this.dialog.open(DialogInterrupted, {
        width: '500px',
      });

       dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.status = result;
       });
    }
  }

  AddAppointment() {
    const dialogRef = this.dialog.open(DialogAddNewAppointment, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
       this.animal = result;
     });
  }
  
  NewAppointment() {
    const dialogRef = this.dialog.open(DialogNewAppointment, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }


  StaffMyAppointmentDetails(){

    const dialogRef = this.dialog.open(DialogStaffMyAppointmentDetails, {
     height: '700px',
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });

  }

  OnGoingAppointmentDetails(){

      const dialogRef = this.dialog.open(OnGoingAppointmentDetails, {
         height: '700px',
        });

         dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.animal = result;
         });

  }

  CompleteAppointmentDetails(){

      const dialogRef = this.dialog.open(CompleteAppointmentDetails, {
         height: '700px',
        });

         dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.animal = result;
         });

  }
  
  fninterrupted(event){
    const dialogRef = this.dialog.open(InterruptedReschedule, {
      width: '500px',

    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
   }

   /*Payment Module*/

   CashPaymentMode() {
    const dialogRef = this.dialog.open(DialogCashPaymentMode, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
       this.animal = result;
     });
  }

   OnlinePaymentMode() {
    const dialogRef = this.dialog.open(DialogOnlinePaymentMode, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
       this.animal = result;
     });
  }

   CashPaymentDetails() {
    const dialogRef = this.dialog.open(DialogCashPaymentDetails, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
       this.animal = result;
     });
  }

  OnlinePaymentDetails() {
    const dialogRef = this.dialog.open(DialogOnlinePaymentDetails, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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

    constructor(
      public dialogRef: MatDialogRef<DialogONTheWay>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }



  @Component({
    selector: 'work-started-dialog',
    templateUrl: '../_dialogs/work-started-dialog.html',
  })
  export class DialogWorkStarted {

    constructor(
      public dialogRef: MatDialogRef<DialogWorkStarted>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }
  
   @Component({
    selector: 'interrupted-dialog',
    templateUrl: '../_dialogs/interrupted-dialog.html',
  })
  export class DialogInterrupted {
     animal: any;

    constructor(
      public dialogRef: MatDialogRef<DialogInterrupted>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
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

    constructor(
      public dialogRef: MatDialogRef<DialogStaffMyAppointmentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }



   @Component({
      selector: 'ongoing-appointmet-details',
      templateUrl: '../_dialogs/ongoing-appointmet-details.html',
  })
  export class OnGoingAppointmentDetails {

    constructor(
      public dialogRef: MatDialogRef<OnGoingAppointmentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

  @Component({
      selector: 'complete-appointment-details',
      templateUrl: '../_dialogs/complete-appointment-details.html',
  })
  export class CompleteAppointmentDetails {

    constructor(
      public dialogRef: MatDialogRef<CompleteAppointmentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

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



  
  
  

