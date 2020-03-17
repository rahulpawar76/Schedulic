import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AdminService } from '../_services/admin-main.service';



@Component({
  selector: 'app-appointment-live',
  templateUrl: './appointment-live.component.html',
  styleUrls: ['./appointment-live.component.scss'],
  providers: [DatePipe]
})
export class AppointmentLiveComponent implements OnInit {
  isLoaderAdmin : boolean = false;
  pendingAppointments : any;
  notAssignedAppointments : any;
  onTheWayAppointments : any;
  workStartedAppointments : any;

  constructor(
    private AdminService: AdminService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getPendingAppointments();
    this.getNotAssignedAppointments();
    this.getOnThewayAppointments();
    this.getWorkStartedAppointments();
  }
  getPendingAppointments(){
    this.AdminService.getPendingAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.pendingAppointments = response.response
        console.log(this.pendingAppointments);
      }
      else if(response.data == false){
        this.pendingAppointments = ''
      }
    })
  }
  getNotAssignedAppointments(){
    this.AdminService.getNotAssignedAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.notAssignedAppointments = response.response
        console.log(this.notAssignedAppointments);
      }
      else if(response.data == false){
        this.notAssignedAppointments = ''
      }
    })
  }

  getOnThewayAppointments(){
    this.AdminService.getOnThewayAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.onTheWayAppointments = response.response
        console.log(this.onTheWayAppointments);
      }
      else if(response.data == false){
        this.onTheWayAppointments = ''
      }
    })
  }

  getWorkStartedAppointments(){
    this.AdminService.getWorkStartedAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.workStartedAppointments = response.response
        console.log(this.workStartedAppointments);
      }
      else if(response.data == false){
        this.workStartedAppointments = ''
      }
    })
  }


}
