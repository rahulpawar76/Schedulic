import { NgModule } from '@angular/core';
import { BrowserModule ,Title } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdePopoverModule } from '@material-extended/mde';
import { SubscriptionComponent  } from './subscription/subscription.component'


import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './_helpers/material.module';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent, DialogNotification, DialogLogoutAppointment, DialogNotificationAppointment, DialogReAuthentication } from './app.component';
import { DialogAuthentication } from './_services/auth.component'
import { DialogSubscriptionCardForm } from './subscription/subscription.component'
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
//import { FrontbookingComponent } from './frontbooking/frontbooking.component';
import { FrontbookingComponent, theme2CartPopup,theme2DateTimeSelection,theme2CheckoutDialog } from './frontbooking/frontbooking.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxPayPalModule } from 'ngx-paypal';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider,GoogleLoginProvider } from 'angularx-social-login';
import { SharedModule } from './shared.module';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { OnlinePaymentComponent } from './online-payment/online-payment.component';
import { BnNgIdleService } from 'bn-ng-idle'; 
registerLocaleData(localeDe);


const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("51939399095-dc6gpul854b6gba2712cdq1tjram4047.apps.googleusercontent.com")

  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('742513126584702')
    //provider: new FacebookLoginProvider('2273509446292254')
  }
]);


export function provideConfig() {
  return config;
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        AttendeesRegistrationComponent,
        LoaderComponent,
        ConfirmationDialogComponent,
        ForgotPasswordComponent,
        SubscriptionComponent,
        ResetPasswordComponent,
        FrontbookingComponent,
        DialogNotification,
        DialogSubscriptionCardForm,
        DialogNotificationAppointment,
        theme2CartPopup,
        theme2CheckoutDialog,
        theme2DateTimeSelection,
        DialogLogoutAppointment,
        OnlinePaymentComponent,
        DialogReAuthentication,
        DialogAuthentication,
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
        MatRadioModule,
        SharedModule,
		NgxIntlTelInputModule,
        NgxPayPalModule,
        SocialLoginModule
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
        { provide: AuthServiceConfig, useFactory: provideConfig },
        BnNgIdleService,Title
        
    ],
    bootstrap: [AppComponent],
    entryComponents: [
      ConfirmationDialogComponent,
      AppComponent,
      DialogNotification,
      DialogLogoutAppointment,
      DialogNotificationAppointment,
      DialogReAuthentication,
      DialogSubscriptionCardForm,
      theme2CartPopup,
      theme2CheckoutDialog,
      theme2DateTimeSelection,
      DialogAuthentication,
    ],
})

export class AppModule { }