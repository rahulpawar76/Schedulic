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
  search = {
    keyword: ""
  };
  openedTab :any = 0;
  
  creditcardform = false;
  showPaypalButtons = false;
  showPayUMoneyButton = false;
  paymentMethod:any="";
  transactionId : any;
  paymentDateTime: any;
  paymentScreen: boolean = false;
  onlynumeric = /^-?(0|[1-9]\d*)?$/

  cardForm:FormGroup;

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
    this.openedTab = event;
  }
  payAppoint(){
    this.paymentScreen = true;
  }
  fnPaymentMethod(paymentMethod){
    console.log(paymentMethod);
    if(paymentMethod == 'Cash'){
      this.creditcardform =false;
      this.showPaypalButtons =false;
      this.paymentMethod="Cash";
      this.transactionId=null;
      this.paymentDateTime=this.datePipe.transform(new Date(),"yyyy-MM-dd HH:mm:ss");
    }
    if(paymentMethod == 'stripe'){
      this.paymentMethod="stripe";
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
  confirmPayment(){
    
  }

  frontBooking(){
    this.router.navigate(['/booking']);
  }
  customerSearchAppointment(){
    alert(this.search.keyword);
    if(this.search.keyword.length > 2){
      let requestObject = {
        "search":this.search.keyword,
        "customer_id":this.customerId,
        "business_id":this.bussinessId
      }
      console.log(requestObject);
      this.UserService.customerSearchAppointment(requestObject).subscribe((response:any) =>{
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
	})
	export class DialogInvoiceDialog {
    myAppoDetailData: any;

	  constructor(
	    public dialogRef: MatDialogRef<DialogInvoiceDialog>,
	    @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
      }

	  onNoClick(): void {
	    this.dialogRef.close();
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
    constructor(
      public dialogRef: MatDialogRef<DialogCancelAppointmentDetails>,
      private authenticationService: AuthenticationService,
      private UserService: UserService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
        this.bussinessId=this.authenticationService.currentUserValue.business_id;
        this.fnGetSettingValue();
      }

    onNoClick(): void {
      this.dialogRef.close();
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
    constructor(
      public dialogRef: MatDialogRef<DialogMyAppointmentDetails>,
      private authenticationService: AuthenticationService,
      private UserService: UserService,
      private _snackBar: MatSnackBar,
       public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
        console.log(this.myAppoDetailData)
        this.index = this.data.index;
        console.log(this.index)
        this.bussinessId=this.authenticationService.currentUserValue.business_id;
        this.fnGetSettingValue();
      }
    onNoClick(): void {
      this.dialogRef.close();
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
    constructor(
      public dialogRef: MatDialogRef<DialogCompleteAppointmentDetails>,
      private authenticationService: AuthenticationService,
      private UserService: UserService,
      public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
        this.bussinessId=this.authenticationService.currentUserValue.business_id;
        this.fnGetSettingValue();
      }

    onNoClick(): void {
      this.dialogRef.close();
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


