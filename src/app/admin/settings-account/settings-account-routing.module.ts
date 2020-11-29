import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Role } from '@app/_models';
import { AuthGuard } from '@app/_helpers';


import { CompanyDetailsComponent } from './company-details/company-details.component';


const routes: Routes = [
 

{
  path: 'company-details',
 component: CompanyDetailsComponent 

},




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminSettingsAccountRoutingModule { }

