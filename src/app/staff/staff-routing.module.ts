import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { Role } from '@app/_models';
//import { AuthGuard } from '@app/_helpers';

import { MyProfileComponent } from './my-profile/my-profile.component';
import { WorkProfileComponent } from './work-profile/work-profile.component';
import { StaffAppointmentComponent } from './staff-appointment/staff-appointment.component';
import { MyWorkSpaceComponent } from './my-work-space/my-work-space.component';

const routes: Routes = [
  {
    path: '',
    component: MyWorkSpaceComponent
  },

  { 
    path: 'my-profile', 
    component: MyProfileComponent,
  },

  { 
    path: 'work-profile', 
    component: WorkProfileComponent,
  },

  { 
    path: 'my-appointment', 
    component: StaffAppointmentComponent,
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
