import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Role } from './_models';
import { AuthGuard } from './_helpers';
import { SignUpComponent } from './sign-up'
import { LoginComponent } from './login';
import { ForgotPasswordComponent } from './forgot-password';
import { ResetPasswordComponent } from './reset-password';
import { OnlinePaymentComponent } from './online-payment';
import { SubscriptionComponent } from './subscription/subscription.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResponsePageComponent } from './response-page/response-page.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';

const routes: Routes = [
  {
    path: '', 
    component: LoginComponent 
  },
  {
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: 'forgot-password', 
    component: ForgotPasswordComponent 
  },
  {
    path: 'thank-you', 
    component: ResponsePageComponent 
  },
  {
    path: 'reset-password', 
    component: ResetPasswordComponent 
  },
  {
    path: 'sign-up', 
    component:  SignUpComponent,
  },
  {
    path: 'online-payment', 
    component:  OnlinePaymentComponent,
  },
  {
    path: 'admin-select-subscription', 
    component:  SubscriptionComponent,
  },
  {
    path: 'payment-success', 
    component:  PaymentSuccessComponent,
  },
  {
    path: 'staff',
    canActivate: [AuthGuard],
    data: {roles: Role.Staff},
    loadChildren: () => import('./staff/staff.module').then(mod => mod.StaffModule)
  },

  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: {roles: Role.Admin},
    loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule)
  },
  { 
    path: 'super-admin', 
    canActivate: [AuthGuard],
    data: {roles: Role.SuperAdmin},
    loadChildren: () => import('./super-admin/super-admin.module').then(m => m.SuperAdminModule) },
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule { }
