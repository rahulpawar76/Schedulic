import { NgModule } from '@angular/core';
import { BrowserModule ,Title } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdePopoverModule } from '@material-extended/mde';
import { BnNgIdleService } from 'bn-ng-idle';
import { MaterialModule } from './_helpers/material.module';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxPayPalModule } from 'ngx-paypal';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider,GoogleLoginProvider } from 'angularx-social-login';
import { SharedModule } from './shared.module';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from './_services/loader.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md'
import { ConfirmationDialogComponent } from './_components/confirmation-dialog/confirmation-dialog.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { OnlinePaymentComponent } from './online-payment/online-payment.component';
import { SubscriptionComponent  } from './subscription/subscription.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DialogNotification, DialogLogoutAppointment, DialogNotificationAppointment, DialogReAuthentication } from './app.component';
import { DialogSubscriptionCardForm } from './subscription/subscription.component'
import { LoginComponent } from './login';
import { SignUpComponent } from './sign-up';
import { LoaderComponent } from './_components/loader/loader.component';
import { DialogAuthentication } from './_services/auth.component'
import { ResponsePageComponent } from './response-page/response-page.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
//import { GoogleMapsModule } from '@angular/google-maps'

registerLocaleData(localeDe);


const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("914032289146-jvjce30ps22vv85vp2285ag4heqe1kak.apps.googleusercontent.com")
    // provider: new GoogleLoginProvider("51939399095-dc6gpul854b6gba2712cdq1tjram4047.apps.googleusercontent.com")

  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('429862238554476')
    // provider: new FacebookLoginProvider('742513126584702')
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
        SignUpComponent,
        LoaderComponent,
        ConfirmationDialogComponent,
        ForgotPasswordComponent,
        SubscriptionComponent,
        ResetPasswordComponent,
        DialogNotification,
        DialogSubscriptionCardForm,
        DialogNotificationAppointment,
        DialogLogoutAppointment,
        OnlinePaymentComponent,
        DialogReAuthentication,
        DialogAuthentication,
        ResponsePageComponent,
        PaymentSuccessComponent
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
        SocialLoginModule,
        CarouselModule,
        WavesModule,
       // GoogleMapsModule
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
      DialogAuthentication,
    ],
})

export class AppModule { }