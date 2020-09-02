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

export class SuperAdminService {
    superAdminId:any
    SAToken:any
    businessId:any
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
        this.superAdminId=JSON.stringify(this.authenticationService.currentUserValue.user_id);
        this.SAToken = this.authenticationService.currentUserValue.token;
        this.businessId=this.authenticationService.currentUserValue.business_id
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

    getAdminList(adminListApiUrl){
        this.checkAuthentication();
        let requestObject = {
        };
        let headers = new HttpHeaders({
            'superadmin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
        });
        return this.http.post(adminListApiUrl,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getSubscriptionList(){
        this.checkAuthentication();
        let requestObject = {
        };
        let headers = new HttpHeaders({
            'superadmin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
        });
        return this.http.post(`${environment.apiUrl}/plan-list`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getTransactions(){
        this.checkAuthentication();
        let requestObject = {
        };
        let headers = new HttpHeaders({
            'superadmin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
        });
        return this.http.post(`${environment.apiUrl}/get-all-transactions`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getMyProfileDetails(){
        this.checkAuthentication();
        let requestObject = {
        };
        let headers = new HttpHeaders({
            'superadmin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
        });
        return this.http.post(`${environment.apiUrl}/super-admin-profile`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    updateProfile(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'superadmin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
        });
        return this.http.post(`${environment.apiUrl}/super-admin-profile-update`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnChageAdminStatus(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'superadmin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
        });
        return this.http.post(`${environment.apiUrl}/admin-status-update`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnDeletePlan(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'superadmin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
        });
        return this.http.post(`${environment.apiUrl}/plan-delete`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnCreateNewPlan(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'superadmin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
        });
        return this.http.post(`${environment.apiUrl}/create-plan`,requestObject,{headers:headers}).pipe(
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

}