import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AdminSettingsService } from '../_services/admin-settings.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
  adminSettings : boolean = true;
  companyDetails:FormGroup;
  companyDetailsData:any;
  updateCompanyDetailsData:any;
  allCountry: any;
  allStates: any;
  allCities: any;
  businessId: any;
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  constructor(
    private _formBuilder:FormBuilder,
    public adminSettingsService : AdminSettingsService,
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
      company_name : ['', Validators.required],
      comp_email : ['',[Validators.pattern(this.emailFormat)]],
      comp_website : [''],
      comp_mobile : ['',[Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
      country:['', Validators.required],
      comp_address:['', Validators.required],
      city:['', Validators.required],
      state:['', Validators.required],
      zip_code:['', Validators.required],
      comp_decs:[''],
      comp_status:[false],
      comp_private_status:[false],
    });
  }



  getCompanyDetails(){

    this.adminSettingsService.getCompanyDetails().subscribe((response:any) => {
      if(response.data == true){
        this.companyDetailsData = response.response;
        console.log(this.companyDetailsData);
        this.selectCountry(this.companyDetailsData.country);
        this.selectStates(this.companyDetailsData.state);
        this.companyDetails.controls['company_name'].setValue(this.companyDetailsData.business_name);
        this.companyDetails.controls['comp_email'].setValue(this.companyDetailsData.email);
        this.companyDetails.controls['comp_website'].setValue(this.companyDetailsData.website);
        this.companyDetails.controls['comp_mobile'].setValue(this.companyDetailsData.phone);
        this.companyDetails.controls['country'].setValue(this.companyDetailsData.country);
        this.companyDetails.controls['comp_address'].setValue(this.companyDetailsData.address);
        this.companyDetails.controls['city'].setValue(this.companyDetailsData.city);
        this.companyDetails.controls['state'].setValue(this.companyDetailsData.state);
        this.companyDetails.controls['zip_code'].setValue(this.companyDetailsData.zipcode);
        this.companyDetails.controls['comp_decs'].setValue(this.companyDetailsData.description);
        this.companyDetails.controls['comp_status'].setValue(this.companyDetailsData.status=="E"?true:false);
        this.companyDetails.controls['comp_private_status'].setValue(this.companyDetailsData.private_status=="Y"?true:false);
      }
      else if(response.data == false){
       this.companyDetailsData = [];
      }
    })
  }

  gelAllCountry(){
    this.adminSettingsService.gelAllCountry().subscribe((response:any) => {
      if(response.data == true){
        this.allCountry = response.response
      }
      else if(response.data == false){
        this.allCountry = ''
      }
    })
  }
  selectCountry(country_id){
    this.adminSettingsService.gelAllState(country_id).subscribe((response:any) => {
      if(response.data == true){
        this.allStates = response.response
      }
      else if(response.data == false){
        this.allStates = [];
      }
    })
  }
  selectStates(state_id){
    this.adminSettingsService.gelAllCities(state_id).subscribe((response:any) => {
      if(response.data == true){
        this.allCities = response.response
      }
      else if(response.data == false){
        this.allCities = [];
      }
    })
  }
  fnUpdateCompanyDetail(){
    if(this.companyDetails.valid){
      this.updateCompanyDetailsData ={
        "business_id" : this.businessId,
        "company_name" : this.companyDetails.get('company_name').value,
        "email" : this.companyDetails.get('comp_email').value,
        "website" : this.companyDetails.get('comp_website').value,
        "phone" : this.companyDetails.get('comp_mobile').value,
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
    //this.CompanyDetail(this.updateCompanyDetailsData);
    console.log(this.updateCompanyDetailsData);
    this.fnupdateBusineData(this.updateCompanyDetailsData);
  }

  fnupdateBusineData(updateCompanyDetailsData){
    this.adminSettingsService.fnupdateBusineData(updateCompanyDetailsData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Company Detail Updated", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
      }
      else if(response.data == false){
        this.allCities = ''
      }
    })
  }


}
