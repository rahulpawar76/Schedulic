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
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isLoaderAdmin : boolean = false;
  pendingAppointments : any;
  constructor(
    private AdminService: AdminService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.dtOptions = {
      responsive: true
    };
    this.getPendingAppointments();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getPendingAppointments(){
    this.isLoaderAdmin = true;
    this.AdminService.getPendingAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.pendingAppointments = response.response
        this.dtTrigger.next();
        console.log(this.pendingAppointments);
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.pendingAppointments = ''
        this.isLoaderAdmin = false;
      }
    })
  }

}
