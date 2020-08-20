import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { AdminsComponent } from './admins/admins.component';
import { MySubscriptionsComponent } from './my-subscriptions/my-subscriptions.component';


@NgModule({
  declarations: [AdminsComponent, MySubscriptionsComponent],
  imports: [
    CommonModule,
    SuperAdminRoutingModule
  ]
})
export class SuperAdminModule { }
