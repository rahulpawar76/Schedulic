import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  DialogReAuthentication  } from '@app/app.component';

@Injectable({ providedIn: 'root' })

export class UserService {
	userId: any;
	dialogRef: any;
	token: any;
	ProfileImagedata: any;
	updatedprofiledata: any;
	currentUser:any;
  constructor(
	private http: HttpClient,
	public router: Router,
    public dialog: MatDialog,
	private _snackBar: MatSnackBar,
	private authenticationService: AuthenticationService
	) { 
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		this.userId=this.authenticationService.currentUserValue.user_id
		this.token=this.authenticationService.currentUserValue.token
	}   



	private handleError(error: HttpErrorResponse) {
		console.log(error);
		return throwError('Error! something went wrong.');
	}

	checkAuthentication(){
		let requestObject = {
		  "user_type": this.currentUser.user_type,
		  "user_id" : this.currentUser.user_id,
		  "token" : this.currentUser.token
		};
		this.http.post(`${environment.apiUrl}/check-token`,requestObject).pipe(
		  map((res) => {
			return res;
		  }),
		  catchError(this.handleError)
		).subscribe((response:any) => {
		  if (response.data == true) {
		  }
		  else if(response.data == false){
			this.reAuthenticateUser();
		  }
		},(err) =>{
			console.log(err)
		});
	
	  }
	getUserProfileData(requestObject) {
		this.checkAuthentication();
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
		this.checkAuthentication();
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
		this.checkAuthentication();
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
		this.checkAuthentication();
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
		this.checkAuthentication();
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
		this.checkAuthentication();
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
		this.checkAuthentication();
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
		this.checkAuthentication();
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
	this.checkAuthentication();
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
	this.checkAuthentication();
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
	this.checkAuthentication();
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
	this.checkAuthentication();
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
	this.checkAuthentication();
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
	this.checkAuthentication();
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

  getBusinessImage(requestObject) {
    let headers = new HttpHeaders({
	    'Content-Type': 'application/json',
		"customer-id":JSON.stringify(this.userId),
		"api-token":this.token
    });
    return this.http.post(`${environment.apiUrl}/get-business-image`, requestObject, { headers: headers }).pipe(
    map((res) => {
      return res;
    }),
    catchError(this.handleError));
  }
  
  sendInvoiceEmail(requestObject){
	this.checkAuthentication();
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
	this.checkAuthentication();
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

  	getTaxDetails(requestObject){
		this.checkAuthentication();
		
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			"customer-id":JSON.stringify(this.userId),
			"api-token":this.token
		});
		return this.http.post(`${environment.apiUrl}/tax-list`,requestObject,{headers:headers}).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
		}

	getPostalCodeList(requestObject) {
		this.checkAuthentication();
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			"customer-id":JSON.stringify(this.userId),
			"api-token":this.token,
		});
		return this.http.post(`${environment.apiUrl}/postal-code-list`, requestObject, { headers: headers }).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
	}

	BookAppointment(requestObject) {
		this.checkAuthentication();
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			"customer-id":JSON.stringify(this.userId),
			"api-token":this.token,
		});
		return this.http.post(`${environment.apiUrl}/order-create-check`, requestObject, { headers: headers }).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
	}
	
	reAuthenticateUser() {
		if (this.dialogRef) {
            return
        };
		this.dialogRef = this.dialog.open(DialogReAuthentication, {
			width: '500px',
	
		});
	
		this.dialogRef.afterClosed().subscribe(result => {
			if(result){
				this.currentUser = result
				console.log(this.currentUser)
			}else{
				this.authenticationService.logout();
				this.router.navigate(['/login']);
			}
		});
	}
	

}
