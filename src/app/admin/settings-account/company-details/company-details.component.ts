import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl,ValidatorFn } from '@angular/forms';
import { AdminSettingsService } from '../../_services/admin-settings.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

export interface DialogData {
  animal: string;
  name: string;
  StaffCreate: FormGroup;
}
@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
  adminSettings : boolean = true;
  companyDetails:FormGroup;
  companyDetailsData:any;
  companyDetailsImageUrl:any = '';
  updateCompanyDetailsData:any;
  allCountry: any;
  allStates: any;
  settingSideMenuToggle : boolean = false;
  allCities: any;
  businessId: any;
  selectedCountry: any;
  selectedState: any;
  selectedCity: any;
  
  phoneNumberInvalid:any = "valid";
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  trimValidator:ValidatorFn;
  websiteUrl = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
  websiteUrl2 = '/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/'
  isLoaderAdmin: boolean = false;

  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  TooltipLabel = TooltipLabel;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  selectedCountryISO: CountryISO;


  constructor(
    private _formBuilder:FormBuilder,
    public dialog: MatDialog,
    @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
    private _snackBar: MatSnackBar
    ) {
      localStorage.setItem('isBusiness', 'false');
      if (localStorage.getItem('business_id')) {
          this.businessId = localStorage.getItem('business_id');
      }

   }


  ngOnInit() {
    this.gelAllCountry();
    this.getCompanyDetails();
    this.companyDetails = this._formBuilder.group({
      company_name : ['', [Validators.required,Validators.minLength(3),Validators.maxLength(255)],this.whiteSpaceValidation.bind(this)],
      comp_email : ['',[Validators.required, Validators.pattern(this.emailFormat)]],
      comp_website : ['',[Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")]],
//      comp_mobile : ['',[Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      comp_mobile : ['',[Validators.required]],

      country:['', Validators.required],
      comp_address:['', Validators.required],
      city:['', Validators.required],
      state:['', Validators.required],
      zip_code:['', [Validators.required,Validators.minLength(5),Validators.maxLength(7)]],
      comp_decs:['', Validators.required],
      comp_status:[false],
      comp_private_status:[false],
    });
  }

  whiteSpaceValidation(control: FormControl) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if(control.value.trim().length == 0){
          resolve({ whiteSpaceValidation: true });
          // return false;
        }else{
          // return true;
          resolve(null);
        }
      }, 500);
    });
  }

  // numberOnly(event): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;

  // }
  fnPhoneMouceLeave(){
  
    if(this.companyDetails.get('comp_mobile').value==undefined){
      this.phoneNumberInvalid = "required";
      return;
    }


    if(this.companyDetails.get('comp_mobile').value === null){
      this.phoneNumberInvalid = "required";
    
    }else if(this.companyDetails.get('comp_mobile').value !== '' || this.companyDetails.get('comp_mobile').value !== null){
      if(this.companyDetails.get('comp_mobile').value.number.length >= 6 && this.companyDetails.get('comp_mobile').value.number.length <= 15){
        this.phoneNumberInvalid = "valid";
      }else{
        this.phoneNumberInvalid = "length";
      }
    }

  }

  fnenterPhoneNumber(){
    

    if(this.companyDetails.get('comp_mobile').value==undefined){
      this.phoneNumberInvalid = "required";
      return;
    }


    if(this.companyDetails.get('comp_mobile').value !== '' || this.companyDetails.get('comp_mobile').value !== null){
      if(this.companyDetails.get('comp_mobile').value.number.length >= 6 && this.companyDetails.get('comp_mobile').value.number.length <= 15){
        this.phoneNumberInvalid = "valid";
      }else{
        this.phoneNumberInvalid = "length";
      }
    }else if(this.companyDetails.get('comp_mobile').value === '' || this.companyDetails.get('comp_mobile').value === null){
      this.phoneNumberInvalid = "required";
    }
    
  }

  getCompanyDetails(){
    this.isLoaderAdmin = true;
    let requestObject = {
        'business_id': this.businessId,
    };
    this.adminSettingsService.getCompanyDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.companyDetailsData = response.response;
        this.selectCountry(this.companyDetailsData.country.id);
        // this.selectedCountry = this.companyDetailsData.country.name
        // this.selectedState = this.companyDetailsData.state.name
        // this.selectedCity = this.companyDetailsData.city.name
        this.selectStates(this.companyDetailsData.state);
        this.companyDetails.controls['company_name'].setValue(this.companyDetailsData.business_name);
        this.companyDetails.controls['comp_email'].setValue(this.companyDetailsData.email);
        this.companyDetails.controls['comp_website'].setValue(this.companyDetailsData.website);
        this.companyDetails.controls['comp_mobile'].setValue(this.companyDetailsData.phone);
        this.companyDetails.controls['country'].setValue(JSON.stringify(this.companyDetailsData.country.id));
        this.companyDetails.controls['comp_address'].setValue(this.companyDetailsData.address);
        this.companyDetails.controls['city'].setValue(JSON.stringify(this.companyDetailsData.city.id));
        // this.companyDetails.controls['state'].setValue(JSON.stringify(this.companyDetailsData.state!=null ? this.companyDetailsData.state.id : ''));
        this.companyDetails.controls['state'].setValue(JSON.stringify(this.companyDetailsData.state?this.companyDetailsData.state.id:''));
        this.companyDetails.controls['zip_code'].setValue(this.companyDetailsData.zipcode);
        this.companyDetails.controls['comp_decs'].setValue(this.companyDetailsData.description);
        this.companyDetails.controls['comp_status'].setValue(this.companyDetailsData.status=="E"?true:false);
        this.companyDetails.controls['comp_private_status'].setValue(this.companyDetailsData.private_status=="Y"?true:false);

        this.selectedCountryISO =  this.adminSettingsService.fncountySelected(this.companyDetailsData.country.id);
        
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.companyDetailsData = [];
      }
      this.isLoaderAdmin = false;
    })
  }

  fnSettingMenuToggleSmall(){
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge(){
    this.settingSideMenuToggle = false;
  }

  gelAllCountry(){
    this.adminSettingsService.gelAllCountry().subscribe((response:any) => {
      if(response.data == true){
        this.allCountry = response.response
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.allCountry = [];
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
      }
    })
  }

  selectCountry(country_id){

    this.selectedCountryISO =  this.adminSettingsService.fncountySelected(country_id);

    this.companyDetails.controls['comp_address'].setValue(null);
    this.companyDetails.controls['city'].setValue(null);
    this.companyDetails.controls['state'].setValue(null);
    this.allStates = [];
    this.allStates = [];
    this.allCities = [];

    if(country_id == null || country_id == ''){
      return;
    }

    this.adminSettingsService.gelAllState(country_id).subscribe((response:any) => {
      if(response.data == true){
        this.allStates = response.response
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.allStates = [];
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
      }
    })
  }

  selectStates(state_id){
    this.companyDetails.controls['city'].setValue(null);
    this.allCities = [];

    if(state_id == null || state_id == ''){
      console.log("=====");
      return;
    }
    this.adminSettingsService.gelAllCities(state_id).subscribe((response:any) => {
      if(response.data == true && response.response!="no city found"){
        this.allCities = response.response;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.allCities = [];
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
      }
    })
  }

  fnUpdateCompanyDetail(){
    if(this.companyDetails.invalid){
    this.companyDetails.get('company_name').markAsTouched();
      this.companyDetails.get('comp_email').markAllAsTouched();
      this.companyDetails.get('comp_website').markAsTouched();
      this.companyDetails.get('comp_mobile').markAsTouched();
      this.companyDetails.get('country').markAsTouched();
      this.companyDetails.get('comp_address').markAsTouched();
      this.companyDetails.get('city').markAsTouched();
      this.companyDetails.get('state').markAsTouched();
      this.companyDetails.get('zip_code').markAsTouched();
      this.companyDetails.get('comp_decs').markAsTouched();
    }
    var comp_mobile =  this.companyDetails.get('comp_mobile').value;
    console.log(comp_mobile);
    
    if(comp_mobile==undefined){ 
      this.phoneNumberInvalid = "required";
      return; 
    }

    if(comp_mobile.number.length < 6 || comp_mobile.number.length > 15){
      this.phoneNumberInvalid = "length";
      return;
    }
    
    var phone = this.companyDetails.get('comp_mobile').value.number.replace(/\s/g, "");

    
    if(this.companyDetails.valid){
      if( this.companyDetailsImageUrl != ''){
        this.updateCompanyDetailsData ={
          "business_id" : this.businessId,
          "company_name" : this.companyDetails.get('company_name').value,
          "email" : this.companyDetails.get('comp_email').value,
          "website" : this.companyDetails.get('comp_website').value,
          "phone" : phone.split('-').join(''),
          "country_code" : this.companyDetails.get('comp_mobile').value.dialCode.replace(/\s/g, ""),
          "country" : this.companyDetails.get('country').value,
          "address" : this.companyDetails.get('comp_address').value,
          "city" : this.companyDetails.get('city').value,
          "state" : this.companyDetails.get('state').value,
          "zip" : this.companyDetails.get('zip_code').value,
          "description" : this.companyDetails.get('comp_decs').value,
          "status" : this.companyDetails.get('comp_status').value==true?"E":"D",
          "private_status" : this.companyDetails.get('comp_private_status').value==true?"Y":"N",
          'image': this.companyDetailsImageUrl
        }
      }
      else if(this.companyDetailsImageUrl == ''){
        this.updateCompanyDetailsData ={
          "business_id" : this.businessId,
          "company_name" : this.companyDetails.get('company_name').value,
          "email" : this.companyDetails.get('comp_email').value,
          "website" : this.companyDetails.get('comp_website').value,
          "phone" : this.companyDetails.get('comp_mobile').value.number.replace(/\s/g, ""),
          "country_code" : this.companyDetails.get('comp_mobile').value.dialCode.replace(/\s/g, ""),
          "country" : this.companyDetails.get('country').value,
          "address" : this.companyDetails.get('comp_address').value,
          "city" : this.companyDetails.get('city').value,
          "state" : this.companyDetails.get('state').value,
          "zip" : this.companyDetails.get('zip_code').value,
          "description" : this.companyDetails.get('comp_decs').value,
          "status" : this.companyDetails.get('comp_status').value==true?"E":"D",
          "private_status" : this.companyDetails.get('comp_private_status').value==true?"Y":"N",
        }
      }
      this.fnupdateBusineData(this.updateCompanyDetailsData);
    }
  }

  fnupdateBusineData(updateCompanyDetailsData){
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnupdateBusineData(updateCompanyDetailsData).subscribe((response:any) => {
      this.isLoaderAdmin = false;
      if(response.data == true){
        this._snackBar.open("Company detail updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.companyDetailsImageUrl = undefined;
        this.getCompanyDetails();
      } else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
      }
    });
  }
  fnCancelBusiness(){
    this.isLoaderAdmin = true;
    this.getCompanyDetails();
    this.isLoaderAdmin = false;
  }

  companyDetailsImage() {
    const dialogRef = this.dialog.open(DialogCompanyDetailsImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.companyDetailsImageUrl = result;
            console.log(result);
           }
     });
  }

 
}


@Component({
  selector: 'staff-image-upload',
  templateUrl: '../_dialogs/company-details-image-upload.html',
})
export class DialogCompanyDetailsImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogCompanyDetailsImageUpload>,
  private _formBuilder:FormBuilder,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
      this.dialogRef.close(this.profileImage);
    }
    ngOnInit() {
      this.uploadForm = this._formBuilder.group({
        profile: ['']
      });
    }
    get f() {
      return this.uploadForm.controls;
    }
    
onFileChange(event) {

  var file_type = event.target.files[0].type;

  if(file_type!='image/jpeg' &&  file_type!='image/png' && file_type!='image/jpg' &&  file_type!='image/gif'){
      
      this._snackBar.open("Sorry, only JPG, JPEG, PNG & GIF files are allowed.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
      });
      return;
  }
 
  
  const reader = new FileReader();
  if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.uploadForm.patchValue({
              fileSource: reader.result
          });
      };
  }
}
uploadImage() {
  this.profileImage = this.imageSrc
  this.dialogRef.close(this.profileImage);
}


}
