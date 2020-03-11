import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component'

@Component({
  selector: 'app-paymentgateway',
  templateUrl: './paymentgateway.component.html',
  styleUrls: ['./paymentgateway.component.scss']
})
export class PaymentgatewayComponent implements OnInit {
  adminSettings : boolean = true;

  constructor(
    private appComponent : AppComponent,
  )
   {
    //this.appComponent.settingsModule(this.adminSettings);
   }

  ngOnInit() {
  }

}
