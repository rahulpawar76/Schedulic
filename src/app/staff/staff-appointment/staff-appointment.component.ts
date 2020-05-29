import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StaffService } from '../_services/staff.service'
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe} from '@angular/common';
import { environment } from '@environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';

export interface status {
  
  statuses: string;
  value :string;
  viewValue:string;
  
}
export interface DialogData {
  animal: string;
  name: string;
 
}

@Component({
  selector: 'app-staff-appointment',
  templateUrl: './staff-appointment.component.html',
  styleUrls: ['./staff-appointment.component.scss'],
  providers: [DatePipe]
})
export class StaffAppointmentComponent implements OnInit {
  animal: any;
	bussinessId: any;
  status: any;
  newAppointmentData: any;
  completedAppointmentData: any;
  onGoingAppointmentData: any;
  notes: any;
  settingsArr:any=[];
  cancellationBufferTime= new Date();
  minReschedulingTime= new Date();
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;
  isLoader:boolean= false;
  openedTab : any = 'new';
  search = {
    keyword: ""
  };
  staffId:any;

  statuses: status[] = [
    {value: 'OW', viewValue: 'On The Way',statuses:''},
    {value: 'WS', viewValue: 'Work Started',statuses:''}
  ];
  

  constructor(
    public dialog: MatDialog,
    private StaffService: StaffService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private authenticationService:AuthenticationService
    
    ) { 
      this.bussinessId=this.authenticationService.currentUserValue.business_id
      this.staffId = this.authenticationService.currentUserValue.user_id
     }

  ngOnInit() {
    this.fnGetSettingValue();
    this.getNewAppointment();
    this.getCompletedAppointment();
    this.getOnGoingAppointment();
  }

  fnGetSettingValue(){
    this.isLoader=true;
    let requestObject = {
      "business_id":this.bussinessId
    };
    this.StaffService.getSettingValue(requestObject).subscribe((response:any) => {
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
        console.log(cancellation_buffer_time);
        console.log(min_rescheduling_time);
       
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
    this.isLoader=false;
  }

  getNewAppointment(){
    this.isLoader=true;
    this.StaffService.getNewAppointment().subscribe((response:any) =>{
      if(response.data == true){
        this.newAppointmentData = response.response;
        console.log( this.newAppointmentData);
        this.newAppointmentData.forEach( (element) => {
          var todayDateTime = new Date();
          element.booking_date_time=new Date(element.booking_date+" "+element.booking_time);
          var dateTemp = new Date(this.datePipe.transform(element.booking_date_time,"dd MMM yyyy hh:mm a"));
          dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
          var temp = dateTemp.getTime() - todayDateTime.getTime();
          element.timeToService=(temp/3600000).toFixed();
          element.booking_timeForLabel=this.datePipe.transform(element.booking_date_time,"hh:mm a")
          element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
          element.booking_dateForLabel=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          element.created_atForLabel=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
        });
      }
      else if(response.data == false) {
        this.newAppointmentData = '';
      }
    })
    this.isLoader=false;
  }
  getCompletedAppointment(){
    this.isLoader=true;
    this.StaffService.getCompletedAppointment().subscribe((response:any) =>{
      if(response.data == true){
        this.completedAppointmentData = response.response;
        this.completedAppointmentData.forEach( (element) => {
          var todayDateTime = new Date();
          element.booking_timeForLabel=element.booking_date+" "+element.booking_time;
          var dateTemp = new Date(this.datePipe.transform(new Date(element.booking_timeForLabel),"dd MMM yyyy hh:mm a"));
          dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
          var temp = dateTemp.getTime() - todayDateTime.getTime();
          element.timeToService=(temp/3600000).toFixed();
          element.booking_timeForLabel=this.datePipe.transform(new Date(element.booking_timeForLabel),"hh:mm a")
          element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
          element.booking_dateForLabel=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          element.created_atForLabel=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
          element.updated_atDateForLabel=this.datePipe.transform(new Date(element.updated_at),"dd MMM yyyy")
          element.updated_atTimeForLabel=this.datePipe.transform(new Date(element.updated_at),"hh:mm a")
        });
      }
      else if(response.data == false) {
        this.completedAppointmentData = '';
      }
    })
    this.isLoader=false;
  }
  getOnGoingAppointment(){
    this.isLoader=true;
    this.StaffService.getOnGoingAppointment().subscribe((response:any) =>{
      if(response.data == true){
        this.onGoingAppointmentData = response.response;
        this.onGoingAppointmentData.forEach( (element) => {
          var todayDateTime = new Date();
          element.booking_date_time=new Date(element.booking_date+" "+element.booking_time);
          var dateTemp = new Date(this.datePipe.transform(element.booking_date_time,"dd MMM yyyy hh:mm a"));
          var dateTemp2 = new Date(this.datePipe.transform(element.booking_date_time,"dd MMM yyyy hh:mm a"));
          dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
          var temp = dateTemp.getTime() - todayDateTime.getTime();
          element.timeToService=(temp/3600000).toFixed();
           dateTemp2.setMinutes( dateTemp2.getMinutes());
          var serviceTimeTamp =  dateTemp2.getTime() - todayDateTime.getTime();
          element.timeToServiceDecimal=(serviceTimeTamp/60000).toFixed();
          element.booking_timeForLabel=this.datePipe.transform(element.booking_date_time,"hh:mm a")
          element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
          element.booking_dateForLabel=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          element.created_atForLabel=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
        });
      }
      else if(response.data == false) {
        this.onGoingAppointmentData = '';
      }
    })
    this.isLoader=false;
  }
   someMethod(booking_id, status): void {
    if(status == 'OW'){
      const dialogRef = this.dialog.open(DialogONTheWay, {
        width: '500px',
        data: {booking_id :booking_id, status: status}
      });

       dialogRef.afterClosed().subscribe(result => {
        this.status = result;
        this.getOnGoingAppointment();
       });
    }
    if(status == 'WS'){
      const dialogRef = this.dialog.open(DialogWorkStarted, {
        width: '500px',
        data: {booking_id :booking_id, status: status}
      });

       dialogRef.afterClosed().subscribe(result => {
        this.status = result;
        this.getOnGoingAppointment();
       });
    }
    if(status == 'ITR'){
      const dialogRef = this.dialog.open(DialogInterrupted, {
        width: '500px',
        data: {booking_id :booking_id, status: status}
      });

       dialogRef.afterClosed().subscribe(result => {
        this.status = result;
        this.getOnGoingAppointment();
       });
    }
  }

  changeBookingStatus(order_item_id, status, index){
    this.isLoader=true;
    if(status == 'CO' && this.onGoingAppointmentData[index].payment.payment_status == 'unpaid'){
      this.OnlinePaymentMode(index);
    }else {
      this.StaffService.changeStatus(order_item_id, status, this.notes).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          
          this.getNewAppointment();
          this.getCompletedAppointment();
          this.getOnGoingAppointment();
        }
        else if(response.data == false) {
          this._snackBar.open("Appointment Not Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          }); 
        }
      })
    }
    this.isLoader=false;
  }



