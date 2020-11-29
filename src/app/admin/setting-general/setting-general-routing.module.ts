import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AppearanceComponent } from './appearance/appearance.component';
import { BookingrulesComponent } from './bookingrules/bookingrules.component';
import { AlertsettingsComponent } from './alertsettings/alertsettings.component';

const routes: Routes = [
 

    {
      path: 'appearance',
     component: AppearanceComponent 
    
    },
    {
      path: 'booking-rules',
     component: BookingrulesComponent 
    
    },
    {
      path: 'alert-rules',
     component: AlertsettingsComponent 
    
    },
    
];
    
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

    
export class SettingGeneralRoutingModule { }