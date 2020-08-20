import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminsComponent } from './admins/admins.component';

const routes: Routes = [{ path: '', component: AdminsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
