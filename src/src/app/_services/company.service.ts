import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { map, catchError, subscribeOn } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

    constructor(private http: HttpClient) {
    }

    public getCompanyInfoData(): Observable<any> {
        return this.http.post(`${environment.apiUrl}/GetCompanyDetails`, {},{}).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError));
    }



    public getCompanyColoursData(): Observable<any> {
        return this.http.post(`${environment.apiUrl}/GetCompanyColours`, {},{}).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError));
    }

    public handleError(error: HttpErrorResponse) {
        console.log(error);
        return throwError('Unable to get client info');
    }
    
}
