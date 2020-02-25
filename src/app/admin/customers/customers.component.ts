import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AdminService } from '../_services/admin-main.service'


export interface DialogData {
  animal: string;
  name: string;
 
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  dtOptions: any = {};
  animal: any;
  allCustomers: any;
  newCustomer: boolean = false;
  fullDetailsOfCustomer: boolean = true;
  isLoaderAdmin : boolean = false;
  constructor(
    public dialog: MatDialog,
    private AdminService: AdminService,
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
        console.log(this.allCustomers);
      }
      else if(response.data == false){
        this.allCustomers = ''
      }
    })
  }

  fnSelectCustomer(customer_id){
    alert(customer_id);
  }

  fnAddNewCustomer(){
    this.newCustomer = true;
    this.fullDetailsOfCustomer = false;
  }
  fnCancelNewCustomer(){
    this.newCustomer = false;
    this.fullDetailsOfCustomer = true;
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
