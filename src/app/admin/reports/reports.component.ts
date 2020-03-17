import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminService } from '../_services/admin-main.service'
import { AppComponent } from '@app/app.component'


interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  appointmentsReports : any;
  salesReports : any;
  customerReports : any;

  appointmentReport : boolean = true;
  salesReport : boolean = false;
  customerReport : boolean = false;
  adminSettings: boolean = false;
  
  AllCustomerReportsList:any;
  CustomerReportsList:any;

  constructor(
    public router: Router,
    private AdminService: AdminService,
    private appComponent: AppComponent,
    ) {
      //this.appComponent.settingsModule(this.adminSettings);
     }
  

  ngOnInit() {
    this.getAppointmentsReports();
    this.getSalesReports();
    this.customerReports();
    
  }
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  getAppointmentsReports(){
    this.AdminService.getAppointmentsReports().subscribe((response:any) => {
      if(response.data == true){
        this.appointmentsReports = response.response
        // console.log(this.appointmentsReports);
      }
      else if(response.data == false){
        this.appointmentsReports = ''
      }
    })
  }

  getSalesReports(){
    this.AdminService.getSalesReports().subscribe((response:any) => {
      if(response.data == true){
        this.salesReports = response.response
        console.log(this.salesReports);
      }
      else if(response.data == false){
        this.salesReports = ''
      }
    })
  }

  getCustomerReports(){
    this.AdminService.getCustomerReports().subscribe((response:any) => {
      if(response.data == true){
        this.customerReports = response.response
        console.log(this.customerReports);
      }
      else if(response.data == false){
        this.customerReports = ''
      }
    })
  }
  fnappointmentReport(){
    this.appointmentReport = true;
    this.salesReport = false;
    this.customerReport = false;
  }
  fnsalesReport(){
    this.appointmentReport = false;
    this.salesReport = true;
    this.customerReport = false;
  }
  fncustomerReport(){
    this.appointmentReport = false;
    this.salesReport = false;
    this.customerReport = true;

    this.AdminService.fncustomerReport().subscribe((response:any) => {
      if(response.data == true){
        this.AllCustomerReportsList = response.response
        console.log(this.AllCustomerReportsList);
        if(this.AllCustomerReportsList != ''){
          this.CustomerReportsList = true;
        }else if(this.AllCustomerReportsList == ''){
          this.CustomerReportsList = false;
        }
      }
      else if(response.data == false){
       this.AllCustomerReportsList = '';
      }
    })
  }
}
