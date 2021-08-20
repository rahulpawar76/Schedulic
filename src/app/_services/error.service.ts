import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';

export interface DialogData {
  animal: string;
  name: string;
}
@Injectable({
  providedIn: 'root'
})

export class ErrorService {
  currentUser:any
  boxOfficeCode:any;
  dialogRef:any;
  constructor(
    public dialog: MatDialog,
    public router: Router,
    private _snackBar : MatSnackBar,
  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }
  
  errorMessage(errorMessage){
    
    this._snackBar.open(errorMessage, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
    });
   
  }

  successMessage(errorMessage){

    this._snackBar.open(errorMessage, "X", {
      duration: 2000,
      verticalPosition: 'top',
      panelClass : ['green-snackbar']
    });

  }
  
}
