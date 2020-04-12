import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminService } from '../_services/admin-main.service';
import { AppComponent } from '@app/app.component';
import { DatePipe} from '@angular/common';
import { NgbDateParserFormatter, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
//import moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DatePipe]
})
export class ReportsComponent implements OnInit {

  businessId : any;
  selected= {startDate: new Date(), endDate: new Date()};
  selectedStartDate:any;
  selectedStartDateLabel:any;
  selectedEndDate:any;
  selectedEndDateLabel:any;
  dateFilter:any;
  reportFilter:any;
  statusFilter:any;
  createdByFilter:any;

  appointmentReport : any=[];
  appointmentReportTotalRecords : any;
  appointmentReportExpectedRevenue : any;
  
  salesReport : any=[];
  salesReportTotalRecords : any;
  salesReportConfirmedRevenue : any;
  salesReportProjectedRevenue : any;
  salesReportTotalEstimatedRevenue : any;
  salesReportTotalAppointments : any;
  salesReportCustomers : any;
  salesReportTotalRevenue : any;
  
  customerReport : any;

  isAppointmentReport : boolean = true;
  isSalesReport : boolean = false;
  isCustomerReport : boolean = false;
  adminSettings: boolean = false;
  isAppointmentsGroupBy:boolean =false;
  isSalesGroupBy:boolean =false;
  
  AllCustomerReportsList:any;
  CustomerReportsList:any;
  options={
    format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'MM/DD/YYYY', // default is format value
    direction: 'ltr', // could be rtl
    weekLabel: 'W',
    separator: ' To ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Apply', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
    customRangeLabel: 'Custom range',
    //daysOfWeek: moment.weekdaysMin(),
   // monthNames: moment.monthsShort(),
    firstDay: 1 // first day is monday
  };
  // ranges: any = {
  //   'Today': [moment(), moment()],
  //   'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  //   'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  //   'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  //   'This Month': [moment().startOf('month'), moment().endOf('month')],
  //   'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  // };
  settingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;

  constructor(
    public router: Router,
    private adminService: AdminService,
    private appComponent: AppComponent,
    private datePipe: DatePipe,
    private calendar: NgbCalendar,
    ) {
    if(localStorage.getItem('business_id')){
        this.businessId = localStorage.getItem('business_id');
    }
    this.selectedStartDate=this.datePipe.transform(new Date(),"yyyy-MM-dd");
    this.selectedStartDateLabel=this.datePipe.transform(new Date(),"dd MMM yyyy");
    this.selectedEndDate=this.datePipe.transform(new Date(),"yyyy-MM-dd");
    this.selectedEndDateLabel=this.datePipe.transform(new Date(),"dd MMM yyyy");
    this.dateFilter ="booking_date";
    this.reportFilter ="all";
    this.statusFilter ="all";
    this.createdByFilter ="admin";
  }
  
  ngOnInit() {
    this.fnGetSettings();
    // this.fnGetAppointmentsReport();
    // this.fnGetSalesReport();
    // this.fnGetCustomerReport();
  }

