import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

export interface DialogData {
  animal: string;
  name: string;
  StaffCreate: FormGroup;
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  animal: any;

  constructor(
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.dtOptions = {
      // Use this attribute to enable the responsive extension
      responsive: true
    };
  }
  
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


}
