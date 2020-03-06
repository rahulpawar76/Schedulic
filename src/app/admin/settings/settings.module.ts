import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/_helpers/material.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AdminSettingsRoutingModule } from './settings-routing.module';
import { ServicesComponent } from './services/services.component';
import { DataTablesModule } from 'angular-datatables';

import { SettingsComponent } from './settings.component';
import { StaffComponent } from './staff/staff.component';

import { SettingsMyProfileComponent } from './settings-my-profile/settings-my-profile.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';

import { AppearanceComponent } from './appearance/appearance.component';


import { DialogAddNewTimeOff } from './staff/staff.component';
import { PostalcodesComponent } from './postalcodes/postalcodes.component';
import { PaymentsComponent } from './payments/payments.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DialogAddNewTax } from './paymentrules/paymentrules.component';

import { PaymentgatewayComponent } from './paymentgateway/paymentgateway.component';
import { PaymentrulesComponent } from './paymentrules/paymentrules.component';
import { BookingrulesComponent } from './bookingrules/bookingrules.component';






@NgModule({
  declarations: [
    ServicesComponent,
    SettingsComponent,
    StaffComponent,
  
    DialogAddNewTimeOff,
    PaymentsComponent,
    DialogAddNewTax,
    PaymentgatewayComponent,
    PaymentrulesComponent,
    BookingrulesComponent,
    SettingsMyProfileComponent,
    CompanyDetailsComponent,
    AppearanceComponent,
    PostalcodesComponent
  ],
  imports: [
      CommonModule,
      HttpClientModule,
      AdminSettingsRoutingModule,
      MaterialModule,
      FlexLayoutModule,
      ReactiveFormsModule,
      FormsModule,
      DragDropModule,
      MatSidenavModule,
      DataTablesModule,
      MatDatepickerModule
  ],
  exports: [
    FormsModule
  ],
   entryComponents: [SettingsComponent,DialogAddNewTimeOff,DialogAddNewTax],
})
export class SettingsModule {}