  AddAppointment() {
    const dialogRef = this.dialog.open(DialogAddNewAppointment, {
      width: '500px',
    });
     dialogRef.afterClosed().subscribe(result => {
       this.getNewAppointment();
     });
  }
  
  


  StaffMyAppointmentDetails(index){
    const dialogRef = this.dialog.open(DialogStaffMyAppointmentDetails, {
     height: '700px',
     data :{fulldata : this.newAppointmentData[index]}
    });
     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      this.getNewAppointment();
      this.getCompletedAppointment();
      this.getOnGoingAppointment();
     });
  }

  OnGoingAppointmentDetails(index){
    const dialogRef = this.dialog.open(OnGoingAppointmentDetails, {
      height: '700px',
      data: {fuldata: this.onGoingAppointmentData[index]}
    });
      dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      });
  }

  CompleteAppointmentDetails(index){
    const dialogRef = this.dialog.open(CompleteAppointmentDetails, {
      height: '700px',
      data : {fuldata: this.completedAppointmentData[index]}
    });
    dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
    });

  }

  rescheduleAppointment(index){
     const dialogRef = this.dialog.open(DialogInterrupted, {
        width: '500px',
        data : {fulldata: this.onGoingAppointmentData[index]}
      });

        dialogRef.afterClosed().subscribe(result => {
        this.status = result;
        this.getOnGoingAppointment();
        });
    // const dialogRef = this.dialog.open(InterruptedReschedule, {
    //   height: '700px',
    //   data : {fulldata: this.onGoingAppointmentData[index]}
    // });
    //   console.log(this.onGoingAppointmentData[index]);
    // dialogRef.afterClosed().subscribe(result => {
    
    // this.getOnGoingAppointment();
    // });

  }
  


   /*Payment Module*/

   CashPaymentMode() {
    const dialogRef = this.dialog.open(DialogCashPaymentMode, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
     });
  }

   OnlinePaymentMode(index) {
    const dialogRef = this.dialog.open(DialogOnlinePaymentMode, {
      width: '500px',
      data : {fuldata: this.onGoingAppointmentData[index]}
      
    });

     dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
     });
  }

   CashPaymentDetails() {
    const dialogRef = this.dialog.open(DialogCashPaymentDetails, {
      width: '500px',
      
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
      this.openedTab = 'ongoing';
    }else if(event == 2){
      this.openedTab = 'completed';
    }
  }

  staffSearchAppointment(){
    this.isLoader=true;
    if(this.search.keyword.length > 1){
      let requestObject = {
        "search":this.search.keyword,
        "staff_id":this.staffId,
        "business_id":this.bussinessId,
        "booking_type" : this.openedTab
      }
      console.log(requestObject);
      this.StaffService.staffSearchAppointment(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          if(this.openedTab == 'new'){
            this.newAppointmentData = response.response;
            console.log( this.newAppointmentData);
            this.newAppointmentData.forEach( (element) => {
              var todayDateTime = new Date();
              element.booking_date_time=new Date(element.booking_date+" "+element.booking_time);
              var dateTemp = new Date(this.datePipe.transform(element.booking_date_time,"dd MMM yyyy hh:mm a"));
              dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
              var temp = dateTemp.getTime() - todayDateTime.getTime();
              element.timeToService=(temp/3600000).toFixed();
              element.booking_timeForLabel=this.datePipe.transform(element.booking_date_time,"hh:mm a")
              element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
              element.booking_dateForLabel=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
              element.created_atForLabel=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
            });
           
          }else if(this.openedTab == 'ongoing'){
            this.onGoingAppointmentData = response.response;
            this.onGoingAppointmentData.forEach( (element) => {
              var todayDateTime = new Date();
              element.booking_date_time=new Date(element.booking_date+" "+element.booking_time);
              var dateTemp = new Date(this.datePipe.transform(element.booking_date_time,"dd MMM yyyy hh:mm a"));
              var dateTemp2 = new Date(this.datePipe.transform(element.booking_date_time,"dd MMM yyyy hh:mm a"));
              dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
              var temp = dateTemp.getTime() - todayDateTime.getTime();
              element.timeToService=(temp/3600000).toFixed();
              dateTemp2.setMinutes( dateTemp2.getMinutes());
              var serviceTimeTamp =  dateTemp2.getTime() - todayDateTime.getTime();
              element.timeToServiceDecimal=(serviceTimeTamp/60000).toFixed();
              element.booking_timeForLabel=this.datePipe.transform(element.booking_date_time,"hh:mm a")
              element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
              element.booking_dateForLabel=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
              element.created_atForLabel=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
            });
            
          }else if(this.openedTab == 'completed'){
            this.completedAppointmentData = response.response;
            this.completedAppointmentData.forEach( (element) => {
              var todayDateTime = new Date();
              element.booking_timeForLabel=element.booking_date+" "+element.booking_time;
              var dateTemp = new Date(this.datePipe.transform(new Date(element.booking_timeForLabel),"dd MMM yyyy hh:mm a"));
              dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
              var temp = dateTemp.getTime() - todayDateTime.getTime();
              element.timeToService=(temp/3600000).toFixed();
              element.booking_timeForLabel=this.datePipe.transform(new Date(element.booking_timeForLabel),"hh:mm a")
              element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
              element.booking_dateForLabel=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
              element.created_atForLabel=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
              element.updated_atDateForLabel=this.datePipe.transform(new Date(element.updated_at),"dd MMM yyyy")
              element.updated_atTimeForLabel=this.datePipe.transform(new Date(element.updated_at),"hh:mm a")
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
          this.newAppointmentData = [];
          this.onGoingAppointmentData = [];
          this.completedAppointmentData = [];
          this.isLoader=false;
        }
      })
    }else{
      this.getNewAppointment();
      this.getCompletedAppointment();
      this.getOnGoingAppointment();
      this.isLoader=false;
    }
    
  }



}

  @Component({
      selector: 'add-new-appointment',
      templateUrl: '../_dialogs/add-new-appointment.html',
      providers: [DatePipe]
  })
  export class DialogAddNewAppointment {
    formAddNewAppointmentStaffStep1:FormGroup;
    formAddNewAppointmentStaffStep2:FormGroup;
    bussinessId:any;
    secondStep:boolean = false;
    catdata :[];
    subcatdata :[];
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
    staffId:any;
    token:any;
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
    showSubCatDropDown=true;
    isLoaderAdmin: boolean = false;
    constructor(
      public dialogRef: MatDialogRef<DialogAddNewAppointment>,
      public dialog: MatDialog,
      private _formBuilder: FormBuilder,
      private http: HttpClient,
      private staffService: StaffService,
      private _snackBar: MatSnackBar,
      private datePipe: DatePipe,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {

      this.staffId=(JSON.parse(localStorage.getItem('currentUser'))).user_id
      this.token=(JSON.parse(localStorage.getItem('currentUser'))).token
      this.bussinessId=(JSON.parse(localStorage.getItem('currentUser'))).business_id;
      let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      let onlynumeric = /^-?(0|[1-9]\d*)?$/
      this.subcatdata=[];
      this.serviceData=[];
      this.formAddNewAppointmentStaffStep1 = this._formBuilder.group({
        customerFullName: ['', Validators.required],
        customerEmail: ['', [Validators.required,Validators.email,Validators.pattern(emailPattern)]],
        customerPhone: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(onlynumeric)]],
        customerAddress: ['', Validators.required],
        customerState: ['', Validators.required],
        customerCity: ['', Validators.required],
        customerPostalCode: ['',[Validators.required,Validators.pattern(onlynumeric)]],
      });

      this.formAddNewAppointmentStaffStep2 = this._formBuilder.group({
        customerCategory: ['', Validators.required],
        customerSubCategory: ['', Validators.required],
        customerService: ['', [Validators.required]],
        customerDate: ['', Validators.required],
        customerTime: ['', Validators.required]
      });

      this.fnGetSettingValue();
      this.fnGetTaxDetails();
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
    }

    // personal info
    isEmailUnique(control: FormControl) {
      this.isLoaderAdmin = true;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });
          return this.http.post(`${environment.apiUrl}/verify-email`,{ emailid: control.value },{headers:headers}).pipe(map((response : any) =>{
            return response;
          })).subscribe((res) => {
            if(res){
              if(res.data == false){
                resolve({ isEmailUnique: true });
                this.isLoaderAdmin = false;
              }else{
              resolve(null);
              this.isLoaderAdmin = false;
              }
            }
          });
        }, 500);
      });
    }

  fnGetSettingValue(){
    let requestObject = {
      "business_id":this.bussinessId
    };
    this.staffService.getSettingValue(requestObject).subscribe((response:any) => {
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
      else if(response.data == false){
        
      }
    })
  }


  fnGetTaxDetails(){
    this.isLoaderAdmin = true;
    this.staffService.getTaxDetails().subscribe((response:any) => {
      if(response.data == true){
        let tax = response.response
        this.taxArr=tax;
        console.log(this.taxArr);
      }
      else if(response.data == false){
        
      }
    })
    this.isLoaderAdmin = false;
  }

  fnGetOffDays(){
    this.isLoaderAdmin = true;
    let requestObject = {
      "business_id":this.bussinessId,
      "staff_id":this.staffId
    };
    this.staffService.getOffDays(requestObject).subscribe((response:any) => {
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
      this.isLoaderAdmin = false;
    },
    (err) =>{
      console.log(err)
    })
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

    onNoClick(): void {
      this.dialogRef.close();
    }

    fnNewAppointmentStep1(){
      if(this.formAddNewAppointmentStaffStep1.invalid){
        this.formAddNewAppointmentStaffStep1.get('customerFullName').markAsTouched();
        this.formAddNewAppointmentStaffStep1.get('customerEmail').markAsTouched();
        this.formAddNewAppointmentStaffStep1.get('customerPhone').markAsTouched();
        this.formAddNewAppointmentStaffStep1.get('customerAddress').markAsTouched();
        this.formAddNewAppointmentStaffStep1.get('customerState').markAsTouched();
        this.formAddNewAppointmentStaffStep1.get('customerCity').markAsTouched();
        this.formAddNewAppointmentStaffStep1.get('customerPostalCode').markAsTouched();
        return false;
      }

      this.fnGetCategories(); 
      this.secondStep=true;
    }

    fnGetCategories(){
      this.isLoaderAdmin = true;
      let requestObject = {
        "business_id":this.bussinessId,
        "status":"E"
        };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'mode': 'no-cors'
      });

      this.http.post(`${environment.apiUrl}/get-all-category`,requestObject,{headers:headers} ).pipe(
        map((res) => {
          return res;
        })
        ).subscribe((response:any) => {
          if(response.data == true){
            this.catdata = response.response;
            console.log(this.catdata);
          }else{
          }
          this.isLoaderAdmin = false;
        },
        (err) =>{
          console.log(err)
        })
      
      }

      fnSelectCat(selectedCategoryId){
        console.log(selectedCategoryId)
        this.subcatdata.length = 0;
        this.serviceData.length = 0;
        this.serviceCount.length=0; 
        this.fnGetSubCategory(selectedCategoryId);
        this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].setValue(null);
        this.formAddNewAppointmentStaffStep2.controls['customerService'].setValue(null);
        this.selectedSubCatId=undefined;
        this.selectedServiceId=undefined;
      }
    


      // get Sub Category function
      fnGetSubCategory(selectedCategoryId){
        this.isLoaderAdmin = true;
        
        let requestObject = {
          "category_id":selectedCategoryId,
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
            console.log(this.subcatdata)
           
          }else{
            this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].clearValidators();
            this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].updateValueAndValidity();           
           this.showSubCatDropDown=false;
            // this.formGroup.controls["firstName"].clearValidators();
            // this.formGroup.controls["firstName"].updateValueAndValidity();       
            this.fnGetAllServicesFromCategory();
          }
          this.isLoaderAdmin = false;
        },
        (err) =>{
          console.log(err)
        })
        //this.isLoaderAdmin = false;
      }

      fnSelectSubCat(selectedSubCategoryId){
      
        console.log(selectedSubCategoryId)
        this.serviceData.length = 0;
        this.fnGetAllServices(selectedSubCategoryId);
        this.formAddNewAppointmentStaffStep2.controls['customerService'].setValue(null);
        this.serviceCount.length=0;
        this.selectedServiceId=undefined;
      }

      fnGetAllServices(selectedSubCategoryId){
        this.isLoaderAdmin = true;
        let requestObject = {
          "sub_category_id":selectedSubCategoryId,
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

              this.serviceData[i].appointmentDate='';
              this.serviceData[i].appointmentTimeSlot='';
              this.serviceData[i].assignedStaff=this.staffId;
              this.serviceCount[this.serviceData[i].id]=this.serviceData[i];
            }
            console.log(JSON.stringify(this.serviceCount));
          }else{
          }
          this.isLoaderAdmin = false;
        },
        (err) =>{
          console.log(err)
        })
       
      }
   
  fnGetAllServicesFromCategory(){
    let requestObject = {
      "business_id":2,
      "category_id":this.selectedCatId
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/get-cat-services`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      // catchError(this.handleError)
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

        this.serviceData[i].appointmentDate='';
        this.serviceData[i].appointmentTimeSlot='';
        this.serviceData[i].assignedStaff=this.staffId;
        this.serviceCount[this.serviceData[i].id]=this.serviceData[i];
      }
      console.log(JSON.stringify(this.serviceData));
      }else{
        this._snackBar.open("No Sub-Category or Service Available", "X", {
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

     fnSelectService(selectedServiceId){
      console.log(selectedServiceId);
      this.selectedServiceId=selectedServiceId;
      if(this.selectedDate){
          this.fnGetTimeSlots(this.selectedDate);
      }
      for(let i=0; i<this.serviceCount.length;i++){
        if(this.serviceCount[i] != null && this.serviceCount[i].id == selectedServiceId){
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

          // this.serviceData[id].tax=0;
          this.serviceCount[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;

          // this.serviceCount[service_id].totalCost=1*this.serviceCount[service_id].service_cost;
          console.log(JSON.stringify(this.serviceCount));

          if(this.selectedDate){
            this.serviceCount[i].appointmentDate=this.selectedDate;
          }else{
            this.serviceCount[i].appointmentDate='';
          }
          if(this.selectedTime){
            this.serviceCount[i].appointmentTimeSlot=this.selectedTime;
          }else{
            this.serviceCount[i].appointmentTimeSlot='';
          }
          this.serviceCount[i].assignedStaff=this.staffId;
        }else if(this.serviceCount[i] != null && this.serviceCount[i].id != selectedServiceId){
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
      console.log(JSON.stringify(this.serviceCount));
      }

      fnDateChange(event: MatDatepickerInputEvent<Date>) {
        console.log(this.datePipe.transform(new Date(event.value),"yyyy-MM-dd"));
        let date = this.datePipe.transform(new Date(event.value),"yyyy-MM-dd")
        this.formAddNewAppointmentStaffStep2.controls['customerTime'].setValue(null);
        this.selectedTime=undefined;
        this.timeSlotArr= [];
        this.timeSlotArrForLabel= [];
        if(this.selectedServiceId != undefined){
          this.serviceCount[this.selectedServiceId].appointmentDate=date
        }
        // this.serviceCount[this.selectedServiceId].appointmentDate=date;
        this.selectedDate=date;
        console.log(JSON.stringify(this.serviceCount));
        if(this.selectedServiceId != undefined){
          this.fnGetTimeSlots(date);
        }
      }

      fnGetTimeSlots(date){
        this.isLoaderAdmin = true;
        let requestObject = {
          "business_id":this.bussinessId,
          "service_id":this.selectedServiceId,
          "staff_id":this.staffId,
          "book_date":date,
          "postal_code":this.formAddNewAppointmentStaffStep1.get('customerPostalCode').value
        };
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });

        this.http.post(`${environment.apiUrl}/staff-time-slots`,requestObject,{headers:headers} ).pipe(
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
            }
            else{
            } 
            this.isLoaderAdmin = false;
          },
          (err) =>{
            console.log(err)
          })
        }

        fnSelectTime(timeSlot){
          if(this.selectedServiceId != undefined){
            this.serviceCount[this.selectedServiceId].appointmentTimeSlot =timeSlot;
          }
          // this.serviceCount[this.selectedServiceId].appointmentTimeSlot =timeSlot;
          this.selectedTime=timeSlot;
          console.log(JSON.stringify(this.serviceCount));
        } 

        onBackClick(){
          this.secondStep=false;
        }

        fnNewAppointmentStep2(){
          if(this.formAddNewAppointmentStaffStep2.invalid){
            this.formAddNewAppointmentStaffStep2.get('customerCategory').markAsTouched();
            this.formAddNewAppointmentStaffStep2.get('customerSubCategory').markAsTouched();
            this.formAddNewAppointmentStaffStep2.get('customerService').markAsTouched();
            this.formAddNewAppointmentStaffStep2.get('customerDate').markAsTouched();
            this.formAddNewAppointmentStaffStep2.get('customerTime').markAsTouched();
            return false;
          }

          let serviceCartArrTemp:any= [];
          for(let i=0; i<this.serviceCount.length;i++){
            if(this.serviceCount[i] != null && this.serviceCount[i].count > 0){
              serviceCartArrTemp.push(this.serviceCount[i]);
            }
          }
          // if(serviceCartArrTemp[0].totalCost > 0){
          //   if(this.taxType == "P"){
          //     this.taxAmount= serviceCartArrTemp[0].totalCost * this.taxValue/100;
          //   }else{
          //     this.taxAmount= this.taxValue;
          //   }
          // }
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
         // this.netCost=serviceCartArrTemp[0].totalCost+this.taxAmount;
          console.log(JSON.stringify(serviceCartArrTemp));
          const currentDateTime = new Date();
          let requestObject = {
            "postal_code": this.formAddNewAppointmentStaffStep1.get('customerPostalCode').value,
            "business_id": this.bussinessId,
            "serviceInfo": serviceCartArrTemp,
            "customer_name": this.formAddNewAppointmentStaffStep1.get('customerFullName').value,
            "customer_email": this.formAddNewAppointmentStaffStep1.get('customerEmail').value,
            "customer_phone": this.formAddNewAppointmentStaffStep1.get('customerPhone').value,
            "appointment_address": this.formAddNewAppointmentStaffStep1.get('customerAddress').value,
            "appointment_state": this.formAddNewAppointmentStaffStep1.get('customerState').value,
            "appointment_city": this.formAddNewAppointmentStaffStep1.get('customerCity').value,
            "appointment_zipcode": this.formAddNewAppointmentStaffStep1.get('customerPostalCode').value,
            "coupon_code": '',
            "subtotal": serviceCartArrTemp[0].totalCost,
            "discount_type" : null,
            "discount_value" : null,
            "discount": 0,
            "tax": this.taxAmountArr,
            "nettotal": this.netCost,
            "created_by": "staff",
            "payment_method": "Cash",
            "order_date": this.datePipe.transform(currentDateTime,"yyyy-MM-dd hh:mm:ss") 
          };
          console.log(JSON.stringify(requestObject));
          let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'api-token': this.token,
            'staff-id': JSON.stringify(this.staffId),
          });
          this.http.post(`${environment.apiUrl}/order-create-check`,requestObject,{headers:headers} ).
          pipe(
          map((res) => {
            return res;
          }),
          ).subscribe((response:any) => {
            if(response.data == true){
              this._snackBar.open("Appointment created", "X", {
                  duration: 2000,
                  verticalPosition:'top',
                  panelClass :['green-snackbar']
              });
              this.dialogRef.close();
            }
            else{
                this._snackBar.open("Appointment not created", "X", {
                    duration: 2000,
                    verticalPosition:'top',
                    panelClass :['red-snackbar']
                });
            }
          },
          (err) =>{
            
          })
        }
      }



  @Component({
    selector: 'on-the-way-dialog',
    templateUrl: '../_dialogs/on-the-way-dialog.html',
  })
  export class DialogONTheWay {
    status: any;
    booking_id: any;
    notes: any;
    constructor(
      public dialogRef: MatDialogRef<DialogONTheWay>,
      public dialog: MatDialog,
      private StaffService: StaffService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {

        this.status = this.data.status;
        this.booking_id = this.data.booking_id 
      }

    onNoClick(): void {
      this.dialogRef.close();
    }
    changeBookingStatus(order_item_id, status){
      this.StaffService.changeStatus(order_item_id, status, this.notes).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          this.dialogRef.close();
        }
        else if(response.data == false) {
          this._snackBar.open("Appointment Not Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          }); 
          this.dialogRef.close();
        }
      })
    }

  }



  @Component({
    selector: 'work-started-dialog',
    templateUrl: '../_dialogs/work-started-dialog.html',
  })
  export class DialogWorkStarted {
    
    status: any;
    booking_id: any;
    notes: any;
    constructor(
      public dialogRef: MatDialogRef<DialogWorkStarted>,
      public dialog: MatDialog,
      private StaffService: StaffService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        
        this.status = this.data.status;
        this.booking_id = this.data.booking_id 
      }

    onNoClick(): void {
      this.dialogRef.close();
      
    }
    changeBookingStatus(order_item_id, status){
      this.StaffService.changeStatus(order_item_id, status, this.notes).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          this.dialogRef.close();
        }
        else if(response.data == false) {
          this._snackBar.open("Appointment Not Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          }); 
          this.dialogRef.close();
        }
      })
    }

  }
  
   @Component({
    selector: 'interrupted-dialog',
    templateUrl: '../_dialogs/interrupted-dialog.html',
  })
  export class DialogInterrupted {
     animal: any;
    
     bookingData: any;
     notes: any;
    constructor(
      public dialogRef: MatDialogRef<DialogInterrupted>,
      private StaffService: StaffService,
      private _snackBar: MatSnackBar,
    public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        
        this.bookingData = this.data.fulldata;
      }

    onNoClick(): void {
      this.dialogRef.close();
    }
    
    changeBookingStatus(){
    const dialogRef = this.dialog.open(InterruptedReschedule, {
          width: '500px',
          data : {fulldata: this.bookingData}
        });
          console.log(this.bookingData);
        dialogRef.afterClosed().subscribe(result => {
        
        
        });


      // this.StaffService.changeStatus(order_item_id, status, this.notes).subscribe((response:any) =>{
      //   if(response.data == true){
      //     this._snackBar.open("Appointment Updated", "X", {
      //       duration: 2000,
      //       verticalPosition:'top',
      //       panelClass :['green-snackbar']
      //     });
      //     this.dialogRef.close();
      //   }
      //   else if(response.data == false) {
      //     this._snackBar.open("Appointment Not Updated", "X", {
      //       duration: 2000,
      //       verticalPosition:'top',
      //       panelClass :['red-snackbar']
      //     }); 
      //     this.dialogRef.close();
      //   }
      // })
    }

  }


  @Component({
    selector: 'interrupted-reschedule',
    templateUrl: '../_dialogs/interrupted-reschedule.html',
    providers: [DatePipe]
  })
  export class InterruptedReschedule {
    formAppointmentRescheduleStaff:FormGroup;
    myAppoDetailData:any;
    minDate = new Date();
    timeSlotArr:any= [];
    availableStaff:any= [];
    constructor(
      public dialogRef: MatDialogRef<InterruptedReschedule>,
      private datePipe: DatePipe,
      private _formBuilder: FormBuilder,
      private http: HttpClient,
      private staffService: StaffService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.myAppoDetailData=this.data.fulldata;
      this.formAppointmentRescheduleStaff = this._formBuilder.group({
        rescheduleServiceId: [this.myAppoDetailData.id, Validators.required],
        rescheduleDate: ['', Validators.required],
        rescheduleTime: ['', Validators.required],
        rescheduleStaff: [this.myAppoDetailData.staff_id, Validators.required],
        rescheduleNote: [''],
      });
      this.formAppointmentRescheduleStaff.controls['rescheduleServiceId'].setValue(this.myAppoDetailData.service.id);
    }

    
    fnDateChange(event: MatDatepickerInputEvent<Date>) {
        console.log(this.datePipe.transform(new Date(event.value),"yyyy-MM-dd"));
        let date = this.datePipe.transform(new Date(event.value),"yyyy-MM-dd")
        this.formAppointmentRescheduleStaff.controls['rescheduleTime'].setValue(null);
        //this.formAppointmentRescheduleStaff.controls['rescheduleStaff'].setValue(null);
        this.timeSlotArr= [];
        this.availableStaff= [];
        this.fnGetTimeSlots(this.myAppoDetailData.service.id,date);
      }

      fnGetTimeSlots(rescheduleServiceId,rescheduleDate){
        let requestObject = {
          "business_id":2,
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
            else{
            }
          },
          (err) =>{
            console.log(err)
          })
        }
     
        fnChangeTimeSlot(event){
          console.log(event);
          //this.formAppointmentRescheduleStaff.controls['rescheduleStaff'].setValue(null);
          //this.fnGetStaff(event);
        }

        fnGetStaff(slot){
          let requestObject = {
            "bussiness_id":2,
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
            else{
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
    if(this.formAppointmentRescheduleStaff.invalid){
      return false;
    }

    console.log(this.myAppoDetailData.order_id);
    console.log(this.formAppointmentRescheduleStaff.get('rescheduleServiceId').value);
    console.log(this.datePipe.transform(new Date(this.formAppointmentRescheduleStaff.get('rescheduleDate').value),"yyyy-MM-dd"));
    console.log(this.formAppointmentRescheduleStaff.get('rescheduleTime').value);
    console.log(this.formAppointmentRescheduleStaff.get('rescheduleStaff').value);
    console.log(this.formAppointmentRescheduleStaff.get('rescheduleNote').value);
    let requestObject = {
     "order_item_id":JSON.stringify(this.myAppoDetailData.id),
     "staff_id":this.formAppointmentRescheduleStaff.get('rescheduleStaff').value,
     "book_date":this.datePipe.transform(new Date(this.formAppointmentRescheduleStaff.get('rescheduleDate').value),"yyyy-MM-dd"),
     "book_time":this.formAppointmentRescheduleStaff.get('rescheduleTime').value,
     "book_notes":this.formAppointmentRescheduleStaff.get('rescheduleNote').value
    };
    this.staffService.rescheduleAppointment(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Rescheduled", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
          this.dialogRef.close();
     }
      else if(response.data == false){
        this._snackBar.open("Appointment not Rescheduled", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
      }
    })
  }

  }


/* on click my appointment details*/

   @Component({
      selector: 'new-appointment-details',
      templateUrl: '../_dialogs/new-appointment-details.html',
  })
  export class DialogStaffMyAppointmentDetails {
    notes:any;
    detailData: any;
    bussinessId: any;
    cancellationBufferTime=new Date();
    minReschedulingTime=new Date();
    settingsArr:any=[];
    currencySymbol:any;
    currencySymbolPosition:any;
    currencySymbolFormat:any;
    activityLog:any=[];
    constructor(
      public dialogRef: MatDialogRef<DialogStaffMyAppointmentDetails>,
      private StaffService: StaffService,
      private _snackBar: MatSnackBar,
      private authenticationService: AuthenticationService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.detailData =  this.data.fulldata;
        this.fnGetActivityLog(this.detailData.id);
        this.bussinessId=this.authenticationService.currentUserValue.business_id
        console.log(this.detailData);
        this.fnGetSettingValue();
      }
    onNoClick(): void {
      this.dialogRef.close();
    }

    fnGetActivityLog(orderItemId){
      let requestObject = {
        "order_item_id":orderItemId
      };
      this.StaffService.getActivityLog(requestObject).subscribe((response:any) => {
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
      this.StaffService.getSettingValue(requestObject).subscribe((response:any) => {
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
          console.log(cancellation_buffer_time);
          console.log(min_rescheduling_time);
         
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
    
    changeBookingStatus(order_item_id, status){
      this.StaffService.changeStatus(order_item_id, status, this.notes).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          this.dialogRef.close();
        }
        else if(response.data == false) {
          this._snackBar.open("Appointment Not Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          }); 
          this.dialogRef.close();
        }
      })
    }

  }



   @Component({
      selector: 'ongoing-appointmet-details',
      templateUrl: '../_dialogs/ongoing-appointmet-details.html',
  providers: [DatePipe]
  })
  export class OnGoingAppointmentDetails {
    
  status: any;
  appoDetail: any;
  bussinessId: any;
  cancellationBufferTime=new Date();
  minReschedulingTime=new Date();
  settingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;
  booking_date_time:any;
  timeToServiceDecimal:any;
  activityLog:any=[];
    constructor(
      public dialogRef: MatDialogRef<OnGoingAppointmentDetails>,
      public dialog: MatDialog,
      public authenticationService: AuthenticationService,
      private datePipe: DatePipe,
      private StaffService: StaffService,
      @Inject(MAT_DIALOG_DATA) public data: any) {

        this.appoDetail = this.data.fuldata;
        console.log(this.appoDetail);
        this.fnGetActivityLog(this.appoDetail.id);
        this.bussinessId=this.authenticationService.currentUserValue.business_id
        this.fnGetSettingValue();
         var todayDateTime = new Date();
           this.booking_date_time=new Date( this.appoDetail.booking_date+" "+ this.appoDetail.booking_time);
          var dateTemp2 = new Date(this.datePipe.transform(this.booking_date_time,"dd MMM yyyy hh:mm a"));
           dateTemp2.setMinutes( dateTemp2.getMinutes());
          var serviceTimeTamp =  dateTemp2.getTime() - todayDateTime.getTime();
          this.timeToServiceDecimal=(serviceTimeTamp/60000).toFixed();



      }

      statuses: status[] = [
        {value: 'OW', viewValue: 'On The Way',statuses:''},
        {value: 'WS', viewValue: 'Work Started',statuses:''}
       
      ];

    onNoClick(): void {
      this.dialogRef.close();
    }

    fnGetActivityLog(orderItemId){
      let requestObject = {
        "order_item_id":orderItemId
      };
      this.StaffService.getActivityLog(requestObject).subscribe((response:any) => {
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
      this.StaffService.getSettingValue(requestObject).subscribe((response:any) => {
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
          console.log(cancellation_buffer_time);
          console.log(min_rescheduling_time);
         
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
    

    someMethod(booking_id, status): void {
      if(status == 'OW'){
        const dialogRef = this.dialog.open(DialogONTheWay, {
          width: '500px',
          data: {booking_id :booking_id, status: status}
        });
  
         dialogRef.afterClosed().subscribe(result => {
          this.status = result;
         });
      }
      if(status == 'WS'){
        const dialogRef = this.dialog.open(DialogWorkStarted, {
          width: '500px',
          data: {booking_id :booking_id, status: status}
        });
  
         dialogRef.afterClosed().subscribe(result => {
          this.status = result;
         });
      }
      if(status == 'ITR'){
        const dialogRef = this.dialog.open(DialogInterrupted, {
          width: '500px',
          data: {booking_id :booking_id, status: status}
        });
  
         dialogRef.afterClosed().subscribe(result => {
          this.status = result;
         });
      }
    }

  }

  @Component({
      selector: 'complete-appointment-details',
      templateUrl: '../_dialogs/complete-appointment-details.html',
  })
  export class CompleteAppointmentDetails {
    detailData: any;
    bussinessId: any;
    settingsArr:any=[];
    currencySymbol:any;
    currencySymbolPosition:any;
    currencySymbolFormat:any;
    activityLog:any=[];
    constructor(
      private authenticationService:AuthenticationService,
      private StaffService:StaffService,
      public dialogRef: MatDialogRef<CompleteAppointmentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.detailData = this.data.fuldata;
        console.log(this.detailData);
        this.fnGetActivityLog(this.detailData.id);
        this.bussinessId=this.authenticationService.currentUserValue.business_id
        this.fnGetSettingValue();
      }

    onNoClick(): void {
      this.dialogRef.close();
    }
    fnGetSettingValue(){
      let requestObject = {
        "business_id":this.bussinessId
      };
      this.StaffService.getSettingValue(requestObject).subscribe((response:any) => {
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

    fnGetActivityLog(orderItemId){
      let requestObject = {
        "order_item_id":orderItemId
      };
      this.StaffService.getActivityLog(requestObject).subscribe((response:any) => {
        if(response.data == true){
          console.log(response.response);
          this.activityLog=response.response;
        }
        else if(response.data == false){
          this.activityLog=[];
        }
      })
    }

  }

  /*Payment Module*/

  @Component({
      selector: 'cash-payment-mode',
      templateUrl: '../_dialogs/cash-payment-mode.html',
  })
  export class DialogCashPaymentMode {

    constructor(
      public dialogRef: MatDialogRef<DialogCashPaymentMode>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

  @Component({
      selector: 'online-payment-mode',
      templateUrl: '../_dialogs/online-payment-mode.html',
  })
  export class DialogOnlinePaymentMode {
    animal: any;
    paymentMethod:any = "Cash";
    appointDetailData:any;
    constructor(
      public dialogRef: MatDialogRef<DialogOnlinePaymentMode>,
      public dialog: MatDialog,
      private StaffService: StaffService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.appointDetailData = this.data.fuldata;
      }

    onNoClick(): void {
      this.dialogRef.close();
    }
    nextToPayment(){
      this.OnlinePaymentDetails(this.paymentMethod);
    }
    fnPaymentMethod(paymentMethod){
      this.paymentMethod = paymentMethod
    }
    OnlinePaymentDetails(paymentMethod) {
      const dialogRef = this.dialog.open(DialogOnlinePaymentDetails, {
        width: '500px',
        data: {paymentMethod :paymentMethod,appointDetailData: this.appointDetailData}
        
      });
  
       dialogRef.afterClosed().subscribe(result => {
         this.animal = result;
       });
       this.dialogRef.close();
    }

  }

   @Component({
      selector: 'cash-payment-details',
      templateUrl: '../_dialogs/cash-payment-details.html',
  })
  export class DialogCashPaymentDetails {

    constructor(
      public dialogRef: MatDialogRef<DialogCashPaymentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

   @Component({
      selector: 'online-payment-details',
      templateUrl: '../_dialogs/online-payment-details.html',
      providers: [DatePipe]
  })
  export class DialogOnlinePaymentDetails {
    appointDetailData:any;
    paymentMethod:any;
    staffPaymentNote:any;
    appointTax:any
    bussinessId:any;
    settingsArr:any;
    currencySymbol:any;
    currencySymbolPosition:any;
    currencySymbolFormat:any;
    closecoupon: string = "default"; 
    coupon = {
      couponcode_val: ""
    };
    couponIcon:any="check";
    isReadOnly:any="";
    showCouponError:boolean=false;
    couponErrorMessage:any;
    orderDiscount:any;
    taxType:any='P';
    finalOrderDiscount:any;
    couponType:any;
    couponValue:any;
    constructor(
      public dialogRef: MatDialogRef<DialogOnlinePaymentDetails>,
      private StaffService: StaffService,
      private _snackBar: MatSnackBar,
      private datePipe: DatePipe,
      private authenticationService : AuthenticationService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.appointDetailData = this.data.appointDetailData;
        this.appointTax = JSON.parse(this.appointDetailData.tax);
        console.log(this.appointDetailData);
        this.paymentMethod = this.data.paymentMethod;
        this.couponType = this.appointDetailData.discount_type
        this.couponValue = this.appointDetailData.discount_value
        this.orderDiscount = this.appointDetailData.discount
        this.bussinessId=this.authenticationService.currentUserValue.business_id
        this.fnGetSettingValue();
      }

    onNoClick(): void {
      this.dialogRef.close();
    }
    fnGetSettingValue(){
      let requestObject = {
        "business_id":this.bussinessId
      };
      this.StaffService.getSettingValue(requestObject).subscribe((response:any) => {
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
      let requestObject ={
        "business_id" : this.bussinessId,
        "service_id" : this.appointDetailData.service.id,
        "coupon_code" : this.coupon.couponcode_val,
      }
      this.StaffService.fncheckavailcoupon(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          console.log(response.response)
          let couponType = response.response.coupon_type;
          let couponValue = response.response.coupon_value;
          if(couponType == 'P'){
            this.orderDiscount = (this.appointDetailData.subtotal*parseInt(couponValue))/100;
          }else{
            this.orderDiscount = parseInt(couponValue);
          }
          var serviceAmountAfterDiscount= this.appointDetailData.subtotal - this.orderDiscount;
            var serviceTaxAmount=0;
            let taxMain=[];
            this.appointTax.forEach((element) => {
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
              this.appointDetailData.tax=JSON.stringify(taxMain);
              console.log(this.appointDetailData.tax);
            });
            this.appointTax = taxMain;
            this.couponType = couponType
            this.couponValue = couponValue
            this.appointDetailData.total_cost=serviceAmountAfterDiscount+serviceTaxAmount;

            console.log(this.appointDetailData);
          this._snackBar.open("Coupon Code Applied", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          this.couponIcon="close";
          this.closecoupon = 'valid';
          this.isReadOnly="readonly";
          this.showCouponError=false;
          this.couponErrorMessage="";
        }
        else if(response.data == false){
          this.closecoupon = 'invalid';
          this.couponIcon="check";
          this.isReadOnly="";
          this.showCouponError=true;
          this.couponErrorMessage=response.response;
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
      })  
    }
    confirmCashPayment(){
        let orders = {
          "tax" : this.appointDetailData.tax,
          "discount_type":this.couponType,
          "discount_value":this.couponValue,
          "discount" : this.orderDiscount,
          "nettotal" : this.appointDetailData.total_cost
        }
        let orderItems  = {
          "tax" : this.appointDetailData.tax,
          "discount_type":this.couponType,
          "discount_value":this.couponValue,
          "discount" : this.orderDiscount,
          "nettotal" : this.appointDetailData.total_cost
        }
        let payment  = {
          "payment_datetime" : this.datePipe.transform(new Date(),"yyyy/MM/dd hh::mm"),
          "payment_method" : this.paymentMethod,
          "amount" : this.appointDetailData.total_cost,
          "paymentnotes" : this.staffPaymentNote,
        }
        let requestObject ={
          "order_item_id" : this.appointDetailData.id,
          "orders" : orders,
          "orderItem" : orderItems,
          "payment" : payment
        }
        console.log(requestObject);
        this.StaffService.staffPayment(requestObject).subscribe((response:any) =>{
          if(response.data == true){
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition:'top',
              panelClass :['red-snackbar']
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
      cancelPayment(){
        this.dialogRef.close();
      }
  }



  
  
  

