import { Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface DialogData {
  animal: string;
  name: string;
}


// export interface status {
  
//   id: string;
//   name :string;
//   timezone:string;
  
// }
@Component({
  selector: 'app-my-business',
  templateUrl: './my-business.component.html',
  styleUrls: ['./my-business.component.scss']
})

export class MyBusinessComponent implements OnInit {
  animal :any;
  countries :any = [];
  ct:any;
  
  constructor(
    public dialog: MatDialog,
     private http: HttpClient,
     public router: Router,
     private _snackBar: MatSnackBar) {
       this.countries=[];
      localStorage.setItem('isBusiness', 'true');
      this.ct = require('countries-and-timezones');
      this.countries = this.ct.getAllCountries();
   }

  ngOnInit() {
    console.log(this.ct)
  }

  
  creatNewBusiness() {
    const dialogRef = this.dialog.open(myCreateNewBusinessDialog, {
      width: '1100px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }


}


@Component({
  selector: 'Create-New-Business',
  templateUrl: '../_dialogs/create-new-business-dialog.html',
})
export class myCreateNewBusinessDialog {
  
  status: any;
  
  ct = require('countries-and-timezones');
  countries = this.ct.getAllCountries();

  constructor(
    public dialogRef: MatDialogRef<myCreateNewBusinessDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // countrieslist: status[] = [
  //   this.countries
  // ];
  
}
