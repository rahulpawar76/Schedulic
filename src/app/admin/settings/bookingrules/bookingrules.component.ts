import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component'

@Component({
  selector: 'app-bookingrules',
  templateUrl: './bookingrules.component.html',
  styleUrls: ['./bookingrules.component.scss']
})
export class BookingrulesComponent implements OnInit {
  adminSettings : boolean = true;


  constructor(
    private appComponent : AppComponent,
  ) {
    //this.appComponent.settingsModule(this.adminSettings);
   }

  ngOnInit() {
  }

}
