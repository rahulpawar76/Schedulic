import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { UserService } from '../_services/user.service';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AuthenticationService } from '@app/_services';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { sha512 as sha512 } from 'js-sha512';


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-userappointments',
  templateUrl: './userappointments.component.html',
  styleUrls: ['./userappointments.component.scss'],
  providers: [DatePipe]
})
export class UserappointmentsComponent implements OnInit {
  animal: any;
  bussinessId: any;
  customerId:any;
  appointmentData : any;
  cancelAppointmentData: any;
  completedAppointmentData: any;
  settingsArr: any;
  cancellationBufferTime= new Date();
  minReschedulingTime= new Date();
  isCustomerAllowedForRatingStaff: boolean=false;
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;
  appointDetailForPayment:any;
  reference_id:any;
  customerPaymentNote:any;
  isLoader: boolean = false;
  search = {
    keyword: ""
  };
  openedTab :any = 'new';
  
  creditcardform = false;
  showPaypalButtons = false;
  showPayUMoneyButton = false;
  paymentMethod:any="";
  transactionId : any;
  paymentDateTime: any;
  paymentScreen: boolean = false;
  
  public payPalConfig?: IPayPalConfig;
  onlynumeric = /^-?(0|[1-9]\d*)?$/

  cardForm:FormGroup;

  
  PayUMoney={
    key:'',
    txnid:'',
    amount:'',
    firstname:'',
    email:'',
    phone:'',
    productinfo:'',
    surl:'',
    furl:'',
    mode:'',
    salt:'',
    udf1:'',
    udf2:'',
    udf3:'',
    udf4:'',
    udf5:''
  }


  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    private UserService: UserService,
    public router: Router,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService
    ) {
    this.customerId=this.authenticationService.currentUserValue.user_id
    this.bussinessId=this.authenticationService.currentUserValue.business_id;
    this.cardForm = this._formBuilder.group({
      cardHolderName: ['',[Validators.required]],
      cardNumber: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
      expiryMonth: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
      expiryYear: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
      cvvCode: ['',[Validators.required]],
    })
  }


ngOnInit() {
  this.fnGetSettingValue();
  this.getAllAppointments();
  this.getCancelAppointments();
  this.getCompletedAppointments();
}

fnGetSettingValue(){
    let requestObject = {
      "business_id":this.bussinessId
    };
    this.UserService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr=response.response;
        console.log(this.settingsArr);

        this.currencySymbol = this.settingsArr.currency;
        console.log(this.currencySymbol);
        
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        console.log(this.currencySymbolPosition);
        
        this.currencySymbolFormat = this.settingsArr.currency_format;
        console.log(this.currencySymbolFormat);

        let cancellation_buffer_time=JSON.parse(this.settingsArr.cancellation_buffer_time);
        let min_rescheduling_time=JSON.parse(this.settingsArr.min_reseduling_time);
        this.isCustomerAllowedForRatingStaff=JSON.parse(this.settingsArr.customer_allow_for_staff_rating);
        console.log(cancellation_buffer_time);
        console.log(min_rescheduling_time);
        console.log(this.isCustomerAllowedForRatingStaff);
       
        this.cancellationBufferTime = new Date();
        this.cancellationBufferTime.setMinutes( this.cancellationBufferTime.getMinutes() + cancellation_buffer_time);
        console.log("cancellationBufferTime - "+this.cancellationBufferTime);

        this.minReschedulingTime = new Date();
        this.minReschedulingTime.setMinutes( this.minReschedulingTime.getMinutes() + min_rescheduling_time);
        console.log("minReschedulingTime - "+this.minReschedulingTime);
      }
      else if(response.data == false){
        
      }
    })
  }

getAllAppointments(): void{
  this.UserService.getAllAppointments().subscribe((response:any) =>{
    if(response.data == true){
      this.appointmentData = response.response;
      this.appointmentData.forEach( (element) => {
        element.bookingDateTime = new Date(element.booking_date+" "+element.booking_time);
        element.booking_timeForLabel = this.datePipe.transform(element.bookingDateTime,"hh:mm a");
        element.booking_dateForLabel = this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy");
        element.created_atForLabel = this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a");

        var dateTemp = new Date(this.datePipe.transform(element.bookingDateTime,"dd MMM yyyy hh:mm a"));
        dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
        element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")

      });
    }
    else if(response.data == false){
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
      });
      this.appointmentData = [];
    }
  })
}

