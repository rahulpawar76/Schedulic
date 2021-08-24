import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { PaymemtService } from '@app/_shared/_services/Api/setting/payment/paymemt.service';
// import { ServiceService } from '../_services/service.service';
 import { ErrorService } from '../_services/error.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
// import { StoreService } from '@app/_shared/_services/Api/store/store.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  PaymentGatewayData: any;
  finalGatewayResult: any = 'waiting for response';
  userPaymentDetails: any;
  processGateways:any=[''];
  cartRequestObject:any;
  constructor(private activatedRoute:ActivatedRoute,
    // private paymentApi:ServiceService,
    private _snackBar: MatSnackBar,
    // private storeApi: ServiceService,
    private router:Router,
    private errorService : ErrorService) { }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params.param);
    this.PaymentGatewayData = atob(this.activatedRoute.snapshot.params.param);
    this.PaymentGatewayData = JSON.parse(this.PaymentGatewayData);
    this.userPaymentDetails = JSON.parse(localStorage.getItem('raw_user_data'));
    this.PaymentGatewayData = Object.assign(this.PaymentGatewayData, this.userPaymentDetails);
    console.log(this.PaymentGatewayData);
    if(localStorage.getItem('cartRequestObject')){
      this.cartRequestObject = JSON.parse(localStorage.getItem('cartRequestObject'))
    }
    
  //   if(this.processGateways.includes(this.PaymentGatewayData["paymentOption"])){
  //     this.paymentApi.FinalProcessPaymentGatewayData(this.PaymentGatewayData,this.PaymentGatewayData['amount'],this.PaymentGatewayData['currency']).subscribe(response => {
  //       // if(response['status']){
  //         let finalData = Object.assign(response,this.PaymentGatewayData);
  //         console.log(finalData);
  //         this.paymentApi.ResponsePaymentGateway(finalData,this.PaymentGatewayData['paymentOption'],this.PaymentGatewayData['ORDERID']).subscribe(response => {
  //           this.finalGatewayResult = response;
  //           if(response['status'] == 'success'){
  //             this.makeOrderAfterPayment();
  //           }else{
  //             // this._snackBar.open(environment.ErrorMsg,'x',{duration:environment.MatSnackBarConfig,panelClass:"error-response"});
  //             this.errorService.errorMessage(environment.ErrorMsg);
  //             // this.router.navigate(['Store/']);
  //             this.router.navigate(['/event/'+this.cartRequestObject.event_id]);
  //           }
  //           console.log(this.finalGatewayResult);
  //         })
  //       // }
  //     },err=>{
  //       this.errorService.errorMessage(environment.ErrorMsg);
  //     })
  //   }else{
  //     this.paymentApi.ResponsePaymentGateway(this.PaymentGatewayData,this.PaymentGatewayData['paymentOption'],this.PaymentGatewayData['ORDERID']).subscribe(response => {
  //       this.finalGatewayResult = response;
  //       console.log(this.finalGatewayResult);
  //       if(response['status'] == 'success'){
          
  //         this.cartRequestObject['transaction_id']= this.finalGatewayResult.txnID
  //         this.makeOrderAfterPayment();
  //       }else{
  //         this.errorService.errorMessage(environment.ErrorMsg);
  //         // this.router.navigate(['Store/']);
  //         this.router.navigate(['/event/'+this.cartRequestObject.event_id]);
  //       }
  //     },err=>{
  //       this.errorService.errorMessage(environment.ErrorMsg);
  //     })
  //   }
   }

  // makeOrderAfterPayment(){
  //   this.paymentApi.orderCreate(this.cartRequestObject).subscribe((response:any) => {
  //     if(response.data == true){
  //       this.errorService.successMessage(response.response); 
  //       if(this.cartRequestObject.redirect_confirm_page == 'N'){
  //         console.log(this.cartRequestObject)
  //         if(this.cartRequestObject.event_id){
  //           window.location.href = environment.urlForLink+'/event/'+this.cartRequestObject.event_id;
  //         }
  //       }else{
  //         window.location.href = this.cartRequestObject.redirect_url;
  //       }
  //     } else if(response.data == false){
  //       this.errorService.errorMessage(response.response);
  //     }
  //   });
  // }

}
