import { Component, OnInit,AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { User, Role } from '../_models';
import { AppComponent } from '../app.component';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var google:any

@Component({ 
    selector: 'customer-login',
    templateUrl: 'customer-login.component.html',
    styleUrls: ['customer-login.component.scss']
})

export class CustomerLoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    otpShow = true;
    loginShow = false;
    returnUrl: string;
    error = '';
    hide = true;
    hideLoginForm: boolean = true;
    dataLoaded: boolean = false;
    isIE: boolean = false;

    currentUser: User;
    businessId:any;
    urlString: any;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private _snackBar: MatSnackBar,
        private authenticationService: AuthenticationService,
        private loaderService: LoaderService,
        private appComponent:AppComponent,
    ) { 
        if(/msie\s|trident\//i.test(window.navigator.userAgent)){
            this.isIE = true;
        }
        // redirect to home if already logged in
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
       
        if (this.authenticationService.currentUserValue) {
            this.appComponent.fnCheckLoginStatus();
        }else{
            this.dataLoaded=true;
            this.appComponent.fnCheckAuthState();
        }
        
        // this.boxOfficeId = this.route.snapshot.params.id;
        
        // this.urlString = window.location.search.split("?business_id="); 
        this.businessId = window.atob(decodeURIComponent(this.route.snapshot.params.id));
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            phone: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            password: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{3}")]]
        });
        
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        console.log(this.returnUrl)
    }
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    getOtp() {
        this.loading = true;
        var phone = this.loginForm.get('phone').value;
        console.log(phone.length);
        if(phone.length == 10) {
            phone = "+91"+phone;
        }
        let requestObject = {
            'phone' : phone,
            'business_id' : this.businessId,
            'country_code' : '+91'
        }
        this.authenticationService.getOtp(requestObject).pipe(first()).subscribe(data => {
            if(data.data == true){
                this.loginShow = true;
                this.loading = false;
                this.otpShow = false;                
            }else if(data.data == false){

                console.log(data.data);

            }  else{
                this.error = "Database Connection Error."; 
                this.dataLoaded = true;
            }

        },
        error => {  
            this.error = "Database Connection Error."; 
            this.dataLoaded = true;  
        });

    }

    onSubmit() {
        this.submitted = true;
        if(this.loginForm.invalid){
            this.loginForm.get('phone').markAsTouched();
            this.loginForm.get('password').markAsTouched();

            return false;
        }
        this.dataLoaded = false;
        var phone = this.loginForm.get('phone').value;
        console.log(phone.length);
        if(phone.length == 10) {
            phone = "+91"+phone;
        }
        let requestObject = {
            'phone' : phone,
            'otp' : this.loginForm.get('password').value,
            'business_id' : this.businessId,
        }
        console.log(requestObject);
        this.authenticationService.verifyOtp(requestObject)
        .pipe(first()).subscribe(data => {
            if (data.data == true) {
                if (data.response.data) {
                    this.router.navigate(['/user/appointments']);
                } else {
                   localStorage.removeItem('currentUser');
                   this.router.navigate(["customer-login"]);
                }
                this.hideLoginForm = false;
                this.loginShow = true;
                this.loading = false;
                this.otpShow = false;
            } else if(data.data == false){
                this._snackBar.open(data.response, "X", {
                    duration: 2000,
                    verticalPosition:'top',
                    panelClass :['red-snackbar']
                    });
                this.error = data.response; 
                this.dataLoaded = true;
            }
        },
        error => {  
            this.error = "Database Connection Error."; 
            this.dataLoaded = true;  
        });
    }

    forgotPassword(){
        this.router.navigate(['/forgot-password']);
    }
}
