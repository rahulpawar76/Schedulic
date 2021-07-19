import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { DatePipe} from '@angular/common';
import { AuthenticationService } from '@app/_services';
import { CommonService } from '../_services/common.service'
import { Router, RouterOutlet } from '@angular/router';


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
    public router: Router,
    public dialog: MatDialog,
    private CommonService: CommonService,
  ) {
    if(localStorage.getItem('adminData')){
      this.adminData = JSON.parse(localStorage.getItem('adminData'));
    }else{
      this.router.navigate(['/login']);
    }
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
  onlynumeric = /^-?(0|[0-9]\d*)?$/
  planId:any;
  adminData:any;
  cardPaymentForm:FormGroup;
  allCountry:any;
  allStates: any;
  allCities: any;
  
  constructor(
    public dialogRef: MatDialogRef<DialogSubscriptionCardForm>,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private CommonService: CommonService,
    public router: Router,
    private authenticationService:AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.planId = this.data.planId
      
    this.gelAllCountry();
    this.adminData = JSON.parse(localStorage.getItem('adminData'));
    }
    onNoClick(): void {
      this.dialogRef.close();
      
    }

    ngOnInit() {
      this.cardPaymentForm = this._formBuilder.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        country: ['', Validators.required], 
        city: ['', Validators.required],
        state: ['', Validators.required],
        cardNumber: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(16),Validators.minLength(16)]],
        zipcode: ['', [Validators.required,Validators.maxLength(6),Validators.minLength(3)]],
        cardEXMonth: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(2),Validators.minLength(2)]],
        cardEXYear: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(2),Validators.minLength(2)]],
        cardCVV: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(3),Validators.minLength(3)]],
      });
    }

    
    
    fnPayNow(){
      let requestObject = {
        'user_id' : JSON.stringify(this.adminData.user_id),
        'card_name' : this.cardPaymentForm.get('name').value,
        'address' : this.cardPaymentForm.get('address').value,
        'country' : this.cardPaymentForm.get('country').value,
        'state' : this.cardPaymentForm.get('state').value,
        'city' : this.cardPaymentForm.get('city').value,
        'zip' : this.cardPaymentForm.get('zipcode').value,
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
          this.dialogRef.close();
          this.router.navigate(['/login']);
      } else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    });
    }

    gelAllCountry(){
      this.isLoaderAdmin =true;
      this.CommonService.gelAllCountry().subscribe((response:any) => {
        if(response.data == true){
          this.allCountry = response.response
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this.allCountry = ''
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
      })
      this.isLoaderAdmin =false;
    }

    selectCountry(country_id){
      this.isLoaderAdmin =true;
      this.CommonService.gelAllState(country_id).subscribe((response:any) => {
     

        if(response.data == true){
          this.allStates = response.response
          this.isLoaderAdmin =false;
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this.allStates = ''
          this.cardPaymentForm.controls['business_state'].setValue('');
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
          this.isLoaderAdmin =false;
        }
      })
    }

    // selectCountry(country_id){
    //   this.isLoaderAdmin =true;
    //   this.CommonService.gelAllState(country_id).subscribe((response:any) => {
    //   console.log(">>>>>>>>>>cccccccccc",country_id);

    //     if(response.data == true){
    //       this.allStates = response.response
    //       this.cardPaymentForm.controls['business_state'].setValue('');
    //       this.isLoaderAdmin =false;
    //     }
    //     else if(response.data == false && response.response !== 'api token or userid invaild'){
    //       this.allStates = ''
    //       this.cardPaymentForm.controls['business_state'].setValue('');
    //       this._snackBar.open(response.response, "X", {
    //         duration: 2000,
    //         verticalPosition: 'top',
    //         panelClass : ['red-snackbar']
    //       });
    //       this.isLoaderAdmin =false;
    //     }
    //   })
    // }

    selectStates(state_id){
     
      this.isLoaderAdmin =true;
      this.CommonService.gelAllCities(state_id).subscribe((response:any) => {
        if(response.data == true){
          this.allCities = response.response
          this.isLoaderAdmin =false;
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this.allCities = [];
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
          this.isLoaderAdmin =false;
        }
      })
    }
    
  }
