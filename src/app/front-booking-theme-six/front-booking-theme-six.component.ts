import { Component, OnInit,ElementRef, ViewChild, ViewChildren, QueryList, Renderer2, Inject} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { environment } from '@environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NgbDateParserFormatter, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatSnackBar} from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';
import { DatePipe, DOCUMENT, JsonPipe } from '@angular/common';
import { AppComponent } from '@app/app.component';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { Meta } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { sha512 as sha512 } from 'js-sha512';


declare const PayUMoneylaunch: any;

@Component({
  selector: 'app-front-booking-theme-six',
  templateUrl: './front-booking-theme-six.component.html',
  styleUrls: ['./front-booking-theme-six.component.scss'],
  providers: [DatePipe]
})
export class FrontBookingThemeSixComponent implements OnInit {

  selectedTheme:any = '1';
  formExistingUser : FormGroup;
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
    netCost:0,
  }
  amountAfterTax:any=0;
  //postalcode :any;
  coupon = {
    couponcode_val: ""
  };
  existing_mail: any;
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
	TooltipLabel = TooltipLabel;
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
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  private payPalConfig?: IPayPalConfig;
  cardForm:FormGroup
  
  serviceDataHours:any=[];
  serviceDataMinutes:any=[];

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
  encodedbusinessId:any;
  businessId:any;
  businessDetail:any;

  postalCodeCondition=false;
  postal_code_status=false;
  customerLoginValue:boolean=false;
  encodedId: any;
  urlString: any;
  cartPopupCloseType:any;

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
    public router: Router,
  ) { 
    if(localStorage.getItem('frontBusiness_id')){
      this.businessId = localStorage.getItem('frontBusiness_id');
    }
   
    meta.addTag({name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'});
    this.renderExternalScript('https://checkout-static.citruspay.com/bolt/run/bolt.min.js').onload = () => {
    }

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

    this.formExistingUser = this._formBuilder.group({
      existing_mail: ['',[Validators.required,Validators.email]],
      existing_password: ['',Validators.required],
    })
    this.cardForm = this._formBuilder.group({
      cardHolderName: ['',[Validators.required]],
      cardNumber: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
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
      newUserSplReq: ['']
    })

    this.formAppointmentInfo = this._formBuilder.group({
    })
  }

  ngOnInit() {
    this.fnGetSettings();
    this.fnIsPostalCodeAdded();
    this.fnGetBusiness();

    if(this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.user_type == "C"){
      this.isLoggedIn=true;
      this.customerName=this.authenticationService.currentUserValue.fullname;
      this.customerFirstname=this.customerName.split(" ")[0];
      this.customerLastname=this.customerName.split(" ")[1];
      this.customerEmail=this.authenticationService.currentUserValue.email;
      this.customerPhone=this.authenticationService.currentUserValue.phone;
      console.log(this.authenticationService.currentUserValue.user_id+" "+this.isLoggedIn);
    }
   // this.formNewUser.controls['newUserPhone'].setValue(this.phone)
    this.fnGetTaxDetails();
    this.fnGetCategories();
    this.fnGetOffDays();
    setTimeout(() => {
      this.selectToday();
    }, 1000);
    
    this.serviceCount.length=0
    this.serviceCartArr.length=0

  }

  // fnConvertMins(minutes){
  //   let serviceTime=minutes;
  //   let RAM = serviceTime%(30*24*60);
  //   let RAD = RAM%(24*60);
  //   let hours= (RAD/60).toString();
  //   this.Hours=(parseInt(hours)).toString();
  //   let RAH = (RAD%(60)).toString();
  //   this.Minutes=(parseInt(RAH)).toString();
  // }

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
    console.log(event);

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
    console.log(event);
      if(event == true){
      this.PrivacyPolicyStatusValue=true;
      this.PrivacyPolicyStatusValidation = false;

      }else if(event == false){
        this.PrivacyPolicyStatusValidation = true;
      this.PrivacyPolicyStatusValue=false;

      }

  }

  fnGetSettings(){
    let requestObject = {
      "business_id" : this.businessId
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log(requestObject);
    this.http.post(`${environment.apiUrl}/get-front-setting`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        console.log(res);
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
        if(response.data == true){
          this.settingsArr=response.response;
          this.currencySymbol = this.settingsArr.currency;
          this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
          this.currencySymbolFormat = this.settingsArr.currency_format;
          if(this.settingsArr.theme){
            this.selectedTheme = this.settingsArr.theme;
            if(this.selectedTheme == '4'){
              this.router.navigate(['/booking-4']);
            }
          }
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
          if(this.termsConditions.status == false){
            this.termsConditionsStatusValue = true;
          }
          console.log(this.termsConditions);

          this.privacyPolicy=JSON.parse(this.settingsArr.privacy_policy)
          if(this.privacyPolicy && this.privacyPolicy.status == false){
            this.PrivacyPolicyStatusValue = true;
          }
          console.log(this.privacyPolicy);

          this.thankYou=JSON.parse(this.settingsArr.thank_you);
          console.log(this.thankYou)
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
          console.log(this.contactFormSettingsArr);

          this.minimumAdvanceBookingTime=JSON.parse(this.settingsArr.min_advance_booking_time);
          this.maximumAdvanceBookingTime=JSON.parse(this.settingsArr.max_advance_booking_time);
          this.minimumAdvanceBookingDateTimeObject = new Date();
          this.minimumAdvanceBookingDateTimeObject.setMinutes( this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime );
          console.log("minimumAdvanceBookingDateTimeObject - "+this.minimumAdvanceBookingDateTimeObject);
          this.minDate = {
            year: this.minimumAdvanceBookingDateTimeObject.getFullYear(),
            month: this.minimumAdvanceBookingDateTimeObject.getMonth() + 1,
            day: this.minimumAdvanceBookingDateTimeObject.getDate()
          };
          this.maximumAdvanceBookingDateTimeObject = new Date();
          this.maximumAdvanceBookingDateTimeObject.setMinutes( this.maximumAdvanceBookingDateTimeObject.getMinutes() + this.maximumAdvanceBookingTime );
          console.log("maximumAdvanceBookingDateTimeObject - "+this.maximumAdvanceBookingDateTimeObject);
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
          
          
        this.initConfig();
        }else{
        }
      },(err) =>{
        console.log(err)
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
            console.log(err)
        });
    }

  // Get Tax details
  fnGetTaxDetails(){
    this.getTaxDetails().subscribe((response:any) => {
      if(response.data == true){
        this.taxArr=response.response
        console.log(this.taxArr);
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
    console.log(JSON.stringify(this.calendar.getToday()));
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
    this.router.navigate(['/login']);
    }
  
  fnViewDashboard(){
    this.router.navigate(['/user/appointments']);
  }
  
  fnNavigateToLogin(){
    this.router.navigate(['/login']);
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
        console.log(err)
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
        // this.validpostalcode = 'invalid';
        // this.postalCodeError = true;
        console.log(err)
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
        console.log(err)
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
      console.log(err)
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
      console.log(JSON.stringify(this.serviceCount));

      this.serviceData.forEach(element => {
        if(element.service_type == 'face_to_face'){
          element.service_type = 'Face To Face';
        }else if(element.service_type == 'online'){
          element.service_type = 'Online';
        }else if(element.service_type == 'phone'){
          element.service_type = 'Phone';
        }
      });
      for(let i=0; i<this.serviceData.length;i++){
        this.serviceDataHours[i]=this.serviceData[i].service_time;
        let RAM = this.serviceDataHours[i]%(30*24*60);
        let RAD = RAM%(24*60);
        let hours= (RAD/60).toString();
        this.serviceDataHours[i]=(parseInt(hours)).toString();
        let RAH = (RAD%(60)).toString();
        this.serviceDataMinutes[i]=(parseInt(RAH)).toString();
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
          this.serviceData[i].appointmentDateForLabel='';
          this.serviceData[i].appointmentTimeSlot='';
          this.serviceData[i].appointmentTimeSlotForLabel='';
          this.serviceData[i].assignedStaff=null;
          this.serviceCount[this.serviceData[i].id]=this.serviceData[i];
        }
        
      }
      this.isLoader=false;
      console.log(JSON.stringify(this.serviceCount));
    }else{
      this.isLoader=false;
    }
  },
    (err) =>{
      this.isLoader=false;
      console.log(err)
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
        console.log(JSON.stringify(this.serviceCount));
        this.serviceData.forEach(element => {
          if(element.service_type == 'face_to_face'){
            element.service_type = 'Face To Face';
          }else if(element.service_type == 'online'){
            element.service_type = 'Online';
          }else if(element.service_type == 'phone'){
            element.service_type = 'Phone';
          }
        });
        for(let i=0; i<this.serviceData.length;i++){
          this.serviceDataHours[i]=this.serviceData[i].service_time;
          let RAM = this.serviceDataHours[i]%(30*24*60);
          let RAD = RAM%(24*60);
          let hours= (RAD/60).toString();
          this.serviceDataHours[i]=(parseInt(hours)).toString();
          let RAH = (RAD%(60)).toString();
          this.serviceDataMinutes[i]=(parseInt(RAH)).toString();
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
        console.log(JSON.stringify(this.serviceCount));
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
      console.log(err)
    })
  }

   fnShowCounter(event,service_id){
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
    //  console.log(element.name+" -- "+element.value);
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
     // console.log(this.serviceCount[service_id].tax);
    });

    // this.serviceData[id].tax=0;
    this.serviceCount[service_id].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;

    // this.serviceCount[service_id].totalCost=1*this.serviceCount[service_id].service_cost;
  //  console.log(JSON.stringify(this.serviceCount));
    if(this.serviceCartArr[service_id] != null){
      this.serviceCartArr[service_id]=this.serviceCount[service_id];
     // console.log(JSON.stringify(this.serviceCartArr));
    }
    this.serviceMainArr.totalNumberServices=0;
    this.serviceMainArr.subtotal=0;
    this.serviceMainArr.discount=0;
    this.taxAmountArr.length=0;
   // console.log(this.taxAmountArr);
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
    this.amountAfterTax=0;
    if(this.serviceMainArr.subtotal > 0){
      this.taxArr.forEach((element) => {
        let taxTemp={
          value:0,
          name:'',
          amount:0
        }
     //   console.log(element.name+" -- "+element.value);
        if(this.taxType == "P"){
         taxTemp.value= element.value;
         taxTemp.name= element.name;
         taxTemp.amount= amountAfterDiscount * element.value/100;
          this.amountAfterTax=this.amountAfterTax+taxTemp.amount;
        }else{
          taxTemp.value= element.value;
          taxTemp.name= element.name;
          taxTemp.amount=  element.value;
          this.amountAfterTax=this.amountAfterTax+taxTemp.amount;
        }
        this.taxAmountArr.push(taxTemp);
      //  console.log(this.taxAmountArr);
      });
    }
    // this.taxAmountArr.forEach((element) => {
    //   amountAfterDiscount=amountAfterDiscount+element;
    // });
    this.serviceMainArr.netCost=amountAfterDiscount+this.amountAfterTax;
    //this.serviceMainArr.netCost=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
    console.log(this.serviceCount[service_id]);
    var co = 0;
    var  Arr_co = 0;
    console.log(this.serviceCartArr)
    this.serviceCartArr.forEach(element => {
      console.log(element.service_sub_type);
      if(element.service_sub_type !== null || element.service_sub_type !== ''){
        if(element.service_sub_type=='at_home'){
          co = co + 1;
        }
        Arr_co = Arr_co + 1;
      }
      
    });;

    if(co > 0){
      console.log('true');
      this.is_at_home_service  = true;
    }else{
      console.log('false');
      this.is_at_home_service  = false;
    }

    //console.log(this.taxAmountArr);
  //  console.log(JSON.stringify(this.serviceMainArr.totalNumberServices+" "+this.serviceMainArr.subtotal+" "+this.serviceMainArr.discount+" "+this.serviceMainArr.netCost));
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
        this.serviceCount[service_id].tax=taxMain;
        console.log(this.serviceCount[service_id].tax);
      });

      // this.serviceData[id].tax=0;
      this.serviceCount[service_id].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;

      // this.serviceCount[service_id].totalCost=this.serviceCount[service_id].count*this.serviceCount[service_id].service_cost;
      console.log(JSON.stringify(this.serviceCount));
      if(this.serviceCartArr[service_id] != null){
        if(this.serviceCount[service_id].count < 1){
          this.serviceCartArr[service_id]=null;
        }else{
          this.serviceCartArr[service_id]=this.serviceCount[service_id]; 
        }
        console.log(JSON.stringify(this.serviceCartArr));
      }
      this.serviceMainArr.totalNumberServices=0;
      this.serviceMainArr.subtotal=0;
      this.serviceMainArr.discount=0;
      this.taxAmountArr.length=0;
      console.log(this.taxAmountArr);
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
      // this.taxAmountArr.forEach((element) => {
      //   amountAfterDiscount=amountAfterDiscount+element;
      // });
      this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
      //this.serviceMainArr.netCost=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      console.log(this.taxAmountArr);
      console.log(JSON.stringify(this.serviceMainArr.totalNumberServices+" "+this.serviceMainArr.subtotal+" "+this.serviceMainArr.discount+" "+this.serviceMainArr.netCost));
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
        this.serviceCount[service_id].tax=taxMain;
        console.log(this.serviceCount[service_id].tax);
      });

      // this.serviceData[id].tax=0;
      this.serviceCount[service_id].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;

      // this.serviceCount[service_id].totalCost=this.serviceCount[service_id].count*this.serviceCount[service_id].service_cost;
      console.log(JSON.stringify(this.serviceCount));
      if(this.serviceCartArr[service_id] != null){
        this.serviceCartArr[service_id]=this.serviceCount[service_id];
        console.log(JSON.stringify(this.serviceCartArr));
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
            console.log(element.name+" ---- "+element.value);
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
            console.log(this.serviceCartArr[i].tax);
          });

          this.serviceCartArr[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;

          console.log(JSON.stringify(this.serviceCartArr[i]));
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
        }
      }
      console.log(JSON.stringify(this.serviceCartArr));
      

      this.serviceMainArr.totalNumberServices=0;
      this.serviceMainArr.subtotal=0;
      this.serviceMainArr.discount=0;
      this.taxAmountArr.length=0;
      console.log(this.taxAmountArr);
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
      // this.taxAmountArr.forEach((element) => {
      //   amountAfterDiscount=amountAfterDiscount+element;
      // });
      this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
      //this.serviceMainArr.netCost=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      console.log(this.taxAmountArr);
      console.log(JSON.stringify(this.serviceMainArr.totalNumberServices+" "+this.serviceMainArr.subtotal+" "+this.serviceMainArr.discount+" "+this.serviceMainArr.netCost));
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
        console.log(err)
      })
    }

  fnShowCalender(serviceId){
    this.selectDataTimePopup(serviceId)
    // this.currentSelectedService=serviceId;
    // if(this.serviceCartArr[this.currentSelectedService] && this.serviceCartArr[this.currentSelectedService].appointmentDate != ''){
    //   let year=this.serviceCartArr[this.currentSelectedService].appointmentDate.split("-")[0];
    //   let month= this.serviceCartArr[this.currentSelectedService].appointmentDate.split("-")[1];
    //   let day=this.serviceCartArr[this.currentSelectedService].appointmentDate.split("-")[2];
    //   console.log(year+"--"+month+"--"+day);
    //   let dateTemp={"year":parseInt(year),"month":parseInt(month),"day":parseInt(day)};
    //   console.log(JSON.stringify(dateTemp));
    //   this.model=dateTemp;
    //   this.selecteddate=this.serviceCartArr[this.currentSelectedService].appointmentDate
    //   this.selecteddateForLabel=this.datePipe.transform(new Date(this.serviceCartArr[this.currentSelectedService].appointmentDate),"EEE, MMM dd");

    //   this.fnGetTimeSlots();
    // }else{
    //   this.fnSelectNextValidDate(this.minimumAdvanceBookingDateTimeObject);
    // }
    // this.serviceselection = false;
    // this.dateselection = true;
  }
  
  fnSelectNextValidDate(mydate){
    
    if(mydate=="" || mydate==undefined){
      console.log('appointment Date not availbled');
      return false;
    }
    
    if(this.offDaysList.indexOf(this.datePipe.transform(new Date(mydate),"yyyy-MM-dd"))>-1){
      mydate.setDate(mydate.getDate() + 1)
      console.log(mydate);
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
      console.log(day);
      if(this.workingHoursOffDaysList.indexOf(dayId)>-1){
        mydate.setDate(mydate.getDate() + 1)
        console.log(mydate);
        this.fnSelectNextValidDate(mydate);
      }else{
        this.selecteddate=this.datePipe.transform(new Date(mydate),"yyyy-MM-dd");
        let year=this.selecteddate.split("-")[0];
        let month= this.selecteddate.split("-")[1];
        let day=this.selecteddate.split("-")[2];
        console.log(year+"--"+month+"--"+day);
        let dateTemp={"year":parseInt(year),"month":parseInt(month),"day":parseInt(day)};
        console.log(JSON.stringify(dateTemp));
        this.model=dateTemp;
        this.selecteddateForLabel= this.datePipe.transform(new Date(mydate),"EEE, MMM dd");
        console.log(mydate);
        console.log(this.selecteddate);
        console.log(this.selecteddateForLabel);
        this.fnGetTimeSlots();
      }
    }
  }
  // services
  fnServiceSelection(event){
    if(this.isLoggedIn){
      this.serviceselection = false;
      this.appointmentinfo = true;
      this.showSameAsAboveCheck=false;
    }else{
      this.serviceselection = false;
      this.personalinfo = true;
      this.showSameAsAboveCheck=true;
    }
   }

  onDateSelect(event){
    this.selecteddate = event.year+'-'+event.month+'-'+event.day;
    this.selecteddate=this.datePipe.transform(new Date(this.selecteddate),"yyyy-MM-dd")
    this.selecteddateForLabel=this.datePipe.transform(new Date(this.selecteddate),"EEE, MMM dd")
    this.fnGetTimeSlots();
  }
  // date time 
  fnDatetimeSelection(){
    var co = 0;
    var  Arr_co = 0;
    this.serviceCartArr.forEach(element => {
      console.log(element.service_sub_type);
      if(element.service_sub_type !== null){
        if(element.service_sub_type=='at_home'){
          co = co + 1;
        }
        Arr_co = Arr_co + 1;
      }
   });;

   if(co > 0){
     console.log('true');
    this.is_at_home_service  = true;
   }else{
    console.log('false');
    this.is_at_home_service  = false;
   }
 
 
 
    if(this.isLoggedIn){
      if(this.is_at_home_service){
        this.serviceselection = false;
        this.appointmentinfo = true;
        this.showSameAsAboveCheck=false;
      }else{
        this.serviceselection = false;
        this.appointmentinfo = false;
        this.showSameAsAboveCheck=false;
        this.summaryScreen=true;
      }
    }else{
      if(this.is_at_home_service){
        if(this.newuser){
          this.serviceselection = false;
          this.personalinfo=true;
          this.appointmentinfo = true;
          this.showSameAsAboveCheck=true;
        }else if(this.existinguser){
          this.serviceselection = false;
          this.personalinfo=true;
          this.appointmentinfo = false;
          this.showSameAsAboveCheck=false;
        }
      }else{
        
        this.serviceselection = false;
        this.personalinfo=true;
        this.appointmentinfo = false;
        this.showSameAsAboveCheck=false;
        this.summaryScreen=false;
      }
    }
  }

  fnGetTimeSlots(){
    this.isLoader=true;
    let requestObject = {
      "business_id": this.businessId,
      "selected_date":this.selecteddate
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
        //console.log("minimumAdvanceBookingDateTimeObject - "+this.minimumAdvanceBookingDateTimeObject);
        response.response.forEach(element => {
          //console.log((new Date(this.datePipe.transform(this.selecteddate,"yyyy-MM-dd")+" "+element+":00"))+"----"+(this.minimumAdvanceBookingDateTimeObject));
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
        console.log(this.timeSlotArr);
        console.log(this.timeSlotArrForLabel)
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
        console.log(err)
      })
  }
 
  fnSelectTimeSlot(timeSlot,index){
    this.selectedTimeSlot=timeSlot;
    console.log(this.selectedTimeSlot);
    // console.log(this.selectedTimeSlot)
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
          console.log(JSON.stringify(this.availableStaff));
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
        console.log(err)
      })
  }
  
  closePopover() {
    this.trigger.toArray()[0].togglePopover();
  }
  fnOpenCartbox(){
    // console.log("outer"+this.cartOpened);
    // if(this.cartOpened==true){
    //   this.cartOpened=false;
    //   console.log("1"+this.cartOpened);
    // }else{
    //   this.cartOpened=true;
    //   console.log("2"+this.cartOpened);
    // }
    
  }
  
  fnSelectStaff(staff_id,index){
    this.isLoader=true;
    if(this.selectedTheme !== '2'){
      //this.trigger.toArray()[index].togglePopover();
      this.serviceCount[this.currentSelectedService].appointmentDateForLabel=this.datePipe.transform(new Date(this.selecteddate),"MMM dd, yyyy");
    }
    this.serviceCount[this.currentSelectedService].appointmentDate=this.selecteddate;
    this.serviceCount[this.currentSelectedService].appointmentDateForLabel=this.datePipe.transform(new Date(this.selecteddate),"MMMM dd, yyyy");
    this.serviceCount[this.currentSelectedService].assignedStaff=staff_id;
    this.serviceCount[this.currentSelectedService].appointmentTimeSlot=this.selectedTimeSlot;
    this.serviceCount[this.currentSelectedService].appointmentTimeSlotForLabel=this.datePipe.transform(new Date(this.selecteddate+" "+this.selectedTimeSlot),"hh:mm a");
    this.serviceCartArr[this.currentSelectedService]=this.serviceCount[this.currentSelectedService]
    //console.log(JSON.stringify(this.selecteddate));
    //console.log(JSON.stringify(this.serviceCartArr[this.currentSelectedService])); 
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
    this.amountAfterTax=0;
    if(this.serviceMainArr.subtotal > 0){
      this.taxArr.forEach((element) => {
        // console.log(element.name+" -- "+element.value);
        // if(this.taxType == "P"){
        //   this.taxAmountArr[element.name]= amountAfterDiscount * element.value/100;
        //   amountAfterTax=amountAfterTax+this.taxAmountArr[element.name];
        // }else{
        //   this.taxAmountArr[element.name]=  element.value;
        //   amountAfterTax=amountAfterTax+this.taxAmountArr[element.name];
        // }
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
         this.amountAfterTax=this.amountAfterTax+taxTemp.amount;
        }else{
          taxTemp.value= element.value;
          taxTemp.name= element.name;
          taxTemp.amount=  element.value;
          this.amountAfterTax=this.amountAfterTax+taxTemp.amount;
        }
        this.taxAmountArr.push(taxTemp);
        console.log(this.taxAmountArr);
        
      });
      
      console.log(this.amountAfterTax)
      console.log(this.serviceMainArr)
    }
    // this.taxAmountArr.forEach((element) => {
    //   amountAfterDiscount=amountAfterDiscount+element;
    // });
    this.serviceMainArr.netCost=amountAfterDiscount+this.amountAfterTax;
    //this.serviceMainArr.netCost=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
    console.log(this.taxAmountArr);
    console.log(JSON.stringify(this.serviceMainArr.totalNumberServices+" "+this.serviceMainArr.subtotal+" "+this.serviceMainArr.discount+" "+this.serviceMainArr.netCost));
    this.isLoader=false;
    this.fnDatetimeSelection()
  }
  

  fnUserType(event,usertype){
    if(usertype == "existing"){
      this.existinguser = true;
      this.newuser = false;
      if(!this.isLoggedIn && this.is_at_home_service){
        this.appointmentinfo = false;
      }else if(this.isLoggedIn && this.is_at_home_service){
        this.appointmentinfo = true;
        this.showSameAsAboveCheck = false;
      }else if(this.isLoggedIn && !this.is_at_home_service){
        this.appointmentinfo = false;
      }
    }else{
      this.newuser = true;
      this.existinguser = false;
      if(!this.isLoggedIn && this.is_at_home_service){
        this.appointmentinfo = true;
        this.showSameAsAboveCheck = true;
      }else if(this.isLoggedIn && this.is_at_home_service){
        this.appointmentinfo = true;
        this.showSameAsAboveCheck = false;
      }else if(this.isLoggedIn && !this.is_at_home_service){
        this.appointmentinfo = false;
      }
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
      "password" : this.formExistingUser.get('existing_password').value
      };
   this.fnLogin(requestObject,false);
  }

  fnLogin(requestObject,isAfterSignup){
    
   let headers = new HttpHeaders({
     'Content-Type': 'application/json',
   });

   this.http.post(`${environment.apiUrl}/user-login`,requestObject,{headers:headers} ).pipe(
     map((res) => {
       return res;
     }),
     catchError(this.handleError)).subscribe((response:any) => {
      if(response.data == true ){
        // localStorage.setItem("userId",response.response.user_id);
        // localStorage.setItem("tokenID",response.response.id);
        // localStorage.setItem("userToken",response.response.token);
        // localStorage.setItem("userName",response.response.fullname);
        // localStorage.setItem("userRole",response.response.user_type);
        // localStorage.setItem("billing_address",response.response.address);
        // localStorage.setItem("billing_state",response.response.state);
        // localStorage.setItem("billing_city",response.response.city);
        // localStorage.setItem("billing_zipcode",response.response.zip);
        localStorage.setItem('currentUser', JSON.stringify(response.response));
        localStorage.setItem('isFront', "true");
        this.authenticationService.currentUserSubject.next(response.response);

     //   console.log(this.authenticationService.currentUserValue.fullname);
        console.log(response.response.fullname);

        this.customerName=response.response.fullname;
      
        this.customerFirstname = this.customerName!=undefined?this.customerName.split(" ")[0]:'';
        this.customerLastname  =  this.customerName!=undefined?this.customerName.split(" ")[1]:'';

        this.customerEmail=this.authenticationService.currentUserValue.email;
        this.customerPhone=this.authenticationService.currentUserValue.phone;
      
        if(!isAfterSignup){
          // this.formAppointmentInfo.controls['appo_address'].setValue(response.response.address);
          // this.formAppointmentInfo.controls['appo_state'].setValue(response.response.state);
          // this.formAppointmentInfo.controls['appo_city'].setValue(response.response.city);
          // this.formAppointmentInfo.controls['appo_zipcode'].setValue(response.response.zip);
          this.showSameAsAboveCheck=false;
          this.snackBar.open("Login successfull", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['green-snackbar']
            });
        }
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
          "password" : this.formNewUser.get('newUserPassword').value
          };
        this.fnLogin(requestObject2,true);
      }else{
        this.personalinfo = true;
      }
    },
    (err) =>{
      this.personalinfo = true;
      console.log(err)
    })
  }

  fnsameasabove(event){
    console.log(event.srcElement.checked)
    if(event.srcElement.checked == true){
      
    console.log(event);
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
      

      // this.appo_address_info.appo_address = this.formNewUser.get('newUserAddress').value;
      // this.appo_address_info.appo_state = this.formNewUser.get('newUserState').value;
      // this.appo_address_info.appo_city = this.formNewUser.get('newUserCity').value;
      // this.appo_address_info.appo_zipcode = this.formNewUser.get('newUserZipcode').value;
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

    console.log(event.srcElement.checked)

    if(event.srcElement.checked == true){
      
      this.formAppointmentInfo.controls['appo_address'].setValue(this.authenticationService.currentUserValue.address);
      this.formAppointmentInfo.controls['appo_state'].setValue(this.authenticationService.currentUserValue.state);
      this.formAppointmentInfo.controls['appo_city'].setValue(this.authenticationService.currentUserValue.city);
      this.formAppointmentInfo.controls['appo_zipcode'].setValue(this.authenticationService.currentUserValue.zip);

      // this.appo_address_info.appo_address = this.formNewUser.get('newUserAddress').value;
      // this.appo_address_info.appo_state = this.formNewUser.get('newUserState').value;
      // this.appo_address_info.appo_city = this.formNewUser.get('newUserCity').value;
      // this.appo_address_info.appo_zipcode = this.formNewUser.get('newUserZipcode').value;
    }else{

      this.formAppointmentInfo.controls['appo_address'].setValue('');
      this.formAppointmentInfo.controls['appo_state'].setValue('');
      this.formAppointmentInfo.controls['appo_city'].setValue('');
      this.formAppointmentInfo.controls['appo_zipcode'].setValue('');

      // this.appo_address_info.appo_address = "";
      // this.appo_address_info.appo_state = "";
      // this.appo_address_info.appo_city = "";
      // this.appo_address_info.appo_zipcode = "";
    }
  } 
  
  fnappointmentinfo(){

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
      // this.serviceMainArr.discount=0;
      // this.taxAmountArr.length=0;

      console.log(this.serviceCartArr);
      this.taxAmountArr.length=0;
              
      this.serviceMainArr.totalNumberServices=0;
      this.serviceMainArr.subtotal=0;
      this.serviceMainArr.discount=0;
      this.taxAmountArr.length=0;
      console.log(this.taxAmountArr);
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
            console.log(element.name+" ---- "+element.value);
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
            console.log(this.serviceCartArr[i].tax);
          });

          this.serviceCartArr[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;

          console.log(JSON.stringify(this.serviceCartArr[i]));
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
        }
      }
      console.log(JSON.stringify(this.serviceCartArr));
      this.serviceMainArr.discount_type = null;
      this.serviceMainArr.discount_value = null;
      this.serviceMainArr.discount=0;

      var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      this.amountAfterTax=0;
      if(this.serviceMainArr.subtotal > 0){
        this.taxArr.forEach((element) => {
          // console.log(element.name+" -- "+element.value);
          // if(this.taxType == "P"){
          //   this.taxAmountArr[element.name]= amountAfterDiscount * element.value/100;
          //   amountAfterTax=amountAfterTax+this.taxAmountArr[element.name];
          // }else{
          //   this.taxAmountArr[element.name]=  element.value;
          //   amountAfterTax=amountAfterTax+this.taxAmountArr[element.name];
          // }
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
           this.amountAfterTax=this.amountAfterTax+taxTemp.amount;
          }else{
            taxTemp.value= element.value;
            taxTemp.name= element.name;
            taxTemp.amount=  element.value;
            this.amountAfterTax=this.amountAfterTax+taxTemp.amount;
          }
          this.taxAmountArr.push(taxTemp);
          console.log(this.taxAmountArr);
        });
      }
      // this.taxAmountArr.forEach((element) => {
      //   amountAfterDiscount=amountAfterDiscount+element;
      // });
      this.serviceMainArr.netCost=amountAfterDiscount+this.amountAfterTax;
      //this.serviceMainArr.netCost=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      console.log(this.taxAmountArr);
      console.log(JSON.stringify(this.serviceMainArr.totalNumberServices+" "+this.serviceMainArr.subtotal+" "+this.serviceMainArr.discount+" "+this.serviceMainArr.netCost));

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
      console.log(allServiceIdsArr);

      let requestObject = {
      "business_id" : this.businessId,
      "service_id" : allServiceIds,
      "coupon_code" : this.coupon.couponcode_val,
      };
      console.log(JSON.stringify(requestObject))
      
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
        
        console.log(this.serviceCartArr);
        this.taxAmountArr.length=0;
                
        this.serviceMainArr.totalNumberServices=0;
        this.serviceMainArr.subtotal=0;
        this.serviceMainArr.discount=0;
        this.taxAmountArr.length=0;
        console.log(this.taxAmountArr);
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
              console.log(element.name+" ---- "+element.value);
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
              console.log(this.serviceCartArr[i].tax);
            });

            this.serviceCartArr[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;

            console.log(JSON.stringify(this.serviceCartArr[i]));
            this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
            this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].subtotal;
          }
        }
        console.log(JSON.stringify(this.serviceCartArr));
        this.serviceMainArr.discount_type = couponType;
        this.serviceMainArr.discount_value = parseInt(couponValue);
        if(couponType == 'P'){
          this.serviceMainArr.discount = (this.serviceMainArr.subtotal*parseInt(couponValue))/100;
        }else{
          this.serviceMainArr.discount = parseInt(couponValue);
        }

        var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
        this.amountAfterTax=0;
        if(this.serviceMainArr.subtotal > 0){
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
              this.amountAfterTax=this.amountAfterTax+taxTemp.amount;
            }else{
              taxTemp.value= element.value;
              taxTemp.name= element.name;
              taxTemp.amount=  element.value;
              this.amountAfterTax=this.amountAfterTax+taxTemp.amount;
            }
            this.taxAmountArr.push(taxTemp);
            console.log(this.taxAmountArr);
          });
        }
        this.serviceMainArr.netCost=amountAfterDiscount+this.amountAfterTax;
        console.log(this.taxAmountArr);
        console.log(JSON.stringify(this.serviceMainArr.totalNumberServices+" "+this.serviceMainArr.subtotal+" "+this.serviceMainArr.discount+" "+this.serviceMainArr.netCost));

        this.coupon.couponcode_val=response.response.coupon_code;
        this.couponIcon="close";
        this.closecoupon = 'valid';
        this.isReadOnly="readonly";
        this.showCouponError=false;
        this.couponErrorMessage="";
        //console.log(JSON.stringify(this.serviceMainArr.totalNumberServices+" "+this.serviceMainArr.subtotal+" "+this.serviceMainArr.discount+" "+this.taxAmountArr+" "+this.serviceMainArr.netCost));
      }
      else{
        this.closecoupon = 'invalid';
        this.couponIcon="check";
        this.isReadOnly="";
        this.showCouponError=true;
        this.couponErrorMessage=response.response;
        console.log(JSON.stringify(this.serviceMainArr.totalNumberServices+" "+this.serviceMainArr.subtotal+" "+this.serviceMainArr.discount+" "+this.serviceMainArr.netCost));
      }
      },
      (err) =>{
        this.closecoupon = 'invalid';
        this.couponIcon="check";
        this.isReadOnly="";
        this.showCouponError=false;
        this.couponErrorMessage="";
        console.log(err)
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
    this.dateselection = false;
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
    console.log(paymentMethod);
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
      // this.dateselection = false;
      // this.catselection=false;
      // this.subcatselection=false;
      // this.dateselection=false;
      // this.serviceselection=false;
      // this.personalinfo=false;
      // this.summaryScreen=false;
      // this.paymentScreen=false;
      // this.appointmentinfo = true;
      // this.showSameAsAboveCheck=false;
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
          console.log(response.response);
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

  private initConfig(): void {
      this.payPalConfig = {
      currency: this.currencySymbol,
      clientId: this.paypalClientId,
      //clientId: 'AXQW9QFCurkFtIGNbnex8fp8oanZWUZFVhEmwU4GK39xbOzqetPmQj8wnju2U7yOvn9xBBojoqGsIWSh',
      // clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: this.reference_id,
            amount: {
              currency_code: this.currencySymbol,
              value: JSON.stringify(this.serviceMainArr.netCost),
              breakdown: {
                item_total: {
                  currency_code: this.currencySymbol,
                  value: JSON.stringify(this.serviceMainArr.subtotal)
                },
                tax_total : {
                  currency_code: this.currencySymbol,
                  value: JSON.stringify(this.taxAmount)
                },
                discount : {
                  currency_code: this.currencySymbol,
                  value: JSON.stringify(this.serviceMainArr.discount)
                }
              }
            },
            items: this.itemArr,
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
          this.fnAppointmentBooking();
        }
        //this.fnAppointmentBooking();
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.snackBar.open("Transaction Cancelled", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
        });
      },
      onError: err => {
        console.log('OnError', err);
        this.snackBar.open("Error: "+err, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
        });
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
  
    };
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
    let requestObject = {
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
      "booking_notes" : this.formNewUser.get('newUserSplReq').value ? this.formNewUser.get('newUserSplReq').value : null,
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
      'fullname' : JSON.parse(localStorage.getItem('currentUser')).fullname,
      'full_name' : JSON.parse(localStorage.getItem('currentUser')).fullname
    };
     
      
      // setTimeout(()=>{
      //   this.isLoader=false;
      // },4000)
      // return false;
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
          if(this.thankYou.status == 'true'){
            window.top.location.href = this.thankYou.page_link;
          }else if(this.thankYou.status == 'false'){
            this.thankYouScreen=true;
            this.paymentScreen=false;
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }else{
          console.log(response.response);
        }
      },(err) =>{
        
      })
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
              this.fnAppointmentBooking();
              console.log("SUCCESS");
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
          console.log(BOLT);
          // the code you use to handle the integration errors goes here
        }
      }
      PayUMoneylaunch(RequestData,Handler);
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
   
  selectDataTimePopup(serviceId) {
    this.currentSelectedService = serviceId;
    if(this.serviceCartArr[this.currentSelectedService] && this.serviceCartArr[this.currentSelectedService].appointmentDate != ''){
      let year=this.serviceCartArr[this.currentSelectedService].appointmentDate.split("-")[0];
      let month= this.serviceCartArr[this.currentSelectedService].appointmentDate.split("-")[1];
      let day=this.serviceCartArr[this.currentSelectedService].appointmentDate.split("-")[2];
      console.log(year+"--"+month+"--"+day);
      let dateTemp={"year":parseInt(year),"month":parseInt(month),"day":parseInt(day)};
      console.log(JSON.stringify(dateTemp));
      this.model=dateTemp;
      this.selecteddate=this.serviceCartArr[this.currentSelectedService].appointmentDate
      this.selecteddateForLabel=this.datePipe.transform(new Date(this.serviceCartArr[this.currentSelectedService].appointmentDate),"EEE, MMM dd");
      this.fnGetTimeSlots();
      this.directAPI = 'gettimeslote';
    }else{
      this.fnSelectNextValidDate(this.minimumAdvanceBookingDateTimeObject);
      //this.fnGetTimeSlots();
      this.directAPI = 'selectnextvalidate';
    }
    setTimeout(() => {
      const dialogRef = this.dialog.open(theme6DateTimeSelection, {
        width: '800px',
         data: {
                settingsArr : this.settingsArr,
                businessId: this.businessId,
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
        }
        this.sizeServiceCartArr = 0
        this.serviceCartArr.forEach(element => {
          this.sizeServiceCartArr = this.sizeServiceCartArr+1
        });
      });
      
    }, 500
    
    );
     
      
    
    
  }
}




