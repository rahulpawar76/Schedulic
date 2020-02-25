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


import { AdminRoutingModule } from './admin-routing.module';
import { MyBusinessComponent } from './my-business/my-business.component';
import { myCreateNewBusinessDialog } from './my-business';
import { MyWorkSpaceComponent } from './my-work-space/my-work-space.component';
import { myWorkSpaceAcceptDialog } from './my-work-space';
import { AppointmentComponent } from './appointment/appointment.component';
import { DataTablesModule } from 'angular-datatables';
import { DialogAddNewAppointment } from './appointment/appointment.component';
import { DialogNewAppointment } from './appointment/appointment.component';
import { CustomersComponent } from './customers/customers.component';
import { DialogNewCustomerAppointment } from './customers/customers.component';
import { DialogAddNewNote } from './customers/customers.component';
import { ReportsComponent } from './reports/reports.component';
import { AppointmentLiveComponent } from './appointment-live/appointment-live.component';

@NgModule({
  declarations: [
    MyBusinessComponent,
    myCreateNewBusinessDialog,
    MyWorkSpaceComponent,
    myWorkSpaceAcceptDialog,
    AppointmentComponent,
    DialogAddNewAppointment,
    DialogNewAppointment,
    CustomersComponent,
    DialogNewCustomerAppointment,
    DialogAddNewNote,
    ReportsComponent,
    AppointmentLiveComponent
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
    MatSidenavModule
  ],
  exports: [
    FormsModule
  ],
  entryComponents: [myCreateNewBusinessDialog,myWorkSpaceAcceptDialog,DialogAddNewAppointment,DialogNewAppointment,DialogNewCustomerAppointment,DialogAddNewNote],
})
export class AdminModule { }
