import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AdminService } from '../_services/admin-main.service'


export interface DialogData {
  animal: string;
  name: string;
 
}
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  dtOptions: any = {};
  animal: any;
  allAppointments:any;
  
  constructor(
    public dialog: MatDialog,
    private AdminService: AdminService,
    ) {
      localStorage.setItem('isBusiness', 'false');
     }

  ngOnInit() {
    this.dtOptions = {
      // Use this attribute to enable the responsive extension
      responsive: true
    };
  }


  getAllBusiness(){
    this.AdminService.getAllBusiness().subscribe((response:any) => {
      if(response.data == true){
        this.allAppointments = response.response
      }
      else if(response.data == false){
        this.allAppointments = ''
      }
    })
  }

  addAppointment() {
    const dialogRef = this.dialog.open(DialogAddNewAppointment, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
       this.animal = result;
     });
  }

   
  newAppointment() {
    const dialogRef = this.dialog.open(DialogNewAppointment, {
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