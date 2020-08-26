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
      'admin-id': this.adminData.user_id,
      "api-token": this.adminData.token
    });
    console.log(headers)
    this.CommonService.getSubscriptionPlans(requestObject,headers).subscribe((response:any) => {
      if(response.data == true){
      this.planList = response.response
      console.log(this.planList)
    }
    else if(response.data == false){
    }
  });
}

  fnPaymentNow(planCode) {
    const dialogRef = this.dialog.open(DialogSubscriptionCardForm, {
      width: '800px',
      data: {planCode :planCode}
      
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
  planCode:any;
  cardPaymentForm:FormGroup;
  
  constructor(
    public dialogRef: MatDialogRef<DialogSubscriptionCardForm>,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private authenticationService:AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.planCode = this.data.planCode
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

    
  }
