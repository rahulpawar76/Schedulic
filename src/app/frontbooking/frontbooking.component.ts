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
  }

  ngOnInit() {
    if(this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.user_type == "C"){
      this.isLoggedIn=true;
      this.customerName=this.authenticationService.currentUserValue.fullname;
      console.log(this.authenticationService.currentUserValue.user_id+" "+this.isLoggedIn);
    }
    this.formExistingUser = this._formBuilder.group({
      existing_mail: ['',[Validators.required,Validators.email]],
      existing_password: ['',Validators.required],
    })

    this.fnGetTaxDetails();
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    
    this.formNewUser = this._formBuilder.group({
      newUserEmail: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)],
      this.isEmailUnique.bind(this)],
      newUserPassword: ['',[Validators.required,Validators.minLength(8)]],
      newUserFullname: ['',Validators.required],
      newUserPhone: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
      newUserAddress: ['',Validators.required],
      newUserState: ['',Validators.required],
      newUserCity: ['',Validators.required],
      newUserZipcode: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
      newUserSplReq: ['']
    })

    this.formAppointmentInfo = this._formBuilder.group({
      appo_address: ['',[Validators.required]],
      appo_state: ['',[Validators.required]],
      appo_city: ['',Validators.required],
      appo_zipcode: ['',[Validators.required,Validators.pattern(this.onlynumeric)]]
    })
    
    this.fnGetCategories();
    this.fnGetOffDays();
    setTimeout(() => {
      this.selectToday();
    }, 1000);
    
    this.serviceCount.length=0
    this.serviceCartArr.length=0
  }

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

  // Get Tax details

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
  
  isDisabled(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);

    //if you want to disable week
    // return d.getDay() == 5

    //if you want to disable particular day for every month
    // return date.day==13

    //if you want to disable particular month
    // return date.month - 1 ==0

    //if you want to disable particular day for particular month
    return date.month - 2 ==0 && date.day==13 || date.month - 2 ==0 && date.day==17; 
    
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
    // localStorage.removeItem('userId');
    // localStorage.removeItem('tokenID');
    // localStorage.removeItem('userToken');
    // localStorage.removeItem('userName');
    // localStorage.removeItem('userRole');
    // localStorage.removeItem("billing_address");
    // localStorage.removeItem("billing_state");
    // localStorage.removeItem("billing_city");
    // localStorage.removeItem("billing_zipcode");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isFront");
    localStorage.clear();
    this.authenticationService.currentUserSubject.next(null);
    //console.log(localStorage.getItem("userId"));
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
          this.offDaysList = response.response;
          //console.log(JSON.stringify(this.offDaysList));
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
      let dateTemp={"year":JSON.parse(year),"month":JSON.parse(month),"day":JSON.parse(day)};
      console.log(JSON.stringify(dateTemp));
      this.model=dateTemp;
      this.selecteddate=this.serviceCartArr[this.currentSelectedService].appointmentDate
      this.selecteddateForLabel=this.datePipe.transform(new Date(this.serviceCartArr[this.currentSelectedService].appointmentDate),"EEE, MMM dd");

      this.fnGetTimeSlots();
    }else{
      this.model=this.calendar.getToday();
      this.selecteddate= this.model.year+'-'+this.model.month+'-'+this.model.day;
      this.selecteddateForLabel= this.datePipe.transform(new Date(this.model.year+'-'+this.model.month+'-'+this.model.day),"EEE, MMM dd");
      this.fnGetTimeSlots();
    }
    this.serviceselection = false;
    this.dateselection = true;
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
    this.selecteddateForLabel=this.datePipe.transform(new Date(this.selecteddate),"MMM dd")
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
          this.timeSlotArr = response.response;
          var i=0;
          this.timeSlotArr.forEach( (element) => {
            var dateTemp=this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element+":00";
             this.timeSlotArrForLabel[i]= this.datePipe.transform(new Date(dateTemp),"hh:mm a");
             i++;
          });
          this.timeslotview = true;
          this.isLoader=false;
          console.log(JSON.stringify(this.timeSlotArr));
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
 
  fnSelectTimeSlot(timeSlot){
    this.selectedTimeSlot=timeSlot;
    console.log(this.selectedTimeSlot);
   // console.log(this.selectedTimeSlot)
    this.fnGetStaff()
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
  
  fnSelectStaff(event,staff_id,index){
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
      this.formNewUser.get('newUserAddress').markAsTouched();
      this.formNewUser.get('newUserState').markAsTouched();
      this.formNewUser.get('newUserCity').markAsTouched();
      this.formNewUser.get('newUserZipcode').markAsTouched();
      return false;
    }
    this.fnSignUp();
   }
   
  fnSignUp(){
    let requestObject = {
      "email" : this.formNewUser.get('newUserEmail').value,
      "password" : this.formNewUser.get('newUserPassword').value,
      "fullname":this.formNewUser.get('newUserFullname').value,
      "phone":this.formNewUser.get('newUserPhone').value,
      "address":this.formNewUser.get('newUserAddress').value,
      "zip":this.formNewUser.get('newUserZipcode').value,
      "state":this.formNewUser.get('newUserState').value,
      "city":this.formNewUser.get('newUserCity').value,
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
      
    console.log(event)
      this.formAppointmentInfo.controls['appo_address'].setValue(this.formNewUser.get('newUserAddress').value);
      this.formAppointmentInfo.controls['appo_state'].setValue(this.formNewUser.get('newUserState').value);
      this.formAppointmentInfo.controls['appo_city'].setValue(this.formNewUser.get('newUserCity').value);
      this.formAppointmentInfo.controls['appo_zipcode'].setValue(this.formNewUser.get('newUserZipcode').value);

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