getCancelAppointments(): void{
  this.UserService.getCancelAppointments().subscribe((response:any) =>{
    if(response.data == true){
      this.cancelAppointmentData = response.response;
      this.cancelAppointmentData.forEach( (element) => {
        element.booking_timeForLabel = this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
        element.booking_dateForLabel = this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy");
        element.created_atForLabel = this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a");

        var dateTemp = new Date(this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"dd MMM yyyy hh:mm a"));
        dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
        element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
      });
    }
    else if(response.data == false){
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
      });
      this.cancelAppointmentData = '';
    }
  })
}

getCompletedAppointments(): void{
  this.UserService.getCompletedAppointments().subscribe((response:any) =>{
    if(response.data == true){
      this.completedAppointmentData = response.response;
      this.completedAppointmentData.forEach( (element) => {
        element.booking_timeForLabel = this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
        element.booking_dateForLabel = this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy");
        element.created_atForLabel = this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a");

        var dateTemp = new Date(this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"dd MMM yyyy hh:mm a"));
        dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
        element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
      });
    }
    else if(response.data == false){
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
      });
      this.completedAppointmentData = '';
    }
  })
}

// Dialogs

  ratenow(booking_id) {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data:{appoData: booking_id}
    });

     dialogRef.afterClosed().subscribe(result => {
      this.getAllAppointments();
      this.getCancelAppointments();
      this.getCompletedAppointments();
      this.animal = result;
     });
  }

  cancelAppo(booking_id) {
    const dialogRef = this.dialog.open(DialogCancelReason, {
      width: '500px',
      data:{appoData: booking_id}
    });

     dialogRef.afterClosed().subscribe(result => {
      this.getAllAppointments();
      this.getCancelAppointments();
      this.getCompletedAppointments();
      this.animal = result;
     });
  }

  rescheduleAppointment(index){
    const dialogRef = this.dialog.open(rescheduleAppointmentDialog, {
      
     // height: '700px',
      data: {fulldata: this.appointmentData[index]}

    });

     dialogRef.afterClosed().subscribe(result => {
      this.getAllAppointments();
      this.getCancelAppointments();
      this.getCompletedAppointments();
     });
  }

  invoice(index) {
    const dialogRef = this.dialog.open(DialogInvoiceDialog, {
      width: '1000px',
      height: 'auto',
      data: {fulldata: this.completedAppointmentData[index]}

    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  MyAppointmentDetails(index){
    const dialogRef = this.dialog.open(DialogMyAppointmentDetails, {
      
      height: '700px',
      data: {fulldata: this.appointmentData[index],index:index}

    });

     dialogRef.afterClosed().subscribe(result => {
      this.getAllAppointments();
      this.getCancelAppointments();
      this.getCompletedAppointments();
     });
  }

  details_dialog(index) {
    const dialogRef = this.dialog.open(DialogCancelAppointmentDetails, {
     
      height: '700px',
      data: {fulldata: this.cancelAppointmentData[index]}

    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  complete_details_dialog(index) {
    const dialogRef = this.dialog.open(DialogCompleteAppointmentDetails, {
     
      height: '700px',
      data: {fulldata: this.completedAppointmentData[index]}

    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }
  fnTabValue(event){
    this.search.keyword = null;
    if(event == 0){
      this.openedTab = 'new';
    }else if(event == 1){
      this.openedTab = 'cancel';
    }else if(event == 2){
      this.openedTab = 'completed';
    }
  }
  payAppoint(index){
    this.appointDetailForPayment = this.appointmentData[index];
    console.log(this.appointDetailForPayment);
    this.paymentScreen = true;
  }
  fnPaymentMethod(paymentMethod){
    console.log(paymentMethod);
    if(paymentMethod == 'Stripe'){
      this.paymentMethod="Stripe";
      this.creditcardform =true;
      this.showPaypalButtons =false;
      this.transactionId=null;
      this.paymentDateTime=this.datePipe.transform(new Date(),"yyyy-MM-dd HH:mm:ss");
    }
    if(paymentMethod == 'Paypal'){
      this.creditcardform =false;
      this.showPaypalButtons =true;
      this.showPayUMoneyButton =false;
      this.paymentMethod="Paypal";
      this.transactionId=null;
      this.paymentDateTime=new Date();
    }
    if(paymentMethod == 'PayUMoney'){
      this.creditcardform =false;
      this.showPaypalButtons =false;
      this.showPayUMoneyButton =true;
      this.paymentMethod="PayUMoney";
      this.transactionId=null;
      this.paymentDateTime=new Date();
    }
  }
  fnBackToPayment(){
    this.paymentScreen = false;
  }
  fnPayNow(){
    if(this.paymentMethod == 'Stripe'){
      this.stripePayment();
    }
    if(this.paymentMethod == 'PayUMoney'){
     this.fnPayUMoney();
    }
  }

  stripePayment(){
    this.isLoader=true;
    if(this.cardForm.valid){
      let requestObject ={
        "name" : this.cardForm.get("cardHolderName").value,
        "number" : this.cardForm.get("cardNumber").value,
        "exp_month" : this.cardForm.get("expiryMonth").value,
        "exp_year" : this.cardForm.get("expiryYear").value,
        "cvc" : this.cardForm.get("cvvCode").value,
        "amount" : this.appointDetailForPayment.total_cost,
      }
      this.UserService.customerStripePayment(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          let digit5= Math.floor(Math.random()*90000) + 10000;
          this.reference_id="2_"+digit5+"_"+ this.datePipe.transform(new Date(),"yyyy/MM/dd") ;
          this.transactionId = response.response.id 
          this.paymentDateTime = this. datePipe.transform(new Date(),"yyyy/MM/dd");
          this.isLoader=false;
          this.confirmPayment();
        }
        else if(response.data == false){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
        this.isLoader=false;
      })  
    }
  }
  
  private initConfig(): void {

    this.payPalConfig = {
    currency: this.currencySymbol,
    clientId: 'AfM8281lH1hKV3Hk_RRwe5gT95do6JeBc9X3KUBSW6407yMP1nJoY820GscNd4gNP8q8fAnrZoEyayL7',
    // clientId: 'AbwWitbWZcWZGJdguSL2wb-XcgF8KGTHps1c_w9u9t0CMN2uUoBTDSpU5NFJa5qnfN_YYaG_k-9OKfk8',
    // clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: this.reference_id,
          amount: {
            currency_code: this.currencySymbol,
            value: JSON.stringify(this.appointDetailForPayment.total_cost),
            // breakdown: {
            //   item_total: {
            //     currency_code: this.currencySymbol,
            //     value: JSON.stringify(this.serviceMainArr.subtotal)
            //   },
            //   tax_total : {
            //     currency_code: this.currencySymbol,
            //     value: JSON.stringify(this.taxAmount)
            //   },
            //   discount : {
            //     currency_code: this.currencySymbol,
            //     value: JSON.stringify(this.serviceMainArr.discount)
            //   }
            // }
          },
          items: this.appointDetailForPayment,
          // items: [
          //   {
          //     name: 'Enterprise Subscription',
          //     quantity: '1',
          //     description : 'quantity 1',
          //     category: 'DIGITAL_GOODS',
          //    // tax:{currency_code:"USD", value:"1.00"},
          //     unit_amount: {
          //       currency_code: 'USD',
          //       value: '8.99',
          //     }
          //   },
          //   {
          //     name: 'Enterprise Subscription2',
          //     quantity: '1',
          //     description : 'quantity 1',
          //     category: 'DIGITAL_GOODS',
          //    // tax:{currency_code:"USD", value:"1.00"},
          //     unit_amount: {
          //       currency_code: 'USD',
          //       value: '8.99',
          //     }
          //   }
          // ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical',
      size: "responsive"
    },
    onApprove: (data, actions) => {
    this.isLoader=true
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then(details => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      //this.showSuccess = true;
      if(data.status && data.status== "COMPLETED"){
        this.transactionId=data.id;
        this.paymentDateTime= this.datePipe.transform(data.create_time,"yyyy-MM-dd HH:mm:ss");
        console.log(this.transactionId+" "+this.paymentDateTime);
        this.confirmPayment();
      }
      //this.fnAppointmentBooking();
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
      this._snackBar.open("Transaction Cancelled", "X", {
      duration: 2000,
      verticalPosition: 'top',
      panelClass : ['red-snackbar']
      });
    },
    onError: err => {
      console.log('OnError', err);
      this._snackBar.open("Error: "+err, "X", {
      duration: 2000,
      verticalPosition: 'top',
      panelClass : ['red-snackbar']
      });
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  //   // onInit is called when the button first renders
  // onInit: function(data, actions) {

  //   // Disable the buttons
  //   actions.disable();

  //   // Listen for changes to the checkbox
  //   document.querySelector('#check').addEventListener('change', function(event) {

  //       // Enable or disable the button when it is checked or unchecked
  //       if (event.target.checked) {
  //         actions.enable();
  //       } else {
  //         actions.disable();
  //       }
  //     });
  // },

  // // onClick is called when the button is clicked
  // onClick: function() {

  //   // Show a validation error if the checkbox is not checked
  //   if (!document.querySelector('#check').checked) {
  //     // document.querySelector('#error').classList.remove('hidden');
  //   }
  // }
  };
  }

  guid() {
    return this.s4() + this.s4() + this.s4() + this.s4();
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  getTxnId(){
    return this.guid();
  }
  fnPayUMoney(){
      
    this.PayUMoney.txnid= this.getTxnId();
    this.PayUMoney.amount= this.appointDetailForPayment.total_cost.toString();
    this.PayUMoney.firstname= this.appointDetailForPayment.customer.fullname;
    this.PayUMoney.email= this.appointDetailForPayment.customer.email,
    this.PayUMoney.phone= this.appointDetailForPayment.customer.phone,
    this.PayUMoney.productinfo= 'Product Description';
    this.PayUMoney.surl= environment.urlForLink;
    this.PayUMoney.furl= environment.urlForLink;
    this.PayUMoney.mode='dropout';// non-mandatory for Customized Response Handling
    this.PayUMoney.udf1='';
    this.PayUMoney.udf2='';
    this.PayUMoney.udf3='';
    this.PayUMoney.udf4='';
    this.PayUMoney.udf5='';

    // #Where salt is available on the PayUMoney dashboard.
    var RequestData = {
      key: this.PayUMoney.key,
      txnid: this.PayUMoney.txnid,
      hash: '',
      amount: this.PayUMoney.amount,
      firstname: this.PayUMoney.firstname,
      email: this.PayUMoney.email,
      phone: this.PayUMoney.phone,
      productinfo: this.PayUMoney.productinfo,
      surl : this.PayUMoney.surl,
      furl: this.PayUMoney.furl,
      // mode:this.PayUMoney.mode// non-mandatory for Customized Response Handling
    }
    this.generateRequestHash(RequestData);
    console.log(JSON.stringify(RequestData));
    var Handler = {
      responseHandler: (BOLT) => {
        console.log(JSON.stringify(BOLT));
        if(BOLT && BOLT.response.txnStatus == "SUCCESS"){
          let generatedHash=this.generateResponseHash(BOLT.response);
          if(BOLT.response.hash == generatedHash){
            this.reference_id=BOLT.response.txnid;
            this.transactionId=BOLT.response.payuMoneyId;
            this.paymentDateTime= this.datePipe.transform(BOLT.response.addedon,"yyyy-MM-dd HH:mm:ss");
            this.confirmPayment();
            console.log("SUCCESS");
          }
        }else if(BOLT && BOLT.response.txnStatus == "FAILED"){
          this._snackBar.open("Transaction Failed", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }else if(BOLT && BOLT.response.txnStatus == "CANCEL"){
          this._snackBar.open(BOLT.response.txnMessage, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        // your payment response Code goes here, BOLT is the response object
      },
      catchException: function(BOLT){
        console.log(BOLT);
        // the code you use to handle the integration errors goes here
      }
    }
    //bolt.launch( RequestData , Handler ); 
  }

  generateRequestHash(RequestData) {
    var string = RequestData.key + '|' + RequestData.txnid + '|' + RequestData.amount + '|' + RequestData.productinfo + '|' + RequestData.firstname + '|' + RequestData.email+'|'+this.PayUMoney.udf1+'|'+this.PayUMoney.udf2+'|'+this.PayUMoney.udf3+'|'+this.PayUMoney.udf4+'|'+this.PayUMoney.udf5+'|'+'|'+'|'+'|'+'|'+'|'+this.PayUMoney.salt;
          
    var encrypttext = sha512(string);
    RequestData.hash = encrypttext;
 }
 // (d: Date | null): string => {
  generateResponseHash(Response) {
    var string = this.PayUMoney.salt +'|'+Response.status+'|'+'|'+'|'+'|'+'|'+'|'+Response.udf5+'|'+this.PayUMoney.udf4+'|'+this.PayUMoney.udf3+'|'+this.PayUMoney.udf2+'|'+this.PayUMoney.udf1+'|'+Response.email+'|'+Response.firstname+'|'+Response.productinfo+'|'+Response.amount+'|'+Response.txnid+'|'+Response.key;
          
    var encrypttext = sha512(string);
    return encrypttext;
 }

  
  confirmPayment(){
    this.isLoader=true;
    let requestObject ={
      "order_item_id" : this.appointDetailForPayment.id,
      "payment_date" : this.datePipe.transform(new Date(),"yyyy/MM/dd"),
      "payment_method" : this.paymentMethod,
      "reference_id" : this.reference_id,
      "transaction_id" : this.transactionId,
      "amount" : this.appointDetailForPayment.total_cost,
      "payment_notes" : this.customerPaymentNote,
    }
    this.UserService.customerPaymentUpdate(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
        this.fnBackToPayment();
      }
      else if(response.data == false){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
      this.isLoader=false;
    })  
  }

  frontBooking(){
    this.router.navigate(['/booking']);
  }
  customerSearchAppointment(){

    this.isLoader=true;
    if(this.search.keyword.length > 1){
      let requestObject = {
        "search":this.search.keyword,
        "customer_id":this.customerId,
        "business_id":this.bussinessId,
        "booking_type" : this.openedTab
      }
      console.log(requestObject);
      this.UserService.customerSearchAppointment(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          if(this.openedTab == 'new'){
            this.appointmentData = response.response;
            console.log(this.appointmentData)
            this.appointmentData.forEach( (element) => {
              element.bookingDateTime = new Date(element.booking_date+" "+element.booking_time);
              element.booking_timeForLabel = this.datePipe.transform(element.bookingDateTime,"hh:mm a");
              element.booking_dateForLabel = this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy");
              element.created_atForLabel = this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a");
      
              var dateTemp = new Date(this.datePipe.transform(element.bookingDateTime,"dd MMM yyyy hh:mm a"));
              dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
              element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
      
            });
          }else if(this.openedTab == 'cancel'){
            this.cancelAppointmentData = response.response;
            this.cancelAppointmentData.forEach( (element) => {
              element.booking_timeForLabel = this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
              element.booking_dateForLabel = this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy");
              element.created_atForLabel = this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a");
      
              var dateTemp = new Date(this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"dd MMM yyyy hh:mm a"));
              dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
              element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
            });
          }else if(this.openedTab == 'completed'){
            this.completedAppointmentData = response.response;
            this.completedAppointmentData.forEach( (element) => {
              element.booking_timeForLabel = this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
              element.booking_dateForLabel = this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy");
              element.created_atForLabel = this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a");

              var dateTemp = new Date(this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"dd MMM yyyy hh:mm a"));
              dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
              element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
            });
          }
          this.isLoader=false;
        }
        else if(response.data == false){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
          this.appointmentData = [];
          this.cancelAppointmentData = [];
          this.completedAppointmentData = [];
          this.isLoader=false;
        }
      })
    }else{
      this.getAllAppointments();
      this.getCancelAppointments();
      this.getCompletedAppointments();
      this.isLoader=false;
    }
    
  }


}

@Component({
  selector: 'dialog-rate-review',
  templateUrl: '../_dialogs/dialog-rate-review.html',
})
export class DialogOverviewExampleDialog {

  appoId: any;
  ratingValueNo: any;
  ratingTitle: any;
  ratingDecreption: any;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private UserService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.appoId = this.data.appoData;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ratingValue(event){
    this.ratingValueNo = event.srcElement.value
  }
  fnRatingSubmit(){
    this.ratingToAppointment(this.appoId,this.ratingValueNo,this.ratingTitle,this.ratingDecreption);
  }
  ratingToAppointment(appoId,ratingValueNo,ratingTitle,ratingDecreption): void{
    this.UserService.ratingToAppointment(appoId,ratingValueNo,ratingTitle,ratingDecreption).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Review Submited", "X", {
          duration: 2000,
          verticalPosition:'bottom',
          panelClass :['green-snackbar']
          });
        this.dialogRef.close();
      }
      else if(response.data == false){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
  }

}
@Component({
  selector: 'cancel-reason-dialog',
  templateUrl: '../_dialogs/cancel-reason-dialog.html',
})
export class DialogCancelReason {

  appoId: any;
  cancelReason: any;
  constructor(
    public dialogRef: MatDialogRef<DialogCancelReason>,
    private UserService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.appoId = this.data.appoData;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  fnCancelsubmit(){
    this.cancelAppointment(this.appoId,this.cancelReason);
    
    this.dialogRef.close();
  }

  cancelAppointment(appoId,cancelReason): void{
    this.UserService.cancelAppointment(appoId,cancelReason).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Canceled", "X", {
          duration: 2000,
          verticalPosition:'bottom',
          panelClass :['green-snackbar']
          });
      }
      else if(response.data == false){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
  }
}


@Component({
	  selector: 'dialog-invoice',
	  templateUrl: '../_dialogs/dialog-invoice.html',
    providers: [DatePipe]
	})
	export class DialogInvoiceDialog {
    myAppoDetailData: any;
    bussinessId:any;
    tax:any;
    businessData:any;
    settingsArr: any;
    currencySymbol:any;
    currencySymbolPosition:any;
    currencySymbolFormat:any;

	  constructor(
	    public dialogRef: MatDialogRef<DialogInvoiceDialog>,
      private authenticationService: AuthenticationService,
      private UserService: UserService,
      public datePipe: DatePipe,
      private _snackBar: MatSnackBar,
	    @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
        this.tax = JSON.parse(this.myAppoDetailData.tax)
        this.myAppoDetailData.invoice_date=this.datePipe.transform(new Date(), 'dd/MM/yyyy');
        this.myAppoDetailData.invoiceNumber = "2"+this.myAppoDetailData.id+this.datePipe.transform(new Date(),"yyyy/MM/dd");
        console.log(this.myAppoDetailData);
        this.bussinessId=this.authenticationService.currentUserValue.business_id;
        this.getBusinessDetail();
        this.fnGetSettingValue();
      }

	  onNoClick(): void {
	    this.dialogRef.close();
    }
    getBusinessDetail(){
      let requestObject = {
        "business_id":this.bussinessId
      };
      this.UserService.getBusinessDetail(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.businessData=response.response;
          console.log(this.businessData);
        }
        else if(response.data == false){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
      })
    }
    fnGetSettingValue(){
      let requestObject = {
        "business_id":this.bussinessId
      };
      this.UserService.getSettingValue(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.settingsArr=response.response;
          console.log(this.settingsArr);

          this.currencySymbol = this.settingsArr.currency;
          console.log(this.currencySymbol);
          
          this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
          console.log(this.currencySymbolPosition);
          
          this.currencySymbolFormat = this.settingsArr.currency_format;
          console.log(this.currencySymbolFormat);
        }
        else if(response.data == false){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
      })
    }
    fnPrint(){
      const printContent = document.getElementById("printInvoice");
      const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
      // WindowPrt.close();
    }

	}

  @Component({
    selector: 'dialog-cancel-appointment-details',
    templateUrl: '../_dialogs/dialog-cancel-appointment-details.html',
  })
  export class DialogCancelAppointmentDetails {
    myAppoDetailData: any;
    bussinessId : any;
    settingsArr: any;
    currencySymbol:any;
    currencySymbolPosition:any;
    currencySymbolFormat:any;
    activityLog:any=[];
    constructor(
      public dialogRef: MatDialogRef<DialogCancelAppointmentDetails>,
      private authenticationService: AuthenticationService,
      private UserService: UserService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
        this.fnGetActivityLog(this.myAppoDetailData.id);
        this.bussinessId=this.authenticationService.currentUserValue.business_id;
        this.fnGetSettingValue();
      }

    onNoClick(): void {
      this.dialogRef.close();
    }

    fnGetActivityLog(orderItemId){
      let requestObject = {
        "order_item_id":orderItemId
      };
      this.UserService.getActivityLog(requestObject).subscribe((response:any) => {
        if(response.data == true){
          console.log(response.response);
          this.activityLog=response.response;
        }
        else if(response.data == false){
          this.activityLog=[];
        }
      })
    }

    fnGetSettingValue(){
      let requestObject = {
        "business_id":this.bussinessId
      };
      this.UserService.getSettingValue(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.settingsArr=response.response;
          console.log(this.settingsArr);

          this.currencySymbol = this.settingsArr.currency;
          console.log(this.currencySymbol);
          
          this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
          console.log(this.currencySymbolPosition);
          
          this.currencySymbolFormat = this.settingsArr.currency_format;
          console.log(this.currencySymbolFormat);
        }
        else if(response.data == false){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
      })
    }

  }

  @Component({
    selector: 'dialog-my-appointment-details',
    templateUrl: '../_dialogs/dialog-my-appointment-details.html',
  })
  export class DialogMyAppointmentDetails {
    myAppoDetailData: any;
    index: any;
    animal : any;
    bussinessId : any;
    settingsArr: any;
    currencySymbol:any;
    currencySymbolPosition:any;
    currencySymbolFormat:any;
    activityLog:any=[];
    constructor(
      public dialogRef: MatDialogRef<DialogMyAppointmentDetails>,
      private authenticationService: AuthenticationService,
      private UserService: UserService,
      private _snackBar: MatSnackBar,
       public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
        this.fnGetActivityLog(this.myAppoDetailData.id);
        console.log(this.myAppoDetailData)
        this.index = this.data.index;
        console.log(this.index)
        this.bussinessId=this.authenticationService.currentUserValue.business_id;
        this.fnGetSettingValue();
      }
    onNoClick(): void {
      this.dialogRef.close();
    }

    fnGetActivityLog(orderItemId){
      let requestObject = {
        "order_item_id":orderItemId
      };
      this.UserService.getActivityLog(requestObject).subscribe((response:any) => {
        if(response.data == true){
          console.log(response.response);
          this.activityLog=response.response;
        }
        else if(response.data == false){
          this.activityLog=[];
        }
      })
    }

    fnGetSettingValue(){
      let requestObject = {
        "business_id":this.bussinessId
      };
      this.UserService.getSettingValue(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.settingsArr=response.response;
          console.log(this.settingsArr);

          this.currencySymbol = this.settingsArr.currency;
          console.log(this.currencySymbol);
          
          this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
          console.log(this.currencySymbolPosition);
          
          this.currencySymbolFormat = this.settingsArr.currency_format;
          console.log(this.currencySymbolFormat);
        }
        else if(response.data == false){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
      })
    }

    cancelAppo(booking_id) {
      const dialogRef = this.dialog.open(DialogCancelReason, {
        width: '500px',
        data:{appoData: booking_id}
      });
  
       dialogRef.afterClosed().subscribe(result => {
        this.animal = result;
       });
    }
    rescheduleAppointment(){
      const dialogRef = this.dialog.open(rescheduleAppointmentDialog, {
        
       // height: '700px',
        data: {fulldata: this.myAppoDetailData}
  
      });
  
       dialogRef.afterClosed().subscribe(result => {
        this.dialogRef.close();
       });
    }
  }

