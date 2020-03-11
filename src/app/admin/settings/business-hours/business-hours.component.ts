import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component';
@Component({
  selector: 'app-business-hours',
  templateUrl: './business-hours.component.html',
  styleUrls: ['./business-hours.component.scss']
})
export class BusinessHoursComponent implements OnInit {
  adminSettings : boolean = true;
  constructor(private appComponent : AppComponent) { 

     //this.appComponent.settingsModule(this.adminSettings);
  }

  ngOnInit() {
  }

}
