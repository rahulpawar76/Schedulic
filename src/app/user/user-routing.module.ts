import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { Role } from '@app/_models';
//import { AuthGuard } from '@app/_helpers';

import { UserappointmentsComponent } from './userappointments/userappointments.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: UserappointmentsComponent
  },

  { 
    path: 'my-profile', 
    component: UserProfileComponent,
    //canActivate: [AuthGuard]
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

export class UserRoutingModule { }