@Component({
  selector: 'reschedule-appointment-dialog',
  templateUrl: '../_dialogs/reschedule-appointment-dialog.html',
  providers: [DatePipe]
})
export class rescheduleAppointmentDialog {
  myAppoDetailData: any;
  minDate = new Date();
  formAppointmentReschedule: FormGroup;
  timeSlotArr:any= [];
  availableStaff:any= [];
  selectedDate:any;
  constructor(
    public dialogRef: MatDialogRef<rescheduleAppointmentDialog>,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.myAppoDetailData = this.data.fulldata;
      console.log(JSON.stringify(this.myAppoDetailData));
      //this.fnGetOffDays();
      this.formAppointmentReschedule = this._formBuilder.group({
        rescheduleServiceId: ['', Validators.required],
        rescheduleDate: ['', Validators.required],
        rescheduleTime: ['', Validators.required],
        rescheduleStaff: ['', Validators.required],
        rescheduleNote: [''],
      });
      this.formAppointmentReschedule.controls['rescheduleServiceId'].setValue(this.myAppoDetailData.service.id);
    }

    // fnGetOffDays(){
    //   let requestObject = {
    //     "business_id":2
    //   };
    //   let headers = new HttpHeaders({
    //     'Content-Type': 'application/json',
    //   });

    //   this.http.post(`${environment.apiUrl}/list-holidays`,requestObject,{headers:headers} ).pipe(
    //     map((res) => {
    //       return res;
    //     }),
    //     catchError(this.handleError)
    //     ).subscribe((response:any) => {
    //       if(response.data == true){
    //         this.offDaysList = response.response;
    //         //alert(JSON.stringify(this.offDaysList));
    //       }
    //       else{

