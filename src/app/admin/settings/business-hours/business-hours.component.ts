import { Component, OnInit,Inject } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AdminSettingsService } from '../_services/admin-settings.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DatePipe} from '@angular/common';
import { MatSnackBar} from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';


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
  selected: any;
  formSetWorkingHours: FormGroup;
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
    this.fnGetWorkingHours();
    this.fnGetTimeSlotsList("8:00","23:59","30");

    this.formSetWorkingHours = this._formBuilder.group({
      mondayToggle: [''/*,[Validators.required,Validators.email]*/],
      mondayStartTime: [''/*,[Validators.required,Validators.email]*/],
      mondayEndTime: [''/*,Validators.required*/],
      tuesdayToggle: [''/*,[Validators.required,Validators.email]*/],
      tuesdayStartTime: [''/*,[Validators.required,Validators.email]*/],
      tuesdayEndTime: [''/*,Validators.required*/],
      wednesdayToggle: [''/*,[Validators.required,Validators.email]*/],
      wednesdayStartTime: [''/*,[Validators.required,Validators.email]*/],
      wednesdayEndTime: [''/*,Validators.required*/],
      thursdayToggle: [''/*,[Validators.required,Validators.email]*/],
      thursdayStartTime: [''/*,[Validators.required,Validators.email]*/],
      thursdayEndTime: [''/*,Validators.required*/],
      fridayToggle: [''/*,[Validators.required,Validators.email]*/],
      fridayStartTime: [''/*,[Validators.required,Validators.email]*/],
      fridayEndTime: [''/*,Validators.required*/],
      saturdayToggle: [''/*,[Validators.required,Validators.email]*/],
      saturdayStartTime: [''/*,[Validators.required,Validators.email]*/],
      saturdayEndTime: [''/*,Validators.required*/],
      sundayToggle: [''/*,[Validators.required,Validators.email]*/],
      sundayStartTime: [''/*,[Validators.required,Validators.email]*/],
      sundayEndTime: [''/*,Validators.required*/],
    })
  }

  ngOnInit() {
  }

  clickbtn(){
    console.log(this.formSetWorkingHours.get("mondayToggle").value);
    console.log(this.formSetWorkingHours.get("mondayStartTime").value);
    console.log(this.formSetWorkingHours.get("mondayEndTime").value);
    console.log(this.formSetWorkingHours.get("tuesdayToggle").value);
    console.log(this.formSetWorkingHours.get("tuesdayStartTime").value);
    console.log(this.formSetWorkingHours.get("tuesdayEndTime").value);
    console.log(this.formSetWorkingHours.get("wednesdayToggle").value);
    console.log(this.formSetWorkingHours.get("wednesdayStartTime").value);
    console.log(this.formSetWorkingHours.get("wednesdayEndTime").value);
    console.log(this.formSetWorkingHours.get("thursdayToggle").value);
    console.log(this.formSetWorkingHours.get("thursdayStartTime").value);
    console.log(this.formSetWorkingHours.get("thursdayEndTime").value);
    console.log(this.formSetWorkingHours.get("fridayToggle").value);
    console.log(this.formSetWorkingHours.get("fridayStartTime").value);
    console.log(this.formSetWorkingHours.get("fridayEndTime").value);
    console.log(this.formSetWorkingHours.get("saturdayToggle").value);
    console.log(this.formSetWorkingHours.get("saturdayStartTime").value);
    console.log(this.formSetWorkingHours.get("saturdayEndTime").value);
    console.log(this.formSetWorkingHours.get("sundayToggle").value);
    console.log(this.formSetWorkingHours.get("sundayStartTime").value);
    console.log(this.formSetWorkingHours.get("sundayEndTime").value);
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
    
    console.log(this.formSetWorkingHours.get("sundayToggle").value);
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
    console.log(this.timeSlotList);
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
        //long: hours + ":" + minutes,
        long: this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+hours + ":" + minutes),"HH:mm"),
        short:this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+hours + ":" + minutes),"hh:mm a")
      };
     return tempArr;
  }



  fnGetTimeZone(){
    this.adminSettingsService.getTimeZone().subscribe((response:any) => {
      
    if(response.status == "OK"){
      this.timeZoneList = response.zones;
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
        this.snackBar.open("Timezone Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Timezone Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
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
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
          }
          if(element.week_day_id == 1){
            element.week_day_name="Monday";            
            if(element.off_day=="N"){
              this.mondayOn=true;
            }else{
              this.mondayOn=false;
            }
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
          }
          if(element.week_day_id == 2){
            element.week_day_name="Tuesday";         
            if(element.off_day=="N"){
              this.tuesdayOn=true;
            }else{
              this.tuesdayOn=false;
            }
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
          }
          if(element.week_day_id == 3){
            element.week_day_name="Wednesday";        
            if(element.off_day=="N"){
              this.wednesdayOn=true;
            }else{
              this.wednesdayOn=false;
            }
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
          }
          if(element.week_day_id == 4){
            element.week_day_name="Thursday";       
            if(element.off_day=="N"){
              this.thursdayOn=true;
            }else{
              this.thursdayOn=false;
            }
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
          }
          if(element.week_day_id == 5){
            element.week_day_name="Friday";     
            if(element.off_day=="N"){
              this.fridayOn=true;
            }else{
              this.fridayOn=false;
            }
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
          }
          if(element.week_day_id == 6){
            element.week_day_name="Saturday";    
            if(element.off_day=="N"){
              this.saturdayOn=true;
            }else{
              this.saturdayOn=false;
            }
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
          }
        });
        console.log(this.workingHoursList);
        this.formSetWorkingHours = this._formBuilder.group({
          mondayToggle: [this.workingHoursList[0].off_day=="N"?true:false/*,[Validators.required,Validators.email]*/],
          mondayStartTime: [this.workingHoursList[0].day_start_time/*,[Validators.required,Validators.email]*/],
          mondayEndTime: [this.workingHoursList[0].day_end_time/*,Validators.required*/],
          tuesdayToggle: [this.workingHoursList[1].off_day=="N"?true:false/*,[Validators.required,Validators.email]*/],
          tuesdayStartTime: [this.workingHoursList[1].day_start_time/*,[Validators.required,Validators.email]*/],
          tuesdayEndTime: [this.workingHoursList[1].day_end_time/*,Validators.required*/],
          wednesdayToggle: [this.workingHoursList[2].off_day=="N"?true:false/*,[Validators.required,Validators.email]*/],
          wednesdayStartTime: [this.workingHoursList[2].day_start_time/*,[Validators.required,Validators.email]*/],
          wednesdayEndTime: [this.workingHoursList[2].day_end_time/*,Validators.required*/],
          thursdayToggle: [this.workingHoursList[3].off_day=="N"?true:false/*,[Validators.required,Validators.email]*/],
          thursdayStartTime: [this.workingHoursList[3].day_start_time/*,[Validators.required,Validators.email]*/],
          thursdayEndTime: [this.workingHoursList[3].day_end_time/*,Validators.required*/],
          fridayToggle: [this.workingHoursList[4].off_day=="N"?true:false/*,[Validators.required,Validators.email]*/],
          fridayStartTime: [this.workingHoursList[4].day_start_time/*,[Validators.required,Validators.email]*/],
          fridayEndTime: [this.workingHoursList[4].day_end_time/*,Validators.required*/],
          saturdayToggle: [this.workingHoursList[5].off_day=="N"?true:false/*,[Validators.required,Validators.email]*/],
          saturdayStartTime: [this.workingHoursList[5].day_start_time/*,[Validators.required,Validators.email]*/],
          saturdayEndTime: [this.workingHoursList[5].day_end_time/*,Validators.required*/],
          sundayToggle: [this.workingHoursList[6].off_day=="N"?true:false/*,[Validators.required,Validators.email]*/],
          sundayStartTime: [this.workingHoursList[6].day_start_time/*,[Validators.required,Validators.email]*/],
          sundayEndTime: [this.workingHoursList[6].day_end_time/*,Validators.required*/],
        })
      }
      else{
       
      }
    })
  }

  addTimeOff(){
    const dialogRef = this.dialog.open(DialogAddNewTimeOffBussiness, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
       this.animal = result;
     });

  }

}

@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/bussiness-hour-add-time-off.html',
})
export class DialogAddNewTimeOffBussiness {

constructor(
  public dialogRef: MatDialogRef<DialogAddNewTimeOffBussiness>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}


}
