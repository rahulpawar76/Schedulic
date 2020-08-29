import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ServicesComponent } from './services/services.component';
import { StaffComponent } from './staff/staff.component';
import { PaymentgatewayComponent } from './paymentgateway/paymentgateway.component';
import { PaymentrulesComponent } from './paymentrules/paymentrules.component';
import { BookingrulesComponent } from './bookingrules/bookingrules.component';
import { AlertsettingsComponent } from './alertsettings/alertsettings.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { AppearanceComponent } from './appearance/appearance.component';
import { PostalcodesComponent } from './postalcodes/postalcodes.component';
import { BusinessHoursComponent } from './business-hours/business-hours.component';
import { BillingComponent } from './billing/billing.component';
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
    path: 'payment-gateway',
   component: PaymentgatewayComponent 

  },
  {
    path: 'payment-rules',
   component: PaymentrulesComponent 

  },
  {
    path: 'booking-rules',
   component: BookingrulesComponent 

  },
  {
    path: 'alert-settings',
   component: AlertsettingsComponent 

  },

{
  path: 'company-details',
 component: CompanyDetailsComponent 

},
{
  path: 'appearance',
 component: AppearanceComponent 

},

{
  path: 'postalcode',
 component: PostalcodesComponent 

},

{
  path: 'business-hours',
 component: BusinessHoursComponent 

},
{
  path: 'billing',
 component: BillingComponent 

},



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminSettingsRoutingModule { }

