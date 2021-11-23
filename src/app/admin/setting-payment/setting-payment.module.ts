import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/_helpers/material.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SettingPaymentRoutingModule } from './setting-payment-routing.module';

import { SharedModule } from '../../shared.module';


import { PaymentgatewayComponent } from './paymentgateway/paymentgateway.component';
import { BillingComponent, DialogSubscriptionCardForm } from './billing/billing.component';
import { PaymentrulesComponent, DialogAddNewTax } from './paymentrules/paymentrules.component';



@NgModule({
  declarations: [
    PaymentgatewayComponent,
    BillingComponent,
    PaymentrulesComponent,
    DialogAddNewTax,
    DialogSubscriptionCardForm,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    MatSidenavModule,
    SettingPaymentRoutingModule,
    SharedModule
  ],
  
  bootstrap: [],
   entryComponents: [
    DialogAddNewTax,
    DialogSubscriptionCardForm
   ]
})
export class SettingPaymentModule { }
