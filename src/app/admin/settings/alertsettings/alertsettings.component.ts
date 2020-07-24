import { Component, OnInit, Inject, Pipe, PipeTransform  } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer} from "@angular/platform-browser";


export interface DialogData {
  animal: string;
  name: string;
  
}
@Pipe({
  name: 'safeHtml',
})

@Component({
  selector: 'app-alertsettings',
  templateUrl: './alertsettings.component.html',
  styleUrls: ['./alertsettings.component.scss']
})
export class AlertsettingsComponent implements OnInit {

  businessId : any;
  emailCustomerAppointment = {
    booked:{
      status:0,
    },
    status_updated:{
      status:0,
    },
    cancelled:{
      status:0
    },
  };
  emailStaffAppointment = {
    booked:{
      status:0,
    },
    status_updated:{
      status:0,
    },
    cancelled:{
      status:0
    },
  };
  emailAdminAppointment = {
    booked:{
      status:0,
    },
    status_updated:{
      status:0,
    },
    cancelled:{
      status:0
    },
  };
  smsAppointment = {
    booked:{
      status:0,
    },
    status_updated:{
      status:0,
    },
    cancelled:{
      status:0
    },
  };
  smsAlertWho = {
    admin:{
      status:0,
    },
    staff:{
      status:0,
    },
    customer:{
      status:0
    },
  };
  emailAlertCustomer : any;
  emailAlertCustomerDays: any;
  emailAlertCustomerHours: any;
  emailAlertCustomerMinutes: any;
  emailAlertStaff: any;
  emailAlertStaffDays: any;
  emailAlertStaffHours: any;
  emailAlertStaffMinutes: any;
  emailAlertAdmin: any;
  emailAlertAdminDays: any;
  emailAlertAdminHours: any;
  emailAlertAdminMinutes: any;
  smsAlertDays: any;
  smsAlertHours: any;
  smsAlertMinutes: any;
  Months:any;
  Days:any;
  Hours:any;
  Minutes:any;
  adminSettings : boolean = true;
  isLoaderAdmin : boolean = false;
  appointmentsReminder : boolean = false;
  appointmentsReminderStaff :boolean = false;
  appointmentsReminderAdmin :boolean = false;
  appointmentsReminderSMS : boolean = false;
  twilliStatus : boolean = false;
  textLocalStatus : boolean = false;
  settingSideMenuToggle : boolean = false;
  totalTimeCustomerEmail:any;
  totalTimeStaffEmail: any;
  totalTimeAdminEmail: any;
  totalTimeSms: any;
  customerEmailTemData: any;
  adminEmailTemData: any;
  staffEmailTemData: any;
  cusSmsTemData: any;
  adminSmsTemData: any;
  staffSmsTemData: any;
  customizeEmailAlertData: any;
  adminEmailForAlert: FormGroup;
  customizeAlert: FormGroup;
  cusEmailTemplate1: FormGroup;
  cusEmailTemplate2: FormGroup;
  cusEmailTemplate3: FormGroup;
  cusEmailTemplate4: FormGroup;
  cusEmailTemplate5: FormGroup;
  cusEmailTemplate6: FormGroup;
  cusEmailTemplate7: FormGroup;
  adminEmailTemplate1: FormGroup;
  adminEmailTemplate2: FormGroup;
  adminEmailTemplate3: FormGroup;
  adminEmailTemplate4: FormGroup;
  adminEmailTemplate5: FormGroup;
  adminEmailTemplate6: FormGroup;
  adminEmailTemplate7: FormGroup;
  staffEmailTemplate1: FormGroup;
  staffEmailTemplate2: FormGroup;
  staffEmailTemplate3: FormGroup;
  staffEmailTemplate4: FormGroup;
  staffEmailTemplate5: FormGroup;
  staffEmailTemplate6: FormGroup;
  staffEmailTemplate7: FormGroup;

  cusSmsTemplate1: FormGroup;
  cusSmsTemplate2: FormGroup;
  cusSmsTemplate3: FormGroup;
  cusSmsTemplate4: FormGroup;
  cusSmsTemplate5: FormGroup;
  cusSmsTemplate6: FormGroup;
  cusSmsTemplate7: FormGroup;
  adminSmsTemplate1: FormGroup;
  adminSmsTemplate2: FormGroup;
  adminSmsTemplate3: FormGroup;
  adminSmsTemplate4: FormGroup;
  adminSmsTemplate5: FormGroup;
  adminSmsTemplate6: FormGroup;
  adminSmsTemplate7: FormGroup;
  staffSmsTemplate1: FormGroup;
  staffSmsTemplate2: FormGroup;
  staffSmsTemplate3: FormGroup;
  staffSmsTemplate4: FormGroup;
  staffSmsTemplate5: FormGroup;
  staffSmsTemplate6: FormGroup;
  staffSmsTemplate7: FormGroup;  
  twilio: FormGroup;  
  textLocal: FormGroup;  

  admintomerEmailTemp1: any;
  smsAlertsSetting: any;
  emailTempStatus: any;
  smsTempStatus: any;
  maxCharacters = 500; 
  characters = this.maxCharacters;
  cusEmailTempl : any;
  twilioSettingValue : any;
  textLocalSettingValue : any
  cusEmailTemplateStatus1: boolean = false;
  cusEmailTemplateStatus2: boolean = false;
  cusEmailTemplateStatus3: boolean = false;
  cusEmailTemplateStatus4: boolean = false;
  cusEmailTemplateStatus5: boolean = false;
  cusEmailTemplateStatus6: boolean = false;
  cusEmailTemplateStatus7: boolean = false;
  adminEmailTemplateStatus1: boolean = false;
  adminEmailTemplateStatus2: boolean = false;
  adminEmailTemplateStatus3: boolean = false;
  adminEmailTemplateStatus4: boolean = false;
  adminEmailTemplateStatus5: boolean = false;
  adminEmailTemplateStatus6: boolean = false;
  adminEmailTemplateStatus7: boolean = false;
  staffEmailTemplateStatus1: boolean = false;
  staffEmailTemplateStatus2: boolean = false;
  staffEmailTemplateStatus3: boolean = false;
  staffEmailTemplateStatus4: boolean = false;
  staffEmailTemplateStatus5: boolean = false;
  staffEmailTemplateStatus6: boolean = false;
  staffEmailTemplateStatus7: boolean = false;

