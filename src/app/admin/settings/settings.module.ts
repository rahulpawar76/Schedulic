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
import { DialogAddNewTimeOffBussiness } from './business-hours/business-hours.component';
import { PostalcodesComponent } from './postalcodes/postalcodes.component';
import{DialogAddPostalCode} from './postalcodes/postalcodes.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DialogAddNewTax } from './paymentrules/paymentrules.component';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { enableRipple } from '@syncfusion/ej2-base';

import { PaymentgatewayComponent } from './paymentgateway/paymentgateway.component';
import { PaymentrulesComponent } from './paymentrules/paymentrules.component';
import { BookingrulesComponent } from './bookingrules/bookingrules.component';
import { BusinessHoursComponent } from './business-hours/business-hours.component';
import { AlertsettingsComponent } from './alertsettings/alertsettings.component';



enableRipple(true);


@NgModule({
  declarations: [
    ServicesComponent,
    SettingsComponent,
    StaffComponent,
    DialogAddNewTimeOffBussiness,
    DialogAddNewTimeOff,
    DialogAddNewTax,
    PaymentgatewayComponent,
    PaymentrulesComponent,
    BookingrulesComponent,
    AlertsettingsComponent,
    SettingsMyProfileComponent,
    CompanyDetailsComponent,
    AppearanceComponent,
    PostalcodesComponent,
    DialogAddPostalCode,
    BusinessHoursComponent
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
      MatDatepickerModule,
      ColorPickerModule
  ],
  exports: [
    FormsModule
  ],
   entryComponents: [SettingsComponent,DialogAddNewTimeOff,DialogAddNewTax,DialogAddPostalCode,DialogAddNewTimeOffBussiness],
})
export class SettingsModule {}
