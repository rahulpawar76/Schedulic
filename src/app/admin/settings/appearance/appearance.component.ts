import { Component, OnInit,Input,ViewChild, ViewContainerRef  } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  settingData : any;
  getAppearanceData : any;
  ChangeName:boolean=false;
  ChangeNumber:boolean=false;
  ChangeRequired:boolean=false;
  ChangeAddress:boolean=false;
  gradientColorDb:any;

  formArr:any = [];

  formSettingPage:boolean=false;
  primarycolor: any = '#2889e9';
  primarygradient1: any = '#2889e9';
  primarygradient2: any = '#2889e9';
  textcolor: any = '#2889e9';
  textbgcolor: any = '#2889e9';
  constructor(
    private appComponent : AppComponent,
    private _formBuilder: FormBuilder,
    public vcRef: ViewContainerRef, 
    private cpService: ColorPickerService,
    private _snackBar: MatSnackBar,
    private AdminSettingsService: AdminSettingsService,
    ) {  
   
  }

  ngOnInit() {
    this.Appearance = this._formBuilder.group({
      font : ['']
    });
    this.getSettingValue();
  }

  onChangePrimaryColor(event){
    this.primarycolor = event
  }
  onChangePrimaryGradient1(event){
    this.primarygradient1 = event
  }
  onChangePrimaryGradient2(event){
    this.primarygradient2 = event
  }
  onChangeTextColor(event){
    this.textcolor = event
  }
  onChangeTextBgColor(event){
    this.textbgcolor = event
  }

  // public onChangeColor(color: string): Cmyk {
  //   const hsva = this.cpService.stringToHsva(color);

  //   const rgba = this.cpService.hsvaToRgba(hsva);


  //   console.log(color);
  //    console.log(rgba);

  //   return this.cpService.rgbaToCmyk(rgba);
  // }

  formsetting(event){
    if(event == true){
      this.formSettingPage = true;
    }else if(event == false){
      this.formSettingPage = false;
    }
  }

  fnChangeName(event,name){
    if(event == true){
      this.formArr.push(name);
      this.ChangeName = true;
    }else if(event == false){
      const index = this.formArr.indexOf(name, 0);
      if (index > -1) {
        this.formArr.splice(index, 1);
      }
      this.ChangeName = false;
    }
    console.log( this.formArr);
  }

  fnChangeNumber(event,number)
  {
    if(event == true){
      this.formArr.push(number);
      this.ChangeNumber = true;
    }else if(event == false){
      const index = this.formArr.indexOf(number, 0);
      if (index > -1) {
        this.formArr.splice(index, 1);
      }
      this.ChangeNumber = false;
    }
    console.log( this.formArr);
  }
  fnChangeRequired(event,email)
  {
    if(event == true){
      this.formArr.push(email);
      this.ChangeRequired = true;
    }else if(event == false){
      const index = this.formArr.indexOf(email, 0);
      if (index > -1) {
        this.formArr.splice(index, 1);
      }
      this.ChangeRequired = false;
    }
    console.log( this.formArr);
  }

  fnChangeAddress(event,address)
  {
    if(event == true){
      this.formArr.push(address);
      this.ChangeAddress = true;
    }else if(event == false){
      const index = this.formArr.indexOf(address, 0);
      if (index > -1) {
        this.formArr.splice(index, 1);
      }
      this.ChangeAddress = false;
      
    }
    console.log( this.formArr);
  }

  appearanceColor(){
    if(this.Appearance.valid){
      this.gradientColor = this.primarygradient1+","+this.primarygradient2
      alert(this.gradientColor);
      this.AppearanceData ={
        'pri_color' : this.primarycolor,
        'pri_gradient':this.gradientColor,
        'text_color':this.textcolor,
        'text_bgcolor':this.textbgcolor,
        'font':this.Appearance.controls['font'].value
      }
      this.fnCreateAppearance(this.AppearanceData);
    }
  }
  fnCreateAppearance(AppearanceData){
    this.AdminSettingsService.fnCreateAppearance(AppearanceData).subscribe((response:any)=>{
      if(response.data == true){
        this._snackBar.open("Appearance Updated", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.getSettingValue();
      }
    })
  }
  getSettingValue(){
    this.AdminSettingsService.getSettingsValue().subscribe((response:any)=>{
      if(response.data == true){
        this.settingData = response.response
        console.log(this.settingData);
        this.getAppearanceData = JSON.parse(this.settingData.appearance); 
        this.gradientColorDb = this.getAppearanceData.pri_gradient.split(",", 2)
        console.log(this.gradientColorDb)
        //console.log(this.(getAppearanceData).pri_color)
        this.primarycolor = this.getAppearanceData.pri_color;
        this.primarygradient1 = this.gradientColorDb[0];
        this.primarygradient2 = this.gradientColorDb[1];
        this.textcolor = this.getAppearanceData.text_color;
        this.textbgcolor = this.getAppearanceData.text_bgcolor;
      }
    })
  }
  changeNameField(value){
    console.log(value);
  }

  fnFormSetting(){
    this.AdminSettingsService.fnFormSetting(this.formSettingPage,this.formArr).subscribe((response:any)=>{
      if(response.data == true){
        this._snackBar.open("Currency Format Updated", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
      }
    })
  }

}
