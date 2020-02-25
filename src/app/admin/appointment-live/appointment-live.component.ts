import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-appointment-live',
  templateUrl: './appointment-live.component.html',
  styleUrls: ['./appointment-live.component.scss']
})
export class AppointmentLiveComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  constructor() { }

  ngOnInit() {
    this.dtOptions = {
      responsive: true
    };
  }

}
