import { Component, OnInit,ElementRef, ViewChild, ViewChildren, QueryList} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { environment } from '@environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NgbDateParserFormatter, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { MdePopoverTrigger } from '@material-extended/mde';

@Component({
  selector: 'app-frontbooking',
  templateUrl: './frontbooking.component.html',
  styleUrls: ['./frontbooking.component.scss']
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
  booking = {
    postalcode: ""
  };
  serviceCount:any= [];
  serviceCartArr:any= [];
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
  closecoupon: string = "default";

  selecteddate: any;
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
  showAddressCheckbox:boolean=true;
  isLoggedIn:boolean=false;
  isStaffAvailable:boolean=false;
  customerName:any;
  cartOpened : boolean = true;
  couponIcon:any="check";
  isReadOnly:any="";
  paymentMethod:any="";
  //@ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;
  @ViewChildren(MdePopoverTrigger) trigger: QueryList<MdePopoverTrigger>;
  emailFormat = "/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/"
  onlynumeric = /^-?(0|[1-9]\d*)?$/

  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private calendar: NgbCalendar
    
  ) { 
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
    if(localStorage.getItem("customerId")){
      this.isLoggedIn=true;
      this.customerName=localStorage.getItem("customerName")
      console.log(localStorage.getItem("customerId")+" "+this.isLoggedIn);
    }
    this.formExistingUser = this._formBuilder.group({
      existing_mail: ['',[Validators.required,Validators.email]],
      existing_password: ['',Validators.required],
    })


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
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerName');
    localStorage.clear();
    console.log(localStorage.getItem("customerId"));
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
    }
    else{
      this.validpostalcode = 'invalid';
    }
  }

  fnCheckAvailPostal(){
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
          this.validpostalcode = 'valid';
      }else{
        this.validpostalcode = 'invalid';
      }
      },
      (err) =>{
      this.validpostalcode = 'invalid';
        console.log(err)
      })
  }

  fnGetCategories(){
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
        }else{

        }
        
      },
      (err) =>{
        console.log(err)
      })
    }

  // Category
  fnCategory(event,id){
    if(this.booking.postalcode == ''){
      this.validpostalcode = 'invalid';
      return false;
    }
    if(this.validpostalcode == 'invalid'){
      return false;
    }
    this.catselection = false;
    this.subcatselection = true;
    this.selectedcategory = id;
    this.fnGetSubCategory();
  }
   
  // get Sub Category function
  fnGetSubCategory(){
    let requestObject = {
      "category_id":this.selectedcategory,
      "sub_category_status":"E"
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/get_sub_category`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        this.subcatdata = response.response;
      }else{

      }
    },
    (err) =>{
      console.log(err)
    })
  }

  // Sub Category
  fnSubCategory(event,id){
    this.subcatselection = false;
    this.serviceselection = true;
    this.selectedsubcategory = id;
    this.fnGetAllServices();
   }
   
  fnGetAllServices(){
  let requestObject = {
    "sub_category_id":this.selectedsubcategory,
    "status":"E"
  };
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  this.http.post(`${environment.apiUrl}/get_services`,requestObject,{headers:headers} ).pipe(
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
          this.serviceData[i].appointmentTimeSlot='';
          this.serviceData[i].assignedStaff=null;
          this.serviceCount[this.serviceData[i].id]=this.serviceData[i];
        }
        
      }
      console.log(JSON.stringify(this.serviceCount));
    }else{
      
    }
  },
    (err) =>{
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
    this.serviceMainArr.netCost=0;
    this.fncheckavailcoupon('valid');
    for(let i=0; i< this.serviceCartArr.length; i++){
      if(this.serviceCartArr[i] != null){
        this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
        this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].totalCost;
      }
    }
    this.serviceMainArr.netCost=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
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
      this.serviceMainArr.netCost=0;
      this.fncheckavailcoupon('valid');
      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].totalCost;
        }
      }
      this.serviceMainArr.netCost=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
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
      this.serviceMainArr.netCost=0;
      this.fncheckavailcoupon('valid');
      for(let i=0; i< this.serviceCartArr.length; i++){
        if(this.serviceCartArr[i] != null){
          this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
          this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].totalCost;
        }
      }
      this.serviceMainArr.netCost=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
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
          //alert(JSON.stringify(this.offDaysList));
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
      this.fnGetTimeSlots();
    }else{
      this.model=this.calendar.getToday();
      this.selecteddate= this.model.year+'-'+this.model.month+'-'+this.model.day;
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
      this.showAddressCheckbox=false;
    }else{
      this.serviceselection = false;
      this.personalinfo = true;
      this.showAddressCheckbox=true;
    }
   }

  onDateSelect(event){
    this.selecteddate = event.year+'-'+event.month+'-'+event.day;
    this.fnGetTimeSlots();
  }
  // date time 
  fnDatetimeSelection(event){
    if(this.isLoggedIn){
      this.dateselection = false;
      this.appointmentinfo = true;
      this.showAddressCheckbox=false;
    }else{
      this.dateselection = false;
      this.personalinfo = true;
      this.showAddressCheckbox=true;
    }
  }

  fnGetTimeSlots(){
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
          this.timeSlotArr = response.response;
          this.timeslotview = true;
          console.log(JSON.stringify(this.timeSlotArr));
      }
      else{
        this.timeslotview = false;
      }
      },
      (err) =>{
        this.timeslotview = false;
        console.log(err)
      })
  }
 
  fnSelectTimeSlot(timeSlot){
    this.selectedTimeSlot=timeSlot;
    console.log(this.selectedTimeSlot);
   // alert(this.selectedTimeSlot)
    this.fnGetStaff()
  }

  fnGetStaff(){
    let requestObject = {
      "bussiness_id":2,
      "service_id":this.currentSelectedService
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
          console.log(JSON.stringify(this.timeSlotArr));
      }
      else{
       this.isStaffAvailable = false;
      }
      },
      (err) =>{
        this.isStaffAvailable = false;
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
  
  fnSelectStaff(event,staff_id){
    console.log(event);
    console.log(staff_id);
    this.serviceCount[this.currentSelectedService].appointmentDate=this.selecteddate;
    this.serviceCount[this.currentSelectedService].assignedStaff=staff_id;
    this.serviceCount[this.currentSelectedService].appointmentTimeSlot=this.selectedTimeSlot;
    this.serviceCartArr[this.currentSelectedService]=this.serviceCount[this.currentSelectedService]
    //alert(JSON.stringify(this.selecteddate));
    //alert(JSON.stringify(this.serviceCartArr[this.currentSelectedService])); 
    this.serviceMainArr.totalNumberServices=0;
    this.serviceMainArr.subtotal=0;
    this.serviceMainArr.discount=0;
    this.serviceMainArr.netCost=0;
    for(let i=0; i< this.serviceCartArr.length; i++){
      if(this.serviceCartArr[i] != null){
        this.serviceMainArr.totalNumberServices=this.serviceMainArr.totalNumberServices+this.serviceCartArr[i].count;
        this.serviceMainArr.subtotal=this.serviceMainArr.subtotal+this.serviceCartArr[i].totalCost;
      }
    }
    this.serviceMainArr.netCost=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
    console.log(JSON.stringify(this.serviceMainArr.totalNumberServices+" "+this.serviceMainArr.subtotal+" "+this.serviceMainArr.discount+" "+this.serviceMainArr.netCost));
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

   this.http.post(`${environment.apiUrl}/customer-login`,requestObject,{headers:headers} ).pipe(
     map((res) => {
       return res;
     }),
     catchError(this.handleError)).subscribe((response:any) => {
      if(response.data == true){
        localStorage.setItem("customerId",response.response.user_id);
        localStorage.setItem("customerToken",response.response.token);
        localStorage.setItem("customerName",response.response.fullname);
        this.customerName=localStorage.getItem("customerName")
        if(!isAfterSignup){
          this.formAppointmentInfo.controls['appo_address'].setValue(response.response.address);
          this.formAppointmentInfo.controls['appo_state'].setValue(response.response.state);
          this.formAppointmentInfo.controls['appo_city'].setValue(response.response.city);
          this.formAppointmentInfo.controls['appo_zipcode'].setValue(response.response.zip);
          this.showAddressCheckbox=false;
        }
        
        this.personalinfo = false;
        this.appointmentinfo = true;
        this.isLoggedIn=true;
      }else{
        this.showAddressCheckbox=true;
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

    isAccessPINRegisterd(accessPin,jsonObject) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      return this.http.post(`${environment.apiUrl}/maturity/saveSession/isAccessPINUnique`,{ accessPin: accessPin,json_object:jsonObject },{headers:headers}).pipe(map((response : any) =>{
      return response;
      }),
      catchError(this.handleError));
      
      /*return this.http.post('http://localhost:8080/api/v1/isEmailRegisterd', JSON.stringify({ email: email }), { headers: headers })
      .map((response: Response) => response.json())
      .catch(this.handleError);*/
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
      this.serviceMainArr.netCost=this.serviceMainArr.subtotal;
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

    this.http.post(`${environment.apiUrl}/check_discount_coupon`,requestObject,{headers:headers} ).pipe(
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
          this.serviceMainArr.netCost = this.serviceMainArr.subtotal - this.serviceMainArr.discount;
        }else{
          this.serviceMainArr.discount = parseInt(couponValue);
          this.serviceMainArr.netCost = this.serviceMainArr.subtotal - this.serviceMainArr.discount;
        }
        this.coupon.couponcode_val=response.response.coupon_code;
        this.couponIcon="close";
        this.closecoupon = 'valid';
        this.isReadOnly="readonly";
      }
      else{
        this.closecoupon = 'invalid';
        this.couponIcon="check";
        this.isReadOnly="";
      }
      },
      (err) =>{
        this.closecoupon = 'invalid';
        this.couponIcon="check";
        this.isReadOnly="";
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
      this.showAddressCheckbox=false;
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
      this.showAddressCheckbox=true;
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
      "customer_id": localStorage.getItem("customerId"),
      "customer_token" : localStorage.getItem("customerToken"),
      "subtotal" : this.serviceMainArr.subtotal,
      "discount" : this.serviceMainArr.discount,
      "nettotal" : this.serviceMainArr.netCost,
      "payment_method" : this.paymentMethod,
      "order_date": currentDateTime
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
          alert(response.response);
        }
        },
        (err) =>{
          
        })
      }

}

