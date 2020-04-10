import { Component, OnInit,Inject } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AdminSettingsService } from '../_services/admin-settings.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DatePipe} from '@angular/common';
import { MatSnackBar} from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-bookingrules',
  templateUrl: './bookingrules.component.html',
  styleUrls: ['./bookingrules.component.scss'],
  providers: [DatePipe]
})
export class BookingrulesComponent implements OnInit {
  adminSettings : boolean = true;
  businessId:any;
  settingsArr:any=[];
  Months:any;
  Days:any;
  Hours:any;
  Minutes:any;
  minAdvBookingTimeDays:any;
  minAdvBookingTimeHours:any;
  minAdvBookingTimeMinutes:any;
  maxAdvBookingTimeMonths:any;
  maxAdvBookingTimeDays:any;
  maxAdvBookingTimeHours:any;
  maxAdvBookingTimeMinutes:any;
  timeIntervalHours:any;
  timeIntervalMinutes:any;
  cancellationBufferTimeDays:any;
  cancellationBufferTimeHours:any;
  cancellationBufferTimeMinutes:any;
  minResedulingTimeDays:any;
  minResedulingTimeHours:any;
  minResedulingTimeMinutes:any;
  customerLoginValue:any;
  staffListOnFrontValue:any;
  appAutoConfirmValue:any;
  autoAssignStaffValue:any;
  customerAllowStaffRatingValue:any;
  termsConditionsStatusValue:any;
  termsConditionsLabelValue:any;
  termsConditionsPageLinkValue:any;
  privacyPolicyStatusValue:any;
  privacyPolicyLabelValue:any;
  privacyPolicyPageLinkValue:any;
  thankyouPageStatusValue:any;
  thankyouPageLinkValue:any;

