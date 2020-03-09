import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'root' })

export class AdminSettingsService {
    adminId:any
    adminToken:any
    businessId : any;
    constructor(
        private http: HttpClient,
        private _snackBar: MatSnackBar,
        private authenticationService:AuthenticationService
        ) { 

            this.adminId=JSON.stringify(this.authenticationService.currentUserValue.user_id);
            this.adminToken = this.authenticationService.currentUserValue.token;
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
    
    fnAllServices(){
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/admin-service-list`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnAllCategory(){
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/get-all-category`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    
    

}