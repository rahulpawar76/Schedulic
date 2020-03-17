import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component'

@Component({
  selector: 'app-bookingrules',
  templateUrl: './bookingrules.component.html',
  styleUrls: ['./bookingrules.component.scss']
})
export class BookingrulesComponent implements OnInit {
  adminSettings : boolean = true;

  termsConditionsPage:boolean=false;
  privacyConditionsPage=false;
  autoAssignToStaffPage=false;
  ThankYouPage=false;
  
  constructor(
    private appComponent : AppComponent,
  ) {
    //this.appComponent.settingsModule(this.adminSettings);
   }

  ngOnInit() {
  }

  termsconditions(event){
    
    if(event == true){
      this.termsConditionsPage = true;
    }else if(event == false){
      this.termsConditionsPage = false;
    }


  }
  autoassigntostaff(event){
    
    if(event == true){
      this.autoAssignToStaffPage = true;
    }else if(event == false){
      this.autoAssignToStaffPage = false;
    }


  }
  privacytermsconditions(event){
    
    if(event == true){
      this.privacyConditionsPage = true;
    }else if(event == false){
      this.privacyConditionsPage = false;
    }


  }
  thankyou(event){
    
    if(event == true){
      this.ThankYouPage = true;
    }else if(event == false){
      this.ThankYouPage = false;
    }


  }
}
