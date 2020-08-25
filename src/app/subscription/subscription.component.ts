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


export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  constructor(
    
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  fnPaymentNow() {
    const dialogRef = this.dialog.open(DialogSubscriptionCardForm, {
      width: '800px',
      
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
@Component({
  selector: 'subscription-payment',
  templateUrl: '../_dialogs/dialog-subscription-payment.html',
  providers: [DatePipe]
})
export class DialogSubscriptionCardForm {
  cardForm:FormGroup
  onlynumeric = /^-?(0|[1-9]\d*)?$/
 

  
  constructor(
    public dialogRef: MatDialogRef<DialogSubscriptionCardForm>,
    private _formBuilder:FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private authenticationService:AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
     
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

    ngOnInit() {
      
    }
  }
