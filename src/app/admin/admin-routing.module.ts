import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { Role } from '@app/_models';
//import { AuthGuard } from '@app/_helpers';

const routes: Routes = [
  /*{
    path: '',
    component: UserappointmentsComponent
  },

  { 
    path: 'my-profile', 
    component: UserProfileComponent,
  },*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
