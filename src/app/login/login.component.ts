import { Component, OnInit,AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';

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
    dataLoaded: boolean = true;
    isIE: boolean = false;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private loaderService: LoaderService
    ) { 
        if(/msie\s|trident\//i.test(window.navigator.userAgent)){
            this.isIE = true;
        }
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
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
                if(data.status == "true"){
                    this.hideLoginForm = false;
                    localStorage.setItem('token',data.token);
                    this.router.navigate([this.returnUrl]);
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
}
