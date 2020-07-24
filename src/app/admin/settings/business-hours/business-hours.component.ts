import { Component, OnInit,Inject } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AdminSettingsService } from '../_services/admin-settings.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DatePipe} from '@angular/common';
import { MatSnackBar} from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


export interface DialogData {
  animal: string;
  name: string;
  
}
@Component({
  selector: 'app-business-hours',
  templateUrl: './business-hours.component.html',
  styleUrls: ['./business-hours.component.scss'],
  providers: [DatePipe]
})
export class BusinessHoursComponent implements OnInit {
  adminSettings : boolean = true;
  mondayOn : boolean;
  tuesdayOn : boolean;
  wednesdayOn : boolean;
  thursdayOn : boolean;
  fridayOn : boolean;
  saturdayOn : boolean;
  sundayOn : boolean;
  animal: any;
  businessId: any;
  timeZoneList: any=[];
  workingHoursList: any=[];
  timeSlotList: any=[];
  timeOffList: any=[];
  breakTimeList: any=[];
  selectedTimeZone: any;
  selectedStartTimeMonday: any;
  selectedEndTimeMonday: any;
  selectedStartTimeTuesday: any;
  selectedEndTimeTuesday: any;
  selectedStartTimeWednesday: any;
  selectedEndTimeWednesday: any;
  selectedStartTimeThursday: any;
  selectedEndTimeThursday: any;
  selectedStartTimeFriday: any;
  selectedEndTimeFriday: any;
  selectedStartTimeSaturday: any;
  selectedEndTimeSaturday: any;
  selectedStartTimeSunday: any;
  selectedEndTimeSunday: any;
  showMondayAddForm: boolean=false;
  showTuesdayAddForm: boolean=false;
  showWednesdayAddForm: boolean=false;
  showThursdayAddForm: boolean=false;
  showFridayAddForm: boolean=false;
  showSaturdayAddForm: boolean=false;
  showSundayAddForm: boolean=false;
  mondayWorkingHourStartTimeIndex:any;
  mondayWorkingHourEndTimeIndex:any;
  tuesdayWorkingHourStartTimeIndex:any;
  tuesdayWorkingHourEndTimeIndex:any;
  wednesdayWorkingHourStartTimeIndex:any;
  wednesdayWorkingHourEndTimeIndex:any;
  thursdayWorkingHourStartTimeIndex:any;
  thursdayWorkingHourEndTimeIndex:any;
  fridayWorkingHourStartTimeIndex:any;
  fridayWorkingHourEndTimeIndex:any;
  saturdayWorkingHourStartTimeIndex:any;
  saturdayWorkingHourEndTimeIndex:any;
  sundayWorkingHourStartTimeIndex:any;
  sundayWorkingHourEndTimeIndex:any;
  mondayBreakStartTimeIndex:any;
  mondayBreakEndTimeIndex:any;
  tuesdayBreakStartTimeIndex:any;
  tuesdayBreakEndTimeIndex:any;
  wednesdayBreakStartTimeIndex:any;
  wednesdayBreakEndTimeIndex:any;
  thursdayBreakStartTimeIndex:any;
  thursdayBreakEndTimeIndex:any;
  fridayBreakStartTimeIndex:any;
  fridayBreakEndTimeIndex:any;
  saturdayBreakStartTimeIndex:any;
  saturdayBreakEndTimeIndex:any;
  sundayBreakStartTimeIndex:any;
  sundayBreakEndTimeIndex:any;
  formSetWorkingHours: FormGroup;
  settingSideMenuToggle : boolean = false;
  constructor(private appComponent : AppComponent,
    public dialog: MatDialog, 
    public adminSettingsService: AdminSettingsService,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar) { 
    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
    }
    this.fnGetTimeZone();
    this.fnGetTimeSlotsList("08:00","18:00","30");
    this.fnGetBussinessTimeZone();
    this.fnGetWorkingHours();
    this.fnGetTimeOffList();
    this.fnGetBreakTimeList();

