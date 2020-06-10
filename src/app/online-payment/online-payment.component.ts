import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { Router, RouterOutlet,ActivatedRoute } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-online-payment',
  templateUrl: './online-payment.component.html',
  styleUrls: ['./online-payment.component.scss'],
  providers: [DatePipe]
})
export class OnlinePaymentComponent implements OnInit {

  cardForm: FormGroup;
  isLoader:boolean = false;
  orderItemId:any;
  orderInfo:any;
  onlynumeric = /^-?(0|[1-9]\d*)?$/

  constructor(
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
  ) {
    
    localStorage.setItem('isFront', "true");
    this.orderItemId = this.route.snapshot.queryParams['order-item'];
    if(this.orderItemId){
      this.getOrderItemInfo();
    }else{
      this._snackBar.open("Order Not Found", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
    }
   }

  ngOnInit() {

    
    this.cardForm = this._formBuilder.group({
      cardHolderName: ['',[Validators.required]],
      cardNumber: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(20)]],
      expiryMonth: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(2)]],
      expiryYear: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(4)]],
      cvvCode: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(6)]],
    })
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }
  

    getOrderItemInfo(){
      let requestObject ={
        "order_item_id" : this.orderItemId,
      }
      this.isLoader=true;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      this.http.post(`${environment.apiUrl}/order-item-info`,requestObject,{headers:headers} ).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
          this.orderInfo = response.response
          this.isLoader=false;
        }
        else{
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
          this.isLoader=false;
        }
      },
      (err) =>{
      })
    }

  fnPayNow(){
    
    if(this.cardForm.valid){
      let digit5= Math.floor(Math.random()*90000) + 10000;
      let requestObject ={
        "name" : this.cardForm.get("cardHolderName").value,
        "number" : this.cardForm.get("cardNumber").value,
        "exp_month" : this.cardForm.get("expiryMonth").value,
        "exp_year" : this.cardForm.get("expiryYear").value,
        "cvc" : this.cardForm.get("cvvCode").value,
        "amount" : this.orderInfo.total_cost,
        "order_item_id": this.orderInfo.id
      }
      this.isLoader=true;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      this.http.post(`${environment.apiUrl}/online-stripe-payment`,requestObject,{headers:headers} ).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open("Payment Successfully Completed", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['green-snackbar']
          });
          this.router.navigate(['/login']);
          this.isLoader=false;
        }
        else{
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
          this.isLoader=false;
        }
      },
      (err) =>{
      })
    }else{
      this.cardForm.get("cardHolderName").markAsTouched();
      this.cardForm.get("cardNumber").markAsTouched();
      this.cardForm.get("expiryMonth").markAsTouched();
      this.cardForm.get("expiryYear").markAsTouched();
      this.cardForm.get("cvvCode").markAsTouched();
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
