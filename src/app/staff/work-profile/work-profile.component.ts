import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { StaffService } from '../_services/staff.service';
import { DatePipe} from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-work-profile',
  templateUrl: './work-profile.component.html',
  styleUrls: ['./work-profile.component.scss'],
  providers: [DatePipe]
})
export class WorkProfileComponent implements OnInit {

  
 animal: any;
 error:any;
 serviceData: any;
 workingHours: any = [];
 breakHours: any = [];
 offDays: any = [];
 offDayId: any = [];
 holidayData: any;
 postalCodeData: any;


  constructor(
    private StaffService: StaffService,
    private datePipe: DatePipe,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('My Work Profile');

    this.getAllServices();
    this.getWorkingHours();
    this.getBreakHours();
    this.getAllHolidays();
    this.getAllPostalcodes();
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
    }
    return function (a, b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
    }
  }
  getAllServices(){
    this.StaffService.getAllServices().subscribe((response:any) => {
      if(response.data == true){
        this.serviceData = response.response;
      }
      else if(response.data == false){
        this.serviceData = '';
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
        for(let i=0; i<this.workingHours.length;i++){
          if(this.workingHours[i].week_day_id == "0"){
            this.workingHours[i].week_day_name = "Sunday";
          }
          if(this.workingHours[i].week_day_id == "1"){
            this.workingHours[i].week_day_name = "Monday";

          } 
          if(this.workingHours[i].week_day_id == "2"){
            this.workingHours[i].week_day_name = "Tuesday";

          } 
          if(this.workingHours[i].week_day_id == "3"){
            this.workingHours[i].week_day_name = "Wednesday";

          } 
          if(this.workingHours[i].week_day_id == "4"){
            this.workingHours[i].week_day_name = "Thursday";

          } 
          if(this.workingHours[i].week_day_id == "5"){
            this.workingHours[i].week_day_name = "Friday";

          } 
          if(this.workingHours[i].week_day_id == "6"){
            this.workingHours[i].week_day_name = "Saturday";

          }
          this.workingHours[i].day_start_timeForLabel=this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+this.workingHours[i].day_start_time;
          this.workingHours[i].day_start_timeForLabel =this.datePipe.transform(new Date(this.workingHours[i].day_start_timeForLabel),"HH:mm");
          
          this.workingHours[i].day_end_timeForLabel=this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+this.workingHours[i].day_end_time;
          this.workingHours[i].day_end_timeForLabel =this.datePipe.transform(new Date(this.workingHours[i].day_end_timeForLabel),"HH:mm");
        }
         
      }
      else if(response.data == false){
        this.workingHours = '';
      }
    },
      (err) => {
        this.error = err;
      }
    )
  }
  getBreakHours(){
    this.StaffService.getBreakHours().subscribe((response:any) => {
      if(response.data == true){
        this.breakHours = response.response.break_time;
        this.offDays = response.response.off_day;
        this.breakHours = this.breakHours.sort(this.dynamicSort("week_day_id"));
        for(let i=0; i<this.offDays.length;i++){
          this.offDayId.push(this.offDays[i].week_day_id);
        }
        for(let i=0; i<this.breakHours.length;i++){
          if(this.breakHours[i].week_day_id == "0"){
            this.breakHours[i].week_day_name = "Sunday";
          }
          if(this.breakHours[i].week_day_id == "1"){
            this.breakHours[i].week_day_name = "Monday";

          } 
          if(this.breakHours[i].week_day_id == "2"){
            this.breakHours[i].week_day_name = "Tuesday";

          } 
          if(this.breakHours[i].week_day_id == "3"){
            this.breakHours[i].week_day_name = "Wednesday";

          } 
          if(this.breakHours[i].week_day_id == "4"){
            this.breakHours[i].week_day_name = "Thursday";

          } 
          if(this.breakHours[i].week_day_id == "5"){
            this.breakHours[i].week_day_name = "Friday";

          } 
          if(this.breakHours[i].week_day_id == "6"){
            this.breakHours[i].week_day_name = "Saturday";

          }
          this.breakHours[i].break_start_timeForLabel=this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+this.breakHours[i].break_start_time;
          this.breakHours[i].break_start_timeForLabel =this.datePipe.transform(new Date(this.breakHours[i].break_start_timeForLabel),"HH:mm");
          
          this.breakHours[i].break_end_timeForLabel=this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+this.breakHours[i].break_end_time;
          this.breakHours[i].break_end_timeForLabel =this.datePipe.transform(new Date(this.breakHours[i].break_end_timeForLabel),"HH:mm");
        }
        // for(let i=0; i<this.offDays.length;i++){
        //   if(this.offDays[i].week_day_id == "0"){
        //     this.offDays[i].week_day_name = "Sunday";
        //   }
        //   if(this.offDays[i].week_day_id == "1"){
        //     this.offDays[i].week_day_name = "Monday";

        //   } 
        //   if(this.offDays[i].week_day_id == "2"){
        //     this.offDays[i].week_day_name = "Tuesday";

        //   } 
        //   if(this.offDays[i].week_day_id == "3"){
        //     this.offDays[i].week_day_name = "Wednesday";

        //   } 
        //   if(this.offDays[i].week_day_id == "4"){
        //     this.offDays[i].week_day_name = "Thursday";

        //   } 
        //   if(this.offDays[i].week_day_id == "5"){
        //     this.offDays[i].week_day_name = "Friday";

        //   } 
        //   if(this.offDays[i].week_day_id == "6"){
        //     this.offDays[i].week_day_name = "Saturday";

        //   }
        //   this.offDays[i].start_dateForLabel =this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+this.offDays[i].day_start_time),"yyyy/MM/dd");
        //   this.offDays[i].end_dateForLabel =this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+this.offDays[i].day_end_time),"yyyy/MM/dd");
        // }
      }
      else if(response.data == false){
        this.breakHours = '';
      }
    },
      (err) => {
        this.error = err;
      }
    )
  }
  getAllHolidays(){
    this.StaffService.getAllHolidays().subscribe((response:any) => {
      if(response.data == true){
        this.holidayData = response.response;
        for(let i=0; i<this.holidayData.length;i++){
          this.holidayData[i].start_dateForLabel =this.datePipe.transform(new Date(this.holidayData[i].start_date),"yyyy/MM/dd");
          this.holidayData[i].end_dateForLabel =this.datePipe.transform(new Date(this.holidayData[i].end_date),"yyyy/MM/dd");
        }
      }
      else if(response.data == false){
        this.holidayData = '';
      }
    },
      (err) => {
        this.error = err;
      }
    )
  }
  getAllPostalcodes(){
    this.StaffService.getAllPostalcodes().subscribe((response:any) => {
      if(response.data == true){
        this.postalCodeData = response.response;
        console.log(this.postalCodeData)
      }
      else if(response.data == false){
        this.postalCodeData = '';
      }
    },
      (err) => {
        this.error = err;
      }
    )
  }

}
