import { Component, OnInit,Input,ViewChild  } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Browser } from '@syncfusion/ej2-base';
import { ColorPickerComponent, OpenEventArgs } from '@syncfusion/ej2-angular-inputs';

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit {
  
  Appearance:FormGroup;
  allAppColor:any;
  AppearanceData:any;
  gradientColor : any;

  formSettingPage:boolean=false;
  constructor(private appComponent : AppComponent,private _formBuilder: FormBuilder,) {  
   
  }

  ngOnInit() {

    this.Appearance = this._formBuilder.group({
      primary_color : [''],
      primary_gradient1 : [''],
      primary_gradient2 : [''],
      text_color : [''],
      text_bgcolor : [''],
      font : ['']
    });
  }


  formsetting(event){
    if(event == true){
      this.formSettingPage = true;
    }else if(event == false){
      this.formSettingPage = false;
    }
  }

  appearanceColor(){
    if(this.Appearance.valid){
      this.gradientColor = this.Appearance.controls['primary_gradient1'].value,this.Appearance.controls['primary_gradient2'].value
      alert(this.gradientColor);
      this.AppearanceData ={
        'pri_color' : this.Appearance.controls['primary_color'].value,
        'pri_gradient':this.gradientColor,
        'text_color':this.Appearance.controls['text_color'].value,
        'text_bgcolor':this.Appearance.controls['text_bgcolor'].value,
        'font':this.Appearance.controls['font'].value
      }
      console.log(this.AppearanceData);
    }

  }
  changeNameField(value){
    console.log(value);
  }

}
