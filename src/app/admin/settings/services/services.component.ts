import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
//import { SettingsComponent } from '../settings.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { AuthenticationService } from '@app/_services';
import { AppComponent } from '@app/app.component';
import { AdminSettingsService } from '../_services/admin-settings.service'

@Component({
  selector: 'settings-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  
  allCetegoryList : any;
  allServicesList : any;
  servicesList :boolean = true;
  constructor(
    
    private route: ActivatedRoute,
    private router: Router,
    private AppComponent: AppComponent,
    private authenticationService: AuthenticationService,
    private adminSettingsService: AdminSettingsService,
  ) { }

  ngOnInit() {
    this.fnAllCategory();
  }

  fnAllServices(){
    this.adminSettingsService.fnAllServices().subscribe((response:any) => {
      if(response.data == true){
        this.allServicesList = response.response
        console.log(this.allServicesList);
        if(this.allServicesList != ''){
          this.servicesList = true;
        }else if(this.allServicesList == ''){
          this.servicesList = false;
        }
      }
      else if(response.data == false){
       this.allServicesList = '';
      }
    })
  }

  fnAllCategory(){
     this.adminSettingsService.fnAllCategory().subscribe((response:any) => {
       if(response.data == true){
         this.allCetegoryList = response.response
       }
       else if(response.data == false){
        this.allCetegoryList = '';
       }
     })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allServicesList, event.previousIndex, event.currentIndex);
  }
  
      // admin settings
      MySettingsServicesNav(){
        this.router.navigate(['/admin/settings/services']);
      }
      MySettingsStaffNav(){
        this.router.navigate(['/admin/settings/staff']);
      }


}
