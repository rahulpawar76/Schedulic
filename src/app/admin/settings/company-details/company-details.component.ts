import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component'
@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
  adminSettings : boolean = true;
  constructor(private appComponent : AppComponent) {

    //this.appComponent.settingsModule(this.adminSettings);
   }

  ngOnInit() {
  }

}
