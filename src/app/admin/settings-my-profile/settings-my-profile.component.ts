import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component'

@Component({
  selector: 'app-settings-my-profile',
  templateUrl: './settings-my-profile.component.html',
  styleUrls: ['./settings-my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  adminSettings : boolean = true;
  constructor(private appComponent : AppComponent) {

    //this.appComponent.settingsModule(this.adminSettings);
   }

  ngOnInit() {
  }

}
