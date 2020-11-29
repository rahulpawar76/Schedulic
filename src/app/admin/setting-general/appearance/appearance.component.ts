import { Component, OnInit,Input,ViewChild, ViewContainerRef, Inject } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { AdminSettingsService } from '../../_services/admin-settings.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';
import { NgbDateParserFormatter, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { MdePopoverTrigger } from '@material-extended/mde';
//import { Base64 } from 'base64-string';


export interface DialogData {
  animal: string;
  name: string;
  
}

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
  settingSideMenuToggle:boolean =false;
  gradientColorDb:any;
  appearanceValue :any;
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
  primarygradient2: any = '#4fa3f7';
  textcolor: any = '#000000';
  textbgcolor: any = '#ffffff';
  embededCode: any;
  businessId:any
  encodedBusinessId:any;
  selectedFont: any = 'Poppins, sans-serif'
  defaultTheme:any = '1';
  model: NgbDateStruct;
  dateformatter: NgbDateParserFormatter;
  date: {year: number, month: number};
  minDate: {year: number, month: number, day: number};
  maxDate: {year: number, month: number, day: number};
  displayMonths = 1;
  companyDetailsData:any;
  navigation = 'arrows';
  constructor(
    private appComponent : AppComponent,
    private _formBuilder: FormBuilder,
    public vcRef: ViewContainerRef, 
    private cpService: ColorPickerService,
    private _snackBar: MatSnackBar,
    private calendar: NgbCalendar,
    public dialog: MatDialog,
    @Inject(AdminSettingsService) private AdminSettingsService: AdminSettingsService,
    
    ) {  
      if (localStorage.getItem('business_id')) {
        this.businessId = localStorage.getItem('business_id');
        
        // const enc = new Base64();   
        // this.encodedBusinessId = enc.encode(this.businessId);
        // console.log(this.encodedBusinessId);
        this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='"+environment.urlForLink+"/booking?business_id="+window.btoa(this.businessId)+"'></iframe>";
        
      }
      
    }

  ngOnInit() {
    this.Appearance = this._formBuilder.group({
      font : ['']
    });
    this.getSettingValue();
    this.update_SCSS_var();
    this.getCompanyDetails();
  }
  getCompanyDetails(){
    let requestObject = {
      "business_id" : this.businessId
    }
    this.AdminSettingsService.getCompanyDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.companyDetailsData = response.response;
        console.log(this.companyDetailsData);
        
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnChangeFont(event){
    console.log(event.value)
    this.selectedFont = event.value
    this.update_SCSS_var();
  }

  onChangePrimaryColor(event){
    console.log('--'+event);
    this.primarycolor = event
    this.update_SCSS_var();
  }
  onChangePrimaryGradient1(event){
    this.primarygradient1 = event
    this.update_SCSS_var();
  }
  onChangePrimaryGradient2(event){
    this.primarygradient2 = event
    this.update_SCSS_var();
  }
  onChangeTextColor(event){
    this.textcolor = event
    this.update_SCSS_var();
  }
  onChangeTextBgColor(event){
    this.textbgcolor = event
    this.update_SCSS_var();
  }

  update_SCSS_var() {
    this.appearanceValue = '{"pri_color":"'+this.primarycolor+'","pri_gradient1":"'+this.primarygradient1+'","pri_gradient2":"'+this.primarygradient2+'","text_color":"'+this.textcolor+'","text_bgcolor":"'+this.textbgcolor+'","font":"'+this.selectedFont+'"}';
    console.log(this.appearanceValue);
    const data = JSON.parse(this.appearanceValue);
    for (const [key, value] of Object.entries(data)) {
      this.setPropertyOfSCSS('--' + key, value);
      // document.documentElement.style.setProperty('--' + key, value);
    }
  }

  setPropertyOfSCSS(key, value) {
    if (key[0] != '-') {
      key = '--' + key;
    }
    if (value) {
      document.documentElement.style.setProperty(key, value);
    }
    return getComputedStyle(document.documentElement).getPropertyValue(key);
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
  fnSettingMenuToggleSmall(){
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge(){
    this.settingSideMenuToggle = false;
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
        let requestObject = {
            'business_id': this.businessId,
            "appearance": AppearanceData
        };
    this.AdminSettingsService.fnCreateAppearance(requestObject).subscribe((response:any)=>{
      if(response.data == true){
        this._snackBar.open("Appearance Updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.getSettingValue();
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
       
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  getSettingValue(){
    let requestObject = {
      'business_id': this.businessId,
    };
    this.AdminSettingsService.getSettingsValue(requestObject).subscribe((response:any)=>{
      if(response.data == true && response.response != ''){
        this.settingData = response.response
        console.log(this.settingData);
        if(this.settingData.appearance){
        this.getAppearanceData = JSON.parse(this.settingData.appearance); 
        this.primarycolor = this.getAppearanceData.pri_color;
        this.primarygradient1 =  this.getAppearanceData.pri_gradient1;
        this.primarygradient2 =  this.getAppearanceData.pri_gradient2;
        this.textcolor = this.getAppearanceData.text_color;
        this.textbgcolor = this.getAppearanceData.text_bgcolor;
        this.Appearance.controls['font'].setValue(this.getAppearanceData.font);
        this.update_SCSS_var();
        }
        if(this.settingData.form_settings){
          this.formArr=JSON.parse(this.settingData.form_settings);
        }
        if(this.settingData.theme){
          this.defaultTheme = this.settingData.theme
          // if(this.defaultTheme == 1){
          //   this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='"+environment.urlForLink+"/booking?business_id="+window.btoa(this.businessId)+"'></iframe>";
          // }else{
          //   this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='"+environment.urlForLink+"/booking-"+this.defaultTheme+"?business_id="+window.btoa(this.businessId)+"'></iframe>";
          // }
        }
        // else{
        //   this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='"+environment.urlForLink+"/booking?business_id="+window.btoa(this.businessId)+"'></iframe>";
        // }
        
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
       
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnFormSetting(){
    let requestObject = {
        'business_id': this.businessId,
        'form_settings': this.formArr
    };
    this.AdminSettingsService.fnFormSetting(requestObject).subscribe((response:any)=>{
      if(response.data == true){
        this._snackBar.open("Form Settings Updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
       
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  /* To copy any Text */
copyEmbedCode(val: string){
  let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  fnCancelAppearance(){
    this.getSettingValue();
  }

  fnChnageTheme(selectedTheme){
    let requestObject = {
      'business_id': this.businessId,
      'theme': selectedTheme
    };
    this.AdminSettingsService.fnChnageTheme(requestObject).subscribe((response:any)=>{
      if(response.data == true){
        this._snackBar.open("Default Theme Updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.getSettingValue();
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  fnThemePreview(themeNumber) {
    const dialogRef = this.dialog.open(DialogPreviewTheme, {
      width: '900px',
      data :{themeNumber : themeNumber}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}


@Component({
  selector: 'dialog-preview-theme',
  templateUrl: '../_dialogs/appearance-theme-preview.html',
})
export class DialogPreviewTheme   {

  businessId :any;
  themeNumber :any;
  constructor(
    public dialogRef: MatDialogRef<DialogPreviewTheme>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
      this.themeNumber =  this.data.themeNumber;

    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
 
}
