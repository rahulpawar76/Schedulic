import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/_helpers/material.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AdminSettingsResourceRoutingModule } from './settings-resource-routing.module';
import { MdePopoverModule } from '@material-extended/mde';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ColorPickerModule } from 'ngx-color-picker';
import { enableRipple } from '@syncfusion/ej2-base';
import { SharedModule } from '../../shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ProgressComponent } from './components/progress/progress.component';
import { DndDirective } from './direcitves/dnd.directive';
import { ServicesComponent, DialogCategoryImageUpload, DialogServiceImageUpload, DialogDataExampleDialog, DialogSubCategoryImageUpload } from './services/services.component';
import { StaffComponent, DialogStaffViewReview, DialogAddNewTimeOff, DialogStaffImageUpload } from './staff/staff.component';
import { BusinessHoursComponent, DialogAddNewTimeOffBussiness } from './business-hours/business-hours.component';
import { PostalcodesComponent, DialogAddPostalCode, DialogEditPostalCode, DialogNewCSVPostalCode } from './postalcodes/postalcodes.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';



enableRipple(true);

@NgModule({
  declarations: [
    ServicesComponent,
    StaffComponent,
    DndDirective,
    ProgressComponent,
    BusinessHoursComponent,
    PostalcodesComponent,
    DialogCategoryImageUpload,
    DialogServiceImageUpload,
    DialogDataExampleDialog,
    DialogSubCategoryImageUpload,
    DialogStaffViewReview,
    DialogAddNewTimeOff,
    DialogAddPostalCode,
    DialogEditPostalCode,
    DialogAddNewTimeOffBussiness,
    DialogStaffImageUpload,
    DialogNewCSVPostalCode,
  ],
  imports: [
      CommonModule,
      HttpClientModule,
      AdminSettingsResourceRoutingModule,
      MaterialModule,
      FlexLayoutModule,
      ReactiveFormsModule,
      FormsModule,
      DragDropModule,
      MatSidenavModule,
      MatDatepickerModule,
      ColorPickerModule,
      MdePopoverModule,
      NgbModule,
      SharedModule,
      NgxIntlTelInputModule,
      NgxMatSelectSearchModule,
  ],
  exports: [
    FormsModule
  ],
  bootstrap: [],
   entryComponents: [
    DialogCategoryImageUpload,
    DialogServiceImageUpload,
    DialogDataExampleDialog,
    DialogSubCategoryImageUpload,
    DialogStaffViewReview,
    DialogAddNewTimeOff,
    DialogAddPostalCode,
    DialogEditPostalCode,
    DialogAddNewTimeOffBussiness,
    DialogStaffImageUpload,
    DialogNewCSVPostalCode,
   ],
})
export class SettingsResourceModule {}
