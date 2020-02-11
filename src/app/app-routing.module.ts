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

const routes: Routes = [
  {
    path: '', 
    component: FrontbookingComponent 
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
    path: 'user',
    //canActivate: [AuthGuard],
    loadChildren: () => import('./user/user.module').then(mod => mod.UserModule)
  },

  {
    path: 'staff',
    //canActivate: [AuthGuard],
    loadChildren: () => import('./staff/staff.module').then(mod => mod.StaffModule)
  },

  {
    path: 'admin',
    //canActivate: [AuthGuard],
    loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule)
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
