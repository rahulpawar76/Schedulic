import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ServicesComponent } from './services/services.component';
import { StaffComponent } from './staff/staff.component';
import { PaymentsComponent } from './payments/payments.component';
import { PaymentgatewayComponent } from './paymentgateway/paymentgateway.component';
import { PaymentrulesComponent } from './paymentrules/paymentrules.component';
import { BookingrulesComponent } from './bookingrules/bookingrules.component';
import { AlertsettingsComponent } from './alertsettings/alertsettings.component';


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
    path: 'payment-gateway',
   component: PaymentgatewayComponent 

  },
  {
    path: 'payment-rules',
   component: PaymentrulesComponent 

  },
  {
    path: 'booking-rules',
   component: BookingrulesComponent 

  },
  {
    path: 'alert-settings',
   component: AlertsettingsComponent 

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminSettingsRoutingModule { }

