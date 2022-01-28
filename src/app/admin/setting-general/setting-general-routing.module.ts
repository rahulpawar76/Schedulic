import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingrulesComponent } from './bookingrules/bookingrules.component';
import { AlertsettingsComponent } from './alertsettings/alertsettings.component';

const routes: Routes = [
 
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