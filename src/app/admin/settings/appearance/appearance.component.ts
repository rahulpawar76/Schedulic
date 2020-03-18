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
      }
    })
  }
  getSettingValue(){
    this.AdminSettingsService.getSettingValue().subscribe((response:any)=>{
      if(response.data == true){
        this.settingData = response.response
        console.log(this.settingData);
        this.getAppearanceData = this.settingData.appearance.split(",", 5); 
        console.log(this.getAppearanceData)
        this.primarycolor = '#2889e9';
        this.primarygradient1 = '#2889e9';
        this.primarygradient2 = '#2889e9';
        this.textcolor = '#2889e9';
        this.textbgcolor = '#2889e9';
      }
    })
  }
  changeNameField(value){
    console.log(value);
  }

}
