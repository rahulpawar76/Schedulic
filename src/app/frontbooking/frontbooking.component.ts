import { Component, OnInit,ElementRef, ViewChild, ViewChildren, QueryList} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { environment } from '@environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NgbDateParserFormatter, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatSnackBar} from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';
import { DatePipe} from '@angular/common';

@Component({
  selector: 'app-frontbooking',
  templateUrl: './frontbooking.component.html',
  styleUrls: ['./frontbooking.component.scss'],
  providers: [DatePipe]
})
export class FrontbookingComponent implements OnInit {
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
  
  // checkpostalcode = true;
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
  checked = false;
  minVal=1;
  catdata :[];
  subcatdata :[];
  serviceData:any= [];
  selectedsubcategory = "";
  selectedcategory = "";
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
    discount:0,
    netCost:0
  }
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
  PrivacyPolicyStatusValue:boolean = false;
  
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
  //@ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;
  emailFormat = "/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/"
  onlynumeric = /^-?(0|[1-9]\d*)?$/

  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private calendar: NgbCalendar,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe
    
  ) { 
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

    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    
    this.formNewUser = this._formBuilder.group({
      newUserEmail: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)],
      this.isEmailUnique.bind(this)],
      newUserPassword: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(8)]],
      newUserFullname: ['',Validators.required],
      newUserPhone: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
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
    if(this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.user_type == "C"){
      this.isLoggedIn=true;
      this.customerName=this.authenticationService.currentUserValue.fullname;
      console.log(this.authenticationService.currentUserValue.user_id+" "+this.isLoggedIn);
    }
    this.fnGetSettings();
    this.fnGetTaxDetails();

    this.fnGetCategories();
    this.fnGetOffDays();
    setTimeout(() => {
      this.selectToday();
    }, 1000);
    
    this.serviceCount.length=0
    this.serviceCartArr.length=0
  }


  fnChangeTermsConditionsStatus(event){
    console.log(event);

    if(event== true){
      this.termsConditionsStatusValue=true;
    }
    else if(event==false){
      this.termsConditionsStatusValue=false;
    }
    
   

  }

  fnChangePrivacyPolicyStatus(event){
    console.log(event);
      if(event == true){
      this.PrivacyPolicyStatusValue=true;

      }else if(event == false){

      this.PrivacyPolicyStatusValue=false;

      }

  }

  fnGetSettings(){
    let requestObject = {
      "business_id" : 2
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
        console.log(this.settingsArr);

        this.currencySymbol = this.settingsArr.currency;
        console.log(this.currencySymbol);
        
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        console.log(this.currencySymbolPosition);
        
        this.currencySymbolFormat = this.settingsArr.currency_format;
        console.log(this.currencySymbolFormat);

        this.termsConditions = JSON.parse(this.settingsArr.terms_condition);
        if(this.termsConditions.status == 'false'){
          this.termsConditionsStatusValue = true;
        }
        console.log(this.termsConditions);

        this.privacyPolicy=JSON.parse(this.settingsArr.privacy_policy)
        if(this.privacyPolicy.status == 'false'){
          this.PrivacyPolicyStatusValue = true;
        }
        console.log(this.privacyPolicy);

        this.contactFormSettingsArr=JSON.parse(this.settingsArr.form_settings)
        if(this.contactFormSettingsArr.contact_field_status == true){
          if(this.contactFormSettingsArr.addressField.status == 1){
            if(this.contactFormSettingsArr.addressField.required == 1){
              const validators = [Validators.required];
              const validatorsZipCode = [Validators.required,Validators.pattern(this.onlynumeric)];
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
          const validatorsZipCode = [Validators.required,Validators.pattern(this.onlynumeric)];
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
      }else{
      }
      },
      (err) =>{
        console.log(err)
      })
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
      'business_id': 2,
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
  
  //isDisabled(date: NgbDateStruct) {
    //const d = new Date(date.year, date.month - 1, date.day);

    //if you want to disable week
    // return d.getDay() == 5

    //if you want to disable particular day for every month
    // return date.day==13

    //if you want to disable particular month
    // return date.month - 1 ==0

    //if you want to disable particular day for particular month
    // date.month + 1 ==0 && date.day==1 || date.month + 1 ==0 && date.day==2;
    //return date.month && date.day==13 || date.month + 1  && date.day==13 || date.month + 2  && date.day==13;
    // let temp:any;
    // let temp2:any;
    // temp=date.month==2 && date.day==13;
    // temp+=temp2 || date.month==4 && date.day==13;
    // temp+=temp2 || date.month==3 && date.day==13;
    //return date.month==4 && date.day==13 || date.month==3 && date.day==13;
  //   return temp;
  // }

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
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isFront");
    localStorage.clear();
    this.authenticationService.currentUserSubject.next(null);
    window.location.reload();
  }

  // postal code
  fnChangePostalCode(event){
    this.validpostalcode = 'default';
    this.booking.postalcode = "";
  }

  fnCheckPostalCode(event){
    var postalcode_val =  this.booking.postalcode;
    if(postalcode_val.length == 6){
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
      "business_id" : 2,
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

  fnGetCategories(){
    this.isLoader=true;
    let requestObject = {
      "business_id":2,
      "status":"E"
      };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'mode': 'no-cors'
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
    if(this.booking.postalcode == ''){
      this.validpostalcode = 'invalid';
      return false;
    }
    if(this.validpostalcode == 'invalid'){
      return false;
    }
    
    this.subcatdata=[];
    this.catselection = false;
    this.subcatselection = true;
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
        this.isLoader=false;
        this.subcatdata = response.response;
      }else{
        this.isLoader=false;

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
      for(let i=0; i<this.serviceData.length;i++){
        if(this.serviceCount[this.serviceData[i].id] == null){
          this.serviceData[i].count=0;
          this.serviceData[i].totalCost=0;
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

   fnShowCounter(event,service_id){
    this.currentSelectedService=service_id;
    this.serviceCount[service_id].count=1;
    this.serviceCount[service_id].totalCost=1*this.serviceCount[service_id].service_cost;
    console.log(JSON.stringify(this.serviceCount));
    if(this.serviceCartArr[service_id] != null){
      this.serviceCartArr[service_id]=this.serviceCount[service_id];
      console.log(JSON.stringify(this.serviceCartArr));
    }
    this.serviceMainArr.totalNumberServices=0;
    this.serviceMainArr.subtotal=0;
    this.serviceMainArr.discount=0;
    this.taxAmountArr.length=0;
    console.log(this.taxAmountArr);
    this.serviceMainArr.netCost=0;
    this.fncheckavailcoupon('valid');
    for(let i=0; i< this.serviceCartArr.length; i++){
      if(this.serviceCartArr[i] != null){
        this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
        this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].totalCost;
      }
    }
    var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
    var amountAfterTax=0;
    if(this.serviceMainArr.subtotal > 0){
      this.taxArr.forEach((element) => {
        let taxTemp={
          name:'',
          amount:0
        }
        console.log(element.name+" -- "+element.value);
        if(this.taxType == "P"){
         taxTemp.name= element.name;
         taxTemp.amount= amountAfterDiscount * element.value/100;
          amountAfterTax=amountAfterTax+taxTemp.amount;
        }else{
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

  fnRemove(event,service_id){
    if(this.serviceCount[service_id].count >= 1){
      this.currentSelectedService=service_id;
      this.serviceCount[service_id].count=this.serviceCount[service_id].count-1
      this.serviceCount[service_id].totalCost=this.serviceCount[service_id].count*this.serviceCount[service_id].service_cost;
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
      this.fncheckavailcoupon('valid');
      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].totalCost;
        }
      }
      var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      var amountAfterTax=0;
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
            name:'',
            amount:0
          }
          console.log(element.name+" -- "+element.value);
          if(this.taxType == "P"){
           taxTemp.name= element.name;
           taxTemp.amount= amountAfterDiscount * element.value/100;
            amountAfterTax=amountAfterTax+taxTemp.amount;
          }else{
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
      this.serviceCount[service_id].totalCost=this.serviceCount[service_id].count*this.serviceCount[service_id].service_cost;
      console.log(JSON.stringify(this.serviceCount));
      if(this.serviceCartArr[service_id] != null){
        this.serviceCartArr[service_id]=this.serviceCount[service_id];
        console.log(JSON.stringify(this.serviceCartArr));
      } 
      this.serviceMainArr.totalNumberServices=0;
      this.serviceMainArr.subtotal=0;
      this.serviceMainArr.discount=0;
      this.taxAmountArr.length=0;
      console.log(this.taxAmountArr);
      this.serviceMainArr.netCost=0;
      this.fncheckavailcoupon('valid');
      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].totalCost;
        }
      }
      var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      var amountAfterTax=0;
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
            name:'',
            amount:0
          }
          console.log(element.name+" -- "+element.value);
          if(this.taxType == "P"){
           taxTemp.name= element.name;
           taxTemp.amount= amountAfterDiscount * element.value/100;
            amountAfterTax=amountAfterTax+taxTemp.amount;
          }else{
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
      "business_id":2
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
    this.currentSelectedService=serviceId;
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
    }else{
      this.fnSelectNextValidDate(this.minimumAdvanceBookingDateTimeObject);
    }
    this.serviceselection = false;
    this.dateselection = true;
  }
  
  fnSelectNextValidDate(mydate){
    
    console.log(mydate);
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
  fnDatetimeSelection(event){
    if(this.isLoggedIn){
      this.dateselection = false;
      this.appointmentinfo = true;
      this.showSameAsAboveCheck=false;
    }else{
      this.dateselection = false;
      this.personalinfo = true;
      this.showSameAsAboveCheck=true;
    }
  }

  fnGetTimeSlots(){
    this.isLoader=true;
    let requestObject = {
      "business_id":2,
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
      "business_id":'2',
      "postal_code":this.booking.postalcode,
      "service_id":this.currentSelectedService,
      "book_date" : this.datePipe.transform(new Date(this.selecteddate),"yyyy-MM-dd"),
      "book_time" : this.selectedTimeSlot, 
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
    console.log(event);
    console.log(staff_id);
    this.trigger.toArray()[index].togglePopover();
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
        this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].totalCost;
      }
    }
    this.snackBar.open("Added to cart", "X", {
      duration: 2000,
      verticalPosition: 'bottom',
      panelClass : ['green-snackbar']
    });
    var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
    var amountAfterTax=0;
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
          name:'',
          amount:0
        }
        console.log(element.name+" -- "+element.value);
        if(this.taxType == "P"){
         taxTemp.name= element.name;
         taxTemp.amount= amountAfterDiscount * element.value/100;
          amountAfterTax=amountAfterTax+taxTemp.amount;
        }else{
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
        this.customerName=this.authenticationService.currentUserValue.fullname;

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
       
        
        this.personalinfo = false;
        this.appointmentinfo = true;
        this.isLoggedIn=true;
      }else{
        this.snackBar.open("Email or Password is incorrect", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
        });
        this.showSameAsAboveCheck=true;
      }
     },
     (err) =>{ 
       this.errorMessage = this.handleError;
     })
   }

  // personal info
  isEmailUnique(control: FormControl) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/verify-email`,{ emailid: control.value },{headers:headers}).pipe(map((response : any) =>{
          return response;
        }),
        catchError(this.handleError)).subscribe((res) => {
          if(res){
            if(res.data == false){
            resolve({ isEmailUnique: true });
            // this._snackBar.open("Access PIN already in use", "X", {
            // duration: 2000,
            // verticalPosition: 'top',
            // panelClass : ['red-snackbar']
            // });
            }else{
            resolve(null);
            }
          }
        });
      }, 500);
    });
  }

  fnpersonalinfo(){
    if(this.formNewUser.invalid){
      this.formNewUser.get('newUserEmail').markAsTouched();
      this.formNewUser.get('newUserPassword').markAsTouched();
      this.formNewUser.get('newUserFullname').markAsTouched();
      this.formNewUser.get('newUserPhone').markAsTouched();
      if(this.contactFormSettingsArr.contact_field_status == true){
        if(this.contactFormSettingsArr.addressField.status == 1){
          this.formNewUser.get('newUserAddress').markAsTouched();
          this.formNewUser.get('newUserState').markAsTouched();
          this.formNewUser.get('newUserCity').markAsTouched();
          this.formNewUser.get('newUserZipcode').markAsTouched();
          // if(this.contactFormSettingsArr.addressField.required == 1){
          //   const validators = [Validators.required];
          //   const validatorsZipCode = [Validators.required,Validators.pattern(this.onlynumeric)];
          //   this.formNewUser.addControl('newUserAddress', new FormControl('', validators));
          //   this.formNewUser.addControl('newUserState', new FormControl('', validators));
          //   this.formNewUser.addControl('newUserCity', new FormControl('', validators));
          //   this.formNewUser.addControl('newUserZipcode', new FormControl('', validatorsZipCode));

          // }else{
          //   this.formNewUser.addControl('newUserAddress', new FormControl(''));
          //   this.formNewUser.addControl('newUserState', new FormControl(''));
          //   this.formNewUser.addControl('newUserCity', new FormControl(''));
          //   this.formNewUser.addControl('newUserZipcode', new FormControl(''));
          // }
        }
      }else{
        this.formNewUser.get('newUserAddress').markAsTouched();
        this.formNewUser.get('newUserState').markAsTouched();
        this.formNewUser.get('newUserCity').markAsTouched();
        this.formNewUser.get('newUserZipcode').markAsTouched();
      }
      return false;
    }
    this.fnSignUp();
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
      "phone":this.formNewUser.get('newUserPhone').value,
      "address":newUserAddress,
      "zip":newUserZipcode,
      "state":newUserState,
      "city":newUserCity,
      "business_id":2
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
      
    console.log(event)
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
  
  fnappointmentinfo(event){
    console.log(JSON.stringify(this.appo_address_info));
    if(!this.formAppointmentInfo.valid){
      this.formAppointmentInfo.get('appo_address').markAsTouched();
      this.formAppointmentInfo.get('appo_state').markAsTouched();
      this.formAppointmentInfo.get('appo_city').markAsTouched();
      this.formAppointmentInfo.get('appo_zipcode').markAsTouched();
      return false;
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
      this.serviceMainArr.discount=0;
      this.taxAmountArr.length=0;

      // var temp=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      // if(this.serviceMainArr.subtotal > 0){
      //   if(this.taxType == "P"){
      //     this.taxAmountArr= temp * this.taxValue/100;
      //   }else{
      //     this.taxAmountArr= this.taxValue;
      //   }
      // }
      // this.serviceMainArr.netCost=temp+this.taxAmountArr;
      

      var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
      var amountAfterTax=0;
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
            name:'',
            amount:0
          }
          console.log(element.name+" -- "+element.value);
          if(this.taxType == "P"){
           taxTemp.name= element.name;
           taxTemp.amount= amountAfterDiscount * element.value/100;
            amountAfterTax=amountAfterTax+taxTemp.amount;
          }else{
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
      let requestObject = {
      "business_id" : 2,
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
        if(couponType == 'P'){
          this.serviceMainArr.discount = (this.serviceMainArr.subtotal*parseInt(couponValue))/100;
          //this.serviceMainArr.netCost = this.serviceMainArr.subtotal - this.serviceMainArr.discount;
        }else{
          this.serviceMainArr.discount = parseInt(couponValue);
          //this.serviceMainArr.netCost = this.serviceMainArr.subtotal - this.serviceMainArr.discount;
        }

        this.taxAmountArr.length=0;
        // var temp=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
        // if(this.serviceMainArr.subtotal > 0){
        //   if(this.taxType == "P"){
        //     this.taxAmountArr= temp * this.taxValue/100;
        //   }else{
        //     this.taxAmountArr= this.taxValue;
        //   }
        // }
        // this.serviceMainArr.netCost=temp+this.taxAmountArr;
        

        var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
        var amountAfterTax=0;
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
              name:'',
              amount:0
            }
            console.log(element.name+" -- "+element.value);
            if(this.taxType == "P"){
             taxTemp.name= element.name;
             taxTemp.amount= amountAfterDiscount * element.value/100;
              amountAfterTax=amountAfterTax+taxTemp.amount;
            }else{
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
    if(this.closecoupon != 'valid'){
      this.coupon.couponcode_val=''
    }
    this.summaryScreen = false;
    this.paymentScreen =true;
  }
  
  fnbacktocategory(event){
    this.dateselection = false;
    this.catselection = true;
   }


   fnbackfromsubservice(){
     this.serviceselection =false;
     this.subcatselection = true;
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
    if(paymentMethod == 'Card Payment'){
      this.paymentMethod="Card Payment";
      this.creditcardform =true;
    }else{
      this.creditcardform =false;
      this.paymentMethod="Cash";
    }
  }
  
  // date time 
  fnContinueFromCart(){
    if(this.isLoggedIn){
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

  fnAppointmentBookng(){
    let serviceCartArrTemp:any= [];
    for(let i=0; i<this.serviceCartArr.length;i++){
      if(this.serviceCartArr[i]){
        serviceCartArrTemp.push(this.serviceCartArr[i]);
      }
    }
    const currentDateTime = new Date();
    let requestObject = {
      "postal_code" : this.booking.postalcode,
      "business_id" : 2,
      "serviceInfo" : serviceCartArrTemp,
      "appointment_address" : this.formAppointmentInfo.get('appo_address').value,
      "appointment_state" : this.formAppointmentInfo.get('appo_state').value,
      "appointment_city" : this.formAppointmentInfo.get('appo_city').value,
      "appointment_zipcode" : this.formAppointmentInfo.get('appo_zipcode').value,
      "coupon_code" : this.coupon.couponcode_val,
      "customer_id": this.authenticationService.currentUserValue.user_id,
      "customer_token" : this.authenticationService.currentUserValue.token,
      "subtotal" : this.serviceMainArr.subtotal,
      "discount" : this.serviceMainArr.discount,
      "tax" : this.taxAmountArr,
      "nettotal" : this.serviceMainArr.netCost,
      "payment_method" : this.paymentMethod,
      "order_date": this.datePipe.transform(currentDateTime,"yyyy-MM-dd")
      };
      console.log(JSON.stringify(requestObject));
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
          this.thankYouScreen=true;
          this.paymentScreen=false;
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        else{
          console.log(response.response);
        }
        },
        (err) =>{
          
        })
      }

}

