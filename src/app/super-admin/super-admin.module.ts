import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/_helpers/material.module';
import { HttpClientModule } from '@angular/common/http';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { AdminsComponent } from './admins/admins.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import { MySubscriptionsComponent, DialogAddNewPlan } from './my-subscriptions/my-subscriptions.component';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component';
import { MyProfileComponent, DialogMyProfileImageUpload } from './my-profile/my-profile.component';


@NgModule({
  declarations: [AdminsComponent, MySubscriptionsComponent, MyTransactionsComponent, MyProfileComponent, DialogMyProfileImageUpload, DialogAddNewPlan],
  imports: [
    CommonModule,
    MaterialModule,
    SuperAdminRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    HttpClientModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormsModule
  ],
  entryComponents: [DialogMyProfileImageUpload, DialogAddNewPlan],

})
export class SuperAdminModule { }
