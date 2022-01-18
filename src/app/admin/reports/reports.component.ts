import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../_services/admin-main.service';
import { AppComponent } from '@app/app.component';
import { DatePipe } from '@angular/common';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DatePipe]
})
export class ReportsComponent implements OnInit {

  businessId: any;
  selected = { startDate: new Date(), endDate: new Date() };
  selectedStartDate: any;
  selectedStartDateLabel: any;
  selectedEndDate: any;
  selectedEndDateLabel: any;
  dateFilter: any;
  reportFilter: any;
  statusFilter: any;
  createdByFilter: any;
  reportSideMenuToggle: boolean = false;

  appointmentReport: any = [];
  appointmentReportTotalRecords: any;
  appointmentReportExpectedRevenue: any;

  salesReport: any = [];
  salesReportTotalRecords: any;
  salesReportConfirmedRevenue: any;
  salesReportProjectedRevenue: any;
  salesReportTotalEstimatedRevenue: any;
  salesReportTotalAppointments: any;
  salesReportCustomers: any;
  salesReportTotalRevenue: any;

  customerReport: any;
  search = {
    keyword: ""
  };
  isAppointmentReport: boolean = true;
  isSalesReport: boolean = false;
  isCustomerReport: boolean = false;
  adminSettings: boolean = false;
  isAppointmentsGroupBy: boolean = false;
  isSalesGroupBy: boolean = false;
  searchValue: any;
  AllCustomerReportsList: any;
  CustomerReportsList: any;
  options = {
    format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'MM/DD/YYYY', // default is format value
    direction: 'ltr', // could be rtl
    weekLabel: 'W',
    separator: ' To ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Apply', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
    customRangeLabel: 'Custom range',
    firstDay: 1 // first day is monday
  };
  settingsArr: any = [];
  currencySymbol: any;
  currencySymbolPosition: any;
  currencySymbolFormat: any;

  appointmentReportApiUrl: any;
  salesReportApiUrl: any;
  customerReportApiUrl: any;
  appointmentReportcurrent_page: any;
  appointmentReportfirst_page_url: any;
  appointmentReportlast_page: any;
  appointmentTotalRecord: any;
  appointmentFromRecord: any;
  appointmentToRecord: any;
  appointmentReportlast_page_url: any;
  appointmentReportnext_page_url: any;
  appointmentReportprev_page_url: any;
  appointmentReportpath: any;
  salesReportcurrent_page: any;
  salesReportfirst_page_url: any;
  salesReportlast_page: any;
  salesReportTotalRecord: any;
  salesReportFromRecord: any;
  salesReportToRecord: any;
  salesReportlast_page_url: any;
  salesReportnext_page_url: any;
  salesReportprev_page_url: any;
  salesReportpath: any;
  customerReportcurrent_page: any;
  customerReportfirst_page_url: any;
  customerReportlast_page: any;
  customerReportTotalRecord: any;
  customerReportFromRecord: any;
  customerReportToRecord: any;
  customerReportlast_page_url: any;
  customerReportnext_page_url: any;
  customerReportprev_page_url: any;
  customerReportpath: any;

