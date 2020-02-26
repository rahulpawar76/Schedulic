import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Role } from '@app/_models';
import { AuthGuard } from '@app/_helpers';

import { MyBusinessComponent } from './my-business/my-business.component';
import { MyWorkSpaceComponent } from './my-work-space/my-work-space.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { CustomersComponent } from './customers/customers.component';
import { ReportsComponent } from './reports/reports.component';
import { AppointmentLiveComponent } from './appointment-live/appointment-live.component';
import { DiscountCouponComponent } from './discount-coupon/discount-coupon.component';

//import { Role } from '@app/_models';
//import { AuthGuard } from '@app/_helpers';

const routes: Routes = [
  {
    path: '',
    component: MyBusinessComponent

  }, 
  {
    path: 'my-business',
    component: MyBusinessComponent
  }, 
  {
    path: 'my-workspace',
    component: MyWorkSpaceComponent
  }, 
  {
    path: 'my-appointment',
    component: AppointmentComponent
  },
  {
    path: 'my-customer',
    component: CustomersComponent 

  },
  {
    path: 'my-reports',
    component: ReportsComponent 

  },
  {
    path: 'my-appointment-live',
    component: AppointmentLiveComponent 
    
  },
  {
    path: 'my-discountcoupon',
    component: DiscountCouponComponent 

  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    data: {roles: Role.Admin},
    loadChildren: () => import('./settings/settings.module').then(mod => mod.SettingsModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
