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
  error:any;
  appointments:any=[];
  categories:any=[];
  businessId:any;
  revenue:any;
  constructor(
    public dialog: MatDialog,
     private http: HttpClient,
     public router: Router,
     private adminService: AdminService,
     private _snackBar: MatSnackBar) {
       
      localStorage.setItem('isBusiness', 'false');
   }

  ngOnInit() {
    this.businessId=localStorage.getItem('business_id');
    this.fnGetTodayRevenue("all");
    this.fnGetAllAppointmentsByCategoryAndStatus("all");
    this.fnGetAllCategories();
  }

  fnGetAllAppointmentsByCategoryAndStatus(categoryId){
    let requestObject = {
            "business_id":this.businessId,
            "category":categoryId,
            "status_filter":"all"
        };
     this.adminService.getAllAppointmentsByCategoryAndStatus(requestObject).subscribe((response:any) => 
  {
    if(response.data == true){
      this.appointments=response.response.data;
    }else{
      this.appointments=[];
    }
  },
    (err) => {
      this.error = err;
    }
  )
  }

  fnGetAllCategories(){

  let requestObject = {
    "business_id":this.businessId,
    "status":"E"
    };
     this.adminService.getAllCategories(requestObject).subscribe((response:any) => 
  {
    if(response.data == true){
      this.categories=response.response;
    }
  },
    (err) => {
      this.error = err;
    }
  )
  }

  fnGetTodayRevenue(categoryId){

  let requestObject = {
    "business_id":this.businessId,
    "services":categoryId
    };
     this.adminService.getTodayRevenue(requestObject).subscribe((response:any) => 
  {
    if(response.data == true){
      this.revenue=response.response;
    }
  },
    (err) => {
      this.error = err;
    }
  )
  }
  
  myworkspaceAccept() {
    const dialogRef = this.dialog.open(myWorkSpaceAcceptDialog, {
      width: '600px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

  fnOnClickCategory(categoryId){
    this.fnGetTodayRevenue(categoryId);
    this.fnGetAllAppointmentsByCategoryAndStatus(categoryId);
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

