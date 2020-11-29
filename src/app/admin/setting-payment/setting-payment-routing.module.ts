import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentgatewayComponent } from './paymentgateway/paymentgateway.component';
import { BillingComponent } from './billing/billing.component';
import { PaymentrulesComponent } from './paymentrules/paymentrules.component';



const routes: Routes = [
 

    {
      path: 'payment-gateway',
     component: PaymentgatewayComponent 
    
    },
    {
      path: 'billing',
     component: BillingComponent 
    
    },
    {
      path: 'payment-rules',
     component: PaymentrulesComponent 
    
    },
    
    
    
    
    ];
    
    @NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    })

    
export class SettingPaymentRoutingModule { }