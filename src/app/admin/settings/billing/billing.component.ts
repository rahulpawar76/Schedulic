import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { DatePipe} from '@angular/common';
import { AuthenticationService } from '@app/_services';
import { AdminSettingsService } from '../_services/admin-settings.service';



export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  planList:any;
  currentUser:any;
  selectedPlanCode:any;
  settingSideMenuToggle:boolean = false;

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authenticationService:AuthenticationService,
    private AdminSettingsService: AdminSettingsService,
  ) { 
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if(this.currentUser.plan){
      this.selectedPlanCode = this.currentUser.plan.plan_id
    }
  }

  ngOnInit() {
    this.getSubscriptionPlans();
  }

  fnSettingMenuToggleSmall(){
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge(){
    this.settingSideMenuToggle = false;
  }

  getSubscriptionPlans(){
    let requestObject = {

    }
    this.AdminSettingsService.getSubscriptionPlans(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this.planList = response.response
      this.planList.forEach( (element) => { 
        if(element.plan_id===this.selectedPlanCode){
          element.selected = true;
        }else{
          element.selected = false;
        }
      });
    }
    else if(response.data == false && response.response !== 'api token or userid invaild'){
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
        });
    }
  });
}

  fnPaymentNow(planId) {
    const dialogRef = this.dialog.open(DialogAdminSubscriptionCardForm, {
      width: '800px',
      data: {planId :planId}
      
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

@Component({
  selector: 'subscription-payment',
  templateUrl: '../../../_dialogs/dialog-subscription-payment.html',
  providers: [DatePipe]
})
export class DialogAdminSubscriptionCardForm {
  isLoaderAdmin:boolean = false;
  cardForm:FormGroup
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  planId:any;
  adminData:any;
  cardPaymentForm:FormGroup;
  
  constructor(
    public dialogRef: MatDialogRef<DialogAdminSubscriptionCardForm>,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private authenticationService:AuthenticationService,
    private AdminSettingsService: AdminSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.planId = this.data.planId
      
    this.adminData = JSON.parse(localStorage.getItem('adminData'));
    }
    onNoClick(): void {
      this.dialogRef.close();
      
    }

    ngOnInit() {
      this.cardPaymentForm = this._formBuilder.group({
        name: ['', Validators.required],
        cardNumber: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(16),Validators.minLength(16)]],
        cardEXMonth: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(2),Validators.minLength(2)]],
        cardEXYear: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(4),Validators.minLength(4)]],
        cardCVV: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(3),Validators.minLength(3)]],
      });
    }

    fnPayNow(){
      let requestObject = {
        'user_id' : JSON.stringify(this.adminData.user_id),
        'card_name' : this.cardPaymentForm.get('name').value,
        'card_number' : this.cardPaymentForm.get('cardNumber').value,
        'exp_month' : this.cardPaymentForm.get('cardEXMonth').value,
        'exp_year' : this.cardPaymentForm.get('cardEXYear').value,
        'cvc_number' : this.cardPaymentForm.get('cardCVV').value,
        'plan_id' :this.planId
      }
      this.AdminSettingsService.getSubscriptionPayment(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
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
    });
  }

    
  }

