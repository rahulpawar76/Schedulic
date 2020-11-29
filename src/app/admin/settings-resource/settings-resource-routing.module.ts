import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesComponent } from './services/services.component';
import { StaffComponent } from './staff/staff.component';
import { BusinessHoursComponent } from './business-hours/business-hours.component';
import { PostalcodesComponent } from './postalcodes/postalcodes.component';


const routes: Routes = [
  {
     path: '',
    component: ServicesComponent 

  },
  {
     path: 'services',
    component: ServicesComponent 

  },
  {
     path: 'staff',
    component: StaffComponent 

  },
  {
     path: 'business-hours',
    component: BusinessHoursComponent 

  },
  {
     path: 'postalcode',
    component: PostalcodesComponent 

  },
  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminSettingsResourceRoutingModule { }

