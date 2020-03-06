import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ServicesComponent } from './services/services.component';
import { StaffComponent } from './staff/staff.component';
import { PaymentsComponent } from './payments/payments.component';
import { PaymentgatewayComponent } from './paymentgateway/paymentgateway.component';
import { PaymentrulesComponent } from './paymentrules/paymentrules.component';
import { BookingrulesComponent } from './bookingrules/bookingrules.component';
import { SettingsMyProfileComponent } from './settings-my-profile/settings-my-profile.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { AppearanceComponent } from './appearance/appearance.component';
import { PostalcodesComponent } from './postalcodes/postalcodes.component';
//import{AccountComponent} from './account/account.component';
//import { GeneralSettingComponent } from './general-setting/general-setting.component';


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
    path: 'payments',
   component: PaymentsComponent 
 },
 {
  path: 'setting-my-profile',
 component: SettingsMyProfileComponent 

  },
  {
    path: 'paymentgateway',
   component: PaymentgatewayComponent 
},

  },
  {
    path: 'paymentrules',
   component: PaymentrulesComponent 
{
  path: 'company-details',
 component: CompanyDetailsComponent 

  },
  {
    path: 'bookingrules',
   component: BookingrulesComponent 
},
{
  path: 'appearance',
 component: AppearanceComponent 

},

{
  path: 'postalcode',
 component: PostalcodesComponent 

},

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminSettingsRoutingModule { }

