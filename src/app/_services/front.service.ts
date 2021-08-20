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
export class FrontService {
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
      
      if(localStorage.getItem('business_id')){
          this.businessId = localStorage.getItem('business_id');
      }
    }  
  private handleError(error: HttpErrorResponse) {
      return throwError('Error! something went wrong.');
  }

  ngOnInit() {
        
  }

  paymentGatewaysList(requestObject){
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });
    return this.http.post(`${environment.apiUrl}/showMerchantPaymentGateway`,requestObject).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  GetPaymentGatewayDetails(requestObject){
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });
    return this.http.post(`${environment.apiUrl}/getMerchantPaymentGateway`,requestObject).pipe(
    map((res) => {
        return res;
    }),
    catchError(this.handleError));
  }

  GetDefaultBody(){
    return new HttpParams().set('token',localStorage.getItem('token')).set('business_code',localStorage.getItem('businessCode'));
  }

  PreProcessPaymentGatewayData(object){
    var param = this.GetDefaultBody();
    Object.entries(object).forEach(([key, value]) => {
    param = param.append(key,String(value));
    });    
    return this.http.post('https://gateway.webjio.com/webapp/pre-process',param);
  }

    FinalProcessPaymentGatewayData(object,amount,currency){
      var param = new HttpParams().set('amounts['+currency+']',amount);
      Object.entries(object).forEach(([key, value]) => {
      if(typeof(value) == 'object'){
          param = param.append(key,JSON.stringify(value));
      }else{
          // let paramVal:any = value
          // let paramVal = decodeURIComponent(String(value));
          param = param.append(key,String(value));
      }
      });
      return this.http.post('https://gateway.webjio.com/webapp/process',param);
  }
    
}
