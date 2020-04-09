import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class CommonService {
  businessId : any;
  currentUser : any;
  userId : any;
  token : any;

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private authenticationService:AuthenticationService
    ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      localStorage.setItem('isBusiness', 'false');
      if(localStorage.getItem('business_id')){
          this.businessId = localStorage.getItem('business_id');
      }
      if(this.currentUser && this.currentUser.user_id){
        this.userId=this.currentUser.user_id;
        this.token=this.currentUser.token
      }

    }  
  private handleError(error: HttpErrorResponse) {
      console.log(error);
      return throwError('Error! something went wrong.');
  }

  ngOnInit() {
        
  }

  openNotificationDialog(userType){
    if(userType == "admin"){
      let requestObject = {
        "user_id":this.businessId,
        "user_type" : userType
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'admin-id' : JSON.stringify(this.userId),
        "api-token":this.token
      });
      return this.http.post(`${environment.apiUrl}/get-notification`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
    }else if(userType == "staff"){
      let requestObject = {
        "user_id":this.currentUser.user_id,
        "user_type" : userType
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id' : JSON.stringify(this.userId),
        "api-token":this.token
      });
      return this.http.post(`${environment.apiUrl}/get-notification`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
    }else if(userType == "customer"){
      let requestObject = {
        "user_id":this.currentUser.user_id,
        "user_type" : userType
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        "customer-id" : JSON.stringify(this.userId),
        "api-token":this.token
      });
      return this.http.post(`${environment.apiUrl}/get-notification`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
    }
   
  }

  staffAvaibility(staffStatus){
    let requestObject = {
      "status": staffStatus,
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'staff-id' : JSON.stringify(this.userId),
      "api-token":this.token
    });
    return this.http.post(`${environment.apiUrl}/staff-status-update`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

}