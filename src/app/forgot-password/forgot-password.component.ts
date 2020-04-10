import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/_services';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';
import { Observable, throwError } from 'rxjs';
import { AppComponent } from '@app/app.component';
import { map, catchError, filter } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
   dataLoaded: boolean = true;
   forgotEmail: any;
   error = '';
   emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  
  constructor(
  	 	  private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,       
        private _snackBar: MatSnackBar,
        private http: HttpClient,
        public AppComponent:AppComponent,
        private authenticationService: AuthenticationService        
        ){ 

  }

  ngOnInit() {   	
  	this.forgotForm = this.formBuilder.group({
        email: ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)]]        
    });
  }  
  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError('Error! something went wrong.');
}

  forgotPwdSubmit(){
    this.forgotEmail =  this.forgotForm.get('email').value
    let requestObject = {
          "email":this.forgotEmail,
        };
    let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/forgot-password`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError)
        ).subscribe((response:any) => {
          if(response.data == true){
            this._snackBar.open("reset password link sent in your mail", "X", {
              duration: 2000,
              verticalPosition:'top',
              panelClass :['green-snackbar']
            });
            this.router.navigate(['/reset-password']);
          }
          else if(response.data == false){
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition:'top',
              panelClass :['red-snackbar']
            });
          }
        }, (err) =>{
          console.log(err)
        })
  }
    
 

}
