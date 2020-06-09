import { Component, OnInit,Input,ViewChild, ViewContainerRef  } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';

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

  formArr= {
    contact_field_status:false,
    nameField:{
      status:0,
      required:0
    },
    numberField:{
      status:0,
      required:0
    },
    emailField:{
      status:0,
      required:0
    },
    addressField:{
      status:0,
      required:0
    },
  };

  formSettingPage:boolean=false;
  formSettingData:any=[];
  primarycolor: any = '#2889e9';
  primarygradient1: any = '#2889e9';
  primarygradient2: any = '#2889e9';
  textcolor: any = '#2889e9';
  textbgcolor: any = '#2889e9';
  embededCode: any;
  businessId:any
  constructor(
    private appComponent : AppComponent,
    private _formBuilder: FormBuilder,
    public vcRef: ViewContainerRef, 
    private cpService: ColorPickerService,
    private _snackBar: MatSnackBar,
    private AdminSettingsService: AdminSettingsService,
    ) {  
      if (localStorage.getItem('business_id')) {
        this.businessId = localStorage.getItem('business_id');
      }
      this.embededCode = "<iframe height='100%' width='100%' src='"+environment.urlForLink+"/booking?business_id="+this.businessId+"'></iframe>";
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

  fnChangeContactFormStatus(event){
    if(event == true){
      this.formArr['contact_field_status']=true;
    }else if(event == false){
      this.formArr['contact_field_status']=false;
    this.fnFormSetting();
    }
  }

  fnChangeFieldStatus(event,field_name){
    if(event == true){
      this.formArr[field_name].status=1;
    }else if(event == false){
        this.formArr[field_name].status=0;
        this.formArr[field_name].required=0;
    }
    console.log(this.formArr);
  }

  fnChangeRequiredStatus(event,field_name){
    if(event == true){
      this.formArr[field_name].required=1;
    }else if(event == false){
        this.formArr[field_name].required=0;
    }
    console.log(this.formArr);
  }

  fnSaveAppearanceSettings(){
    if(this.Appearance.valid){
      this.gradientColor = this.primarygradient1+","+this.primarygradient2
      this.AppearanceData ={
        'pri_color' : this.primarycolor,
        'pri_gradient1':this.primarygradient1,
        'pri_gradient2':this.primarygradient2,
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
      if(response.data == true && response.response != ''){
        this.settingData = response.response
        console.log(this.settingData);
        if(this.settingData.appearance){
          
        this.getAppearanceData = JSON.parse(this.settingData.appearance); 
        //this.gradientColorDb = this.getAppearanceData.pri_gradient.split(",", 2)
        // console.log(this.gradientColorDb)
        // console.log(this.getAppearanceData);
        this.primarycolor = this.getAppearanceData.pri_color;
        this.primarygradient1 =  this.getAppearanceData.pri_gradient1;
        this.primarygradient2 =  this.getAppearanceData.pri_gradient2;
        this.textcolor = this.getAppearanceData.text_color;
        this.textbgcolor = this.getAppearanceData.text_bgcolor;
        this.Appearance.controls['font'].setValue(this.getAppearanceData.font);
        }
        if(this.settingData.form_settings){
          this.formArr=JSON.parse(this.settingData.form_settings);
        }
      }
    })
  }

  fnFormSetting(){
    this.AdminSettingsService.fnFormSetting(this.formArr).subscribe((response:any)=>{
      if(response.data == true){
        this._snackBar.open("Form Settings Updated", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
      }
    })
  }

}
