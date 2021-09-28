import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router, RouterOutlet ,ActivatedRoute} from '@angular/router';
import { environment } from '@environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import decode from 'jwt-decode';
import { AppComponent } from '../app.component';
import { AuthenticationService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

	signUpForm: FormGroup;
	loginForm: FormGroup;
    dataLoaded: boolean = false;
	currentUser: any;
	adminSignUpData:any;
    hide = true;
    hide1 = true;
	termsCheckbox:boolean = true;
	termsCheckboxChecked:boolean = false;
    error = '';

  	constructor(private _formBuilder: FormBuilder,
  		private _snackBar: MatSnackBar,
		private http: HttpClient,
  		public router: Router,
  		private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private appComponent:AppComponent,) { 

		let emailPattern= /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
		let onlynumeric = /^-?(0|[1-9]\d*)?$/

		this.signUpForm = this._formBuilder.group({
			fullname: ['',[Validators.required]],
			email: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)],this.isEmailUnique.bind(this)],
			password: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
			cpassword: ['',[Validators.required]]            
		},{validator: this.checkPasswords });
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		if (this.authenticationService.currentUserValue) {
            this.appComponent.fnCheckLoginStatus();
        }else{
            this.appComponent.fnCheckAuthState();
        }

	}

	 ngOnInit() {
		
	 	
	}
	
	/* Check password and confirm password */
	checkPasswords(group: FormGroup) { 
		let pass = group.controls.password.value;
		let confirmPass = group.controls.cpassword.value;

		return pass === confirmPass ? null : { notSame: true }
	}
	private handleError(error: HttpErrorResponse) {
		return throwError('Error! something went wrong.');
		//return error.error ? error.error : error.statusText;
	  }
	signUpSubmit(){
		if(!this.termsCheckboxChecked){
			this.termsCheckbox = false;
		}
		if(!this.termsCheckboxChecked){
			this.termsCheckbox = false;
			return false;
		}
		if(this.signUpForm.valid){
			let fullname = this.signUpForm.get("fullname").value.split(' ',2)
			let requestObject = {
				"firstname":fullname[0],
				"lastname":fullname[1]?fullname[1]:"",
				"email":this.signUpForm.get("email").value,
				"password":this.signUpForm.get("cpassword").value,
			};
			let headers = new HttpHeaders({
				'Content-Type': 'application/json',
			});
			this.dataLoaded = true;
		  this.http.post(`${environment.apiUrl}/signup`,requestObject,{headers:headers} ).pipe(
			map((res) => {
			  return res;
			}),
			catchError(this.handleError)
			).subscribe((response:any) => {
				this.adminSignUpData = JSON.stringify(response.response)

				localStorage.setItem('adminData',this.adminSignUpData)
			  if(response.data == true){
				this._snackBar.open("Account Succesfully Created", "X", {
					duration: 2000,
					verticalPosition: 'top',
					panelClass : ['green-snackbar']
				});
					this.dataLoaded = false;
					// this.router.navigate(["admin-select-subscription"]);
					this.fnLogin(this.signUpForm.get("email").value, this.signUpForm.get("cpassword").value);
			  }else{
				this.dataLoaded = false;
				this._snackBar.open(response.response, "X", {
					duration: 2000,
					verticalPosition: 'top',
					panelClass : ['red-snackbar']
					});
			  }
			  
			},
			(err) =>{
			  console.log(err)
			})
		}else{
			this.signUpForm.get("fullname").markAsTouched();
			this.signUpForm.get("email").markAsTouched();
			this.signUpForm.get("password").markAsTouched();
			this.signUpForm.get("cpassword").markAsTouched();
		}
	}
	login(){
        this.router.navigate(["login"]);
	}
	isEmailUnique(control: FormControl) {
		return new Promise((resolve, reject) => {
		  setTimeout(() => {
			let headers = new HttpHeaders({
			  'Content-Type': 'application/json',
			});
			return this.http.post(`${environment.apiUrl}/verify-email`,{ emailid: control.value },{headers:headers}).pipe(map((response : any) =>{
			  return response;
			}),
			catchError(this.handleError)).subscribe((res) => {
			  if(res){
				if(res.data == false){
				resolve({ isEmailUnique: true });
				}else{
				resolve(null);
				}
			  }
			});
		  }, 500);
		});
	  }

    signInWithGoogle(): void {
        this.appComponent.signInWithGoogle(this.loginForm);
    }
    signInWithFB(): void {
        this.appComponent.signInWithFB(this.loginForm);
    }
		
	fnChangeTermsPrivacyCheck(check){
		this.termsCheckboxChecked = check;
		this.termsCheckbox = check;
	}

	
    fnLogin(email, password) {
        this.dataLoaded = true;
        this.authenticationService.login(email, password)
        .pipe(first()).subscribe(data => {

            if(data.data == true){

                if(data.response.user_type == "A"){
                    this.router.navigate(["admin"]);
                }else if(data.response.user_type == "SM"){
                    localStorage.setItem('internal_staff','N');
                    this.router.navigate(["staff"]);
                }
                
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
			this.dataLoaded =false;
        },
        error => {  
            this.error = "Database Connection Error."; 
            this.dataLoaded = true;  
        });
    }

}
