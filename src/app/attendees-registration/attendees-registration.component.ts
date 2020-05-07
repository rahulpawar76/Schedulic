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
			email: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
			phonenumber: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(onlynumeric)]],
			password: ['',[Validators.required,Validators.minLength(10)]],
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
	  
		  this.http.post(`${environment.apiUrl}/signup`,requestObject,{headers:headers} ).pipe(
			map((res) => {
			  return res;
			}),
			catchError(this.handleError)
			).subscribe((response:any) => {
			  if(response.data == true){
				this._snackBar.open("Account Succesfulli Created", "X", {
					duration: 2000,
					verticalPosition: 'top',
					panelClass : ['red-snackbar']
					});
			  }else{
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
		}
		
	}
	login(){
        this.router.navigate(["login"]);
	}

}