    this.formSetWorkingHours = this._formBuilder.group({
      mondayToggle: [false],
      mondayStartTime: [this.timeSlotList[0].long],
      mondayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      tuesdayToggle: [false],
      tuesdayStartTime: [this.timeSlotList[0].long],
      tuesdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      wednesdayToggle: [false],
      wednesdayStartTime: [this.timeSlotList[0].long],
      wednesdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      thursdayToggle: [false],
      thursdayStartTime: [this.timeSlotList[0].long],
      thursdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      fridayToggle: [false],
      fridayStartTime: [this.timeSlotList[0].long],
      fridayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      saturdayToggle: [false],
      saturdayStartTime: [this.timeSlotList[0].long],
      saturdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      sundayToggle: [false],
      sundayStartTime: [this.timeSlotList[0].long],
      sundayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
    })
  }

  ngOnInit() {
  }

  fnGetBussinessTimeZone(){
    let requestObject={
      "business_id":this.businessId
    }

    this.adminSettingsService.getBussinessTimeZone(requestObject).subscribe((response:any) => {
      if(response.data == true){
       this.selectedTimeZone= response.response[0].time_zone;
      }
    })
  }

  fnCreateWorkingHours(){
    if(this.formSetWorkingHours.invalid){
    
      return false;
    }
    let workingHoursArray:any=[];
    let workingHoursTempArray={
      dayNumber:"",
      start_time:"",
      end_time:"",
      offday:""
    };

    workingHoursTempArray={
      dayNumber:"1",
      start_time:this.formSetWorkingHours.get("mondayStartTime").value,
      end_time:this.formSetWorkingHours.get("mondayEndTime").value,
      offday:this.formSetWorkingHours.get("mondayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"2",
      start_time:this.formSetWorkingHours.get("tuesdayStartTime").value,
      end_time:this.formSetWorkingHours.get("tuesdayEndTime").value,
      offday:this.formSetWorkingHours.get("tuesdayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"3",
      start_time:this.formSetWorkingHours.get("wednesdayStartTime").value,
      end_time:this.formSetWorkingHours.get("wednesdayEndTime").value,
      offday:this.formSetWorkingHours.get("wednesdayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"4",
      start_time:this.formSetWorkingHours.get("thursdayStartTime").value,
      end_time:this.formSetWorkingHours.get("thursdayEndTime").value,
      offday:this.formSetWorkingHours.get("thursdayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"5",
      start_time:this.formSetWorkingHours.get("fridayStartTime").value,
      end_time:this.formSetWorkingHours.get("fridayEndTime").value,
      offday:this.formSetWorkingHours.get("fridayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"6",
      start_time:this.formSetWorkingHours.get("saturdayStartTime").value,
      end_time:this.formSetWorkingHours.get("saturdayEndTime").value,
      offday:this.formSetWorkingHours.get("saturdayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"0",
      start_time:this.formSetWorkingHours.get("sundayStartTime").value,
      end_time:this.formSetWorkingHours.get("sundayEndTime").value,
      offday:this.formSetWorkingHours.get("sundayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);
    console.log(JSON.stringify(workingHoursArray));
    let requestObject={
      "business_id":this.businessId,
      "workingHour":workingHoursArray
    }
    console.log(JSON.stringify(requestObject));

    this.adminSettingsService.createWorkingHours(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnGetWorkingHours();
        this.snackBar.open("Working Hours Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Working Hours Not Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnApplyToAll(){
    // if(!this.mondayOn){
    //   return false;
    // }
    // if(this.formSetWorkingHours.get("mondayToggle").value){
      if(this.formSetWorkingHours.get("mondayStartTime").value == '' || this.formSetWorkingHours.get("mondayEndTime").value == '' || this.formSetWorkingHours.get("mondayStartTime").value == null || this.formSetWorkingHours.get("mondayEndTime").value == null){
        this.snackBar.open("Start & End Time can not be empty.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        return false;
      }
    // }
    let requestObject={
      "business_id":this.businessId,
      "start_time":this.formSetWorkingHours.get("mondayStartTime").value,
      "end_time":this.formSetWorkingHours.get("mondayEndTime").value,
      "off_day":this.formSetWorkingHours.get("mondayToggle").value?"N":"Y"
    }
    console.log(JSON.stringify(requestObject));

    this.adminSettingsService.applyToAll(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnGetWorkingHours();
        this.snackBar.open("Working Hours applied to all.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Working Hours Not Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnChangeToggle(event,day){
    console.log(event);
    if(day=="Monday"){
      this.mondayOn=event.checked;
    }
    if(day=="Tuesday"){
      this.tuesdayOn=event.checked;
    }
    if(day=="Wednesday"){
      this.wednesdayOn=event.checked;
    }
    if(day=="Thursday"){
      this.thursdayOn=event.checked;
    }
    if(day=="Friday"){
      this.fridayOn=event.checked;
    }
    if(day=="Saturday"){
      this.saturdayOn=event.checked;
    }
    if(day=="Sunday"){
      this.sundayOn=event.checked;
    }
    
    this.fnFormBuild(this.mondayOn,this.tuesdayOn,this.wednesdayOn,this.thursdayOn,this.fridayOn,this.saturdayOn,this.sundayOn);
  }

  fnGetTimeSlotsList(start, end,interval){
    var start = start.split(":");
    var end = end.split(":");

    start = parseInt(start[0]) * 60 + parseInt(start[1]);
    end = parseInt(end[0]) * 60 + parseInt(end[1]);

    var result = [];

    for ( var time = start; time <= end; time+=parseInt(interval)){
        result.push( this.timeString(time));
    }
  
    this.timeSlotList=result;
    console.log(this.timeSlotList[0]);
  }

  timeString(time){
      var hours = Math.floor(time / 60);
      var minutes = time % 60;

      if (hours < 10)
      {
        let h="0" + hours;
        hours = parseFloat(h); //optional
      } 
      if (minutes < 10)
      {
        let m="0" + minutes;
        minutes = parseFloat(m); //optional
      }  
      let tempArr={
        long: this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+hours + ":" + minutes),"HH:mm"),
        short:this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+hours + ":" + minutes),"hh:mm a")
      };
     return tempArr;
  }



  fnGetTimeZone(){
    this.adminSettingsService.getTimeZone().subscribe((response:any) => {
      
    if(response.data == true){
      this.timeZoneList = response.response;
        console.log(this.timeZoneList)
      // // this.timeZoneList.forEach(element => {\
      //   var aestTime = new Date().toLocaleString("en-US", {timeZone: "Australia/Brisbane"});
      //   aestTime = new Date(aestTime);
      //   console.log('AEST time: '+aestTime.toLocaleString())

      //   var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Shanghai"});
      //   asiaTime = new Date(asiaTime);
      //   console.log('Asia time: '+asiaTime.toLocaleString())

      //   var usaTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
      //   usaTime = new Date(usaTime);
      //   console.log('USA time: '+usaTime.toLocaleString())

      //   var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
      //   indiaTime = new Date(indiaTime);
      //   console.log('India time: '+indiaTime.toLocaleString());

      //   console.log(this.datePipe.transform(new Date(this.timeZoneList[399].gmtOffset),"z"))
      // // });
    }
    else{
     this.timeZoneList = [];
    }
    })
  }

  fnChangeTimeZone(event){
    let requestObject={
      "business_id":this.businessId,
      "timezone":event.value
    }
    this.adminSettingsService.changeTimeZone(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Timezone Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Timezone Not Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnGetWorkingHours(){
    let requestObject={
      "business_id":this.businessId
    }
    this.adminSettingsService.getWorkingHours(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.workingHoursList=response.response;
        console.log(this.workingHoursList);
        this.workingHoursList.forEach(element => {
          if(element.week_day_id == 0){
            element.week_day_name="Sunday";
            if(element.off_day=="N"){
              this.sundayOn=true;
            }else{
              this.sundayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 1){
            element.week_day_name="Monday";            
            if(element.off_day=="N"){
              this.mondayOn=true;
            }else{
              this.mondayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 2){
            element.week_day_name="Tuesday";         
            if(element.off_day=="N"){
              this.tuesdayOn=true;
            }else{
              this.tuesdayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 3){
            element.week_day_name="Wednesday";        
            if(element.off_day=="N"){
              this.wednesdayOn=true;
            }else{
              this.wednesdayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 4){
            element.week_day_name="Thursday";       
            if(element.off_day=="N"){
              this.thursdayOn=true;
            }else{
              this.thursdayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 5){
            element.week_day_name="Friday";     
            if(element.off_day=="N"){
              this.fridayOn=true;
            }else{
              this.fridayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 6){
            element.week_day_name="Saturday";    
            if(element.off_day=="N"){
              this.saturdayOn=true;
            }else{
              this.saturdayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
        });
        console.log(this.workingHoursList);

        for(var i=0; i<this.timeSlotList.length; i++){
          if(this.timeSlotList[i].long==this.workingHoursList[0].day_start_time){
            this.mondayWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.workingHoursList[0].day_end_time){
            this.mondayWorkingHourEndTimeIndex=i;
          }
          
          if(this.timeSlotList[i].long==this.workingHoursList[1].day_start_time){
            this.tuesdayWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.workingHoursList[1].day_end_time){
            this.tuesdayWorkingHourEndTimeIndex=i;
          }
          
          if(this.timeSlotList[i].long==this.workingHoursList[2].day_start_time){
            this.wednesdayWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.workingHoursList[2].day_end_time){
            this.wednesdayWorkingHourEndTimeIndex=i;
          }
          
          if(this.timeSlotList[i].long==this.workingHoursList[3].day_start_time){
            this.thursdayWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.workingHoursList[3].day_end_time){
            this.thursdayWorkingHourEndTimeIndex=i;
          }
          
          if(this.timeSlotList[i].long==this.workingHoursList[4].day_start_time){
            this.fridayWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.workingHoursList[4].day_end_time){
            this.fridayWorkingHourEndTimeIndex=i;
          }
          
          if(this.timeSlotList[i].long==this.workingHoursList[5].day_start_time){
            this.saturdayWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.workingHoursList[5].day_end_time){
            this.saturdayWorkingHourEndTimeIndex=i;
          }
          
          if(this.timeSlotList[i].long==this.workingHoursList[6].day_start_time){
            this.sundayWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.workingHoursList[6].day_end_time){
            this.sundayWorkingHourEndTimeIndex=i;
          }

        }

        console.log(this.mondayWorkingHourStartTimeIndex);
        
        this.formSetWorkingHours = this._formBuilder.group({
          mondayToggle: [this.workingHoursList[0].off_day=="N"?true:false,this.mondayOn?Validators.required:''],
          mondayStartTime: [this.workingHoursList[0].day_start_time,this.mondayOn?Validators.required:''],
          mondayEndTime: [this.workingHoursList[0].day_end_time,this.mondayOn?Validators.required:''],
          tuesdayToggle: [this.workingHoursList[1].off_day=="N"?true:false,this.tuesdayOn?Validators.required:''],
          tuesdayStartTime: [this.workingHoursList[1].day_start_time,this.tuesdayOn?Validators.required:''],
          tuesdayEndTime: [this.workingHoursList[1].day_end_time,this.tuesdayOn?Validators.required:''],
          wednesdayToggle: [this.workingHoursList[2].off_day=="N"?true:false,this.wednesdayOn?Validators.required:''],
          wednesdayStartTime: [this.workingHoursList[2].day_start_time,this.wednesdayOn?Validators.required:''],
          wednesdayEndTime: [this.workingHoursList[2].day_end_time,this.wednesdayOn?Validators.required:''],
          thursdayToggle: [this.workingHoursList[3].off_day=="N"?true:false,this.thursdayOn?Validators.required:''],
          thursdayStartTime: [this.workingHoursList[3].day_start_time,this.thursdayOn?Validators.required:''],
          thursdayEndTime: [this.workingHoursList[3].day_end_time,this.thursdayOn?Validators.required:''],
          fridayToggle: [this.workingHoursList[4].off_day=="N"?true:false,this.fridayOn?Validators.required:''],
          fridayStartTime: [this.workingHoursList[4].day_start_time,this.fridayOn?Validators.required:''],
          fridayEndTime: [this.workingHoursList[4].day_end_time,this.fridayOn?Validators.required:''],
          saturdayToggle: [this.workingHoursList[5].off_day=="N"?true:false,this.saturdayOn?Validators.required:''],
          saturdayStartTime: [this.workingHoursList[5].day_start_time,this.saturdayOn?Validators.required:''],
          saturdayEndTime: [this.workingHoursList[5].day_end_time,this.saturdayOn?Validators.required:''],
          sundayToggle: [this.workingHoursList[6].off_day=="N"?true:false,this.sundayOn?Validators.required:''],
          sundayStartTime: [this.workingHoursList[6].day_start_time,this.sundayOn?Validators.required:''],
          sundayEndTime: [this.workingHoursList[6].day_end_time,this.sundayOn?Validators.required:''],
        })
      }
      else{
       
      }
    })
  }

  fnOnChangeStartTimeWorkingHour(event,day){
    console.log(event);
    console.log(day);
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.mondayWorkingHourEndTimeIndex<=this.mondayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["mondayEndTime"].setValue(null);
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.tuesdayWorkingHourEndTimeIndex<=this.tuesdayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["tuesdayEndTime"].setValue(null);
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.wednesdayWorkingHourEndTimeIndex<=this.wednesdayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["wednesdayEndTime"].setValue(null);
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.thursdayWorkingHourEndTimeIndex<=this.thursdayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["thursdayEndTime"].setValue(null);
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.fridayWorkingHourEndTimeIndex<=this.fridayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["fridayEndTime"].setValue(null);
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.saturdayWorkingHourEndTimeIndex<=this.saturdayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["saturdayEndTime"].setValue(null);
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.sundayWorkingHourEndTimeIndex<=this.sundayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["sundayEndTime"].setValue(null);
      }
    }

  }

  fnOnChangeEndTimeWorkingHour(event,day){
    console.log(event);
    console.log(day);
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayWorkingHourEndTimeIndex=i;
        }
      }
    }
  }

  fnFormBuild(mondayOn,tuesdayOn,wednesdayOn,thursdayOn,fridayOn,saturdayOn,sundayOn){
    console.log(mondayOn+"--"+tuesdayOn+"--"+wednesdayOn+"--"+thursdayOn+"--"+fridayOn+"--"+saturdayOn+"--"+sundayOn);
    this.formSetWorkingHours = this._formBuilder.group({
      mondayToggle: [this.formSetWorkingHours.get("mondayToggle").value?true:false,mondayOn?Validators.required:''],
      mondayStartTime: [this.formSetWorkingHours.get("mondayStartTime").value,mondayOn?Validators.required:''],
      mondayEndTime: [this.formSetWorkingHours.get("mondayEndTime").value,mondayOn?Validators.required:''],
      tuesdayToggle: [this.formSetWorkingHours.get("tuesdayToggle").value?true:false,tuesdayOn?Validators.required:''],
      tuesdayStartTime: [this.formSetWorkingHours.get("tuesdayStartTime").value,tuesdayOn?Validators.required:''],
      tuesdayEndTime: [this.formSetWorkingHours.get("tuesdayEndTime").value,tuesdayOn?Validators.required:''],
      wednesdayToggle: [this.formSetWorkingHours.get("wednesdayToggle").value?true:false,wednesdayOn?Validators.required:''],
      wednesdayStartTime: [this.formSetWorkingHours.get("wednesdayStartTime").value,wednesdayOn?Validators.required:''],
      wednesdayEndTime: [this.formSetWorkingHours.get("wednesdayEndTime").value,wednesdayOn?Validators.required:''],
      thursdayToggle: [this.formSetWorkingHours.get("thursdayToggle").value?true:false,thursdayOn?Validators.required:''],
      thursdayStartTime: [this.formSetWorkingHours.get("thursdayStartTime").value,thursdayOn?Validators.required:''],
      thursdayEndTime: [this.formSetWorkingHours.get("thursdayEndTime").value,thursdayOn?Validators.required:''],
      fridayToggle: [this.formSetWorkingHours.get("fridayToggle").value?true:false,fridayOn?Validators.required:''],
      fridayStartTime: [this.formSetWorkingHours.get("fridayStartTime").value,fridayOn?Validators.required:''],
      fridayEndTime: [this.formSetWorkingHours.get("fridayEndTime").value,fridayOn?Validators.required:''],
      saturdayToggle: [this.formSetWorkingHours.get("saturdayToggle").value?true:false,saturdayOn?Validators.required:''],
      saturdayStartTime: [this.formSetWorkingHours.get("saturdayStartTime").value,saturdayOn?Validators.required:''],
      saturdayEndTime: [this.formSetWorkingHours.get("saturdayEndTime").value,saturdayOn?Validators.required:''],
      sundayToggle: [this.formSetWorkingHours.get("sundayToggle").value?true:false,sundayOn?Validators.required:''],
      sundayStartTime: [this.formSetWorkingHours.get("sundayStartTime").value,sundayOn?Validators.required:''],
      sundayEndTime: [this.formSetWorkingHours.get("sundayEndTime").value,sundayOn?Validators.required:''],
    })
  }

  addTimeOff(){
    const dialogRef = this.dialog.open(DialogAddNewTimeOffBussiness, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result != undefined){
        if(result.call==true){
        this.fnGetTimeOffList();
       }
      }
       
     });

  }

  fnGetTimeOffList(){
    let requestObject={
      "business_id":this.businessId
    }

    this.adminSettingsService.getTimeOffList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.timeOffList= response.response;
        console.log(this.timeOffList);
        this.timeOffList.forEach(element => {
          if(element.start_date){
            element.start_date=this.datePipe.transform(new Date(element.start_date),"MMM dd, yyyy");
          }
          if(element.end_date){
            element.end_date=this.datePipe.transform(new Date(element.end_date),"MMM dd, yyyy");
          }
        });
      }else{
        this.timeOffList= [];
      }
    })
  }

  fnDeleteTimeOff(timeOffId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(timeOffId);
        let requestObject={
          "time_off_id":timeOffId
        }

        this.adminSettingsService.deleteTimeOffStaff(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.fnGetTimeOffList();
            this.snackBar.open("Time off Deleted.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
          }else{
           this.snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }
        })
      }
    });
  }

  fnChangeTimeOffStatus(event,timeOffId){
    console.log(event.checked+"--"+timeOffId);
    let requestObject={
      "time_off_id":timeOffId,
      "status":event.checked?"E":"D"
    }

    this.adminSettingsService.changeTimeOffStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnGetTimeOffList();
        this.snackBar.open("Time off status updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }else{
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnGetBreakTimeList(){
    let requestObject={
      "business_id":this.businessId
    }

    this.adminSettingsService.getBreakTimeList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.breakTimeList= response.response;
        console.log(this.breakTimeList);
        this.breakTimeList.forEach(element => {
          if(element.break_start_time){
           element.break_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.break_start_time),"HH:mm");
          }
          if(element.break_end_time){
            element.break_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.break_end_time),"HH:mm");
          }
        });
      }else{
        this.breakTimeList= [];
      }
    })
  }

  fnShowAddBreakForm(day){
    if(day == "Monday"){
      this.selectedStartTimeMonday=this.formSetWorkingHours.get("mondayStartTime").value;
      this.selectedEndTimeMonday=this.formSetWorkingHours.get("mondayEndTime").value;
      this.showMondayAddForm=this.showMondayAddForm==true?false:true;
      this.mondayBreakStartTimeIndex=0;
      this.mondayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Tuesday"){
      this.selectedStartTimeTuesday=this.formSetWorkingHours.get("tuesdayStartTime").value;
      this.selectedEndTimeTuesday=this.formSetWorkingHours.get("tuesdayEndTime").value;
      this.showTuesdayAddForm=this.showTuesdayAddForm==true?false:true;
      this.tuesdayBreakStartTimeIndex=0;
      this.tuesdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Wednesday"){
      this.selectedStartTimeWednesday=this.formSetWorkingHours.get("wednesdayStartTime").value;
      this.selectedEndTimeWednesday=this.formSetWorkingHours.get("wednesdayEndTime").value;
      this.showWednesdayAddForm=this.showWednesdayAddForm==true?false:true;
      this.wednesdayBreakStartTimeIndex=0;
      this.wednesdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Thursday"){
      this.selectedStartTimeThursday=this.formSetWorkingHours.get("thursdayStartTime").value;
      this.selectedEndTimeThursday=this.formSetWorkingHours.get("thursdayEndTime").value;
      this.showThursdayAddForm=this.showThursdayAddForm==true?false:true;
      this.thursdayBreakStartTimeIndex=0;
      this.thursdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Friday"){
      this.selectedStartTimeFriday=this.formSetWorkingHours.get("fridayStartTime").value;
      this.selectedEndTimeFriday=this.formSetWorkingHours.get("fridayEndTime").value;
      this.showFridayAddForm=this.showFridayAddForm==true?false:true;
      this.fridayBreakStartTimeIndex=0;
      this.fridayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Saturday"){
      this.selectedStartTimeSaturday=this.formSetWorkingHours.get("saturdayStartTime").value;
      this.selectedEndTimeSaturday=this.formSetWorkingHours.get("saturdayEndTime").value;
      this.showSaturdayAddForm=this.showSaturdayAddForm==true?false:true;
      this.saturdayBreakStartTimeIndex=0;
      this.saturdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Sunday"){
      this.selectedStartTimeSunday=this.formSetWorkingHours.get("sundayStartTime").value;
      this.selectedEndTimeSunday=this.formSetWorkingHours.get("sundayEndTime").value;
      this.showSundayAddForm=this.showSundayAddForm==true?false:true;
      this.sundayBreakStartTimeIndex=0;
      this.sundayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
  }

  fnOnChangeStartTimeBreak(event,day){
    console.log(event);
    console.log(day);
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayBreakStartTimeIndex=i;
        }
      }
      if(this.mondayBreakEndTimeIndex<=this.mondayBreakStartTimeIndex){
        this.selectedEndTimeMonday=null;
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayBreakStartTimeIndex=i;
        }
      }
      if(this.tuesdayBreakEndTimeIndex<=this.tuesdayBreakStartTimeIndex){
        this.selectedEndTimeTuesday=null;
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayBreakStartTimeIndex=i;
        }
      }
      if(this.wednesdayBreakEndTimeIndex<=this.wednesdayBreakStartTimeIndex){
        this.selectedEndTimeWednesday=null;
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayBreakStartTimeIndex=i;
        }
      }
      if(this.thursdayBreakEndTimeIndex<=this.thursdayBreakStartTimeIndex){
        this.selectedEndTimeThursday=null;
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayBreakStartTimeIndex=i;
        }
      }
      if(this.fridayBreakEndTimeIndex<=this.fridayBreakStartTimeIndex){
        this.selectedEndTimeFriday=null;
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayBreakStartTimeIndex=i;
        }
      }
      if(this.saturdayBreakEndTimeIndex<=this.saturdayBreakStartTimeIndex){
        this.selectedEndTimeSaturday=null;
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayBreakStartTimeIndex=i;
        }
      }
      if(this.sundayBreakEndTimeIndex<=this.sundayBreakStartTimeIndex){
        this.selectedEndTimeSunday=null;
      }
    }

  }

  fnOnChangeEndTimeBreak(event,day){
    console.log(event);
    console.log(day);
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayBreakEndTimeIndex=i;
        }
      }
    }
  }
  fnSettingMenuToggleSmall(){
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge(){
    this.settingSideMenuToggle = false;
  }

  fnAddBreak(day){
    let requestObject={
      "business_id":'',
      "start_time":'',
      "end_time":'',
      "dayNumber":''
    }
    if(day == "Monday"){
      if(this.selectedStartTimeMonday==null || this.selectedEndTimeMonday==null){
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeMonday,
        "end_time":this.selectedEndTimeMonday,
        "dayNumber":"1"
      }
      console.log(requestObject);
    }
    if(day == "Tuesday"){
      if(this.selectedStartTimeTuesday==null || this.selectedEndTimeTuesday==null){
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeTuesday,
        "end_time":this.selectedEndTimeTuesday,
        "dayNumber":"2"
      }
      console.log(requestObject);
    }
    if(day == "Wednesday"){
      if(this.selectedStartTimeWednesday==null || this.selectedEndTimeWednesday==null){
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeWednesday,
        "end_time":this.selectedEndTimeWednesday,
        "dayNumber":"3"
      }
      console.log(requestObject);
    }
    if(day == "Thursday"){
      if(this.selectedStartTimeThursday==null || this.selectedEndTimeThursday==null){
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeThursday,
        "end_time":this.selectedEndTimeThursday,
        "dayNumber":"4"
      }
      console.log(requestObject);
    }
    if(day == "Friday"){
      if(this.selectedStartTimeFriday==null || this.selectedEndTimeFriday==null){
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeFriday,
        "end_time":this.selectedEndTimeFriday,
        "dayNumber":"5"
      }
      console.log(requestObject);
    }
    if(day == "Saturday"){
      if(this.selectedStartTimeSaturday==null || this.selectedEndTimeSaturday==null){
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeSaturday,
        "end_time":this.selectedEndTimeSaturday,
        "dayNumber":"6"
      }
      console.log(requestObject);
    }
    if(day == "Sunday"){
      if(this.selectedStartTimeSunday==null || this.selectedEndTimeSunday==null){
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeSunday,
        "end_time":this.selectedEndTimeSunday,
        "dayNumber":"0"
      }
      console.log(requestObject);
    }
    this.adminSettingsService.addNewBreak(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnGetBreakTimeList();
        this.showMondayAddForm=false;
        this.showTuesdayAddForm=false;
        this.showWednesdayAddForm=false;
        this.showThursdayAddForm=false;
        this.showFridayAddForm=false;
        this.showSaturdayAddForm=false;
        this.showSundayAddForm=false;
        this.snackBar.open("Break Added.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnDeleteBreak(breakId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(breakId);
        let requestObject={
          "break_id":breakId
        }

        this.adminSettingsService.deleteBreak(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.fnGetBreakTimeList();
            this.snackBar.open("Break Deleted.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
          }else{
           this.snackBar.open("Break Not Deleted.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }
        })
      }
    });
  }
}