@Component({
  selector: 'theme-2-cart-popup',
  templateUrl: '../_dialogs/theme-2-select-datetime.html',
  providers: [DatePipe]
})
export class theme6DateTimeSelection {
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
    public dialogRef: MatDialogRef<theme6DateTimeSelection>,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private calendar: NgbCalendar,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private authenticationService:AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
      this.businessId = this.data.businessId;
      this.settingsArr = this.data.settingsArr
      this.bookingPostalcode = this.data.bookingPostalcode
      this.currentSelectedService = this.data.currentSelectedService
      this.model = this.data.model
      this.selecteddate = this.data.selecteddate
      this.selecteddateForLabel = this.data.selecteddateForLabel
      this.directAPI = this.data.directAPI;
      this.timeSlotArr = this.data.timeSlotArr;
      console.log(this.timeSlotArr)
      var i=0;
      this.timeSlotArr.forEach( (element) => {
        var dateTemp=this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element+":00";
         this.timeSlotArrForLabel[i]= this.datePipe.transform(new Date(dateTemp),"hh:mm a");
         i++;
      });
      console.log(this.timeSlotArrForLabel)
      if(this.directAPI == 'gettimeslote'){
        this.fnGetTimeSlots();
      }else if(this.directAPI == 'selectnextvalidate'){
        this.fnSelectNextValidDate(this.minimumAdvanceBookingDateTimeObject);
      }
      this.minimumAdvanceBookingTime=JSON.parse(this.settingsArr.min_advance_booking_time);
          this.maximumAdvanceBookingTime=JSON.parse(this.settingsArr.max_advance_booking_time);
          this.minimumAdvanceBookingDateTimeObject = new Date();
          this.minimumAdvanceBookingDateTimeObject.setMinutes( this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime );
          console.log("minimumAdvanceBookingDateTimeObject - "+this.minimumAdvanceBookingDateTimeObject);
          this.minDate = {
            year: this.minimumAdvanceBookingDateTimeObject.getFullYear(),
            month: this.minimumAdvanceBookingDateTimeObject.getMonth() + 1,
            day: this.minimumAdvanceBookingDateTimeObject.getDate()
          };
          this.maximumAdvanceBookingDateTimeObject = new Date();
          this.maximumAdvanceBookingDateTimeObject.setMinutes( this.maximumAdvanceBookingDateTimeObject.getMinutes() + this.maximumAdvanceBookingTime );
          console.log("maximumAdvanceBookingDateTimeObject - "+this.maximumAdvanceBookingDateTimeObject);
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
      console.log(JSON.stringify(this.calendar.getToday()));
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
          console.log(err)
        })
      }

      onDateSelect(event){
        this.selecteddate = event.year+'-'+event.month+'-'+event.day;
        this.selecteddate=this.datePipe.transform(new Date(this.selecteddate),"yyyy-MM-dd")
        this.selecteddateForLabel=this.datePipe.transform(new Date(this.selecteddate),"EEE, MMM dd")
        this.fnGetTimeSlots();
      }
    
      fnGetTimeSlots(){
        this.isLoader=true;
        let requestObject = {
          "business_id": this.businessId,
          "selected_date":this.selecteddate
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
            //console.log("minimumAdvanceBookingDateTimeObject - "+this.minimumAdvanceBookingDateTimeObject);
            response.response.forEach(element => {
              //console.log((new Date(this.datePipe.transform(this.selecteddate,"yyyy-MM-dd")+" "+element+":00"))+"----"+(this.minimumAdvanceBookingDateTimeObject));
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
            console.log(this.timeSlotArr);
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
            console.log(err)
          })
      }
     
      fnSelectTimeSlot(timeSlot,index){
        this.selectedTimeSlot=timeSlot;
        console.log(this.selectedTimeSlot);
        // console.log(this.selectedTimeSlot)
        // this.availableStaff.length=0;
        // this.isStaffAvailable = false;
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
              console.log(JSON.stringify(this.availableStaff));
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
            console.log(err)
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
        console.log(day);
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
