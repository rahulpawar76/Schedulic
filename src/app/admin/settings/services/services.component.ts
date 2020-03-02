import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
//import { SettingsComponent } from '../settings.component';

import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'settings-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  salonCategory : boolean = false;
  hairSubCategory : boolean = false;
  AllCategory: boolean =true;
  constructor(
    
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    //private settingsComponent:SettingsComponent
  ) { }

  ngOnInit() {
  }
  fnAllCategory(){
      this.AllCategory =true;
      this.salonCategory=false;
      this.hairSubCategory=false;

  }
  fnsalonCategory(){
    this.AllCategory =false;
    this.salonCategory = true;
    this.hairSubCategory = false;
  }
  fnhairSubCategory(){

    this.AllCategory =false;
    this.salonCategory = false;
    this.hairSubCategory = true;

  }

}
