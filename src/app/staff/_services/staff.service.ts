import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  DialogReAuthentication  } from '@app/app.component';

@Injectable({ providedIn: 'root' })

export class StaffService {
	staffId:any
  staffToken:any
  bussinessId:any
	dialogRef: any;
  currentUser:any;
  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog,
    private authenticationService:AuthenticationService
    ) { 
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.staffId=JSON.stringify(this.currentUser.user_id);
    this.staffToken = this.currentUser.token;
    this.bussinessId=this.currentUser.business_id;
    
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
  getProfiledata(){
    this.checkAuthentication();
    let requestObject = {
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken 
    });
    return this.http.post(`${environment.apiUrl}/staff-profile`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  getCoupon(requestObject) {
		this.checkAuthentication();
		let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'staff-id' : this.staffId,
      'api-token' : this.staffToken
		});
		return this.http.post(`${environment.apiUrl}/get-coupon`, requestObject, { headers: headers }).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
	}

  fnprofilesubmit(updatedprofiledata){
    this.checkAuthentication();
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken 
    });
    return this.http.post(`${environment.apiUrl}/staff-profile-update`,updatedprofiledata,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }
  
  // work profile
  getAllServices(){
    this.checkAuthentication();
    let requestObject = {
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken 
    });
    return this.http.post(`${environment.apiUrl}/staff-service`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  getWorkingHours(){
    this.checkAuthentication();
    let requestObject = {
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken 
    });
    return this.http.post(`${environment.apiUrl}/staff-working-hours`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  getBreakHours(){
    this.checkAuthentication();
    let requestObject = {
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken 
    });
    return this.http.post(`${environment.apiUrl}/staff-break-hours`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  getAllHolidays(){
    this.checkAuthentication();
    let requestObject = {
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken 
    });
    return this.http.post(`${environment.apiUrl}/staff-holidayslist`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  getAllPostalcodes(){
    this.checkAuthentication();
    let requestObject = {
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId ,
        'api-token' : this.staffToken 
    });
    return this.http.post(`${environment.apiUrl}/staff-postal-code`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  // staff Appointments
  getNewAppointment(requestObject){
    this.checkAuthentication();
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken
    });
    return this.http.post(`${environment.apiUrl}/staff-new-bookings`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  getCompletedAppointment(requestObject){
    this.checkAuthentication();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken
    });
    return this.http.post(`${environment.apiUrl}/staff-booking`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  getOnGoingAppointment(requestObject){
    this.checkAuthentication();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'staff-id' : this.staffId,
      'api-token' : this.staffToken
      
    });
    return this.http.post(`${environment.apiUrl}/staff-ongoing-bookings`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }
  changeStatus(requestObject){
    this.checkAuthentication();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'staff-id' : this.staffId,
      'api-token' : this.staffToken
      
    });
    return this.http.post(`${environment.apiUrl}/staff-update-bookings`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  sendNotification(requestObject){
    this.checkAuthentication();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'staff-id' : this.staffId,
      'api-token' : this.staffToken
      
    });
    return this.http.post(`${environment.apiUrl}/staff-update-notification`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  // mywork-space
  getTodayAppointment(requestObject){
    this.checkAuthentication();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'staff-id' : requestObject.staff_id,
      'api-token' : requestObject.staff_token 
    });
    return this.http.post(`${environment.apiUrl}/staff-today-bookings`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  rescheduleAppointment(requestObject){
    this.checkAuthentication();
    let headers = new HttpHeaders({
    'Content-Type': 'application/json',
      'staff-id' : this.staffId,
      'api-token' : this.staffToken 
    });
    return this.http.post(`${environment.apiUrl}/staff-resedule-bookings`,requestObject,{headers:headers}).pipe(
    map((res) => {
      return res;
    }),
    catchError(this.handleError));
  }

  // Get Tax details

  getTaxDetails(){
    this.checkAuthentication();
      let requestObject = {
          'business_id': this.bussinessId,
      };
      let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'staff-id' : this.staffId,
          'api-token' : this.staffToken 
      });
      return this.http.post(`${environment.apiUrl}/tax-list`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
  }

  getOffDays(requestObject){
    this.checkAuthentication();
      let headers = new HttpHeaders({
          'staff-id' : this.staffId,
          'api-token' : this.staffToken,
          'Content-Type': 'application/json'
      });
      return this.http.post(`${environment.apiUrl}/staff-holiday-offdays`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
  }

  getSettingValue(requestObject) {
    this.checkAuthentication();
      let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'staff-id' : this.staffId,
          'api-token' : this.staffToken 
      });
      console.log(this.staffId+" "+this.staffToken);
      return this.http.post(`${environment.apiUrl}/get-setting-value`, requestObject, { headers: headers }).pipe(
          map((res) => {
              return res;
          }),
          catchError(this.handleError));
  }

  getActivityLog(requestObject){
    this.checkAuthentication();
      let headers = new HttpHeaders({
          'staff-id' : this.staffId,
          'api-token' : this.staffToken,
          'Content-Type': 'application/json'
      });
      return this.http.post(`${environment.apiUrl}/logs-list`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
    }

  staffPayment(requestObject) {
    this.checkAuthentication();
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken 
    });
    return this.http.post(`${environment.apiUrl}/staff-payment-update`, requestObject, { headers: headers }).pipe(
      map((res) => {
          return res;
      }),
    catchError(this.handleError));
  }
  onlinePayment(requestObject) {
    this.checkAuthentication();
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken 
    });
    return this.http.post(`${environment.apiUrl}/send-payment-url`, requestObject, { headers: headers }).pipe(
      map((res) => {
          return res;
      }),
    catchError(this.handleError));
  }
  fncheckavailcoupon(requestObject) {
    this.checkAuthentication();
      let headers = new HttpHeaders({
          'Content-Type': 'application/json'
      });
      return this.http.post(`${environment.apiUrl}/check-discount-coupon`, requestObject, { headers: headers }).pipe(
          map((res) => {
              return res;
          }),
          catchError(this.handleError));
  }
  staffSearchAppointment(requestObject) {
    this.checkAuthentication();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'staff-id' : this.staffId,
      'api-token' : this.staffToken 
    });
    return this.http.post(`${environment.apiUrl}/staff-booking-search`, requestObject, { headers: headers }).pipe(
      map((res) => {
          return res;
      }),
    catchError(this.handleError));
  }

  getBussinessOffDays(requestObject){
    this.checkAuthentication();
      let headers = new HttpHeaders({
          'staff-id' : this.staffId,
          'api-token' : this.staffToken,
          'Content-Type': 'application/json'
      });
      return this.http.post(`${environment.apiUrl}/list-holidays`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
  }

  getPostalCodeList() {
    this.checkAuthentication();
    let requestObject = {
        'business_id': this.bussinessId,
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken,
    });
    return this.http.post(`${environment.apiUrl}/postal-code-list`, requestObject, { headers: headers }).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }
  bookNewAppointment(requestObject) {
    this.checkAuthentication();
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken,
    });
    return this.http.post(`${environment.apiUrl}/order-create-check`, requestObject, { headers: headers }).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  reAuthenticateUser() {
    if(this.dialogRef){
      return;
    }
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

  saveBookingNotes(requestObject){
    this.checkAuthentication();
    let headers = new HttpHeaders({
        'admin-id' : JSON.stringify(this.currentUser.user_id),
        'api-token' : this.currentUser.token,
        'Content-Type': 'application/json'
    });
    return this.http.post(`${environment.apiUrl}/add-booking-notes`,requestObject,{headers:headers}).pipe(
    // return this.http.post(`${environment.apiUrl}/booking-note-update`,requestObject,{headers:headers}).pipe(
        map((res) => {
        return res;
    }),
    catchError(this.handleError));
}
getBookingNotes(requestObject){
    this.checkAuthentication();
    let headers = new HttpHeaders({
        'admin-id' : JSON.stringify(this.currentUser.user_id),
        'api-token' : this.currentUser.token,
        'Content-Type': 'application/json'
    });
    return this.http.post(`${environment.apiUrl}/get-booking-notes`,requestObject,{headers:headers}).pipe(
       map((res) => {
        return res;
    }),
    catchError(this.handleError));
}

updateStaffBGImage(requestObject){
    this.checkAuthentication();
    let headers = new HttpHeaders({
        'staff-id' : JSON.stringify(this.currentUser.user_id),
        'api-token' : this.currentUser.token,
        'Content-Type': 'application/json'
    });
    return this.http.post(`${environment.apiUrl}/staff-bg-image-update`,requestObject,{headers:headers}).pipe(
       map((res) => {
        return res;
    }),
    catchError(this.handleError));
}

changePassword(requestObject){
    this.checkAuthentication();
    let headers = new HttpHeaders({
        'staff-id' : JSON.stringify(this.currentUser.user_id),
        'api-token' : this.currentUser.token,
        'Content-Type': 'application/json'
    });
    return this.http.post(`${environment.apiUrl}/change-password`,requestObject,{headers:headers}).pipe(
       map((res) => {
        return res;
    }),
    catchError(this.handleError));
}
GLStatusUpdate(requestObject){
    this.checkAuthentication();
    let headers = new HttpHeaders({
        'staff-id' : JSON.stringify(this.currentUser.user_id),
        'api-token' : this.currentUser.token,
        'Content-Type': 'application/json'
    });
    return this.http.post(`${environment.apiUrl}/order-status-update`,requestObject,{headers:headers}).pipe(
       map((res) => {
        return res;
    }),
    catchError(this.handleError));
}


removeImage(newCustomerData){
  this.checkAuthentication();
  //let requestObject = {
  //     'customer_id': customer_id,
  // };
  let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'staff-id' : JSON.stringify(this.currentUser.user_id),
      'api-token' : this.currentUser.token 
  });
  return this.http.post(`${environment.apiUrl}/remove-profile-image`,newCustomerData,{headers:headers}).pipe(
  map((res) => {
      return res;
  }),
  catchError(this.handleError));
}

}