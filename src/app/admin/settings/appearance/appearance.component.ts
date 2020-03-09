import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component'

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit {
  adminSettings : boolean = true;

  constructor(
    
    private appComponent : AppComponent,
  ) {
    
    this.appComponent.settingsModule(this.adminSettings);
   }

  ngOnInit() {
  }

}
