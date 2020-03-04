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



@NgModule({
  declarations: [
    ServicesComponent,
    SettingsComponent,
    StaffComponent,
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
      DataTablesModule
  ],
  exports: [
    FormsModule
  ],
   entryComponents: [SettingsComponent],
})
export class SettingsModule { }
