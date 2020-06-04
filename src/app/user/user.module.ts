import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientModule } from '@angular/common/http';
import {ProgressBarModule} from "angular-progress-bar";
import { HighchartsChartModule } from 'highcharts-angular';

import { MaterialModule } from '@app/_helpers/material.module';
import { UserRoutingModule } from './user-routing.module';
import { UserappointmentsComponent } from './userappointments';
import { UserProfileComponent } from './user-profile';
import { DialogOverviewExampleDialog } from './userappointments';
import { DialogCancelReason } from './userappointments';
import { DialogInvoiceDialog } from './userappointments';
import { DialogMyAppointmentDetails } from './userappointments';
import { rescheduleAppointmentDialog } from './userappointments';
import { DialogCancelAppointmentDetails } from './userappointments';
import { DialogCompleteAppointmentDetails } from './userappointments';
import { DialogUserImageUpload } from './user-profile';
import { SharedModule } from '../shared.module';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  declarations: [
		UserappointmentsComponent,
		UserProfileComponent,
		DialogOverviewExampleDialog,
		DialogCancelReason,
		DialogInvoiceDialog,
		DialogMyAppointmentDetails,
		DialogCancelAppointmentDetails,
		DialogCompleteAppointmentDetails,
    DialogUserImageUpload,
    rescheduleAppointmentDialog
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    UserRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    NgxChartsModule,
    ProgressBarModule,
    HighchartsChartModule,
    SharedModule,
    NgxPayPalModule
  ],
  exports: [
    FormsModule
  ],
  entryComponents: [DialogOverviewExampleDialog,rescheduleAppointmentDialog,DialogCancelReason,DialogInvoiceDialog,DialogMyAppointmentDetails,DialogCancelAppointmentDetails,DialogCompleteAppointmentDetails,DialogUserImageUpload],
})
export class UserModule { }
