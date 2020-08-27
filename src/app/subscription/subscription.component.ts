import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DatePipe} from '@angular/common';
import { AuthenticationService } from '@app/_services';
import { CommonService } from '../_services/common.service'
import { AppComponent } from '@app/app.component'
import { environment } from '@environments/environment';


export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  planList:any;
  adminData : any;

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private CommonService: CommonService,
  ) {
    this.adminData = JSON.parse(localStorage.getItem('adminData'));
    console.log(this.adminData)
    this.getSubscriptionPlans();
   }

  // private handleError(error: HttpErrorResponse) {
  //   console.log(error);
  //   return throwError('Error! something went wrong.');
  // }


  ngOnInit() {
  }

  getSubscriptionPlans(){
    let requestObject = {

    }
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'admin-id':   JSON.stringify(this.adminData.user_id),
      "api-token": this.adminData.token,
    });
    console.log(headers)
    this.CommonService.getSubscriptionPlans(requestObject,headers).subscribe((response:any) => {
      if(response.data == true){
      this.planList = response.response
    }
    else if(response.data == false && response.response !== 'api token or userid invaild'){
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
        });
    }
  });
}

  fnPaymentNow(planId) {
    const dialogRef = this.dialog.open(DialogSubscriptionCardForm, {
      width: '800px',
      data: {planId :planId}
      
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
@Component({
  selector: 'subscription-payment',
  templateUrl: '../_dialogs/dialog-subscription-payment.html',
  providers: [DatePipe]
})
export class DialogSubscriptionCardForm {
  isLoaderAdmin:boolean = false;
  cardForm:FormGroup
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  planId:any;
  adminData:any;
  cardPaymentForm:FormGroup;
  
  constructor(
    public dialogRef: MatDialogRef<DialogSubscriptionCardForm>,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private CommonService: CommonService,
    private authenticationService:AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.planId = this.data.planId
      
    this.adminData = JSON.parse(localStorage.getItem('adminData'));
    }
    onNoClick(): void {
      this.dialogRef.close();
      
    }

    ngOnInit() {
      this.cardPaymentForm = this._formBuilder.group({
        name: ['', Validators.required],
        cardNumber: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(16),Validators.minLength(16)]],
        cardEXMonth: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(2),Validators.minLength(2)]],
        cardEXYear: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(4),Validators.minLength(4)]],
        cardCVV: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(3),Validators.minLength(3)]],
      });
    }

    fnPayNow(){
      let requestObject = {
        'user_id' : JSON.stringify(this.adminData.user_id),
        'card_name' : this.cardPaymentForm.get('name').value,
        'card_number' : this.cardPaymentForm.get('cardNumber').value,
        'exp_month' : this.cardPaymentForm.get('cardEXMonth').value,
        'exp_year' : this.cardPaymentForm.get('cardEXYear').value,
        'cvc_number' : this.cardPaymentForm.get('cardCVV').value,
        'plan_id' :this.planId
      }
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'admin-id':   JSON.stringify(this.adminData.user_id),
        "api-token": this.adminData.token,
      });
      this.CommonService.getSubscriptionPayment(requestObject,headers).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
            });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
          });
      }
    });
  }

    
  }
