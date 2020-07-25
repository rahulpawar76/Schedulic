import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component'
import { AdminSettingsService } from '../_services/admin-settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-paymentgateway',
  templateUrl: './paymentgateway.component.html',
  styleUrls: ['./paymentgateway.component.scss']
})
export class PaymentgatewayComponent implements OnInit {
  adminSettings : boolean = true;

  
  paypal: FormGroup;
  stripe: FormGroup;
  payumoney: FormGroup;
  bankTransfer: FormGroup;
  settingsValue: any;
  paypalSettingValue: any;
  stripeSettingValue: any;
  payUMoneySettingValue: any;
  bankTransferSettingValue: any;
  isLoaderAdmin : boolean = false;
  businessId : any;
  paypalStatus : boolean = false;
  stripeStatus : boolean = false;
  payumoneyStatus : boolean = false;
  bankTransferStatus : boolean = false;
  paypalGuestStatus : boolean = false;
  paypalTestStatus : boolean = false;
  settingSideMenuToggle : boolean = false;
  

  constructor(
    private appComponent : AppComponent,
    public adminSettingsService : AdminSettingsService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
  )
   {
    //this.appComponent.settingsModule(this.adminSettings);
    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
    }
   }

  ngOnInit() {
    this.getSettingsValue();
    this.paypal = this._formBuilder.group({
      clientId: ['',[Validators.required]],
      // apiUsername: ['',[Validators.required]],
      // apiPassword: ['',[Validators.required]],
      // signature: ['',[Validators.required]]
    });
    this.stripe = this._formBuilder.group({
      secretKey: ['',[Validators.required]],
      publishableKey: ['',[Validators.required]],
    });
    this.payumoney = this._formBuilder.group({
      merchantKey: ['',[Validators.required]],
      saltKey: ['',[Validators.required]],
    });
    this.bankTransfer = this._formBuilder.group({
      bankName: ['',[Validators.required]],
      accountName: ['',[Validators.required]], 
      accountNumber: ['',[Validators.required]], 
      branchCode: [''], 
      IFSCCode: ['',[Validators.required]], 
      bankDescription: [''], 
    });
  }
  fnSettingMenuToggleSmall(){
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge(){
    this.settingSideMenuToggle = false;
  }

  getSettingsValue(){
    let requestObject={
      "business_id":this.businessId
    }
    this.adminSettingsService.getSettingsValue(requestObject).subscribe((response:any) => {
        console.log(response.response);
        if(response.data == true && response.response != ''){
          this.settingsValue = response.response;
          if(this.settingsValue.pay_pal_settings){
            this.paypalSettingValue = JSON.parse(this.settingsValue.pay_pal_settings);
            this.paypalStatus = this.paypalSettingValue.status
            this.paypalTestStatus = this.paypalSettingValue.test_mode
            this.paypal.controls['clientId'].setValue(this.paypalSettingValue.client_id)
            // this.paypalSettingValue = JSON.parse(this.settingsValue.pay_pal_settings);
            // this.paypal.controls['apiUsername'].setValue(this.paypalSettingValue.api_username);
            // this.paypal.controls['apiPassword'].setValue(this.paypalSettingValue.api_password);
            // this.paypal.controls['signature'].setValue(this.paypalSettingValue.signature);
          }
          if(this.settingsValue.stripe_settings){
            this.stripeSettingValue = JSON.parse(this.settingsValue.stripe_settings);
            this.stripeStatus = this.stripeSettingValue.status
            this.stripe.controls['secretKey'].setValue(this.stripeSettingValue.secret_key);
            this.stripe.controls['publishableKey'].setValue(this.stripeSettingValue.publishable_key);
          }
          if(this.settingsValue.payUmoney_settings){
            this.payUMoneySettingValue = JSON.parse(this.settingsValue.payUmoney_settings);
            this.payumoneyStatus = this.payUMoneySettingValue.status
            this.payumoney.controls['merchantKey'].setValue(this.payUMoneySettingValue.merchant_key);
            this.payumoney.controls['saltKey'].setValue(this.payUMoneySettingValue.salt_key);
          }
          if(this.settingsValue.bank_transfer){
            this.bankTransferSettingValue = JSON.parse(this.settingsValue.bank_transfer);
            this.bankTransferStatus = this.bankTransferSettingValue.status
            this.bankTransfer.controls['bankName'].setValue(this.bankTransferSettingValue.bank_name);
            this.bankTransfer.controls['accountName'].setValue(this.bankTransferSettingValue.account_name);
            this.bankTransfer.controls['accountNumber'].setValue(this.bankTransferSettingValue.account_number);
            this.bankTransfer.controls['branchCode'].setValue(this.bankTransferSettingValue.branch_code);
            this.bankTransfer.controls['IFSCCode'].setValue(this.bankTransferSettingValue.IFSC_code);
            this.bankTransfer.controls['bankDescription'].setValue(this.bankTransferSettingValue.bank_description);
          }
        }
        else{
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['green-snackbar']
          });
        }
    })
  }

  fnPaypalStatus(event){
    this.paypalStatus = event;
    let PaypalSetting = {
      "client_id":this.paypal.get('clientId').value,
      // "api_username":this.paypal.get('apiUsername').value,
      // "api_password":this.paypal.get('apiPassword').value,
      // "signature":this.paypal.get('signature').value,
      // "paypal_guest_payment":this.paypalGuestStatus,
      "test_mode":this.paypalTestStatus,
      "status" : this.paypalStatus
      
    }
    let requestObject = {
      "business_id":this.businessId,
      "status":this.paypalStatus,
      "pay_pal_settings":PaypalSetting
      }
      this.updatePaypalSetting(requestObject);
  }

  fnPaypalGuest(event){
    this.paypalGuestStatus = event;
  }
  fnPaypalTest(event){
    this.paypalTestStatus = event;
  }

  fnSubmitPaypal(){
    if(this.paypal.valid){
      let PaypalSetting = {
        "client_id":this.paypal.get('clientId').value,
        // "api_username":this.paypal.get('apiUsername').value,
        // "api_password":this.paypal.get('apiPassword').value,
        // "signature":this.paypal.get('signature').value,
        // "paypal_guest_payment":this.paypalGuestStatus,
        "test_mode":this.paypalTestStatus,
        "status" : this.paypalStatus
        
      }
      let requestObject = {
        "business_id":this.businessId,
        "status":this.paypalStatus,
        "pay_pal_settings":PaypalSetting
        }
        this.updatePaypalSetting(requestObject);
      }

  }

  updatePaypalSetting(requestObject){
    this.adminSettingsService.updatePaypalSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Paypal Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
       this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  fnStripeStatus(event){
    this.stripeStatus = event;
    let stripeSetting = {
      "secret_key":this.stripe.get('secretKey').value,
      "publishable_key":this.stripe.get('publishableKey').value,
      "status" : this.stripeStatus
      
    }
    let requestObject = {
      "business_id":this.businessId,
      "status":this.stripeStatus,
      "stripe_settings":stripeSetting
      }
      this.updateStripeSetting(requestObject);
  }
  fnSubmitStripe(){
    if(this.stripe.valid){
      let stripeSetting = {
        "secret_key":this.stripe.get('secretKey').value,
        "publishable_key":this.stripe.get('publishableKey').value,
        "status" : this.stripeStatus
      }
      let requestObject = {
        "business_id":this.businessId,
        "status":this.stripeStatus,
        "stripe_settings":stripeSetting
      }
      this.updateStripeSetting(requestObject);
    }

  }


  updateStripeSetting(requestObject){
    this.adminSettingsService.updateStripeSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Stripe Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
       this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }
  fnPayumoneyStatus(event){
    this.payumoneyStatus = event;
    let payumoneySetting = {
      "merchant_key":this.payumoney.get('merchantKey').value,
      "salt_key":this.payumoney.get('saltKey').value,
      "status" : this.payumoneyStatus
    }
    let requestObject = {
      "business_id":this.businessId,
      "status":this.payumoneyStatus,
      "payUmoney_settings":payumoneySetting
    }
    this.updatePayumoneySetting(requestObject);
  }
  fnSubmitPayumoney(){
    if(this.payumoney.valid){
      let payumoneySetting = {
        "merchant_key":this.payumoney.get('merchantKey').value,
        "salt_key":this.payumoney.get('saltKey').value,
        "status" : this.payumoneyStatus
      }
      let requestObject = {
        "business_id":this.businessId,
        "status":this.payumoneyStatus,
        "payUmoney_settings":payumoneySetting
      }
      this.updatePayumoneySetting(requestObject);
    }
  }

  updatePayumoneySetting(requestObject){
    this.adminSettingsService.updatePayumoneySetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("PayUMoney Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
       this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }
  fnBankTransferStatus(event){
    this.bankTransferStatus = event;
    let bankTransferSetting = {
      "bank_name":this.bankTransfer.get('bankName').value,
      "account_name":this.bankTransfer.get('accountName').value,
      "account_number":this.bankTransfer.get('accountNumber').value,
      "IFSC_code":this.bankTransfer.get('IFSCCode').value,
      "branch_code":this.bankTransfer.get('branchCode').value,
      "bank_description":this.bankTransfer.get('bankDescription').value,
      "status" : this.bankTransferStatus
    }
    let requestObject = {
      "business_id":this.businessId,
      "status":this.bankTransferStatus,
      "bank_transfer":bankTransferSetting
    }
    this.updateBankTransferSetting(requestObject);
  }
  fnSubmitBankTransfer(){
    if(this.bankTransfer.valid){
      let bankTransferSetting = {
        "bank_name":this.bankTransfer.get('bankName').value,
        "account_name":this.bankTransfer.get('accountName').value,
        "account_number":this.bankTransfer.get('accountNumber').value,
        "IFSC_code":this.bankTransfer.get('IFSCCode').value,
        "branch_code":this.bankTransfer.get('branchCode').value,
        "bank_description":this.bankTransfer.get('bankDescription').value,
        "status" : this.bankTransferStatus
      }
      let requestObject = {
        "business_id":this.businessId,
        "status":this.bankTransferStatus,
        "bank_transfer":bankTransferSetting
      }
      this.updateBankTransferSetting(requestObject);
    }
  }

  updateBankTransferSetting(requestObject){
    this.adminSettingsService.updateBankTransferSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Bank Transfer Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
       this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

}
