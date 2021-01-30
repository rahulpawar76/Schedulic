import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/_helpers/material.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ColorPickerModule } from 'ngx-color-picker';
import { enableRipple } from '@syncfusion/ej2-base';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MdePopoverModule } from '@material-extended/mde';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { SettingGeneralRoutingModule } from './setting-general-routing.module';
import { AppearanceComponent, DialogPreviewTheme, DialogWidgetBGUpload } from './appearance/appearance.component';
import { BookingrulesComponent } from './bookingrules/bookingrules.component';
import { AlertsettingsComponent, DialogPreviewEmailTemp } from './alertsettings/alertsettings.component';





enableRipple(true);
@NgModule({
  declarations: [
    AppearanceComponent,
    BookingrulesComponent,
    AlertsettingsComponent,
    DialogPreviewEmailTemp,
    DialogPreviewTheme,
    DialogWidgetBGUpload,
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
    ColorPickerModule,
    SettingGeneralRoutingModule,
    MatDatepickerModule,
    MdePopoverModule,
    NgbModule,
    NgxIntlTelInputModule
  ],
  
  exports: [
    FormsModule
  ],
  bootstrap: [AppearanceComponent],
  entryComponents: [
    DialogPreviewEmailTemp,
    DialogPreviewTheme,
    DialogWidgetBGUpload,
  ],
})
export class SettingGeneralModule { }
