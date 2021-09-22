import { Component, OnInit, ViewChildren, QueryList, Renderer2, Inject, NgZone} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators,FormControl, NgForm } from '@angular/forms';
import { environment } from '@environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NgbDateParserFormatter, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatSnackBar} from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';
import { DatePipe, DOCUMENT, JsonPipe } from '@angular/common';
import { AppComponent } from '@app/app.component';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { Meta } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FrontService } from '@app/_services/front.service';
 import { ErrorService } from '@app/_services/error.service';
import { sha512 as sha512 } from 'js-sha512';
@Component({
  selector: 'app-frontbooking',
  templateUrl: './frontbooking.component.html',
  styleUrls: ['./frontbooking.component.scss'],
  providers: [DatePipe]
})
export class FrontbookingComponent implements OnInit {
  selectedTheme:any = '1';
  formExistingUser : FormGroup;
  formOtpExistingUser : FormGroup;
  formNewUser: FormGroup
  formAppointmentInfo: FormGroup;
  model: NgbDateStruct;
  dateformatter: NgbDateParserFormatter;
  date: {year: number, month: number};
  minDate: {year: number, month: number, day: number};
  maxDate: {year: number, month: number, day: number};
  displayMonths = 1;
  navigation = 'arrows';
  
  directAPI:any;
  is_at_home_service:boolean=true;
  catselection = true;
  subcatselection = false;
  serviceselection = false;
  dateselection = false;
  personalinfo = false;
  appointmentinfo = false;
  summaryScreen = false;
  paymentScreen= false;
  thankYouScreen = false;
  otpLogin = false;
  normalLogin = false;
  phoneCodes :any=[];
  selectedPhoneCode: any;
  defaultPayment:any;
  allUnitsBack = "";
  totalAmt ="";
  selectedItem = "";
  presentToast ="";
  addoncount = false;
  addonaddtocart = true;
  existinguser = true;
  newuser = false;
  creditcardform = false;
  showPaypalButtons = false;
  showPayUMoneyButton = false;
  phoneNumberInvalid:any = "valid";
  checked = false;
  minVal=1;
  catdata :[];
  subcatdata :[];
  serviceData:any= [];
  selectedsubcategory = "";
  selectedcategory = "";
  BankDetail:boolean=false;
  selectedcategoryName:any;
  selectedsubcategoryName:any;
  booking = {
    postalcode: ""
  };
  serviceCount:any= [];
  serviceCartArr:any= [];
  taxType:any='P';
  taxValue:any;
  taxArr:any=[];
  taxAmountArr:any=[];
  serviceMainArr={
    totalNumberServices:0,
    subtotal:0,
    discount_type:null,
    discount_value:null,
    discount:0,
    netCost:0
  }
  //postalcode :any;
  coupon = {
    couponcode_val: ""
  };
  existing_phone: any;
  existing_email: any;
  timeslotview: boolean = false;
  newcustomer: boolean = false;
  validpostalcode : string = 'default';
  postalCodeError : boolean = false;
  closecoupon: string = "default";

  selecteddate: any;
  selecteddateForLabel: any;
  currentSelectedService:any;
  appo_address_info = {
    appo_address:"",
    appo_state:"",
    appo_city:"",
    appo_zipcode:""
  }
  errorMessage:any;
  offDaysList:any= [];
  workingHoursOffDaysList:any= [];
  timeSlotArr:any= [];
  selectedTimeSlot:any;
  availableStaff:any= [];
  showSameAsAboveCheck:boolean=true;
  isLoggedIn:boolean=false;
  otpShow = true;
  loginShow = false;
  isStaffAvailable:boolean=false;
  customerName:any;
  customerFirstname:any;
  customerLastname:any;
  customerEmail:any;
  customerPhone:any;
  cartOpened : boolean = true;
  couponIcon:any="check";
  isReadOnly:any="";
  paymentMethod:any="";
  isLoader:boolean=false;
  showCouponError:boolean=false;
  couponErrorMessage:any;
  timeSlotArrForLabel:any=[];


  termsConditionsStatusValue:boolean = false;
  termsConditions:any;
  privacyPolicy:any;
  thankYou:any;
  PrivacyPolicyStatusValue:boolean = false;
  PrivacyPolicyStatusValidation:boolean = false;
  termsConditionsStatusValidation:boolean = false;
  contactFormSettingsArr:any=[];

  minimumAdvanceBookingTime:any;
  maximumAdvanceBookingTime:any;
  minimumAdvanceBookingDateTimeObject:any;
  maximumAdvanceBookingDateTimeObject:any;
  settingsArr:any=[];
  staffOnFrontValue:boolean=false;
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;
  @ViewChildren(MdePopoverTrigger) trigger: QueryList<MdePopoverTrigger>;

  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	// TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  itemArr:any= [];
  taxAmount=0;
  reference_id:any;
  transactionId:any=null;
  paymentDateTime:any;
  PayUMoneyCredentials:any;
  paypalSetting:any;
  stripeSetting:any;
  bankTransferSetting:any;
  stripeStatus : boolean = false;
  bankTransferStatus : boolean = false;
  loadAPI: Promise<any>;
  isFound:boolean=false;
  directService:boolean=false;
  sizeServiceCartArr:any;
  //@ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;
  emailFormat = "/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/"
  onlynumeric = /^(\d*\.)?\d+$/
  // private payPalConfig?: IPayPalConfig;
  cardForm:FormGroup

  // PayUMoney={
  //   key:'',
  //   txnid:'',
  //   amount:'',
  //   firstname:'',
  //   email:'',
  //   phone:'',
  //   productinfo:'',
  //   surl:'',
  //   furl:'',
  //   mode:'',
  //   salt:'',
  //   udf1:'',
  //   udf2:'',
  //   udf3:'',
  //   udf4:'',
  //   udf5:''
  // }
  // payUmoneyStatus : boolean = false;

  // paypalClientId:any="sb";
  // paypalTestMode:any;
  // paypalStatus:boolean=false;
  encodedbusinessId:any;
  businessId:any;
  businessDetail:any;

  postalCodeCondition=false;
  postal_code_status=false;
  customerLoginValue:boolean=false;
  encodedId: any;
  urlString: any;
  cartPopupCloseType:any;
  canCustomerLogin:boolean= false
  frontBgImage:any;

