import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DatePipe} from '@angular/common';
import { AuthenticationService } from '@app/_services';
import { AppComponent } from '@app/app.component'
import { environment } from '@environments/environment';
import { SuperAdminService } from '../_services/super-admin.service';


export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-my-subscriptions',
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.scss'],
  providers: [DatePipe]
})
export class MySubscriptionsComponent implements OnInit {

  subscriptionList:any;
  isLoaderAdmin:boolean = false;


  constructor(
    
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private SuperAdminService: SuperAdminService,
  ) { }

  ngOnInit() {
    this.getSubscriptionList();
  }

  

  getSubscriptionList(){
    this.isLoaderAdmin= true;
    this.SuperAdminService.getSubscriptionList().subscribe((response:any) => {
      if(response.data == true){
        this.subscriptionList = response.response;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
    this.isLoaderAdmin= false;
  }
  fnDeletePlan(planId){
    this.isLoaderAdmin= true;
    let requestObject = {
      'plan_id': planId
    }
    this.SuperAdminService.fnDeletePlan(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
    this.isLoaderAdmin= false;
  }

  fnAddNewPlan() {
    const dialogRef = this.dialog.open(DialogAddNewPlan, {
      width: '800px',
      
    });

    dialogRef.afterClosed().subscribe(result => {
        this.getSubscriptionList();
    });
  }

}

@Component({
  selector: 'add-new-plan',
  templateUrl: '../_dialogs/add-new-plan.html',
  providers: [DatePipe]
})
export class DialogAddNewPlan {
  addPlanForm:FormGroup
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  newPlanData:any;
  isLoaderAdmin:boolean = false;
  currentUser:any;
  superAdminId:any;
  SAToken:any;

  constructor(
    public dialogRef: MatDialogRef<DialogAddNewPlan>,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private SuperAdminService: SuperAdminService,
    private _snackBar: MatSnackBar,
    private authenticationService:AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.superAdminId=JSON.stringify(this.authenticationService.currentUserValue.user_id);
        this.SAToken = this.authenticationService.currentUserValue.token;
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

    private handleError(error: HttpErrorResponse) {
      console.log(error);
      return throwError('Error! something went wrong.');
    } 
    ngOnInit() {
      this.addPlanForm = this._formBuilder.group({
        name: ['',Validators.required,this.isNameUnique.bind(this)],
        amount: ['', [Validators.required,Validators.pattern(this.onlynumeric)]],
        interval: ['',Validators.required],
        business:['', [Validators.required,Validators.pattern(this.onlynumeric)]],
        staff:['', [Validators.required,Validators.pattern(this.onlynumeric)]],
        customer:['', [Validators.required,Validators.pattern(this.onlynumeric)]],
        service:['', [Validators.required,Validators.pattern(this.onlynumeric)]],
      });
    }
    submitNewPlan(){
      if(this.addPlanForm.valid){
        this.newPlanData  = {
          'plan_name' : this.addPlanForm.get('name').value,
          'amount' : this.addPlanForm.get('amount').value,
          'interval' : this.addPlanForm.get('interval').value,
          'business_limit' : this.addPlanForm.get('business').value,
          'staff_limit' : this.addPlanForm.get('staff').value,
          'customer_limit' : this.addPlanForm.get('customer').value,
          'service_limit' : this.addPlanForm.get('service').value,
          'currency' : 'USD',
        }
        this.fnCreateNewPlan(this.newPlanData);
      }else{
        console.log(this.addPlanForm)
        this.addPlanForm.get('name').markAsTouched();
        this.addPlanForm.get('amount').markAsTouched();
        this.addPlanForm.get('interval').markAsTouched();
        this.addPlanForm.get('business').markAsTouched();
        this.addPlanForm.get('staff').markAsTouched();
        this.addPlanForm.get('customer').markAsTouched();
        this.addPlanForm.get('service').markAsTouched();
      }
    }
    fnCreateNewPlan(requestObject){
      this.isLoaderAdmin= true;
      this.SuperAdminService.fnCreateNewPlan(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
        }else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
      })
      this.isLoaderAdmin= false;
    }
    isNameUnique(control: FormControl) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'superadmin-id': this.superAdminId,
            'api-token': this.SAToken,
          });
          return this.http.post(`${environment.apiUrl}/check-plan-name`,{ plan_name: control.value },{headers:headers}).pipe(map((response : any) =>{
            return response;
          }),
          catchError(this.handleError)).subscribe((res) => {
            if(res){
              if(res.data == false){
              resolve({ isNameUnique: true });
              // this._snackBar.open("Access PIN already in use", "X", {
              // duration: 2000,
              // verticalPosition: 'top',
              // panelClass : ['red-snackbar']
              // });
              }else{
              resolve(null);
              }
            }
          });
        }, 500);
      });
    }
  
}