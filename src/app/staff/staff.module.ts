import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBarModule } from "angular-progress-bar";
import { HighchartsChartModule } from 'highcharts-angular';

import { MaterialModule } from '@app/_helpers/material.module';

import { StaffRoutingModule } from './staff-routing.module';

import { MyProfileComponent } from './my-profile/my-profile.component';
import { WorkProfileComponent } from './work-profile/work-profile.component';
import { MyBookingComponent } from './my-booking/my-booking.component';

import { DialogONTheWay } from './my-booking/my-booking.component';
import { DialogWorkStarted } from './my-booking/my-booking.component';
import { DialogInterrupted } from './my-booking/my-booking.component';
import { InterruptedReschedule } from './my-booking/my-booking.component';
import { DialogAddNewAppointment } from './my-booking/my-booking.component';
// import { DialogNewAppointment } from './staff-appointment/staff-appointment.component';
import { DialogStaffMyAppointmentDetails } from './my-booking/my-booking.component';
import { MyWorkSpaceComponent } from './my-work-space/my-work-space.component';
import { OnGoingAppointmentDetails } from './my-booking/my-booking.component';
import { CompleteAppointmentDetails } from './my-booking/my-booking.component';

import { DialogCashPaymentMode } from './my-booking/my-booking.component';
import { DialogOnlinePaymentMode } from './my-booking/my-booking.component';
import { DialogCashPaymentDetails } from './my-booking/my-booking.component';
import { DialogOnlinePaymentDetails } from './my-booking/my-booking.component';
import { DialogGettingLate } from './my-booking/my-booking.component';
import { DialogTodayAppointmentDetail } from './my-work-space/my-work-space.component';

import { DialogStaffImageUpload } from './my-profile/my-profile.component';
import { DialogStaffDashBGUpload } from './my-work-space/my-work-space.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    MyProfileComponent,
    WorkProfileComponent,
    MyBookingComponent,
    DialogONTheWay, 
    DialogWorkStarted,
    DialogInterrupted,
    InterruptedReschedule,
    DialogAddNewAppointment,
    // DialogNewAppointment,
    DialogStaffMyAppointmentDetails,
    OnGoingAppointmentDetails,
    CompleteAppointmentDetails,
    MyWorkSpaceComponent,
    DialogCashPaymentMode,
    DialogOnlinePaymentMode,
    DialogCashPaymentDetails,
    DialogOnlinePaymentDetails,
    DialogStaffImageUpload,
    DialogTodayAppointmentDetail,
    DialogStaffDashBGUpload,
    DialogGettingLate
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
    HighchartsChartModule,
    SharedModule
  ],
  exports: [
    FormsModule
  ],
  entryComponents: [DialogONTheWay, DialogWorkStarted, DialogInterrupted,
    InterruptedReschedule, DialogAddNewAppointment,
    DialogStaffMyAppointmentDetails, OnGoingAppointmentDetails, CompleteAppointmentDetails,
    DialogCashPaymentMode, DialogOnlinePaymentMode, DialogCashPaymentDetails,
    DialogOnlinePaymentDetails, DialogStaffImageUpload, DialogTodayAppointmentDetail, DialogStaffDashBGUpload, DialogGettingLate],
})
export class StaffModule { }
