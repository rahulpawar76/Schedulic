import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Role } from './_models';
import { AuthGuard } from './_helpers';
import { AttendeesRegistrationComponent } from './attendees-registration'
import { LoginComponent } from './login';
import { ForgotPasswordComponent } from './forgot-password';
import { ResetPasswordComponent } from './reset-password';
import { FrontbookingComponent } from './frontbooking';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UserappointmentsComponent } from './userappointments';
import { UserProfileComponent } from './user-profile';
import { MyProfileComponent } from './staff-dashboard/my-profile';
import { WorkProfileComponent } from './staff-dashboard/work-profile';
import { StaffAppointmentComponent } from './staff-dashboard/staff-appointment';
import { MyWorkSpaceComponent } from './staff-dashboard/my-work-space';


const routes: Routes = [
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
    path: 'attendees-registration', 
    component:  AttendeesRegistrationComponent,
  },
  {
    path: 'booking', 
    component:  FrontbookingComponent,
  },

  {
    path: 'user-profile', 
    component:  UserProfileComponent,
  },

   {
    path: 'staff-profile', 
    component:  MyProfileComponent,
  },
  
   {
    path: 'user-appointment', 
    component:  UserappointmentsComponent,
  },

  {
    path: 'staff-appointment', 
    component:  StaffAppointmentComponent,
  },
  
  {
    path: 'work-profile', 
    component:  WorkProfileComponent,
  },
  
  {
    path: 'my-work-space', 
    component:  MyWorkSpaceComponent,
  },

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
