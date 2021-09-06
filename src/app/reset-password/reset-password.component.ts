import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';
import { Observable, throwError } from 'rxjs';
import { AppComponent } from '@app/app.component';
import { map, catchError, filter } from 'rxjs/operators';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  user_id: string;
  resetPasswordForm: FormGroup;
  dataLoaded: boolean = true;
  error= '';
  submitted = false;
  newPassword: any;
  accesToken : any;
  hide = true;
  hide1 = true;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,       
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private authenticationService: AuthenticationService
    ) {
  
    }

  ngOnInit() {  	 
  	this.resetPasswordForm = this.formBuilder.group({
      NewPassword: ['', Validators.required],
      ReNewPassword: ['', Validators.required]            
    },{validator: this.checkPasswords });
    console.log(this.route.snapshot.queryParams['accessToken']);
    
    this.accesToken = this.route.snapshot.queryParams['accessToken'];
  }
  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError('Error! something went wrong.');
}


/* Check password and confirm password */
 checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.NewPassword.value;
    let confirmPass = group.controls.ReNewPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }


// convenience getter for easy access to form fields
    get f() { return this.resetPasswordForm.controls; }


/* That function will reset password */
  fnSubmitResetPassword() {   
    if (this.resetPasswordForm.valid) {
      this.newPassword = this.resetPasswordForm.get('ReNewPassword').value
      let requestObject = {
        "password":this.newPassword,
        "token" : this.accesToken
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      return this.http.post(`${environment.apiUrl}/reset-password`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open("Passward Successfully Reset", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          this.router.navigate(['/login']);
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
    }    else{
      
      this.resetPasswordForm.get('NewPassword').markAsTouched();
      this.resetPasswordForm.get('ReNewPassword').markAsTouched();
    }  
  }

  
	login(){
    this.router.navigate(["login"]);
  }

}
