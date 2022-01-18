import { Component, OnInit,Inject } from '@angular/core';
import { AdminSettingsService } from '../../_services/admin-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe} from '@angular/common';
import { MatSnackBar} from '@angular/material/snack-bar';

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
  owAndgtNotification:any;
  customerAllowStaffRatingValue:any;
  termsConditionsStatusValue:boolean;
  termsConditionsLabelValue:any;
  termsConditionsPageLinkValue:any;
  privacyPolicyStatusValue:boolean;
  privacyPolicyLabelValue:any;
  privacyPolicyPageLinkValue:any;
  thankyouPageStatusValue:boolean = false;
  thankyouPageLinkValue:any;
  settingSideMenuToggle : boolean = false;
websiteUrlFormate = '/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/'
  constructor(
    public dialog: MatDialog, 
    @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
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
    this.owAndgtNotification="false";
    this.customerAllowStaffRatingValue="false";
    this.termsConditionsStatusValue=false;
    this.termsConditionsLabelValue="";
    this.termsConditionsPageLinkValue="";
    this.privacyPolicyStatusValue=false;
    this.privacyPolicyLabelValue="";
    this.privacyPolicyPageLinkValue="";
    this.thankyouPageStatusValue=false;
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
        if(this.settingsArr.min_advance_booking_time){
          this.fnConvertMins(this.settingsArr.min_advance_booking_time);
          this.minAdvBookingTimeDays=this.Days;
          this.minAdvBookingTimeHours=this.Hours;
          this.minAdvBookingTimeMinutes=this.Minutes;
        }
        if(this.settingsArr.max_advance_booking_time){
          this.fnConvertMins(this.settingsArr.max_advance_booking_time);
          this.maxAdvBookingTimeMonths=this.Months;
          this.maxAdvBookingTimeDays=this.Days;
          this.maxAdvBookingTimeHours=this.Hours;
          this.maxAdvBookingTimeMinutes=this.Minutes;
        }
        if(this.settingsArr.time_interval_slots){
          this.fnConvertMins(this.settingsArr.time_interval_slots);
          this.timeIntervalHours=this.Hours;
          this.timeIntervalMinutes=this.Minutes;
        }
        if(this.settingsArr.cancellation_buffer_time){
          this.fnConvertMins(this.settingsArr.cancellation_buffer_time);
          this.cancellationBufferTimeDays=this.Days;
          this.cancellationBufferTimeHours=this.Hours;
          this.cancellationBufferTimeMinutes=this.Minutes;
        }
        if(this.settingsArr.min_reseduling_time){
          this.fnConvertMins(this.settingsArr.min_reseduling_time);
          this.minResedulingTimeDays=this.Days;
          this.minResedulingTimeHours=this.Hours;
          this.minResedulingTimeMinutes=this.Minutes;
        }
        

        if(this.settingsArr.customer_login){
          this.customerLoginValue=this.settingsArr.customer_login;
        }
        if(this.settingsArr.staff_list_on_front){
          this.staffListOnFrontValue=JSON.parse(this.settingsArr.staff_list_on_front).status;
        }
        if(this.settingsArr.auto_confirm_setting){
          this.appAutoConfirmValue=JSON.parse(this.settingsArr.auto_confirm_setting).appointment_auto_confirm;
          this.autoAssignStaffValue=JSON.parse(this.settingsArr.auto_confirm_setting).auto_assign_to_staff;
        }
        if(this.settingsArr.customer_allow_for_staff_rating){
          this.customerAllowStaffRatingValue=this.settingsArr.customer_allow_for_staff_rating;
        }
        if(this.settingsArr.OW_and_GT_notification){
          this.owAndgtNotification=this.settingsArr.OW_and_GT_notification;
        }
        if(this.settingsArr.terms_condition){
          this.termsConditionsStatusValue=JSON.parse(this.settingsArr.terms_condition).status;
          this.termsConditionsLabelValue=JSON.parse(this.settingsArr.terms_condition).label;
          this.termsConditionsPageLinkValue=JSON.parse(this.settingsArr.terms_condition).page_link;
        }
        if(this.settingsArr.privacy_policy){
          this.privacyPolicyStatusValue=JSON.parse(this.settingsArr.privacy_policy).status;
          this.privacyPolicyLabelValue=JSON.parse(this.settingsArr.privacy_policy).label;
          this.privacyPolicyPageLinkValue=JSON.parse(this.settingsArr.privacy_policy).page_link;
        }
        if(this.settingsArr.thank_you){
          this.thankyouPageStatusValue=JSON.parse(this.settingsArr.thank_you).status;
          this.thankyouPageLinkValue=JSON.parse(this.settingsArr.thank_you).page_link;
        }
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       
        this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  fnSettingMenuToggleSmall(){
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge(){
    this.settingSideMenuToggle = false;
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
        this.snackBar.open("Minimum Advance Booking Time Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
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
        this.snackBar.open("Maximum Advance Booking Time Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
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
        this.snackBar.open("Time Interval Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
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
        this.snackBar.open("Cancellation Buffer Time Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
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
        this.snackBar.open("Minimum Reseduling Time Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
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
        this.snackBar.open("Customer Login Status Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
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
        this.snackBar.open("Staff On Front Status Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open("Staff On Front Status Not Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
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
      "auto_assign_to_staff":this.autoAssignStaffValue,
      "owAndGtNotification" : this.owAndgtNotification
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
        this.snackBar.open("Auto ConfirmSettings Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open("Auto ConfirmSettings Not Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
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
        this.snackBar.open("Customer Staff Status Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open("Customer Staff Status Not Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnChangeOwAndgtNotificationStatus(event){
    let requestObject={
      "business_id":this.businessId,
      "OW_and_GT_notification":JSON.stringify(event.checked)
    }
    console.log(JSON.stringify(requestObject));
    this.adminSettingsService.changeOwAndgtNotificationStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Customer On the way and Getting Late notication status Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open("Customer On the way and Getting Late notication status Not Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
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
    this.termsConditionsStatusValue=event.checked;

    let termsConditionsArr={
      "status":event.checked,
      "label":this.termsConditionsLabelValue,
      "page_link":this.termsConditionsPageLinkValue
    }
    let requestObject={
      "business_id":this.businessId,
      "terms_condition":termsConditionsArr
    }
    if(this.termsConditionsLabelValue && this.termsConditionsStatusValue && this.termsConditionsPageLinkValue.match(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)){
      this.fnUpdateTermsConditionsStatusValues(requestObject);
    }else if(!this.termsConditionsStatusValue){
      this.fnUpdateTermsConditionsStatusValues(requestObject);
    }else{
      this.snackBar.open("Please enter valid link.", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      return false
    }
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
    if(this.termsConditionsLabelValue && this.termsConditionsPageLinkValue.match(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)){
      this.fnUpdateTermsConditionsStatusValues(requestObject);
    }else{
      this.snackBar.open("Please enter valid link and lable.", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      return false
    }
  }

  fnUpdateTermsConditionsStatusValues(requestObject){
    this.adminSettingsService.updateTermsConditionsStatusValues(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Terms Conditions Status Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open("Terms Conditions Status Not Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
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
    this.privacyPolicyStatusValue=event.checked;

    let privacyPolicyArr={
      "status":event.checked,
      "label":this.privacyPolicyLabelValue,
      "page_link":this.privacyPolicyPageLinkValue
    }
    let requestObject={
      "business_id":this.businessId,
      "privacy_policy":privacyPolicyArr
    }
    if(this.privacyPolicyLabelValue && this.privacyPolicyStatusValue && this.privacyPolicyPageLinkValue.match(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)){
      this.fnUpdatePrivacyPolicyStatusValues(requestObject);
    }else if(!this.privacyPolicyStatusValue){
      this.fnUpdatePrivacyPolicyStatusValues(requestObject);
    }else{
      this.snackBar.open("Please enter valid link.", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      return false
    }
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
    if(this.privacyPolicyLabelValue && this.privacyPolicyPageLinkValue.match(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)){
      this.fnUpdatePrivacyPolicyStatusValues(requestObject);
    }else{
      this.snackBar.open("Please enter valid link and lable.", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      return false
    }
  }

  fnUpdatePrivacyPolicyStatusValues(requestObject){
    console.log(requestObject)
    // if(requestObject.privacy_policy.status == true && requestObject.privacy_policy.label === ''){
    //   this.snackBar.open("Label is required.", "X", {
    //     duration: 2000,
    //     verticalPosition: 'top',
    //     panelClass : ['red-snackbar']
    //   });
    //   return false
    // }else if(requestObject.privacy_policy.status == true && requestObject.privacy_policy.page_link === ''){
    //   this.snackBar.open("Page link is required.", "X", {
    //     duration: 2000,
    //     verticalPosition: 'top',
    //     panelClass : ['red-snackbar']
    //   });
    //   return false
    // }
    this.adminSettingsService.updatePrivacyPolicyStatusValues(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Privacy Policy Status Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  public setThankyouPageLinkValue(input) {
    this.thankyouPageLinkValue = input;
  }
  
  fnChangeThankyouPageStatus(event){
    this.thankyouPageStatusValue=event.checked;

    let thankyouPageArr={
      "status":event.checked,
      "page_link":this.thankyouPageLinkValue
    }
    let requestObject={
      "business_id":this.businessId,
      "thank_you":thankyouPageArr
    }
    if(this.thankyouPageStatusValue && this.thankyouPageLinkValue.match(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)){
      this.fnUpdateThankyouPageStatusValues(requestObject);
    }else if(!this.thankyouPageStatusValue){
      this.fnUpdateThankyouPageStatusValues(requestObject);
    }else{
      this.snackBar.open("Please enter valid link.", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      return false
    }
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
    if(this.thankyouPageStatusValue && this.thankyouPageLinkValue.match(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)){
      this.fnUpdateThankyouPageStatusValues(requestObject);
    }else{
      this.snackBar.open("Please enter valid link.", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      return false
    }
  }

  fnUpdateThankyouPageStatusValues(requestObject){
    
    this.adminSettingsService.updateThankyouPageStatusValues(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Thankyou Page Status Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
}
