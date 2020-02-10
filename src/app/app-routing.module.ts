import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Role } from './_models';
import { AuthGuard } from './_helpers';
import { HomeComponent } from './home';
import { InviteAttendeesComponent } from './invite-attendees';
import { AttendeesRegistrationComponent } from './attendees-registration'
import { LoginComponent } from './login';
import { ForgotPasswordComponent } from './forgot-password';
import { ResetPasswordComponent } from './reset-password';
import { EmailTemplatesComponent } from './email-templates';
import { AddEmailTemplateComponent } from './add-email-template';
import { FrontbookingComponent } from './frontbooking';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
const routes: Routes = [
   {
     path: 'email',
     component: EmailTemplatesComponent,
     canActivate: [AuthGuard],     
     data: { roles: [Role.Admin] } 
   },
  {
     path: 'add-email',
     component: AddEmailTemplateComponent,
     canActivate: [AuthGuard],     
     data: { roles: [Role.Admin] } 
   },
  /*{
    path: '',
    pathMatch: 'full',
    redirectTo: 'maturity'
  },*/
   //{ path: '', component: HomeComponent },
  {
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: 'forgot-password', 
    component: ForgotPasswordComponent 
  },
  {
    path: 'reset-password', 
    component: ResetPasswordComponent 
  },
  {
    path: 'invite-attendees', 
    component: InviteAttendeesComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Manager, Role.Admin] } 
  },
  {
    path: 'attendees-registration', 
    component:  AttendeesRegistrationComponent,
  },
  {
    path: 'booking', 
    component:  FrontbookingComponent,
  },
  /*{
    path: 'attendees-registration/:accessToken', 
    component:  AttendeesRegistrationComponent,
  },
  {
    path: 'maturity',
    canActivate: [AuthGuard],
    loadChildren: () => import('./maturity/maturity.module').then(mod => mod.MaturityModule)
  },
  {
    path: 'risk',
    canActivate: [AuthGuard],
    loadChildren: () => import('./risk/risk.module').then(mod => mod.RiskModule)
  },
  {
    path: 'reporting',
    canActivate: [AuthGuard],
    loadChildren: () => import('./risk/reporting.module').then(mod => mod.ReportingModule)
  },*/
  {
    path: '**', 
    component: FrontbookingComponent 
  },
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
