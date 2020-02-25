import { Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { UserService } from '../_services/user.service';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DatePipe} from '@angular/common';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-userappointments',
  templateUrl: './userappointments.component.html',
  styleUrls: ['./userappointments.component.scss']
})
export class UserappointmentsComponent implements OnInit {
  animal: any;
  appointmentData : any;
  cancelAppointmentData: any;
  completedAppointmentData: any;

  constructor(
    public dialog: MatDialog,
     private http: HttpClient,
     private UserService: UserService,
     public router: Router,
     private _snackBar: MatSnackBar
     ) {
  }


ngOnInit() {

  this.getAllAppointments();
  this.getCancelAppointments();
  this.getCompletedAppointments();
}

getAllAppointments(): void{
  this.UserService.getAllAppointments().subscribe((response:any) =>{
    if(response.data == true){
      this.appointmentData = response.response;
    }
    else if(response.data == false){
      this.appointmentData = '';
    }
  })
}

getCancelAppointments(): void{
  this.UserService.getCancelAppointments().subscribe((response:any) =>{
    if(response.data == true){
      this.cancelAppointmentData = response.response;
    }
    else if(response.data == false){
      this.cancelAppointmentData = '';
    }
  })
}

getCompletedAppointments(): void{
  this.UserService.getCompletedAppointments().subscribe((response:any) =>{
    if(response.data == true){
      this.completedAppointmentData = response.response;
    }
    else if(response.data == false){
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
      this.animal = result;
     });
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

  rescheduleAppointment(index){
    const dialogRef = this.dialog.open(rescheduleAppointmentDialog, {
      
     // height: '700px',
      data: {fulldata: this.appointmentData[index]}

    });

     dialogRef.afterClosed().subscribe(result => {
      this.getAllAppointments();
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

  frontBooking(){
    this.router.navigate(['/booking']);
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
          window.location.reload();
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
          window.location.reload();
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
    constructor(
      public dialogRef: MatDialogRef<DialogCancelAppointmentDetails>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
      }

    onNoClick(): void {
      this.dialogRef.close();
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
    constructor(
      public dialogRef: MatDialogRef<DialogMyAppointmentDetails>,
       public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
        console.log(this.myAppoDetailData)
        this.index = this.data.index;
        console.log(this.index)
      }
    onNoClick(): void {
      this.dialogRef.close();
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
  minDate = new Date(2000, 0, 1);
  formAppointmentReschedule: FormGroup;
  timeSlotArr:any= [];
  availableStaff:any= [];
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
        let date = this.datePipe.transform(new Date(event.value),"yyyy-MM-dd")
        this.formAppointmentReschedule.controls['rescheduleTime'].setValue(null);
        this.formAppointmentReschedule.controls['rescheduleStaff'].setValue(null);
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
          this.formAppointmentReschedule.controls['rescheduleStaff'].setValue(null);
          this.fnGetStaff(event);
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
        this._snackBar.open("Appointment not Rescheduled", "X", {
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
    constructor(
      public dialogRef: MatDialogRef<DialogCompleteAppointmentDetails>,
      public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.myAppoDetailData = this.data.fulldata;
      }

    onNoClick(): void {
      this.dialogRef.close();
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


