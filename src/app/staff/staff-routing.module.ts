import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Role } from '@app/_models';
import { AuthGuard } from '@app/_helpers';

import { MyProfileComponent } from './my-profile/my-profile.component';
import { WorkProfileComponent } from './work-profile/work-profile.component';
import { MyBookingComponent } from './my-booking/my-booking.component';
import { MyWorkSpaceComponent } from './my-work-space/my-work-space.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {roles: Role.Staff},
    component: MyWorkSpaceComponent
  },
  {
    path: 'staff',
    canActivate: [AuthGuard],
    data: {roles: Role.Staff},
    component: MyWorkSpaceComponent
  },

  { 
    path: 'my-profile', 
    canActivate: [AuthGuard],
    data: {roles: Role.Staff},
    component: MyProfileComponent,
  },

  { 
    path: 'work-profile', 
    canActivate: [AuthGuard],
    data: {roles: Role.Staff},
    component: WorkProfileComponent,
  },

  { 
    path: 'my-bookings', 
    canActivate: [AuthGuard],
    data: {roles: Role.Staff},
    component: MyBookingComponent,
  },
  // { 
  //   path: 'improvement-focus-area/overview', 
  //   component: OverviewComponent,
  //   canActivate: [AuthGuard],
  //   data: { roles: [Role.Manager, Role.Admin] } 
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class StaffRoutingModule { }
