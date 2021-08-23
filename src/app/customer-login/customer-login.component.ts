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
    otpLoginForm: FormGroup;
    loading = false;
    submitted = false;
    otpShow = true;
    otpLogin = false;
    normalLogin = false;
    loginShow = false;
    returnUrl: string;
    error = '';
    hide = true;
    hideLoginForm: boolean = true;
    dataLoaded: boolean = false;
    isIE: boolean = false;
    phoneCodes :any=[];
    selectedPhoneCode: any;

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

        this.fngetPhoneCode();
        
        // this.boxOfficeId = this.route.snapshot.params.id;
        
        // this.urlString = window.location.search.split("?business_id="); 
        this.businessId = window.atob(decodeURIComponent(this.route.snapshot.params.id));
    }

    ngOnInit() {
        this.normalLogin = true;
        this.otpLogin = false;
        this.otpLoginForm = this.formBuilder.group({
            phone: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            password: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{3}")]]
        });

        let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
        this.loginForm = this.formBuilder.group({
            email: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
            password: ['', Validators.required]
        });
        
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        console.log(this.returnUrl)
    }
    // convenience getter for easy access to form fields
    get f() {
        if(this.normalLogin) {
            return this.loginForm.controls; 
        } else {
            return this.otpLoginForm.controls; 
        }
    }

    getOtp() {
        if(this.otpLoginForm.get('phone').valid) {
            this.loading = true;
            var phone = this.otpLoginForm.get('phone').value;
            phone = "+"+this.selectedPhoneCode+phone;
            let requestObject = {
                'phone' : phone,
                'business_id' : this.businessId,
                'country_code' : "+"+this.selectedPhoneCode
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
    }

    fnLoginType(event,logintype){
        this.dataLoaded = true;
        if(logintype == "otp"){
          this.otpLogin = true;
          this.normalLogin = false;
        }else{
            this.otpLogin = false;
            this.normalLogin = true;
        }
      }

      fngetPhoneCode(){
        this.authenticationService.getPhoneCode().subscribe((response:any) => {
            if(response.data == true){
                this.phoneCodes = response.response;
                this.selectedPhoneCode = "91";
            }
          });
      }

    onOTPSubmit() {
        this.submitted = true;
        if(this.otpLoginForm.invalid){
            this.otpLoginForm.get('phone').markAsTouched();
            this.otpLoginForm.get('password').markAsTouched();

            return false;
        }
        this.dataLoaded = false;
        var phone = this.otpLoginForm.get('phone').value;
        if(phone.length == 10) {
            phone = "+"+this.selectedPhoneCode+phone;
        }
        let requestObject = {
            'phone' : phone,
            'otp' : this.otpLoginForm.get('password').value,
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

    onSubmit() {
        this.submitted = true;
        if(this.loginForm.invalid){
            this.loginForm.get('email').markAsTouched();
            this.loginForm.get('password').markAsTouched();

            return false;
        }
        this.dataLoaded = false;
        let requestObject = {
            'email' : this.loginForm.get('email').value,
            'password' : this.loginForm.get('password').value,
            'business_id' : this.businessId,
        }
        this.authenticationService.customerLogin(requestObject)
        .pipe(first()).subscribe(data => {
            if(data.data == true){
                if(data.response.user_type == "C"){
                    this.router.navigate(["user"]);
                }else{
                   localStorage.removeItem('currentUser');
                   this.router.navigate(["customer-login"]);
                }

                // this.appComponent.initiateTimeout();
                this.hideLoginForm = false;
                
            }else if(data.data == false){

                this._snackBar.open(data.response, "X", {
                    duration: 2000,
                    verticalPosition:'top',
                    panelClass :['red-snackbar']
                    });
                this.error = data.response; 
                this.dataLoaded = true;

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

    forgotPassword(){
        this.router.navigate(['/forgot-password']);
    }
}