  // payment var
  gatewayList:any=[];
  selectedGateway;
  currencyDetails;
  CGateways: any;
  raw_pgw_details: object = {};
  finalProcessData: {
    key: string; // add razorpay Api Key Id
    amount: any; // 2000 paise = INR 20
    currency: any; // add currency
    name: any; // add merchant user name
    handler: (gatewayResponse: any) => void; prefill: {
      name: any; // add user name
      email: any;
    }; theme: { color: any; }; modal: { ondismiss: (e: any) => void; };

  };
  razorpayamt: any;
  finalGatewayResult:any;
  // fileLink = environment.fileLink;
  CardFormList = ['checkout_com','authorize-net','cybersource','worldpay','adyen']
  OrderId = 'O'+Math.floor(Math.random() * 999999) + 111111;
  // isLoader:boolean = false;
  cartRequestObject:any;
  orderDetails: any;
  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private calendar: NgbCalendar,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private AppComponent : AppComponent,
    private datePipe: DatePipe,
    private meta: Meta,
    private renderer2: Renderer2,
    private frontService: FrontService,
    private errorService: ErrorService,
    public router: Router,
    private readonly ngZone: NgZone,
    @Inject(DOCUMENT) private _document
    
  ) { 
    this.urlString = window.location.search.split("?business_id="); 
    this.businessId = window.atob(decodeURIComponent(this.urlString[1]));
   
    meta.addTag({name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'});
    // this.renderExternalScript('https://checkout-static.citruspay.com/bolt/run/bolt.min.js').onload = () => {
    // }

    this.AppComponent.setcompanycolours(this.businessId);
    localStorage.setItem('isFront', "true");
    const current = new Date();
    const nextmonth = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 2,
      day: current.getDate(),
    };

    this.formOtpExistingUser = this._formBuilder.group({
      existing_phone: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      existing_otp: ['',[Validators.required, Validators.pattern("^[1-9][0-9]{3}")]],
    })

    this.formExistingUser = this._formBuilder.group({
      existing_mail: ['',[Validators.required,Validators.email]],
      existing_password: ['',Validators.required]
    });

    this.cardForm = this._formBuilder.group({
      cardHolderName: ['',[Validators.required]],
      cardNumber: ['',[Validators.required,Validators.minLength(16), Validators.maxLength(16),Validators.pattern(this.onlynumeric)]],
      expiryMonth: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
      expiryYear: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
      cvvCode: ['',[Validators.required]],
    })

    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    
    this.formNewUser = this._formBuilder.group({
      newUserEmail: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)],
      this.isEmailUnique.bind(this)],
      newUserPassword: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
      newUserFullname: ['',Validators.required],
      newUserPhone: [''],
      // newUserAddress: ['',Validators.required],
      // newUserState: ['',Validators.required],
      // newUserCity: ['',Validators.required],
      // newUserZipcode: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
      newUserSplReq: ['']
    })

    this.formAppointmentInfo = this._formBuilder.group({
      // appo_address: ['',[Validators.required]],
      // appo_state: ['',[Validators.required]],
      // appo_city: ['',Validators.required],
      // appo_zipcode: ['',[Validators.required,Validators.pattern(this.onlynumeric)]]
    })

    
  }

  ngOnInit() {
    this.fngetPhoneCode();
    this.fnGetSettings();
    this.fnGetDefaultPayment();
    this.fnIsPostalCodeAdded();
    this.fnGetBusiness();

    if(this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.user_type == "C"){
      this.isLoggedIn=true;
      this.customerName=this.authenticationService.currentUserValue.fullname;
      this.customerFirstname=this.customerName.split(" ")[0];
      this.customerLastname=this.customerName.split(" ")[1];
      this.customerEmail=this.authenticationService.currentUserValue.email;
      this.customerPhone=this.authenticationService.currentUserValue.phone;
    }
   // this.formNewUser.controls['newUserPhone'].setValue(this.phone)
    this.fnGetTaxDetails();
    this.fnGetCategories();
    this.fnGetOffDays();
    this.getPaymentGateways();
    setTimeout(() => {
      this.selectToday();
    }, 1000);
    
    this.serviceCount.length=0
    this.serviceCartArr.length=0

    this.normalLogin = true;

  }

  fngetPhoneCode(){
    this.authenticationService.getPhoneCode().subscribe((response:any) => {
        if(response.data == true){
            this.phoneCodes = response.response;
            this.selectedPhoneCode = "91";
        }
      });
  }

  renderExternalScript(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.id = "bolt";
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;
    script.setAttribute('bolt-color', 'e34524');
    script.setAttribute('bolt-logo', 'http://boltiswatching.com/wp-content/uploads/2015/09/Bolt-Logo-e14421724859591.png');
    this.renderer2.appendChild(document.body, script);
    return script;
  }
  fnChangeTermsConditionsStatus(event){
    if(event== true){
      this.termsConditionsStatusValue=true;
      this.termsConditionsStatusValidation = false;
    }
    else if(event==false){
      this.termsConditionsStatusValue=false;
      this.termsConditionsStatusValidation = true;
    }
     
  }

  fnChangePrivacyPolicyStatus(event){
    if(event == true){
      this.PrivacyPolicyStatusValue=true;
      this.PrivacyPolicyStatusValidation = false;
    }else if(event == false){
      this.PrivacyPolicyStatusValidation = true;
      this.PrivacyPolicyStatusValue=false;
    }
  }

  fnGetDefaultPayment(){
    let requestObject = {
      "business_id" : this.businessId
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http.post(`${environment.apiUrl}/get-default-payment`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
        if(response.data == true){
          console.log(response.response.option_value);
          this.defaultPayment = response.response.option_value;
          this.paymentMethod = this.defaultPayment;
        }
    },(err) =>{
    });
  }

  fnChangePaymentStatus(type){
    let requestObject = {
      "business_id" : this.businessId,
      "default_payment": type
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http.post(`${environment.apiUrl}/set-default-payment`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
        if(response.data == true){
          this.defaultPayment = type;
          this.snackBar.open("Default Payment Set Successfuly", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['green-snackbar']
          });
        } else {
          this.snackBar.open("Default Payment status Not Updated.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
    },(err) =>{
    });
}

  fnGetSettings(){
    let requestObject = {
      "business_id" : this.businessId
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http.post(`${environment.apiUrl}/get-front-setting`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
        if(response.data == true){
          this.settingsArr=response.response;
          console.log(this.settingsArr)
          this.currencySymbol = this.settingsArr.currency;
          if(this.settingsArr.customer_login == 'true'){
            this.canCustomerLogin  = true;
          }else{
            this.canCustomerLogin  = false;
          }
          if(this.settingsArr.appearance){
            this.frontBgImage = JSON.parse(this.settingsArr.appearance).image
          }
          this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
          this.currencySymbolFormat = this.settingsArr.currency_format;
          if(this.settingsArr.theme){
            this.selectedTheme = this.settingsArr.theme;
            if(this.selectedTheme == '4'){
              localStorage.setItem('frontBusiness_id',this.businessId)
              this.router.navigate(['/booking-4']);
              // this.router.navigate(['/booking-4?business_id='+this.businessId]);
            }else if(this.selectedTheme == '3'){
              localStorage.setItem('frontBusiness_id',this.businessId)
              this.router.navigate(['/booking-3']);
            }else if(this.selectedTheme == '5'){
              localStorage.setItem('frontBusiness_id',this.businessId)
              this.router.navigate(['/booking-5']);
            }else if(this.selectedTheme == '6'){
              localStorage.setItem('frontBusiness_id',this.businessId)
              this.router.navigate(['/booking-6']);
            }else{
              localStorage.setItem('frontBusiness_id',this.businessId)
            }
          }
          // if(this.settingsArr.payUmoney_settings){
          //   this.PayUMoneyCredentials = JSON.parse(this.settingsArr.payUmoney_settings);
          //   this.PayUMoney.key= this.PayUMoneyCredentials.merchant_key;
          //   this.PayUMoney.salt=this.PayUMoneyCredentials.salt_key;
          //   this.payUmoneyStatus=this.PayUMoneyCredentials.status;
          // }
          
        // if(this.settingsArr.pay_pal_settings){
        //   this.paypalSetting = JSON.parse(this.settingsArr.pay_pal_settings)
        //   this.paypalTestMode = this.paypalSetting.test_mode;
        //   if(this.paypalTestMode){
        //     this.paypalClientId="sb";
        //   }else{
        //     this.paypalClientId = this.paypalSetting.client_id;
        //   }
        //   this.paypalStatus = this.paypalSetting.status;

        // }
          
        // if(this.settingsArr.stripe_settings){
        //   this.stripeSetting = JSON.parse(this.settingsArr.stripe_settings)
        //   this.stripeStatus = this.stripeSetting.status
        // }
        // if(this.settingsArr.bank_transfer){
        //   this.bankTransferSetting = JSON.parse(this.settingsArr.bank_transfer)
        //   this.bankTransferStatus = this.bankTransferSetting.status
        // }
          

          this.termsConditions = JSON.parse(this.settingsArr.terms_condition);
          if(this.termsConditions.status == 'false' || this.termsConditions.status == false){
            this.termsConditionsStatusValue = true;
          }
          this.privacyPolicy=JSON.parse(this.settingsArr.privacy_policy)
          if(this.privacyPolicy && this.privacyPolicy.status == 'false' || this.privacyPolicy && this.privacyPolicy.status == false){
            this.PrivacyPolicyStatusValue = true;
          }
          this.thankYou=JSON.parse(this.settingsArr.thank_you);
          this.contactFormSettingsArr=JSON.parse(this.settingsArr.form_settings)
          if(this.contactFormSettingsArr && this.contactFormSettingsArr.contact_field_status == true){
            if(this.contactFormSettingsArr.addressField.status == 1){
              if(this.contactFormSettingsArr.addressField.required == 1){
                const validators = [Validators.required];
                const validatorsZipCode = [Validators.required,Validators.minLength(5),Validators.maxLength(7)];
                this.formNewUser.addControl('newUserAddress', new FormControl('', validators));
                this.formNewUser.addControl('newUserState', new FormControl('', validators));
                this.formNewUser.addControl('newUserCity', new FormControl('', validators));
                this.formNewUser.addControl('newUserZipcode', new FormControl('', validatorsZipCode));

                this.formAppointmentInfo.addControl('appo_address', new FormControl('', validators));
                this.formAppointmentInfo.addControl('appo_state', new FormControl('', validators));
                this.formAppointmentInfo.addControl('appo_city', new FormControl('', validators));
                this.formAppointmentInfo.addControl('appo_zipcode', new FormControl('', validatorsZipCode));

              }else{
                this.formNewUser.addControl('newUserAddress', new FormControl(null));
                this.formNewUser.addControl('newUserState', new FormControl(null));
                this.formNewUser.addControl('newUserCity', new FormControl(null));
                this.formNewUser.addControl('newUserZipcode', new FormControl(null));

                this.formAppointmentInfo.addControl('appo_address', new FormControl(null));
                this.formAppointmentInfo.addControl('appo_state', new FormControl(null));
                this.formAppointmentInfo.addControl('appo_city', new FormControl(null));
                this.formAppointmentInfo.addControl('appo_zipcode', new FormControl(null));
              }
            }else{
              this.formAppointmentInfo.addControl('appo_address', new FormControl(null));
              this.formAppointmentInfo.addControl('appo_state', new FormControl(null));
              this.formAppointmentInfo.addControl('appo_city', new FormControl(null));
              this.formAppointmentInfo.addControl('appo_zipcode', new FormControl(null));
            }
          }else{
            const validators = [Validators.required];
            const validatorsZipCode = [Validators.required,Validators.minLength(5),Validators.maxLength(7)];
            this.formNewUser.addControl('newUserAddress', new FormControl('', validators));
            this.formNewUser.addControl('newUserState', new FormControl('', validators));
            this.formNewUser.addControl('newUserCity', new FormControl('', validators));
            this.formNewUser.addControl('newUserZipcode', new FormControl('', validatorsZipCode));

            this.formAppointmentInfo.addControl('appo_address', new FormControl('', validators));
            this.formAppointmentInfo.addControl('appo_state', new FormControl('', validators));
            this.formAppointmentInfo.addControl('appo_city', new FormControl('', validators));
            this.formAppointmentInfo.addControl('appo_zipcode', new FormControl('', validatorsZipCode));
          }

          this.minimumAdvanceBookingTime=JSON.parse(this.settingsArr.min_advance_booking_time);
          this.maximumAdvanceBookingTime=JSON.parse(this.settingsArr.max_advance_booking_time);
          this.minimumAdvanceBookingDateTimeObject = new Date();
          this.minimumAdvanceBookingDateTimeObject.setMinutes( this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime );
          this.minDate = {
            year: this.minimumAdvanceBookingDateTimeObject.getFullYear(),
            month: this.minimumAdvanceBookingDateTimeObject.getMonth() + 1,
            day: this.minimumAdvanceBookingDateTimeObject.getDate()
          };
          this.maximumAdvanceBookingDateTimeObject = new Date();
          this.maximumAdvanceBookingDateTimeObject.setMinutes( this.maximumAdvanceBookingDateTimeObject.getMinutes() + this.maximumAdvanceBookingTime );
          this.maxDate = {
            year: this.maximumAdvanceBookingDateTimeObject.getFullYear(),
            month: this.maximumAdvanceBookingDateTimeObject.getMonth() + 1,
            day: this.maximumAdvanceBookingDateTimeObject.getDate(),
          };
          this.staffOnFrontValue=JSON.parse(JSON.parse(this.settingsArr.staff_list_on_front).status)
          this.customerLoginValue=JSON.parse(this.settingsArr.customer_login);
          if(this.settingsArr.postal_code_check){
            this.postal_code_status=JSON.parse(this.settingsArr.postal_code_check).status;
          }
          
          
        // this.initConfig();
        }else{
        }
      },(err) =>{
      });
  }

    fnGetBusiness(){
        let requestObject = {
          "business_id" : this.businessId
        };
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        this.http.post(`${environment.apiUrl}/get-business`,requestObject,{headers:headers} ).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError)
        ).subscribe((response:any) => {
            if(response.data == true){
              this.businessDetail = response.response;
            }
        },(err) =>{
        });
    }

  // Get Tax details
  fnGetTaxDetails(){
    this.getTaxDetails().subscribe((response:any) => {
      if(response.data == true){
        this.taxArr=response.response
      }
      else if(response.data == false){
        
      }
    })
  }

  getTaxDetails(){
    let requestObject = {
      'business_id': this.businessId,
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${environment.apiUrl}/get-tax`,requestObject,{headers:headers}).pipe(
    map((res) => {
      return res;
    }),
    //catchError(this.handleError)
    );
  }

  selectToday() {
    this.model = this.calendar.getToday();
  }

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }
  isDisabled = (date: NgbDateStruct, current: {month: number}) => {
    return this.fnDisableDates(date); // this is undefined
  }
  fnDisableDates(date: NgbDateStruct){
    const d = new Date(date.year, date.month - 1, date.day);
    let temp:any;
    let temp2:any;
    for(var i=0; i<this.offDaysList.length; i++){
      var offDay = new Date(this.offDaysList[i]);
      if(i==0){
       temp=date.month==offDay.getMonth()+1 && date.day==offDay.getDate(); 
      }else{
        temp+=temp2 || date.month==offDay.getMonth()+1 && date.day==offDay.getDate();
      }
    }
    for(var i=0; i<this.workingHoursOffDaysList.length; i++){
        temp+=temp2 || d.getDay() === this.workingHoursOffDaysList[i];
    }
    return temp;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
    //return error.error ? error.error : error.statusText;
  }
  
  private createErrorMessage(error: HttpErrorResponse){
    this.errorMessage = error.error ? error.error : error.statusText;
  }
fnLogout(){

this.authenticationService.currentUserSubject.next(null);
this.authenticationService.logout();
this.router.navigate(['/customer-login/'+this.urlString[1]]);
}
  
  fnViewDashboard(){
    this.router.navigate(['/user/appointments']);
  }
  
  fnNavigateToLogin(){
    this.router.navigate(['/customer-login/'+this.urlString[1]]);
  }

  // postal code
  fnChangePostalCode(event){
    this.validpostalcode = 'default';
    this.booking.postalcode = "";
  }

  fnCheckPostalCode(event){
    var postalcode_val =  this.booking.postalcode;
    if(postalcode_val.length == 6 || postalcode_val.length == 5 ){
      this.fnCheckAvailPostal();
    }
    else if(postalcode_val.length == 0){
      this.validpostalcode = 'default';
      this.postalCodeError = false;
    }
    else{
      this.validpostalcode = 'invalid';
      this.postalCodeError = false;
    }
  }

  fnCheckAvailPostal(){
    this.isLoader=true;
    let requestObject = {
      "business_id" : this.businessId,
      "postal_code" : this.booking.postalcode,
      };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/postalcode-check`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        this.isLoader=false;
          this.validpostalcode = 'valid';
          this.postalCodeError = false;
      }else{
        this.isLoader=false;
        this.validpostalcode = 'invalid';
        this.postalCodeError = true;
      }
      },
      (err) =>{
        this.isLoader=false;
      this.validpostalcode = 'invalid';
      this.postalCodeError = true;
      })
  }

  fnIsPostalCodeAdded(){
    let requestObject = {
      "business_id" : this.businessId
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
        this.postalCodeCondition = true;
        // this.validpostalcode = 'invalid';
        // this.postalCodeError = false;
      }else{
        this.postalCodeCondition = false;
        this.validpostalcode = 'valid';
        // this.postalCodeError = true;
      }
      },
      (err) =>{
       
      })
  }

  fnGetCategories(){
    this.isLoader=true;
    let requestObject = {
      "business_id": this.businessId,
      "status":"E"
      };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'admin-id' : '',
      'api-token' : '' 
     // 'mode': 'no-cors'
    });
    this.http.post(`${environment.apiUrl}/get-all-category`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
            this.catdata = response.response;
            this.isLoader=false;
        }else{
          this.catdata = [];
          this.isLoader=false;
        }
        
      },
      (err) =>{
        this.isLoader=false;
       
      })
    }

  // Category
  fnCategory(event,id,categoryName){
    if(this.booking.postalcode == '' && this.postalCodeCondition && this.postal_code_status){
      this.validpostalcode = 'invalid';
      return false;
    }
    if(this.validpostalcode == 'invalid'){
      return false;
    }
    
    this.subcatdata=[];
    this.selectedcategory = id;
    this.selectedcategoryName=categoryName
    this.fnGetSubCategory();
  }
   
  // get Sub Category function
  fnGetSubCategory(){
    this.isLoader=true;
    let requestObject = {
      "category_id":this.selectedcategory,
      "sub_category_status":"E"
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/get-sub-category`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        this.catselection = false;
        this.subcatselection = true;
        this.isLoader=false;
        this.subcatdata = response.response;
      }else{
        this.subcatdata=[];
        this.serviceData = [];
        this.fnGetAllServicesFromCategory();
      }
    },
    (err) =>{
      this.isLoader=false;
     
    })
  }

  // Sub Category
  fnSubCategory(event,id,subcategoryName){
    this.subcatselection = false;
    this.serviceselection = true;
    this.selectedsubcategory = id;
    this.selectedsubcategoryName=subcategoryName
    this.serviceData = [];
    this.fnGetAllServices();
   }
   
  fnGetAllServices(){
    this.isLoader=true;
    this.directService=false;
  let requestObject = {
    "sub_category_id":this.selectedsubcategory,
    "status":"E"
  };
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  this.http.post(`${environment.apiUrl}/get-services`,requestObject,{headers:headers} ).pipe(
    map((res) => {
      return res;
    }),
    catchError(this.handleError)
  ).subscribe((response:any) => {
    if(response.data == true){
      this.serviceData = response.response;
      for(let i=0; i<this.serviceData.length;i++){
        if(this.serviceCount[this.serviceData[i].id] == null){
          this.serviceData[i].count=0;
          this.serviceData[i].subtotal = this.serviceData[i].service_cost * this.serviceData[i].count;
          this.serviceData[i].discount_type=null;
          this.serviceData[i].service_type= this.serviceData[i].service_type.replace(/_/g," ");
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
          });

          // this.serviceData[i].tax=0;
          this.serviceData[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
          // this.serviceData[i].totalCost=0;
          this.serviceData[i].appointmentDate='';
          this.serviceData[i].appointmentDateForLabel='';
          this.serviceData[i].appointmentTimeSlot='';
          this.serviceData[i].appointmentTimeSlotForLabel='';
          this.serviceData[i].assignedStaff=null;
          this.serviceCount[this.serviceData[i].id]=this.serviceData[i];
        }
        
      }
      console.log(this.serviceData);
      this.isLoader=false;
    }else{
      this.isLoader=false;
    }
  },
    (err) =>{
      this.isLoader=false;
     
    })
  }
   
  fnGetAllServicesFromCategory(){
    this.isLoader=true;
    let requestObject = {
      "business_id": this.businessId,
      "category_id":this.selectedcategory
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/get-cat-services`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        this.serviceData = response.response;
        for(let i=0; i<this.serviceData.length;i++){
          if(this.serviceCount[this.serviceData[i].id] == null){
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
            });

            // this.serviceData[i].tax=0;
            this.serviceData[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
            this.serviceData[i].appointmentDate='';
            this.serviceData[i].appointmentDateForLabel='';
            this.serviceData[i].appointmentTimeSlot='';
            this.serviceData[i].appointmentTimeSlotForLabel='';
            this.serviceData[i].assignedStaff=null;
            this.serviceCount[this.serviceData[i].id]=this.serviceData[i];
          }
          
        }
        this.isLoader=false;
        this.directService=true;
        this.catselection = false;
        this.serviceselection = true;
      }else{
        this.snackBar.open("No Sub-Category or Service Available", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
        });
        this.isLoader=false;
      }
    },
    (err) =>{
      this.isLoader=false;
     
    })
  }

   fnShowCounter(service_id){
    this.currentSelectedService=service_id;
    this.serviceCount[service_id].count=1;
    this.serviceCount[service_id].subtotal = this.serviceCount[service_id].service_cost * this.serviceCount[service_id].count;
    this.serviceCount[service_id].discount_type=null;
    this.serviceCount[service_id].discount_value=null;
    this.serviceCount[service_id].discount=0;
    
    var serviceAmountAfterDiscount= this.serviceCount[service_id].subtotal - this.serviceCount[service_id].discount;
    var serviceTaxAmount=0;
    let taxMain=[];
    this.taxArr.forEach((element) => {
      let taxTemp={
        value:0,
        name:'',
        amount:0
      }
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
      this.serviceCount[service_id].tax=taxMain;
    });

    this.serviceCount[service_id].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
    if(this.serviceCartArr[service_id] != null){
      this.serviceCartArr[service_id]=this.serviceCount[service_id];
    }
    this.serviceMainArr.totalNumberServices=0;
    this.serviceMainArr.subtotal=0;
    this.serviceMainArr.discount=0;
    this.taxAmountArr.length=0;
    this.serviceMainArr.netCost=0;
    this.closecoupon = 'default';
      this.couponIcon="check";
      this.coupon.couponcode_val ="";
      this.isReadOnly="";
    for(let i=0; i< this.serviceCartArr.length; i++){
      if(this.serviceCartArr[i] != null){
        this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
        this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
      }
    }
    var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
    var amountAfterTax=0;
    if(this.serviceMainArr.subtotal > 0){
      this.taxArr.forEach((element) => {
        let taxTemp={
          value:0,
          name:'',
          amount:0
        }
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
      });
    }
    this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
    var co = 0;
    var  Arr_co = 0;
    this.serviceCartArr.forEach(element => {
      if(element.service_sub_type !== null || element.service_sub_type !== ''){
        if(element.service_sub_type=='at_home'){
          co = co + 1;
        }
        Arr_co = Arr_co + 1;
      }
      
    });;

    if(co > 0){
      this.is_at_home_service  = true;
    }else{
      this.is_at_home_service  = false;
    }
  }

  fnRemove(event,service_id){
    if(this.serviceCount[service_id].count >= 1){
      this.currentSelectedService=service_id;
      this.serviceCount[service_id].count=this.serviceCount[service_id].count-1

      this.serviceCount[service_id].subtotal = this.serviceCount[service_id].service_cost * this.serviceCount[service_id].count;
      this.serviceCount[service_id].discount_type=null;
      this.serviceCount[service_id].discount_value=null;
      this.serviceCount[service_id].discount=0;
      
      var serviceAmountAfterDiscount= this.serviceCount[service_id].subtotal - this.serviceCount[service_id].discount;
      var serviceTaxAmount=0;
      let taxMain=[];
      this.taxArr.forEach((element) => {
        let taxTemp={
          value:0,
          name:'',
          amount:0
        }
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
        this.serviceCount[service_id].tax=taxMain;
      });
      this.serviceCount[service_id].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;

      if(this.serviceCartArr[service_id] != null){
        if(this.serviceCount[service_id].count < 1){
          this.serviceCartArr[service_id]=null;
        }else{
          this.serviceCartArr[service_id]=this.serviceCount[service_id]; 
        }
      }
      this.serviceMainArr.totalNumberServices=0;
      this.serviceMainArr.subtotal=0;
      this.serviceMainArr.discount=0;
      this.taxAmountArr.length=0;
      this.serviceMainArr.netCost=0;
      // this.fncheckavailcoupon('valid');
      this.closecoupon = 'default';
      this.couponIcon="check";
      this.coupon.couponcode_val ="";
      this.isReadOnly="";
      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
        }
      }
      var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      var amountAfterTax=0;
      if(this.serviceMainArr.subtotal > 0){
        this.taxArr.forEach((element) => {
          let taxTemp={
          value:0,
            name:'',
            amount:0
          }
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
        });
      }
      this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
      
    }
  }

  fnAdd(event,service_id){
    if(this.serviceCount[service_id].count < 10){
      this.currentSelectedService=service_id;
      this.serviceCount[service_id].count=this.serviceCount[service_id].count+1

      this.serviceCount[service_id].subtotal = this.serviceCount[service_id].service_cost * this.serviceCount[service_id].count;
      this.serviceCount[service_id].discount_type=null;
      this.serviceCount[service_id].discount_value=null;
      this.serviceCount[service_id].discount=0;
      
      var serviceAmountAfterDiscount= this.serviceCount[service_id].subtotal - this.serviceCount[service_id].discount;
      var serviceTaxAmount=0;
      let taxMain=[];
      this.taxArr.forEach((element) => {
        let taxTemp={
          value:0,
          name:'',
          amount:0
        }
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
        this.serviceCount[service_id].tax=taxMain;
      });

      // this.serviceData[id].tax=0;
      this.serviceCount[service_id].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;

      if(this.serviceCartArr[service_id] != null){
        this.serviceCartArr[service_id]=this.serviceCount[service_id];
      } 

      
      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceCartArr[i].subtotal = this.serviceCartArr[i].service_cost * this.serviceCartArr[i].count;
          this.serviceCartArr[i].discount_type=null;
          this.serviceCartArr[i].discount_value=null;

          this.serviceCartArr[i].discount=0;

          var serviceAmountAfterDiscount= this.serviceCartArr[i].subtotal - this.serviceCartArr[i].discount;
          var serviceTaxAmount=0;
          let taxMain=[];
          this.taxArr.forEach((element) => {
            let taxTemp={
              value:0,
              name:'',
              amount:0
            }
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
            this.serviceCartArr[i].tax=taxMain;
          });

          this.serviceCartArr[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;

          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
        }
      }
      

      this.serviceMainArr.totalNumberServices=0;
      this.serviceMainArr.subtotal=0;
      this.serviceMainArr.discount=0;
      this.taxAmountArr.length=0;
      this.serviceMainArr.netCost=0;
      // this.fncheckavailcoupon('valid');
      this.closecoupon = 'default';
      this.couponIcon="check";
      this.coupon.couponcode_val ="";
      this.isReadOnly="";

      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
        }
      }
      var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      var amountAfterTax=0;
      if(this.serviceMainArr.subtotal > 0){
        this.taxArr.forEach((element) => {
          let taxTemp={
          value:0,
            name:'',
            amount:0
          }
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
        });
      }
      // this.taxAmountArr.forEach((element) => {
      //   amountAfterDiscount=amountAfterDiscount+element;
      // });
      this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
    }
  } 

  fnGetOffDays(){
    let requestObject = {
      "business_id": this.businessId
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/list-holidays`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
      ).subscribe((response:any) => {
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
       
      })
    }

  fnShowCalender(serviceId){
    this.currentSelectedService=serviceId;
    if(this.serviceCartArr[this.currentSelectedService] && this.serviceCartArr[this.currentSelectedService].appointmentDate != ''){
      let year=this.serviceCartArr[this.currentSelectedService].appointmentDate.split("-")[0];
      let month= this.serviceCartArr[this.currentSelectedService].appointmentDate.split("-")[1];
      let day=this.serviceCartArr[this.currentSelectedService].appointmentDate.split("-")[2];
      let dateTemp={"year":parseInt(year),"month":parseInt(month),"day":parseInt(day)};
      this.model=dateTemp;
      this.selecteddate=this.serviceCartArr[this.currentSelectedService].appointmentDate
      this.selecteddateForLabel=this.datePipe.transform(new Date(this.serviceCartArr[this.currentSelectedService].appointmentDate),"EEE, MMM dd");

      this.fnGetTimeSlots();
    }else{
      this.fnSelectNextValidDate(this.minimumAdvanceBookingDateTimeObject);
    }
    this.serviceselection = false;
    this.dateselection = true;
  }
  
  fnSelectNextValidDate(mydate){
    
    if(mydate=="" || mydate==undefined){
      return false;
    }
    
    if(this.offDaysList.indexOf(this.datePipe.transform(new Date(mydate),"yyyy-MM-dd"))>-1){
      mydate.setDate(mydate.getDate() + 1)
      this.fnSelectNextValidDate(mydate);
    }else{
      let day = this.datePipe.transform(new Date(mydate),"EEE");
      let dayId;
      if(day == "Sun"){
        dayId=0;
      }
      if(day == "Mon"){
        dayId=1;
      }
      if(day == "Tue"){
        dayId=2;
      }
      if(day == "Wed"){
        dayId=3;
      }
      if(day == "Thu"){
        dayId=4;
      }
      if(day == "Fri"){
        dayId=5;
      }
      if(day == "Sat"){
        dayId=6;
      }
      if(this.workingHoursOffDaysList.indexOf(dayId)>-1){
        mydate.setDate(mydate.getDate() + 1)
        this.fnSelectNextValidDate(mydate);
      }else{
        this.selecteddate=this.datePipe.transform(new Date(mydate),"yyyy-MM-dd");
        let year=this.selecteddate.split("-")[0];
        let month= this.selecteddate.split("-")[1];
        let day=this.selecteddate.split("-")[2];
        let dateTemp={"year":parseInt(year),"month":parseInt(month),"day":parseInt(day)};
        this.model=dateTemp;
        this.selecteddateForLabel= this.datePipe.transform(new Date(mydate),"EEE, MMM dd");
        this.fnGetTimeSlots();
      }
    }
  }

  // services
  fnServiceSelection(event){
    if(this.isLoggedIn){
      if(this.is_at_home_service){
        this.serviceselection = false;
        this.appointmentinfo = true;
        this.showSameAsAboveCheck=false;
      }else{
        this.serviceselection = false;
        this.appointmentinfo = false;
        this.summaryScreen = true;
        this.showSameAsAboveCheck=false;
      }
    }else{
      this.serviceselection = false;
      this.personalinfo = true;
      this.showSameAsAboveCheck=true;
    }
   }

  onDateSelect(event){
    this.timeSlotArr = [];
    this.selecteddate = event.year+'-'+event.month+'-'+event.day;
    this.selecteddate=this.datePipe.transform(new Date(this.selecteddate),"yyyy-MM-dd")
    this.selecteddateForLabel=this.datePipe.transform(new Date(this.selecteddate),"EEE, MMM dd")
    this.fnGetTimeSlots();
  }
  // date time 
  fnDatetimeSelection(event){
    var co = 0;
    var  Arr_co = 0;
    this.serviceCartArr.forEach(element => {
      if(element.service_sub_type !== null){
        if(element.service_sub_type=='at_home'){
          co = co + 1;
        }
        Arr_co = Arr_co + 1;
      }
   });;

   if(co > 0){
    this.is_at_home_service  = true;
   }else{
    this.is_at_home_service  = false;
   }
 
 
 
    if(this.isLoggedIn){
      if(this.is_at_home_service){
        this.dateselection = false;
        this.appointmentinfo = true;
        this.showSameAsAboveCheck=false;
      }else{
        this.dateselection = false;
        this.appointmentinfo = false;
        this.showSameAsAboveCheck=false;
        this.summaryScreen=true;
      }
    }else{
      this.dateselection = false;
      this.personalinfo = true;
      this.showSameAsAboveCheck=true;
    }
  }

  fnGetTimeSlots(){
    this.isLoader=true;
    let requestObject = {
      "business_id": this.businessId,
      "selected_date":this.selecteddate,
      "service_id":this.currentSelectedService,
      };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/list-availabel-timings`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        this.timeSlotArr.length=0;
        this.timeSlotArrForLabel.length=0;
        //this.timeSlotArr = response.response;
        this.minimumAdvanceBookingDateTimeObject = new Date();
        this.minimumAdvanceBookingDateTimeObject.setMinutes( this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime );

        
        response.response.forEach(element => {
         
          if((new Date(this.datePipe.transform(this.selecteddate,"yyyy-MM-dd")+" "+element+":00")).getTime() > (this.minimumAdvanceBookingDateTimeObject).getTime()){
           
            this.timeSlotArr.push(element);
          }
        }); 
        var i=0;
        this.timeSlotArr.forEach( (element) => {
          var dateTemp=this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element+":00";
           this.timeSlotArrForLabel[i]= this.datePipe.transform(new Date(dateTemp),"hh:mm a");
           i++;
        });
        this.timeslotview = true;
        this.isLoader=false;
      }
      else{
        this.timeSlotArr.length=0;
        this.timeSlotArrForLabel.length=0;
        this.timeslotview = false;
        this.isLoader=false;
      }
      },
      (err) =>{
        this.timeSlotArr.length=0;
        this.timeSlotArrForLabel.length=0;
        this.timeslotview = false;
        this.isLoader=false;
       
      })
  }
 
  fnSelectTimeSlot(timeSlot,index){
    this.selectedTimeSlot=timeSlot;
    this.availableStaff.length=0;
    this.isStaffAvailable = false;
    if(this.staffOnFrontValue == true){
      this.fnGetStaff();
    }else{
      this.fnSelectStaff(null,index);
    }
  }

  fnGetStaff(){
    this.isLoader=true;
    let requestObject = {
      "business_id": this.businessId,
      "postal_code":this.booking.postalcode,
      "service_id":this.currentSelectedService,
      "book_date" : this.datePipe.transform(new Date(this.selecteddate),"yyyy-MM-dd"),
      "book_time" : this.selectedTimeSlot, 
      "internal_staff" : "N"
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/service-staff`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
          this.availableStaff = response.response;
          this.isStaffAvailable = true;
          this.isLoader=false;
      }
      else{
        this.availableStaff.length=0;
       this.isStaffAvailable = false;
       this.isLoader=false;
      }
      },
      (err) =>{
        this.isStaffAvailable = false;
        this.isLoader=false;
       
      })
  }
  
  closePopover() {
    this.trigger.toArray()[0].togglePopover();
  }
  fnOpenCartbox(){
  }
  
  fnSelectStaff(staff_id,index){
    this.isLoader=true;
    if(this.selectedTheme !== '2'){
      if(this.staffOnFrontValue){
        this.trigger.toArray()[index].togglePopover();
      }
      this.serviceCount[this.currentSelectedService].appointmentDateForLabel=this.datePipe.transform(new Date(this.selecteddate),"MMM dd, yyyy");
    }
    this.serviceCount[this.currentSelectedService].appointmentDate=this.selecteddate;
    this.serviceCount[this.currentSelectedService].appointmentDateForLabel=this.datePipe.transform(new Date(this.selecteddate),"MMMM dd, yyyy");
    this.serviceCount[this.currentSelectedService].assignedStaff=staff_id;
    this.serviceCount[this.currentSelectedService].appointmentTimeSlot=this.selectedTimeSlot;
    this.serviceCount[this.currentSelectedService].appointmentTimeSlotForLabel=this.datePipe.transform(new Date(this.selecteddate+" "+this.selectedTimeSlot),"hh:mm a");
    this.serviceCartArr[this.currentSelectedService]=this.serviceCount[this.currentSelectedService]
    this.serviceMainArr.totalNumberServices=0;
    this.serviceMainArr.subtotal=0;
    this.serviceMainArr.discount=0;
      this.taxAmountArr.length=0;
    this.serviceMainArr.netCost=0;
    for(let i=0; i< this.serviceCartArr.length; i++){
      if(this.serviceCartArr[i] != null){
        this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
        this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
      }
    }
    this.snackBar.open("Added to cart", "X", {
      duration: 2000,
      verticalPosition: 'top',
      panelClass : ['green-snackbar']
    });
    var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
    var amountAfterTax=0;
    if(this.serviceMainArr.subtotal > 0){
      this.taxArr.forEach((element) => {
        let taxTemp={
          value:0,
          name:'',
          amount:0
        }
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
      });
    }
    // this.taxAmountArr.forEach((element) => {
    //   amountAfterDiscount=amountAfterDiscount+element;
    // });
    this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
    this.isLoader=false;
  }
  

  fnUserType(event,usertype){
    if(usertype == "existing"){
      this.existinguser = true;
      this.newuser = false;
    }else{
      this.newuser = true;
      this.existinguser = false;
    }
    
  }

  fnloginexisinguser(){
    if(!this.formExistingUser.valid){
      this.formExistingUser.get('existing_mail').markAsTouched();
      this.formExistingUser.get('existing_password').markAsTouched();
      
      return false;
     }
     let requestObject = {
       "email" : this.formExistingUser.get('existing_mail').value,
       "password" : this.formExistingUser.get('existing_password').value,
       "business_id": this.businessId
       };
    this.fnLogin(requestObject);
  }

  fnOtploginexisinguser(){
    if(!this.formOtpExistingUser.valid){
     this.formOtpExistingUser.get('existing_phone').markAsTouched();
     this.formOtpExistingUser.get('existing_otp').markAsTouched();
     console.log("error");
     return false;
    }

    var phone = this.formOtpExistingUser.get('existing_phone').value.e164Number;
    // phone = "+"+this.selectedPhoneCode+phone;
    let requestObject = {
      "phone" : phone,
      "otp" : this.formOtpExistingUser.get('existing_otp').value,
      "business_id": this.businessId
      };
   this.fnOtpLogin(requestObject);
  }

  getOtp() {
    if(this.formOtpExistingUser.get('existing_phone').valid) {
      var phone = this.formOtpExistingUser.get('existing_phone').value.e164Number;
      // phone = "+"+this.selectedPhoneCode+phone;
      let requestObject = {
          'phone' : phone,
          'business_id' : this.businessId,
          'country_code' : this.formOtpExistingUser.get('existing_phone').value.dialCode
      }
      this.fnGetOtp(requestObject);
    }
    
}

fnLoginType(event,logintype){
  if(logintype == "otp"){
    this.otpLogin = true;
    this.normalLogin = false;
  }else{
      this.otpLogin = false;
      this.normalLogin = true;
  }
}

fnGetOtp(requestObject){
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  this.http.post<any>(`${environment.apiUrl}/send-otp`, requestObject, {headers:headers})
    .pipe(map(data => { 
        return data;
    }),
    catchError(this.handleError)).subscribe((response:any) => {
      if(response.data == true){
        this.loginShow = true;
        this.otpShow = false;                
      }
    },(err) =>{ 
      this.errorMessage = this.handleError;
   });
}  

  fnOtpLogin(requestObject){
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
 
    this.http.post(`${environment.apiUrl}/otp-login`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)).subscribe((response:any) => {
       if(response.data == true ){
         localStorage.setItem('currentUser', JSON.stringify(response.response));
         localStorage.setItem('isFront', "true");
         this.authenticationService.currentUserSubject.next(response.response);
 
         this.customerName=response.response.fullname;
       
         this.customerFirstname = this.customerName!=undefined?this.customerName.split(" ")[0]:'';
         this.customerLastname  =  this.customerName!=undefined?this.customerName.split(" ")[1]:'';
 
         this.customerEmail=this.authenticationService.currentUserValue.email;
         this.customerPhone=this.authenticationService.currentUserValue.phone;
       
           this.showSameAsAboveCheck=false;
           this.snackBar.open("Login successfull.", "X", {
             duration: 2000,
             verticalPosition: 'top',
             panelClass : ['green-snackbar']
             });
         if(this.is_at_home_service){
           if(this.existinguser){
             this.personalinfo = false;
             this.appointmentinfo = true;
             this.isLoggedIn=true;
           }else if(this.newuser){
             this.personalinfo = false;
             this.appointmentinfo = false;
             this.summaryScreen = true;
             this.isLoggedIn=true;
           }
         }else if(!this.is_at_home_service){
           this.personalinfo = false;
           this.appointmentinfo = false;
           this.summaryScreen = true;
           this.isLoggedIn=true;
         }
       }else{
 
         this.snackBar.open(response.response, "X", {
         duration: 2000,
         verticalPosition: 'top',
         panelClass : ['red-snackbar']
         });
 
         this.showSameAsAboveCheck=true;
       }
     },(err) =>{ 
        this.errorMessage = this.handleError;
     });
   }

   fnLogin(requestObject){
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
 
    this.http.post(`${environment.apiUrl}/customer-login`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)).subscribe((response:any) => {
       if(response.data == true ){
         localStorage.setItem('currentUser', JSON.stringify(response.response));
         localStorage.setItem('isFront', "true");
         this.authenticationService.currentUserSubject.next(response.response);
 
 
         this.customerName=response.response.fullname;
       
         this.customerFirstname = this.customerName!=undefined?this.customerName.split(" ")[0]:'';
         this.customerLastname  =  this.customerName!=undefined?this.customerName.split(" ")[1]:'';
 
         this.customerEmail=this.authenticationService.currentUserValue.email;
         this.customerPhone=this.authenticationService.currentUserValue.phone;
       
           this.showSameAsAboveCheck=false;
           this.snackBar.open("Login successfull.", "X", {
             duration: 2000,
             verticalPosition: 'top',
             panelClass : ['green-snackbar']
             });
         if(this.is_at_home_service){
           if(this.existinguser){
             this.personalinfo = false;
             this.appointmentinfo = true;
             this.isLoggedIn=true;
           }else if(this.newuser){
             this.personalinfo = false;
             this.appointmentinfo = false;
             this.summaryScreen = true;
             this.isLoggedIn=true;
           }
         }else if(!this.is_at_home_service){
           this.personalinfo = false;
           this.appointmentinfo = false;
           this.summaryScreen = true;
           this.isLoggedIn=true;
         }
       }else{
 
         this.snackBar.open(response.response, "X", {
         duration: 2000,
         verticalPosition: 'top',
         panelClass : ['red-snackbar']
         });
 
         this.showSameAsAboveCheck=true;
       }
     },(err) =>{ 
        this.errorMessage = this.handleError;
     });
   }
 
   
   fnNewLogin(requestObject){
     let headers = new HttpHeaders({
       'Content-Type': 'application/json',
     });
  
     this.http.post(`${environment.apiUrl}/new-customer-login`,requestObject,{headers:headers} ).pipe(
       map((res) => {
         return res;
       }),
       catchError(this.handleError)).subscribe((response:any) => {
        if(response.data == true ){
          localStorage.setItem('currentUser', JSON.stringify(response.response));
          localStorage.setItem('isFront', "true");
          this.authenticationService.currentUserSubject.next(response.response);
  
  
          this.customerName=response.response.fullname;
        
          this.customerFirstname = this.customerName!=undefined?this.customerName.split(" ")[0]:'';
          this.customerLastname  =  this.customerName!=undefined?this.customerName.split(" ")[1]:'';
  
          this.customerEmail=this.authenticationService.currentUserValue.email;
          this.customerPhone=this.authenticationService.currentUserValue.phone;
        
          if(this.is_at_home_service){
            if(this.existinguser){
              this.personalinfo = false;
              this.appointmentinfo = true;
              this.isLoggedIn=true;
            }else if(this.newuser){
              this.personalinfo = false;
              this.appointmentinfo = false;
              this.summaryScreen = true;
              this.isLoggedIn=true;
            }
          }else if(!this.is_at_home_service){
            this.personalinfo = false;
            this.appointmentinfo = false;
            this.summaryScreen = true;
            this.isLoggedIn=true;
          }
        }else{
  
          this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
          });
  
          this.showSameAsAboveCheck=true;
        }
      },(err) =>{ 
         this.errorMessage = this.handleError;
      });
    }
  
  // personal info
  isEmailUnique(control: FormControl) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let emailCheckRequestObject = {
          'business_id':this.businessId,
          'email': control.value,
          'phone': null,
          'customer_id':null,
          'checkType':'email', 
        }
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      return this.http.post(`${environment.apiUrl}/customer-check`, emailCheckRequestObject,{headers:headers}).pipe(map((response : any) =>{
        return response;
      }),
      catchError(this.handleError)).subscribe((res) => {
        if(res){
          if(res.data == false){
          resolve({ isEmailUnique: true });
          }else{
          resolve(null);
          }
        }
      });
      }, 500);
    });
  }

  isCustomerPhoneUnique(control: FormControl) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let phoneCheckRequestObject = {
          'business_id':this.businessId,
          'email': null,
          'customer_id':null,
          'phone': control.value,
          'checkType':'phone', 
        }
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/customer-check`, phoneCheckRequestObject,{headers:headers}).pipe(map((response : any) =>{
          return response;
        }),
        catchError(this.handleError)).subscribe((res) => {
          if(res){
            if(res.data == false){
            resolve({ isPhoneUnique: true });
            }else{
            resolve(null);
            }
          }
        });
      }, 500);
    });
  }


  fnPhoneMouceLeave(){


    if(this.formNewUser.get('newUserPhone').value==undefined){
      this.phoneNumberInvalid = "required";
      return;
    }

    if(this.formNewUser.get('newUserPhone').value === null){
      this.phoneNumberInvalid = "required";
    
    }else if(this.formNewUser.get('newUserPhone').value !== '' || this.formNewUser.get('newUserPhone').value !== null){
      if(this.formNewUser.get('newUserPhone').value.number.length >= 6 && this.formNewUser.get('newUserPhone').value.number.length <= 15){
        this.phoneNumberInvalid = "valid";
      }else{
        this.phoneNumberInvalid = "length";
      }
    }
  }

  fnenterPhoneNumber(){

    if(this.formNewUser.get('newUserPhone').value==undefined){
      this.phoneNumberInvalid = "valid";
      return;
    }

    if( this.formNewUser.get('newUserPhone').value !== '' || this.formNewUser.get('newUserPhone').value !== null ){
      if(this.formNewUser.get('newUserPhone').value.number.length >= 6 && this.formNewUser.get('newUserPhone').value.number.length <= 15){
        this.phoneNumberInvalid = "valid";
      }else{
        this.phoneNumberInvalid = "length";
      }
    }else if(this.formNewUser.get('newUserPhone').value === '' || this.formNewUser.get('newUserPhone').value === null){
      this.phoneNumberInvalid = "required";
    }
  }

  fnpersonalinfo(){
    
  
    
    
    if(this.formNewUser.invalid){
      this.formNewUser.get('newUserEmail').markAsTouched();
      this.formNewUser.get('newUserPassword').markAsTouched();
      this.formNewUser.get('newUserFullname').markAsTouched();
      
      if(this.formNewUser.get('newUserPhone').value === null){
        this.phoneNumberInvalid = "required";
        return false;
      }
      
      if(this.formNewUser.get('newUserPhone').value.number.length <= 6 || this.formNewUser.get('newUserPhone').value.number.length >= 15){
        this.phoneNumberInvalid = "valid";
        this.formNewUser.get('newUserPhone').markAsTouched();
        return false;
      }

      if(this.contactFormSettingsArr.contact_field_status == true){
        if(this.contactFormSettingsArr.addressField.status == 1){
          this.formNewUser.get('newUserAddress').markAsTouched();
          this.formNewUser.get('newUserState').markAsTouched();
          this.formNewUser.get('newUserCity').markAsTouched();
          this.formNewUser.get('newUserZipcode').markAsTouched();
        }
      }else{
        this.formNewUser.get('newUserAddress').markAsTouched();
        this.formNewUser.get('newUserState').markAsTouched();
        this.formNewUser.get('newUserCity').markAsTouched();
        this.formNewUser.get('newUserZipcode').markAsTouched();
      }
      return false;
    }

    if(this.formNewUser.get('newUserPhone').value === null){
      this.phoneNumberInvalid = "required";
      return false;
    }
    
    if(this.formNewUser.get('newUserPhone').value.number.length <= 6 || this.formNewUser.get('newUserPhone').value.number.length >= 15){
      this.phoneNumberInvalid = "valid";
      this.formNewUser.get('newUserPhone').markAsTouched();
      return false;
    }

    if(this.formNewUser.valid){
      this.fnSignUp();
    } 
    
   }
   
  fnSignUp(){
    let newUserAddress="";
    let newUserState="";
    let newUserCity="";
    let newUserZipcode="";
    if(this.contactFormSettingsArr.contact_field_status == true){
      if(this.contactFormSettingsArr.addressField.status == 1){
        newUserAddress=this.formNewUser.get('newUserAddress').value;
        newUserState=this.formNewUser.get('newUserState').value;
        newUserCity=this.formNewUser.get('newUserCity').value;
        newUserZipcode=this.formNewUser.get('newUserZipcode').value;
      }
    }else{
      newUserAddress=this.formNewUser.get('newUserAddress').value;
      newUserState=this.formNewUser.get('newUserState').value;
      newUserCity=this.formNewUser.get('newUserCity').value;
      newUserZipcode=this.formNewUser.get('newUserZipcode').value;
    }
    let requestObject = {
      "email" : this.formNewUser.get('newUserEmail').value,
      "password" : this.formNewUser.get('newUserPassword').value,
      "fullname":this.formNewUser.get('newUserFullname').value,
      "phone":this.formNewUser.get('newUserPhone').value.internationalNumber.replace(/\s/g, ""),
      //"phone":this.formNewUser.get('newUserPhone').value,
      "address":newUserAddress,
      "zip":newUserZipcode,
      "state":newUserState,
      "city":newUserCity,
      "business_id": this.businessId
      };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    this.http.post(`${environment.apiUrl}/customer-signup`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        this.snackBar.open("Customer Registered", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['green-snackbar']
        });
        let requestObject2 = {
          "email" : this.formNewUser.get('newUserEmail').value,
          "password" : this.formNewUser.get('newUserPassword').value,
          "business_id": this.businessId
          };
        this.fnNewLogin(requestObject2);
      }else{
        this.personalinfo = true;
      }
    },
    (err) =>{
      this.personalinfo = true;
     
    })
  }

  fnsameasabove(event){
    if(event.srcElement.checked == true){
      
    if(this.contactFormSettingsArr.contact_field_status == true){
      if(this.contactFormSettingsArr.addressField.status == 1){
        this.formAppointmentInfo.controls['appo_address'].setValue(this.formNewUser.get('newUserAddress').value);
        this.formAppointmentInfo.controls['appo_state'].setValue(this.formNewUser.get('newUserState').value);
        this.formAppointmentInfo.controls['appo_city'].setValue(this.formNewUser.get('newUserCity').value);
        this.formAppointmentInfo.controls['appo_zipcode'].setValue(this.formNewUser.get('newUserZipcode').value);
      }
    }else{
      this.formAppointmentInfo.controls['appo_address'].setValue(this.formNewUser.get('newUserAddress').value);
      this.formAppointmentInfo.controls['appo_state'].setValue(this.formNewUser.get('newUserState').value);
      this.formAppointmentInfo.controls['appo_city'].setValue(this.formNewUser.get('newUserCity').value);
      this.formAppointmentInfo.controls['appo_zipcode'].setValue(this.formNewUser.get('newUserZipcode').value);
    }
      
    }else{
      this.formAppointmentInfo.controls['appo_address'].setValue(null);
      this.formAppointmentInfo.controls['appo_state'].setValue(null);
      this.formAppointmentInfo.controls['appo_city'].setValue(null);
      this.formAppointmentInfo.controls['appo_zipcode'].setValue(null);

    }
  } 

  fnSameAsBillingAddress(event){


    if(event.srcElement.checked == true){
      
      this.formAppointmentInfo.controls['appo_address'].setValue(this.authenticationService.currentUserValue.address);
      this.formAppointmentInfo.controls['appo_state'].setValue(this.authenticationService.currentUserValue.state);
      this.formAppointmentInfo.controls['appo_city'].setValue(this.authenticationService.currentUserValue.city);
      this.formAppointmentInfo.controls['appo_zipcode'].setValue(this.authenticationService.currentUserValue.zip);

    }else{

      this.formAppointmentInfo.controls['appo_address'].setValue('');
      this.formAppointmentInfo.controls['appo_state'].setValue('');
      this.formAppointmentInfo.controls['appo_city'].setValue('');
      this.formAppointmentInfo.controls['appo_zipcode'].setValue('');

    }
  } 
  
  fnappointmentinfo(event){

    if(this.is_at_home_service==true){
      if(!this.formAppointmentInfo.valid){
        this.formAppointmentInfo.get('appo_address').markAsTouched();
        this.formAppointmentInfo.get('appo_state').markAsTouched();
        this.formAppointmentInfo.get('appo_city').markAsTouched();
        this.formAppointmentInfo.get('appo_zipcode').markAsTouched();
        return false;
      }
    }

    this.appointmentinfo = false;
    this.summaryScreen = true;

  }

  // coupon code
  fncheckcouponcodebtn(couponStatus){
    if(this.coupon.couponcode_val == ''){
      this.closecoupon = 'invalid';
      this.couponIcon="check";
      this.isReadOnly="";
      return false;
    }
    this.fncheckavailcoupon(couponStatus);
  }

  fncheckavailcoupon(couponStatus){
    if(couponStatus == 'valid'){
      this.serviceMainArr.discount_type = null;
      this.serviceMainArr.discount_value=null;
      this.taxAmountArr.length=0;
              
      this.serviceMainArr.totalNumberServices=0;
      this.serviceMainArr.subtotal=0;
      this.serviceMainArr.discount=0;
      this.taxAmountArr.length=0;
      this.serviceMainArr.netCost=0;

      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceCartArr[i].subtotal = this.serviceCartArr[i].service_cost * this.serviceCartArr[i].count;
          this.serviceCartArr[i].discount_type=null;
          this.serviceCartArr[i].discount_value=null;

          this.serviceCartArr[i].discount=0;

          var serviceAmountAfterDiscount= this.serviceCartArr[i].subtotal - this.serviceCartArr[i].discount;
          var serviceTaxAmount=0;
          let taxMain=[];
          this.taxArr.forEach((element) => {
            let taxTemp={
              value:0,
              name:'',
              amount:0
            }
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
            this.serviceCartArr[i].tax=taxMain;
          });

          this.serviceCartArr[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
        }
      }
      this.serviceMainArr.discount_type = null;
      this.serviceMainArr.discount_value = null;
      this.serviceMainArr.discount=0;

      var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      var amountAfterTax=0;
      if(this.serviceMainArr.subtotal > 0){
        this.taxArr.forEach((element) => {
         
          let taxTemp={
          value:0,
            name:'',
            amount:0
          }
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
        });
      }
      this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
      this.closecoupon = 'default';
      this.couponIcon="check";
      this.coupon.couponcode_val ="";
      this.isReadOnly="";
    }else{
      let allServiceIds='';
      for(let i=0; i<this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i]){
          allServiceIds=allServiceIds+this.serviceCartArr[i].id+',';
        }
      }
      allServiceIds=allServiceIds.substring(0, allServiceIds.length - 1);
      var allServiceIdsArr=allServiceIds.split(",");
     
      let requestObject = {
      "business_id" : this.businessId,
      "service_id" : allServiceIds,
      "coupon_code" : this.coupon.couponcode_val,
      };
     let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/check-discount-coupon`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        let couponType = response.response.coupon_type;
        let couponValue = response.response.coupon_value;
        this.taxAmountArr.length=0;
                
        this.serviceMainArr.totalNumberServices=0;
        this.serviceMainArr.subtotal=0;
        this.serviceMainArr.discount=0;
        this.taxAmountArr.length=0;
       this.serviceMainArr.netCost=0;

        for(let i=0; i< this.serviceCartArr.length; i++){
          if(this.serviceCartArr[i] != null){
            this.serviceCartArr[i].subtotal = this.serviceCartArr[i].service_cost * this.serviceCartArr[i].count;
            this.serviceCartArr[i].discount_type=couponType;
            this.serviceCartArr[i].discount_value=parseInt(couponValue);

            if(this.serviceCartArr[i].discount_type == 'P'){
              this.serviceCartArr[i].discount = (this.serviceCartArr[i].subtotal*parseInt(this.serviceCartArr[i].discount_value))/100;
            }else{
              this.serviceCartArr[i].discount = parseInt(this.serviceCartArr[i].discount_value)/allServiceIdsArr.length;
            }

            var serviceAmountAfterDiscount= this.serviceCartArr[i].subtotal - this.serviceCartArr[i].discount;
            var serviceTaxAmount=0;
            let taxMain=[];
            this.taxArr.forEach((element) => {
              let taxTemp={
                value:0,
                name:'',
                amount:0
              }
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
              this.serviceCartArr[i].tax=taxMain;
            });

            this.serviceCartArr[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
            this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
            this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
          }
        }
        this.serviceMainArr.discount_type = couponType;
        this.serviceMainArr.discount_value = parseInt(couponValue);
        if(couponType == 'P'){
          this.serviceMainArr.discount = (this.serviceMainArr.subtotal*parseInt(couponValue))/100;
        }else{
          this.serviceMainArr.discount = parseInt(couponValue);
        }

        var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
        var amountAfterTax=0;
        if(this.serviceMainArr.subtotal > 0){
          this.taxArr.forEach((element) => {
            
            let taxTemp={
              value:0,
              name:'',
              amount:0
            }
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
          });
        }
        this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
        this.coupon.couponcode_val=response.response.coupon_code;
        this.couponIcon="close";
        this.closecoupon = 'valid';
        this.isReadOnly="readonly";
        this.showCouponError=false;
        this.couponErrorMessage="";
        }
      else{
        this.closecoupon = 'invalid';
        this.couponIcon="check";
        this.isReadOnly="";
        this.showCouponError=true;
        this.couponErrorMessage=response.response;
        }
      },
      (err) =>{
        this.closecoupon = 'invalid';
        this.couponIcon="check";
        this.isReadOnly="";
        this.showCouponError=false;
        this.couponErrorMessage="";
       
      })
    }
  }

  fnProceedToPayment(event){
    
    if(this.PrivacyPolicyStatusValue == false && this.termsConditionsStatusValue == false){
      this.PrivacyPolicyStatusValidation = true;
      this.termsConditionsStatusValidation = true;
      return false;
    }
    else if(this.termsConditionsStatusValue == false){
      this.termsConditionsStatusValidation = true;
      return false;
    }
    else if(this.PrivacyPolicyStatusValue == false){
      this.PrivacyPolicyStatusValidation = true;
      return false;
    }
    if(this.closecoupon != 'valid'){
      this.coupon.couponcode_val=''
    }

    let digit5= Math.floor(Math.random()*90000) + 10000;
    this.reference_id="2_"+digit5+"_"+ this.datePipe.transform(new Date(),"yyyy/MM/dd") ;
    this.itemArr= [];
      for(let i=0; i<this.serviceCartArr.length;i++){
        if(this.serviceCartArr[i]){
          let singleItem={
            name: this.serviceCartArr[i].service_name,
            quantity: '1',
            description : 'Actual Quantity - '+JSON.stringify(this.serviceCartArr[i].count),
            category: 'DIGITAL_GOODS',
           // tax:{currency_code:"USD", value:"1.00"},
            unit_amount: {
              currency_code: this.currencySymbol,
              value: JSON.stringify(this.serviceCartArr[i].subtotal)
            }
          }
          this.itemArr.push(singleItem);

        }
      }
      this.taxAmount=0;
      this.taxAmountArr.forEach(element=>{
        this.taxAmount=this.taxAmount+element.amount;
      });
    this.summaryScreen = false;
    this.paymentScreen =true;
  }
  
  fnbacktocategory(event){
    this.subcatselection = false;
    this.serviceselection =false;
    this.dateselection = false;
    this.personalinfo = false;
    this.appointmentinfo = false;
    this.summaryScreen = false;
    this.paymentScreen= false;
    this.catselection = true;
   }


   fnbackfromsubservice(){
    if(this.directService){
      this.serviceselection =false;
      this.catselection = true;
    }else{
      this.serviceselection =false;
      this.subcatselection = true;
    }
   }

   fnbackfromservice(){
    this.subcatselection = false;
    this.catselection = true;
   }

  //  fnbackfromdate(){
  //     this.dateselection=false;
  //     this.catselection = true;
  //  }

   fnbacktofirst(){
    this.subcatselection = false;
    this.serviceselection =false;
    this.dateselection = false;
    this.personalinfo = false;
    this.appointmentinfo = false;
    this.summaryScreen = false;
    this.paymentScreen= false;
    this.catselection = true;
   }

  fnPaymentMethod(paymentMethod){
    
      this.paymentMethod=paymentMethod;
      this.paymentDateTime=this.datePipe.transform(new Date(),"yyyy-MM-dd HH:mm:ss");
   
  }
  
  // date time 
  fnContinueFromCart(){
    if(this.isLoggedIn){
      if(this.is_at_home_service){
        this.dateselection = false;
        this.catselection=false;
        this.subcatselection=false;
        this.dateselection=false;
        this.serviceselection=false;
        this.personalinfo=false;
        this.summaryScreen=false;
        this.paymentScreen=false;
        this.appointmentinfo = true;
        this.showSameAsAboveCheck=false;
      }else{
        this.serviceselection = false;
        this.appointmentinfo = false;
        this.summaryScreen = true;
        this.showSameAsAboveCheck=false;
        this.dateselection = false;
        this.catselection=false;
        this.subcatselection=false;
        this.dateselection=false;
        this.serviceselection=false;
        this.personalinfo=false;
        this.paymentScreen=false;
        this.appointmentinfo = true;
        this.showSameAsAboveCheck=false;
      }
    }else{
      this.dateselection = false;
      this.catselection=false;
      this.subcatselection=false;
      this.dateselection=false;
      this.serviceselection=false;
      this.summaryScreen=false;
      this.paymentScreen=false;
      this.appointmentinfo = false;
      this.dateselection = false;
      this.personalinfo = true;
      this.showSameAsAboveCheck=true;
    }
  }

  fnPayNow(){
    if(this.paymentMethod == 'Cash'){
      this.fnAppointmentBooking();
    }
    // if(this.paymentMethod == 'BankTransfer'){
    //   this.fnAppointmentBooking();
    // }
    // if(this.paymentMethod == 'stripe'){
    //   this.stripePayment();
    // }
    // if(this.paymentMethod == 'PayUMoney'){
    //   if(this.PayUMoney.key!="" && this.PayUMoney.salt!=""){
    //     this.fnPayUMoney();
    //   }
    // }
  }
  // stripePayment(){
    
  //   if(this.cardForm.valid){
  //     this.isLoader = true;
  //     let requestObject ={
  //       "name" : this.cardForm.get("cardHolderName").value,
  //       "number" : this.cardForm.get("cardNumber").value,
  //       "exp_month" : this.cardForm.get("expiryMonth").value,
  //       "exp_year" : this.cardForm.get("expiryYear").value,
  //       "cvc" : this.cardForm.get("cvvCode").value,
  //       "amount" : this.serviceMainArr.netCost,
  //       "business_id" : this.businessId,
  //     }
  //     let headers = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     });
  
  //     this.http.post(`${environment.apiUrl}/stripe-payment`,requestObject,{headers:headers} ).pipe(
  //       map((res) => {
  //         return res;
  //       }),
  //       catchError(this.handleError)
  //     ).subscribe((response:any) => {
  //       if(response.data == true){
  //         let digit5= Math.floor(Math.random()*90000) + 10000;
  //       this.reference_id="2_"+digit5+"_"+ this.datePipe.transform(new Date(),"yyyy/MM/dd") ;
  //         this.transactionId = response.response.id 
  //         this.paymentDateTime = this. datePipe.transform(new Date(),"yyyy/MM/dd");
  //         this.isLoader=false;
  //         this.fnAppointmentBooking();
  //     }
  //       else{
  //         this.snackBar.open("Card Invalid", "X", {
  //         duration: 2000,
  //         verticalPosition: 'top',
  //         panelClass : ['red-snackbar']
  //         });
  //         this.isLoader=false;
  //       }
  //       },
  //       (err) =>{
          
  //       })
  //   }else{
  //     this.cardForm.get("cardHolderName").markAsTouched();
  //     this.cardForm.get("cardNumber").markAsTouched();
  //     this.cardForm.get("expiryMonth").markAsTouched();
  //     this.cardForm.get("expiryYear").markAsTouched();
  //     this.cardForm.get("cvvCode").markAsTouched();
  //   }
  // }

  // private initConfig(): void {
  //     this.payPalConfig = {
  //     currency: this.currencySymbol,
  //     clientId: this.paypalClientId,
  //     //clientId: 'AXQW9QFCurkFtIGNbnex8fp8oanZWUZFVhEmwU4GK39xbOzqetPmQj8wnju2U7yOvn9xBBojoqGsIWSh',
  //     // clientId: 'sb',
  //     createOrderOnClient: (data) => <ICreateOrderRequest>{
  //       intent: 'CAPTURE',
  //       purchase_units: [
  //         {
  //           reference_id: this.reference_id,
  //           amount: {
  //             currency_code: this.currencySymbol,
  //             value: JSON.stringify(this.serviceMainArr.netCost),
  //             breakdown: {
  //               item_total: {
  //                 currency_code: this.currencySymbol,
  //                 value: JSON.stringify(this.serviceMainArr.subtotal)
  //               },
  //               tax_total : {
  //                 currency_code: this.currencySymbol,
  //                 value: JSON.stringify(this.taxAmount)
  //               },
  //               discount : {
  //                 currency_code: this.currencySymbol,
  //                 value: JSON.stringify(this.serviceMainArr.discount)
  //               }
  //             }
  //           },
  //           items: this.itemArr,
  //         }
  //       ]
  //     },
   
  //     advanced: {
  //       commit: 'true'
  //     },
  //     style: {
  //       label: 'paypal',
  //       layout: 'vertical',
  //       size: "responsive"
  //     },
  //     onApprove: (data, actions) => {
  //     this.isLoader=true
  //       actions.order.get().then(details => {
  //       });
  //     },
  //     onClientAuthorization: (data) => {
  //        if(data.status && data.status== "COMPLETED"){
  //         this.transactionId=data.id;
  //         this.paymentDateTime= this.datePipe.transform(data.create_time,"yyyy-MM-dd HH:mm:ss");
  //         this.fnAppointmentBooking();
  //       }
  //       //this.fnAppointmentBooking();
  //     },
  //     onCancel: (data, actions) => {
  //      this.snackBar.open("Transaction Cancelled", "X", {
  //       duration: 2000,
  //       verticalPosition: 'top',
  //       panelClass : ['red-snackbar']
  //       });
  //     },
  //     onError: err => {
  //       this.snackBar.open("Error: "+err, "X", {
  //       duration: 2000,
  //       verticalPosition: 'top',
  //       panelClass : ['red-snackbar']
  //       });
  //     },
  //     onClick: (data, actions) => {
  //     },
   
  //   };
  //   }

  fnAppointmentBooking(){
    this.isLoader=true;
    let serviceCartArrTemp:any= [];
    for(let i=0; i<this.serviceCartArr.length;i++){
      if(this.serviceCartArr[i]){
        serviceCartArrTemp.push(this.serviceCartArr[i]);
      //  this.serviceCartArr[i].
      }
    }
    const currentDateTime = new Date();
    let bookingNotes = {
      "user_type": 'C',
      "note_type": 'normal',
      "user_id": this.authenticationService.currentUserValue.user_id,
      "notes":this.formNewUser.get('newUserSplReq').value ? this.formNewUser.get('newUserSplReq').value : null
     }
     this.cartRequestObject = {
      "postal_code" : this.booking.postalcode,
      "business_id" : this.businessId,
      "serviceInfo" : serviceCartArrTemp,
      "appointment_address" : this.formAppointmentInfo.get('appo_address').value,
      "appointment_state" : this.formAppointmentInfo.get('appo_state').value,
      "appointment_city" : this.formAppointmentInfo.get('appo_city').value,
      "appointment_zipcode" : this.formAppointmentInfo.get('appo_zipcode').value,
      "coupon_code" : this.coupon.couponcode_val,
      "customer_id": this.authenticationService.currentUserValue.user_id,
      "customer_token" : this.authenticationService.currentUserValue.token,
      "notes" : bookingNotes,
      "subtotal" : this.serviceMainArr.subtotal,
      "discount_type" : this.serviceMainArr.discount_type,
      "discount_value" : this.serviceMainArr.discount_value,
      "discount" : this.serviceMainArr.discount,
      "tax" : this.taxAmountArr,
      "nettotal" : this.serviceMainArr.netCost,
      "payment_method" : this.paymentMethod,
      "order_date": this.datePipe.transform(currentDateTime,"yyyy-MM-dd"),
      "reference_id": this.reference_id,
      "transaction_id": this.transactionId,
      "payment_datetime": this.paymentDateTime,
      'fullname' : JSON.parse(localStorage.getItem('currentUser')).full_name ? JSON.parse(localStorage.getItem('currentUser')).full_name : JSON.parse(localStorage.getItem('currentUser')).fullname,
      'full_name' : JSON.parse(localStorage.getItem('currentUser')).full_name ? JSON.parse(localStorage.getItem('currentUser')).full_name : JSON.parse(localStorage.getItem('currentUser')).fullname,
    };
     
   
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
      this.http.post(`${environment.apiUrl}/order-create`,this.cartRequestObject,{headers:headers} ).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
          
          this.isLoader=false;
          this.paymentScreen=false;
          this.thankYouScreen=true;
          if(this.thankYou.status == true){
            setTimeout(() => {
              window.open(this.thankYou.page_link, "_blank");
            }, 2000);
          }else {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
          this.fnViewDashboard();
        }else{
          this.snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
      },(err) =>{
        
      })
    }


    // guid() {
    //   return this.s4() + this.s4() + this.s4() + this.s4();
    // }

    // s4() {
    //   return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    // }

    // getTxnId(){
    //   return this.guid();
    // }
    
     // Get Random Transaction Id

    // fnPayUMoney(){

    //   this.PayUMoney.txnid= this.getTxnId();
    //   this.PayUMoney.amount= this.serviceMainArr.netCost.toString();
    //   this.PayUMoney.firstname= this.customerFirstname;
    //   this.PayUMoney.email= this.customerEmail,
    //   this.PayUMoney.phone= this.customerPhone,
    //   this.PayUMoney.productinfo= 'Product Description';
    //   this.PayUMoney.surl= environment.urlForLink;
    //   this.PayUMoney.furl= environment.urlForLink;
    //   this.PayUMoney.mode='dropout';// non-mandatory for Customized Response Handling
    //   this.PayUMoney.udf1='';
    //   this.PayUMoney.udf2='';
    //   this.PayUMoney.udf3='';
    //   this.PayUMoney.udf4='';
    //   this.PayUMoney.udf5='';
      
    //   // #Where salt is available on the PayUMoney dashboard.
    //   var RequestData = {
    //     key: this.PayUMoney.key,
    //     txnid: this.PayUMoney.txnid,
    //     hash: '',
    //     amount: this.PayUMoney.amount,
    //     firstname: this.PayUMoney.firstname,
    //     email: this.PayUMoney.email,
    //     phone: this.PayUMoney.phone,
    //     productinfo: this.PayUMoney.productinfo,
    //     surl : this.PayUMoney.surl,
    //     furl: this.PayUMoney.furl,
    //     // mode:this.PayUMoney.mode// non-mandatory for Customized Response Handling
    //   }
    //   this.generateRequestHash(RequestData);
    //   var Handler = {
    //     responseHandler: (BOLT) => {
    //       if(BOLT && BOLT.response.txnStatus == "SUCCESS"){
    //         let generatedHash=this.generateResponseHash(BOLT.response);
    //         if(BOLT.response.hash == generatedHash){
    //           this.reference_id=BOLT.response.txnid;
    //           this.transactionId=BOLT.response.payuMoneyId;
    //           this.paymentDateTime= this.datePipe.transform(BOLT.response.addedon,"yyyy-MM-dd HH:mm:ss");
    //           this.fnAppointmentBooking();
    //         }
    //       }else if(BOLT && BOLT.response.txnStatus == "FAILED"){
    //         this.snackBar.open("Transaction Failed", "X", {
    //           duration: 2000,
    //           verticalPosition: 'top',
    //           panelClass : ['red-snackbar']
    //         });
    //       }else if(BOLT && BOLT.response.txnStatus == "CANCEL"){
    //         this.snackBar.open(BOLT.response.txnMessage, "X", {
    //           duration: 2000,
    //           verticalPosition: 'top',
    //           panelClass : ['red-snackbar']
    //         });
    //       }
    //       // your payment response Code goes here, BOLT is the response object
    //     },
    //     catchException: function(BOLT){
    //       // the code you use to handle the integration errors goes here
    //     }
    //   }
    //   PayUMoneylaunch(RequestData,Handler);
    //   // bolt.launch( RequestData , Handler ); 
    // }

  //   generateRequestHash(RequestData) {
  //     var string = RequestData.key + '|' + RequestData.txnid + '|' + RequestData.amount + '|' + RequestData.productinfo + '|' + RequestData.firstname + '|' + RequestData.email+'|'+this.PayUMoney.udf1+'|'+this.PayUMoney.udf2+'|'+this.PayUMoney.udf3+'|'+this.PayUMoney.udf4+'|'+this.PayUMoney.udf5+'|'+'|'+'|'+'|'+'|'+'|'+this.PayUMoney.salt;
            
  //     var encrypttext = sha512(string);
  //     RequestData.hash = encrypttext;
  //  }
  //  // (d: Date | null): string => {
  //   generateResponseHash(Response) {
  //     var string = this.PayUMoney.salt +'|'+Response.status+'|'+'|'+'|'+'|'+'|'+'|'+Response.udf5+'|'+this.PayUMoney.udf4+'|'+this.PayUMoney.udf3+'|'+this.PayUMoney.udf2+'|'+this.PayUMoney.udf1+'|'+Response.email+'|'+Response.firstname+'|'+Response.productinfo+'|'+Response.amount+'|'+Response.txnid+'|'+Response.key;
            
  //     var encrypttext = sha512(string);
  //     return encrypttext;
  //  }
   
   openTheme2CartPopup() {
     
    const dialogRef = this.dialog.open(theme2CartPopup, {
      width: '700px',
       data: {
         serviceCartArr : this.serviceCartArr,
         settingsArr : this.settingsArr,
         serviceCount: this.serviceCount,
         currentSelectedService:this.currentSelectedService,
         taxArr:this.taxArr,
        }
      
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.cartPopupCloseType= result
        if(this.cartPopupCloseType.closeType === 'proceed'){
          this.theme2CheckoutDialog()
        }else if(this.cartPopupCloseType.closeType === 'add-more'){
          this.fnbacktofirst();
        }
        this.serviceMainArr = this.cartPopupCloseType.serviceMainArr
      }
    });
  }
  selectDataTimePopup(serviceId,type) {
    this.currentSelectedService = serviceId;
    if(this.serviceCartArr[this.currentSelectedService] && this.serviceCartArr[this.currentSelectedService].appointmentDate != ''){
      let year=this.serviceCartArr[this.currentSelectedService].appointmentDate.split("-")[0];
      let month= this.serviceCartArr[this.currentSelectedService].appointmentDate.split("-")[1];
      let day=this.serviceCartArr[this.currentSelectedService].appointmentDate.split("-")[2];
      let dateTemp={"year":parseInt(year),"month":parseInt(month),"day":parseInt(day)};
      this.model=dateTemp;
      this.selecteddate=this.serviceCartArr[this.currentSelectedService].appointmentDate
      this.selecteddateForLabel=this.datePipe.transform(new Date(this.serviceCartArr[this.currentSelectedService].appointmentDate),"EEE, MMM dd");

      this.fnGetTimeSlots();
      this.directAPI = 'gettimeslote';
    }else{
      this.fnSelectNextValidDate(this.minimumAdvanceBookingDateTimeObject);
      this.directAPI = 'selectnextvalidate';
    }
    
    setTimeout(() => {
      const dialogRef = this.dialog.open(theme2DateTimeSelection, {
        width: '800px',
        data: {
                settingsArr : this.settingsArr,
                bookingPostalcode: this.booking.postalcode,
                currentSelectedService:serviceId,
                model:this.model,
                selecteddate:this.selecteddate,
                selecteddateForLabel:this.selecteddateForLabel,
                directAPI: this.directAPI,
                timeSlotArr:this.timeSlotArr
              }
        
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
          this.selecteddate = result.selecteddate;
          this.selecteddateForLabel = result.selecteddateForLabel
          this.selectedTimeSlot = result.selectedTimeSlot
          this.fnSelectStaff(result.selectedStaff, result.staffIndex)
          this.fnShowCounter(this.currentSelectedService);
          if(type == 'book_now'){
            this.theme2CheckoutDialog()
          }
        }
        this.sizeServiceCartArr = 0
        this.serviceCartArr.forEach(element => {
          this.sizeServiceCartArr = this.sizeServiceCartArr+1
        });
      });
    }, 500 );
  }
  theme2CheckoutDialog() {
    const dialogRef = this.dialog.open(theme2CheckoutDialog, {
      width: '800px',
       data: {
              settingsArr : this.settingsArr,
              serviceMainArr:this.serviceMainArr,
              serviceCartArr: this.serviceCartArr,
              businessId:this.businessId,
              taxArr:this.taxArr,
              serviceCount: this.serviceCount,
              bookingPostalcode: this.booking.postalcode,
              is_at_home_service: this.is_at_home_service,
            }
      
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'forgot-pwd'){
        this.router.navigate(['/forgot-password']);
      }
    });
  }

  fnForgotPWD(){
    this.router.navigate(['/forgot-password']);
  }

  // payment functions

  getPaymentGateways(){
    this.isLoader = true;
    let requestObject = {
      "business_id" : this.businessId
    };
      this.frontService.paymentGatewaysList(requestObject).subscribe((response:any) => {
      if(response['status']=='success'){
        this.gatewayList = response.data;
        console.log(this.gatewayList)
      }else if(response['status']=='error'){
        this.errorService.errorMessage(response['message']);
      }
    });
  }

  
  GetPaymentGatewayDetails(type,payment_code,target:HTMLElement){    
    this.isLoader = true;
    this.selectedGateway = type;
    let requestObj = {
      'business_id': this.businessId,
      'payment_code': payment_code
    }
    this.frontService.GetPaymentGatewayDetails(requestObj).subscribe(response => {
      if(response['status']==='success'){
        this.CGateways = response['data'];
        this.CGateways['field'].forEach(field => {
          this.raw_pgw_details[field['fieldname']] = field['value'];
        });
        this.isLoader = false;
        target.scrollIntoView();
        // this.PreProcessData();
      }else{
        this.CGateways = [];
        this.ResetSelectedGateway();
        this.isLoader = false;
      }
    },err=>{
      // this._snackBar.open(environment.ErrorMsg,'X',{duration:2000,panelClass:'error-response'});
          this.errorService.errorMessage(environment.ErrorMsg)
    });
  }

  ResetSelectedGateway(){
    // this.payment_method = "";
  }
  fnChangePaymentMethod(method){
    // this.payment_method = method;
    // this.selectedGateway = method;
    // this.cartRequestObject['payment_method'] = this.payment_method;
    // this.cartRequestObject['payment_status'] = 'paid';
    
  }
  PreProcessData(card:NgForm){ 
    localStorage.setItem('cartRequestObject',JSON.stringify(this.cartRequestObject))
    console.log(card)
    // return false.valueOf;
    if(card.invalid){return;}
    let keys = {}
    var raw_input = {
      paymentOption: this.selectedGateway,
      mode : this.CGateways['testMode'],
      // mode : 1,
      name : 'my Name',
      email : 'test@test.com',
      phone :  '8934589344',
      address : 'full address',
      city : "Mumbai",
      state : "California", // Required for 2Checkout 
      country : "IN",
      zip : "90210",
      amount : this.serviceMainArr.netCost,
      currency : this.currencySymbol? this.currencySymbol:"INR",
      description : "Test "+this.selectedGateway,
      callbackUrl : "https://eventsmatic.com/gateway-response.php",
    }
    
    raw_input = Object.assign(raw_input, this.raw_pgw_details,card.value);
    raw_input['testMode'] = raw_input['mode'];
    console.log(raw_input);
    
    localStorage.setItem('raw_user_data', JSON.stringify(raw_input));
    switch (this.selectedGateway) {
      case 'razorpay':
        this.loadScript({'id':this.selectedGateway,'src':'https://checkout.razorpay.com/v1/checkout.js'});
        this.frontService.PreProcessPaymentGatewayData(raw_input).subscribe(response => {
          console.log(response);
          if(response['status'] == "success"){
            let pre_process_data = response;
            let userDetails = pre_process_data['data'];
            let userConfig = pre_process_data['config'];
            let currency = pre_process_data['data']['currency'];
            let themeColor = pre_process_data['config'].themeColor;
            let razorpayKeyId = ''; 
            if (pre_process_data['config'].testMode) {
                razorpayKeyId = pre_process_data['config'].razorpayTestingkeyId;
            } else {
                razorpayKeyId = pre_process_data['config'].razorpayLivekeyId;
            }
            console.log(parseInt(userDetails['amounts'][currency]))
            this.razorpayamt = parseInt(userDetails['amounts'][currency]);
            this.razorpayamt = this.razorpayamt.toFixed(2) * 100;
            var razorpayPaymentId = null;
            this.finalProcessData = {
              "key": razorpayKeyId, // add razorpay Api Key Id
              "amount": this.razorpayamt, // 2000 paise = INR 20
              "currency": currency, // add currency
              "name": pre_process_data['config'].merchantname, // add merchant user name
              "handler":  function(response) {
                var razorpayData = {
                  'razorpayPaymentId': response.razorpay_payment_id,
                  'razorpayAmount': window.btoa(Window['PreviewEventsComponent'].razorpayamt),
                  ...userDetails,
                  ...userConfig
                };
                
                delete razorpayData['amounts'];
                Window['PreviewEventsComponent'].paymentApi.FinalProcessPaymentGatewayData(razorpayData,raw_input.amount,raw_input.currency).subscribe(response => {
                  if(response['status'] == "captured"){
                    razorpayData = Object.assign(razorpayData,response);
                    Window['PreviewEventsComponent'].redirecToSuccess(razorpayData,raw_input.callbackUrl);
                  }else{alert("Something went wrong!")}
                })
              },
              "prefill": {
                  "name": userDetails['payer_name'], // add user name
                  "email": userDetails['payer_email'], // add user email
              },
              "theme": {
                  "color": themeColor, // add widget theme color
              },
              "modal": {
                  "ondismiss": function(e) {
                      if (razorpayPaymentId == null) {
                        alert('closed');
                      }
                  }
              }
            };
            console.log(this.finalProcessData);
            this.ngZone.runOutsideAngular(()=>{
              var rzp1 = new window['Razorpay'](this.finalProcessData);
              rzp1.open();
            });
          }else{
              alert("Failed to preprocess razorpay data...");
          }
        },err=>{
          this.errorService.errorMessage(environment.ErrorMsg)
          // this._snackBar.open(environment.ErrorMsg,'X',{duration:2000,panelClass:'error-response'});
          // this._snackBar.add({msg:environment.ErrorMsg,timeout:2000,background:'red',color:'white'});
        })
        break;
      case 'payumoney':
        this.frontService.PreProcessPaymentGatewayData(raw_input).subscribe(response => {
          if(response['status'] == "success"){
            let payumoney_process_data = {
              ...response['data'],
              ...response['config']
            }
            let rawStorageData = Object.assign(response['config'],JSON.parse(localStorage.getItem('raw_user_data')))
            localStorage.setItem('raw_user_data',JSON.stringify(rawStorageData));
            delete payumoney_process_data['amounts'];
            console.log(payumoney_process_data);
            if(payumoney_process_data.testMode){
              this.loadScript({'id':'bolt','src':'https://sboxcheckout-static.citruspay.com/bolt/run/bolt.min.js','bolt-color':payumoney_process_data.checkoutColor,'bolt-logo':payumoney_process_data.checkoutLogo});
            }else{
              this.loadScript({'id':'bolt','src':'https://checkout-static.citruspay.com/bolt/run/bolt.min.js','bolt-color':payumoney_process_data.checkoutColor,'bolt-logo':payumoney_process_data.checkoutLogo});
            }
            // Window['PreviewEventsComponent'].ProcessPaymentToGateway(this.selectedGateway,payumoney_process_data,raw_input.amount,raw_input.currency)(response => {
            Window['PreviewEventsComponent'].paymentApi.FinalProcessPaymentGatewayData(payumoney_process_data,raw_input.amount,raw_input.currency).subscribe(response => {
              //payumoney response
              if (response.paymentOption == "payumoney"){
                setTimeout(() => {
                  window['bolt'].launch(response, {
                      responseHandler: function(BOLT) {
                        console.log(BOLT)
                        //   // Window['PreviewEventsComponent'].paymentApi.ResponsePaymentGateway(response,Window['PreviewEventsComponent'].selectedGateway,payumoney_process_data['order_id']).subscribe(response => {
                        //   //   Window['PreviewEventsComponent'].finalGatewayResult = response;
                        //   // })
                        // })
                      },
                      catchException: function(BOLT) {
                        console.log(BOLT);                      
                      }
                  });
                }, 100);
              }
            })
          }
        },err=>{
          this.errorService.errorMessage(environment.ErrorMsg)
          // this._snackBar.open(environment.ErrorMsg,'X',{duration:2000,panelClass:'error-response'});
          // this._snackBar.add({msg:environment.ErrorMsg,timeout:2000,background:'red',color:'white'});
        })
        break;
      case 'paytm':
        this.frontService.FinalProcessPaymentGatewayData(raw_input,raw_input.amount,raw_input.currency).subscribe(response => {
          console.log(response);
          if(response['status'] == "success")
          {
            let paytm_form: any = document.createElement('form');
            paytm_form.name = 'paytm_form';
            paytm_form.method = 'post';
            paytm_form.action = 'https://securegw-stage.paytm.in/order/process';

            Object.entries(response['data']).forEach(([key, value]) => {
              let my_tb: any = document.createElement('input');
              my_tb.type = 'hidden';
              my_tb.name = key;
              my_tb.value = value;
              paytm_form.appendChild(my_tb);
            });
            document.body.appendChild(paytm_form);
            paytm_form.submit();
          }else{
            alert(response['message']);
          }
        })
      break;
      case 'instamojo':
        this.frontService.FinalProcessPaymentGatewayData(raw_input,raw_input.amount,raw_input.currency).subscribe(response => {
          console.log(response);
            if (response['status'] == 'success') {
                window.location.href = response['longurl'];
            }
        },err=>{
          this.errorService.errorMessage(environment.ErrorMsg)
          // this._snackBar.open(environment.ErrorMsg,'X',{duration:2000,panelClass:'error-response'});
          // this._snackBar.add({msg:environment.ErrorMsg,timeout:2000,background:'red',color:'white'});
        })
      break;
      case 'stripe':
        this.loadScript({'id':'stripe','src':'https://js.stripe.com/v3'});
        this.frontService.PreProcessPaymentGatewayData(raw_input).subscribe(response => {
          setTimeout(() => {
            let stripe = window['Stripe'](raw_input['PublishKey']);
            stripe.redirectToCheckout({
              sessionId: response['id'],
            }).then(function(result) {
              alert(result)
              console.log(result);
            });
          }, 100);
        },err=>{
          this.errorService.errorMessage(environment.ErrorMsg)
          // this._snackBar.open(environment.ErrorMsg,'X',{duration:2000,panelClass:'error-response'});
          // this._snackBar.add({msg:environment.ErrorMsg,timeout:2000,background:'red',color:'white'});
        })
      break;
      case 'authorize-net':
        this.frontService.FinalProcessPaymentGatewayData(raw_input,raw_input.amount,raw_input.currency).subscribe(response => {
          if (response['status'] == "success") {
            //alert(response);
            let authorize_form: any = document.createElement('form');
            authorize_form.name = 'authorize_form';
            authorize_form.method = 'post';
            authorize_form.action = raw_input.callbackUrl;

            Object.entries(response).forEach(([key, value]) => {
              let my_tb: any = document.createElement('input');
              my_tb.type = 'hidden';
              my_tb.name = key;
              my_tb.value = value;
              authorize_form.appendChild(my_tb);
            });
            document.body.appendChild(authorize_form);
            authorize_form.submit();
          } else if (response['status'] == "error") {
            alert("error:- " + response['message'])
            this.ResetSelectedGateway();
          } else {
            alert("error:- " + response['validationMessage'])
            this.ResetSelectedGateway();
          }
        },err=>{
          this.errorService.errorMessage(environment.ErrorMsg)
          // this._snackBar.open(environment.ErrorMsg,'X',{duration:2000,panelClass:'error-response'});
          // this._snackBar.add({msg:environment.ErrorMsg,timeout:2000,background:'red',color:'white'});
        })
      break;
      case 'checkout_com':
        this.frontService.FinalProcessPaymentGatewayData(raw_input,raw_input.amount,raw_input.currency).subscribe(response => {
          if (response['status'] == "success") {
            //alert(response);
            let checkout_form: any = document.createElement('form');
            checkout_form.name = 'checkout_form';
            checkout_form.method = 'post';
            checkout_form.action = raw_input.callbackUrl;

            Object.entries(response).forEach(([key, value]) => {
              let my_tb: any = document.createElement('input');
              my_tb.type = 'hidden';
              my_tb.name = key;
              my_tb.value = value;
              checkout_form.appendChild(my_tb);
            });
            document.body.appendChild(checkout_form);
            checkout_form.submit();
          } else if (response['status'] == "error") {
            alert("error:- " + response['message'])
            this.ResetSelectedGateway();
          } else {
            alert("error:- " + response['validationMessage'])
            this.ResetSelectedGateway();
          }
        },
        error => {
          alert(error);
          this.ResetSelectedGateway();
        });
      break;
      case 'mollie':
        this.loadScript({'id':'mollie','src':'https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js'});
        // raw_input.amount = parseInt(raw_input.amount).toFixed(2);
        raw_input.currency = "EUR";
        keys = {'testMode':raw_input['testMode']?true:false,
        'testApiKey':raw_input['testMode']?raw_input['ApiKey']:'',
        'liveApiKey':raw_input['testMode']?'':raw_input['ApiKey']}
        keys = Object.assign(keys,JSON.parse(localStorage.getItem('raw_user_data')))
        localStorage.setItem('raw_user_data',JSON.stringify(keys));
        this.frontService.FinalProcessPaymentGatewayData(raw_input,raw_input.amount,raw_input.currency).subscribe(
          response => {
            if (response['errorMessage']) {
              this.ResetSelectedGateway();
              alert(response['errorMessage']);
            }else if (response['message'] == 'success') {
              window.location.href = response['checkoutUrl'];
            }
          },
          error => {
            alert(error);
            this.ResetSelectedGateway();
          }
        );
      break;      
      case 'cybersource':
      raw_input.currency = "USD";
      this.frontService.FinalProcessPaymentGatewayData(raw_input,raw_input.amount,raw_input.currency).subscribe(response => {
        if (response['decision'] == "ACCEPT" || response['decision'] == "REJECT") {
          let cybersource_form: any = document.createElement('form');
          cybersource_form.name = 'cybersource_form';
          cybersource_form.method = 'post';
          cybersource_form.action = raw_input.callbackUrl;

          Object.entries(response).forEach(([key, value]) => {
            let my_tb: any = document.createElement('input');
            my_tb.type = 'hidden';
            my_tb.name = key;
            my_tb.value = value;
            cybersource_form.appendChild(my_tb);
          });
          document.body.appendChild(cybersource_form);
          cybersource_form.submit();
        } else {
          alert("error:- " + response['validationMessage'])
          this.ResetSelectedGateway();
        }
      },
      error => {
        alert(error);
        this.ResetSelectedGateway();
      });
    break;
    case 'ravepay':
      this.loadScript({'id':'mollie','src':'https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js'});
      // raw_input.amount = parseInt(raw_input.amount).toFixed(2);
      setTimeout(() => {},200);
      raw_input.currency = "NGN";
      setTimeout(() => {
        var x = window['getpaidSetup']({
          PBFPubKey: raw_input['PublishKey'],
        // customer_email: raw_input.email,
        amount: raw_input.amount,
        currency: raw_input.currency,
        txref:  this.OrderId,
        onclose: function() {
          alert('Closed');
        },
        callback: function(response) {
          console.log(response);
          let additionalData = {
            PBFPubKey: raw_input['PublishKey'],
            // payer_email: raw_input.email,
            amount: raw_input.amount,
            currency: raw_input.currency,
            txref:  Window['PreviewEventsComponent'].OrderId
          }
          raw_input = Object.assign(raw_input,additionalData);
          Window['PreviewEventsComponent'].paymentApi.PreProcessPaymentGatewayData(raw_input).subscribe(
            response => {
              console.log(response);
              if (response['body'].status == 'success') {
                let ravepay_form: any = document.createElement('form');
                ravepay_form.name = 'ravepay_form';
                ravepay_form.method = 'post';
                ravepay_form.action = raw_input.callbackUrl;
                Object.entries(response).forEach(([key, value]) => {
                  let my_tb: any = document.createElement('input');
                  my_tb.type = 'hidden';
                  my_tb.name = key;
                  my_tb.value = value;
                  ravepay_form.appendChild(my_tb);
                });
                document.body.appendChild(ravepay_form);
                ravepay_form.submit();
              }else{
                alert(response);
                Window['PreviewEventsComponent'].ResetSelectedGateway();
              }
            },
            error => {
              alert(error);
              Window['PreviewEventsComponent'].ResetSelectedGateway();
            }
            );
            x.close();           
          }
        });
      }, 300)
      
      break;
      case 'aamarpay':
        raw_input.currency = "BDT";
        raw_input['address2'] = "Dhaka",
        this.frontService.FinalProcessPaymentGatewayData(raw_input,raw_input.amount,raw_input.currency).subscribe(response => {
          if (response['result'] == "true") {
            let aamarpay_form: any = document.createElement('form');
            aamarpay_form.name = 'aamarpay_form';
            aamarpay_form.method = 'post';
            aamarpay_form.action = response['payment_url'];           
            let my_tb: any = document.createElement('input');
            my_tb.type = 'hidden';
            my_tb.name = 'paymentOption';
            my_tb.value = 'aamarpay';
            aamarpay_form.appendChild(my_tb);
            document.body.appendChild(aamarpay_form);
            aamarpay_form.submit();
          } else {
            alert(response['message'])
            this.ResetSelectedGateway();
          }
        },
        error => {
          alert(error);
          this.ResetSelectedGateway();
        });
      break;
      case '2checkout':
        this.loadScript({'id':'2checkout','src':'https://2pay-js.2checkout.com/v1/2pay.js'});
        var _2checkout_merchant_code = raw_input['merchantCode'];
        raw_input['first_name']= "John";
        raw_input['last_name']="Doe";
        raw_input.currency = "USD";

        
        setTimeout(() => {
          let jsPaymentClient = new window['TwoPayClient'](_2checkout_merchant_code);
          let component = jsPaymentClient.components.create('card');
          component.mount('#card-element');
          document.getElementById('payment-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const billingDetails = {
              name: raw_input['first_name']+" "+raw_input['last_name']
            };
            jsPaymentClient.tokens.generate(component, billingDetails).then((response) => {
                  two_checkout_process(response.token, raw_input);
              }).catch((error) => {
              console.error(error);
              Window['PreviewEventsComponent'].ResetSelectedGateway();
            });
          });
        },200);
        // window.addEventListener('load', function() {
        // });

        function two_checkout_process(token, raw_input){
          raw_input['token'] = token;
          Window['PreviewEventsComponent'].paymentApi.FinalProcessPaymentGatewayData(raw_input,raw_input.amount,raw_input.currency).subscribe(
            response => {
              if (response.Status == "AUTHRECEIVED" || response.Status == "PENDING") {
                  let checkout2_form: any = document.createElement('form');
                  checkout2_form.name = 'checkout2_form';
                  checkout2_form.method = 'post';
                  checkout2_form.action = raw_input.callbackUrl;
                  Object.entries(response).forEach(([key, value]) => {
                    let my_tb: any = document.createElement('input');
                    my_tb.type = 'hidden';
                    my_tb.name = key;
                    my_tb.value = value;
                    checkout2_form.appendChild(my_tb);
                  });
                  document.body.appendChild(checkout2_form);
                  checkout2_form.submit();
              } else {
                  if(response.message != "")
                  {
                      alert(response.error_code + " " + response.message);
                      Window['PreviewEventsComponent'].ResetSelectedGateway();
                  }
                  else
                  {
                      alert("Something went wrong..");
                      Window['PreviewEventsComponent'].ResetSelectedGateway();
                  }
              }
          },        
          error => {
              alert(error);
              Window['PreviewEventsComponent'].ResetSelectedGateway();
          })
        }
      break;
      case 'paytabs':
        raw_input['first_name']= "John";
        raw_input['last_name']="Doe";
        raw_input['country_code']="973";
        raw_input.currency = "USD";
        raw_input.country = "BHR";
        raw_input.zip = "973";
        keys = {'testMode':raw_input['testMode']?true:false,
        'testSecretKey':raw_input['testMode']?raw_input['secretKey']:'',
        'liveSecretKey':raw_input['testMode']?'':raw_input['secretKey'],
        'testMerchantEmail':raw_input['testMode']?raw_input['merchantEmail']:'',
        'liveMerchantEmail':raw_input['testMode']?'':raw_input['merchantEmail'],}
        keys = Object.assign(keys,JSON.parse(localStorage.getItem('raw_user_data')))
        localStorage.setItem('raw_user_data',JSON.stringify(keys));
        this.frontService.FinalProcessPaymentGatewayData(raw_input,raw_input.amount,raw_input.currency).subscribe(
          response => {
            if (response['payment_url'] != ''){
                window.location.href = response['payment_url'];
            }
            else{
                alert(response['response_code'] +" - "+response['result']);
            }
          },
          error => {
            Window['PreviewEventsComponent'].ResetSelectedGateway();
            alert(error);            
          }
        )
      break
      case 'sslcommerz':
        this.frontService.FinalProcessPaymentGatewayData(raw_input,raw_input.amount,raw_input.currency).subscribe(
          response => {
            if (response['status'] == 'success') {
                window.location.href = response['data'].redirectGatewayURL;
            }
            else{
                alert(response['response_code'] +" - "+response['result']);
            }
          },
          error => {
            alert(error);   
            this.ResetSelectedGateway();         
          }
        )
      break
      case 'worldpay':
        raw_input['first_name']= "John";
        raw_input['last_name']="Doe";
        raw_input.zip = "19011";
        raw_input.currency = "USD";
        this.frontService.FinalProcessPaymentGatewayData(raw_input,raw_input.amount,raw_input.currency).subscribe(response => {
          if (response['paymentStatus'] == "SUCCESS") {
            let worldpay_form: any = document.createElement('form');
            worldpay_form.name = 'worldpay_form';
            worldpay_form.method = 'post';
            worldpay_form.action = raw_input.callbackUrl;           
            Object.entries(response).forEach(([key, value]) => {
              let my_tb: any = document.createElement('input');
              my_tb.type = 'hidden';
              my_tb.name = key;
              my_tb.value = value;
              worldpay_form.appendChild(my_tb);
            });
            document.body.appendChild(worldpay_form);
            worldpay_form.submit();
          } else {
            alert(response['message'])
          }
        },
        error => {
          alert(error);
          this.ResetSelectedGateway();
        });
      break;
      case 'braintree':
        this.loadScript({'id':'braintree_client','src':'https://js.braintreegateway.com/web/3.69.0/js/client.min.js'});
        this.loadScript({'id':'braintree_hosted_field','src':'https://js.braintreegateway.com/web/3.69.0/js/hosted-fields.min.js'});
        setTimeout(() => {
        var braintree_inputs = {
          paymentOption : "braintree",
          amount : "1.65",
          currency : "USD",
          first_name: "Pradeep",
          last_name: "Sawant",
          address: "751 Green Hill",
          zip: "1902",
          email: "pradeep.sawant2501@gmail.com", //optional
          phone: "917977597049", //optional
          mode : "1",
          callbackUrl : "https://gateway.webjio.com/frontend/response.php",
          merchantId : "wwr376fjksjxtnb2",
          publicKey : "9wsb49t4dmzfwbs6",
          privateKey : "aad5bb91a3c05000f379b537c068cd0a",
          tokenizationKey : "sandbox_q7c52v9z_wwr376fjksjxtnb2"
        };
      
          var form = document.querySelector('#braintree_form');
      
        window['braintree'].client.create({
          //authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b'
          authorization: braintree_inputs.tokenizationKey
        }, function(err, clientInstance) {
          if (err) {
            console.error(err);
            return;
          }
      
        window['braintree'].hostedFields.create({
            client: clientInstance,
            styles: {
              input: {
                // change input styles to match
                // bootstrap styles
                'font-size': '1rem',
                color: '#495057'
              }
            },
            fields: {
              cardholderName: {
                selector: '#cc-name',
                placeholder: 'Name as it appears on your card'
              },
              number: {
                selector: '#cc-number',
                placeholder: '4111 1111 1111 1111'
              },
              cvv: {
                selector: '#cc-cvv',
                placeholder: '123'
              },
              expirationDate: {
                selector: '#cc-expiration',
                placeholder: 'MM / YY'
              }
            }
          }, function(err, hostedFieldsInstance) {
            if (err) {
              console.error(err);
              return;
            }
            function createInputChangeEventListener(element) {
              return function () {
                // validateInput(element);
              }
            }
      
            function setValidityClasses(element, validity) {
              if (validity) {
                element.removeClass('is-invalid');
                element.addClass('is-valid');  
              } else {
                element.addClass('is-invalid');
                element.removeClass('is-valid');  
              }    
            }
            
            // function validateInput(element) {
            //   // very basic validation, if the
            //   // fields are empty, mark them
            //   // as invalid, if not, mark them
            //   // as valid
      
            //   if (!element.val().trim()) {
            //     setValidityClasses(element, false);
      
            //     return false;
            //   }
      
            //   setValidityClasses(element, true);
      
            //   return true;
            // }
            
            // function validateEmail () {
            //   var baseValidity = validateInput(email);
              
            //   if (!baseValidity) {  
            //     return false;
            //   }
      
            //   if (email.val().indexOf('@') === -1) {
            //     setValidityClasses(email, false);
            //     return false;
            //   }
              
            //   setValidityClasses(email, true);
            //   return true;
            // }
      
            var ccName = document.querySelector('#cc-name');
            var email = document.querySelector('#email');
      
            // ccName.on('change', function () {
            //   validateInput(ccName);
            // });
            // email.on('change', validateEmail);
      
      
            hostedFieldsInstance.on('validityChange', function(event) 
            {
              var field = event.fields[event.emittedBy];
      
              // Remove any previously applied error or warning classes
              document.querySelector(field.container).removeClass('is-valid');
              document.querySelector(field.container).removeClass('is-invalid');
      
              if (field.isValid) {
                document.querySelector(field.container).addClass('is-valid');
              } else if (field.isPotentiallyValid) {
                // skip adding classes if the field is
                // not valid, but is potentially valid
              } else {
                document.querySelector(field.container).addClass('is-invalid');
              }
            });
      
            hostedFieldsInstance.on('cardTypeChange', function(event) {
              var cardBrand = document.querySelector('#card-brand');
              var cvvLabel = document.querySelector('[for="cc-cvv"]');
      
              if (event.cards.length === 1) {
                var card = event.cards[0];
      
                // change pay button to specify the type of card
                // being used
                cardBrand.innerHTML = card.niceType;
                // update the security code label
                cvvLabel.innerHTML = card.code.name;
              } else {
                // reset to defaults
                cardBrand.innerHTML = 'Card';
                cvvLabel.innerHTML = 'CVV';
              }
            });
      
            form['submit'](function(event) {
              event.preventDefault();
      
              var formIsInvalid = false;
              var state = hostedFieldsInstance.getState();
      
              // perform validations on the non-Hosted Fields
              // inputs
              // if (!validateEmail()) {
              //   formIsInvalid = true;
              // }
      
              // Loop through the Hosted Fields and check
              // for validity, apply the is-invalid class
              // to the field container if invalid
              Object.keys(state.fields).forEach(function(field) {
                if (!state.fields[field].isValid) {
                  document.querySelector(state.fields[field].container).addClass('is-invalid');
                  formIsInvalid = true;
                }
              });
      
              if (formIsInvalid) {
                // skip tokenization request if any fields are invalid
                return;
              }
      
              hostedFieldsInstance.tokenize(function(err, payload) {
                if (err) {
                  console.error(err);
                  return;
                }
      
                console.log(payload.nonce);
                braintree_process(payload.nonce, braintree_inputs)
                return;
              });
            });
          });
        });
        
        function braintree_process(token, braintree_inputs)
        {
                //document.getElementById("token").value=token;
                //document.getElementById("tokenForm").submit();
      
                /**** APPEND PAYMENT METHOD TOKEN TO PROCESS INPUT ****/
                braintree_inputs['paymentMethodNonce'] = token;
      
                var braintree_CallbackUrl = braintree_inputs.callbackUrl;
                console.log(braintree_inputs);
                
                //console.log(braintree_inputs);
      
                // $ajax({
                //     type: 'post', //form method
                //     context: this,
                //     url: 'https://gateway.webjio.com/webapp/process', // post data url
                //     dataType: "JSON",
                //     data: braintree_inputs, // form serialize data
                //     error: function(err) {
                //         var error = err.responseText;
      
                //         //on error show alert message
                //         alert("AJAX error in request: " + JSON.stringify(error, null, 2));
                //         //hide loader after ajax request complete
                //         $(".lw-show-till-loading").hide();
                //     },
                //     success: function(response) {
                //         if(typeof response == "string")
                //         response = JSON.parse(response);
      
                //         console.log(response);
      
                //         if (response.success) {
                //             //console.log(response);
                //             let form = "<form action='" + braintree_CallbackUrl + "' method='post'><input type='hidden' name='paymentOption' value='braintree'>"
                //                   Object.entries(response).forEach(([key, value]) => {
                //                       if(typeof(value) == 'object'){
                //                           form = form + "<input type='hidden' name='"+key+"' value='"+JSON.stringify(value)+"'>";
                //                       }else{
                //                           form = form + "<input type='hidden' name='"+key+"' value='"+value+"'>";
                //                       }
                //                   });
                //                   form = form + "</form>"
                //                   $('body').html(form);
                //                   $('body form').submit();
                //         } else {
                //           //console.log(response);
                //             if(response.message != "")
                //             {
                //                 alert(response.message);
                //             }
                //             else
                //             {
                //                alert("Something went wrong..");
                //             }
                //         }
      
                //     }
                // });
        }
      },500);
      break;
      case 'adyen':
        this.loadScript({'id':'adyen','src':'https://app.kafecloud.com/assets/js/adyen.encrypt.nodom.min.js'});
        setTimeout(() => {},500);
          var key     =   raw_input['encryptionKey'];  
          var options = {};

          var cardNumber = raw_input['number'];
          var email = raw_input['email'];
          var expiryMonth =  raw_input['month'];
          var expiryYear =  raw_input['year'];
          var cvc = raw_input['cvv'];
          var name = raw_input['name'];
          var adyen_CallbackUrl = raw_input['callbackUrl'];
          
          var generationtime = new Date().toISOString(); 
          var cseInstance = Window['adyen'].encrypt.createEncryption(key, options);
          function getEncryptedFormData(cardNumber, cvc, name, expiryMonth, expiryYear, generationtime) {
          
            var postData = {};
            
            var cardData = {
                number : cardNumber,
                cvc : cvc,
                holderName : name,
                expiryMonth : expiryMonth,
                expiryYear : expiryYear,
                generationtime : generationtime
            };
            
            postData['adyen-encrypted-data'] = cseInstance.encrypt(cardData);
            
            return postData;
          }

            var postData = getEncryptedFormData(cardNumber, cvc, name, expiryMonth, expiryYear, generationtime);

            raw_input['encryptedCardData'] = postData['adyen-encrypted-data'];
            this.frontService.FinalProcessPaymentGatewayData(raw_input,raw_input.amount,raw_input.currency).subscribe(
              response => {
                if (response['response'] =='[capture-received]') {
                    //console.log(response);
                    let adyen_form: any = document.createElement('form');
                    adyen_form.name = 'adyen_form';
                    adyen_form.method = 'post';
                    adyen_form.action = raw_input.callbackUrl;           
                    Object.entries(response).forEach(([key, value]) => {
                      let my_tb: any = document.createElement('input');
                      my_tb.type = 'hidden';
                      my_tb.name = key;
                      my_tb.value = value;
                      adyen_form.appendChild(my_tb);
                    });
                    document.body.appendChild(adyen_form);
                    adyen_form.submit();
                } else {
                  //console.log(response);
                    if(response['message'] != "")
                    {
                        alert(response['message']);
                    }
                    else
                    {
                        alert("Something went wrong..");
                    }
                }
              },
              error => {
                alert(error);
              }
            );  
                // response = JSON.parse(response);
                  /*console.log('hello');
                  console.log(response);
                  alert(response);*/
      break;
    }
  }
  
loadScript(attributes){
  if(document.getElementById(attributes.id)){
    document.getElementById(attributes.id).remove();
  }
  let pgsc = document.createElement('script');
  Object.entries(attributes).forEach(([key, value]) => {
    pgsc.setAttribute(key,String(value));
  });
  document.head.appendChild(pgsc);
}

redirecToSuccess(param,callback){
  let paytm_form: any = document.createElement('form');
  paytm_form.name = 'paytm_form';
  paytm_form.method = 'post';
  paytm_form.action = callback;

  Object.entries(param).forEach(([key, value]) => {
    let my_tb: any = document.createElement('input');
    my_tb.type = 'hidden';
    my_tb.name = key;
    if(typeof(value) == 'object'){
      my_tb.value = JSON.stringify(value);
    }else{
      my_tb.value = value;
    }
    paytm_form.appendChild(my_tb);
  });
  document.body.appendChild(paytm_form);
  paytm_form.submit();
}

}

@Component({
  selector: 'theme-2-checkout-popup',
  templateUrl: '../_dialogs/theme-2-checkout-popup.html',
  providers: [DatePipe]
})
export class theme2CheckoutDialog {
  isLoader:boolean= false;
  formExistingUser : FormGroup;
  formOtpExistingUser : FormGroup;
  otpLogin = false;
  normalLogin = false;
  otpShow = true;
  loginShow = false;
  phoneCodes :any=[];
  selectedPhoneCode: any;
  serviceMainArr={
    totalNumberServices:0,
    subtotal:0,
    discount_type:null,
    discount_value:null,
    discount:0,
    netCost:0
  }
  formNewUser: FormGroup;
  settingsArr:any;
  bookingPostalcode:any;
  personalinfo:boolean=true;
  appointmentinfo:boolean = true;
  summaryScreen:boolean = false;
  paymentScreen:boolean= false;
  thankYouScreen:boolean = false;
  existinguser:boolean=true;
  newuser:boolean=false;
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	// TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  
  emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/


  termsConditionsStatusValue:boolean = false;
  termsConditions:any;
  privacyPolicy:any;
  thankYou:any;
  PrivacyPolicyStatusValue:boolean = false;
  PrivacyPolicyStatusValidation:boolean = false;
  termsConditionsStatusValidation:boolean = false;
  contactFormSettingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;
  paymentDateTime:any;
  PayUMoneyCredentials:any;
  paypalSetting:any;
  stripeSetting:any;
  bankTransferSetting:any;
  stripeStatus : boolean = false;
  bankTransferStatus : boolean = false;
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
  payUmoneyStatus : boolean = false;

  paypalClientId:any="sb";
  paypalTestMode:any;
  paypalStatus:boolean=false;
  formAppointmentInfo: FormGroup;
  customerLoginValue:boolean=false;
  private payPalConfig?: IPayPalConfig;
  itemArr:any= [];
  taxAmount=0;
  reference_id:any;
  transactionId:any=null;
  phoneNumberInvalid:any = "valid";
  isLoggedIn:boolean=false;
  customerName:any;
  customerFirstname:any;
  customerLastname:any;
  customerEmail:any;
  customerPhone:any;
  businessId:any;
  showSameAsAboveCheck:boolean=true;
  errorMessage:any;
  is_at_home_service:boolean=true;
  serviceCartArr:any= [];
  taxArr:any=[];
  userSelectionMain:boolean=true;
  coupon = {
    couponcode_val: ""
  };
  couponIcon:any="check";
  isReadOnly:any="";
  
  taxAmountArr:any=[];
  closecoupon:any = 'default';
  showCouponError:boolean=false;
  couponErrorMessage:any;
  serviceCount:any= [];
  taxType:any='P';
  taxValue:any;
  creditcardform = false;
  showPaypalButtons = false;
  showPayUMoneyButton = false;
  BankDetail:boolean=false;
  paymentMethod:any="";
  loadAPI: Promise<any>;
  isFound:boolean=false;
  cardForm:FormGroup;
  constructor(
    public dialogRef: MatDialogRef<theme2CheckoutDialog>,
    private _formBuilder:FormBuilder,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    public router: Router,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private authenticationService:AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.settingsArr= this.data.settingsArr;
      this.serviceMainArr = this.data.serviceMainArr;
      this.businessId = this.data.businessId;
      this.serviceCartArr = this.data.serviceCartArr;
      this.serviceCount= this.data.serviceCount,
      this.taxArr=this.data.taxArr,
      this.bookingPostalcode=this.data.bookingPostalcode;
      this.formOtpExistingUser = this._formBuilder.group({
        existing_phone: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        existing_otp: ['',[Validators.required, Validators.pattern("^[1-9][0-9]{3}")]],
      });

      this.formExistingUser = this._formBuilder.group({
        existing_mail: ['',[Validators.required,Validators.email]],
        existing_password: ['',Validators.required]
      });
      this.fngetPhoneCode();
      this.normalLogin = true;
      this.formNewUser = this._formBuilder.group({
        newUserEmail: ['',[Validators.required,Validators.email,Validators.pattern(this.emailPattern)],
        this.isEmailUnique.bind(this)],
        newUserPassword: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
        newUserFullname: ['',Validators.required],
        newUserPhone: [''],
        newUserSplReq: ['']
      })
      this.formAppointmentInfo = this._formBuilder.group({
      })
      this.cardForm = this._formBuilder.group({
        cardHolderName: ['',[Validators.required]],
        cardNumber: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
        expiryMonth: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
        expiryYear: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
        cvvCode: ['',[Validators.required]],
      })
      if(this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.user_type == "C"){
        this.isLoggedIn=true;
        this.customerName=this.authenticationService.currentUserValue.fullname;
        this.customerFirstname=this.customerName.split(" ")[0];
        this.customerLastname=this.customerName.split(" ")[1];
        this.customerEmail=this.authenticationService.currentUserValue.email;
        this.customerPhone=this.authenticationService.currentUserValue.phone;
      }

      if(this.isLoggedIn){
        this.personalinfo = false;
        this.appointmentinfo = true;
        this.showSameAsAboveCheck=false;
      }else{
        this.personalinfo = true;
        this.userSelectionMain = true;
        this.appointmentinfo = true;
        this.showSameAsAboveCheck=true;
      }
      this.is_at_home_service = this.data.is_at_home_service
      if(!this.is_at_home_service && this.isLoggedIn){
        this.personalinfo = false;
        this.appointmentinfo = false;
        this.summaryScreen = true;
      }else if(!this.is_at_home_service && !this.isLoggedIn){
        this.personalinfo = true;
      }

      var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      var amountAfterTax=0;
      if(this.serviceMainArr.subtotal > 0){
        this.taxArr.forEach((element) => {
          let taxTemp={
            value:0,
            name:'',
            amount:0
          }
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
        });
      }
          this.currencySymbol = this.settingsArr.currency;
          this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
          this.currencySymbolFormat = this.settingsArr.currency_format;
          if(this.settingsArr.payUmoney_settings){
            this.PayUMoneyCredentials = JSON.parse(this.settingsArr.payUmoney_settings);
            this.PayUMoney.key= this.PayUMoneyCredentials.merchant_key;
            this.PayUMoney.salt=this.PayUMoneyCredentials.salt_key;
            this.payUmoneyStatus=this.PayUMoneyCredentials.status;
          }
          
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
          
        if(this.settingsArr.stripe_settings){
          this.stripeSetting = JSON.parse(this.settingsArr.stripe_settings)
          this.stripeStatus = this.stripeSetting.status
        }
        if(this.settingsArr.bank_transfer){
          this.bankTransferSetting = JSON.parse(this.settingsArr.bank_transfer)
          this.bankTransferStatus = this.bankTransferSetting.status
        }
        this.termsConditions = JSON.parse(this.settingsArr.terms_condition);
        if(this.termsConditions.status == 'false' || this.termsConditions.status == false){
          this.termsConditionsStatusValue = true;
        }
        this.privacyPolicy=JSON.parse(this.settingsArr.privacy_policy)
        if(this.privacyPolicy && this.privacyPolicy.status == 'false' || this.privacyPolicy && this.privacyPolicy.status == false){
          this.PrivacyPolicyStatusValue = true;
        }
        this.thankYou=JSON.parse(this.settingsArr.thank_you);
        this.contactFormSettingsArr=JSON.parse(this.settingsArr.form_settings)
        if(this.contactFormSettingsArr && this.contactFormSettingsArr.contact_field_status == true){
          if(this.contactFormSettingsArr.addressField.status == 1){
            if(this.contactFormSettingsArr.addressField.required == 1){
              const validators = [Validators.required];
              const validatorsZipCode = [Validators.required,Validators.minLength(5),Validators.maxLength(7)];
              this.formNewUser.addControl('newUserAddress', new FormControl('', validators));
              this.formNewUser.addControl('newUserState', new FormControl('', validators));
              this.formNewUser.addControl('newUserCity', new FormControl('', validators));
              this.formNewUser.addControl('newUserZipcode', new FormControl('', validatorsZipCode));

              this.formAppointmentInfo.addControl('appo_address', new FormControl('', validators));
              this.formAppointmentInfo.addControl('appo_state', new FormControl('', validators));
              this.formAppointmentInfo.addControl('appo_city', new FormControl('', validators));
              this.formAppointmentInfo.addControl('appo_zipcode', new FormControl('', validatorsZipCode));

            }else{
              this.formNewUser.addControl('newUserAddress', new FormControl(null));
              this.formNewUser.addControl('newUserState', new FormControl(null));
              this.formNewUser.addControl('newUserCity', new FormControl(null));
              this.formNewUser.addControl('newUserZipcode', new FormControl(null));

              this.formAppointmentInfo.addControl('appo_address', new FormControl(null));
              this.formAppointmentInfo.addControl('appo_state', new FormControl(null));
              this.formAppointmentInfo.addControl('appo_city', new FormControl(null));
              this.formAppointmentInfo.addControl('appo_zipcode', new FormControl(null));
            }
          }else{
            this.formAppointmentInfo.addControl('appo_address', new FormControl(null));
            this.formAppointmentInfo.addControl('appo_state', new FormControl(null));
            this.formAppointmentInfo.addControl('appo_city', new FormControl(null));
            this.formAppointmentInfo.addControl('appo_zipcode', new FormControl(null));
          }
        }else{
          const validators = [Validators.required];
          const validatorsZipCode = [Validators.required,Validators.minLength(5),Validators.maxLength(7)];
          this.formNewUser.addControl('newUserAddress', new FormControl('', validators));
          this.formNewUser.addControl('newUserState', new FormControl('', validators));
          this.formNewUser.addControl('newUserCity', new FormControl('', validators));
          this.formNewUser.addControl('newUserZipcode', new FormControl('', validatorsZipCode));
          this.formAppointmentInfo.addControl('appo_address', new FormControl('', validators));
          this.formAppointmentInfo.addControl('appo_state', new FormControl('', validators));
          this.formAppointmentInfo.addControl('appo_city', new FormControl('', validators));
          this.formAppointmentInfo.addControl('appo_zipcode', new FormControl('', validatorsZipCode));
        }
        this.customerLoginValue=JSON.parse(this.settingsArr.customer_login);
      // this.initConfig();
    }
    private createErrorMessage(error: HttpErrorResponse){
      this.errorMessage = error.error ? error.error : error.statusText;
    }
    // private initConfig(): void {
    //   this.payPalConfig = {
    //   currency: this.currencySymbol,
    //   clientId: this.paypalClientId,
    //   createOrderOnClient: (data) => <ICreateOrderRequest>{
    //     intent: 'CAPTURE',
    //     purchase_units: [
    //       {
    //         reference_id: this.reference_id,
    //         amount: {
    //           currency_code: this.currencySymbol,
    //           value: JSON.stringify(this.serviceMainArr.netCost),
    //           breakdown: {
    //             item_total: {
    //               currency_code: this.currencySymbol,
    //               value: JSON.stringify(this.serviceMainArr.subtotal)
    //             },
    //             tax_total : {
    //               currency_code: this.currencySymbol,
    //               value: JSON.stringify(this.taxAmount)
    //             },
    //             discount : {
    //               currency_code: this.currencySymbol,
    //               value: JSON.stringify(this.serviceMainArr.discount)
    //             }
    //           }
    //         },
    //         items: this.itemArr,
        
    //       }
    //     ]
    //   },
    //   advanced: {
    //     commit: 'true'
    //   },
    //   style: {
    //     label: 'paypal',
    //     layout: 'vertical',
    //     size: "responsive"
    //   },
    //   onApprove: (data, actions) => {
    //   this.isLoader=true
    //     actions.order.get().then(details => {
    //     });
    //   },
    //   onClientAuthorization: (data) => {
    //     if(data.status && data.status== "COMPLETED"){
    //       this.transactionId=data.id;
    //       this.paymentDateTime= this.datePipe.transform(data.create_time,"yyyy-MM-dd HH:mm:ss");
    //       this.fnAppointmentBooking();
    //     }
    //     //this.fnAppointmentBooking();
    //   },
    //   onCancel: (data, actions) => {
    //     this.snackBar.open("Transaction Cancelled", "X", {
    //     duration: 2000,
    //     verticalPosition: 'top',
    //     panelClass : ['red-snackbar']
    //     });
    //   },
    //   onError: err => {
    //     this.snackBar.open("Error: "+err, "X", {
    //     duration: 2000,
    //     verticalPosition: 'top',
    //     panelClass : ['red-snackbar']
    //     });
    //   },
    //   onClick: (data, actions) => {
    //   },
   
    // };
    // }
    private handleError(error: HttpErrorResponse) {
      return throwError('Error! something went wrong.');
      //return error.error ? error.error : error.statusText;
    }
    onNoClick(): void {
      this.dialogRef.close();
      
    }
    ngOnInit() {

      

      
    }

    fnUserType(event,usertype){
      if(usertype == "existing"){
        this.existinguser = true;
        this.newuser = false;
      }else{
        this.newuser = true;
        this.existinguser = false;
      }
      
    }
    fnLogout(){

      this.authenticationService.currentUserSubject.next(null);
      this.authenticationService.logout();
      this.router.navigate(['/customer-login']);
      }
    fnViewDashboard(){
      this.dialogRef.close();
      this.router.navigate(['/user/appointments']);
    }
    
    fnNavigateToLogin(){
      this.dialogRef.close();
      this.router.navigate(['/customer-login']);
    }
    
    fnPhoneMouceLeave(){


      if(this.formNewUser.get('newUserPhone').value==undefined){
        this.phoneNumberInvalid = "required";
        return;
      }
  
      if(this.formNewUser.get('newUserPhone').value === null){
        this.phoneNumberInvalid = "required";
      
      }else if(this.formNewUser.get('newUserPhone').value !== '' || this.formNewUser.get('newUserPhone').value !== null){
        if(this.formNewUser.get('newUserPhone').value.number.length >= 6 && this.formNewUser.get('newUserPhone').value.number.length <= 15){
          this.phoneNumberInvalid = "valid";
        }else{
          this.phoneNumberInvalid = "length";
        }
      }
    }
  
    fnenterPhoneNumber(){
  
      if(this.formNewUser.get('newUserPhone').value==undefined){
        this.phoneNumberInvalid = "valid";
        return;
      }
  
      if( this.formNewUser.get('newUserPhone').value !== '' || this.formNewUser.get('newUserPhone').value !== null ){
        if(this.formNewUser.get('newUserPhone').value.number.length >= 6 && this.formNewUser.get('newUserPhone').value.number.length <= 15){
          this.phoneNumberInvalid = "valid";
        }else{
          this.phoneNumberInvalid = "length";
        }
      }else if(this.formNewUser.get('newUserPhone').value === '' || this.formNewUser.get('newUserPhone').value === null){
        this.phoneNumberInvalid = "required";
      }
    }

    fngetPhoneCode(){
      this.authenticationService.getPhoneCode().subscribe((response:any) => {
          if(response.data == true){
              this.phoneCodes = response.response;
              this.selectedPhoneCode = "91";
          }
        });
    }

    fnloginexisinguser(){
      if(!this.formExistingUser.valid){
        this.formExistingUser.get('existing_mail').markAsTouched();
        this.formExistingUser.get('existing_password').markAsTouched();
        
        return false;
       }
       let requestObject = {
         "email" : this.formExistingUser.get('existing_mail').value,
         "password" : this.formExistingUser.get('existing_password').value,
         "business_id": this.businessId
         };
      this.fnLogin(requestObject);
    }

     
  fnOtploginexisinguser(){
    if(!this.formOtpExistingUser.valid){
     this.formOtpExistingUser.get('existing_phone').markAsTouched();
     this.formOtpExistingUser.get('existing_otp').markAsTouched();
     console.log("error");
     return false;
    }

    var phone = this.formOtpExistingUser.get('existing_phone').value.e164Number;
    // phone = "+"+this.selectedPhoneCode+phone;
    let requestObject = {
      "phone" : phone,
      "otp" : this.formOtpExistingUser.get('existing_otp').value,
      "business_id": this.businessId
      };
   this.fnOtpLogin(requestObject);
  }

  getOtp() {
    if(this.formOtpExistingUser.get('existing_phone').valid) {
      var phone = this.formOtpExistingUser.get('existing_phone').value.e164Number;
      // phone = "+"+this.selectedPhoneCode+phone;
      let requestObject = {
          'phone' : phone,
          'business_id' : this.businessId,
          'country_code' : this.formOtpExistingUser.get('existing_phone').value.dialCode
      }
      this.fnGetOtp(requestObject);
    }
    
}

fnLoginType(event,logintype){
  if(logintype == "otp"){
    this.otpLogin = true;
    this.normalLogin = false;
  }else{
      this.otpLogin = false;
      this.normalLogin = true;
  }
}

fnGetOtp(requestObject){
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  this.http.post<any>(`${environment.apiUrl}/send-otp`, requestObject, {headers:headers})
    .pipe(map(data => { 
        return data;
    }),
    catchError(this.handleError)).subscribe((response:any) => {
      if(response.data == true){
        this.loginShow = true;
        this.otpShow = false;                
      }
    },(err) =>{ 
      this.errorMessage = this.handleError;
   });
}  

  fnOtpLogin(requestObject){
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
 
    this.http.post(`${environment.apiUrl}/otp-login`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)).subscribe((response:any) => {
       if(response.data == true ){
         localStorage.setItem('currentUser', JSON.stringify(response.response));
         localStorage.setItem('isFront', "true");
         this.authenticationService.currentUserSubject.next(response.response);
 
         this.customerName=response.response.fullname;
       
         this.customerFirstname = this.customerName!=undefined?this.customerName.split(" ")[0]:'';
         this.customerLastname  =  this.customerName!=undefined?this.customerName.split(" ")[1]:'';
 
         this.customerEmail=this.authenticationService.currentUserValue.email;
         this.customerPhone=this.authenticationService.currentUserValue.phone;
       
           this.showSameAsAboveCheck=false;
           this.snackBar.open("Login successfull.", "X", {
             duration: 2000,
             verticalPosition: 'top',
             panelClass : ['green-snackbar']
             });
         if(this.is_at_home_service){
           if(this.existinguser){
             this.personalinfo = false;
             this.appointmentinfo = true;
             this.isLoggedIn=true;
           }else if(this.newuser){
             this.personalinfo = false;
             this.appointmentinfo = false;
             this.summaryScreen = true;
             this.isLoggedIn=true;
           }
         }else if(!this.is_at_home_service){
           this.personalinfo = false;
           this.appointmentinfo = false;
           this.summaryScreen = true;
           this.isLoggedIn=true;
         }
       }else{
 
         this.snackBar.open(response.response, "X", {
         duration: 2000,
         verticalPosition: 'top',
         panelClass : ['red-snackbar']
         });
 
         this.showSameAsAboveCheck=true;
       }
     },(err) =>{ 
        this.errorMessage = this.handleError;
     });
   }

   fnLogin(requestObject){
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
 
    this.http.post(`${environment.apiUrl}/customer-login`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)).subscribe((response:any) => {
       if(response.data == true ){
         localStorage.setItem('currentUser', JSON.stringify(response.response));
         localStorage.setItem('isFront', "true");
         this.authenticationService.currentUserSubject.next(response.response);
 
 
         this.customerName=response.response.fullname;
       
         this.customerFirstname = this.customerName!=undefined?this.customerName.split(" ")[0]:'';
         this.customerLastname  =  this.customerName!=undefined?this.customerName.split(" ")[1]:'';
 
         this.customerEmail=this.authenticationService.currentUserValue.email;
         this.customerPhone=this.authenticationService.currentUserValue.phone;
       
           this.showSameAsAboveCheck=false;
           this.snackBar.open("Login successfull.", "X", {
             duration: 2000,
             verticalPosition: 'top',
             panelClass : ['green-snackbar']
             });
         if(this.is_at_home_service){
           if(this.existinguser){
             this.personalinfo = false;
             this.appointmentinfo = true;
             this.isLoggedIn=true;
           }else if(this.newuser){
             this.personalinfo = false;
             this.appointmentinfo = false;
             this.summaryScreen = true;
             this.isLoggedIn=true;
           }
         }else if(!this.is_at_home_service){
           this.personalinfo = false;
           this.appointmentinfo = false;
           this.summaryScreen = true;
           this.isLoggedIn=true;
         }
       }else{
 
         this.snackBar.open(response.response, "X", {
         duration: 2000,
         verticalPosition: 'top',
         panelClass : ['red-snackbar']
         });
 
         this.showSameAsAboveCheck=true;
       }
     },(err) =>{ 
        this.errorMessage = this.handleError;
     });
   }
 
   
   fnNewLogin(requestObject){
     let headers = new HttpHeaders({
       'Content-Type': 'application/json',
     });
  
     this.http.post(`${environment.apiUrl}/new-customer-login`,requestObject,{headers:headers} ).pipe(
       map((res) => {
         return res;
       }),
       catchError(this.handleError)).subscribe((response:any) => {
        if(response.data == true ){
          localStorage.setItem('currentUser', JSON.stringify(response.response));
          localStorage.setItem('isFront', "true");
          this.authenticationService.currentUserSubject.next(response.response);
  
  
          this.customerName=response.response.fullname;
        
          this.customerFirstname = this.customerName!=undefined?this.customerName.split(" ")[0]:'';
          this.customerLastname  =  this.customerName!=undefined?this.customerName.split(" ")[1]:'';
  
          this.customerEmail=this.authenticationService.currentUserValue.email;
          this.customerPhone=this.authenticationService.currentUserValue.phone;
        
          if(this.is_at_home_service){
            if(this.existinguser){
              this.personalinfo = false;
              this.appointmentinfo = true;
              this.isLoggedIn=true;
            }else if(this.newuser){
              this.personalinfo = false;
              this.appointmentinfo = false;
              this.summaryScreen = true;
              this.isLoggedIn=true;
            }
          }else if(!this.is_at_home_service){
            this.personalinfo = false;
            this.appointmentinfo = false;
            this.summaryScreen = true;
            this.isLoggedIn=true;
          }
        }else{
  
          this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
          });
  
          this.showSameAsAboveCheck=true;
        }
      },(err) =>{ 
         this.errorMessage = this.handleError;
      });
    }
  

    fnpersonalinfo(){

      if(this.formNewUser.invalid){

        this.formNewUser.get('newUserEmail').markAsTouched();
        this.formNewUser.get('newUserPassword').markAsTouched();
        this.formNewUser.get('newUserFullname').markAsTouched();
        if(this.contactFormSettingsArr.contact_field_status == true){
          if(this.contactFormSettingsArr.addressField.status == 1){
            this.formNewUser.get('newUserAddress').markAsTouched();
            this.formNewUser.get('newUserState').markAsTouched();
            this.formNewUser.get('newUserCity').markAsTouched();
            this.formNewUser.get('newUserZipcode').markAsTouched();
          }
        }else{
          this.formNewUser.get('newUserAddress').markAsTouched();
          this.formNewUser.get('newUserState').markAsTouched();
          this.formNewUser.get('newUserCity').markAsTouched();
          this.formNewUser.get('newUserZipcode').markAsTouched();
        }

        if(this.formNewUser.get('newUserPhone').value === null){
          this.phoneNumberInvalid = "required";
          return false;
        }

        if(this.formNewUser.get('newUserPhone').value !== null && (this.formNewUser.get('newUserPhone').value.number.length <= 6 || this.formNewUser.get('newUserPhone').value.number.length >= 15)){
          this.phoneNumberInvalid = "valid";
          this.formNewUser.get('newUserPhone').markAsTouched();
          return false;
        }

        return false;
      }

      if(this.formNewUser.get('newUserPhone').value === null){
        this.phoneNumberInvalid = "required";
        return false;
      }

      if(this.formNewUser.get('newUserPhone').value !== null && (this.formNewUser.get('newUserPhone').value.number.length <= 6 || this.formNewUser.get('newUserPhone').value.number.length >= 15)){
        this.phoneNumberInvalid = "valid";
        this.formNewUser.get('newUserPhone').markAsTouched();
        return false;
      }else if(this.formNewUser.valid){
        this.fnSignUp();
      } 
      
     
    }
     
    fnSignUp(){
      let newUserAddress="";
      let newUserState="";
      let newUserCity="";
      let newUserZipcode="";
      if(this.contactFormSettingsArr.contact_field_status == true){
        if(this.contactFormSettingsArr.addressField.status == 1){
          newUserAddress=this.formNewUser.get('newUserAddress').value;
          newUserState=this.formNewUser.get('newUserState').value;
          newUserCity=this.formNewUser.get('newUserCity').value;
          newUserZipcode=this.formNewUser.get('newUserZipcode').value;
        }
      }else{
        newUserAddress=this.formNewUser.get('newUserAddress').value;
        newUserState=this.formNewUser.get('newUserState').value;
        newUserCity=this.formNewUser.get('newUserCity').value;
        newUserZipcode=this.formNewUser.get('newUserZipcode').value;
      }
      let requestObject = {
        "email" : this.formNewUser.get('newUserEmail').value,
        "password" : this.formNewUser.get('newUserPassword').value,
        "fullname":this.formNewUser.get('newUserFullname').value,
        "phone":this.formNewUser.get('newUserPhone').value.internationalNumber.replace(/\s/g, ""),
        //"phone":this.formNewUser.get('newUserPhone').value,
        "address":newUserAddress,
        "zip":newUserZipcode,
        "state":newUserState,
        "city":newUserCity,
        "business_id": this.businessId
        };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      
      this.http.post(`${environment.apiUrl}/customer-signup`,requestObject,{headers:headers} ).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
          this.snackBar.open("Customer Registered", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
          });
          let requestObject2 = {
            "email" : this.formNewUser.get('newUserEmail').value,
            "password" : this.formNewUser.get('newUserPassword').value,
            "business_id": this.businessId
            };
          this.fnNewLogin(requestObject2);
        }else{
          this.personalinfo = true;
        }
      },
      (err) =>{
        this.personalinfo = true;
       
      })
    }
    
  
    fnsameasabove(event){
      if(event.srcElement.checked == true){
        
      if(this.contactFormSettingsArr.contact_field_status == true){
        if(this.contactFormSettingsArr.addressField.status == 1){
          this.formAppointmentInfo.controls['appo_address'].setValue(this.formNewUser.get('newUserAddress').value);
          this.formAppointmentInfo.controls['appo_state'].setValue(this.formNewUser.get('newUserState').value);
          this.formAppointmentInfo.controls['appo_city'].setValue(this.formNewUser.get('newUserCity').value);
          this.formAppointmentInfo.controls['appo_zipcode'].setValue(this.formNewUser.get('newUserZipcode').value);
        }
      }else{
        this.formAppointmentInfo.controls['appo_address'].setValue(this.formNewUser.get('newUserAddress').value);
        this.formAppointmentInfo.controls['appo_state'].setValue(this.formNewUser.get('newUserState').value);
        this.formAppointmentInfo.controls['appo_city'].setValue(this.formNewUser.get('newUserCity').value);
        this.formAppointmentInfo.controls['appo_zipcode'].setValue(this.formNewUser.get('newUserZipcode').value);
      }
        
  
      }else{
        this.formAppointmentInfo.controls['appo_address'].setValue(null);
        this.formAppointmentInfo.controls['appo_state'].setValue(null);
        this.formAppointmentInfo.controls['appo_city'].setValue(null);
        this.formAppointmentInfo.controls['appo_zipcode'].setValue(null);
  
        // this.appo_address_info.appo_address = "";
        // this.appo_address_info.appo_state = "";
        // this.appo_address_info.appo_city = "";
        // this.appo_address_info.appo_zipcode = "";
      }
    } 
  
    fnSameAsBillingAddress(event){
  
      if(event.srcElement.checked == true){
        
        this.formAppointmentInfo.controls['appo_address'].setValue(this.authenticationService.currentUserValue.address);
        this.formAppointmentInfo.controls['appo_state'].setValue(this.authenticationService.currentUserValue.state);
        this.formAppointmentInfo.controls['appo_city'].setValue(this.authenticationService.currentUserValue.city);
        this.formAppointmentInfo.controls['appo_zipcode'].setValue(this.authenticationService.currentUserValue.zip);
  
      }else{
  
        this.formAppointmentInfo.controls['appo_address'].setValue('');
        this.formAppointmentInfo.controls['appo_state'].setValue('');
        this.formAppointmentInfo.controls['appo_city'].setValue('');
        this.formAppointmentInfo.controls['appo_zipcode'].setValue('');
  
      }
    } 
    fnappointmentinfo(){

      if(this.is_at_home_service==false){
        if(!this.formAppointmentInfo.valid){
          this.formAppointmentInfo.get('appo_address').markAsTouched();
          this.formAppointmentInfo.get('appo_state').markAsTouched();
          this.formAppointmentInfo.get('appo_city').markAsTouched();
          this.formAppointmentInfo.get('appo_zipcode').markAsTouched();
          return false;
        }else{
          this.personalinfo=false;
          this.appointmentinfo = false;
          this.summaryScreen = true;
        }
      }else{
        this.personalinfo=false;
        this.appointmentinfo = false;
        this.summaryScreen = true;

      }
  
  
    }
    
    isEmailUnique(control: FormControl) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let emailCheckRequestObject = {
            'business_id':this.businessId,
            'email': control.value,
            'phone': null,
            'customer_id':null,
            'checkType':'email', 
          }
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/customer-check`, emailCheckRequestObject,{headers:headers}).pipe(map((response : any) =>{
          return response;
        }),
        catchError(this.handleError)).subscribe((res) => {
          if(res){
            if(res.data == false){
            resolve({ isEmailUnique: true });
            }else{
            resolve(null);
            }
          }
        });
        }, 500);
      });
    }
    fnProceedToSummary(event){
      if(this.isLoggedIn){
        this.fnappointmentinfo();
      }else{
        if(this.existinguser){
          this.fnloginexisinguser();
        }else if(this.newuser){
          this.fnpersonalinfo();
        }
      }
    }
    fnRemove(event,service_id){
      if(this.serviceCount[service_id].count >= 1){
        //this.currentSelectedService=service_id;
        this.serviceCount[service_id].count=this.serviceCount[service_id].count-1
  
        this.serviceCount[service_id].subtotal = this.serviceCount[service_id].service_cost * this.serviceCount[service_id].count;
        this.serviceCount[service_id].discount_type=null;
        this.serviceCount[service_id].discount_value=null;
        this.serviceCount[service_id].discount = 0;
        
        var serviceAmountAfterDiscount= this.serviceCount[service_id].subtotal - this.serviceCount[service_id].discount;
        var serviceTaxAmount=0;
        let taxMain=[];
        this.taxArr.forEach((element) => {
          let taxTemp={
            value:0,
            name:'',
            amount:0
          }
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
          this.serviceCount[service_id].tax=taxMain;
        });
  
        // this.serviceData[id].tax=0;
        this.serviceCount[service_id].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
  
        if(this.serviceCartArr[service_id] != null){
          if(this.serviceCount[service_id].count < 1){
            this.serviceCartArr[service_id]=null;
          }else{
            this.serviceCartArr[service_id]=this.serviceCount[service_id]; 
          }
        }
        this.serviceMainArr.totalNumberServices=0;
        this.serviceMainArr.subtotal=0;
        this.serviceMainArr.discount=0;
        this.taxAmountArr.length=0;
        this.serviceMainArr.netCost=0;
        for(let i=0; i< this.serviceCartArr.length; i++){
          if(this.serviceCartArr[i] != null){
            this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
            this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
          }
        }
        var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
        var amountAfterTax=0;
        if(this.serviceMainArr.subtotal > 0){
          this.taxArr.forEach((element) => {
            let taxTemp={
            value:0,
              name:'',
              amount:0
            }
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
          });
        }
        this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
        }
    }
  
    fnAdd(event,service_id){
      if(this.serviceCount[service_id].count < 10){
        this.serviceCount[service_id].count=this.serviceCount[service_id].count+1
  
        this.serviceCount[service_id].subtotal = this.serviceCount[service_id].service_cost * this.serviceCount[service_id].count;
        this.serviceCount[service_id].discount_type=null;
        this.serviceCount[service_id].discount_value=null;
        this.serviceCount[service_id].discount=0;
        
        var serviceAmountAfterDiscount= this.serviceCount[service_id].subtotal - this.serviceCount[service_id].discount;
        var serviceTaxAmount=0;
        let taxMain=[];
        this.taxArr.forEach((element) => {
          let taxTemp={
            value:0,
            name:'',
            amount:0
          }
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
          this.serviceCount[service_id].tax=taxMain;
        });
  
        this.serviceCount[service_id].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
  
        if(this.serviceCartArr[service_id] != null){
          this.serviceCartArr[service_id]=this.serviceCount[service_id];
        } 
  
        
        for(let i=0; i< this.serviceCartArr.length; i++){
          if(this.serviceCartArr[i] != null){
            this.serviceCartArr[i].subtotal = this.serviceCartArr[i].service_cost * this.serviceCartArr[i].count;
            this.serviceCartArr[i].discount_type=null;
            this.serviceCartArr[i].discount_value=null;
  
            this.serviceCartArr[i].discount=0;
  
            var serviceAmountAfterDiscount= this.serviceCartArr[i].subtotal - this.serviceCartArr[i].discount;
            var serviceTaxAmount=0;
            let taxMain=[];
            this.taxArr.forEach((element) => {
              let taxTemp={
                value:0,
                name:'',
                amount:0
              }
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
              this.serviceCartArr[i].tax=taxMain;
            });
  
            this.serviceCartArr[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
            this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
            this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
          }
        }
        
  
        this.serviceMainArr.totalNumberServices=0;
        this.serviceMainArr.subtotal=0;
        this.serviceMainArr.discount=0;
        this.taxAmountArr.length=0;
        this.serviceMainArr.netCost=0;
        // this.fncheckavailcoupon('valid');
       
  
        for(let i=0; i< this.serviceCartArr.length; i++){
          if(this.serviceCartArr[i] != null){
            this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
            this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
          }
        }
        var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
        var amountAfterTax=0;
        if(this.serviceMainArr.subtotal > 0){
          this.taxArr.forEach((element) => {
            let taxTemp={
              value:0,
              name:'',
              amount:0
            }
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
          });
        }
        // this.taxAmountArr.forEach((element) => {
        //   amountAfterDiscount=amountAfterDiscount+element;
        // });
        this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
        }
    }

    
      // coupon code
  fncheckcouponcodebtn(couponStatus){
    if(this.coupon.couponcode_val == ''){
      this.closecoupon = 'invalid';
      this.couponIcon="check";
      this.isReadOnly="";
      return false;
    }
    this.fncheckavailcoupon(couponStatus);
  }

  fncheckavailcoupon(couponStatus){
    if(couponStatus == 'valid'){
      this.serviceMainArr.discount_type = null;
      this.serviceMainArr.discount_value=null;
      this.taxAmountArr.length=0;
              
      this.serviceMainArr.totalNumberServices=0;
      this.serviceMainArr.subtotal=0;
      this.serviceMainArr.discount=0;
      this.taxAmountArr.length=0;
      this.serviceMainArr.netCost=0;

      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceCartArr[i].subtotal = this.serviceCartArr[i].service_cost * this.serviceCartArr[i].count;
          this.serviceCartArr[i].discount_type=null;
          this.serviceCartArr[i].discount_value=null;

          this.serviceCartArr[i].discount=0;

          var serviceAmountAfterDiscount= this.serviceCartArr[i].subtotal - this.serviceCartArr[i].discount;
          var serviceTaxAmount=0;
          let taxMain=[];
          this.taxArr.forEach((element) => {
            let taxTemp={
              value:0,
              name:'',
              amount:0
            }
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
            this.serviceCartArr[i].tax=taxMain;
          });

          this.serviceCartArr[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
        }
      }
      this.serviceMainArr.discount_type = null;
      this.serviceMainArr.discount_value = null;
      this.serviceMainArr.discount=0;

      var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      var amountAfterTax=0;
      if(this.serviceMainArr.subtotal > 0){
        this.taxArr.forEach((element) => {
          let taxTemp={
          value:0,
            name:'',
            amount:0
          }
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
        });
      }
      this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
      //this.serviceMainArr.netCost=this.serviceMainArr.subtotal;
      this.closecoupon = 'default';
      this.couponIcon="check";
      this.coupon.couponcode_val ="";
      this.isReadOnly="";
    }else{
      let allServiceIds='';
      for(let i=0; i<this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i]){
          allServiceIds=allServiceIds+this.serviceCartArr[i].id+',';
        }
      }
      allServiceIds=allServiceIds.substring(0, allServiceIds.length - 1);
      var allServiceIdsArr=allServiceIds.split(",");

      let requestObject = {
      "business_id" : this.businessId,
      "service_id" : allServiceIds,
      "coupon_code" : this.coupon.couponcode_val,
      };
      
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/check-discount-coupon`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        let couponType = response.response.coupon_type;
        let couponValue = response.response.coupon_value;
        
        this.taxAmountArr.length=0;
                
        this.serviceMainArr.totalNumberServices=0;
        this.serviceMainArr.subtotal=0;
        this.serviceMainArr.discount=0;
        this.taxAmountArr.length=0;
        this.serviceMainArr.netCost=0;

        for(let i=0; i< this.serviceCartArr.length; i++){
          if(this.serviceCartArr[i] != null){
            this.serviceCartArr[i].subtotal = this.serviceCartArr[i].service_cost * this.serviceCartArr[i].count;
            this.serviceCartArr[i].discount_type=couponType;
            this.serviceCartArr[i].discount_value=parseInt(couponValue);

            if(this.serviceCartArr[i].discount_type == 'P'){
              this.serviceCartArr[i].discount = (this.serviceCartArr[i].subtotal*parseInt(this.serviceCartArr[i].discount_value))/100;
            }else{
              this.serviceCartArr[i].discount = parseInt(this.serviceCartArr[i].discount_value)/allServiceIdsArr.length;
            }

            var serviceAmountAfterDiscount= this.serviceCartArr[i].subtotal - this.serviceCartArr[i].discount;
            var serviceTaxAmount=0;
            let taxMain=[];
            this.taxArr.forEach((element) => {
              let taxTemp={
                value:0,
                name:'',
                amount:0
              }
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
              this.serviceCartArr[i].tax=taxMain;
            });

            this.serviceCartArr[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
            this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
            this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
          }
        }
        this.serviceMainArr.discount_type = couponType;
        this.serviceMainArr.discount_value = parseInt(couponValue);
        if(couponType == 'P'){
          this.serviceMainArr.discount = (this.serviceMainArr.subtotal*parseInt(couponValue))/100;
        }else{
          this.serviceMainArr.discount = parseInt(couponValue);
        }

        var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
        var amountAfterTax=0;
        if(this.serviceMainArr.subtotal > 0){
          this.taxArr.forEach((element) => {
            
            let taxTemp={
              value:0,
              name:'',
              amount:0
            }
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
          });
        }
        this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
        this.coupon.couponcode_val=response.response.coupon_code;
        this.couponIcon="close";
        this.closecoupon = 'valid';
        this.isReadOnly="readonly";
        this.showCouponError=false;
        this.couponErrorMessage="";
      }
      else{
        this.closecoupon = 'invalid';
        this.couponIcon="check";
        this.isReadOnly="";
        this.showCouponError=true;
        this.couponErrorMessage=response.response;
       }
      },
      (err) =>{
        this.closecoupon = 'invalid';
        this.couponIcon="check";
        this.isReadOnly="";
        this.showCouponError=false;
        this.couponErrorMessage="";
       
      })
    }
  }
  fnChangeTermsConditionsStatus(event){
    if(event== true){
      this.termsConditionsStatusValue=true;
      this.termsConditionsStatusValidation = false;
    }
    else if(event==false){
      this.termsConditionsStatusValue=false;
      this.termsConditionsStatusValidation = true;
    }
     
  }

  fnChangePrivacyPolicyStatus(event){
      if(event == true){
      this.PrivacyPolicyStatusValue=true;
      this.PrivacyPolicyStatusValidation = false;

      }else if(event == false){
        this.PrivacyPolicyStatusValidation = true;
      this.PrivacyPolicyStatusValue=false;

      }

  }


    fnProceedToPayment(event){
      if(this.PrivacyPolicyStatusValue == false && this.termsConditionsStatusValue == false){
        this.PrivacyPolicyStatusValidation = true;
        this.termsConditionsStatusValidation = true;
        return false;
      }
      else if(this.termsConditionsStatusValue == false){
        this.termsConditionsStatusValidation = true;
        return false;
      }
      else if(this.PrivacyPolicyStatusValue == false){
        this.PrivacyPolicyStatusValidation = true;
        return false;
      }
      if(this.closecoupon != 'valid'){
        this.coupon.couponcode_val=''
      }
      let digit5= Math.floor(Math.random()*90000) + 10000;
      this.reference_id="2_"+digit5+"_"+ this.datePipe.transform(new Date(),"yyyy/MM/dd") ;
      this.itemArr= [];
        for(let i=0; i<this.serviceCartArr.length;i++){
          if(this.serviceCartArr[i]){
            let singleItem={
              name: this.serviceCartArr[i].service_name,
              quantity: '1',
              description : 'Actual Quantity - '+JSON.stringify(this.serviceCartArr[i].count),
              category: 'DIGITAL_GOODS',
              // tax:{currency_code:"USD", value:"1.00"},
              unit_amount: {
                currency_code: this.currencySymbol,
                value: JSON.stringify(this.serviceCartArr[i].subtotal)
              }
            }
            this.itemArr.push(singleItem);
  
          }
        }
        this.taxAmount=0;
        this.taxAmountArr.forEach(element=>{
          this.taxAmount=this.taxAmount+element.amount;
        });
      this.summaryScreen = false;
      this.paymentScreen =true;
    }
    fnPaymentMethod(paymentMethod){
      if(paymentMethod == 'Cash'){
        this.creditcardform =false;
        this.showPaypalButtons =false;
        this.paymentMethod="Cash";
        this.BankDetail =false;
        this.transactionId=null;
        this.paymentDateTime=this.datePipe.transform(new Date(),"yyyy-MM-dd HH:mm:ss");
      }
      if(paymentMethod == 'stripe'){
        this.paymentMethod="stripe";
        this.creditcardform =true;
        this.showPaypalButtons =false;
        this.BankDetail =false;
        this.transactionId=null;
        this.paymentDateTime=this.datePipe.transform(new Date(),"yyyy-MM-dd HH:mm:ss");
      }
      if(paymentMethod == 'BankTransfer'){
        this.paymentMethod="BankTransfer";
        this.BankDetail =true;
        this.creditcardform =false;
        this.showPaypalButtons =false;
        this.transactionId=null;
        this.paymentDateTime=this.datePipe.transform(new Date(),"yyyy-MM-dd HH:mm:ss");
      }
      if(paymentMethod == 'Paypal'){
        this.BankDetail =false;
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
        this.BankDetail =false;
        this.paymentMethod="PayUMoney";
        this.transactionId=null;
        this.paymentDateTime=new Date();
      }
    }

    fnPayNow(){
      if(this.paymentMethod == 'Cash'){
        this.fnAppointmentBooking();
      }
      if(this.paymentMethod == 'BankTransfer'){
        this.fnAppointmentBooking();
      }
      if(this.paymentMethod == 'stripe'){
        this.stripePayment();
      }
      if(this.paymentMethod == 'PayUMoney'){
        if(this.PayUMoney.key!="" && this.PayUMoney.salt!=""){
          this.fnPayUMoney();
        }
      }
    }
    stripePayment(){
      
      if(this.cardForm.valid){
        this.isLoader = true;
        let requestObject ={
          "name" : this.cardForm.get("cardHolderName").value,
          "number" : this.cardForm.get("cardNumber").value,
          "exp_month" : this.cardForm.get("expiryMonth").value,
          "exp_year" : this.cardForm.get("expiryYear").value,
          "cvc" : this.cardForm.get("cvvCode").value,
          "amount" : this.serviceMainArr.netCost,
          "business_id" : this.businessId,
        }
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
    
        this.http.post(`${environment.apiUrl}/stripe-payment`,requestObject,{headers:headers} ).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError)
        ).subscribe((response:any) => {
          if(response.data == true){
            let digit5= Math.floor(Math.random()*90000) + 10000;
          this.reference_id="2_"+digit5+"_"+ this.datePipe.transform(new Date(),"yyyy/MM/dd") ;
            this.transactionId = response.response.id 
            this.paymentDateTime = this. datePipe.transform(new Date(),"yyyy/MM/dd");
            this.isLoader=false;
            this.fnAppointmentBooking();
        }
          else{
            this.snackBar.open("Card Invalid", "X", {
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
    guid() {
      return this.s4() + this.s4() + this.s4() + this.s4();
    }

    s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    getTxnId(){
      return this.guid();
    }
    
     // Get Random Transaction Id

    fnPayUMoney(){

      this.PayUMoney.txnid= this.getTxnId();
      this.PayUMoney.amount= this.serviceMainArr.netCost.toString();
      this.PayUMoney.firstname= this.customerFirstname;
      this.PayUMoney.email= this.customerEmail,
      this.PayUMoney.phone= this.customerPhone,
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
      var Handler = {
        responseHandler: (BOLT) => {
          if(BOLT && BOLT.response.txnStatus == "SUCCESS"){
            let generatedHash=this.generateResponseHash(BOLT.response);
            if(BOLT.response.hash == generatedHash){
              this.reference_id=BOLT.response.txnid;
              this.transactionId=BOLT.response.payuMoneyId;
              this.paymentDateTime= this.datePipe.transform(BOLT.response.addedon,"yyyy-MM-dd HH:mm:ss");
              this.fnAppointmentBooking();
            }
          }else if(BOLT && BOLT.response.txnStatus == "FAILED"){
            this.snackBar.open("Transaction Failed", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }else if(BOLT && BOLT.response.txnStatus == "CANCEL"){
            this.snackBar.open(BOLT.response.txnMessage, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }
          // your payment response Code goes here, BOLT is the response object
        },
        catchException: function(BOLT){
          // the code you use to handle the integration errors goes here
        }
      }
      // PayUMoneylaunch(RequestData,Handler);
      // bolt.launch( RequestData , Handler ); 
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
   
  
  fnAppointmentBooking(){
    this.isLoader=true;
    let serviceCartArrTemp:any= [];
    for(let i=0; i<this.serviceCartArr.length;i++){
      if(this.serviceCartArr[i]){
        serviceCartArrTemp.push(this.serviceCartArr[i]);
      }
    }
    const currentDateTime = new Date();
     let bookingNotes = {
      "user_type": 'C',
      "note_type": 'normal',
      "user_id": this.authenticationService.currentUserValue.user_id,
      "notes":this.formNewUser.get('newUserSplReq').value ? this.formNewUser.get('newUserSplReq').value : null
    }
    let requestObject = {
      "postal_code" : this.bookingPostalcode,
      "business_id" : this.businessId,
      "serviceInfo" : serviceCartArrTemp,
      "appointment_address" : this.formAppointmentInfo.get('appo_address').value,
      "appointment_state" : this.formAppointmentInfo.get('appo_state').value,
      "appointment_city" : this.formAppointmentInfo.get('appo_city').value,
      "appointment_zipcode" : this.formAppointmentInfo.get('appo_zipcode').value,
      "coupon_code" : this.coupon.couponcode_val,
      "customer_id": this.authenticationService.currentUserValue.user_id,
      "customer_token" : this.authenticationService.currentUserValue.token,
      "notes" : bookingNotes,
      "subtotal" : this.serviceMainArr.subtotal,
      "discount_type" : this.serviceMainArr.discount_type,
      "discount_value" : this.serviceMainArr.discount_value,
      "discount" : this.serviceMainArr.discount,
      "tax" : this.taxAmountArr,
      "nettotal" : this.serviceMainArr.netCost,
      "payment_method" : this.paymentMethod,
      "order_date": this.datePipe.transform(currentDateTime,"yyyy-MM-dd"),
      "reference_id": this.reference_id,
      "transaction_id": this.transactionId,
      "payment_datetime": this.paymentDateTime,
      'fullname' : JSON.parse(localStorage.getItem('currentUser')).full_name ? JSON.parse(localStorage.getItem('currentUser')).full_name : JSON.parse(localStorage.getItem('currentUser')).fullname,
      'full_name' : JSON.parse(localStorage.getItem('currentUser')).full_name ? JSON.parse(localStorage.getItem('currentUser')).full_name : JSON.parse(localStorage.getItem('currentUser')).fullname,
    };
     
    // return;

      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      this.http.post(`${environment.apiUrl}/order-create`,requestObject,{headers:headers} ).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
          this.isLoader=false;
        // this.dialogRef.close('book-success');
          this.thankYouScreen=true;
          this.paymentScreen=false;
          if(this.thankYou.status == true){
            setTimeout(() => {
              window.open(this.thankYou.page_link, "_blank");
            }, 2000);
          }else {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
          this.fnViewDashboard();
        }else{
          this.isLoader=false;
          this.snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
      },(err) =>{
        
      })
    }
    
  fnForgotPWD(){
    this.dialogRef.close('forgot-pwd');
  }
    
  }

// Theme 2 cart popup

@Component({
  selector: 'theme-2-cart-popup',
  templateUrl: '../_dialogs/theme-2-cart-dialog.html',
  providers: [DatePipe]
})
export class theme2CartPopup {
  serviceCartArr:any;
  serviceMainArr={
    totalNumberServices:0,
    subtotal:0,
    discount_type:null,
    discount_value:null,
    discount:0,
    netCost:0
  }
  settingsArr:any;
  serviceCount:any=[];
  currentSelectedService:any;
  taxArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;
  taxType:any='P';
  taxAmountArr:any=[];
  sizeServiceCartArr:any;
  cartPopupCloseType:any = 'add-more';
  constructor(
    public dialogRef: MatDialogRef<theme2CartPopup>,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private authenticationService:AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.serviceCartArr = this.data.serviceCartArr
      this.settingsArr = this.data.settingsArr,
      this.serviceCount = this.data.serviceCount
      this.taxArr=this.data.taxArr,
      this.sizeServiceCartArr = 0
      this.serviceCartArr.forEach(element => {
        this.sizeServiceCartArr = this.sizeServiceCartArr+1
      });
      this.currencySymbol = this.settingsArr.currency;
      this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
      this.currencySymbolFormat = this.settingsArr.currency_format;
      

      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
        }
      }
      var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      var amountAfterTax=0;
      if(this.serviceMainArr.subtotal > 0){
        this.taxArr.forEach((element) => {
          let taxTemp={
            value:0,
            name:'',
            amount:0
          }
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
        });
      }
      this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
    }

    onNoClick(): void {
      this.dialogRef.close(this.cartPopupCloseType);
      
    }
    ngOnInit() {}
    fnContinueCart(closeType){
      this.cartPopupCloseType = {
        'closeType':closeType,
        'serviceMainArr' : this.serviceMainArr
      }
      this.dialogRef.close(this.cartPopupCloseType);
    }
    
  fnRemove(event,service_id){
    if(this.serviceCount[service_id].count >= 1){
      this.currentSelectedService=service_id;
      this.serviceCount[service_id].count=this.serviceCount[service_id].count-1

      this.serviceCount[service_id].subtotal = this.serviceCount[service_id].service_cost * this.serviceCount[service_id].count;
      this.serviceCount[service_id].discount_type=null;
      this.serviceCount[service_id].discount_value=null;
      this.serviceCount[service_id].discount=0;
      
      var serviceAmountAfterDiscount= this.serviceCount[service_id].subtotal - this.serviceCount[service_id].discount;
      var serviceTaxAmount=0;
      let taxMain=[];
      this.taxArr.forEach((element) => {
        let taxTemp={
          value:0,
          name:'',
          amount:0
        }
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
        this.serviceCount[service_id].tax=taxMain;
      });

      // this.serviceData[id].tax=0;
      this.serviceCount[service_id].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;

      // this.serviceCount[service_id].totalCost=this.serviceCount[service_id].count*this.serviceCount[service_id].service_cost;
      if(this.serviceCartArr[service_id] != null){
        if(this.serviceCount[service_id].count < 1){
          this.serviceCartArr[service_id]=null;
        }else{
          this.serviceCartArr[service_id]=this.serviceCount[service_id]; 
        }
      }
      this.serviceMainArr.totalNumberServices=0;
      this.serviceMainArr.subtotal=0;
      this.serviceMainArr.discount=0;
      this.taxAmountArr.length=0;
      this.serviceMainArr.netCost=0;
      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
        }
      }
      var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      var amountAfterTax=0;
      if(this.serviceMainArr.subtotal > 0){
        this.taxArr.forEach((element) => {
         
          let taxTemp={
          value:0,
            name:'',
            amount:0
          }
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
        });
      }
      // this.taxAmountArr.forEach((element) => {
      //   amountAfterDiscount=amountAfterDiscount+element;
      // });
      this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
    }
  }

  fnAdd(event,service_id){
    if(this.serviceCount[service_id].count < 10){
      this.currentSelectedService=service_id;
      this.serviceCount[service_id].count=this.serviceCount[service_id].count+1

      this.serviceCount[service_id].subtotal = this.serviceCount[service_id].service_cost * this.serviceCount[service_id].count;
      this.serviceCount[service_id].discount_type=null;
      this.serviceCount[service_id].discount_value=null;
      this.serviceCount[service_id].discount=0;
      
      var serviceAmountAfterDiscount= this.serviceCount[service_id].subtotal - this.serviceCount[service_id].discount;
      var serviceTaxAmount=0;
      let taxMain=[];
      this.taxArr.forEach((element) => {
        let taxTemp={
          value:0,
          name:'',
          amount:0
        }
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
        this.serviceCount[service_id].tax=taxMain;
      });

      // this.serviceData[id].tax=0;
      this.serviceCount[service_id].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
      if(this.serviceCartArr[service_id] != null){
        this.serviceCartArr[service_id]=this.serviceCount[service_id];
      } 

      
      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceCartArr[i].subtotal = this.serviceCartArr[i].service_cost * this.serviceCartArr[i].count;
          this.serviceCartArr[i].discount_type=null;
          this.serviceCartArr[i].discount_value=null;

          this.serviceCartArr[i].discount=0;

          var serviceAmountAfterDiscount= this.serviceCartArr[i].subtotal - this.serviceCartArr[i].discount;
          var serviceTaxAmount=0;
          let taxMain=[];
          this.taxArr.forEach((element) => {
            let taxTemp={
              value:0,
              name:'',
              amount:0
            }
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
            this.serviceCartArr[i].tax=taxMain;
          });

          this.serviceCartArr[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
        }
      }
      

      this.serviceMainArr.totalNumberServices=0;
      this.serviceMainArr.subtotal=0;
      this.serviceMainArr.discount=0;
      this.taxAmountArr.length=0;
      this.serviceMainArr.netCost=0;
      // this.fncheckavailcoupon('valid');
     

      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
        }
      }
      var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      var amountAfterTax=0;
      if(this.serviceMainArr.subtotal > 0){
        this.taxArr.forEach((element) => {
          let taxTemp={
            value:0,
            name:'',
            amount:0
          }
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
        });
      }
      // this.taxAmountArr.forEach((element) => {
      //   amountAfterDiscount=amountAfterDiscount+element;
      // });
      this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
    }
  }
}



// Theme 2 Date Time Selection Popup

@Component({
  selector: 'theme-2-cart-popup',
  templateUrl: '../_dialogs/theme-2-select-datetime.html',
  providers: [DatePipe]
})
export class theme2DateTimeSelection {
  isLoader:boolean=false;
  model: NgbDateStruct;
  today:any= new Date();
  dateformatter: NgbDateParserFormatter;
  date: {year: number, month: number};
  minDate: {year: number, month: number, day: number};
  maxDate: {year: number, month: number, day: number};
  displayMonths = 1;
  navigation = 'arrows';
  minimumAdvanceBookingTime:any;
  maximumAdvanceBookingTime:any;
  minimumAdvanceBookingDateTimeObject:any;
  maximumAdvanceBookingDateTimeObject:any;
  settingsArr:any=[];
  staffOnFrontValue:boolean=false;
  customerLoginValue:boolean=false;
  urlString:any;
  businessId:any;
  offDaysList:any= [];
  workingHoursOffDaysList:any= [];
  timeSlotArr:any= [];
  selectedTimeSlot:any;
  availableStaff:any= [];
  serviceCount:any= [];
  selecteddate: any;
  selecteddateForLabel: any;
  timeSlotArrForLabel:any=[];
  timeslotview: boolean = false;
  isStaffAvailable:boolean=false;
  bookingPostalcode:any;
  currentSelectedService:any;
  selectedStaff:any;
  staffIndex:any;
  directAPI:any;
  serviceCartArr:any= [];
  @ViewChildren(MdePopoverTrigger) trigger: QueryList<MdePopoverTrigger>;
  serviceMainArr={
    totalNumberServices:0,
    subtotal:0,
    discount_type:null,
    discount_value:null,
    discount:0,
    netCost:0
  }
  constructor(
    public dialogRef: MatDialogRef<theme2DateTimeSelection>,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private calendar: NgbCalendar,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private authenticationService:AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.urlString = window.location.search.split("?business_id="); 
      this.businessId = window.atob(decodeURIComponent(this.urlString[1]));
      this.settingsArr = this.data.settingsArr
      this.bookingPostalcode = this.data.bookingPostalcode
      this.currentSelectedService = this.data.currentSelectedService
      this.model = this.data.model
      this.selecteddate = this.data.selecteddate
      this.selecteddateForLabel = this.data.selecteddateForLabel
      this.directAPI = this.data.directAPI;
      this.timeSlotArr = JSON.stringify(this.data.timeSlotArr);
      this.timeSlotArr = JSON.parse(this.timeSlotArr);
      var i=0;
      this.timeSlotArr.forEach( (element) => {
        var dateTemp=this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element+":00";
         this.timeSlotArrForLabel[i]= this.datePipe.transform(new Date(dateTemp),"hh:mm a");
         i++;
      });
      if(this.directAPI == 'gettimeslote'){
        this.fnGetTimeSlots();
      }else if(this.directAPI == 'selectnextvalidate'){
        this.fnSelectNextValidDate(this.minimumAdvanceBookingDateTimeObject);
      }
      this.minimumAdvanceBookingTime=JSON.parse(this.settingsArr.min_advance_booking_time);
          this.maximumAdvanceBookingTime=JSON.parse(this.settingsArr.max_advance_booking_time);
          this.minimumAdvanceBookingDateTimeObject = new Date();
          this.minimumAdvanceBookingDateTimeObject.setMinutes( this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime );
         this.minDate = {
            year: this.minimumAdvanceBookingDateTimeObject.getFullYear(),
            month: this.minimumAdvanceBookingDateTimeObject.getMonth() + 1,
            day: this.minimumAdvanceBookingDateTimeObject.getDate()
          };
          this.maximumAdvanceBookingDateTimeObject = new Date();
          this.maximumAdvanceBookingDateTimeObject.setMinutes( this.maximumAdvanceBookingDateTimeObject.getMinutes() + this.maximumAdvanceBookingTime );
         this.maxDate = {
            year: this.maximumAdvanceBookingDateTimeObject.getFullYear(),
            month: this.maximumAdvanceBookingDateTimeObject.getMonth() + 1,
            day: this.maximumAdvanceBookingDateTimeObject.getDate(),
          };
          this.staffOnFrontValue=JSON.parse(JSON.parse(this.settingsArr.staff_list_on_front).status)
          this.customerLoginValue=JSON.parse(this.settingsArr.customer_login);
    }
    isWeekend(date: NgbDateStruct) {
      const d = new Date(date.year, date.month - 1, date.day);
      return d.getDay() === 0 || d.getDay() === 6;
    }
    isDisabled = (date: NgbDateStruct, current: {month: number}) => {
      return this.fnDisableDates(date); // this is undefined
    }
    selectToday() {
      this.model = this.calendar.getToday();
    }
    fnDisableDates(date: NgbDateStruct){
      const d = new Date(date.year, date.month - 1, date.day);
      let temp:any;
      let temp2:any;
      for(var i=0; i<this.offDaysList.length; i++){
        var offDay = new Date(this.offDaysList[i]);
        if(i==0){
         temp=date.month==offDay.getMonth()+1 && date.day==offDay.getDate(); 
        }else{
          temp+=temp2 || date.month==offDay.getMonth()+1 && date.day==offDay.getDate();
        }
      }
      for(var i=0; i<this.workingHoursOffDaysList.length; i++){
          temp+=temp2 || d.getDay() === this.workingHoursOffDaysList[i];
      }
      return temp;
    }
  
    private handleError(error: HttpErrorResponse) {
      return throwError('Error! something went wrong.');
      //return error.error ? error.error : error.statusText;
    }

    onNoClick(): void {
      if(this.selectedStaff !== undefined && this.staffIndex !== undefined){
        let result = {
          'selectedStaff': this.selectedStaff,
          'staffIndex': this.staffIndex,
          'selecteddate': this.selecteddate,
          'selecteddateForLabel':this.selecteddateForLabel,
          'selectedTimeSlot':this.selectedTimeSlot,
        }
        this.dialogRef.close(result);
      }else{
        this.dialogRef.close();  
      }
      
    }
    ngOnInit() {

      
    // this.serviceCount.length=0
    // this.serviceCartArr.length=0
    }


    fnGetOffDays(){
      let requestObject = {
        "business_id": this.businessId
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      this.http.post(`${environment.apiUrl}/list-holidays`,requestObject,{headers:headers} ).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
        ).subscribe((response:any) => {
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
         
        })
      }

      onDateSelect(event){
        this.timeSlotArr = [];
        this.selecteddate = event.year+'-'+event.month+'-'+event.day;
        this.selecteddate=this.datePipe.transform(new Date(this.selecteddate),"yyyy-MM-dd")
        this.selecteddateForLabel=this.datePipe.transform(new Date(this.selecteddate),"EEE, MMM dd")
        this.fnGetTimeSlots();
      }
    
      fnGetTimeSlots(){
        this.isLoader=true;
        let requestObject = {
          "business_id": this.businessId,
          "selected_date":this.selecteddate,
          "service_id":this.currentSelectedService,
          };
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
    
        this.http.post(`${environment.apiUrl}/list-availabel-timings`,requestObject,{headers:headers} ).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError)
        ).subscribe((response:any) => {
          if(response.data == true){
            // this.timeSlotArr=[];
            // this.timeSlotArrForLabel=[];
            //this.timeSlotArr = response.response;
            this.minimumAdvanceBookingDateTimeObject = new Date();
            this.minimumAdvanceBookingDateTimeObject.setMinutes( this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime );
            response.response.forEach(element => {
              if((new Date(this.datePipe.transform(this.selecteddate,"yyyy-MM-dd")+" "+element+":00")).getTime() > (this.minimumAdvanceBookingDateTimeObject).getTime()){
                this.timeSlotArr.push(element);
              }
            });
            var i=0;
            this.timeSlotArr.forEach( (element) => {
              var dateTemp=this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element+":00";
               this.timeSlotArrForLabel[i]= this.datePipe.transform(new Date(dateTemp),"hh:mm a");
               i++;
            });
            this.timeslotview = true;
            this.isLoader=false;
          }
          else{
            this.timeSlotArr.length=0;
            this.timeSlotArrForLabel.length=0;
            this.timeslotview = false;
            this.isLoader=false;
          }
          },
          (err) =>{
            this.timeSlotArr.length=0;
            this.timeSlotArrForLabel.length=0;
            this.timeslotview = false;
            this.isLoader=false;
           
          })
      }
     
      fnSelectTimeSlot(timeSlot,index){
        this.selectedTimeSlot=timeSlot;
        if(this.staffOnFrontValue == true){
          this.fnGetStaff();
        }else{
          this.fnSelectStaff(null,index);
        }
      }
    
      fnGetStaff(){
        this.isLoader=true;
        let requestObject = {
          "business_id": this.businessId,
          "postal_code":this.bookingPostalcode,
          "service_id":this.currentSelectedService,
          "book_date" : this.datePipe.transform(new Date(this.selecteddate),"yyyy-MM-dd"),
          "book_time" : this.selectedTimeSlot, 
          "internal_staff" : "N"
        };
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
    
        this.http.post(`${environment.apiUrl}/service-staff`,requestObject,{headers:headers} ).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError)
        ).subscribe((response:any) => {
          if(response.data == true){
              this.availableStaff = response.response;
              this.isStaffAvailable = true;
              this.isLoader=false;
          }
          else{
            this.availableStaff.length=0;
           this.isStaffAvailable = false;
           this.isLoader=false;
          }
          },
          (err) =>{
            this.isStaffAvailable = false;
            this.isLoader=false;
           
          })
      }
   
    fnSelectStaff(staff_id,index){
       this.selectedStaff= staff_id;
       this.staffIndex = index
       if(this.staffOnFrontValue){
        this.trigger.toArray()[index].togglePopover();
      }
    }
    fnSelectNextValidDate(mydate){
    
      if(mydate=="" || mydate==undefined){
        return false;
      }
      
      if(this.offDaysList.indexOf(this.datePipe.transform(new Date(mydate),"yyyy-MM-dd"))>-1){
        mydate.setDate(mydate.getDate() + 1)
        this.fnSelectNextValidDate(mydate);
      }else{
        let day = this.datePipe.transform(new Date(mydate),"EEE");
        let dayId;
        if(day == "Sun"){
          dayId=0;
        }
        if(day == "Mon"){
          dayId=1;
        }
        if(day == "Tue"){
          dayId=2;
        }
        if(day == "Wed"){
          dayId=3;
        }
        if(day == "Thu"){
          dayId=4;
        }
        if(day == "Fri"){
          dayId=5;
        }
        if(day == "Sat"){
          dayId=6;
        }
        if(this.workingHoursOffDaysList.indexOf(dayId)>-1){
          mydate.setDate(mydate.getDate() + 1)
          this.fnSelectNextValidDate(mydate);
        }else{
          this.selecteddate=this.datePipe.transform(new Date(mydate),"yyyy-MM-dd");
          let year=this.selecteddate.split("-")[0];
          let month= this.selecteddate.split("-")[1];
          let day=this.selecteddate.split("-")[2];
          let dateTemp={"year":parseInt(year),"month":parseInt(month),"day":parseInt(day)};
          this.model=dateTemp;
          this.selecteddateForLabel= this.datePipe.transform(new Date(mydate),"EEE, MMM dd");
          this.fnGetTimeSlots();
        }
      }
    }

    fnClosePopup(){
      if(this.selectedStaff !== undefined && this.staffIndex !== undefined){
        let result = {
          'selectedStaff': this.selectedStaff,
          'staffIndex': this.staffIndex,
          'selecteddate': this.selecteddate,
          'selecteddateForLabel':this.selecteddateForLabel,
          'selectedTimeSlot':this.selectedTimeSlot,
        }
        this.dialogRef.close(result);
      }else{
        this.dialogRef.close();  
      }
    }

    
   
}