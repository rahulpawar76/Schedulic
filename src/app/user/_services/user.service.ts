import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'root' })

export class UserService {
	userId: any;
	token: any;
	ProfileImagedata: any;
	updatedprofiledata: any;
  constructor(
	private http: HttpClient,
	private _snackBar: MatSnackBar,
	private authenticationService: AuthenticationService
	) { 
		this.userId=this.authenticationService.currentUserValue.user_id
		this.token=this.authenticationService.currentUserValue.token
	}   



	private handleError(error: HttpErrorResponse) {
		console.log(error);
		return throwError('Error! something went wrong.');
	}

	getUserProfileData(requestObject) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			"customer-id":JSON.stringify(this.userId),
			"api-token":this.token
		});
		return this.http.post(`${environment.apiUrl}/customer-profile`,requestObject,{headers:headers}).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
	}

	updateUserProfileData(updatedprofiledata) {
			let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			"customer-id":JSON.stringify(this.userId),
			"api-token":this.token
			});
			return this.http.post(`${environment.apiUrl}/customer-profile-update`,updatedprofiledata,{headers:headers}).pipe(
			map((res) => {
			return res;
			}),
			catchError(this.handleError));
			
	}

	getAllAppointments(){
		let requestObject = {
		// "customer_id":"41"
		};
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			"customer-id":JSON.stringify(this.userId),
			"api-token":this.token
		});
		return this.http.post(`${environment.apiUrl}/customer-bookings`,requestObject,{headers:headers}).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
	}
	getCancelAppointments(){
		let requestObject = {
		// "customer_id":"41"
		};
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			"customer-id":JSON.stringify(this.userId),
			"api-token":this.token
		});
		return this.http.post(`${environment.apiUrl}/customer-booking-cancel`,requestObject,{headers:headers}).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
	}
	getCompletedAppointments(){
		let requestObject = {
		// "customer_id":"41"
		};
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			"customer-id":JSON.stringify(this.userId),
			"api-token":this.token
		});
		return this.http.post(`${environment.apiUrl}/customer-booking-complete`,requestObject,{headers:headers}).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
	}
	cancelAppointment(requestObject){
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			"customer-id":JSON.stringify(this.userId),
			"api-token":this.token
		});
		return this.http.post(`${environment.apiUrl}/order-cancel`,requestObject,{headers:headers}).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
	}
	ratingToAppointment(requestObject){
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			"customer-id":JSON.stringify(this.userId),
			"api-token":this.token
		});
		return this.http.post(`${environment.apiUrl}/customer-rating`,requestObject,{headers:headers}).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
	}

	rescheduleAppointment(requestObject){
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			"customer-id":JSON.stringify(this.userId),
			"api-token":this.token
		});
		return this.http.post(`${environment.apiUrl}/order-resedule`,requestObject,{headers:headers}).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
	}

  getSettingValue(requestObject) {
    let headers = new HttpHeaders({
	    'Content-Type': 'application/json',
			"customer-id":JSON.stringify(this.userId),
			"api-token":this.token
    });
    return this.http.post(`${environment.apiUrl}/get-setting-value`, requestObject, { headers: headers }).pipe(
    map((res) => {
      return res;
    }),
    catchError(this.handleError));
  }
  getActivityLog(requestObject){
      let headers = new HttpHeaders({
					"customer-id":JSON.stringify(this.userId),
					"api-token":this.token,
          'Content-Type': 'application/json'
      });
      return this.http.post(`${environment.apiUrl}/logs-list`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
	}
  customerSearchAppointment(requestObject) {
    let headers = new HttpHeaders({
	    'Content-Type': 'application/json',
		"customer-id":JSON.stringify(this.userId),
		"api-token":this.token
    });
    return this.http.post(`${environment.apiUrl}/customer-bookings-search`, requestObject, { headers: headers }).pipe(
    map((res) => {
      return res;
    }),
    catchError(this.handleError));
  }
  customerStripePayment(requestObject) {
    let headers = new HttpHeaders({
	    'Content-Type': 'application/json',
		"customer-id":JSON.stringify(this.userId),
		"api-token":this.token
    });
    return this.http.post(`${environment.apiUrl}/stripe-payment`, requestObject, { headers: headers }).pipe(
    map((res) => {
      return res;
    }),
    catchError(this.handleError));
  }
  customerPaymentUpdate(requestObject) {
    let headers = new HttpHeaders({
	    'Content-Type': 'application/json',
		"customer-id":JSON.stringify(this.userId),
		"api-token":this.token
    });
    return this.http.post(`${environment.apiUrl}/customer-payment-update`, requestObject, { headers: headers }).pipe(
    map((res) => {
      return res;
    }),
    catchError(this.handleError));
  }
  
  getBusinessDetail(requestObject) {
    let headers = new HttpHeaders({
	    'Content-Type': 'application/json',
		"customer-id":JSON.stringify(this.userId),
		"api-token":this.token
    });
    return this.http.post(`${environment.apiUrl}/get-business`, requestObject, { headers: headers }).pipe(
    map((res) => {
      return res;
    }),
    catchError(this.handleError));
  }
  sendInvoiceEmail(requestObject){
      let headers = new HttpHeaders({
	    // 'Content-Type': 'application/pdf',
				"customer-id":JSON.stringify(this.userId),
				"api-token":this.token
      });
      return this.http.post(`${environment.apiUrl}/send-invoice`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
  }

  getOffDays(requestObject){
      let headers = new HttpHeaders({
					"customer-id":JSON.stringify(this.userId),
					"api-token":this.token,
          'Content-Type': 'application/json'
      });
      return this.http.post(`${environment.apiUrl}/list-holidays`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
  }

}
