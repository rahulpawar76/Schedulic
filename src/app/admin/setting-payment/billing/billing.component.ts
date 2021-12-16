import { Component, OnInit, Inject } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { DatePipe} from '@angular/common';
import { AuthenticationService } from '@app/_services';
import { AdminSettingsService } from '../../_services/admin-settings.service';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '@app/my-date-formats';



export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    DatePipe
  ]
})
export class BillingComponent implements OnInit {
  planList:any;
  currentUser:any;
  selectedPlanCode:any;
  settingSideMenuToggle:boolean = false;
  isLoaderAdmin:boolean=false;
  updatedPlan:any;
  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    public router: Router,
    private authenticationService:AuthenticationService,
    @Inject(AdminSettingsService) public AdminSettingsService: AdminSettingsService,
  ) { 
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if(this.currentUser.plan){
      this.selectedPlanCode = this.currentUser.plan.plan_id
    }
    if(this.currentUser.currentPlan){
      this.currentUser.currentPlan.start_date = this.datePipe.transform(this.currentUser.currentPlan.start_date, 'yyyy/MM/dd');
      this.currentUser.currentPlan.end_date = this.datePipe.transform(this.currentUser.currentPlan.end_date, 'yyyy/MM/dd');
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
    this.isLoaderAdmin=true;
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
    } else if(response.data == false && response.response !== 'api token or userid invaild'){
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
        });
    }
    });
  this.isLoaderAdmin=false;
}

  fnChangePlan(planId) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to Subscribe?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isLoaderAdmin = true;
        let requestObject = {
          'user_id': this.currentUser.user_id,
          'plan_id':planId
        }
        this.AdminSettingsService.fnChangePlan(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.updatedPlan= response.response;
            this.currentUser.currentPlan = this.updatedPlan;
            this.currentUser.plan = this.updatedPlan.plan;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this._snackBar.open("Plan Updated.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['green-snackbar']
            });
            
          this.getSubscriptionPlans();
          
          }else if(response.data == false && response.response !== 'api token or userid invaild'){
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
          });
        }
      });
      this.isLoaderAdmin=false;
    }
  });
}

  fnCancelPlane(){
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you you want to cancel current plan ?"
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result){
        let requestObject = {
          'user_id' : this.currentUser.user_id,
        }
        this.AdminSettingsService.cancelSubscriptionPlans(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.authenticationService.logout();
            this.router.navigate(['/login']);
            return false;
          } else if(response.data == false && response.response !== 'api token or userid invaild'){
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
            });
          }
        });
      }
      
    });
  }

  fnActivatePlan(planId){
    const dialogRef = this.dialog.open(DialogSubscriptionCardForm, {
      width: '800px',
      data: {planId :planId,userId : this.currentUser.user_id}
      
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'success'){
        this.selectedPlanCode = planId;
        window.location.reload();
        this.getSubscriptionPlans();
      }
    });
  }
}


@Component({
  selector: 'subscription-payment',
  templateUrl: '../_dialogs/dialog-subscription-payment.html',
  providers: [DatePipe]
})
export class DialogSubscriptionCardForm {
  isLoaderAdmin:boolean = false;
  cardForm:FormGroup
  onlynumeric = /^-?(0|[0-9]\d*)?$/
  planId:any;
  userId:any;
  adminData:any;
  cardPaymentForm:FormGroup;
  allCountry:any;
  allStates: any;
  allCities: any;
  
  constructor(
    public dialogRef: MatDialogRef<DialogSubscriptionCardForm>,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public adminSettingsService: AdminSettingsService,
    public router: Router,
    private authenticationService:AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.planId = this.data.planId
      this.userId = this.data.userId
      
    this.gelAllCountry();
    }
    onNoClick(): void {
      this.dialogRef.close();
      
    }

    ngOnInit() {
      this.cardPaymentForm = this._formBuilder.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        country: ['', Validators.required], 
        city: ['', Validators.required],
        state: ['', Validators.required],
        cardNumber: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(16),Validators.minLength(16)]],
        zipcode: ['', [Validators.required,Validators.maxLength(6),Validators.minLength(3)]],
        cardEXMonth: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(2),Validators.minLength(2)]],
        cardEXYear: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(2),Validators.minLength(2)]],
        cardCVV: ['', [Validators.required,Validators.pattern(this.onlynumeric),Validators.maxLength(3),Validators.minLength(3)]],
      });
    }

    fnPayNow(){
      if(this.cardPaymentForm.invalid){
        this.cardPaymentForm.get('name').markAsTouched();
        this.cardPaymentForm.get('address').markAsTouched();
        this.cardPaymentForm.get('country').markAsTouched();
        this.cardPaymentForm.get('state').markAsTouched();
        this.cardPaymentForm.get('city').markAsTouched();
        this.cardPaymentForm.get('zipcode').markAsTouched();
        this.cardPaymentForm.get('cardNumber').markAsTouched();
        this.cardPaymentForm.get('cardEXMonth').markAsTouched();
        this.cardPaymentForm.get('cardEXYear').markAsTouched();
        this.cardPaymentForm.get('cardCVV').markAsTouched();
        return false;
      }
      let requestObject = {
        'user_id' : JSON.stringify(this.userId),
        'card_name' : this.cardPaymentForm.get('name').value,
        'address' : this.cardPaymentForm.get('address').value,
        'country' : this.cardPaymentForm.get('country').value,
        'state' : this.cardPaymentForm.get('state').value,
        'city' : this.cardPaymentForm.get('city').value,
        'zip' : this.cardPaymentForm.get('zipcode').value,
        'card_number' : this.cardPaymentForm.get('cardNumber').value,
        'exp_month' : this.cardPaymentForm.get('cardEXMonth').value,
        'exp_year' : this.cardPaymentForm.get('cardEXYear').value,
        'cvc_number' : this.cardPaymentForm.get('cardCVV').value,
        'plan_id' :this.planId
      }
      this.isLoaderAdmin = true;
      this.adminSettingsService.getSubscriptionPayment(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open('Successfully Subscribed', "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
          });
          localStorage.setItem('currentUser', JSON.stringify(response.response));
          this.dialogRef.close('success');
      } else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    });
    }

    gelAllCountry(){
      this.isLoaderAdmin =true;
      this.adminSettingsService.gelAllCountry().subscribe((response:any) => {
        if(response.data == true){
          this.allCountry = response.response
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this.allCountry = ''
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
      })
      this.isLoaderAdmin =false;
    }

    selectCountry(country_id){
      this.isLoaderAdmin =true;
      this.adminSettingsService.gelAllState(country_id).subscribe((response:any) => {
        if(response.data == true){
          this.allStates = response.response
          this.isLoaderAdmin =false;
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this.allStates = ''
          this.cardPaymentForm.controls['business_state'].setValue('');
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
          this.isLoaderAdmin =false;
        }
      })
    }

    selectStates(state_id){
      this.isLoaderAdmin =true;
      this.adminSettingsService.gelAllCities(state_id).subscribe((response:any) => {
        if(response.data == true){
          this.allCities = response.response
          this.isLoaderAdmin =false;
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this.allCities = [];
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
          this.isLoaderAdmin =false;
        }
      })
    }
    
  }
