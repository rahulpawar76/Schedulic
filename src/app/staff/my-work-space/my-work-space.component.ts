import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StaffService } from '../_services/staff.service'

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
  styleUrls: ['./my-work-space.component.scss']
})
export class MyWorkSpaceComponent implements OnInit {
  

  animal: string;
  todayAppointmentData: any;
  activeBooking: any;
  constructor(
    public dialog: MatDialog,
    private StaffService: StaffService,
  ) { }

  ngOnInit() {
    this.getTodayAppointment();
  }

  getTodayAppointment(){
    this.StaffService.getTodayAppointment().subscribe((response:any) => {
      if(response.data == true){
        this.todayAppointmentData = response.response
        this.activeBooking = 0;
      }
      else if(response.data == false){
        this.todayAppointmentData = ''
      }
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

    alert(index);
  }

}

@Component({
  selector: 'today-appointment-details',
  templateUrl: '../_dialogs/today-appointment-details.html',
})
export class DialogTodayAppointmentDetail {

appoDetail : any;
constructor(
  public dialogRef: MatDialogRef<DialogTodayAppointmentDetail>,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.appoDetail = this.data.fullData
    console.log(this.appoDetail);
  }

onNoClick(): void {
  this.dialogRef.close();
}

}
