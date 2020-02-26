import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AdminService } from '../_services/admin-main.service';
import { DatePipe} from '@angular/common';


export interface DialogData {
  animal: string;
  name: string;
 
}
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [DatePipe]
})
export class CustomersComponent implements OnInit {
  dtOptions: any = {};
  animal: any;
  allCustomers: any;
  customersDetails: any;
  customerPersonalDetails: any;
  customerAppoint: any;
  customerNotes: any;
  customerReviews: any;
  newCustomer: boolean = false;
  fullDetailsOfCustomer: boolean = true;
  isLoaderAdmin : boolean = false;
  constructor(
    public dialog: MatDialog,
    private AdminService: AdminService,
    private datePipe: DatePipe,
    ) { 
    
    localStorage.setItem('isBusiness', 'false');
  }

  ngOnInit() {
    this.getAllCustomers();
  }

  getAllCustomers(){
    this.AdminService.getAllCustomers().subscribe((response:any) => {
      if(response.data == true){
        this.allCustomers = response.response
      }
      else if(response.data == false){
        this.allCustomers = ''
      }
    })
  }


  fnAddNewCustomer(){
    this.newCustomer = true;
    this.fullDetailsOfCustomer = false;
  }
  fnCancelNewCustomer(){
    this.newCustomer = false;
    this.fullDetailsOfCustomer = true;
  }

  
  fnSelectCustomer(customer_id){
    this.AdminService.getCustomersDetails(customer_id).subscribe((response:any) => {
      if(response.data == true){
        alert("Hello");
        this.customersDetails = response.response
        this.customerPersonalDetails = response.response.customer_details
        this.customerAppoint = response.response.appointmets
        this.customerNotes = response.response.notes
        this.customerReviews = response.response.revirew
        console.log(this.customersDetails);
      }
      else if(response.data == false){
        this.customersDetails = ''
      }
    })
  }

  newCustomerAppointment() {
    const dialogRef = this.dialog.open(DialogNewCustomerAppointment, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }

  newAddNote() {
    const dialogRef = this.dialog.open(DialogAddNewNote, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }

  newPaymentNote() {
    const dialogRef = this.dialog.open(DialogPaymentNote, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }
  
  viewReviewDetail(){
    const dialogRef = this.dialog.open(DialogViewReview, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }
  
fnLoaderShow(){
  this.isLoaderAdmin = true;
}

}


@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/new-appointment.html',
})
export class DialogNewCustomerAppointment {

constructor(
  public dialogRef: MatDialogRef<DialogNewCustomerAppointment>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}

}

@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/add-new-note-dialog.html',
})
export class DialogAddNewNote {

constructor(
  public dialogRef: MatDialogRef<DialogAddNewNote>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}

}

@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/payment-note-dialog.html',
})
export class DialogPaymentNote {

constructor(
  public dialogRef: MatDialogRef<DialogPaymentNote>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}

}

@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/view-review-dialog.html',
})
export class DialogViewReview {

constructor(
  public dialogRef: MatDialogRef<DialogViewReview>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}

}
