import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })

export class UserService {
  constructor(private http: HttpClient,private _snackBar: MatSnackBar) { }   



private handleError(error: HttpErrorResponse) {
	console.log(error);
    return throwError('Error! something went wrong.');
  }

	getUserProfileData() {
		let requestObject = {
			"customer_id":"36"
			};
			let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			});
			return this.http.post(`${environment.apiUrl}/customer-profile`,requestObject,{headers:headers}).pipe(
			map((res) => {
				return res;

			}),
			catchError(this.handleError));
	}

	updateUserProfileData(updatedprofiledata) {
		//let requestObject = {

			// "customer_id":"21",
			// "email" : updatedprofiledata.email,
			// "phone" : updatedprofiledata.phone,
			// "address" : updatedprofiledata.address,
			// "zip" : updatedprofiledata.zip,
			// "state" : updatedprofiledata.state,
			// "city" : updatedprofiledata.city,
			// };
			let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			});
			return this.http.post(`${environment.apiUrl}/customer-profile-update`,updatedprofiledata,{headers:headers}).pipe(
			map((res) => {
			this._snackBar.open("Profile Updated", "X", {
				duration: 2000,
				verticalPosition:'top',
				panelClass :['green-snackbar']
			  });
			return res;
			}),
			catchError(this.handleError));
			
	}
 
}
