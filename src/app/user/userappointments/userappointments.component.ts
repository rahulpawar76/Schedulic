import { Component, Inject, OnInit, ElementRef, ViewChild, ɵConsole } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { UserService } from '../_services/user.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
import * as domtoimage from 'dom-to-image';
 import * as jspdf from 'jspdf';
// import * as jspdf from 'jspdf';


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
  
  private payPalConfig?: IPayPalConfig;
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
  paypalSetting:any;
  paypalTestMode:boolean = false;
  paypalClientId: any;
  paypalStatus:boolean = false;
  
  PayUMoneyCredentials:any;
  payUmoneyStatus : boolean = false;
  stripeSetting:any;
  stripeStatus : boolean = false;

  taxAmount:any=0;
  taxAmountArr:any=[];

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
      cardNumber: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(20)]],
      expiryMonth: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(2)]],
      expiryYear: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(4)]],
      cvvCode: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(6)]],
    })
  }


  ngOnInit() {
    this.fnGetSettingValue();
    this.getAllAppointments();
    this.getCancelAppointments();
    this.getCompletedAppointments();
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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
        this.currencySymbolFormat = this.settingsArr.currency_format;

        let cancellation_buffer_time=JSON.parse(this.settingsArr.cancellation_buffer_time);
        let min_rescheduling_time=JSON.parse(this.settingsArr.min_reseduling_time);
        this.isCustomerAllowedForRatingStaff=JSON.parse(this.settingsArr.customer_allow_for_staff_rating);

       
        this.cancellationBufferTime = new Date();
        this.cancellationBufferTime.setMinutes( this.cancellationBufferTime.getMinutes() + cancellation_buffer_time);

        this.minReschedulingTime = new Date();
        this.minReschedulingTime.setMinutes( this.minReschedulingTime.getMinutes() + min_rescheduling_time);
       
        if(this.settingsArr.pay_pal_settings){
          this.paypalSetting = JSON.parse(this.settingsArr.pay_pal_settings)
          this.paypalTestMode = this.paypalSetting.test_mode;
          if(this.paypalTestMode){
            this.paypalClientId="sb";
          }else{
            this.paypalClientId = this.paypalSetting.client_id;
          }
          this.paypalStatus = this.paypalSetting.status;
  
        }
        if(this.settingsArr.payUmoney_settings){
          this.PayUMoneyCredentials = JSON.parse(this.settingsArr.payUmoney_settings);
          this.PayUMoney.key= this.PayUMoneyCredentials.merchant_key;
          this.PayUMoney.salt=this.PayUMoneyCredentials.salt_key;
          this.payUmoneyStatus=this.PayUMoneyCredentials.status;
        }
        if(this.settingsArr.stripe_settings){
          this.stripeSetting = JSON.parse(this.settingsArr.stripe_settings)
          this.stripeStatus = this.stripeSetting.status
        }
        this.initConfig();
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        
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
        
        this.appointmentData = this.appointmentData.sort(this.dynamicSort("-created_at"))
        
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
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
        this.cancelAppointmentData = this.cancelAppointmentData.sort(this.dynamicSort("-updated_at"))
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition:'top',
        //   panelClass :['red-snackbar']
        // });
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
        this.completedAppointmentData = this.completedAppointmentData.sort(this.dynamicSort("-updated_at"))
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition:'top',
        //   panelClass :['red-snackbar']
        // });
        this.completedAppointmentData = '';
      }
    })
  }

