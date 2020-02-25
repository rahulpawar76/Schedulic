import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyBusinessComponent } from './my-business/my-business.component';
import { MyWorkSpaceComponent } from './my-work-space/my-work-space.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { CustomersComponent } from './customers/customers.component';
<<<<<<< HEAD
import { ReportsComponent } from './reports/reports.component';
import { AppointmentLiveComponent } from './appointment-live/appointment-live.component';
=======
import { DiscountCouponComponent } from './discount-coupon/discount-coupon.component';
>>>>>>> aebc85f64426bf13bbfef5d35bcb7fac209df9e6

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
<<<<<<< HEAD
    path: 'my-reports',
    component: ReportsComponent 

  },
  {
    path: 'my-appointment-live',
    component: AppointmentLiveComponent 
=======
    path: 'my-discountcoupon',
    component: DiscountCouponComponent 
>>>>>>> aebc85f64426bf13bbfef5d35bcb7fac209df9e6

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
