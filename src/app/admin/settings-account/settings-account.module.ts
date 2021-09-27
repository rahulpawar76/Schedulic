import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/_helpers/material.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AdminSettingsAccountRoutingModule } from './settings-account-routing.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { enableRipple } from '@syncfusion/ej2-base';
import { SharedModule } from '../../shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CompanyDetailsComponent, DialogCompanyDetailsImageUpload } from './company-details/company-details.component';



enableRipple(true);

@NgModule({
  declarations: [
    CompanyDetailsComponent,
    DialogCompanyDetailsImageUpload,
    
  ],
  imports: [
      CommonModule,
      HttpClientModule,
      AdminSettingsAccountRoutingModule,
      MaterialModule,
      ReactiveFormsModule,
      FormsModule,
      MatSidenavModule,
      MatDatepickerModule,
      SharedModule,
      NgxIntlTelInputModule,
      NgxMatSelectSearchModule
  ],
  exports: [
    FormsModule
  ],
  bootstrap: [],
   entryComponents: [DialogCompanyDetailsImageUpload,],
})
export class SettingsAccountModule {}
