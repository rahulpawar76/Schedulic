import { Component, Inject, Injectable, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  animal: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CommonService {
  businessId : any;
  userId : any;
  token : any;
  currentUser:any;
  animal: any;

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    ) {
      
    //this.authenticationService.currentUser.subscribe(x =>  this.currentUser = x );
   
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
  fnViewNotification(requestObject,headers){
    return this.http.post(`${environment.apiUrl}/update-notification`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }
  getSubscriptionPlans(requestObject,headers){
    return this.http.post(`${environment.apiUrl}/plan-list`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }



}