  constructor(
    public router: Router,
    private adminService: AdminService,
    private appComponent: AppComponent,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private calendar: NgbCalendar,
  ) {
    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
    }
    this.selectedStartDate = this.datePipe.transform(new Date(), "yyyy/MM/dd");
    this.selectedStartDateLabel = this.datePipe.transform(new Date(), "yyyy/MM/dd");
    this.selectedEndDate = this.datePipe.transform(new Date(), "yyyy/MM/dd");
    this.selectedEndDateLabel = this.datePipe.transform(new Date(), "yyyy/MM/dd");
    this.dateFilter = "booking_date";
    this.reportFilter = "all";
    this.statusFilter = "all";
    this.createdByFilter = "admin";
  }

  ngOnInit() {
    this.appointmentReportApiUrl = environment.apiUrl + "/appointment-reports";
    this.salesReportApiUrl = environment.apiUrl + "/sales-reports";
    this.customerReportApiUrl = environment.apiUrl + "/customer-reports";
    this.fnGetSettings();
  }

  fnGetSettings() {
    let requestObject = {
      "business_id": this.businessId
    };

    this.adminService.getSettingValue(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.settingsArr = response.response;
        this.currencySymbol = this.settingsArr.currency;
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        this.currencySymbolFormat = this.settingsArr.currency_format;

      } else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    }, (err) => {
      console.log(err)
    })
  }

  changeDateRange(event) {
    this.appointmentReportApiUrl = environment.apiUrl + "/appointment-reports";
    this.salesReportApiUrl = environment.apiUrl + "/sales-reports";
    this.customerReportApiUrl = environment.apiUrl + "/customer-reports";
    if (event.startDate) {
      this.selectedStartDate = this.datePipe.transform(new Date(event.startDate._d), "yyyy/MM/dd");
      this.selectedStartDateLabel = this.datePipe.transform(new Date(event.startDate._d), "yyyy/MM/dd");
    }
    if (event.endDate) {
      this.selectedEndDate = this.datePipe.transform(new Date(event.endDate._d), "yyyy/MM/dd");
      this.selectedEndDateLabel = this.datePipe.transform(new Date(event.endDate._d), "yyyy/MM/dd");
    }
    this.fnGetAppointmentsReport();
    this.fnGetSalesReport();
    this.fnGetCustomerReport();
  }

  fnChangeDateFilter(event) {
    this.appointmentReportApiUrl = environment.apiUrl + "/appointment-reports"
    this.fnGetAppointmentsReport();
  }

  fnChangeReportFilter(event) {
    this.appointmentReportApiUrl = environment.apiUrl + "/appointment-reports";
    this.salesReportApiUrl = environment.apiUrl + "/sales-reports";
    if (event.value == "date" || event.value == "month") {
      this.appointmentReport = [];
      this.salesReport = [];
      this.isAppointmentsGroupBy = true;
      this.isSalesGroupBy = true;
    } else {
      this.appointmentReport = [];
      this.salesReport = [];
      this.isAppointmentsGroupBy = false;
      this.isSalesGroupBy = false;
    }
    this.fnGetAppointmentsReport();
    this.fnGetSalesReport();
  }
  fnReportToggleSmall() {
    this.reportSideMenuToggle = true;
  }
  fnReportToggleLarge() {
    this.reportSideMenuToggle = false;
  }

  fnChangeStatusFilter(event) {
    this.salesReportApiUrl = environment.apiUrl + "/sales-reports";
    this.fnGetSalesReport();
  }

  fnChangeCreatedByFilter(event) {
    this.customerReportApiUrl = environment.apiUrl + "/customer-reports";
    this.fnGetCustomerReport();
  }

  appointmentReportArrayOne(n: number): any[] {
    return Array(n);
  }

  appointmentReportNavigateTo(api_url) {
    this.appointmentReportApiUrl = api_url;
    if (this.appointmentReportApiUrl) {
      this.fnGetAppointmentsReport();
    }
  }

  appointmentReportNavigateToPageNumber(index) {
    this.appointmentReportApiUrl = this.appointmentReportpath + '?page=' + index;
    if (this.appointmentReportApiUrl) {
      this.fnGetAppointmentsReport();
    }
  }

  fnGetAppointmentsReport() {
    let requestObject = {
      'business_id': this.businessId,
      'date_filter': this.dateFilter,
      'report_filter': this.reportFilter,
      'start_date': this.selectedStartDate,
      'end_date': this.selectedEndDate,
      'search': this.search.keyword,
    };
    this.adminService.getAppointmentsReports(requestObject, this.appointmentReportApiUrl).subscribe((response: any) => {
      if (response.data == true) {

        this.appointmentReportTotalRecords = response.response[0].TotalRecord;
        this.appointmentReportExpectedRevenue = response.response[0].expectedRevenue;
        this.appointmentReport = response.response[0].list.data;
        this.appointmentReportcurrent_page = response.response[0].list.current_page;
        this.appointmentReportfirst_page_url = response.response[0].list.first_page_url;
        this.appointmentReportlast_page = response.response[0].list.last_page;
        this.appointmentTotalRecord = response.response[0].list.total;
        this.appointmentFromRecord = response.response[0].list.from;
        this.appointmentToRecord = response.response[0].list.to;
        this.appointmentReportlast_page_url = response.response[0].list.last_page_url;
        this.appointmentReportnext_page_url = response.response[0].list.next_page_url;
        this.appointmentReportprev_page_url = response.response[0].list.prev_page_url;
        this.appointmentReportpath = response.response[0].list.path;
        this.appointmentReport.forEach(element => {
          if (this.reportFilter == "all") {
            element.booking_date = this.datePipe.transform(new Date(element.booking_date), "EEE, yyyy/MM/dd");
            element.booking_time = this.datePipe.transform(new Date(element.booking_date + " " + element.booking_time), "HH:mm");
          } else if (this.reportFilter == "date") {
            element.dates = this.datePipe.transform(new Date(element.dates), "yyyy/MM/dd");
          } else {
            element.Month = this.datePipe.transform(new Date(element.Month), "MMM yyyy");
          }
        });
      } else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        this.appointmentReport = [];
        this.appointmentReportTotalRecords = 0;
        this.appointmentReportExpectedRevenue = 0;
      }
    })
  }

  salesReportArrayOne(n: number): any[] {
    return Array(n);
  }

  salesReportNavigateTo(api_url) {
    this.salesReportApiUrl = api_url;
    if (this.salesReportApiUrl) {
      this.fnGetSalesReport();
    }
  }

  salesReportNavigateToPageNumber(index) {
    this.salesReportApiUrl = this.salesReportpath + '?page=' + index;
    if (this.salesReportApiUrl) {
      this.fnGetSalesReport();
    }
  }

  fnGetSalesReport() {
    let requestObject = {
      'business_id': this.businessId,
      'status_filter': this.statusFilter,
      'group_filter': this.reportFilter,
      'start_date': this.selectedStartDate,
      'end_date': this.selectedEndDate,
      'search': this.search.keyword,
    };

    this.adminService.getSalesReports(requestObject, this.salesReportApiUrl).subscribe((response: any) => {
      if (response.data == true) {
        // this.salesReport = response.response.list;
        this.salesReport = response.response.list.data;

        this.salesReportcurrent_page = response.response.list.current_page;
        this.salesReportfirst_page_url = response.response.list.first_page_url;
        this.salesReportlast_page = response.response.list.last_page;
        this.salesReportTotalRecord = response.response.list.total;
        this.salesReportFromRecord = response.response.list.from;
        this.salesReportToRecord = response.response.list.to;
        this.salesReportlast_page_url = response.response.list.last_page_url;
        this.salesReportnext_page_url = response.response.list.next_page_url;
        this.salesReportprev_page_url = response.response.list.prev_page_url;
        this.salesReportpath = response.response.list.path;
        this.salesReport.forEach(element => {
          if (this.reportFilter == "all") {
            element.payment_date = this.datePipe.transform(new Date(element.payment_date), "EEE, yyyy/MM/dd");
            element.orders.booking_date = this.datePipe.transform(new Date(element.orders.booking_date), "EEE, yyyy/MM/dd");
            element.orders.booking_time = this.datePipe.transform(new Date(element.orders.booking_date + " " + element.orders.booking_time), "HH:mm");
            if (element.orders.tax) {
              element.orders.tax = JSON.parse(element.orders.tax)
              if (element.orders.tax.length > 0) {
                element.orders.totalTax = 0;
                element.orders.tax.forEach(element1 => {
                  element.orders.totalTax = parseInt(element.orders.totalTax) + parseInt(element1.amount)
                });
              }
            }
          } else if (this.reportFilter == "date") {
            element.dates = this.datePipe.transform(new Date(element.dates), "yyyy/MM/dd");
          } else {
            element.Months = this.datePipe.transform(new Date(element.Months), "MMM yyyy");
          }
        });
        if (this.reportFilter == "all") {
          this.salesReportTotalRecords = response.response.TotalRecords;
          this.salesReportConfirmedRevenue = response.response.ConfirmRevenue;
          this.salesReportProjectedRevenue = response.response.ProjectedRevenue;
          this.salesReportTotalEstimatedRevenue = response.response.TotalEstimated;
        } else if (this.reportFilter == "date" || this.reportFilter == "month") {
          this.salesReportTotalAppointments = response.response.TotalAppointment;
          this.salesReportCustomers = response.response.customers;
          this.salesReportTotalRevenue = response.response.TotalRevenue;
        } else {

        }
      } else if (response.data == false && response.response !== 'api token or userid invaild') {
        this.salesReport = [];
      }
    });
  }

  customerReportArrayOne(n: number): any[] {
    return Array(n);
  }

  customerReportNavigateTo(api_url) {
    this.customerReportApiUrl = api_url;
    if (this.customerReportApiUrl) {
      this.fnGetCustomerReport();
    }
  }

  customerReportNavigateToPageNumber(index) {
    this.customerReportApiUrl = this.customerReportpath + '?page=' + index;
    if (this.customerReportApiUrl) {
      this.fnGetCustomerReport();
    }
  }

  fnGetCustomerReport() {
    let requestObject = {
      'business_id': this.businessId,
      'start_date': this.selectedStartDate,
      'end_date': this.selectedEndDate,
      'filter': this.createdByFilter,
      'search': this.search.keyword,
    };
    this.adminService.getCustomerReports(requestObject, this.customerReportApiUrl).subscribe((response: any) => {
      if (response.data == true) {
        this.customerReport = response.response.data;
        this.customerReportcurrent_page = response.response.current_page;
        this.customerReportfirst_page_url = response.response.first_page_url;
        this.customerReportlast_page = response.response.last_page;
        this.customerReportTotalRecord = response.response.total;
        this.customerReportFromRecord = response.response.from;
        this.customerReportToRecord = response.response.to;
        this.customerReportlast_page_url = response.response.last_page_url;
        this.customerReportnext_page_url = response.response.next_page_url;
        this.customerReportprev_page_url = response.response.prev_page_url;
        this.customerReportpath = response.response.path;

        this.customerReport.forEach(element => {
          element.created_at = this.datePipe.transform(new Date(element.created_at), "yyyy/MM/dd");
        });
      } else if (response.data == false && response.response !== 'api token or userid invaild') {
        this.customerReport = [];
      }
    });
  }

  fnappointmentReport() {
    this.isAppointmentReport = true;
    this.isSalesReport = false;
    this.isCustomerReport = false;
    this.search.keyword = '';
  }

  fnsalesReport() {
    this.isAppointmentReport = false;
    this.isSalesReport = true;
    this.isCustomerReport = false;
    this.search.keyword = '';
  }

  fncustomerReport() {
    this.isAppointmentReport = false;
    this.isSalesReport = false;
    this.isCustomerReport = true;
    this.search.keyword = '';
  }

  searchReport() {
    this.fnGetAppointmentsReport();
    this.fnGetSalesReport();
    this.fnGetCustomerReport();
  }

  fnPrint() {
    if (this.isAppointmentReport) {
      const printContent = document.getElementById("appointment_listing");
      const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
    } else if (this.isSalesReport) {
      const printContent = document.getElementById("sales_report");
      const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
    } else if (this.isCustomerReport) {
      const printContent = document.getElementById("customer_report");
      const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
    }
  }

  fnDownloadPDF() {

    if (this.isAppointmentReport) {

      let requestObject = {
        'business_id': this.businessId,
        'date_filter': this.dateFilter,
        'report_filter': this.reportFilter,
        'start_date': this.selectedStartDate,
        'end_date': this.selectedEndDate,
        'search': this.search.keyword,
        'file': 'pdf'
      };
      window.open(environment.apiUrl + '/appointment-reports-pdf?param=' + JSON.stringify(requestObject), '_blank');

    } else if (this.isSalesReport) {

      let requestObject = {
        'business_id': this.businessId,
        'status_filter': this.statusFilter,
        'group_filter': this.reportFilter,
        'start_date': this.selectedStartDate,
        'end_date': this.selectedEndDate,
        'search': this.search.keyword,
        'file': 'pdf'
      };

      window.open(environment.apiUrl + '/sales-reports-pdf?param=' + JSON.stringify(requestObject), '_blank');

    } else if (this.isCustomerReport) {

      let requestObject = {
        'business_id': this.businessId,
        'start_date': this.selectedStartDate,
        'end_date': this.selectedEndDate,
        'filter': this.createdByFilter,
        'search': this.search.keyword,
        'file': 'pdf'
      };

      window.open(environment.apiUrl + '/customer-reports-pdf?param=' + JSON.stringify(requestObject), '_blank');

    }

  }


  downloadRepoer() {

    if (this.isAppointmentReport) {

      let requestObject = {
        'business_id': this.businessId,
        'date_filter': this.dateFilter,
        'report_filter': this.reportFilter,
        'start_date': this.selectedStartDate,
        'end_date': this.selectedEndDate,
        'search': this.search.keyword,
        'file': 'csv'
      };

      window.open(environment.apiUrl + '/appointment-reports-pdf?param=' + JSON.stringify(requestObject), '_blank');

    } else if (this.isSalesReport) {

      let requestObject = {
        'business_id': this.businessId,
        'status_filter': this.statusFilter,
        'group_filter': this.reportFilter,
        'start_date': this.selectedStartDate,
        'end_date': this.selectedEndDate,
        'search': this.search.keyword,
        'file': 'csv'
      };

      window.open(environment.apiUrl + '/sales-reports-pdf?param=' + JSON.stringify(requestObject), '_blank');

    } else if (this.isCustomerReport) {

      let requestObject = {
        'business_id': this.businessId,
        'start_date': this.selectedStartDate,
        'end_date': this.selectedEndDate,
        'filter': this.createdByFilter,
        'search': this.search.keyword,
        'file': 'csv'
      };

      window.open(environment.apiUrl + '/customer-reports-pdf?param=' + JSON.stringify(requestObject), '_blank');

    }

  }



}
