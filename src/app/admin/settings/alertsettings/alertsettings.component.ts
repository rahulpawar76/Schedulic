import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from '@app/app.component'


@Component({
  selector: 'app-alertsettings',
  templateUrl: './alertsettings.component.html',
  styleUrls: ['./alertsettings.component.scss']
})
export class AlertsettingsComponent implements OnInit {
  adminSettings : boolean = true;
  constructor(
    private appComponent : AppComponent,
    ) {
      //this.appComponent.settingsModule(this.adminSettings);
     }

  ngOnInit() {
  }

 

  


}


