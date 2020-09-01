import { Component, Inject, Injectable, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@environments/environment';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  DialogAuthentication  } from './auth.component';

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
  dialogRef:any;

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
  ) {
      
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      localStorage.setItem('isBusiness', 'false');
      if(localStorage.getItem('business_id')){
          this.businessId = localStorage.getItem('business_id');
      }
    }  
  private handleError(error: HttpErrorResponse) {
      return throwError('Error! something went wrong.');
  }

  ngOnInit() {
        
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

  openNotificationDialog(requestObject,headers){
    this.checkAuthentication();
    return this.http.post(`${environment.apiUrl}/get-notification`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  staffAvaibility(requestObject,headers){
    this.checkAuthentication();
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
    this.checkAuthentication();
    return this.http.post(`${environment.apiUrl}/plan-list`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  getSubscriptionPayment(requestObject,headers){
    this.checkAuthentication();
    return this.http.post(`${environment.apiUrl}/admin-card-details`,requestObject,{headers:headers}).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }



  reAuthenticateUser() {

    if (this.dialogRef) return;
    this.dialogRef = this.dialog.open(DialogAuthentication, {
      width: '500px',
    });

    this.dialogRef.afterClosed().subscribe(result => {

        if(result){
          this.currentUser = result;
        }else{
          this.logout();
        }

    });

  }

  logout() {
      
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isFront');
    localStorage.removeItem('logoutTime');
    localStorage.removeItem('business_id');
    localStorage.removeItem('internal_staff');
    localStorage.removeItem('business_name');
    localStorage.removeItem('isBusiness');
    localStorage.removeItem('adminData');
    
  }

}
