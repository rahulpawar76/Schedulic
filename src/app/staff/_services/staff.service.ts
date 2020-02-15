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
  constructor(private http: HttpClient,private _snackBar: MatSnackBar,private authenticationService:AuthenticationService) { 

    this.staffId=JSON.stringify(this.authenticationService.currentUserValue.user_id);
    this.staffToken = this.authenticationService.currentUserValue.token;
    
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
    let requestObject = {
        
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId,
        'api-token' : this.staffToken 
    });
    return this.http.post(`${environment.apiUrl}/staff-profile-update`,updatedprofiledata,{headers:headers}).pipe(
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

  // staff Appointments
  getNewAppointment(){
    let requestObject = {
      'business_id': '2',
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : this.staffId
    });
    return this.http.post(`${environment.apiUrl}/staff-new-bookings`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }
  getCompletedAppointment(){
    let requestObject = {
      'staff_id' : this.staffId,
      'business_id': '2',
      'status': 'CO'
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });
    return this.http.post(`${environment.apiUrl}/staff-booking`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

}