  cusSmsTemplateStatus1: boolean = false;
  cusSmsTemplateStatus2: boolean = false;
  cusSmsTemplateStatus3: boolean = false;
  cusSmsTemplateStatus4: boolean = false;
  cusSmsTemplateStatus5: boolean = false;
  cusSmsTemplateStatus6: boolean = false;
  cusSmsTemplateStatus7: boolean = false;
  adminSmsTemplateStatus1: boolean = false;
  adminSmsTemplateStatus2: boolean = false;
  adminSmsTemplateStatus3: boolean = false;
  adminSmsTemplateStatus4: boolean = false;
  adminSmsTemplateStatus5: boolean = false;
  adminSmsTemplateStatus6: boolean = false;
  adminSmsTemplateStatus7: boolean = false;
  staffSmsTemplateStatus1: boolean = false;
  staffSmsTemplateStatus2: boolean = false;
  staffSmsTemplateStatus3: boolean = false;
  staffSmsTemplateStatus4: boolean = false;
  staffSmsTemplateStatus5: boolean = false;
  staffSmsTemplateStatus6: boolean = false;
  staffSmsTemplateStatus7: boolean = false;  

  constructor(
    private appComponent : AppComponent,
    public adminSettingsService : AdminSettingsService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    ) {
      if(localStorage.getItem('business_id')){
        this.businessId = localStorage.getItem('business_id');
      }
      this.emailAlertCustomerDays = "0";
      this.emailAlertCustomerHours= "0";
      this.emailAlertCustomerMinutes= "0";
      this.emailAlertStaffDays = "0";
      this.emailAlertStaffHours= "0";
      this.emailAlertStaffMinutes= "0";
      this.emailAlertAdminDays = "0";
      this.emailAlertAdminHours= "0";
      this.emailAlertAdminMinutes= "0";
    }
     

