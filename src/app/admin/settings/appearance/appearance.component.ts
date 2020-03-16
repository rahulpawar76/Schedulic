import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit {
  adminSettings : boolean = true;

  formSettingPage:boolean=false;
  constructor(private appComponent : AppComponent) {  
   
  }

  ngOnInit() {
  }

  formsetting(event){
    if(event == true){
      this.formSettingPage = true;
    }else if(event == false){
      this.formSettingPage = false;
    }
  }

}
