import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Role } from '@app/_models';
import { AuthGuard } from '@app/_helpers';

import { MyBusinessComponent } from './my-business/my-business.component';
import { MyWorkSpaceComponent } from './my-work-space/my-work-space.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { CustomersComponent } from './customers/customers.component';
import { MyProfileComponent } from './settings-my-profile/settings-my-profile.component';
import { ReportsComponent } from './reports/reports.component';
import { AppointmentLiveComponent } from './appointment-live/appointment-live.component';
import { DiscountCouponComponent } from './discount-coupon/discount-coupon.component';
import { SupportComponent } from './support/support.component';

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
   path: 'my-profile',
  component: MyProfileComponent 
 
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
    path: 'support',
    component: SupportComponent 

  },
  // {
  //   path: 'settings',
  //   canActivate: [AuthGuard],
  //   data: {roles: Role.Admin},
  //   loadChildren: () => import('./settings/settings.module').then(mod => mod.SettingsModule)
  // },

  {
    path: 'settings-account',
    canActivate: [AuthGuard],
    data: {roles: Role.Admin},
    loadChildren: () => import('./settings-account/settings-account.module').then(mod => mod.SettingsAccountModule)
  },
  {
    path: 'settings-resource',
    canActivate: [AuthGuard],
    data: {roles: Role.Admin},
    loadChildren: () => import('./settings-resource/settings-resource.module').then(mod => mod.SettingsResourceModule)
  },
  {
    path: 'settings-payment',
    canActivate: [AuthGuard],
    data: {roles: Role.Admin},
    loadChildren: () => import('./setting-payment/setting-payment.module').then(mod => mod.SettingPaymentModule)
  },
  {
    path: 'settings-general',
    canActivate: [AuthGuard],
    data: {roles: Role.Admin},
    loadChildren: () => import('./setting-general/setting-general.module').then(mod => mod.SettingGeneralModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
