import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

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

  constructor(public router: Router) { }
  

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
  }
}
