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
      //this.appComponent.settingsModule(this.adminSettings);
     }

  ngOnInit() {
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
 

  


}


