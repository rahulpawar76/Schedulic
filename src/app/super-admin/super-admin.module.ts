import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { AdminsComponent } from './admins/admins.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MySubscriptionsComponent } from './my-subscriptions/my-subscriptions.component';


@NgModule({
  declarations: [AdminsComponent, MySubscriptionsComponent],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class SuperAdminModule { }
