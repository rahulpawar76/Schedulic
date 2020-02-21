import { Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AdminService } from '../_services/admin-main.service'
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
  allBusiness: any;
   
  constructor(
    public dialog: MatDialog,
     private http: HttpClient,
     public router: Router,
    private AdminService: AdminService,
     private _snackBar: MatSnackBar) {
      localStorage.setItem('isBusiness', 'true');
   }

  ngOnInit() {
    this.getAllBusiness();
  }

  getAllBusiness(){
    this.AdminService.getAllBusiness().subscribe((response:any) => {
      if(response.data == true){
        this.allBusiness = response.response
      }
      else if(response.data == false){
        this.allBusiness = ''
      }
    })
  }
  fnSelectBusiness(business_id){
    localStorage.setItem('business_id', business_id);
    this.router.navigate(['/admin/my-workspace']);
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
  

  constructor(
    public dialogRef: MatDialogRef<myCreateNewBusinessDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  
}
