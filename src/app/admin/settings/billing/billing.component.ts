import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { DatePipe} from '@angular/common';
import { AuthenticationService } from '@app/_services';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
 


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
  isLoaderAdmin:boolean=false;
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
    }
    else if(response.data == false && response.response !== 'api token or userid invaild'){
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
      data: "Are you sure?"
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
      
    }
    else if(response.data == false && response.response !== 'api token or userid invaild'){
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

}