  fnGetSettings(){
    let requestObject = {
      "business_id" : this.businessId
      };

    this.adminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr = response.response;
        console.log(this.settingsArr);

        this.currencySymbol = this.settingsArr.currency;
        console.log(this.currencySymbol);
        
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        console.log(this.currencySymbolPosition);
        
        this.currencySymbolFormat = this.settingsArr.currency_format;
        console.log(this.currencySymbolFormat);
      }else{
      }
      },
      (err) =>{
        console.log(err)
      })
  }

  changeDateRange(event){
    if(event.startDate){
      this.selectedStartDate=this.datePipe.transform(new Date(event.startDate._d),"yyyy-MM-dd");
      this.selectedStartDateLabel=this.datePipe.transform(new Date(event.startDate._d),"dd MMM yyyy");
    }
    if(event.endDate){
     this.selectedEndDate=this.datePipe.transform(new Date(event.endDate._d),"yyyy-MM-dd");
     this.selectedEndDateLabel=this.datePipe.transform(new Date(event.endDate._d),"dd MMM yyyy");
    }
    this.fnGetAppointmentsReport();
    this.fnGetSalesReport();
    this.fnGetCustomerReport();
  }

  fnChangeDateFilter(event){
    this.fnGetAppointmentsReport();
  }

  fnChangeReportFilter(event){
    console.log(event);
    if(event.value=="date" || event.value=="month"){
      this.appointmentReport=[];
      this.salesReport=[];
      this.isAppointmentsGroupBy=true;
      this.isSalesGroupBy=true;
    }else{
      this.appointmentReport=[];
      this.salesReport=[];
      this.isAppointmentsGroupBy=false;
      this.isSalesGroupBy=false;
    }
    this.fnGetAppointmentsReport();
    this.fnGetSalesReport();
  }

  fnChangeStatusFilter(event){
    console.log(event);
    this.fnGetSalesReport();
  }

  fnChangeCreatedByFilter(event){
    console.log(event);
    this.fnGetCustomerReport();
  }

  fnGetAppointmentsReport(){
    let requestObject = {
      'business_id': this.businessId,
      'date_filter': this.dateFilter,
      'report_filter':this.reportFilter,
      'start_date':this.selectedStartDate,
      'end_date': this.selectedEndDate,
    };
    this.adminService.getAppointmentsReports(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.appointmentReport = response.response[0].list;
        this.appointmentReportTotalRecords = response.response[0].TotalRecord;
        this.appointmentReportExpectedRevenue = response.response[0].expectedRevenue;
        this.appointmentReport.forEach(element=>{
          if(this.reportFilter=="all"){
            element.booking_date=this.datePipe.transform(new Date(element.booking_date),"EEE, dd MMM yyyy");
            element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
          }else if(this.reportFilter=="date"){
            element.dates=this.datePipe.transform(new Date(element.dates),"dd MMM yyyy");
          }else{
            element.Month=this.datePipe.transform(new Date(element.Month),"MMM yyyy");
          }
        });
        console.log(this.appointmentReport);
      }
      else if(response.data == false){
        this.appointmentReport = [];
        this.appointmentReportTotalRecords = '';
        this.appointmentReportExpectedRevenue = '';
      }
    })
  }

  fnGetSalesReport(){
    let requestObject = {
      'business_id': this.businessId,
      'status_filter': this.statusFilter,
      'group_filter':this.reportFilter,
      'start_date':this.selectedStartDate,
      'end_date': this.selectedEndDate,
    };

    this.adminService.getSalesReports(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.salesReport = response.response.list;
        this.salesReport.forEach(element=>{
          if(this.reportFilter=="all"){
            element.payment_date=this.datePipe.transform(new Date(element.payment_date),"EEE, dd MMM yyyy");
            element.orders.booking_date=this.datePipe.transform(new Date(element.orders.booking_date),"EEE, dd MMM yyyy");
            element.orders.booking_time=this.datePipe.transform(new Date(element.orders.booking_date+" "+element.orders.booking_time),"hh:mm a");
          }else if(this.reportFilter=="date"){
            element.dates=this.datePipe.transform(new Date(element.dates),"dd MMM yyyy");
          }else{
            element.Months=this.datePipe.transform(new Date(element.Months),"MMM yyyy");
          }
        });
        if(this.reportFilter=="all"){
            this.salesReportTotalRecords = response.response.TotalRecords;
            this.salesReportConfirmedRevenue = response.response.ConfirmRevenue;
            this.salesReportProjectedRevenue = response.response.ProjectedRevenue;
            this.salesReportTotalEstimatedRevenue = response.response.TotalEstimated;
          }else if(this.reportFilter=="date" || this.reportFilter=="month"){
            this.salesReportTotalAppointments = response.response.TotalAppointment;
            this.salesReportCustomers = response.response.customers;
            this.salesReportTotalRevenue = response.response.TotalRevenue;
          }else{

          }
        console.log(this.salesReport);
        console.log(this.salesReportTotalRecords);
        console.log(this.salesReportConfirmedRevenue);
        console.log(this.salesReportProjectedRevenue);
        console.log(this.salesReportTotalEstimatedRevenue);
        console.log(this.salesReportTotalAppointments);
        console.log(this.salesReportCustomers);
        console.log(this.salesReportTotalRevenue);
      }
      else if(response.data == false){
        this.salesReport = [];
      }
    })
  }

  fnGetCustomerReport(){
        let requestObject = {
            'business_id': this.businessId,
            'start_date': this.selectedStartDate,
            'end_date':this.selectedEndDate,
            'filter':this.createdByFilter,
        };
    this.adminService.getCustomerReports(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.customerReport = response.response;
        console.log(this.customerReport);
        this.customerReport.forEach(element=>{
            element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy");
        });
      }
      else if(response.data == false){
        this.customerReport = [];
      }
    })
  }

  fnappointmentReport(){
    this.isAppointmentReport = true;
    this.isSalesReport = false;
    this.isCustomerReport = false;
  }
  fnsalesReport(){
    this.isAppointmentReport = false;
    this.isSalesReport = true;
    this.isCustomerReport = false;
  }
  fncustomerReport(){
    this.isAppointmentReport = false;
    this.isSalesReport = false;
    this.isCustomerReport = true;
  }
}
