import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DatePipe} from '@angular/common';
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
    this.SuperAdminService.getSubscriptionList().subscribe((response:any) => {
      if(response.data == true){
        this.subscriptionList = response.response;
        this.subscriptionList.forEach( (element) => { 
          
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
          
        });
      }
    })
  }

  fnAddNewPlan() {
    const dialogRef = this.dialog.open(DialogAddNewPlan, {
      width: '500px',
      
    });

    dialogRef.afterClosed().subscribe(result => {
        // if(result != undefined){
        //     this.myProfileImageUrl = result;
        //     console.log(result);
        //   }
    });
  }

}

@Component({
  selector: 'add-new-plan',
  templateUrl: '../_dialogs/add-new-plan.html',
  providers: [DatePipe]
})
export class DialogAddNewPlan {



  constructor(
    public dialogRef: MatDialogRef<DialogAddNewPlan>,
    private _formBuilder:FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    }
  
}