  constructor(
    private appComponent : AppComponent,
    public dialog: MatDialog, 
    public adminSettingsService: AdminSettingsService,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar
    ) {
    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
    }
    this.fnGetSettingValue();
    this.minAdvBookingTimeDays="0";
    this.minAdvBookingTimeHours="0";
    this.minAdvBookingTimeMinutes="0";
    this.maxAdvBookingTimeMonths="0";
    this.maxAdvBookingTimeDays="0";
    this.maxAdvBookingTimeHours="0";
    this.maxAdvBookingTimeMinutes="0";
    this.timeIntervalHours="0";
    this.timeIntervalMinutes="0";
    this.cancellationBufferTimeDays="0";
    this.cancellationBufferTimeHours="0";
    this.cancellationBufferTimeMinutes="0";
    this.minResedulingTimeDays="0";
    this.minResedulingTimeHours="0";
    this.minResedulingTimeMinutes="0";
    this.customerLoginValue="false";
    this.staffListOnFrontValue="false";
    this.appAutoConfirmValue="false";
    this.autoAssignStaffValue="false";
    this.customerAllowStaffRatingValue="false";
    this.termsConditionsStatusValue="false";
    this.termsConditionsLabelValue="";
    this.termsConditionsPageLinkValue="";
    this.privacyPolicyStatusValue="false";
    this.privacyPolicyLabelValue="";
    this.privacyPolicyPageLinkValue="";
    this.thankyouPageStatusValue="false";
    this.thankyouPageLinkValue="";
  }

  ngOnInit() {
  }
  
  fnConvertMins(minutes){
    let min_advance_booking_time=minutes;
    let months = (min_advance_booking_time/(30*24*60)).toString();
    this.Months=(parseInt(months)).toString();
    let RAM = min_advance_booking_time%(30*24*60);
    let days = (RAM/(24*60)).toString();
    this.Days=(parseInt(days)).toString();
    let RAD = RAM%(24*60);
    let hours= (RAD/60).toString();
    this.Hours=(parseInt(hours)).toString();
    let RAH = (RAD%(60)).toString();
    this.Minutes=(parseInt(RAH)).toString();
  }

  fnGetSettingValue(){
    let requestObject={
      "business_id":this.businessId
    }
    console.log(JSON.stringify(requestObject));

    this.adminSettingsService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr=response.response;
        console.log(JSON.parse(this.settingsArr.appearance));
        this.fnConvertMins(this.settingsArr.min_advance_booking_time);
        this.minAdvBookingTimeDays=this.Days;
        this.minAdvBookingTimeHours=this.Hours;
        this.minAdvBookingTimeMinutes=this.Minutes;
        this.fnConvertMins(this.settingsArr.max_advance_booking_time);
        this.maxAdvBookingTimeMonths=this.Months;
        this.maxAdvBookingTimeDays=this.Days;
        this.maxAdvBookingTimeHours=this.Hours;
        this.maxAdvBookingTimeMinutes=this.Minutes;
        this.fnConvertMins(this.settingsArr.time_interval_slots);
        this.timeIntervalHours=this.Hours;
        this.timeIntervalMinutes=this.Minutes;
        this.fnConvertMins(this.settingsArr.cancellation_buffer_time);
        this.cancellationBufferTimeDays=this.Days;
        this.cancellationBufferTimeHours=this.Hours;
        this.cancellationBufferTimeMinutes=this.Minutes;
        this.fnConvertMins(this.settingsArr.min_reseduling_time);
        this.minResedulingTimeDays=this.Days;
        this.minResedulingTimeHours=this.Hours;
        this.minResedulingTimeMinutes=this.Minutes;

       // // if(this.settingsArr.min_advance_booking_time >= 1440){
       //    let min_advance_booking_time=this.settingsArr.min_advance_booking_time;
       //    let days = min_advance_booking_time/(24*60);
       //    // if(days >= 1){
       //      this.minAdvBookingTimeDays=(parseInt(days)).toString();
       //      alert(this.minAdvBookingTimeDays);
       //      let RAD = min_advance_booking_time%(24*60);
       //      alert(RAD);
       //      // if(RAD >= 60){
       //        let hours= RAD/60;
       //        // if(hours >= 1){
       //          this.minAdvBookingTimeHours=(parseInt(hours)).toString();
       //          alert(this.minAdvBookingTimeHours);
       //          let RAH = RAD%(60);
       //          alert(RAH);
       //          this.minAdvBookingTimeMinutes=(parseInt(RAH)).toString();
       //          alert(this.minAdvBookingTimeMinutes);
       //        // }
       //      // }
       //    // }
       //  // }else{
       //  //   let min_advance_booking_time=this.settingsArr.min_advance_booking_time;
       //  //   let RAD = min_advance_booking_time%(24*60);
       //  //   alert(RAD);
       //  // }

        this.customerLoginValue=this.settingsArr.customer_login;
        this.staffListOnFrontValue=JSON.parse(this.settingsArr.staff_list_on_front).status;
        console.log(JSON.parse(this.settingsArr.staff_list_on_front).status);
        this.appAutoConfirmValue=JSON.parse(this.settingsArr.auto_confirm_setting).appointment_auto_confirm;
        this.autoAssignStaffValue=JSON.parse(this.settingsArr.auto_confirm_setting).auto_assign_to_staff;
        this.customerAllowStaffRatingValue=this.settingsArr.customer_allow_for_staff_rating;
        this.termsConditionsStatusValue=JSON.parse(this.settingsArr.terms_condition).status;
        this.termsConditionsLabelValue=JSON.parse(this.settingsArr.terms_condition).label;
        this.termsConditionsPageLinkValue=JSON.parse(this.settingsArr.terms_condition).page_link;
        this.privacyPolicyStatusValue=JSON.parse(this.settingsArr.privacy_policy).status;
        this.privacyPolicyLabelValue=JSON.parse(this.settingsArr.privacy_policy).label;
        this.privacyPolicyPageLinkValue=JSON.parse(this.settingsArr.privacy_policy).page_link;
        this.thankyouPageStatusValue=JSON.parse(this.settingsArr.thank_you).status;
        this.thankyouPageLinkValue=JSON.parse(this.settingsArr.thank_you).page_link;
      }
      else{
       
      }
    })
  }

  fnSetMinAdvBookingTime(event){
    console.log(this.minAdvBookingTimeDays);
    console.log(this.minAdvBookingTimeHours);
    console.log(this.minAdvBookingTimeMinutes);
    let min_adv_booking_time_days=0;
    let min_adv_booking_time_hours=0;
    let min_adv_booking_time_minutes=0;
    if(this.minAdvBookingTimeDays !=undefined){
     min_adv_booking_time_days =  parseInt(this.minAdvBookingTimeDays)*24*60;
    }
    if(this.minAdvBookingTimeHours !=undefined){
     min_adv_booking_time_hours =  parseInt(this.minAdvBookingTimeHours)*60;
    }
    if(this.minAdvBookingTimeMinutes !=undefined){
     min_adv_booking_time_minutes =  parseInt(this.minAdvBookingTimeMinutes);
    }
    let total_time=min_adv_booking_time_days+min_adv_booking_time_hours+min_adv_booking_time_minutes;
    console.log(min_adv_booking_time_days);
    console.log(min_adv_booking_time_hours);
    console.log(min_adv_booking_time_minutes);
    console.log(total_time);

    let requestObject={
      "business_id":this.businessId,
      "booking_time":total_time
    }
    console.log(JSON.stringify(requestObject));

    this.adminSettingsService.setMinAdvBookingTime(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Minimum Advance Booking Time Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Minimum Advance Booking Time Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  
  fnSetMaxAdvBookingTime(event){
    console.log(this.maxAdvBookingTimeMonths);
    console.log(this.maxAdvBookingTimeDays);
    console.log(this.maxAdvBookingTimeHours);
    console.log(this.maxAdvBookingTimeMinutes);
    let max_adv_booking_time_months=0;
    let max_adv_booking_time_days=0;
    let max_adv_booking_time_hours=0;
    let max_adv_booking_time_minutes=0;
    if(this.maxAdvBookingTimeMonths !=undefined){
     max_adv_booking_time_months =  parseInt(this.maxAdvBookingTimeMonths)*30*24*60;
    }
    if(this.maxAdvBookingTimeDays !=undefined){
     max_adv_booking_time_days =  parseInt(this.maxAdvBookingTimeDays)*24*60;
    }
    if(this.maxAdvBookingTimeHours !=undefined){
     max_adv_booking_time_hours =  parseInt(this.maxAdvBookingTimeHours)*60;
    }
    if(this.maxAdvBookingTimeMinutes !=undefined){
     max_adv_booking_time_minutes =  parseInt(this.maxAdvBookingTimeMinutes);
    }
    let total_time=max_adv_booking_time_months+max_adv_booking_time_days+max_adv_booking_time_hours+max_adv_booking_time_minutes;
    console.log(max_adv_booking_time_months);
    console.log(max_adv_booking_time_days);
    console.log(max_adv_booking_time_hours);
    console.log(max_adv_booking_time_minutes);
    console.log(total_time);

    let requestObject={
      "business_id":this.businessId,
      "booking_time":total_time
    }
    console.log(JSON.stringify(requestObject));
    
    this.adminSettingsService.setMaxAdvBookingTime(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Maximum Advance Booking Time Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Maximum Advance Booking Time Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  
  fnSetTimeInterval(event){
    console.log(this.timeIntervalHours);
    console.log(this.timeIntervalMinutes);

    let time_interval_hours=0;
    let time_interval_minutes=0;

    if(this.timeIntervalHours !=undefined){
     time_interval_hours =  parseInt(this.timeIntervalHours)*60;
    }
    if(this.timeIntervalMinutes !=undefined){
     time_interval_minutes =  parseInt(this.timeIntervalMinutes);
    }
    let total_time=time_interval_hours+time_interval_minutes;
    console.log(time_interval_hours);
    console.log(time_interval_minutes);
    console.log(total_time);

    let requestObject={
      "business_id":this.businessId,
      "time_interval_slots":total_time
    }
    console.log(JSON.stringify(requestObject));
    this.adminSettingsService.setTimeInterval(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Time Interval Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Time Interval Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  
  fnSetCancellationBufferTime(event){
    console.log(this.cancellationBufferTimeDays);
    console.log(this.cancellationBufferTimeHours);
    console.log(this.cancellationBufferTimeMinutes);

    let cancellation_buffer_time_days=0;
    let cancellation_buffer_time_hours=0;
    let cancellation_buffer_time_minutes=0;

    if(this.cancellationBufferTimeDays !=undefined){
     cancellation_buffer_time_days =  parseInt(this.cancellationBufferTimeDays)*24*60;
    }
    if(this.cancellationBufferTimeHours !=undefined){
     cancellation_buffer_time_hours =  parseInt(this.cancellationBufferTimeHours)*60;
    }
    if(this.cancellationBufferTimeMinutes !=undefined){
     cancellation_buffer_time_minutes =  parseInt(this.cancellationBufferTimeMinutes);
    }
    let total_time=cancellation_buffer_time_days+cancellation_buffer_time_hours+cancellation_buffer_time_minutes;
    console.log(cancellation_buffer_time_days);
    console.log(cancellation_buffer_time_hours);
    console.log(cancellation_buffer_time_minutes);

    let requestObject={
      "business_id":this.businessId,
      "cancel_buffer_time":total_time
    }
    console.log(JSON.stringify(requestObject));
    this.adminSettingsService.setCancellationBufferTime(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Cancellation Buffer Time Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Cancellation Buffer Time Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  
  fnSetMinResedulingTime(event){
    console.log(this.minResedulingTimeDays);
    console.log(this.minResedulingTimeHours);
    console.log(this.minResedulingTimeMinutes);

    let min_reseduling_time_days=0;
    let min_reseduling_time_hours=0;
    let min_reseduling_time_minutes=0;

    if(this.minResedulingTimeDays !=undefined){
     min_reseduling_time_days =  parseInt(this.minResedulingTimeDays)*24*60;
    }
    if(this.minResedulingTimeHours !=undefined){
     min_reseduling_time_hours =  parseInt(this.minResedulingTimeHours)*60;
    }
    if(this.minResedulingTimeMinutes !=undefined){
     min_reseduling_time_minutes =  parseInt(this.minResedulingTimeMinutes);
    }
    let total_time=min_reseduling_time_days+min_reseduling_time_hours+min_reseduling_time_minutes;
    console.log(min_reseduling_time_days);
    console.log(min_reseduling_time_hours);
    console.log(min_reseduling_time_minutes);

    let requestObject={
      "business_id":this.businessId,
      "min_reseduling_time":total_time
    }
    console.log(JSON.stringify(requestObject));
    this.adminSettingsService.setMinResedulingTime(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Minimum Reseduling Time Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Minimum Reseduling Time Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  
  fnChangeCustomerLoginStatus(event){
    console.log(event.checked);
    console.log(this.customerLoginValue);

    let requestObject={
      "business_id":this.businessId,
      "customer_login":JSON.stringify(event.checked)
    }
    console.log(JSON.stringify(requestObject));
    this.adminSettingsService.changeCustomerLoginStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Customer Login Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Customer Login Status Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  
  fnChangeStaffOnFrontStatus(event){
    console.log(event.checked);
    console.log(this.staffListOnFrontValue);

    let requestObject={
      "business_id":this.businessId,
      "staff_list_on_front":{
        "status" : JSON.stringify(event.checked)
      }
    }
    console.log(JSON.stringify(requestObject));
    this.adminSettingsService.changeStaffOnFrontStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Staff On Front Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Staff On Front Status Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  
  fnChangeAutoAssignStaffStatus(event){
    if(event.checked){
      this.autoAssignStaffValue="true";
    }else{
      this.autoAssignStaffValue="false";
    }
    console.log(this.autoAssignStaffValue);
    this.fnUpdateAppAutoConfirmSettings();
  }

  fnChangeAppAutoConfirmStatus(event){
    if(event.checked){
      this.appAutoConfirmValue="true";
    }else{
      this.appAutoConfirmValue="false";
    }
    console.log(this.appAutoConfirmValue);
    this.fnUpdateAppAutoConfirmSettings();
  }

  fnUpdateAppAutoConfirmSettings(){
    let autoConfirmArr={
      "appointment_auto_confirm":this.appAutoConfirmValue,
      "auto_assign_to_staff":this.autoAssignStaffValue
    }
    let tempArr:any=[];
    tempArr.push(autoConfirmArr);
    let requestObject={
      "business_id":this.businessId,
      "auto_confirm_setting":autoConfirmArr
    }
    console.log(JSON.stringify(requestObject));
    this.adminSettingsService.updateAppAutoConfirmSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Auto ConfirmSettings Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Auto ConfirmSettings Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  
  fnChangeCustomerAllowStaffRatingStatus(event){
    console.log(event.checked);
    console.log(this.customerAllowStaffRatingValue);

    let requestObject={
      "business_id":this.businessId,
      "customer_allow_for_staff_rating":JSON.stringify(event.checked)
    }
    console.log(JSON.stringify(requestObject));
    this.adminSettingsService.changeCustomerAllowStaffRatingStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Customer Staff Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Customer Staff Status Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  public setTermConditionsLabelValue(input) {
    this.termsConditionsLabelValue = input;
  }

  public setTermConditionsPageLinkValue(input) {
    this.termsConditionsPageLinkValue = input;
  }
  
  fnChangeTermsConditionsStatus(event){
    console.log(event.checked);
    this.termsConditionsStatusValue=JSON.stringify(event.checked);
    console.log(this.termsConditionsStatusValue);

    let termsConditionsArr={
      "status":JSON.stringify(event.checked),
      "label":this.termsConditionsLabelValue,
      "page_link":this.termsConditionsPageLinkValue
    }
    let requestObject={
      "business_id":this.businessId,
      "terms_condition":termsConditionsArr
    }
    console.log(JSON.stringify(requestObject));
    this.fnUpdateTermsConditionsStatusValues(requestObject);
  }

  fnSaveTermsConditionsValues(){

    let termsConditionsArr={
      "status":this.termsConditionsStatusValue,
      "label":this.termsConditionsLabelValue,
      "page_link":this.termsConditionsPageLinkValue
    }
    let requestObject={
      "business_id":this.businessId,
      "terms_condition":termsConditionsArr
    }
    console.log(JSON.stringify(requestObject));
    this.fnUpdateTermsConditionsStatusValues(requestObject);
  }

  fnUpdateTermsConditionsStatusValues(requestObject){
    this.adminSettingsService.updateTermsConditionsStatusValues(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Terms Conditions Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Terms Conditions Status Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  public setPrivacyPolicyLabelValue(input) {
    this.privacyPolicyLabelValue = input;
  }

  public setPrivacyPolicyPageLinkValue(input) {
    this.privacyPolicyPageLinkValue = input;
  }
  
  fnChangePrivacyPolicyStatus(event){
    console.log(event.checked);
    this.privacyPolicyStatusValue=JSON.stringify(event.checked);
    console.log(this.privacyPolicyStatusValue);

    let privacyPolicyArr={
      "status":JSON.stringify(event.checked),
      "label":this.privacyPolicyLabelValue,
      "page_link":this.privacyPolicyPageLinkValue
    }
    let requestObject={
      "business_id":this.businessId,
      "privacy_policy":privacyPolicyArr
    }
    console.log(JSON.stringify(requestObject));
    this.fnUpdatePrivacyPolicyStatusValues(requestObject);
  }

  fnSavePrivacyPolicyValues(){

    let privacyPolicyArr={
      "status":this.privacyPolicyStatusValue,
      "label":this.privacyPolicyLabelValue,
      "page_link":this.privacyPolicyPageLinkValue
    }
    let requestObject={
      "business_id":this.businessId,
      "privacy_policy":privacyPolicyArr
    }
    console.log(JSON.stringify(requestObject));
    this.fnUpdatePrivacyPolicyStatusValues(requestObject);
  }

  fnUpdatePrivacyPolicyStatusValues(requestObject){
    this.adminSettingsService.updatePrivacyPolicyStatusValues(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Privacy Policy Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Privacy Policy Status Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  public setThankyouPageLinkValue(input) {
    this.thankyouPageLinkValue = input;
  }
  
  fnChangeThankyouPageStatus(event){
    console.log(event.checked);
    this.thankyouPageStatusValue=JSON.stringify(event.checked);
    console.log(this.thankyouPageStatusValue);

    let thankyouPageArr={
      "status":JSON.stringify(event.checked),
      "page_link":this.thankyouPageLinkValue
    }
    let requestObject={
      "business_id":this.businessId,
      "thank_you":thankyouPageArr
    }
    console.log(JSON.stringify(requestObject));
    this.fnUpdateThankyouPageStatusValues(requestObject);
  }

  fnSaveThankyouPageValues(){

    let thankyouPageArr={
      "status":this.thankyouPageStatusValue,
      "page_link":this.thankyouPageLinkValue
    }
    let requestObject={
      "business_id":this.businessId,
      "thank_you":thankyouPageArr
    }
    console.log(JSON.stringify(requestObject));
    this.fnUpdateThankyouPageStatusValues(requestObject);
  }

  fnUpdateThankyouPageStatusValues(requestObject){
    this.adminSettingsService.updateThankyouPageStatusValues(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Thankyou Page Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this.snackBar.open("Thankyou Page Status Not Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
}
