import { Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AdminService } from '../_services/admin-main.service'
import { DatePipe} from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AppComponent } from '@app/app.component'

@Component({
  selector: 'app-my-work-space',
  templateUrl: './my-work-space.component.html',
  styleUrls: ['./my-work-space.component.scss'],
  providers: [DatePipe]
})
export class MyWorkSpaceComponent implements OnInit {
  adminSettings : boolean = false;
  animal :any;
  error:any;
  appointments:any=[];
  appointmentDetails = {
    id: "",
    serviceId: "",
    staffId: "",
    booking_date: "",
    booking_time: "",
    created_at: "",
    total_cost: "",
    service_time: "",
    order_by: "",
    order_status: "",
    staffName: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    booking_time_to: "",
    timeToService: "",
    categoryName: "",
    initials: "",
    service_name: ""
  };
  categories:any=[];
  businessId:any;
  revenue:any;
  selectedCategoryId:any;
  selectedCategoryName:any;
  activeBooking: any;
  selectedStatus:any;
  todayDate:any;
  availableStaff:any= [];
  selectedStaff:any;
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public router: Router,
    private adminService: AdminService,
    private _snackBar: MatSnackBar,
    private appComponent : AppComponent,
    private datePipe: DatePipe) {
    //this.appComponent.settingsModule(this.adminSettings);
    localStorage.setItem('isBusiness', 'false');
   }

  ngOnInit() {
    this.selectedCategoryId="all";
    this.selectedCategoryName="All Services";
    this.selectedStatus="all";
    this.businessId=localStorage.getItem('business_id');
    this.fnGetAllCategories();
    this.fnGetTodayRevenue();
    this.todayDate = this.datePipe.transform(new Date(),"dd MMM yyyy")
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

  fnGetAllAppointmentsByCategoryAndStatus(){
    let requestObject = {
            "business_id":this.businessId,
            "category":this.selectedCategoryId,
            "status_filter":this.selectedStatus
        };
     this.adminService.getAllAppointmentsByCategoryAndStatus(requestObject).subscribe((response:any) => 
  {
    if(response.data == true){
      this.appointments=response.response;
      this.appointments = this.appointments.sort(this.dynamicSort("booking_time"))
      this.activeBooking = 0;
      
      this.appointments.forEach( (element) => {
          var todayDateTime = new Date();
          element.booking_time=element.booking_date+" "+element.booking_time;
          var dateTemp = new Date(this.datePipe.transform(new Date(element.booking_time),"dd MMM yyyy hh:mm a"));
          dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
          var temp = dateTemp.getTime() - todayDateTime.getTime();
          element.timeToService=(temp/3600000).toFixed();
          element.booking_time=this.datePipe.transform(new Date(element.booking_time),"hh:mm a")
          element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
          for (var i = 0; i < this.categories.length; i++) {
            if(this.categories[i].id == element.service.category_id){
              element.service.category_name=this.categories[i].category_title;
            }
          }
           
        });
      this.appointmentDetails.id=this.appointments[0].id;
      this.appointmentDetails.serviceId=this.appointments[0].service_id;
      this.appointmentDetails.staffId=this.appointments[0].staff_id;
      this.appointmentDetails.booking_date=this.appointments[0].booking_date;
      this.appointmentDetails.booking_time=this.appointments[0].booking_time;
      this.appointmentDetails.created_at=this.appointments[0].created_at;
      this.appointmentDetails.service_name=this.appointments[0].service.service_name;
      this.appointmentDetails.categoryName=this.appointments[0].service.category_name;
      this.appointmentDetails.total_cost=this.appointments[0].total_cost;
      this.appointmentDetails.service_time=this.appointments[0].service_time;
      this.appointmentDetails.booking_time_to=this.appointments[0].booking_time_to;
      this.appointmentDetails.timeToService=this.appointments[0].timeToService;
      this.appointmentDetails.order_by=this.appointments[0].order_by;
      this.appointmentDetails.order_status=this.appointments[0].order_status;
      if(this.appointments[0].staff){
        this.appointmentDetails.staffName=this.appointments[0].staff.firstname+" "+this.appointments[0].staff.lastname;
      }
      this.appointmentDetails.customerName=this.appointments[0].customer.fullname;
      var splitted = this.appointmentDetails.customerName.split(" ",2);
      this.appointmentDetails.initials='';
      splitted.forEach( (element) => {
        this.appointmentDetails.initials=this.appointmentDetails.initials+element.charAt(0);
      });
      // var str = this.appointmentDetails.customerName;
      // var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
      // this.appointmentDetails.initials = matches.join(''); // JSON
      this.appointmentDetails.customerEmail=this.appointments[0].customer.email;
      this.appointmentDetails.customerPhone=this.appointments[0].customer.phone;
      this.appointmentDetails.customerAddress=this.appointments[0].customer.address+" "+this.appointments[0].customer.city+" "+this.appointments[0].customer.state+" "+this.appointments[0].customer.zip;
      if(this.appointmentDetails.order_status == "CNF" && this.appointments[0].staff_id == null){
        this.selectedStaff=null;
        this.availableStaff.length=0;
        this.fnGetStaff(this.appointmentDetails.booking_date,this.appointmentDetails.booking_time,this.appointmentDetails.serviceId);
        }
    }else{
      this.appointments=[];
    }
  },
    (err) => {
      this.error = err;
    }
  )
  }

  fnOnClickAppointment(i){
        this.activeBooking = i;
        this.appointmentDetails.id=this.appointments[i].id;
        this.appointmentDetails.serviceId=this.appointments[i].service_id;
        this.appointmentDetails.staffId=this.appointments[i].staff_id;
        this.appointmentDetails.booking_date=this.appointments[i].booking_date;
        this.appointmentDetails.booking_time=this.appointments[i].booking_time;
        this.appointmentDetails.created_at=this.appointments[i].created_at;
        this.appointmentDetails.service_name=this.appointments[i].service.service_name;
        this.appointmentDetails.categoryName=this.appointments[i].service.category_name;
        this.appointmentDetails.total_cost=this.appointments[i].total_cost;
        this.appointmentDetails.service_time=this.appointments[i].service_time;
        this.appointmentDetails.booking_time_to=this.appointments[i].booking_time_to;
        this.appointmentDetails.order_by=this.appointments[i].order_by;
        this.appointmentDetails.order_status=this.appointments[i].order_status;
        if(this.appointments[i].staff){
          this.appointmentDetails.staffName=this.appointments[i].staff.firstname+" "+this.appointments[i].staff.lastname;
        }
        this.appointmentDetails.customerName=this.appointments[i].customer.fullname;
        var splitted = this.appointmentDetails.customerName.split(" ",2);
        this.appointmentDetails.initials='';
        splitted.forEach( (element) => {
          this.appointmentDetails.initials=this.appointmentDetails.initials+element.charAt(0);
        });
        // var str = this.appointmentDetails.customerName;
        // var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
        // this.appointmentDetails.initials = matches.join(''); // JSON
        this.appointmentDetails.customerEmail=this.appointments[i].customer.email;
        this.appointmentDetails.customerPhone=this.appointments[i].customer.phone;
        this.appointmentDetails.customerAddress=this.appointments[i].customer.address+" "+this.appointments[i].customer.city+" "+this.appointments[i].customer.state+" "+this.appointments[i].customer.zip;
        if(this.appointmentDetails.order_status == "CNF" && this.appointments[i].staff_id == null){
        this.selectedStaff=null;
        this.availableStaff.length=0;
          this.fnGetStaff(this.appointmentDetails.booking_date,this.appointmentDetails.booking_time,this.appointmentDetails.serviceId);
        }
        
  }

  fnGetStaff(booking_date,booking_time,serviceId){
    let requestObject = {
      "business_id":this.businessId,
      "service_id":JSON.stringify(serviceId),
      "book_date":this.datePipe.transform(new Date(booking_date),"yyyy-MM-dd"),
      "book_time":booking_time
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

  fnOnClickStaff(event){
    alert(event.value);
    let requestObject = {
      "order_item_id":this.appointmentDetails.id,
      "staff_id":event.value
      };
    this.adminService.assignStaffToOrder(requestObject).subscribe((response:any) => 
    {
      alert(JSON.stringify(response));
      if(response.data == true){
          this._snackBar.open("Staff Assigned", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.fnGetAllAppointmentsByCategoryAndStatus();
        }
        else if(response.data == false){
          this._snackBar.open("Staff not Assigned", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
    },
    (err) => {
      this.error = err;
    })
  }

  fnGetAllCategories(){
    let requestObject = {
      "business_id":this.businessId,
      "status":"E"
      };
       this.adminService.getAllCategories(requestObject).subscribe((response:any) => 
    {
      if(response.data == true){
        this.categories=response.response;
        this.fnGetAllAppointmentsByCategoryAndStatus();
      }
    },
      (err) => {
        this.error = err;
      }
    )
  }

  fnGetTodayRevenue(){

    let requestObject = {
      "business_id":this.businessId,
      "category":this.selectedCategoryId
      };
       this.adminService.getTodayRevenue(requestObject).subscribe((response:any) => 
    {
      if(response.data == true){
        this.revenue=response.response;
      }
    },
      (err) => {
        this.error = err;
      }
    )
  }
  
  fnOnClickCategory(categoryId,categoryName){
    this.selectedCategoryId=categoryId;
    this.selectedCategoryName=categoryName;
    this.fnGetTodayRevenue();
    this.fnGetAllAppointmentsByCategoryAndStatus();
  }

  fnOnClickStatus(event){
    this.selectedStatus=event.value;
    this.fnGetAllAppointmentsByCategoryAndStatus();
  }
  
  rescheduleAppointment(){
    const dialogRef = this.dialog.open(InterruptedReschedule, {
      height: '700px',
      data : {appointmentDetails: this.appointmentDetails}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      this.fnGetAllAppointmentsByCategoryAndStatus();
    });
  }

  fnConfirmAppointment(){
      let requestObject = {
       "order_item_id":JSON.stringify(this.appointmentDetails.id),
       "status":"CNF"
      };
      this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Confirmed", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.fnGetAllAppointmentsByCategoryAndStatus();
        }
        else if(response.data == false){
          this._snackBar.open("Appointment not Confirmed", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
      })
    }
  
    fnCompleteAppointment(){
      let requestObject = {
       "order_item_id":JSON.stringify(this.appointmentDetails.id),
       "status":"CO"
      };
      this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Completed", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.fnGetAllAppointmentsByCategoryAndStatus();
        }
        else if(response.data == false){
          this._snackBar.open("Appointment not Completed", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
      })
    }
  
    fnCancelAppointment(){
      let requestObject = {
       "order_item_id":JSON.stringify(this.appointmentDetails.id),
       "status":"C"
      };
      this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Cancelled", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.fnGetAllAppointmentsByCategoryAndStatus();
        }
        else if(response.data == false){
          this._snackBar.open("Appointment not Cancelled", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
      })
    }
  }


@Component({
    selector: 'interrupted-reschedule-dialog',
    templateUrl: '../_dialogs/interrupted-reschedule-dialog.html',
    providers: [DatePipe]
  })
  export class InterruptedReschedule {
    formAppointmentRescheduleAdmin:FormGroup;
    appointmentDetails:any;
    businessId:any;
    selectedDate:any;
    selectedTimeSlot:any;
    selectedStaff:any;
    minDate = new Date(2000, 0, 1);
    timeSlotArr:any= [];
    availableStaff:any= [];
    constructor(
      public dialogRef: MatDialogRef<InterruptedReschedule>,
      private datePipe: DatePipe,
      private _formBuilder: FormBuilder,
      private http: HttpClient,
      private adminService: AdminService,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {

        this.businessId=localStorage.getItem('business_id');
        this.appointmentDetails=this.data.appointmentDetails;
        this.formAppointmentRescheduleAdmin = this._formBuilder.group({
          rescheduleDate: ['', Validators.required],
          rescheduleTime: ['', Validators.required],
          rescheduleStaff: ['', Validators.required],
          rescheduleNote: ['', Validators.required],
        });
    }

    
    fnDateChange(event:MatDatepickerInputEvent<Date>) {
        console.log(this.datePipe.transform(new Date(event.value),"yyyy-MM-dd"));
        let date = this.datePipe.transform(new Date(event.value),"yyyy-MM-dd")
        this.formAppointmentRescheduleAdmin.controls['rescheduleTime'].setValue(null);
        this.formAppointmentRescheduleAdmin.controls['rescheduleStaff'].setValue(null);
        this.timeSlotArr= [];
        this.availableStaff= [];
        this.selectedDate=date;
        this.fnGetTimeSlots(date);
      }

    fnGetTimeSlots(selectedDate){
      let requestObject = {
        "business_id":this.businessId,
        "selected_date":selectedDate
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
     
      fnChangeTimeSlot(selectedTimeSlot){
        console.log(selectedTimeSlot);
        this.formAppointmentRescheduleAdmin.controls['rescheduleStaff'].setValue(null);
        this.selectedTimeSlot=selectedTimeSlot;
        this.fnGetStaff(selectedTimeSlot);
      }

      fnGetStaff(selectedTimeSlot){
        let requestObject = {
          "business_id":this.businessId,
          "service_id":JSON.stringify(this.appointmentDetails.serviceId),
          "book_date":this.selectedDate,
          "book_time":this.selectedTimeSlot
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
    if(this.formAppointmentRescheduleAdmin.invalid){
      return false;
    }

    let requestObject = {
     "order_item_id":JSON.stringify(this.appointmentDetails.id),
     "staff_id":this.formAppointmentRescheduleAdmin.get('rescheduleStaff').value,
     "book_date":this.datePipe.transform(new Date(this.formAppointmentRescheduleAdmin.get('rescheduleDate').value),"yyyy-MM-dd"),
     "book_time":this.formAppointmentRescheduleAdmin.get('rescheduleTime').value,
     "book_notes":this.formAppointmentRescheduleAdmin.get('rescheduleNote').value
    };
    this.adminService.rescheduleAppointment(requestObject).subscribe((response:any) =>{
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

