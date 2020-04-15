import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-alertsettings',
  templateUrl: './alertsettings.component.html',
  styleUrls: ['./alertsettings.component.scss']
})
export class AlertsettingsComponent implements OnInit {

  businessId : any;
  emailCustomerAppointment : any =[];
  emailAlertCustomer : any;
  emailAlertCustomerDays: any;
  emailAlertCustomerHours: any;
  emailAlertCustomerMinutes: any;
  Months:any;
  Days:any;
  Hours:any;
  Minutes:any;
  adminSettings : boolean = true;
  appointmentsReminder : boolean = false;
  appointmentsReminderStaff :boolean = false;
  appointmentsReminderAdmin :boolean = false;
  AppointmentsReminderSMS : boolean = false;
  constructor(
    private appComponent : AppComponent,
    public adminSettingsService : AdminSettingsService,
    private _snackBar: MatSnackBar
    ) {
      if(localStorage.getItem('business_id')){
        this.businessId = localStorage.getItem('business_id');
      }

      this.emailAlertCustomerDays = "0";
      this.emailAlertCustomerHours= "0";
      this.emailAlertCustomerMinutes= "0";
    }
     

  ngOnInit() {
    this.getSettingsValue();
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
        console.log(response.response)
        this.emailAlertCustomer = JSON.parse(response.response.email_alert_settings_customer)
        console.log(this.emailAlertCustomer);
        this.fnConvertMins(this.emailAlertCustomer.reminder_lead_time);
          this.emailAlertCustomerDays=this.Days;
          this.emailAlertCustomerHours=this.Hours;
          this.emailAlertCustomerMinutes=this.Minutes;
        
      }
      else{
       
      }
    })
  }
fnAppointmentsReminder(event){
    if(event == true){
      this.appointmentsReminder = true;
    }else if(event == false){
      this.appointmentsReminder = false;
    }
}

fnAppointmentsReminderStaff(event){
    if(event == true){

      this.appointmentsReminderStaff = true;
      
    }else if(event == false){

      this.appointmentsReminderStaff = false;
    }
}
fnAppointmentsReminderAdmin(event){
    if(event == true){

      this.appointmentsReminderAdmin = true;
      
    }else if(event == false){

      this.appointmentsReminderAdmin = false;
    }

}

fnAppointmentsReminderSMS(event){

    if(event == true){

      this.AppointmentsReminderSMS = true;
      
    }else if(event == false){

      this.AppointmentsReminderSMS = false;
    }

}

  fnCusEmailAppoint(event, value){
    if(event == true){
    this.emailCustomerAppointment.push(value);
    }else{
      const index = this.emailCustomerAppointment.indexOf(value, 0);
      if (index > -1) {
        this.emailCustomerAppointment.splice(index, 1);
      }
    }
    console.log(this.emailCustomerAppointment);
    
  }

  fnSetCustomerEmailReminderTime(event){
    console.log(this.emailAlertCustomerDays);
    console.log(this.emailAlertCustomerHours);
    console.log(this.emailAlertCustomerMinutes);
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
    let total_time=email_alert_customer_days+email_alert_customer_hours+email_alert_customer_minutes;

    console.log(email_alert_customer_days);
    console.log(email_alert_customer_hours);
    console.log(email_alert_customer_minutes);
    console.log(total_time);

  }


}


