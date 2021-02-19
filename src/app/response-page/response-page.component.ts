import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http'
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
@Component({
  selector: 'app-response-page',
  templateUrl: './response-page.component.html',
  styleUrls: ['./response-page.component.scss']
})
export class ResponsePageComponent implements OnInit {
  responseMessage:any
  constructor(
    private http:HttpClient,
  ) { }

  ngOnInit() {
    this.getResponse();
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError('Error! something went wrong.');
}

  getResponse(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(`${environment.apiUrl}/user-email-phone-verification`,{headers:headers}).pipe(map(res=>{
      return res;
    }),
      catchError(this.handleError)
    ).subscribe((response:any) =>{
      if(response.data == true){
        this.responseMessage = response.response
      }else if(response.data == false){
        this.responseMessage = 'token invalid'
      }
    })
  }

}
