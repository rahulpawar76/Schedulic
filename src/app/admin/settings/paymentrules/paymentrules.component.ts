import { Component, OnInit , Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppComponent } from '@app/app.component'
import { AdminSettingsService } from '../_services/admin-settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  adminSettings : boolean = true;
  taxesData :any;
  currenciesData :any;

  constructor(
    public dialog: MatDialog,
    private appComponent : AppComponent,
    private _formBuilder: FormBuilder,
    private AdminSettingsService: AdminSettingsService,
    
  )   {
    //this.appComponent.settingsModule(this.adminSettings);
   }

  ngOnInit() {
    this.getAllTax();
    this.getAllCurrencies();
  }

  

getAllTax(){
  this.AdminSettingsService.getAllTax().subscribe((response:any)=>{
    if(response.data == true){
      this.taxesData = response.response;
      console.log(this.taxesData);
    }
  })
}

  addTax() {
    const dialogRef = this.dialog.open(DialogAddNewTax, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
       this.animal = result;
     });
  }

  getAllCurrencies(){
    this.AdminSettingsService.getAllCurrencies().subscribe((response:any)=>{
        this.currenciesData = response.response;
        console.log(this.currenciesData);
    })
  }


}
@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/add-tax-dialog.html',
})
export class DialogAddNewTax {
  taxAdd:FormGroup;
  createAddTaxData: any;
  businessId: any;

  onlynumeric = /^-?(0|[1-9]\d*)?$/

constructor(
  public dialogRef: MatDialogRef<DialogAddNewTax>,
  private _formBuilder: FormBuilder,
  private AdminSettingsService: AdminSettingsService,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    localStorage.setItem('isBusiness', 'false');
      if(localStorage.getItem('business_id')){
        this.businessId = localStorage.getItem('business_id');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.taxAdd = this._formBuilder.group({
      tax_name : ['', Validators.required],
      tax_per : ['', [Validators.required,Validators.pattern(this.onlynumeric)]],
      
    });
  }
  fnAddTaxSubmit(){
    if(this.taxAdd.valid){
      this.createAddTaxData ={
        'business_id' : this.businessId,
        'tax_name' : this.taxAdd.get('tax_name').value,
        'tax_value' : this.taxAdd.get('tax_per').value,
      }
      this.fnAddTax(this.createAddTaxData);
    }
  }
  fnAddTax(createAddTaxData){
    //this.isLoaderAdmin = true;
    this.AdminSettingsService.fnAddTax(createAddTaxData).subscribe((response:any) => {
      if(response.data == true){
        this.dialogRef.close();
        this._snackBar.open("Tax Created", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
      }
      else if(response.data == false){
        // this.allCustomers = ''
      //this.isLoaderAdmin = false;
      }
    })
  }
}
