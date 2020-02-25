import { Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AdminService } from '../_services/admin-main.service'

@Component({
  selector: 'app-my-work-space',
  templateUrl: './my-work-space.component.html',
  styleUrls: ['./my-work-space.component.scss']
})
export class MyWorkSpaceComponent implements OnInit {
  animal :any;
  constructor(
    public dialog: MatDialog,
     private http: HttpClient,
     public router: Router,
     private AdminService: AdminService,
     private _snackBar: MatSnackBar) {
       
      localStorage.setItem('isBusiness', 'false');
   }

  ngOnInit() {
  }

  
  myworkspaceAccept() {
    const dialogRef = this.dialog.open(myWorkSpaceAcceptDialog, {
      width: '600px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }


}



@Component({
  selector: 'myworkspace-accept',
  templateUrl: '../_dialogs/myworkspace-accept-dialog.html',
})
export class myWorkSpaceAcceptDialog {

  constructor(
    public dialogRef: MatDialogRef<myWorkSpaceAcceptDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
}

