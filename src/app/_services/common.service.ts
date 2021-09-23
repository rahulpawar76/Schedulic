import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { DialogAuthentication } from './auth.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CommonService {
  businessId: any;
  userId: any;
  token: any;
  currentUser: any;
  animal: any;
  dialogRef: any;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public router: Router,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    localStorage.setItem('isBusiness', 'false');
    if(localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
    }
  }
  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }

  ngOnInit() {

  }

  checkAuthentication() {
    let requestObject = {
      "user_type": JSON.parse(localStorage.getItem('currentUser')).user_type,
      "user_id": JSON.parse(localStorage.getItem('currentUser')).user_id,
      "token": JSON.parse(localStorage.getItem('currentUser')).token
    };
    this.http.post(`${environment.apiUrl}/check-token`, requestObject).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response: any) => {
      if (response.data == true) {
      }
      else if (response.data == false) {
        this.reAuthenticateUser();
      }
    }, (err) => {
      console.log(err)
    });

  }

  openNotificationDialog(requestObject, headers) {
    this.checkAuthentication();
    return this.http.post(`${environment.apiUrl}/get-notification`, requestObject, { headers: headers }).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError));
  }

  getBusinessSetup(requestObject, headers) {
    this.checkAuthentication();
    return this.http.post(`${environment.apiUrl}/getting-setup-api`, requestObject, { headers: headers }).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError));
  }

  staffAvaibility(requestObject, headers) {
    this.checkAuthentication();
    return this.http.post(`${environment.apiUrl}/staff-status-update`, requestObject, { headers: headers }).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError));
  }

  fnViewNotification(requestObject, headers) {
    return this.http.post(`${environment.apiUrl}/update-notification`, requestObject, { headers: headers }).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError));
  }

  getSubscriptionPlans(requestObject, headers) {
    return this.http.post(`${environment.apiUrl}/plan-list`, requestObject, { headers: headers }).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError));
  }

  getSubscriptionPayment(requestObject, headers) {
    return this.http.post(`${environment.apiUrl}/admin-card-details`, requestObject, { headers: headers }).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError));
  }
  gelAllCountry() {
    let requestObject = {
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${environment.apiUrl}/countries`, requestObject, { headers: headers }).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError));
  }

  gelAllState(country_id) {
    let requestObject = {
      'country_id': country_id,
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${environment.apiUrl}/states`, requestObject).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError));
  }

  // gelAllCities
  gelAllCities(state_id) {
    let requestObject = {
      'state_id': state_id
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${environment.apiUrl}/cities`, requestObject).pipe(
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
      if (result) {
        this.currentUser = result;
      } else {
        this.logout();
        this.router.navigate(['/login']);
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