    //       }
    //     },
    //     (err) =>{
    //       console.log(err)
    //     })
    //   }

      fnDateChange(event: MatDatepickerInputEvent<Date>) {
        console.log(this.datePipe.transform(new Date(event.value),"yyyy-MM-dd"));
        let date = this.datePipe.transform(new Date(event.value),"yyyy-MM-dd");
        this.selectedDate=date;
        this.formAppointmentReschedule.controls['rescheduleTime'].setValue(null);
        this.formAppointmentReschedule.controls['rescheduleStaff'].setValue(null);
        this.timeSlotArr= [];
        this.availableStaff= [];
        this.fnGetTimeSlots(this.myAppoDetailData.service.id,date);
      }

      fnGetTimeSlots(rescheduleServiceId,rescheduleDate){
        let requestObject = {
          "business_id":this.myAppoDetailData.business_id,
          "selected_date":rescheduleDate
        };
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });

        this.http.post(`${environment.apiUrl}/list-availabel-timings`,requestObject,{headers:headers} ).pipe(
          map((res) => {
            return res;
          }),
         // catchError(this.handleError)
          ).subscribe((response:any) => {
            if(response.data == true){
              this.timeSlotArr=response.response;
              console.log(this.timeSlotArr);
            }
            else if(response.data == false){
              this._snackBar.open(response.response, "X", {
                duration: 2000,
                verticalPosition:'top',
                panelClass :['red-snackbar']
              });
            }
          },
          (err) =>{
            console.log(err)
          })
        }
     
        fnChangeTimeSlot(event){
          console.log(event);
          this.formAppointmentReschedule.controls['rescheduleStaff'].setValue(null);
          this.fnGetStaff(event);
        }

        fnGetStaff(slot){
          let requestObject = {
            "business_id":this.myAppoDetailData.business_id,
            "book_date":this.selectedDate,
            "book_time":slot,
            "postal_code":this.myAppoDetailData.postal_code,
            "service_id":this.myAppoDetailData.service.id
          };
          let headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });

          this.http.post(`${environment.apiUrl}/service-staff`,requestObject,{headers:headers} ).pipe(
            map((res) => {
              return res;
            }),
            //catchError(this.handleError)
          ).subscribe((response:any) => {
            if(response.data == true){
                this.availableStaff = response.response;
                console.log(JSON.stringify(this.availableStaff));
            }
              else if(response.data == false){
                this._snackBar.open(response.response, "X", {
                  duration: 2000,
                  verticalPosition:'top',
                  panelClass :['red-snackbar']
                });
              this.availableStaff.length=0;
            }
            },
            (err) =>{
              console.log(err)
            })
        }

  onNoClick(): void {
    this.dialogRef.close();
  }
  formRescheduleSubmit(){
    if(this.formAppointmentReschedule.invalid){
      return false;
    }

    // console.log(this.myAppoDetailData.order_id);
    // console.log(this.formAppointmentReschedule.get('rescheduleServiceId').value);
    // console.log(this.datePipe.transform(new Date(this.formAppointmentReschedule.get('rescheduleDate').value),"yyyy-MM-dd"));
    // console.log(this.formAppointmentReschedule.get('rescheduleTime').value);
    // console.log(this.formAppointmentReschedule.get('rescheduleStaff').value);
    // console.log(this.formAppointmentReschedule.get('rescheduleNote').value);
    let requestObject = {
     "order_item_id":JSON.stringify(this.myAppoDetailData.id),
     "staff_id":this.formAppointmentReschedule.get('rescheduleStaff').value,
     "book_date":this.datePipe.transform(new Date(this.formAppointmentReschedule.get('rescheduleDate').value),"yyyy-MM-dd"),
     "book_time":this.formAppointmentReschedule.get('rescheduleTime').value,
     "book_notes":this.formAppointmentReschedule.get('rescheduleNote').value
    };
    this.userService.rescheduleAppointment(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Rescheduled", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
          this.dialogRef.close();
     }
      
     else if(response.data == false){
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
      });
    }
    })
  }
}




  @Component({
    selector: 'dialog-complete-appointment-details',
    templateUrl: '../_dialogs/dialog-complete-appointment-details.html',
  })
  export class DialogCompleteAppointmentDetails {
    myAppoDetailData: any;
    animal: string;
    bussinessId : any;
    settingsArr: any;
    currencySymbol:any;
    currencySymbolPosition:any;
    currencySymbolFormat:any;
    activityLog:any=[];
    constructor(
      public dialogRef: MatDialogRef<DialogCompleteAppointmentDetails>,
      private authenticationService: AuthenticationService,
      private UserService: UserService,
      public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
        this.fnGetActivityLog(this.myAppoDetailData.id);
        this.bussinessId=this.authenticationService.currentUserValue.business_id;
        this.fnGetSettingValue();
      }

    onNoClick(): void {
      this.dialogRef.close();
    }

    fnGetActivityLog(orderItemId){
      let requestObject = {
        "order_item_id":orderItemId
      };
      this.UserService.getActivityLog(requestObject).subscribe((response:any) => {
        if(response.data == true){
          console.log(response.response);
          this.activityLog=response.response;
        }
        else if(response.data == false){
          this.activityLog=[];
        }
      })
    }

    fnGetSettingValue(){
      let requestObject = {
        "business_id":this.bussinessId
      };
      this.UserService.getSettingValue(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.settingsArr=response.response;
          console.log(this.settingsArr);

          this.currencySymbol = this.settingsArr.currency;
          console.log(this.currencySymbol);
          
          this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
          console.log(this.currencySymbolPosition);
          
          this.currencySymbolFormat = this.settingsArr.currency_format;
          console.log(this.currencySymbolFormat);
        }
        else if(response.data == false){
          
        }
      })
    }
    ratenow(booking_id) {
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        width: '500px',
        data:{appoData: booking_id}
      });
  
       dialogRef.afterClosed().subscribe(result => {
        this.animal = result;
       });
    }

  }