@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/bussiness-hour-add-time-off.html',
  providers: [DatePipe]
})
export class DialogAddNewTimeOffBussiness {

businessId:any;
minStartDate = new Date();
minEndDate = new Date();
formAddNewTimeOff: FormGroup;
constructor(
  public dialogRef: MatDialogRef<DialogAddNewTimeOffBussiness>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData,
  private datePipe: DatePipe,
  private _formBuilder: FormBuilder, 
  public adminSettingsService: AdminSettingsService,
  private snackBar: MatSnackBar) {
  this.formAddNewTimeOff = this._formBuilder.group({
    startDate: [this.minStartDate,Validators.required],
    endDate: ['',Validators.required],
    description: ['',Validators.required],
  });
  if(localStorage.getItem('business_id')){
    this.businessId = localStorage.getItem('business_id');
  }
}

fnDateChange(event: MatDatepickerInputEvent<Date>){
  console.log(event);
  this.minEndDate=event.value
}

onNoClick(): void {
  this.dialogRef.close({ call: false });
}

fnAddNewTimeOff(){
  if(this.formAddNewTimeOff.invalid){
    this.formAddNewTimeOff.get("startDate").markAsTouched();
    this.formAddNewTimeOff.get("endDate").markAsTouched();
    this.formAddNewTimeOff.get("description").markAsTouched();
    return false;
  }
  let requestObject={
      "business_id":this.businessId,
      "start_date":this.datePipe.transform(new Date(this.formAddNewTimeOff.get("startDate").value),"yyyy-MM-dd"),
      "end_date":this.datePipe.transform(new Date(this.formAddNewTimeOff.get("endDate").value),"yyyy-MM-dd"),
      "description":this.formAddNewTimeOff.get("description").value
    }
    console.log(JSON.stringify(requestObject));
    this.adminSettingsService.addNewTimeOff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.dialogRef.close({ call: true });
        this.snackBar.open("Time off added.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
}


}
