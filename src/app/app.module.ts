import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdePopoverModule } from '@material-extended/mde';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './_helpers/material.module';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';

import { AppComponent, DialogNotification } from './app.component';
import { LoginComponent } from './login';
import { AttendeesRegistrationComponent } from './attendees-registration'
import { LoaderComponent } from './_components/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from './_services/loader.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent } from './_components/confirmation-dialog/confirmation-dialog.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FrontbookingComponent } from './frontbooking/frontbooking.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



//import { UserappointmentsComponent } from './user-dashboard/userappointments/userappointments.component';
// import { DialogOverviewExampleDialog } from './user-dashboard/userappointments/userappointments.component';
// import { DialogInvoiceDialog } from './user-dashboard/userappointments/userappointments.component';
// //import { UserProfileComponent } from './user-dashboard/user-profile/user-profile.component';
// import { DialogMyAppointmentDetails } from './user-dashboard/userappointments/userappointments.component';
// import { DialogCancelAppointmentDetails } from './user-dashboard/userappointments/userappointments.component';
// import { DialogCompleteAppointmentDetails } from './user-dashboard/userappointments/userappointments.component';
//import { DialogUserImageUpload } from './user-dashboard/user-profile/user-profile.component';


// import { MyProfileComponent } from './staff-dashboard/my-profile/my-profile.component';
// import { WorkProfileComponent } from './staff-dashboard/work-profile/work-profile.component';
// import { StaffAppointmentComponent } from './staff-dashboard/staff-appointment/staff-appointment.component';

// import { DialogONTheWay } from './staff-dashboard/staff-appointment/staff-appointment.component';
// import { DialogWorkStarted } from './staff-dashboard/staff-appointment/staff-appointment.component';
// import { DialogInterrupted } from './staff-dashboard/staff-appointment/staff-appointment.component';
// import { InterruptedReschedule } from './staff-dashboard/staff-appointment/staff-appointment.component';
// import { DialogAddNewAppointment } from './staff-dashboard/staff-appointment/staff-appointment.component';
// import { DialogNewAppointment } from './staff-dashboard/staff-appointment/staff-appointment.component';
// import { DialogStaffMyAppointmentDetails } from './staff-dashboard/staff-appointment/staff-appointment.component';
// import { MyWorkSpaceComponent } from './staff-dashboard/my-work-space/my-work-space.component';
// import { OnGoingAppointmentDetails } from './staff-dashboard/staff-appointment/staff-appointment.component';
// import { CompleteAppointmentDetails } from './staff-dashboard/staff-appointment/staff-appointment.component';

// import { DialogCashPaymentMode } from './staff-dashboard/staff-appointment/staff-appointment.component';
// import { DialogOnlinePaymentMode } from './staff-dashboard/staff-appointment/staff-appointment.component';
// import { DialogCashPaymentDetails } from './staff-dashboard/staff-appointment/staff-appointment.component';
// import { DialogOnlinePaymentDetails } from './staff-dashboard/staff-appointment/staff-appointment.component';

// import { DialogStaffImageUpload } from './staff-dashboard/my-profile/my-profile.component';



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        AttendeesRegistrationComponent,
        LoaderComponent,
        ConfirmationDialogComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        FrontbookingComponent,
        DialogNotification,
<<<<<<< HEAD
        
=======
       
>>>>>>> aebc85f64426bf13bbfef5d35bcb7fac209df9e6
        ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatButtonModule,
        MdePopoverModule,
        MatRadioModule,
        MatCheckboxModule,
        NgbModule,
        MatButtonModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatRadioModule
    ],
    exports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        MatCheckboxModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatRadioModule
        
        
    ],
    providers: [ 
        LoaderService,        
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
    entryComponents: [ConfirmationDialogComponent,AppComponent,
    DialogNotification],
})

export class AppModule { }