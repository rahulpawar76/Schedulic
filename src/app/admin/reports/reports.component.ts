import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminService } from '../_services/admin-main.service'
import { AppComponent } from '@app/app.component';



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
  appointmentReport : boolean = true;
  salesReport : boolean = false;
  customerReport : boolean = false;
  adminSettings: boolean = false;
  
  AllCustomerReportsList:any;
  CustomerReportsList:any;
  //selected: {startDate: Moment, endDate: Moment};

  constructor(
    public router: Router,
    private AdminService: AdminService,
    private appComponent: AppComponent,
    ) {
      //this.appComponent.settingsModule(this.adminSettings);
     }
  

  ngOnInit() {
  }
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];


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
