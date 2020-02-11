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

import { StaffRoutingModule } from './staff-routing.module';

import { MyProfileComponent } from './my-profile/my-profile.component';
import { WorkProfileComponent } from './work-profile/work-profile.component';
import { StaffAppointmentComponent } from './staff-appointment/staff-appointment.component';

import { DialogONTheWay } from './staff-appointment/staff-appointment.component';
import { DialogWorkStarted } from './staff-appointment/staff-appointment.component';
import { DialogInterrupted } from './staff-appointment/staff-appointment.component';
import { InterruptedReschedule } from './staff-appointment/staff-appointment.component';
import { DialogAddNewAppointment } from './staff-appointment/staff-appointment.component';
import { DialogNewAppointment } from './staff-appointment/staff-appointment.component';
import { DialogStaffMyAppointmentDetails } from './staff-appointment/staff-appointment.component';
import { MyWorkSpaceComponent } from './my-work-space/my-work-space.component';
import { OnGoingAppointmentDetails } from './staff-appointment/staff-appointment.component';
import { CompleteAppointmentDetails } from './staff-appointment/staff-appointment.component';

import { DialogCashPaymentMode } from './staff-appointment/staff-appointment.component';
import { DialogOnlinePaymentMode } from './staff-appointment/staff-appointment.component';
import { DialogCashPaymentDetails } from './staff-appointment/staff-appointment.component';
import { DialogOnlinePaymentDetails } from './staff-appointment/staff-appointment.component';

import { DialogStaffImageUpload } from './my-profile/my-profile.component';


@NgModule({
  declarations: [
		MyProfileComponent,
		WorkProfileComponent,
		StaffAppointmentComponent,
		DialogONTheWay,
		DialogWorkStarted,
		DialogInterrupted,
		InterruptedReschedule,
		DialogAddNewAppointment,
		DialogNewAppointment,
		DialogStaffMyAppointmentDetails,
		OnGoingAppointmentDetails,
		CompleteAppointmentDetails,
		MyWorkSpaceComponent,
		DialogCashPaymentMode,
		DialogOnlinePaymentMode,
		DialogCashPaymentDetails,
		DialogOnlinePaymentDetails,
		DialogStaffImageUpload
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    StaffRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    NgxChartsModule,
    ProgressBarModule,
    HighchartsChartModule
  ],
  exports: [
    FormsModule
  ],
  entryComponents: [DialogONTheWay,DialogWorkStarted,DialogInterrupted,
    InterruptedReschedule,DialogAddNewAppointment,DialogNewAppointment,
    DialogStaffMyAppointmentDetails,OnGoingAppointmentDetails,CompleteAppointmentDetails,
    DialogCashPaymentMode,DialogOnlinePaymentMode,DialogCashPaymentDetails,
    DialogOnlinePaymentDetails,DialogStaffImageUpload],
})
export class StaffModule { }
