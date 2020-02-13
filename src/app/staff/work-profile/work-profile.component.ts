import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { StaffService } from '../_services/staff.service'

@Component({
  selector: 'app-work-profile',
  templateUrl: './work-profile.component.html',
  styleUrls: ['./work-profile.component.scss']
})
export class WorkProfileComponent implements OnInit {

  
 animal: any;
 error:any;
 serviceData: any;
 workingHours: any;

 dayName: any;

  constructor(
    private StaffService: StaffService,
  ) { }

  ngOnInit() {

    this.getAllServices();
    this.getWorkingHours();
  }

  getAllServices(){
    this.StaffService.getAllServices().subscribe((response:any) => {
      if(response.data == true){
        this.serviceData = response.response;
      }
      else{
        alert("Service Not Found");
      }
    },
      (err) => {
        this.error = err;
      }
    )
  }
  getWorkingHours(){
    this.StaffService.getWorkingHours().subscribe((response:any) => {
      if(response.data == true){
        this.workingHours = response.response;
        console.log(this.workingHours);
          if(this.workingHours.week_day_id == '1'){
            this.dayName == 'Monday'
          }else if(this.workingHours.week_day_id == '2'){
            this.dayName == 'Tuesday'
          }else if(this.workingHours.week_day_id == '3'){
            this.dayName == 'Wednesday'
          }else if(this.workingHours.week_day_id == '4'){
            this.dayName == 'Thursday'
          }else if(this.workingHours.week_day_id == '5'){
            this.dayName == 'Friday'
          }else if(this.workingHours.week_day_id == '6'){
            this.dayName == 'Saturday'
          }else if(this.workingHours.week_day_id == '7'){
            this.dayName == 'Sunday'
          }
          alert(this.dayName);
      }
      else{
        alert("Working Hours Not Found");
      }
    },
      (err) => {
        this.error = err;
      }
    )
  }

}
