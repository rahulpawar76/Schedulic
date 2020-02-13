import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })

export class StaffService {
	
  constructor(private http: HttpClient,private _snackBar: MatSnackBar) { }  

  private handleError(error: HttpErrorResponse) {
	console.log(error);
    return throwError('Error! something went wrong.');
  } 

  getProfiledata(){
    let requestObject = {
        //"customer_id":"36"
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : '2'
    });
    return this.http.post(`${environment.apiUrl}/staff-profile`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }
  getAllServices(){
    let requestObject = {
        'staff_id' : '2'
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });
    return this.http.post(`${environment.apiUrl}/staff-service`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }
  getWorkingHours(){
    let requestObject = {
        'staff_id' : '2'
    };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });
    return this.http.post(`${environment.apiUrl}/staff-working-hours`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }
  fnprofilesubmit(updatedprofiledata){
    // let requestObject = {
    //     'staff_id' : '2'
    // };
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
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

}