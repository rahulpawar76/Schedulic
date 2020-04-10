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
import {MatSidenavModule} from '@angular/material/sidenav';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
  




import { AdminRoutingModule } from './admin-routing.module';
import { MyBusinessComponent } from './my-business/my-business.component';
import { myCreateNewBusinessDialog } from './my-business';
import { MyWorkSpaceComponent } from './my-work-space/my-work-space.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { DataTablesModule } from 'angular-datatables';
import { DialogAddNewAppointment } from './appointment/appointment.component';
import { DialogNewAppointment } from './appointment/appointment.component';
import { CustomersComponent } from './customers/customers.component';
import { DialogNewCustomerAppointment } from './customers/customers.component';
import { DialogAddNewNote } from './customers/customers.component';
import { ReportsComponent } from './reports/reports.component';
import { AppointmentLiveComponent } from './appointment-live/appointment-live.component';
import { DialogPaymentNote } from './customers/customers.component';
import { DialogViewReview } from './customers/customers.component';
import {DialogImportFileUpload} from './customers/customers.component';
import { DiscountCouponComponent } from './discount-coupon/discount-coupon.component';
import { InterruptedReschedule } from './my-work-space/my-work-space.component';
import { MyProfileComponent } from './settings-my-profile/settings-my-profile.component';
import { PendingAppointmentDetailsDialog } from './appointment-live/appointment-live.component';
import { NotAssignedAppointmentDetailsDialog } from './appointment-live/appointment-live.component';
import { OnTheWayAppointmentDetailsDialog } from './appointment-live/appointment-live.component';
import {WorkStartedAppointmentDetailsDialog} from './appointment-live/appointment-live.component';
import {DialogAllAppointmentDetails} from './appointment/appointment.component';
//import { IgxExcelExporterService } from "igniteui-angular";
import { DialogMyProfileImageUpload } from './settings-my-profile/settings-my-profile.component';
import { DialogCustomerImageUpload } from './customers/customers.component';

import { DialogCouponDetails } from './discount-coupon/discount-coupon.component';

import { CustomerAppointmentDetailsDialog } from './customers/customers.component';


@NgModule({
  declarations: [
    MyBusinessComponent,
    myCreateNewBusinessDialog,
    MyWorkSpaceComponent,
    AppointmentComponent,
    DialogAddNewAppointment,
    DialogNewAppointment,
    CustomersComponent,
    DialogNewCustomerAppointment,
    DialogAddNewNote,
    ReportsComponent,
    AppointmentLiveComponent,
    MyProfileComponent,
    DialogPaymentNote,
    DialogViewReview,
    DialogImportFileUpload,
    InterruptedReschedule,
    DiscountCouponComponent,
    DialogMyProfileImageUpload,
    DialogCustomerImageUpload,
    PendingAppointmentDetailsDialog,
    NotAssignedAppointmentDetailsDialog,
    OnTheWayAppointmentDetailsDialog,
    WorkStartedAppointmentDetailsDialog,
    DialogAllAppointmentDetails,
    DialogCouponDetails,
    CustomerAppointmentDetailsDialog
    ],
  imports: [
    CommonModule,
    HttpClientModule,
    AdminRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    NgxChartsModule,
    ProgressBarModule,
    HighchartsChartModule,
    DataTablesModule,
    MatSidenavModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  exports: [
    FormsModule
  ],
  providers: [ 
    // IgxExcelExporterService 
  ],
  entryComponents: [myCreateNewBusinessDialog,DialogAddNewAppointment,DialogNewAppointment,
    DialogNewCustomerAppointment,DialogAddNewNote,DialogPaymentNote,
    DialogViewReview,InterruptedReschedule,PendingAppointmentDetailsDialog,
    NotAssignedAppointmentDetailsDialog,OnTheWayAppointmentDetailsDialog,
    WorkStartedAppointmentDetailsDialog,DialogImportFileUpload,DialogMyProfileImageUpload,
    DialogCustomerImageUpload,DialogCouponDetails,CustomerAppointmentDetailsDialog],
})
export class AdminModule { }
