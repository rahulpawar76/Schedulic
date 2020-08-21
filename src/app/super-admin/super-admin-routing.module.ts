import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminsComponent } from './admins/admins.component';
import { MySubscriptionsComponent } from './my-subscriptions/my-subscriptions.component';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component'
import { MyProfileComponent } from './my-profile/my-profile.component'

const routes: Routes = [
  { 
    path: '',
    component: AdminsComponent 
  },
  { 
    path: 'my-subscriptions',
    component: MySubscriptionsComponent 
  },
  { 
    path: 'my-transactions',
    component: MyTransactionsComponent 
  },
  { 
    path: 'my-profile',
    component: MyProfileComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
