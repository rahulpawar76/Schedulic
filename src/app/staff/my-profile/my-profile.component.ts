import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '@environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit {
 animal: any;
  constructor(public dialog: MatDialog, private http: HttpClient) { }

  ngOnInit() {
  }
     ImgUpload() {
    const dialogRef = this.dialog.open(DialogStaffImageUpload, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }

}

@Component({
	  selector: 'image-upload-dialog',
	  templateUrl: 'image-upload-dialog.html',
	})
	export class DialogStaffImageUpload {

	  constructor(
	    public dialogRef: MatDialogRef<DialogStaffImageUpload>,
	    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

	  onNoClick(): void {
	    this.dialogRef.close();
	  }

	}