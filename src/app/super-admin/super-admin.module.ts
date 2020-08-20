import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { AdminsComponent } from './admins/admins.component';


@NgModule({
  declarations: [AdminsComponent],
  imports: [
    CommonModule,
    SuperAdminRoutingModule
  ]
})
export class SuperAdminModule { }
