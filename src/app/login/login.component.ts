import { Component, OnInit,AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { User, Role } from '../_models';
import { AppComponent } from '../app.component';
declare var google:any

@Component({ 
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    hide = true;
    hideLoginForm: boolean = true;
    dataLoaded: boolean = false;
    isIE: boolean = false;

    currentUser: User;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
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
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
        
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if(this.loginForm.invalid){
            this.loginForm.get('email').markAsTouched();
            this.loginForm.get('password').markAsTouched();

            return false;
        }
        this.dataLoaded = false;
        this.authenticationService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
        .pipe(first())
        .subscribe(
            data => {
                if(data.data == true){
                    
                    if(data.response.user_type == "A"){
                        this.router.navigate(["admin"]);
                    }else if(data.response.user_type == "SM"){
                        this.router.navigate(["staff"]);
                    }else{
                        this.router.navigate(["user"]);
                    }

                    this.appComponent.initiateTimeout();
                    this.hideLoginForm = false;
                    
                }else{
                    this.error = "Email or Password is incorrect"; 
                    this.dataLoaded = true;
                }
            },
            error => {  
                this.error = "Database Connection Error"; 
                this.dataLoaded = true;  
            });
    }
    forgotPassword(){
        this.router.navigate(['/forgot-password']);
    }
    
    signUp(event){
        this.router.navigate(["attendees-registration"]);
    }

    signInWithGoogle(): void {
        this.appComponent.signInWithGoogle(this.loginForm);
    }
}
