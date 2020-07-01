import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router, RouterOutlet ,ActivatedRoute} from '@angular/router';
import { environment } from '@environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import decode from 'jwt-decode';

@Component({
  selector: 'app-attendees-registration',
  templateUrl: './attendees-registration.component.html',
  styleUrls: ['./attendees-registration.component.scss']
})
export class AttendeesRegistrationComponent implements OnInit {

	signUpForm: FormGroup;
    dataLoaded: boolean = false;

  	constructor(private _formBuilder: FormBuilder,
  		private _snackBar: MatSnackBar,
		private http: HttpClient,
  		public router: Router,
  		private route: ActivatedRoute) { 

		let emailPattern= /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
		let onlynumeric = /^-?(0|[1-9]\d*)?$/

		this.signUpForm = this._formBuilder.group({
			firstName: ['',[Validators.required]],
			lastName: ['',[Validators.required]],
			email: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)],this.isEmailUnique.bind(this)],
			phonenumber: ['',[Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(onlynumeric)]],
			password: ['',[Validators.required,Validators.minLength(8)]],
		});

  		  	}

	 ngOnInit() {
		
	 	
	}
	private handleError(error: HttpErrorResponse) {
		return throwError('Error! something went wrong.');
		//return error.error ? error.error : error.statusText;
	  }
	signUpSubmit(){
		if(this.signUpForm.valid){
			let requestObject = {
				"firstname":this.signUpForm.get("firstName").value,
				"lastname":this.signUpForm.get("lastName").value,
				"phone":this.signUpForm.get("phonenumber").value,
				"email":this.signUpForm.get("email").value,
				"password":this.signUpForm.get("password").value,
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
			  if(response.data == true){
				this._snackBar.open("Account Succesfully Created", "X", {
					duration: 2000,
					verticalPosition: 'top',
					panelClass : ['green-snackbar']
					});
					this.dataLoaded = false;
					this.router.navigate(["login"]);
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
			this.signUpForm.get("firstName").markAsTouched();
			this.signUpForm.get("lastName").markAsTouched();
			this.signUpForm.get("phonenumber").markAsTouched();
			this.signUpForm.get("email").markAsTouched();
			this.signUpForm.get("password").markAsTouched();
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

}
