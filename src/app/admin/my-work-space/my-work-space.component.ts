import { Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AdminService } from '../_services/admin-main.service'
import { DatePipe} from '@angular/common';

@Component({
  selector: 'app-my-work-space',
  templateUrl: './my-work-space.component.html',
  styleUrls: ['./my-work-space.component.scss'],
  providers: [DatePipe]
})
export class MyWorkSpaceComponent implements OnInit {
  animal :any;
  error:any;
  appointments:any=[];
  appointmentDetails = {
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
    service_name: ""
  };
  categories:any=[];
  businessId:any;
  revenue:any;
  selectedCategoryId:any;
  selectedCategoryName:any;
  selectedStatus:any;
  constructor(
    public dialog: MatDialog,
     private http: HttpClient,
     public router: Router,
     private adminService: AdminService,
     private _snackBar: MatSnackBar,
    private datePipe: DatePipe) {
       
      localStorage.setItem('isBusiness', 'false');
   }

  ngOnInit() {
    this.selectedCategoryId="all";
    this.selectedCategoryName="All Services";
    this.selectedStatus="all";
    this.businessId=localStorage.getItem('business_id');
    this.fnGetAllCategories();
    this.fnGetTodayRevenue();
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
      this.appointmentDetails.staffName=this.appointments[0].staff.firstname+" "+this.appointments[0].staff.lastname;
      this.appointmentDetails.customerName=this.appointments[0].customer.fullname;
      this.appointmentDetails.customerEmail=this.appointments[0].customer.email;
      this.appointmentDetails.customerPhone=this.appointments[0].customer.phone;
      this.appointmentDetails.customerAddress=this.appointments[0].customer.address+" "+this.appointments[0].customer.city+" "+this.appointments[0].customer.state+" "+this.appointments[0].customer.zip;
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
      this.appointmentDetails.staffName=this.appointments[i].staff.firstname+" "+this.appointments[i].staff.lastname;
      this.appointmentDetails.customerName=this.appointments[i].customer.fullname;
      this.appointmentDetails.customerEmail=this.appointments[i].customer.email;
      this.appointmentDetails.customerPhone=this.appointments[i].customer.phone;
      this.appointmentDetails.customerAddress=this.appointments[i].customer.address+" "+this.appointments[i].customer.city+" "+this.appointments[i].customer.state+" "+this.appointments[i].customer.zip;
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
  
  myworkspaceAccept() {
    const dialogRef = this.dialog.open(myWorkSpaceAcceptDialog, {
      width: '600px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
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


}



@Component({
  selector: 'myworkspace-accept',
  templateUrl: '../_dialogs/myworkspace-accept-dialog.html',
})
export class myWorkSpaceAcceptDialog {

  constructor(
    public dialogRef: MatDialogRef<myWorkSpaceAcceptDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
}

