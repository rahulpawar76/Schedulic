import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '@app/app.component'
import { AdminSettingsService } from '../../_services/admin-settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '@app/_components/confirmation-dialog/confirmation-dialog.component';


export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-paymentrules',
  templateUrl: './paymentrules.component.html',
  styleUrls: ['./paymentrules.component.scss']
})
export class PaymentrulesComponent implements OnInit {
  animal: any;
  businessId: any;
  adminSettings: boolean = true;
  isLoaderAdmin : boolean = false;
  taxesData: any;
  currenciesData: any;
  selectedCurrency: any;
  selectedCurrencyPosition: any;
  selectedCurrencyFormat: any;
  settingSideMenuToggle : boolean = false;

  constructor(
    public dialog: MatDialog,
    private appComponent: AppComponent,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(AdminSettingsService) public AdminSettingsService: AdminSettingsService,

  ) {
    if (localStorage.getItem('business_id')) {
        this.businessId = localStorage.getItem('business_id');
    }
  }

  ngOnInit() {
    this.getAllCurrencies();
    this.fnGetSettingValue();
    this.getAllTax();
  }

  fnGetSettingValue() {
    let requestObject = {
        'business_id': this.businessId,
    };
    this.isLoaderAdmin = true;
    this.AdminSettingsService.getSettingValue(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.selectedCurrency = response.response.currency;
        this.selectedCurrencyPosition = response.response.currency_symbol_position;
        this.selectedCurrencyFormat = response.response.currency_format;
     //   console.log(this.taxesData);
      }
      this.isLoaderAdmin = false;
    })
  }

  getAllTax() {
    this.isLoaderAdmin = true;
    let requestObject = {
      'business_id': this.businessId,
    };
    this.AdminSettingsService.getAllTax(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.taxesData = response.response;
       // console.log(this.taxesData);
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.taxesData = '';
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

  

  deleteTax(tax_id) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result){
        this.isLoaderAdmin = true;
    this.AdminSettingsService.deleteTax(tax_id).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Tax Deleted.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.getAllTax();
        this.isLoaderAdmin = false;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        // this.allCustomers = ''
        this.getAllTax();
        this.isLoaderAdmin = false;
      }
    })
    }
  });
    
  }

  addTax() {
    const dialogRef = this.dialog.open(DialogAddNewTax, {
      width: '500px',

    });

    dialogRef.afterClosed().subscribe(result => {
     // console.log('The dialog was closed');
      this.getAllTax();
      this.animal = result;
    });
  }

  getAllCurrencies() {
    let requestObject = {
        'business_id': this.businessId,
    };
    this.AdminSettingsService.getAllCurrencies(requestObject).subscribe((response: any) => {
      this.currenciesData = response.response;
     // console.log(this.currenciesData);
    })
  }
  fnChangeCurrency(currencyCode) {
    this.isLoaderAdmin = true;
    let requestObject = {
        'business_id': this.businessId,
        "currency_code": currencyCode
    };
    this.AdminSettingsService.fnChangeCurrency(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Currency Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }
  fnCurrencyPosition(currencyPosition) {
    this.isLoaderAdmin = true;
    let requestObject = {
      'business_id': this.businessId,
      'position': currencyPosition
  };
    this.AdminSettingsService.fnCurrencyPosition(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Currency Position Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }
  fnCurrencyFormat(currencyFormat) {
    this.isLoaderAdmin = true;
    let requestObject = {
      'business_id': this.businessId,
      'currency_format': currencyFormat
    };
    this.AdminSettingsService.fnCurrencyFormat(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Currency Format Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })

  }


}
@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/add-tax-dialog.html',
})
export class DialogAddNewTax {
  taxAdd: FormGroup;
  createAddTaxData: any;
  businessId: any;

  onlynumeric = /^-?(0|[1-9]\d*)?$/

  constructor(
    public dialogRef: MatDialogRef<DialogAddNewTax>,
    private _formBuilder: FormBuilder,
    @Inject(AdminSettingsService) public AdminSettingsService: AdminSettingsService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    localStorage.setItem('isBusiness', 'false');
    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.taxAdd = this._formBuilder.group({
      tax_name: ['', [Validators.required, Validators.maxLength(10)]],
      tax_per: ['', [Validators.required, Validators.pattern(this.onlynumeric), Validators.max(100)]],

    });
  }
  fnAddTaxSubmit() {
    if (this.taxAdd.valid) {
      this.createAddTaxData = {
        'business_id': this.businessId,
        'tax_name': this.taxAdd.get('tax_name').value,
        'tax_value': this.taxAdd.get('tax_per').value,
      }
      this.fnAddTax(this.createAddTaxData);
    }else{
      this.taxAdd.get("tax_name").markAsTouched();
      this.taxAdd.get("tax_per").markAsTouched();
    }
  }
  fnAddTax(createAddTaxData) {
    //this.isLoaderAdmin = true;
    this.AdminSettingsService.fnAddTax(createAddTaxData).subscribe((response: any) => {
      if (response.data == true) {
        this.dialogRef.close();
        this._snackBar.open("Tax Created.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    })
  }



}
