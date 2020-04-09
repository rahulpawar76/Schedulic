import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class CommonService {
  businessId : any;
  userId : any;
  token : any;

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar
    ) {
      localStorage.setItem('isBusiness', 'false');
      if(localStorage.getItem('business_id')){
          this.businessId = localStorage.getItem('business_id');
      }
    }  
  private handleError(error: HttpErrorResponse) {
      console.log(error);
      return throwError('Error! something went wrong.');
  }

  ngOnInit() {
        
  }

  openNotificationDialog(requestObject,headers){
    return this.http.post(`${environment.apiUrl}/get-notification`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  staffAvaibility(requestObject,headers){
    return this.http.post(`${environment.apiUrl}/staff-status-update`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

}