import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../_services/admin-main.service'
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AppComponent } from '@app/app.component';
import { AuthenticationService } from '@app/_services';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { SharedService } from '@app/_services/shared.service';
// import * as _moment from 'moment';
// // tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';

// const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-my-work-space',
  templateUrl: './my-work-space.component.html',
  styleUrls: ['./my-work-space.component.scss'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class MyWorkSpaceComponent implements OnInit {
  adminSettings: boolean = false;
  animal: any;
  error: any;

  appointments: any = [];
  isLoaderAdmin: boolean = false;
  search = {
    keyword: ""
  };
  appointmentDetails = {
    id: "",
    serviceId: "",
    staffId: "",
    booking_date_time: "",
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
    postalCode: "",
    booking_time_to: "",
    timeToService: "",
    categoryName: "",
    initials: "",
    service_name: "",
    customer_id: "",
    bookingNotes: "",
    gl_time: "",
  };
  categories: any = [];
  businessId: any;
  filterDate: FormGroup;
  revenue: any;
  formSettingPage: boolean = false;
  selectedCategoryId: any;
  selectedCategoryName: any;
  activeBooking: any;
  selectedStatus: any;
  selectedDate: any;
  date: any;
  availableStaff: any = [];
  selectedCategory: any = 'all';
  selectedStaff: any;
  settingsArr: any;
  cancellationBufferTime: any;
  minReschedulingTime: any;
  currencySymbol: any;
  currencySymbolPosition: any;
  currencySymbolFormat: any;
  singleBookingNotes: any;
  currentUser: any;
  activityLog: any = [];
  singlenote: any;
  startWorkSpacePage: boolean = true;
  bookingTypeView: any = 'all';
  dateTypeFilter:any='today';
  dateTypeFilterView:any=new Date();
  selectedDateRange:any;
  selectedStartDate:any;
  selectedEndDate:any;
  pendingBookingCount:number=0;
  @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective: DaterangepickerDirective;
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    public router: Router,
    private adminService: AdminService,
    private _snackBar: MatSnackBar,    private appComponent: AppComponent,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe,
    private sharedService: SharedService) {
    localStorage.setItem('isPOS', 'false');
    localStorage.setItem('isBusiness', 'false');
    this.businessId = localStorage.getItem('business_id');
    this.sharedService.updateSideMenuState(true);
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.filterDate = this._formBuilder.group({
      filterDate: [''],
    });

    this.dateTypeFilterView=this.datePipe.transform(new Date(), 'd MMM, y');

    this.selectedStartDate=this.datePipe.transform(new Date(),"yyyy-MM-dd");
    this.selectedEndDate=this.datePipe.transform(new Date(),"yyyy-MM-dd");
  }

  ngOnInit() {
    this.selectedCategoryId = "all";
    this.selectedCategoryName = "Services";
    this.selectedStatus = "all";
    this.selectedDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    this.date = new FormControl(new Date());
    this.fnGetSettingValue();
    this.fnGetAllCategories();
    this.fnGetTodayRevenue();
  }

  fnGetSettingValue() {
    let requestObject = {
      "business_id": this.businessId
    };
    this.adminService.getSettingValue(requestObject).subscribe((response: any) => {

      if (response.data == true && response.response != '') {
        this.settingsArr = response.response;
        this.currencySymbol = this.settingsArr.currency;
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        this.currencySymbolFormat = this.settingsArr.currency_format;
        let cancellation_buffer_time = JSON.parse(this.settingsArr.cancellation_buffer_time);
        let min_rescheduling_time = JSON.parse(this.settingsArr.min_reseduling_time);
        this.cancellationBufferTime = new Date();
        this.cancellationBufferTime.setMinutes(this.cancellationBufferTime.getMinutes() + cancellation_buffer_time);
        this.minReschedulingTime = new Date();
        this.minReschedulingTime.setMinutes(this.minReschedulingTime.getMinutes() + min_rescheduling_time);
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    })
  }

  fnDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = this.datePipe.transform(new Date(event.value), "yyyy-MM-dd");
    this.fnGetTodayRevenue();
    this.fnGetAllAppointmentsByCategoryAndStatus();
  }

  fnOpenNote() {
    if (this.formSettingPage == false) {
      this.formSettingPage = true;
    } else {
      this.formSettingPage = false;
    }

  }

  fnGetBookingNotes(bookingId) {
    let requestObject = {
      "order_item_id": bookingId
    };
    this.adminService.getBookingNotes(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.singleBookingNotes = response.response;

      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition: 'top',
        //   panelClass: ['red-snackbar']
        // });
      }
    })
  }

  fnSaveBookingNotes(orderItemId) {
    if (this.singlenote == undefined || this.singlenote == "") {
      return false;
    }
    let requestObject = {
      "order_item_id": orderItemId,
      "user_id": this.currentUser.user_id,
      "user_type": 'A',
      "note_type": 'normal',
      "notes": this.singlenote
    };
    this.adminService.saveBookingNotes(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Booking note added successfully.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.singlenote = "";
        this.formSettingPage = false;
        this.fnGetAllAppointmentsByCategoryAndStatus();
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    })
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
  fnselectCategoryActive(i) {
    this.selectedCategory = i;
  }
  
  fnGetAllAppointmentsByCategoryAndStatus() {
    this.isLoaderAdmin = true;
    let requestObject = {
      "business_id": this.businessId,
      "category": this.selectedCategoryId,
      "status_filter": this.selectedStatus,
      "booking_date": this.dateTypeFilter,
      "start_date":this.selectedStartDate,
      "end_date":this.selectedEndDate
    };
    this.adminService.getAllAppointmentsByCategoryAndStatus(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.appointments = response.response;
        this.appointments = this.appointments.sort(this.dynamicSort("booking_time"))
        this.activeBooking = 0;
        this.fnGetPendingCount();
        this.appointments.forEach((element) => {
          var todayDateTime = new Date();
          element.booking_date_time = new Date(element.booking_date + " " + element.booking_time);
          var dateTemp = new Date(this.datePipe.transform(element.booking_date_time, "dd MMM yyyy hh:mm a"));
          dateTemp.setMinutes(dateTemp.getMinutes() + parseInt(element.service_time));
          var temp = dateTemp.getTime() - todayDateTime.getTime();
          element.timeToService = (temp / 3600000).toFixed();
          element.booking_time = this.datePipe.transform(element.booking_date_time, "hh:mm a")
          element.booking_time_to = this.datePipe.transform(new Date(dateTemp), "hh:mm a")
          element.booking_date = this.datePipe.transform(new Date(element.booking_date), "dd MMM yyyy")
          element.created_at = this.datePipe.transform(new Date(element.created_at), "dd MMM yyyy @ hh:mm a")
          for (var i = 0; i < this.categories.length; i++) {
            if (this.categories[i].id == element.service.category_id) {
              element.service.category_name = this.categories[i].category_title;
            }
          }
        });
        this.appointmentDetails.id = this.appointments[0].id;
        this.appointmentDetails.serviceId = this.appointments[0].service_id;
        this.appointmentDetails.staffId = this.appointments[0].staff_id;
        this.appointmentDetails.booking_date = this.appointments[0].booking_date;
        this.appointmentDetails.booking_time = this.appointments[0].booking_time;
        this.appointmentDetails.booking_date_time = this.appointments[0].booking_date_time;
        this.appointmentDetails.created_at = this.appointments[0].created_at;
        this.appointmentDetails.service_name = this.appointments[0].service.service_name;
        this.appointmentDetails.categoryName = this.appointments[0].service.category_name;
        this.appointmentDetails.total_cost = this.appointments[0].total_cost;
        this.appointmentDetails.service_time = this.appointments[0].service_time;
        this.appointmentDetails.booking_time_to = this.appointments[0].booking_time_to;
        this.appointmentDetails.timeToService = this.appointments[0].timeToService;
        this.appointmentDetails.order_by = this.appointments[0].order_by;
        this.appointmentDetails.order_status = this.appointments[0].order_status;
        this.appointmentDetails.customer_id = this.appointments[0].customer.id;
        if (this.appointments[0].staff) {
          this.appointmentDetails.staffName = this.appointments[0].staff.firstname + " " + this.appointments[0].staff.lastname;
        }
        this.appointmentDetails.customerName = this.appointments[0].customer.fullname;
        var splitted = this.appointmentDetails.customerName.split(" ", 2);
        this.appointmentDetails.initials = '';
        splitted.forEach((element) => {
          this.appointmentDetails.initials = this.appointmentDetails.initials + element.charAt(0);
        });
        // var str = this.appointmentDetails.customerName;
        // var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
        // this.appointmentDetails.initials = matches.join(''); // JSON
        this.appointmentDetails.customerEmail = this.appointments[0].customer.email;
        this.appointmentDetails.customerPhone = this.appointments[0].customer.phone;
        this.appointmentDetails.customerAddress = this.appointments[0].customer.address + " " + this.appointments[0].customer.city + " " + this.appointments[0].customer.state + " " + this.appointments[0].customer.zip;
        this.appointmentDetails.postalCode = this.appointments[0].postal_code;
        this.formSettingPage = false;
        this.appointmentDetails.bookingNotes = this.appointments[0].booking_notes;
        this.fnGetActivityLog(this.appointmentDetails.id);
        this.fnGetBookingNotes(this.appointmentDetails.id);

        if (this.appointmentDetails.order_status == "CNF" && this.appointments[0].staff_id == null) {
          this.selectedStaff = null;
          this.availableStaff.length = 0;
          this.fnGetStaff(this.appointmentDetails.booking_date, this.appointmentDetails.customer_id, this.appointmentDetails.booking_time, this.appointmentDetails.serviceId, this.appointmentDetails.postalCode);
        }
      } else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        this.appointments = [];
      }

    this.isLoaderAdmin = false;
    },
      (err) => {
        this.error = err;
      });
  }

  fnGetPendingCount() {
    this.isLoaderAdmin = true;
    let requestObject = {
      "business_id": this.businessId,
      "category": this.selectedCategoryId,
      "status_filter": 'P',
      "booking_date": this.dateTypeFilter,
      "start_date":this.selectedStartDate,
      "end_date":this.selectedEndDate
    };
    this.adminService.getAllAppointmentsByCategoryAndStatus(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.pendingBookingCount = response.response.length;
      } else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    this.isLoaderAdmin = false;
    },
      (err) => {
        this.error = err;
      });
  }

  fnOnClickAppointment(i) {
    this.activeBooking = i;
    this.appointmentDetails.id = this.appointments[i].id;
    this.appointmentDetails.serviceId = this.appointments[i].service_id;
    this.appointmentDetails.staffId = this.appointments[i].staff_id;
    this.appointmentDetails.booking_date = this.appointments[i].booking_date;
    this.appointmentDetails.booking_time = this.appointments[i].booking_time;
    this.appointmentDetails.booking_date_time = this.appointments[i].booking_date_time;
    this.appointmentDetails.created_at = this.appointments[i].created_at;
    this.appointmentDetails.service_name = this.appointments[i].service.service_name;
    this.appointmentDetails.categoryName = this.appointments[i].service.category_name;
    this.appointmentDetails.total_cost = this.appointments[i].total_cost;
    this.appointmentDetails.service_time = this.appointments[i].service_time;
    this.appointmentDetails.booking_time_to = this.appointments[i].booking_time_to;
    this.appointmentDetails.order_by = this.appointments[i].order_by;
    this.appointmentDetails.order_status = this.appointments[i].order_status;
    this.appointmentDetails.customer_id = this.appointments[i].customer.id;
    if (this.appointments[i].staff) {
      this.appointmentDetails.staffName = this.appointments[i].staff.firstname + " " + this.appointments[i].staff.lastname;
    }
    this.appointmentDetails.customerName = this.appointments[i].customer.fullname;
    var splitted = this.appointmentDetails.customerName.split(" ", 2);
    this.appointmentDetails.initials = '';
    splitted.forEach((element) => {
      this.appointmentDetails.initials = this.appointmentDetails.initials + element.charAt(0);
    });
    // var str = this.appointmentDetails.customerName;
    // var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
    // this.appointmentDetails.initials = matches.join(''); // JSON
    this.appointmentDetails.customerEmail = this.appointments[i].customer.email;
    this.appointmentDetails.customerPhone = this.appointments[i].customer.phone;
    this.appointmentDetails.customerAddress = this.appointments[i].customer.address + " " + this.appointments[i].customer.city + " " + this.appointments[i].customer.state + " " + this.appointments[i].customer.zip;
    this.appointmentDetails.postalCode = this.appointments[i].customer.zip;
    this.formSettingPage = false;
    this.appointmentDetails.bookingNotes = this.appointments[i].booking_notes;
    this.fnGetActivityLog(this.appointmentDetails.id);
    this.fnGetBookingNotes(this.appointmentDetails.id);
    if (this.appointmentDetails.order_status == "CNF" && this.appointments[i].staff_id == null) {
      this.selectedStaff = null;
      this.availableStaff.length = 0;
      this.fnGetStaff(this.appointmentDetails.booking_date, this.appointmentDetails.customer_id, this.appointmentDetails.booking_time, this.appointmentDetails.serviceId, this.appointmentDetails.postalCode);
    }

  }

  fnGetActivityLog(orderItemId) {
    let requestObject = {
      "order_item_id": orderItemId
    };
    this.adminService.getActivityLog(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.activityLog = response.response;
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition:'top',
        //   panelClass :['red-snackbar']
        // });
        this.activityLog = [];
      }
    })
  }

  fnGetStaff(booking_date, customerID, booking_time, serviceId, postal_code) {
    let requestObject = {
      "postal_code": postal_code,
      "business_id": this.businessId,
      "customer_id": customerID,
      "service_id": JSON.stringify(serviceId),
      "book_date": this.datePipe.transform(new Date(booking_date), "yyyy-MM-dd"),
      "book_time": booking_time
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/service-staff`, requestObject, { headers: headers }).pipe(
      map((res) => {
        return res;
      }),
      //catchError(this.handleError)
    ).subscribe((response: any) => {
      if (response.data == true) {
        this.availableStaff = response.response;
      }
      else {
        this.availableStaff.length = 0;
      }
    },
      (err) => {
      })
  }

  fnOnClickStaff(event) {
    let requestObject = {
      "order_item_id": this.appointmentDetails.id,
      "staff_id": event.value
    };
    this.adminService.assignStaffToOrder(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Staff Assigned.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.fnGetAllAppointmentsByCategoryAndStatus();
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    },
      (err) => {
        this.error = err;
      })
  }

  fnGetAllCategories() {
    let requestObject = {
      "business_id": this.businessId,
      "status": "E"
    };
    this.adminService.getAllCategories(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.categories = response.response;
        this.fnGetAllAppointmentsByCategoryAndStatus();
        this.fnGetPendingCount();
        this.startWorkSpacePage = false;
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition:'top',
        //   panelClass :['red-snackbar']
        // });
        this.startWorkSpacePage = true;
      }
    },
      (err) => {
        this.error = err;
      }
    )
  }
  goToCategory() {
    this.router.navigate(['/admin/settings/']);
  }
  goToSupport() {
    this.router.navigate(['/admin/support/']);
  }

  fnGetTodayRevenue() {

    let requestObject = {
      "business_id": this.businessId,
      "category": this.selectedCategoryId,
      "booking_date": this.selectedDate
    };
    this.adminService.getTodayRevenue(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.revenue = response.response;
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    },
      (err) => {
        this.error = err;
      }
    )
  }

  fnOnClickCategory(categoryId, categoryName) {
    this.selectedCategoryId = categoryId;
    this.selectedCategoryName = categoryName;
    this.formSettingPage = false;
    this.fnGetTodayRevenue();
    this.fnGetAllAppointmentsByCategoryAndStatus();
  }

  fnOnClickStatus(event) {
    this.selectedStatus = event;
    this.formSettingPage = false;
    this.fnGetAllAppointmentsByCategoryAndStatus();
  }

  rescheduleAppointment() {
    const dialogRef = this.dialog.open(InterruptedReschedule, {
      height: '700px',
      data: { appointmentDetails: this.appointmentDetails }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fnGetAllAppointmentsByCategoryAndStatus();
    });
  }
  openDateRangeSelection() {
    const dialogRef = this.dialog.open(dateRangeSelectDialog, {
      height: '700px',
      panelClass: 'without_border',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        if(result.start_date){
          this.selectedStartDate=this.datePipe.transform(new Date(result.start_date),"yyyy-MM-dd");
        }
        if(result.end_date){
          this.selectedEndDate=this.datePipe.transform(new Date(result.end_date),"yyyy-MM-dd");
        }
      }
      this.fnGetAllAppointmentsByCategoryAndStatus();
    });
  }

  fnConfirmAppointment() {
    let requestObject = {
      "order_item_id": JSON.stringify(this.appointmentDetails.id),
      "status": "CNF"
    };
    this.adminService.updateAppointmentStatus(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Appointment Confirmed.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.fnGetAllAppointmentsByCategoryAndStatus();
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    })
  }

  fnCompleteAppointment() {
    let requestObject = {
      "order_item_id": JSON.stringify(this.appointmentDetails.id),
      "status": "CO"
    };
    this.adminService.updateAppointmentStatus(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Appointment Completed.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.fnGetAllAppointmentsByCategoryAndStatus();
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    })
  }

  fnCancelAppointment() {
    let requestObject = {
      "order_item_id": JSON.stringify(this.appointmentDetails.id),
      "status": "C"
    };
    this.adminService.updateAppointmentStatus(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Appointment Cancelled.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.fnGetAllAppointmentsByCategoryAndStatus();
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    })
  }
  todayBookingSearch() {
    this.isLoaderAdmin = true;
    if (this.search.keyword.length > 1) {
      let requestObject = {
        "search": this.search.keyword,
        "business_id": this.businessId,
        "category": this.selectedCategoryId,
        "status_filter": this.selectedStatus,
        "booking_date": this.selectedDate
      }
      this.adminService.todayBookingSearch(requestObject).subscribe((response: any) => {
        if (response.data == true) {
          this.appointments = response.response;
          this.appointments = this.appointments.sort(this.dynamicSort("booking_time"))
          this.activeBooking = 0;

          this.appointments.forEach((element) => {
            var todayDateTime = new Date();
            element.booking_date_time = new Date(element.booking_date + " " + element.booking_time);
            var dateTemp = new Date(this.datePipe.transform(element.booking_date_time, "dd MMM yyyy hh:mm a"));
            dateTemp.setMinutes(dateTemp.getMinutes() + parseInt(element.service_time));
            var temp = dateTemp.getTime() - todayDateTime.getTime();
            element.timeToService = (temp / 3600000).toFixed();
            element.booking_time = this.datePipe.transform(element.booking_date_time, "hh:mm a")
            element.booking_time_to = this.datePipe.transform(new Date(dateTemp), "hh:mm a")
            element.booking_date = this.datePipe.transform(new Date(element.booking_date), "dd MMM yyyy")
            element.created_at = this.datePipe.transform(new Date(element.created_at), "dd MMM yyyy @ hh:mm a")
            for (var i = 0; i < this.categories.length; i++) {
              if (this.categories[i].id == element.service.category_id) {
                element.service.category_name = this.categories[i].category_title;
              }
            }
          });
          this.appointmentDetails.id = this.appointments[0].id;
          this.appointmentDetails.serviceId = this.appointments[0].service_id;
          this.appointmentDetails.staffId = this.appointments[0].staff_id;
          this.appointmentDetails.booking_date = this.appointments[0].booking_date;
          this.appointmentDetails.booking_time = this.appointments[0].booking_time;
          this.appointmentDetails.booking_date_time = this.appointments[0].booking_date_time;
          this.appointmentDetails.created_at = this.appointments[0].created_at;
          this.appointmentDetails.service_name = this.appointments[0].service.service_name;
          this.appointmentDetails.categoryName = this.appointments[0].service.category_name;
          this.appointmentDetails.total_cost = this.appointments[0].total_cost;
          this.appointmentDetails.service_time = this.appointments[0].service_time;
          this.appointmentDetails.booking_time_to = this.appointments[0].booking_time_to;
          this.appointmentDetails.timeToService = this.appointments[0].timeToService;
          this.appointmentDetails.order_by = this.appointments[0].order_by;
          this.appointmentDetails.order_status = this.appointments[0].order_status;
          if (this.appointments[0].staff) {
            this.appointmentDetails.staffName = this.appointments[0].staff.firstname + " " + this.appointments[0].staff.lastname;
          }
          this.appointmentDetails.customerName = this.appointments[0].customer.fullname;
          var splitted = this.appointmentDetails.customerName.split(" ", 2);
          this.appointmentDetails.initials = '';
          splitted.forEach((element) => {
            this.appointmentDetails.initials = this.appointmentDetails.initials + element.charAt(0);
          });
          // var str = this.appointmentDetails.customerName;
          // var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
          // this.appointmentDetails.initials = matches.join(''); // JSON
          this.appointmentDetails.customerEmail = this.appointments[0].customer.email;
          this.appointmentDetails.customerPhone = this.appointments[0].customer.phone;
          this.appointmentDetails.customerAddress = this.appointments[0].customer.address + " " + this.appointments[0].customer.city + " " + this.appointments[0].customer.state + " " + this.appointments[0].customer.zip;
          this.appointmentDetails.postalCode = this.appointments[0].postal_code;
          if (this.appointmentDetails.order_status == "CNF" && this.appointments[0].staff_id == null) {
            this.selectedStaff = null;
            this.availableStaff.length = 0;
            this.fnGetStaff(this.appointmentDetails.booking_date, this.appointmentDetails.customer_id, this.appointmentDetails.booking_time, this.appointmentDetails.serviceId, this.appointmentDetails.postalCode);
          }
          this.isLoaderAdmin = false;
        }
        else if (response.data == false && response.response !== 'api token or userid invaild') {
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
          });
          this.appointments = [];
          this.isLoaderAdmin = false;
        }
      })
    } else {
      this.fnGetAllAppointmentsByCategoryAndStatus();
      this.isLoaderAdmin = false;
    }
  }

  fnChangeBookingStatus(type){
    this.bookingTypeView = type;
      this.selectedStatus = type;
    // this.formSettingPage = false;
    this.fnGetAllAppointmentsByCategoryAndStatus();
  }

  fnChangeDateFilter(dateType){
    this.dateTypeFilter= dateType;
    if(dateType == 'today'){
      this.dateTypeFilterView = this.datePipe.transform(new Date(), 'd MMM, y');
    }else if(dateType == 'tomorrow'){
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      this.dateTypeFilterView = this.datePipe.transform(tomorrow, 'd MMM, y');
    }else if(dateType == 'week'){
      var curr = new Date; // get current date
      var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
      var last = first + 6; // last day is the first day + 6
      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(last)).toUTCString();
      this.dateTypeFilterView = this.datePipe.transform(firstday, 'd MMM, y') +' to '+this.datePipe.transform(lastday, 'd MMM, y')
    }else if(dateType == 'month'){
      this.dateTypeFilterView = this.datePipe.transform(new Date(), 'MMMM')
    }else if(dateType == 'year'){
      this.dateTypeFilterView = this.datePipe.transform(new Date(), 'y')
    }else if(dateType == 'custom'){
      this.dateTypeFilterView = this.selectedStartDate+' To '+this.selectedEndDate
    }
    this.fnGetAllAppointmentsByCategoryAndStatus();
  }

}


@Component({
  selector: 'interrupted-reschedule-dialog-workspace',
  templateUrl: '../_dialogs/reschedule-appointment-dialog.html',
  providers: [DatePipe]
})
export class InterruptedReschedule {
  formAppointmentRescheduleAdmin: FormGroup;
  detailsData: any;
  businessId: any;
  selectedDate: any;
  selectedTimeSlot: any;
  selectedStaff: any;
  minDate = new Date();
  maxDate = new Date();
  timeSlotArr: any = [];
  availableStaff: any = [];
  myFilter: any;
  offDaysList: any = [];
  workingHoursOffDaysList: any = [];
  settingsArr: any = [];
  minimumAdvanceBookingTime: any;
  maximumAdvanceBookingTime: any;
  minimumAdvanceBookingDateTimeObject: any;
  maximumAdvanceBookingDateTimeObject: any;
  constructor(
    public dialogRef: MatDialogRef<InterruptedReschedule>,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private adminService: AdminService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.businessId = localStorage.getItem('business_id');
    this.detailsData = this.data.appointmentDetails;
    this.formAppointmentRescheduleAdmin = this._formBuilder.group({
      rescheduleDate: ['', Validators.required],
      rescheduleTime: ['', Validators.required],
      rescheduleStaff: ['', Validators.required],
      rescheduleNote: ['', Validators.required],
    });
    this.fnGetSettingValue();
    this.fnGetOffDays();

    this.myFilter = (d: Date | null): boolean => {
      // const day = (d || new Date()).getDay();
      // const month = (d || new Date()).getMonth();
      // Prevent Saturday and Sunday from being selected.
      // return day !== 0 && day !== 6;
      let temp: any;
      let temp2: any;
      if (this.offDaysList.length > 0 || this.workingHoursOffDaysList.length > 0) {
        for (var i = 0; i < this.offDaysList.length; i++) {
          var offDay = new Date(this.offDaysList[i]);
          if (i == 0) {
            temp = (d.getMonth() + 1 !== offDay.getMonth() + 1 || d.getDate() !== offDay.getDate());
          } else {
            temp = temp && (d.getMonth() + 1 !== offDay.getMonth() + 1 || d.getDate() !== offDay.getDate());
          }
        }
        for (var i = 0; i < this.workingHoursOffDaysList.length; i++) {
          if (this.offDaysList.length > 0) {
            temp = temp && (d.getDay() !== this.workingHoursOffDaysList[i]);
          } else {
            temp = (d.getDay() !== this.workingHoursOffDaysList[i]);
          }
        }
        //return (d.getMonth()+1!==4 || d.getDate()!==30) && (d.getMonth()+1!==5 || d.getDate()!==15);
        return temp;
      } else {
        return true;
      }
    }
  }

  fnGetSettingValue() {
    let requestObject = {
      "business_id": this.businessId
    };
    this.adminService.getSettingValue(requestObject).subscribe((response: any) => {
      if (response.data == true && response.response != '') {
        this.settingsArr = response.response;

        this.minimumAdvanceBookingTime = JSON.parse(this.settingsArr.min_advance_booking_time);
        this.maximumAdvanceBookingTime = JSON.parse(this.settingsArr.max_advance_booking_time);

        this.minimumAdvanceBookingDateTimeObject = new Date();
        this.minimumAdvanceBookingDateTimeObject.setMinutes(this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime);
        this.minDate = this.minimumAdvanceBookingDateTimeObject;

        this.maximumAdvanceBookingDateTimeObject = new Date();
        this.maximumAdvanceBookingDateTimeObject.setMinutes(this.maximumAdvanceBookingDateTimeObject.getMinutes() + this.maximumAdvanceBookingTime);
        this.maxDate = this.maximumAdvanceBookingDateTimeObject;
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    })
  }

  fnGetOffDays() {
    let requestObject = {
      "business_id": this.businessId
    };
    this.adminService.getOffDays(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        if (response.response.holidays.length > 0) {
          this.offDaysList = response.response.holidays;
        } else {
          this.offDaysList = [];
        }
        if (response.response.offday.length > 0) {
          this.workingHoursOffDaysList = response.response.offday;
        } else {
          this.workingHoursOffDaysList = [];
        }

        this.myFilter = (d: Date | null): boolean => {
          // const day = (d || new Date()).getDay();
          // const month = (d || new Date()).getMonth();
          // Prevent Saturday and Sunday from being selected.
          // return day !== 0 && day !== 6;
          let temp: any;
          let temp2: any;
          if (this.offDaysList.length > 0 || this.workingHoursOffDaysList.length > 0) {
            for (var i = 0; i < this.offDaysList.length; i++) {
              var offDay = new Date(this.offDaysList[i]);
              if (i == 0) {
                temp = (d.getMonth() + 1 !== offDay.getMonth() + 1 || d.getDate() !== offDay.getDate());
              } else {
                temp = temp && (d.getMonth() + 1 !== offDay.getMonth() + 1 || d.getDate() !== offDay.getDate());
              }
            }
            for (var i = 0; i < this.workingHoursOffDaysList.length; i++) {
              if (this.offDaysList.length > 0) {
                temp = temp && (d.getDay() !== this.workingHoursOffDaysList[i]);
              } else {
                temp = (d.getDay() !== this.workingHoursOffDaysList[i]);
              }
            }
            //return (d.getMonth()+1!==4 || d.getDate()!==30) && (d.getMonth()+1!==5 || d.getDate()!==15);
            return temp;
          } else {
            return true;
          }
        }
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });

      }
    },
      (err) => {
        console.log(err)
      })
  }

  fnDateChange(event: MatDatepickerInputEvent<Date>) {
    let date = this.datePipe.transform(new Date(event.value), "yyyy-MM-dd")
    this.formAppointmentRescheduleAdmin.controls['rescheduleTime'].setValue(null);
    this.formAppointmentRescheduleAdmin.controls['rescheduleStaff'].setValue(null);
    this.timeSlotArr = [];
    this.availableStaff = [];
    this.selectedDate = date;
    this.fnGetTimeSlots(date);
  }

  fnGetTimeSlots(selectedDate) {
    let requestObject = {
      "business_id": this.businessId,
      "selected_date": selectedDate
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/list-availabel-timings`, requestObject, { headers: headers }).pipe(
      map((res) => {
        return res;
      }),
      // catchError(this.handleError)
    ).subscribe((response: any) => {
      if (response.data == true) {
        this.timeSlotArr = response.response;
      }
      else {
      }
    },
      (err) => {
        console.log(err)
      })
  }

  fnChangeTimeSlot(selectedTimeSlot) {
    this.formAppointmentRescheduleAdmin.controls['rescheduleStaff'].setValue(null);
    this.selectedTimeSlot = selectedTimeSlot;
    this.fnGetStaff(selectedTimeSlot);
  }

  fnGetStaff(selectedTimeSlot) {
    let requestObject = {
      "postal_code": this.detailsData.postalCode,
      "customer_id": this.detailsData.customer.id,
      "business_id": this.businessId,
      "service_id": JSON.stringify(this.detailsData.serviceId),
      "book_date": this.selectedDate,
      "book_time": this.selectedTimeSlot
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/service-staff`, requestObject, { headers: headers }).pipe(
      map((res) => {
        return res;
      }),
      //catchError(this.handleError)
    ).subscribe((response: any) => {
      if (response.data == true) {
        this.availableStaff = response.response;
      }
      else {
        this.availableStaff.length = 0;
      }
    },
      (err) => {
        console.log(err)
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formRescheduleSubmit() {
    if (this.formAppointmentRescheduleAdmin.invalid) {
      this.formAppointmentRescheduleAdmin.get('rescheduleStaff').markAsTouched();
      this.formAppointmentRescheduleAdmin.get('rescheduleTime').markAsTouched();
      this.formAppointmentRescheduleAdmin.get('rescheduleNote').markAsTouched();
      this.formAppointmentRescheduleAdmin.get('rescheduleDate').markAsTouched();
      return false;
    }

    let requestObject = {
      "order_item_id": JSON.stringify(this.detailsData.id),
      "staff_id": this.formAppointmentRescheduleAdmin.get('rescheduleStaff').value,
      "book_date": this.datePipe.transform(new Date(this.formAppointmentRescheduleAdmin.get('rescheduleDate').value), "yyyy-MM-dd"),
      "book_time": this.formAppointmentRescheduleAdmin.get('rescheduleTime').value,
      "book_notes": this.formAppointmentRescheduleAdmin.get('rescheduleNote').value
    };
    this.adminService.rescheduleAppointment(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Appointment Rescheduled.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.dialogRef.close();
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    })
  }

}



@Component({
  selector: 'date-range-selection',
  templateUrl: '../_dialogs/date-range-picker.html',
  providers: [DatePipe]
})
export class dateRangeSelectDialog {
  constructor(
    public dialogRef: MatDialogRef<dateRangeSelectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  datesUpdated(event){
    if(event.startDate && event.endDate){
      this.dialogRef.close({'start_date':event.startDate._d, 'end_date':event.endDate._d});
    }
  }

}