  ngOnInit() {
    this.getSettingsValue();
    this.getCustomerEmailTemplates();
    this.getAdminEmailTemplates();
    this.getStaffEmailTemplates();
    this.getCustomerSmsTemplates();
    this.getAdminSmsTemplates();
    this.getStaffSmsTemplates();
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    this.adminEmailForAlert = this._formBuilder.group({
      alertEmail: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]]
    });

    this.customizeAlert = this._formBuilder.group({
      senderName: ['',[Validators.required]],
      emailSignature: ['',[Validators.required]]
    });

    // Email Templates
    this.cusEmailTemplate1 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.cusEmailTemplate2 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.cusEmailTemplate3 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.cusEmailTemplate4 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.cusEmailTemplate5 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.cusEmailTemplate6 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.cusEmailTemplate7 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });

    this.adminEmailTemplate1 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.adminEmailTemplate2 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.adminEmailTemplate3 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.adminEmailTemplate4 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.adminEmailTemplate5 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.adminEmailTemplate6 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.adminEmailTemplate7 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });

    this.staffEmailTemplate1 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.staffEmailTemplate2 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.staffEmailTemplate3 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.staffEmailTemplate4 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.staffEmailTemplate5 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.staffEmailTemplate6 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.staffEmailTemplate7 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });


    // Sms Forms

    this.cusSmsTemplate1 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.cusSmsTemplate2 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.cusSmsTemplate3 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.cusSmsTemplate4 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.cusSmsTemplate5 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.cusSmsTemplate6 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.cusSmsTemplate7 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });

    this.adminSmsTemplate1 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.adminSmsTemplate2 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.adminSmsTemplate3 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.adminSmsTemplate4 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.adminSmsTemplate5 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.adminSmsTemplate6 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.adminSmsTemplate7 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });

    this.staffSmsTemplate1 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.staffSmsTemplate2 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.staffSmsTemplate3 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.staffSmsTemplate4 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.staffSmsTemplate5 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.staffSmsTemplate6 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });
    this.staffSmsTemplate7 = this._formBuilder.group({
      smsTemplate: ['',[Validators.required]]
    });

    this.twilio = this._formBuilder.group({
      accountSID: ['', [Validators.required]],
      authToken: ['', [Validators.required]],
      twilioSender: ['', [Validators.required]],
      adminNumber: ['', [Validators.required]]
    });
    this.textLocal = this._formBuilder.group({
      apiKey: ['', [Validators.required]],
      adminNumber: ['', [Validators.required]]
    });
 
  } 
  count(value: string){
    this.characters = this.maxCharacters - value.length;
  }
  fnSettingMenuToggleSmall(){
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge(){
    this.settingSideMenuToggle = false;
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

  getSettingsValue(){
  this.adminSettingsService.getSettingsValue().subscribe((response:any) => {
      if(response.data == true){
        if(response.response.email_alert_settings_customer){
          this.emailAlertCustomer = JSON.parse(response.response.email_alert_settings_customer)
          this.fnConvertMins(this.emailAlertCustomer.reminder_lead_time);
          this.emailAlertCustomerDays=this.Days;
          this.emailAlertCustomerHours=this.Hours;
          this.emailAlertCustomerMinutes=this.Minutes;
          this.appointmentsReminder = this.emailAlertCustomer.status;
          this.emailCustomerAppointment =  JSON.parse(this.emailAlertCustomer.appointment);
        }
        if(response.response.email_alert_settings_staff){
          this.emailAlertStaff = JSON.parse(response.response.email_alert_settings_staff)
          this.fnConvertMins(this.emailAlertStaff.reminder_lead_time);
          this.emailAlertStaffDays=this.Days;
          this.emailAlertStaffHours=this.Hours;
          this.emailAlertStaffMinutes=this.Minutes;
          this.appointmentsReminderStaff = this.emailAlertStaff.status;
          this.emailStaffAppointment =  JSON.parse(this.emailAlertStaff.appointment);
        }
        if(response.response.email_alert_settings_admin){
          this.emailAlertAdmin = JSON.parse(response.response.email_alert_settings_admin)
          this.fnConvertMins(this.emailAlertAdmin.reminder_lead_time);
          this.emailAlertAdminDays=this.Days;
          this.emailAlertAdminHours=this.Hours;
          this.emailAlertAdminMinutes=this.Minutes;
          this.appointmentsReminderAdmin = this.emailAlertAdmin.status;
          if(this.emailAlertAdmin.admin_mail){
           this.adminEmailForAlert.controls['alertEmail'].setValue(this.emailAlertAdmin.admin_mail);
          }
          this.emailAdminAppointment =  JSON.parse(this.emailAlertAdmin.appointment);
        }
        if(response.response.customize_email_alert){
          this.customizeEmailAlertData = JSON.parse(response.response.customize_email_alert)
          console.log(this.customizeEmailAlertData);
          if(this.customizeEmailAlertData){
            this.customizeAlert.controls['senderName'].setValue(this.customizeEmailAlertData.sender_name);
            this.customizeAlert.controls['emailSignature'].setValue(this.customizeEmailAlertData.email_signature);
          }
        }
        if(response.response.email_alert_settings_customer){
          this.emailAlertCustomer = JSON.parse(response.response.email_alert_settings_customer)
        }
        if(response.response.sms_sending_settings){
          this.smsAlertsSetting = JSON.parse(response.response.sms_sending_settings)
          console.log(this.smsAlertsSetting);
          this.fnConvertMins(this.smsAlertsSetting.time);
          this.smsAlertDays=this.Days;
          this.smsAlertHours=this.Hours;
          this.smsAlertMinutes=this.Minutes;
          this.appointmentsReminderSMS = this.smsAlertsSetting.reminder_status;
          this.smsAppointment = JSON.parse(this.smsAlertsSetting.when);
          this.smsAlertWho = JSON.parse(this.smsAlertsSetting.who);
        }
         
          if(response.response.twilo_setting){
            this.twilioSettingValue = JSON.parse(response.response.twilo_setting);
            this.twilio.controls['accountSID'].setValue(this.twilioSettingValue.account_sid);
            this.twilio.controls['authToken'].setValue(this.twilioSettingValue.auth_token);
            this.twilio.controls['twilioSender'].setValue(this.twilioSettingValue.twilo_sender_number);
            this.twilio.controls['adminNumber'].setValue(this.twilioSettingValue.admin_phone_number);
          }
          if(response.response.textlocal_setting){
            this.textLocalSettingValue = JSON.parse(response.response.textlocal_setting);
            this.textLocal.controls['apiKey'].setValue(this.textLocalSettingValue.api_key);
            this.textLocal.controls['adminNumber'].setValue(this.textLocalSettingValue.admin_number);
          }

      }
      else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
fnAppointmentsReminder(event){
    if(event == true){
      this.appointmentsReminder = true;
    }else if(event == false){
      this.appointmentsReminder = false;
    }
    let customerAlertSetting = {
      "reminder_lead_time" : this.totalTimeCustomerEmail,
      "appointment" : JSON.stringify(this.emailCustomerAppointment),
      "status":this.appointmentsReminder,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminder,
      "email_alert_settings_customer" : customerAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateCusEmailAlert(requestObject);
    
}

fnAppointmentsReminderStaff(event){
    if(event == true){
      this.appointmentsReminderStaff = true;
    }else if(event == false){
      this.appointmentsReminderStaff = false;
    }
    let staffAlertSetting = {
      "reminder_lead_time" : this.totalTimeStaffEmail,
      "appointment" : JSON.stringify(this.emailStaffAppointment),
      "status":this.appointmentsReminderStaff,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminderStaff,
      "email_alert_settings_staff" : staffAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateStaffEmailAlert(requestObject);
  }
  fnAppointmentsReminderAdmin(event){
    if(event == true){
      this.appointmentsReminderAdmin = true;
    }else if(event == false){
      this.appointmentsReminderAdmin = false;
    }
    let adminAlertSetting = {
      "reminder_lead_time" : this.totalTimeAdminEmail,
      "appointment" : JSON.stringify(this.emailAdminAppointment),
      "status":this.appointmentsReminderAdmin,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminderAdmin,
      "email_alert_settings_admin" : adminAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateAdminEmailAlert(requestObject);
  }

fnAppointmentsReminderSMS(event){
    if(event == true){
      this.appointmentsReminderSMS = true;
    }else if(event == false){
      this.appointmentsReminderSMS = false;
    }
    let smsAlertSetting = {
      "time" : this.totalTimeSms,
      "when" : JSON.stringify(this.smsAppointment),
      "reminder_status":this.appointmentsReminderSMS,
      "who":JSON.stringify(this.smsAlertWho),
    }
    let requestObject={
      "business_id":this.businessId,
      "reminder_status":this.appointmentsReminderSMS,
      "sms_sending_settings" : smsAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateSmsAlert(requestObject);
  }

  fnCusEmailAppoint(event, value){
    if(event == true){
      this.emailCustomerAppointment[value].status=1;
    }else{
      this.emailCustomerAppointment[value].status=0;
    }
    console.log(this.emailCustomerAppointment);
  }
  fnStaffEmailAppoint(event, value){
    if(event == true){
      this.emailStaffAppointment[value].status=1;
    }else{
      this.emailStaffAppointment[value].status=0;
    }
    console.log(this.emailStaffAppointment);
  }
  fnAdminEmailAppoint(event, value){
    if(event == true){
      this.emailAdminAppointment[value].status=1;
    }else{
      this.emailAdminAppointment[value].status=0;
    }
    console.log(this.emailAdminAppointment);
  }

  fnSetCustomerEmailReminderTime(event){
    let email_alert_customer_days=0;
    let email_alert_customer_hours=0;
    let email_alert_customer_minutes=0;
    if(this.emailAlertCustomerDays !=undefined){
     email_alert_customer_days =  parseInt(this.emailAlertCustomerDays)*24*60;
    }
    if(this.emailAlertCustomerHours !=undefined){
     email_alert_customer_hours =  parseInt(this.emailAlertCustomerHours)*60;
    }
    if(this.emailAlertCustomerMinutes !=undefined){
     email_alert_customer_minutes =  parseInt(this.emailAlertCustomerMinutes);
    }
    this.totalTimeCustomerEmail=email_alert_customer_days+email_alert_customer_hours+email_alert_customer_minutes;
    console.log(this.totalTimeCustomerEmail);

  }
  fnSubmitCusEmailAlert(){
    let customerAlertSetting = {
      "reminder_lead_time" : this.totalTimeCustomerEmail,
      "appointment" : JSON.stringify(this.emailCustomerAppointment),
      "status":this.appointmentsReminder,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminder,
      "email_alert_settings_customer" : customerAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateCusEmailAlert(requestObject);
  }
  fnUpdateCusEmailAlert(requestObject){
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnAppointmentsReminderCustomer(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email alerts for the Customer are Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  fnSetStaffEmailReminderTime(){
    let email_alert_staff_days=0;
    let email_alert_staff_hours=0;
    let email_alert_staff_minutes=0;
    if(this.emailAlertStaffDays !=undefined){
     email_alert_staff_days =  parseInt(this.emailAlertStaffDays)*24*60;
    }
    if(this.emailAlertStaffHours !=undefined){
     email_alert_staff_hours =  parseInt(this.emailAlertStaffHours)*60;
    }
    if(this.emailAlertStaffMinutes !=undefined){
     email_alert_staff_minutes =  parseInt(this.emailAlertStaffMinutes);
    }
    this.totalTimeStaffEmail=email_alert_staff_days+email_alert_staff_hours+email_alert_staff_minutes;
    console.log(this.totalTimeStaffEmail);
  }
  fnSubmitStaffEmailAlert(){
    let staffAlertSetting = {
      "reminder_lead_time" : this.totalTimeStaffEmail,
      "appointment" : JSON.stringify(this.emailStaffAppointment),
      "status":this.appointmentsReminderStaff,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminderStaff,
      "email_alert_settings_staff" : staffAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateStaffEmailAlert(requestObject);
  }

  fnUpdateStaffEmailAlert(requestObject){
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnUpdateStaffEmailAlert(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email alerts for the Staff are Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  fnSetAdminEmailReminderTime(event){
    let email_alert_admin_days=0;
    let email_alert_admin_hours=0;
    let email_alert_admin_minutes=0;
    if(this.emailAlertAdminDays !=undefined){
     email_alert_admin_days =  parseInt(this.emailAlertAdminDays)*24*60;
    }
    if(this.emailAlertAdminHours !=undefined){
     email_alert_admin_hours =  parseInt(this.emailAlertAdminHours)*60;
    }
    if(this.emailAlertAdminMinutes !=undefined){
     email_alert_admin_minutes =  parseInt(this.emailAlertAdminMinutes);
    }
    this.totalTimeAdminEmail=email_alert_admin_days+email_alert_admin_hours+email_alert_admin_minutes;
    console.log(this.totalTimeAdminEmail);

  }
  fnSubmitAdminEmailAlert(){
    if(this.adminEmailForAlert.valid){ 
      let adminAlertSetting = {
        "reminder_lead_time" : this.totalTimeAdminEmail,
        "appointment" : JSON.stringify(this.emailAdminAppointment),
        "status":this.appointmentsReminderAdmin,
        "admin_mail": this.adminEmailForAlert.get('alertEmail').value
      }
      let requestObject={
        "business_id":this.businessId,
        "status":this.appointmentsReminderAdmin,
        "email_alert_settings_admin" : adminAlertSetting
      }
      console.log(requestObject);
      this.fnUpdateAdminEmailAlert(requestObject);
    }
    // else{
    //   setTimeout(() => this.adminEmailForAlert.focus(), 0);
    //   //this.adminEmailForAlert.controls['alertEmail'].focus();
    // }
   
  }
  fnUpdateAdminEmailAlert(requestObject){
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnUpdateAdminEmailAlert(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email alerts for the Admin are Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
       this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  fnSubmitCustomizeAlert(){
    this.isLoaderAdmin = true;
    if(this.customizeAlert.valid){
      let customizeEmailAlert = {
        "sender_name" : this.customizeAlert.get('senderName').value,
        "email_signature" : this.customizeAlert.get('emailSignature').value,
      }
      let requestObject={
        "business_id":this.businessId,
        "customize_email_alert" : customizeEmailAlert
      }

      this.adminSettingsService.fnSubmitCustomizeAlert(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Customize Email alerts are Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
       this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
    }
  }

  getCustomerEmailTemplates(){
    let requestObject={
      "business_id":this.businessId,
      "user_type" : "C"
    }
    this.adminSettingsService.getEmailTemplates(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.customerEmailTemData = response.response;
        this.cusEmailTemplate1.controls['emailTemplate'].setValue(this.customerEmailTemData[0].email_message);
        this.cusEmailTemplate2.controls['emailTemplate'].setValue(this.customerEmailTemData[1].email_message);
        this.cusEmailTemplate3.controls['emailTemplate'].setValue(this.customerEmailTemData[2].email_message);
        this.cusEmailTemplate4.controls['emailTemplate'].setValue(this.customerEmailTemData[3].email_message);
        this.cusEmailTemplate5.controls['emailTemplate'].setValue(this.customerEmailTemData[4].email_message);
        this.cusEmailTemplate6.controls['emailTemplate'].setValue(this.customerEmailTemData[5].email_message);
        this.cusEmailTemplate7.controls['emailTemplate'].setValue(this.customerEmailTemData[6].email_message);
        this.customerEmailTemData.forEach( (element) => { 
          if(element.email_template_status == 'E'){
            element.email_template_status = true;
          }else if(element.email_template_status == 'D'){
            element.email_template_status = false;
          }
        });
        this.cusEmailTemplateStatus1 = this.customerEmailTemData[0].email_template_status;
        this.cusEmailTemplateStatus2 = this.customerEmailTemData[1].email_template_status;
        this.cusEmailTemplateStatus3 = this.customerEmailTemData[2].email_template_status;
        this.cusEmailTemplateStatus4 = this.customerEmailTemData[3].email_template_status;
        this.cusEmailTemplateStatus5 = this.customerEmailTemData[4].email_template_status;
        this.cusEmailTemplateStatus6 = this.customerEmailTemData[5].email_template_status;
        this.cusEmailTemplateStatus7 = this.customerEmailTemData[6].email_template_status;
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  fnChangeTemStatus(event, tempId){
    if(event == true){
      this.emailTempStatus = "E";
    }else{
      this.emailTempStatus = "D";
    }
    let requestObject = {
      "template_id" : tempId,
      "status" : this.emailTempStatus
    }
    this.adminSettingsService.fnChangeTemStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email Template Status Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  fnSaveEmailTemp(tempId){
    if(tempId == this.customerEmailTemData[0].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Request",
        "message" : this.cusEmailTemplate1.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.customerEmailTemData[1].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Approved",
        "message" : this.cusEmailTemplate2.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.customerEmailTemData[2].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Regected",
        "message" : this.cusEmailTemplate3.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.customerEmailTemData[3].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment cancelled By You",
        "message" : this.cusEmailTemplate4.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.customerEmailTemData[4].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Rescheduled By You",
        "message" : this.cusEmailTemplate5.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.customerEmailTemData[5].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Client Appintment Reminder",
        "message" : this.cusEmailTemplate6.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.customerEmailTemData[6].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Completed",
        "message" : this.cusEmailTemplate7.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.adminEmailTemData[0].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "New Appointment Request Require Approval",
        "message" : this.adminEmailTemplate1.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.adminEmailTemData[1].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Approved",
        "message" : this.adminEmailTemplate2.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.adminEmailTemData[2].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Rejected",
        "message" : this.adminEmailTemplate3.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.adminEmailTemData[3].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Cancelled by Customer",
        "message" : this.adminEmailTemplate4.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.adminEmailTemData[4].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment rescheduled by Customer",
        "message" : this.adminEmailTemplate5.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.adminEmailTemData[5].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Admin Appointment Reminder",
        "message" : this.adminEmailTemplate6.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.adminEmailTemData[6].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Completed",
        "message" : this.adminEmailTemplate7.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.staffEmailTemData[0].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "New Appointment Assigned",
        "message" : this.staffEmailTemplate1.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.staffEmailTemData[1].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Approved",
        "message" : this.staffEmailTemplate2.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.staffEmailTemData[2].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Rejected",
        "message" : this.staffEmailTemplate3.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.staffEmailTemData[3].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Cancelled By Customer",
        "message" : this.staffEmailTemplate4.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.staffEmailTemData[4].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Rescheduled By Customer",
        "message" : this.staffEmailTemplate5.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.staffEmailTemData[5].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Reminder",
        "message" : this.staffEmailTemplate6.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == this.staffEmailTemData[6].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Completed",
        "message" : this.staffEmailTemplate7.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }
  }
  fnUpdateEmailTemp(requestObject){
    this.adminSettingsService.fnUpdateEmailTemp(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email Template is Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
        this.getCustomerEmailTemplates();
        this.getAdminEmailTemplates();
        this.getStaffEmailTemplates();
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }


  getAdminEmailTemplates(){
    let requestObject={
      "business_id":this.businessId,
      "user_type" : "A"
    }
    this.adminSettingsService.getEmailTemplates(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.adminEmailTemData = response.response;
        this.adminEmailTemplate1.controls['emailTemplate'].setValue(this.adminEmailTemData[0].email_message);
        this.adminEmailTemplate2.controls['emailTemplate'].setValue(this.adminEmailTemData[1].email_message);
        this.adminEmailTemplate3.controls['emailTemplate'].setValue(this.adminEmailTemData[2].email_message);
        this.adminEmailTemplate4.controls['emailTemplate'].setValue(this.adminEmailTemData[3].email_message);
        this.adminEmailTemplate5.controls['emailTemplate'].setValue(this.adminEmailTemData[4].email_message);
        this.adminEmailTemplate6.controls['emailTemplate'].setValue(this.adminEmailTemData[5].email_message);
        this.adminEmailTemplate7.controls['emailTemplate'].setValue(this.adminEmailTemData[6].email_message);
        this.adminEmailTemData.forEach( (element) => { 
          if(element.email_template_status == 'E'){
            element.email_template_status = true;
          }else if(element.email_template_status == 'D'){
            element.email_template_status = false;
          }
        });
        this.adminEmailTemplateStatus1 = this.adminEmailTemData[0].email_template_status;
        this.adminEmailTemplateStatus2 = this.adminEmailTemData[1].email_template_status;
        this.adminEmailTemplateStatus3 = this.adminEmailTemData[2].email_template_status;
        this.adminEmailTemplateStatus4 = this.adminEmailTemData[3].email_template_status;
        this.adminEmailTemplateStatus5 = this.adminEmailTemData[4].email_template_status;
        this.adminEmailTemplateStatus6 = this.adminEmailTemData[5].email_template_status;
        this.adminEmailTemplateStatus7 = this.adminEmailTemData[6].email_template_status;
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  getStaffEmailTemplates(){
    let requestObject={
      "business_id":this.businessId,
      "user_type" : "S"
    }
    this.adminSettingsService.getEmailTemplates(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.staffEmailTemData = response.response;
        this.staffEmailTemplate1.controls['emailTemplate'].setValue(this.staffEmailTemData[0].email_message);
        this.staffEmailTemplate2.controls['emailTemplate'].setValue(this.staffEmailTemData[1].email_message);
        this.staffEmailTemplate3.controls['emailTemplate'].setValue(this.staffEmailTemData[2].email_message);
        this.staffEmailTemplate4.controls['emailTemplate'].setValue(this.staffEmailTemData[3].email_message);
        this.staffEmailTemplate5.controls['emailTemplate'].setValue(this.staffEmailTemData[4].email_message);
        this.staffEmailTemplate6.controls['emailTemplate'].setValue(this.staffEmailTemData[5].email_message);
        this.staffEmailTemplate7.controls['emailTemplate'].setValue(this.staffEmailTemData[6].email_message);
        this.staffEmailTemData.forEach( (element) => { 
          if(element.email_template_status == 'E'){
            element.email_template_status = true;
          }else if(element.email_template_status == 'D'){
            element.email_template_status = false;
          }
        });
        this.staffEmailTemplateStatus1 = this.staffEmailTemData[0].email_template_status;
        this.staffEmailTemplateStatus2 = this.staffEmailTemData[1].email_template_status;
        this.staffEmailTemplateStatus3 = this.staffEmailTemData[2].email_template_status;
        this.staffEmailTemplateStatus4 = this.staffEmailTemData[3].email_template_status;
        this.staffEmailTemplateStatus5 = this.staffEmailTemData[4].email_template_status;
        this.staffEmailTemplateStatus6 = this.staffEmailTemData[5].email_template_status;
        this.staffEmailTemplateStatus7 = this.staffEmailTemData[6].email_template_status;

        console.log(this.staffEmailTemData)
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnDefaultEmailTemp(tempId){
    let requestObject={
      "business_id":this.businessId,
      "template_id" : tempId
    }
    this.adminSettingsService.fnDefaultEmailTemp(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email Template is Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
        this.getCustomerEmailTemplates();
        this.getAdminEmailTemplates();
        this.getStaffEmailTemplates();
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }


  
  previewClientEmailTemp(index) {
    const dialogRef = this.dialog.open(DialogPreviewEmailTemp, {
      height: '700px',
      data :{fulldata : this.customerEmailTemData[index]}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
  previewAdminEmailTemp(index) {
    const dialogRef = this.dialog.open(DialogPreviewEmailTemp, {
      height: '700px',
      data :{fulldata : this.adminEmailTemData[index]}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  previewStaffEmailTemp(index) {
    const dialogRef = this.dialog.open(DialogPreviewEmailTemp, {
      height: '700px',
      data :{fulldata : this.staffEmailTemData[index]}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


// for SMS
  fnSetSmsReminderTime(event){
    let sms_alert_days=0;
    let sms_alert_hours=0;
    let sms_alert_minutes=0;
    if(this.smsAlertDays !=undefined){
      sms_alert_days =  parseInt(this.smsAlertDays)*24*60;
    }
    if(this.smsAlertHours !=undefined){
      sms_alert_hours =  parseInt(this.smsAlertHours)*60;
    }
    if(this.smsAlertMinutes !=undefined){
      sms_alert_minutes =  parseInt(this.smsAlertMinutes);
    }
    this.totalTimeSms=sms_alert_days+sms_alert_hours+sms_alert_minutes;
    console.log(this.totalTimeSms);

  }


  fnSmsAppoint(event, value){
    if(event == true){
      this.smsAppointment[value].status=1;
    }else{
      this.smsAppointment[value].status=0;
    }
    console.log(this.smsAppointment);
  }
  fnSmsWho(event, value){
    if(event == true){
      this.smsAlertWho[value].status=1;
    }else{
      this.smsAlertWho[value].status=0;
    }
    console.log(this.smsAppointment);
  }

  fnSubmitSmsAlert(){
      let smsAlertSetting = {
        "time" : this.totalTimeSms,
        "when" : JSON.stringify(this.smsAppointment),
        "reminder_status":this.appointmentsReminderSMS,
        "who":JSON.stringify(this.smsAlertWho),
      }
      let requestObject={
        "business_id":this.businessId,
        "reminder_status":this.appointmentsReminderSMS,
        "sms_sending_settings" : smsAlertSetting
      }
      console.log(requestObject);
      this.fnUpdateSmsAlert(requestObject);
  }

  fnUpdateSmsAlert(requestObject){
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnUpdateSmsAlert(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Sms alerts are Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  getCustomerSmsTemplates(){
    let requestObject={
      "business_id":this.businessId,
      "user_type" : "C"
    }
    this.adminSettingsService.getSmsTemplates(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.cusSmsTemData = response.response;
        this.cusSmsTemplate1.controls['smsTemplate'].setValue(this.cusSmsTemData[0].sms_message);
        this.cusSmsTemplate2.controls['smsTemplate'].setValue(this.cusSmsTemData[1].sms_message);
        this.cusSmsTemplate3.controls['smsTemplate'].setValue(this.cusSmsTemData[2].sms_message);
        this.cusSmsTemplate4.controls['smsTemplate'].setValue(this.cusSmsTemData[3].sms_message);
        this.cusSmsTemplate5.controls['smsTemplate'].setValue(this.cusSmsTemData[4].sms_message);
        this.cusSmsTemplate6.controls['smsTemplate'].setValue(this.cusSmsTemData[5].sms_message);
        this.cusSmsTemplate7.controls['smsTemplate'].setValue(this.cusSmsTemData[6].sms_message);
        this.cusSmsTemData.forEach( (element) => { 
          if(element.sms_template_status == 'E'){
            element.sms_template_status = true;
          }else if(element.email_template_status == 'D'){
            element.sms_template_status = false;
          }
        });
        this.cusSmsTemplateStatus1 = this.cusSmsTemData[0].sms_template_status;
        this.cusSmsTemplateStatus2 = this.cusSmsTemData[1].sms_template_status;
        this.cusSmsTemplateStatus3 = this.cusSmsTemData[2].sms_template_status;
        this.cusSmsTemplateStatus4 = this.cusSmsTemData[3].sms_template_status;
        this.cusSmsTemplateStatus5 = this.cusSmsTemData[4].sms_template_status;
        this.cusSmsTemplateStatus6 = this.cusSmsTemData[5].sms_template_status;
        this.cusSmsTemplateStatus7 = this.cusSmsTemData[6].sms_template_status;
        console.log(this.cusSmsTemData);
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  getStaffSmsTemplates(){
    let requestObject={
      "business_id":this.businessId,
      "user_type" : "S"
    }
    this.adminSettingsService.getSmsTemplates(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.staffSmsTemData = response.response;
        this.staffSmsTemplate1.controls['smsTemplate'].setValue(this.staffSmsTemData[0].sms_message);
        this.staffSmsTemplate2.controls['smsTemplate'].setValue(this.staffSmsTemData[1].sms_message);
        this.staffSmsTemplate3.controls['smsTemplate'].setValue(this.staffSmsTemData[2].sms_message);
        this.staffSmsTemplate4.controls['smsTemplate'].setValue(this.staffSmsTemData[3].sms_message);
        this.staffSmsTemplate5.controls['smsTemplate'].setValue(this.staffSmsTemData[4].sms_message);
        this.staffSmsTemplate6.controls['smsTemplate'].setValue(this.staffSmsTemData[5].sms_message);
        this.staffSmsTemplate7.controls['smsTemplate'].setValue(this.staffSmsTemData[6].sms_message);
        this.staffSmsTemData.forEach( (element) => { 
          if(element.sms_template_status == 'E'){
            element.sms_template_status = true;
          }else if(element.email_template_status == 'D'){
            element.sms_template_status = false;
          }
        });
        this.staffSmsTemplateStatus1 = this.staffSmsTemData[0].sms_template_status;
        this.staffSmsTemplateStatus2 = this.staffSmsTemData[1].sms_template_status;
        this.staffSmsTemplateStatus3 = this.staffSmsTemData[2].sms_template_status;
        this.staffSmsTemplateStatus4 = this.staffSmsTemData[3].sms_template_status;
        this.staffSmsTemplateStatus5 = this.staffSmsTemData[4].sms_template_status;
        this.staffSmsTemplateStatus6 = this.staffSmsTemData[5].sms_template_status;
        this.staffSmsTemplateStatus7 = this.staffSmsTemData[6].sms_template_status;
        console.log(this.staffSmsTemData);
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  getAdminSmsTemplates(){
    let requestObject={
      "business_id":this.businessId,
      "user_type" : "A"
    }
    this.adminSettingsService.getSmsTemplates(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.adminSmsTemData = response.response;
        this.adminSmsTemplate1.controls['smsTemplate'].setValue(this.adminSmsTemData[0].sms_message);
        this.adminSmsTemplate2.controls['smsTemplate'].setValue(this.adminSmsTemData[1].sms_message);
        this.adminSmsTemplate3.controls['smsTemplate'].setValue(this.adminSmsTemData[2].sms_message);
        this.adminSmsTemplate4.controls['smsTemplate'].setValue(this.adminSmsTemData[3].sms_message);
        this.adminSmsTemplate5.controls['smsTemplate'].setValue(this.adminSmsTemData[4].sms_message);
        this.adminSmsTemplate6.controls['smsTemplate'].setValue(this.adminSmsTemData[5].sms_message);
        this.adminSmsTemplate7.controls['smsTemplate'].setValue(this.adminSmsTemData[6].sms_message);
        this.adminSmsTemData.forEach( (element) => { 
          if(element.sms_template_status == 'E'){
            element.sms_template_status = true;
          }else if(element.email_template_status == 'D'){
            element.sms_template_status = false;
          }
        });
        this.adminSmsTemplateStatus1 = this.adminSmsTemData[0].sms_template_status;
        this.adminSmsTemplateStatus2 = this.adminSmsTemData[1].sms_template_status;
        this.adminSmsTemplateStatus3 = this.adminSmsTemData[2].sms_template_status;
        this.adminSmsTemplateStatus4 = this.adminSmsTemData[3].sms_template_status;
        this.adminSmsTemplateStatus5 = this.adminSmsTemData[4].sms_template_status;
        this.adminSmsTemplateStatus6 = this.adminSmsTemData[5].sms_template_status;
        this.adminSmsTemplateStatus7 = this.adminSmsTemData[6].sms_template_status;
        console.log(this.adminSmsTemData);
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }


  fnChangeSmsTemStatus(event, tempId){
    if(event == true){
      this.smsTempStatus = "E";
    }else{
      this.smsTempStatus = "D";
    }
    let requestObject = {
      "template_id" : tempId,
      "status" : this.smsTempStatus
    }
    this.adminSettingsService.fnChangeSmsTemStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Sms Template Status Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  fnDefaultSmsTemp(tempId){
    let requestObject={
      "business_id":this.businessId,
      "template_id" : tempId
    }
    this.adminSettingsService.fnDefaultSmsTemp(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email Template is Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
        this.getCustomerSmsTemplates();
        this.getAdminSmsTemplates();
        this.getStaffSmsTemplates();
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  fnSaveSmsTemp(tempId){
    if(tempId == this.cusSmsTemData[0].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Request",
        "message" : this.cusSmsTemplate1.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.cusSmsTemData[1].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Approved",
        "message" : this.cusSmsTemplate2.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.cusSmsTemData[2].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Regected",
        "message" : this.cusSmsTemplate3.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.cusSmsTemData[3].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment cancelled By You",
        "message" : this.cusSmsTemplate4.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.cusSmsTemData[4].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Rescheduled By You",
        "message" : this.cusSmsTemplate5.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.cusSmsTemData[5].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Client Appintment Reminder",
        "message" : this.cusSmsTemplate6.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.cusSmsTemData[6].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Completed",
        "message" : this.cusSmsTemplate7.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.adminSmsTemData[0].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "New Appointment Request Require Approval",
        "message" : this.adminSmsTemplate1.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.adminSmsTemData[1].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Approved",
        "message" : this.adminSmsTemplate2.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.adminSmsTemData[2].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Rejected",
        "message" : this.adminSmsTemplate3.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.adminSmsTemData[3].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Cancelled by Customer",
        "message" : this.adminSmsTemplate4.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.adminSmsTemData[4].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment rescheduled by Customer",
        "message" : this.adminSmsTemplate5.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.adminSmsTemData[5].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Admin Appointment Reminder",
        "message" : this.adminSmsTemplate6.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.adminSmsTemData[6].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Completed",
        "message" : this.adminSmsTemplate7.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.staffSmsTemData[0].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "New Appointment Assigned",
        "message" : this.staffSmsTemplate1.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.staffSmsTemData[1].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Approved",
        "message" : this.staffSmsTemplate2.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.staffSmsTemData[2].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Rejected",
        "message" : this.staffSmsTemplate3.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.staffSmsTemData[3].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Cancelled By Customer",
        "message" : this.staffSmsTemplate4.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.staffSmsTemData[4].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Rescheduled By Customer",
        "message" : this.staffSmsTemplate5.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.staffSmsTemData[5].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Reminder",
        "message" : this.staffSmsTemplate6.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }else if(tempId == this.staffSmsTemData[6].id){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Completed",
        "message" : this.staffSmsTemplate7.get('smsTemplate').value
      }
      this.fnUpdateSmsTemp(requestObject);
    }
  }
  fnUpdateSmsTemp(requestObject){
    this.adminSettingsService.fnUpdateSmsTemp(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Sms Template is Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
        this.getCustomerEmailTemplates();
        this.getAdminEmailTemplates();
        this.getStaffEmailTemplates();
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnTwillioStatus(event){
    this.twilliStatus =event;
    let twilioSetting = {
      "account_sid":this.twilio.get("accountSID").value,
      "auth_token":this.twilio.get("authToken").value,
      "twilo_sender_number":this.twilio.get("twilioSender").value,
      "admin_phone_number":this.twilio.get("adminNumber").value,
      "status": this.twilliStatus,
    }

    let requestObject = {
      "business_id" :this.businessId,
      "status":this.twilliStatus,
      "twilo_setting" : twilioSetting
    }
    this.updateTwillioSettings(requestObject);
  }

  fnSubmitTwillioSettings(){
    if(this.twilio.valid){
      let twilioSetting = {
        "account_sid":this.twilio.get("accountSID").value,
        "auth_token":this.twilio.get("authToken").value,
        "twilo_sender_number":this.twilio.get("twilioSender").value,
        "admin_phone_number":this.twilio.get("adminNumber").value,
        "status": this.twilliStatus,
      }

      let requestObject = {
        "business_id" :this.businessId,
        "status":this.twilliStatus,
        "twilo_setting" : twilioSetting
      }
      this.updateTwillioSettings(requestObject);
    }
  }

  updateTwillioSettings(requestObject){
    this.adminSettingsService.updateTwillioSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Twillio Setting is Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnTextLocalStatus(event){
    this.textLocalStatus = event;
    let textLocalSetting = {
      "api_key":this.textLocal.get("apiKey").value,
      "admin_number" : this.textLocal.get("adminNumber").value,
      "status":this.textLocalStatus,
    }

    let requestObject = {
      "business_id" :this.businessId,
      "status":this.textLocalStatus,
      "textlocal_setting" : textLocalSetting
    }
    this.updateTextLocalSettings(requestObject);
  }

  fnSubmitTextLocalSetting(){
    if(this.textLocal.valid){
      let textLocalSetting = {
        "api_key":this.textLocal.get("apiKey").value,
        "admin_number" : this.textLocal.get("adminNumber").value,
        "status":this.textLocalStatus,
      }

      let requestObject = {
        "business_id" :this.businessId,
        "status":this.textLocalStatus,
        "textlocal_setting" : textLocalSetting
      }
      this.updateTextLocalSettings(requestObject);
    }
  }

  updateTextLocalSettings(requestObject){
    this.adminSettingsService.updateTextLocalSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Text-Local Setting is Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }




}






@Component({
  selector: 'dialog-preview-email-template',
  templateUrl: '../_dialogs/dialog-preview-email-template.html',
})
export class DialogPreviewEmailTemp  implements PipeTransform {

  businessId :any
  emailTemplate :any
  safeHtmlTemp :any
  constructor(
    public dialogRef: MatDialogRef<DialogPreviewEmailTemp>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public adminSettingsService: AdminSettingsService,
    private sanitizer:DomSanitizer
    ) {
      this.emailTemplate =  this.data.fulldata.email_message;
      this.transform(this.emailTemplate)

    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  transform(emailTemplate) {
    this.safeHtmlTemp =  this.sanitizer.bypassSecurityTrustHtml(emailTemplate);
  }
}


