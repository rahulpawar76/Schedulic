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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AdminRoutingModule } from './admin-routing.module';
import { MyBusinessComponent } from './my-business/my-business.component';
import { myCreateNewBusinessDialog } from './my-business';
import { MyWorkSpaceComponent } from './my-work-space/my-work-space.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { DialogAddNewAppointment } from './appointment/appointment.component';
import { CustomersComponent } from './customers/customers.component';
import { DialogInvoiceDialog } from './customers/customers.component';
import { DialogNewCustomerAppointment } from './customers/customers.component';
import { DialogAddNewNote } from './customers/customers.component';
import { ReportsComponent } from './reports/reports.component';
import { AppointmentLiveComponent,RescheduleAppointment } from './appointment-live/appointment-live.component';
import { DialogPaymentNote } from './customers/customers.component';
import { DialogViewReview } from './customers/customers.component';
import {DialogImportFileUpload} from './customers/customers.component';
import {DialogImportServiceUpload} from './settings-resource/services/services.component';
import { DiscountCouponComponent } from './discount-coupon/discount-coupon.component';
import { InterruptedReschedule, dateRangeSelectDialog } from './my-work-space/my-work-space.component';
import { InterruptedReschedulecustomer } from './customers/customers.component';
import { RescheduleAppointAdmin } from './appointment/appointment.component';
import { MyProfileComponent } from './settings-my-profile/settings-my-profile.component';
import { OnTheWayAppointmentDetailsDialog, WorkStartedAppointmentDetailsDialog, PendingAppointmentDetailsDialog, addPOSBookingNoteDialog, paymentModeDialog, DialogNotification, DialogNotificationAppointment, addPOSCouponDialog } from './appointment-live/appointment-live.component';
import {DialogAllAppointmentDetails} from './appointment/appointment.component';
import { DialogMyProfileImageUpload } from './settings-my-profile/settings-my-profile.component';
import { DialogCustomerImageUpload } from './customers/customers.component';
import { SharedModule } from '../shared.module';
import { DialogCouponDetails } from './discount-coupon/discount-coupon.component';
import { CustomerAppointmentDetailsDialog } from './customers/customers.component';
import { SupportComponent } from './support/support.component';
import { AgmCoreModule } from '@agm/core';            // @agm/core
import { AgmDirectionModule } from 'agm-direction';   // agm-direction
import { environment } from '@environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';


@NgModule({
  declarations: [
    MyBusinessComponent,
    myCreateNewBusinessDialog,
    MyWorkSpaceComponent,
    AppointmentComponent,
    DialogAddNewAppointment,
    CustomersComponent,
    DialogInvoiceDialog,
    DialogNewCustomerAppointment,
    DialogAddNewNote,
    ReportsComponent,
    AppointmentLiveComponent,
    MyProfileComponent,
    DialogPaymentNote,
    DialogViewReview,
    DialogImportFileUpload,
    DialogImportServiceUpload,
    InterruptedReschedule,
    InterruptedReschedulecustomer,
    RescheduleAppointAdmin,
    DiscountCouponComponent,
    DialogMyProfileImageUpload,
    DialogCustomerImageUpload,
    PendingAppointmentDetailsDialog,
    addPOSBookingNoteDialog,
    addPOSCouponDialog,
    paymentModeDialog,
    DialogNotification, 
    DialogNotificationAppointment,
    WorkStartedAppointmentDetailsDialog,
    OnTheWayAppointmentDetailsDialog,
    RescheduleAppointment,
    DialogAllAppointmentDetails,
    DialogCouponDetails,
    CustomerAppointmentDetailsDialog,
    SupportComponent,
    dateRangeSelectDialog,
    //DialogReAuthentication,
    ],
  imports: [
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: environment.googleMapAPIKey,
    }),
    AgmDirectionModule,    
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
    MatSidenavModule,
    NgxDaterangepickerMd.forRoot(),
    SharedModule,
    NgxMatSelectSearchModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, 
    //GoogleMapsModule
  ],
  exports: [
    FormsModule
  ],
  providers: [ 
    // IgxExcelExporterService 
  ],
  entryComponents: [myCreateNewBusinessDialog,DialogAddNewAppointment,
    DialogNewCustomerAppointment,DialogAddNewNote,DialogPaymentNote,
    DialogViewReview,InterruptedReschedule,InterruptedReschedulecustomer,RescheduleAppointAdmin,PendingAppointmentDetailsDialog,addPOSBookingNoteDialog,addPOSCouponDialog,paymentModeDialog,DialogNotification, DialogNotificationAppointment,
    WorkStartedAppointmentDetailsDialog,OnTheWayAppointmentDetailsDialog,
    DialogImportFileUpload,DialogImportServiceUpload,DialogMyProfileImageUpload,DialogAllAppointmentDetails,
    DialogCustomerImageUpload,DialogCouponDetails,CustomerAppointmentDetailsDialog,RescheduleAppointment,DialogInvoiceDialog,dateRangeSelectDialog],
})
export class AdminModule { }