// Dialogs

  ratenow(booking_id,staff_id) {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data:{appoData: booking_id, staffId : staff_id}
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
      data: {fulldata: this.appointmentData[index]}
    });

     dialogRef.afterClosed().subscribe(result => {
      this.getAllAppointments();
      this.getCancelAppointments();
      this.getCompletedAppointments();
     });
  }

  invoice(appointmentType, index) {
    if(appointmentType == 'newAppointment'){
      
    const dialogRef = this.dialog.open(DialogInvoiceDialog, {
      width: '1000px',
      height: 'auto',
      data: {fulldata: this.appointmentData[index]}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
    } else if(appointmentType == 'completedAppointment'){

      const dialogRef = this.dialog.open(DialogInvoiceDialog, {
        width: '1000px',
        height: 'auto',
        data: {fulldata: this.completedAppointmentData[index]}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.animal = result;
       });
    }

  }

  MyAppointmentDetails(index){
   
    const dialogRef = this.dialog.open(DialogMyAppointmentDetails, {
      height: '700px',
      // disableClose: true,
      data: {fulldata: this.appointmentData[index],index:index}

    });

     dialogRef.afterClosed().subscribe(result => {
      this.getAllAppointments();
      this.getCancelAppointments();
      this.getCompletedAppointments();
     });
    //  dialogRef.keydownEvents().subscribe(event => {
    //     if (event.key === "Escape") {
    //         dialogRef.close();
    //     }
    // });
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
    this.taxAmount=0;
    if(this.appointDetailForPayment.tax){
      this.taxAmountArr=JSON.parse(this.appointDetailForPayment.tax);
      this.taxAmountArr.forEach(element=>{
        this.taxAmount=this.taxAmount+element.amount;
      });
    }else{
      this.taxAmount=0;
      this.taxAmountArr=[];
    }
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
      let digit5= Math.floor(Math.random()*90000) + 10000;
      this.reference_id="2_"+digit5+"_"+ this.datePipe.transform(new Date(),"yyyy/MM/dd") ;
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
    
    if(this.cardForm.valid){
      let requestObject ={
        "name" : this.cardForm.get("cardHolderName").value,
        "number" : this.cardForm.get("cardNumber").value,
        "exp_month" : this.cardForm.get("expiryMonth").value,
        "exp_year" : this.cardForm.get("expiryYear").value,
        "cvc" : this.cardForm.get("cvvCode").value,
        "amount" : this.appointDetailForPayment.total_cost,
      }
      this.isLoader=true;
      this.UserService.customerStripePayment(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          let digit5= Math.floor(Math.random()*90000) + 10000;
          this.reference_id="2_"+digit5+"_"+ this.datePipe.transform(new Date(),"yyyy/MM/dd") ;
          this.transactionId = response.response.id 
          this.paymentDateTime = this. datePipe.transform(new Date(),"yyyy/MM/dd");
          this.isLoader=false;
          this.confirmPayment();
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
        this.isLoader=false;
      })  
    }else{
      this.cardForm.get("cardHolderName").markAsTouched();
      this.cardForm.get("cardNumber").markAsTouched();
      this.cardForm.get("expiryMonth").markAsTouched();
      this.cardForm.get("expiryYear").markAsTouched();
      this.cardForm.get("cvvCode").markAsTouched();
    }
  }
  
  private initConfig(): void {

    this.payPalConfig = {
    currency: this.currencySymbol,
    clientId: this.paypalClientId,
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: this.reference_id,
          amount: {
            currency_code: this.currencySymbol,
            value: this.appointDetailForPayment.total_cost,
            breakdown: {
              item_total: {
                currency_code: this.currencySymbol,
                value: this.appointDetailForPayment.subtotal
              },
              tax_total : {
                currency_code: this.currencySymbol,
                value: JSON.stringify(this.taxAmount)
              },
              discount : {
                currency_code: this.currencySymbol,
                value: this.appointDetailForPayment.discount
              }
            }
          },
          items: [
            {
              name: this.appointDetailForPayment.service.service_name,
              quantity: '1',
              description : 'Actual Quantity - '+JSON.stringify(this.appointDetailForPayment.service_qty),
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: this.currencySymbol,
                value: this.appointDetailForPayment.subtotal,
              }
            }
          ]
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
          panelClass :['green-snackbar']
        });
        this.fnBackToPayment();
        this.getAllAppointments();
        this.cardForm.reset();
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
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
    const dialogRef = this.dialog.open(DialogNewCustomerAppointment, {
      width: '750px',
      data: {}
    });
     dialogRef.afterClosed().subscribe(result => {
       
      this.getAllAppointments();
      this.getCancelAppointments();
      this.getCompletedAppointments();


     });
  //  this.router.navigate(['/booking']);
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
        else if(response.data == false && response.response !== 'api token or userid invaild'){
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
  staffId: any;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private UserService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.appoId = this.data.appoData;
      this.staffId = this.data.staffId;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ratingValue(event){
    this.ratingValueNo = event.srcElement.value
  }
  fnRatingSubmit(){
    console.log(this.appoId);
    console.log(this.ratingValueNo);
    console.log(this.ratingTitle);
    console.log(this.ratingDecreption);
    if(this.appoId == undefined || this.ratingValueNo == undefined || this.ratingTitle == undefined || this.ratingDecreption == undefined)
    {
      return false;
    }
    
    this.ratingToAppointment(this.appoId,this.ratingValueNo,this.ratingTitle,this.ratingDecreption);
  }
  ratingToAppointment(appoId,ratingValueNo,ratingTitle,ratingDecreption): void{
		let requestObject = {
			"order_id":appoId,
			"rating_title" : ratingTitle,
			"rating" : ratingValueNo,
      "review" : ratingDecreption,
      "staff_id" : this.staffId
		};
    this.UserService.ratingToAppointment(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Review Submited", "X", {
          duration: 2000,
          verticalPosition:'bottom',
          panelClass :['green-snackbar']
          });
        this.dialogRef.close();
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
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
		let requestObject = {
			"order_item_id":appoId,
      "cancel_notes" : cancelReason,
      "book_notes" : cancelReason,
		};
    this.UserService.cancelAppointment(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Canceled", "X", {
          duration: 2000,
          verticalPosition:'bottom',
          panelClass :['green-snackbar']
          });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
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
    eventName: any;
    // @ViewChild('printInvoice') content: ElementRef;  
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
        else if(response.data == false && response.response !== 'api token or userid invaild'){
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
        else if(response.data == false && response.response !== 'api token or userid invaild'){
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
      const WindowPrt = window.open('', '', 'left=0,top=0,width=1200,height=900,toolbar=0,scrollbars=0,status=0');
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
      // WindowPrt.close();
    }

  
    captureScreen() {

      let setLable = "invoice";
      if (!document.getElementById('printInvoice')) {
        return false;
      }

      let data = document.getElementById('printInvoice');
      let HTML_Width = document.getElementById('printInvoice').offsetWidth;
      let HTML_Height = document.getElementById('printInvoice').clientHeight;
      let top_left_margin = 35;
      let PDF_Width = HTML_Width + (top_left_margin * 2);
      let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      let canvas_image_width = HTML_Width;
      let canvas_image_height = HTML_Height;

      let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
      let today = Date.now();
      let that = this;
      domtoimage.toPng(document.getElementById('printInvoice')).then(function (blob) {
          var pdf = new jspdf('p', 'pt', [PDF_Width, PDF_Height]);
          pdf.addImage(blob, 'PNG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
          for (let i = 1; i <= totalPDFPages; i++) {
            pdf.addPage(PDF_Width, PDF_Height);
            pdf.addImage(blob, 'PNG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
          }
          pdf.save("invoice_" + today + ".pdf");
        });
    }

    fnSendInvoiceEmail(){

      let setLable = "invoice";
      if (!document.getElementById('printInvoice')) {
        // this.loader = false;
        return false;
      }
      let data = document.getElementById('printInvoice');
      let HTML_Width = document.getElementById('printInvoice').offsetWidth;
      let HTML_Height = document.getElementById('printInvoice').clientHeight;
      let top_left_margin = 35;
      let PDF_Width = HTML_Width + (top_left_margin * 2);
      let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      let canvas_image_width = HTML_Width;
      let canvas_image_height = HTML_Height;

      let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
      let today = Date.now();
      let that = this;
      var formData = new FormData();
      let customer_email = this.myAppoDetailData.customer.email;
      let order_id = this.myAppoDetailData.order_id;

      // domtoimage.toPng(document.getElementById('printInvoice')).then(function (blob) {
      //   var pdf = new jspdf('p', 'pt', [PDF_Width, PDF_Height]);
      //     pdf.addImage(blob, 'PNG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
      //     for (let i = 1; i <= totalPDFPages; i++) {
      //       pdf.addPage(PDF_Width, PDF_Height);
      //       pdf.addImage(blob, 'PNG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
      //     }

      //     pdf.save("invoice_" + today + ".pdf");
          
      //     setTimeout(() => { 

      //       var binary = btoa(pdf.output());
            formData.append('email', customer_email);
            formData.append('order_id',order_id );
            // formData.append('invoice_pdf', binary);
            that.UserService.sendInvoiceEmail(formData).subscribe((response:any) => {
                if(response.data == true){
                  that._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition:'top',
                    panelClass :['green-snackbar']
                  });
                }else if(response.data == false && response.response !== 'api token or userid invaild'){

                  that._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition:'top',
                    panelClass :['red-snackbar']
                  });
                }
            });
         // }, 5000);

      // });

        // domtoimage.toPng(document.getElementById('printInvoice'))
        //   .then(function (blob) {
        //     var pdf = new jspdf('p', 'pt', [PDF_Width, PDF_Height]);
        //     pdf.addImage(blob, 'PNG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        //     for (let i = 1; i <= totalPDFPages; i++) {
        //       pdf.addPage(PDF_Width, PDF_Height);
        //       pdf.addImage(blob, 'PNG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
        //     }
        //     console.log(pdf);
        //     // pdf.save("invoice_" + today + ".pdf");
        //     // that.loader = false;
        //     setTimeout(() => { 
              
        //       // formData.append('data' , pdf);
        //       formData.append('invoice_pdf', pdf);
        //       // formData.append('email', that.myAppoDetailData.customer.email);
        //       formData.append('email', "akie.5609@gmail.com");
        //         console.log(formData);
        //         that.UserService.sendInvoiceEmail(formData).subscribe((response:any) => {
        //           if(response.data == true){
        //             that._snackBar.open(response.response, "X", {
        //               duration: 2000,
        //               verticalPosition:'top',
        //               panelClass :['green-snackbar']
        //             });
        //           }
        //           else if(response.data == false && response.response !== 'api token or userid invaild'){
        //             that._snackBar.open(response.response, "X", {
        //               duration: 2000,
        //               verticalPosition:'top',
        //               panelClass :['red-snackbar']
        //             });
        //           }
        //         })
        //     }, 3000);
        // });
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
        else if(response.data == false && response.response !== 'api token or userid invaild'){
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
        else if(response.data == false && response.response !== 'api token or userid invaild'){
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
    providers: [DatePipe]
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
    cancellationBufferTime:any;
    minReschedulingTime:any;
    booking_date_time:any;
    timeToServiceDecimal:any;

    constructor(
      public dialogRef: MatDialogRef<DialogMyAppointmentDetails>,
      private authenticationService: AuthenticationService,
      private UserService: UserService,
      private datePipe: DatePipe,
      private _snackBar: MatSnackBar,
       public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
        this.fnGetActivityLog(this.myAppoDetailData.id);
        this.index = this.data.index;
        this.bussinessId=this.authenticationService.currentUserValue.business_id;
        this.fnGetSettingValue();
        var todayDateTime = new Date();
           this.booking_date_time=new Date( this.myAppoDetailData.booking_date+" "+ this.myAppoDetailData.booking_time);
          var dateTemp2 = new Date(this.datePipe.transform(this.booking_date_time,"dd MMM yyyy hh:mm a"));
           dateTemp2.setMinutes( dateTemp2.getMinutes());
          var serviceTimeTamp =  dateTemp2.getTime() - todayDateTime.getTime();
          this.timeToServiceDecimal=(serviceTimeTamp/60000).toFixed();
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
        else if(response.data == false && response.response !== 'api token or userid invaild'){
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
          this.currencySymbol = this.settingsArr.currency;
          this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
          this.currencySymbolFormat = this.settingsArr.currency_format;

          
            let cancellation_buffer_time=JSON.parse(this.settingsArr.cancellation_buffer_time);
            let min_rescheduling_time=JSON.parse(this.settingsArr.min_reseduling_time);

            this.cancellationBufferTime = new Date();
            this.cancellationBufferTime.setMinutes( this.cancellationBufferTime.getMinutes() + cancellation_buffer_time);

            this.minReschedulingTime = new Date();
            this.minReschedulingTime.setMinutes( this.minReschedulingTime.getMinutes() + min_rescheduling_time);
            
            
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
      })
    }

    cancelAppo(booking_id) {

      this.myAppoDetailData.booking_date_time=new Date(this.myAppoDetailData.booking_date+" "+this.myAppoDetailData.booking_time);
      var is_cancel = this.fncompereDate(this.myAppoDetailData.booking_date_time,this.settingsArr.cancellation_buffer_time);

      if(is_cancel==true){
          this._snackBar.open('Minimum notice required for Cancellation an appointment', "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
          return;
      }

      const dialogRef = this.dialog.open(DialogCancelReason, {
        width: '500px',
        data:{appoData: booking_id}
      });
  
       dialogRef.afterClosed().subscribe(result => {
        this.animal = result;
       });
    }

    rescheduleAppointment(){
    
      this.myAppoDetailData.booking_date_time=new Date(this.myAppoDetailData.booking_date+" "+this.myAppoDetailData.booking_time);
      var is_reseduling = this.fncompereDate(this.myAppoDetailData.booking_date_time,this.settingsArr.min_reseduling_time);

      if(is_reseduling==true){
          this._snackBar.open('Minimum notice required for rescheduleing an appointment.', "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
          return;
      }


      const dialogRef = this.dialog.open(rescheduleAppointmentDialog, {
        data: {fulldata: this.myAppoDetailData}
      });
  
       dialogRef.afterClosed().subscribe(result => {
        this.dialogRef.close();
       });
    }
    

    fncompereDate(APPODate,time){
      var Now = new Date();  
      var  APPO = new Date(APPODate);
      Now.setMinutes(Now.getMinutes() + parseInt(time));
      if (Now>APPO){
        return true;
      }else if (Now<APPO){
        return false;  
      } 
    }

  }

@Component({
  selector: 'reschedule-appointment-dialog',
  templateUrl: '../_dialogs/reschedule-appointment-dialog.html',
  providers: [DatePipe]
})
export class rescheduleAppointmentDialog {
  myAppoDetailData: any;
  businessId: any;
  minDate = new Date();
  formAppointmentReschedule: FormGroup;
  timeSlotArr:any= [];
  availableStaff:any= [];
  selectedDate:any;
  maxDate = new Date();

  myFilter:any;
  offDaysList:any=[];
  workingHoursOffDaysList:any=[];
  settingsArr:any=[];
  minimumAdvanceBookingTime:any;
  maximumAdvanceBookingTime:any;
  minimumAdvanceBookingDateTimeObject:any;
  maximumAdvanceBookingDateTimeObject:any;
  constructor(
    public dialogRef: MatDialogRef<rescheduleAppointmentDialog>,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.myAppoDetailData = this.data.fulldata;
      this.businessId = this.myAppoDetailData.business_id;
      console.log(JSON.stringify(this.myAppoDetailData));
      this.fnGetSettingValue();
      this.fnGetOffDays();

      this.myFilter = (d: Date | null): boolean => {
        // const day = (d || new Date()).getDay();
        // const month = (d || new Date()).getMonth();
        // Prevent Saturday and Sunday from being selected.
        // return day !== 0 && day !== 6;
        let temp:any;
        let temp2:any;
        if(this.offDaysList.length>0 || this.workingHoursOffDaysList.length>0){
          for(var i=0; i<this.offDaysList.length; i++){
            var offDay = new Date(this.offDaysList[i]);
            if(i==0){
             temp=(d.getMonth()+1!==offDay.getMonth()+1 || d.getDate()!==offDay.getDate());
            }else{
              temp=temp && (d.getMonth()+1!==offDay.getMonth()+1 || d.getDate()!==offDay.getDate());
            }
          }
          for(var i=0; i<this.workingHoursOffDaysList.length; i++){
            if(this.offDaysList.length>0){
              temp=temp && (d.getDay() !== this.workingHoursOffDaysList[i]);
            }else{
              temp=(d.getDay() !== this.workingHoursOffDaysList[i]);
            }
          }
          //return (d.getMonth()+1!==4 || d.getDate()!==30) && (d.getMonth()+1!==5 || d.getDate()!==15);
          return temp;
        }else{
          return true;
        }
      }
      this.formAppointmentReschedule = this._formBuilder.group({
        rescheduleServiceId: ['', Validators.required],
        rescheduleDate: ['', Validators.required],
        rescheduleTime: ['', Validators.required],
        rescheduleStaff: ['', Validators.required],
        rescheduleNote: ['', Validators.required],
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

    fnGetSettingValue(){
      let requestObject = {
        "business_id":this.businessId
      };
      this.userService.getSettingValue(requestObject).subscribe((response:any) => {
        if(response.data == true && response.response != ''){
          this.settingsArr=response.response;
          
          this.minimumAdvanceBookingTime=JSON.parse(this.settingsArr.min_advance_booking_time);
          this.maximumAdvanceBookingTime=JSON.parse(this.settingsArr.max_advance_booking_time);
          
          this.minimumAdvanceBookingDateTimeObject = new Date();
          this.minimumAdvanceBookingDateTimeObject.setMinutes( this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime );
          console.log("minimumAdvanceBookingDateTimeObject - "+this.minimumAdvanceBookingDateTimeObject);
          this.minDate = this.minimumAdvanceBookingDateTimeObject;

          this.maximumAdvanceBookingDateTimeObject = new Date();
          this.maximumAdvanceBookingDateTimeObject.setMinutes( this.maximumAdvanceBookingDateTimeObject.getMinutes() + this.maximumAdvanceBookingTime );
          console.log("maximumAdvanceBookingDateTimeObject - "+this.maximumAdvanceBookingDateTimeObject);
          this.maxDate = this.maximumAdvanceBookingDateTimeObject;

          // if(!this.data.appointmentData){
          //   this.formAddNewAppointmentStaffStep2.controls['customerDate'].setValue(this.minimumAdvanceBookingDateTimeObject);
          //   this.selectedDate = this.datePipe.transform(new Date(this.minimumAdvanceBookingDateTimeObject),"yyyy-MM-dd");
          // }
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          
        }
      })
    }

    fnGetOffDays(){
      let requestObject = {
        "business_id":this.businessId
      };
      this.userService.getOffDays(requestObject).subscribe((response:any) => {
        if(response.data == true){
          if(response.response.holidays.length>0){
            this.offDaysList = response.response.holidays;
          }else if(response.data == false && response.response !== 'api token or userid invaild'){
            this.offDaysList=[];
          }
          if(response.response.offday.length>0){
            this.workingHoursOffDaysList = response.response.offday;
          }else{
            this.workingHoursOffDaysList=[];
          }

          this.myFilter = (d: Date | null): boolean => {
          // const day = (d || new Date()).getDay();
          // const month = (d || new Date()).getMonth();
          // Prevent Saturday and Sunday from being selected.
          // return day !== 0 && day !== 6;
          let temp:any;
          let temp2:any;
          if(this.offDaysList.length>0 || this.workingHoursOffDaysList.length>0){
            for(var i=0; i<this.offDaysList.length; i++){
              var offDay = new Date(this.offDaysList[i]);
              if(i==0){
               temp=(d.getMonth()+1!==offDay.getMonth()+1 || d.getDate()!==offDay.getDate());
              }else{
                temp=temp && (d.getMonth()+1!==offDay.getMonth()+1 || d.getDate()!==offDay.getDate());
              }
            }
            for(var i=0; i<this.workingHoursOffDaysList.length; i++){
              if(this.offDaysList.length>0){
                temp=temp && (d.getDay() !== this.workingHoursOffDaysList[i]);
              }else{
                temp=(d.getDay() !== this.workingHoursOffDaysList[i]);
              }
            }
            //return (d.getMonth()+1!==4 || d.getDate()!==30) && (d.getMonth()+1!==5 || d.getDate()!==15);
            return temp;
          }else{
            return true;
          }
        }
        }
        else{

        }
      },
      (err) =>{
        console.log(err)
      })
    }

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
            else if(response.data == false && response.response !== 'api token or userid invaild'){
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
              else if(response.data == false && response.response !== 'api token or userid invaild'){
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
      this.formAppointmentReschedule.get('rescheduleStaff').markAsTouched();
      this.formAppointmentReschedule.get('rescheduleTime').markAsTouched();
      this.formAppointmentReschedule.get('rescheduleNote').markAsTouched();
      this.formAppointmentReschedule.get('rescheduleDate').markAsTouched();
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
      
     else if(response.data == false && response.response !== 'api token or userid invaild'){
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
        else if(response.data == false && response.response !== 'api token or userid invaild'){
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
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          
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

    invoice() {
    const dialogRef = this.dialog.open(DialogInvoiceDialog, {
      width: '1000px',
      height: 'auto',
      data: {fulldata: this.myAppoDetailData}

    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  }



  @Component({
    selector: 'new-appointment',
    templateUrl: '../_dialogs/new-appointment.html',
    providers: [DatePipe],
  })
  export class DialogNewCustomerAppointment {
  customerDetails:any=[];
  formAddNewAppointmentStaffStep2:FormGroup;
  secondStep:boolean = false;
  adminId:any;
  token:any;
  bussinessId:any;
  catdata :any= [];
  subcatdata :any= [];
  serviceData:any= [];
  selectedCatId:any;
  selectedSubCatId:any;
  selectedServiceId:any;
  minDate = new Date();
  maxDate = new Date();
  timeSlotArr:any= [];
  timeSlotArrForLabel:any= [];
  serviceCount:any= [];
  selectedDate:any;
  selectedTime:any;
  selectedStaffId:any;
  availableStaff:any=[];  
  isStaffAvailable:boolean=false;
  taxType:any="P";
  taxValue:any;
  netCost:any;
  taxAmount:any;
  taxArr:any=[];
  taxAmountArr:any=[];
  myFilter:any;
  offDaysList:any=[];
  workingHoursOffDaysList:any=[];
  settingsArr:any=[];
  minimumAdvanceBookingTime:any;
  maximumAdvanceBookingTime:any;
  minimumAdvanceBookingDateTimeObject:any;
  maximumAdvanceBookingDateTimeObject:any;
  appointmentData={
    business_id:'',
    order_item_id:'',
    order_id:'',
    customer_id:'',
    fullName:'',
    email:'',
    phone:'',
    address:'',
    city:'',
    state:'',
    zip:'',
    category_id:'',
    sub_category_id:'',
    service_id:'',
    booking_date:new Date(),
    booking_time:'',
    staff:'',
  }
  validationArr:any=[];
  disablePostalCode:boolean=false;
  disableCategory:boolean=false;
  disableSubCategory:boolean=false;
  disableService:boolean=false;
  dialogTitle:any="New Appointment";
  showSubCatDropDown=true;
  valide_postal_code:boolean =false;
  isLoader:boolean=false;
  Postalcode:any;
  currentUser:any;

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogNewCustomerAppointment>,
    private userService: UserService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private authenticationService : AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    //this.customerDetails=this.data.customerDetails;
    
     this.formAddNewAppointmentStaffStep2 = this._formBuilder.group({
        customerPostalCode: [''],
        customerCategory: [''],
        customerSubCategory: [''],
        customerService: [''],
        customerDate: [''],
        customerTime: [''],
        customerStaff: [''],
        customerAppoAddress: [''],
        customerAppoState: [''],
        customerAppoCity: [''],
     });

      this.bussinessId=(JSON.parse(localStorage.getItem('currentUser'))).business_id;
      this.adminId=(JSON.parse(localStorage.getItem('currentUser'))).user_id;
      this.token=(JSON.parse(localStorage.getItem('currentUser'))).token;

      this.customerDetails = JSON.parse(localStorage.getItem('currentUser'));
    
     
      this.fnIsPostalCodeAdded();
      this.fnGetSettingValue();
      this.fnGetTaxDetails();
      this.fnGetOffDays();
      this.fnGetCategories();
      this.getPostalCodeList();

      this.myFilter = (d: Date | null): boolean => {
      // const day = (d || new Date()).getDay();
      // const month = (d || new Date()).getMonth();
      // Prevent Saturday and Sunday from being selected.
      // return day !== 0 && day !== 6;
      let temp:any;
      let temp2:any;
      if(this.offDaysList.length>0 || this.workingHoursOffDaysList.length>0){
        for(var i=0; i<this.offDaysList.length; i++){
          var offDay = new Date(this.offDaysList[i]);
          if(i==0){
           temp=(d.getMonth()+1!==offDay.getMonth()+1 || d.getDate()!==offDay.getDate());
          }else{
            temp=temp && (d.getMonth()+1!==offDay.getMonth()+1 || d.getDate()!==offDay.getDate());
          }
        }
        for(var i=0; i<this.workingHoursOffDaysList.length; i++){
            temp=temp && (d.getDay() !== this.workingHoursOffDaysList[i]);
        }
        //return (d.getMonth()+1!==4 || d.getDate()!==30) && (d.getMonth()+1!==5 || d.getDate()!==15);
        return temp;
        }else{
        return true;
        }
      }
    }
  
    private handleError(error: HttpErrorResponse) {
      return throwError('Error! something went wrong.');
      //return error.error ? error.error : error.statusText;
    }
  
    isPostalcodeValid(control: FormControl) {
      return new Promise((resolve, reject) => {

        if(this.Postalcode.length==0){
          this.valide_postal_code = true;
          resolve(null);
          return true;
        }
      
        setTimeout(() => {
          let headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });
          return this.http.post(`${environment.apiUrl}/postalcode-check`,{ business_id: this.bussinessId,postal_code:control.value },{headers:headers}).pipe(map((response : any) =>{
            return response;
          }),
          catchError(this.handleError)).subscribe((res) => {
            if(res){
              if(res.data == false){
                this.valide_postal_code = false;
                resolve({ isPostalcodeValid: true });
              }else{
                this.valide_postal_code = true;
                resolve(null);
              }
            }
          });
        }, 500);
      });
    }
    
    getPostalCodeList() {
      let requestObject = {
        "business_id":this.bussinessId
      };

      this.userService.getPostalCodeList(requestObject).subscribe((response:any) => {
        if(response.data == true){
          let postal = response.response
          this.Postalcode = postal;
        } else if(response.data == false && response.response !== 'api token or userid invaild'){
          this.Postalcode = [];
        }
      });
    }

    fnIsPostalCodeAdded(){
      let requestObject = {
        "business_id" : this.bussinessId
        };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      this.http.post(`${environment.apiUrl}/postal-code-enable-check`,requestObject,{headers:headers} ).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      ).subscribe((response:any) => {
          if(response.data == true){
            this.formAddNewAppointmentStaffStep2 = this._formBuilder.group({
              customerPostalCode: ['', [Validators.required,Validators.minLength(5),Validators.maxLength(7)],this.isPostalcodeValid.bind(this)],
              customerCategory: ['', Validators.required],
              customerSubCategory: ['', [Validators.required]],
              customerService: ['', [Validators.required]],
              customerDate: ['', Validators.required],
              customerTime: ['', Validators.required],
              customerStaff: ['', Validators.required],
              customerAppoAddress: ['', Validators.required],
              customerAppoState: ['', Validators.required],
              customerAppoCity: ['', Validators.required],
          });
          }else{
            this.valide_postal_code = true;
            this.formAddNewAppointmentStaffStep2 = this._formBuilder.group({
              customerPostalCode: ['', [Validators.required,Validators.minLength(5),Validators.maxLength(6)]],
              customerCategory: ['', Validators.required],
              customerSubCategory: ['', [Validators.required]],
              customerService: ['', [Validators.required]],
              customerDate: ['', Validators.required],
              customerTime: ['', Validators.required],
              customerStaff: ['', Validators.required],
              customerAppoAddress: ['', Validators.required],
              customerAppoState: ['', Validators.required],
              customerAppoCity: ['', Validators.required],
             });
          }
        },(err) =>{
          console.log(err)
        })
    }

    sameAddress(values:any){
    
      var customerAddress = this.customerDetails.address;
      var customerState = this.customerDetails.state;
      var customerCity = this.customerDetails.city;
      var customerPostalCode = this.customerDetails.zip;
  
      var is_checked = values.checked;
  
      this.formAddNewAppointmentStaffStep2.controls.customerAppoAddress.setValue(is_checked?customerAddress:'');
      this.formAddNewAppointmentStaffStep2.controls.customerAppoState.setValue(is_checked?customerState:'');
      this.formAddNewAppointmentStaffStep2.controls.customerAppoCity.setValue(is_checked?customerCity:'');
      this.formAddNewAppointmentStaffStep2.controls.customerPostalCode.setValue(is_checked?customerPostalCode:'');
  
  
    }

    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
  
    }
  
    fnGetSettingValue(){
      let requestObject = {
        "business_id":this.bussinessId
      };
      this.userService.getSettingValue(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.settingsArr=response.response;
          console.log(this.settingsArr);
          this.minimumAdvanceBookingTime=JSON.parse(this.settingsArr.min_advance_booking_time);
          this.maximumAdvanceBookingTime=JSON.parse(this.settingsArr.max_advance_booking_time);
          
          this.minimumAdvanceBookingDateTimeObject = new Date();
          this.minimumAdvanceBookingDateTimeObject.setMinutes( this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime );
          console.log("minimumAdvanceBookingDateTimeObject - "+this.minimumAdvanceBookingDateTimeObject);
          this.minDate = this.minimumAdvanceBookingDateTimeObject;
  
          this.maximumAdvanceBookingDateTimeObject = new Date();
          this.maximumAdvanceBookingDateTimeObject.setMinutes( this.maximumAdvanceBookingDateTimeObject.getMinutes() + this.maximumAdvanceBookingTime );
          console.log("maximumAdvanceBookingDateTimeObject - "+this.maximumAdvanceBookingDateTimeObject);
          this.maxDate = this.maximumAdvanceBookingDateTimeObject;
  
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          
        }
      })
    }
  
    fnGetTaxDetails(){
      let requestObject = {
        "business_id":this.bussinessId
      };

      this.userService.getTaxDetails(requestObject).subscribe((response:any) => {
        if(response.data == true){
          let tax = response.response
          this.taxArr=tax;
          console.log(this.taxArr);
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          
        }
      })
    }
  
    fnGetOffDays(){
      let requestObject = {
        "business_id":this.bussinessId
      };
      this.userService.getOffDays(requestObject).subscribe((response:any) => {
        if(response.data == true){
          if(response.response.holidays.length>0){
            this.offDaysList = response.response.holidays;
          }else{
            this.offDaysList=[];
          }
          if(response.response.offday.length>0){
            this.workingHoursOffDaysList = response.response.offday;
          }else{
            this.workingHoursOffDaysList=[];
          }
        }
        else{
  
        }
      },
      (err) =>{
        console.log(err)
      })
    }
  
    onNoClick(): void {
      this.dialogRef.close({data:false});
    }
  
    fnGetCategories(){
      let requestObject = {
        "business_id":this.bussinessId,
        "status":"E"
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'customer-id' : '',
        'api-token' : '' 
       // 'mode': 'no-cors'
      });
  
      this.http.post(`${environment.apiUrl}/get-all-category`,requestObject,{headers:headers} )
      .pipe(
      map((res) => {
        return res;
      })
      ).subscribe((response:any) => {
        if(response.data == true){
          this.catdata = response.response;
        }else{
        }
      },
      (err) =>{
        console.log(err)
      })
    }
  
    fnSelectCat(selected_cat_id){
      console.log(selected_cat_id)
      this.fnGetSubCategory(selected_cat_id);
      this.subcatdata.length = 0;
      this.serviceData.length = 0;
      this.serviceCount.length=0;
      this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].setValue(null);
      this.formAddNewAppointmentStaffStep2.controls['customerService'].setValue(null);
      this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
      this.selectedSubCatId=undefined;
      this.selectedServiceId=undefined;
      this.selectedStaffId=undefined;
      console.log(this.selectedSubCatId);
    }
    // get Sub Category function
    fnGetSubCategory(selected_cat_id){
      let requestObject = {
        "category_id":selected_cat_id,
        "sub_category_status":"E"
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      this.http.post(`${environment.apiUrl}/get-sub-category`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      ).subscribe((response:any) => {
        if(response.data == true){
          this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].setValidators([Validators.required]);    
          this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].updateValueAndValidity();           
         this.showSubCatDropDown=true;
        this.subcatdata = response.response;
        // console.log(this.subcatdata)
        }else{
          this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].clearValidators();
          this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].updateValueAndValidity();           
         this.showSubCatDropDown=false;
          this.fnGetAllServicesFromCategory();
        }
      },
      (err) =>{
        console.log(err)
      })
    }
  
    fnSelectSubCat(selected_subcat_id){
      console.log(selected_subcat_id)
      this.fnGetAllServices(selected_subcat_id);
      this.serviceData.length = 0;
      this.formAddNewAppointmentStaffStep2.controls['customerService'].setValue(null);
      this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
      this.selectedServiceId=undefined;
      this.selectedStaffId=undefined;
      this.serviceCount.length=0;
    }
  
    fnGetAllServices(selected_subcat_id){
      let requestObject = {
        "sub_category_id":selected_subcat_id,
        "status":"E"
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      this.http.post(`${environment.apiUrl}/get-services`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      ).subscribe((response:any) => {
        if(response.data == true){
          this.serviceData = response.response;
          for(let i=0; i<this.serviceData.length;i++){
            this.serviceData[i].count=0;
  
            this.serviceData[i].subtotal = this.serviceData[i].service_cost * this.serviceData[i].count;
            this.serviceData[i].discount_type=null;
            this.serviceData[i].discount_value=null;
            this.serviceData[i].discount=0;
            var serviceAmountAfterDiscount= this.serviceData[i].subtotal - this.serviceData[i].discount;
            var serviceTaxAmount=0;
            let taxMain=[];
            this.taxArr.forEach((element) => {
              let taxTemp={
                value:0,
                name:'',
                amount:0
              }
              console.log(element.name+" -- "+element.value);
              if(this.taxType == "P"){
               taxTemp.value= element.value;
               taxTemp.name= element.name;
               taxTemp.amount= serviceAmountAfterDiscount * element.value/100;
                serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
              }else{
                taxTemp.value= element.value;
                taxTemp.name= element.name;
                taxTemp.amount=  element.value;
                serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
              }
              taxMain.push(taxTemp);
              this.serviceData[i].tax=taxMain;
              console.log(this.serviceData[i].tax);
            });
  
            // this.serviceData[i].tax=0;
            this.serviceData[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
  
            // this.serviceData[i].totalCost=0;
            this.serviceData[i].appointmentDate='';
            this.serviceData[i].appointmentTimeSlot='';
            this.serviceData[i].assignedStaff=null;
            this.serviceCount[this.serviceData[i].id]=this.serviceData[i];
          }
          console.log(JSON.stringify(this.serviceCount));
        }else{
        }
      },
      (err) =>{
        console.log(err)
      })
    }
  
    fnGetAllServicesFromCategory(){
      let requestObject = {
        "business_id":this.bussinessId,
        "category_id":this.selectedCatId
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      this.http.post(`${environment.apiUrl}/get-cat-services`,requestObject,{headers:headers} ).pipe(
        map((res) => {
          return res;
        }),
      ).subscribe((response:any) => {
        if(response.data == true){
          this.serviceData = response.response;
          for(let i=0; i<this.serviceData.length;i++){
            this.serviceData[i].count=0;
  
            this.serviceData[i].subtotal = this.serviceData[i].service_cost * this.serviceData[i].count;
            this.serviceData[i].discount_type=null;
            this.serviceData[i].discount_value=null;
            this.serviceData[i].discount=0;
            var serviceAmountAfterDiscount= this.serviceData[i].subtotal - this.serviceData[i].discount;
            var serviceTaxAmount=0;
            let taxMain=[];
            this.taxArr.forEach((element) => {
              let taxTemp={
                value:0,
                name:'',
                amount:0
              }
              console.log(element.name+" -- "+element.value);
              if(this.taxType == "P"){
               taxTemp.value= element.value;
               taxTemp.name= element.name;
               taxTemp.amount= serviceAmountAfterDiscount * element.value/100;
                serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
              }else{
                taxTemp.value= element.value;
                taxTemp.name= element.name;
                taxTemp.amount=  element.value;
                serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
              }
              taxMain.push(taxTemp);
              this.serviceData[i].tax=taxMain;
              console.log(this.serviceData[i].tax);
            });
  
            this.serviceData[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
            
            this.serviceData[i].appointmentDate='';
            this.serviceData[i].appointmentTimeSlot='';
            this.serviceData[i].assignedStaff=null;
            this.serviceCount[this.serviceData[i].id]=this.serviceData[i];
         
          }
          console.log(JSON.stringify(this.serviceCount));
        }else{
          this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
          });
        }
      },
      (err) =>{
        console.log(err)
      })
    }
  
    fnSelectService(selected_service_id){
      console.log(selected_service_id)
      this.availableStaff=[];
      this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
      this.selectedStaffId=undefined;
      for(let i=0; i<this.serviceCount.length;i++){
        if(this.serviceCount[i] != null && this.serviceCount[i].id == selected_service_id){
          this.serviceCount[i].count=1;
  
          this.serviceCount[i].subtotal = this.serviceCount[i].service_cost * this.serviceCount[i].count;
          this.serviceCount[i].discount_type=null;
          this.serviceCount[i].discount_value=null;
          this.serviceCount[i].discount=0;
          
          var serviceAmountAfterDiscount= this.serviceCount[i].subtotal - this.serviceCount[i].discount;
          var serviceTaxAmount=0;
          let taxMain=[];
          this.taxArr.forEach((element) => {
            let taxTemp={
              value:0,
              name:'',
              amount:0
            }
            console.log(element.name+" -- "+element.value);
            if(this.taxType == "P"){
             taxTemp.value= element.value;
             taxTemp.name= element.name;
             taxTemp.amount= serviceAmountAfterDiscount * element.value/100;
              serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
            }else{
              taxTemp.value= element.value;
              taxTemp.name= element.name;
              taxTemp.amount=  element.value;
              serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
            }
            taxMain.push(taxTemp);
            this.serviceCount[i].tax=taxMain;
            console.log(this.serviceCount[i].tax);
          });
  
          this.serviceCount[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
  
          console.log(JSON.stringify(this.serviceCount));
  
          if(this.selectedDate){
            this.serviceCount[i].appointmentDate=this.selectedDate;
            this.fnGetTimeSlots(this.selectedDate);
          }else{
            this.serviceCount[i].appointmentDate='';
          }
          if(this.selectedTime){
            this.serviceCount[i].appointmentTimeSlot=this.selectedTime;
          }else{
            this.serviceCount[i].appointmentTimeSlot='';
          }
          this.serviceCount[i].assignedStaff=null;
        }else if(this.serviceCount[i] != null && this.serviceCount[i].id != selected_service_id){
          this.serviceCount[i].count=0;
  
          this.serviceCount[i].subtotal = this.serviceCount[i].service_cost * this.serviceCount[i].count;
          this.serviceCount[i].discount_type=null;
          this.serviceCount[i].discount_value=null;
          this.serviceCount[i].discount=0;
          
          var serviceAmountAfterDiscount= this.serviceCount[i].subtotal - this.serviceCount[i].discount;
          var serviceTaxAmount=0;
          let taxMain=[];
          this.taxArr.forEach((element) => {
            let taxTemp={
              value:0,
              name:'',
              amount:0
            }
            console.log(element.name+" -- "+element.value);
            if(this.taxType == "P"){
             taxTemp.value= element.value;
             taxTemp.name= element.name;
             taxTemp.amount= serviceAmountAfterDiscount * element.value/100;
              serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
            }else{
              taxTemp.value= element.value;
              taxTemp.name= element.name;
              taxTemp.amount=  element.value;
              serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
            }
            taxMain.push(taxTemp);
            this.serviceCount[i].tax=taxMain;
            console.log(this.serviceCount[i].tax);
          });
  
          // this.serviceData[id].tax=0;
          this.serviceCount[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
  
          // this.serviceCount[service_id].totalCost=1*this.serviceCount[service_id].service_cost;
          console.log(JSON.stringify(this.serviceCount));
  
          // this.serviceCount[i].totalCost=0;
          this.serviceCount[i].appointmentDate='';
          this.serviceCount[i].appointmentTimeSlot='';
          this.serviceCount[i].assignedStaff=null;
        }
      }
      if(this.bussinessId != undefined && this.selectedServiceId != undefined && this.selectedDate != undefined && this.selectedTime != undefined){
        this.fnGetStaff();
      }
      console.log(JSON.stringify(this.serviceCount));
    }
  
    fnDateChange(event: MatDatepickerInputEvent<Date>) {
      console.log(this.datePipe.transform(new Date(event.value),"yyyy-MM-dd"));
      let date = this.datePipe.transform(new Date(event.value),"yyyy-MM-dd")
      this.formAddNewAppointmentStaffStep2.controls['customerTime'].setValue(null);
      this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
      this.selectedTime=undefined;
      this.selectedStaffId=undefined;
      this.timeSlotArr= [];
      this.timeSlotArrForLabel= [];
      this.availableStaff=[];
      if(this.selectedServiceId != undefined){
        this.serviceCount[this.selectedServiceId].appointmentDate=date
      }
      this.selectedDate=date;
      console.log(JSON.stringify(this.serviceCount));
      this.fnGetTimeSlots(date);
    }
  
    fnGetTimeSlots(date){
      let requestObject = {
        "business_id":this.bussinessId,
        "selected_date":date
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
        this.timeSlotArr.length=0;
        this.timeSlotArrForLabel.length=0;
        this.minimumAdvanceBookingDateTimeObject = new Date();
        this.minimumAdvanceBookingDateTimeObject.setMinutes( this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime );
        response.response.forEach(element => {
          if((new Date(date+" "+element+":00")).getTime() > (this.minimumAdvanceBookingDateTimeObject).getTime()){
            this.timeSlotArr.push(element);
          }
        });
        var i=0;
        this.timeSlotArr.forEach( (element) => {
          var dateTemp=this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element+":00";
           this.timeSlotArrForLabel[i]= this.datePipe.transform(new Date(dateTemp),"hh:mm a");
           i++;
        });
        if(this.timeSlotArr.length==0){
          this.formAddNewAppointmentStaffStep2.controls['customerTime'].setValue(null);
      this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
        }
        }
        else{
        }
      },
      (err) =>{
        console.log(err)
      })
    }
  
    fnSelectTime(timeSlot){
      console.log(timeSlot);
      this.availableStaff=[];
      if(this.selectedServiceId != undefined){
        this.serviceCount[this.selectedServiceId].appointmentTimeSlot =timeSlot;
      }
      this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
      this.selectedStaffId=undefined;
      this.selectedTime=timeSlot;
      console.log(JSON.stringify(this.serviceCount));
     
      if(this.bussinessId != undefined && this.selectedServiceId != undefined && this.selectedDate != undefined && this.selectedTime != undefined){
        this.fnGetStaff();
      }
    }
  
    fnGetStaff(){
      if(this.formAddNewAppointmentStaffStep2.get('customerPostalCode').hasError('required') || this.formAddNewAppointmentStaffStep2.get('customerPostalCode').hasError('minlength') || this.formAddNewAppointmentStaffStep2.get('customerPostalCode').hasError('isPostalcodeValid')){
        this._snackBar.open("Service is not Available in this PostalCode.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
      });
      this.formAddNewAppointmentStaffStep2.get('customerPostalCode').markAsTouched();
       return false; 
      }
      let requestObject = {
        "business_id":this.bussinessId,
        "postal_code":this.formAddNewAppointmentStaffStep2.get('customerPostalCode').value,
        "service_id":this.selectedServiceId,
        "book_date" : this.datePipe.transform(new Date(this.selectedDate),"yyyy-MM-dd"),
        "book_time" : this.selectedTime, 
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
          this.isStaffAvailable = true;
          console.log(JSON.stringify(this.availableStaff));
        }else if(response.data == false && response.response !== 'api token or userid invaild'){
          this.availableStaff=[];
          this.isStaffAvailable = false;
        }
      },
      (err) =>{
        this.isStaffAvailable = false;
        console.log(err);
      })
    }
  
    fnSelectStaff(selected_staff_id){
      console.log(selected_staff_id);
      this.selectedStaffId=selected_staff_id;
      if(this.selectedServiceId != undefined){
        this.serviceCount[this.selectedServiceId].assignedStaff =this.selectedStaffId;
      }
      console.log(JSON.stringify(this.serviceCount));
    }
  
    fnNewAppointmentStep2(){
      
      if(this.valide_postal_code == false){
        console.log("enter valide pin code");
        this.formAddNewAppointmentStaffStep2.get('customerPostalCode').markAsTouched();
        return false;
      }

      if(this.formAddNewAppointmentStaffStep2.invalid){
        this.formAddNewAppointmentStaffStep2.get('customerPostalCode').markAsTouched();
        this.formAddNewAppointmentStaffStep2.get('customerCategory').markAsTouched();
        this.formAddNewAppointmentStaffStep2.get('customerSubCategory').markAsTouched();
        this.formAddNewAppointmentStaffStep2.get('customerService').markAsTouched();
        this.formAddNewAppointmentStaffStep2.get('customerDate').markAsTouched();
        this.formAddNewAppointmentStaffStep2.get('customerTime').markAsTouched();
        this.formAddNewAppointmentStaffStep2.get('customerStaff').markAsTouched();
        
        this.formAddNewAppointmentStaffStep2.get('customerAppoAddress').markAsTouched();
        this.formAddNewAppointmentStaffStep2.get('customerAppoState').markAsTouched();
        this.formAddNewAppointmentStaffStep2.get('customerAppoCity').markAsTouched();
        return false;
      }
  
      this.fnBookAppointment();
    }
  
    fnBookAppointment(){
      let serviceCartArrTemp:any= [];
      for(let i=0; i<this.serviceCount.length;i++){
        if(this.serviceCount[i] != null && this.serviceCount[i].count > 0){
          serviceCartArrTemp.push(this.serviceCount[i]);
        }
      }
      var discount_type = null;
      var amountAfterDiscount=serviceCartArrTemp[0].subtotal;
      var amountAfterTax=0;
      this.taxAmountArr.length=0;
      if(amountAfterDiscount > 0){
        this.taxArr.forEach((element) => {
          let taxTemp={
            value:0,
            name:'',
            amount:0
          }
          console.log(element.name+" -- "+element.value);
          if(this.taxType == "P"){
            taxTemp.value= element.value;
            taxTemp.name= element.name;
            taxTemp.amount= amountAfterDiscount * element.value/100;
            amountAfterTax=amountAfterTax+taxTemp.amount;
          }else{
            taxTemp.value= element.value;
            taxTemp.name= element.name;
            taxTemp.amount=  element.value;
            amountAfterTax=amountAfterTax+taxTemp.amount;
          }
          this.taxAmountArr.push(taxTemp);
          console.log(this.taxAmountArr);
        });
      }
      this.netCost=amountAfterDiscount+amountAfterTax;
  
      console.log(this.taxAmountArr);
      console.log(JSON.stringify(serviceCartArrTemp));
      const currentDateTime = new Date();
      let requestObject = {
        "postal_code": this.formAddNewAppointmentStaffStep2.get('customerPostalCode').value,
        "business_id": this.bussinessId,
        "serviceInfo": serviceCartArrTemp,
        "customer_name": this.customerDetails.fullname,
        "customer_email": this.customerDetails.email,
        "customer_phone": this.customerDetails.phone,
        "appointment_address": this.customerDetails.address,
        "appointment_state": this.customerDetails.state,
        "appointment_city": this.customerDetails.city,
        "appointment_zipcode": this.customerDetails.zip,
        "customer_appointment_address": this.formAddNewAppointmentStaffStep2.get('customerAppoAddress').value,
        "customer_appointment_state": this.formAddNewAppointmentStaffStep2.get('customerAppoState').value,
        "customer_appointment_city": this.formAddNewAppointmentStaffStep2.get('customerAppoCity').value,
        "customer_appointment_zipcode": this.formAddNewAppointmentStaffStep2.get('customerPostalCode').value,
        "coupon_code": '',
        "subtotal": serviceCartArrTemp[0].subtotal,
        "discount_type" : discount_type,
        "discount_value" : null,
        "discount": 0,
        "tax": this.taxAmountArr,
        "nettotal": this.netCost,
        "created_by": "admin",
        "payment_method": "Cash",
        "order_date": this.datePipe.transform(currentDateTime,"yyyy-MM-dd hh:mm:ss") 
      };


      this.isLoader = true;
      this.userService.BookAppointment(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this.isLoader = false;
          this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition:'top',
              panelClass :['green-snackbar']
          });
          this.dialogRef.close({data:true});
        }else if(response.data == false && response.response !== 'api token or userid invaild'){
          this.isLoader = false;
            this._snackBar.open(response.response, "X", {
                duration: 2000,
                verticalPosition:'top',
                panelClass :['red-snackbar']
            });
        }
      },(err) =>{
        this.isLoader = false;
      });

    }
  
  }
  
