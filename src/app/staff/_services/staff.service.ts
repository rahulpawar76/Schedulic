import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'root' })

export class StaffService {
	staffId:any
  staffToken:any
	bussinessId:any
  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private authenticationService:AuthenticationService
    ) { 
    this.staffId=JSON.stringify(this.authenticationService.currentUserValue.user_id);
    this.staffToken = this.authenticationService.currentUserValue.token;
    this.bussinessId=this.authenticationService.currentUserValue.business_id
    
  }  

  private handleError(error: HttpErrorResponse) {
	console.log(error);
    return throwError('Error! something went wrong.');
  } 

  getProfiledata(){
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

  fnprofilesubmit(updatedprofiledata){
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

  // mywork-space
  getTodayAppointment(requestObject){
   
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

}