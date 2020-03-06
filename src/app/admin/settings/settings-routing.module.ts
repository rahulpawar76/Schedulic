import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ServicesComponent } from './services/services.component';
import { StaffComponent } from './staff/staff.component';
import { PaymentsComponent } from './payments/payments.component';
import { PaymentgatewayComponent } from './paymentgateway/paymentgateway.component';
import { PaymentrulesComponent } from './paymentrules/paymentrules.component';
import { BookingrulesComponent } from './bookingrules/bookingrules.component';


const routes: Routes = [
  {
     path: '',
    component: ServicesComponent 

  },
  {
     path: 'services',
    component: ServicesComponent 

  },
  {
    path: 'staff',
   component: StaffComponent 

  },
  {
    path: 'payments',
   component: PaymentsComponent 

  },
  {
    path: 'paymentgateway',
   component: PaymentgatewayComponent 

  },
  {
    path: 'paymentrules',
   component: PaymentrulesComponent 

  },
  {
    path: 'bookingrules',
   component: BookingrulesComponent 

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminSettingsRoutingModule { }

