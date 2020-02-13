import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyBusinessComponent } from './my-business/my-business.component';

//import { Role } from '@app/_models';
//import { AuthGuard } from '@app/_helpers';

const routes: Routes = [
  {
    path: 'mybusiness',
    component: MyBusinessComponent
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
