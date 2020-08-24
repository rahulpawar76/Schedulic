import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DatePipe} from '@angular/common';
import { AppComponent } from '@app/app.component'
import { environment } from '@environments/environment';
import { SuperAdminService } from '../_services/super-admin.service';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
  providers: [DatePipe]
})
export class AdminsComponent implements OnInit {
  isLoaderAdmin:boolean = false;
  adminList:any;
  adminStatus: any = 'Y';

  adminListApiUrl:any =  `${environment.apiUrl}/admin-list`;
  
  current_page_adminList:any;
  first_page_url_adminList:any;
  last_page_adminList:any;
  last_page_url_adminList:any;
  next_page_url_adminList:any;
  prev_page_url_adminList:any;
  path_adminList:any;

  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private SuperAdminService: SuperAdminService,
  ) { }

  ngOnInit() {
    this.getAdminList();
  }
  navigateTo_adminList(api_url){
    this.adminListApiUrl=api_url;
    if(this.adminListApiUrl){
      this.getAdminList();
    }
  }
  navigateToPageNumber_adminList(index){
    this.adminListApiUrl=this.path_adminList+'?page='+index;
    if(this.adminListApiUrl){
      this.getAdminList();
    }
  }
  arrayOne_adminList(n: number): any[] {
    return Array(n);
  }

  getAdminList(){
    this.SuperAdminService.getAdminList(this.adminListApiUrl).subscribe((response:any) => {
      if(response.data == true){
        this.adminList = response.response.data;
        this.current_page_adminList = response.response.current_page;
        this.first_page_url_adminList = response.response.first_page_url;
        this.last_page_adminList = response.response.last_page;
        this.last_page_url_adminList = response.response.last_page_url;
        this.next_page_url_adminList = response.response.next_page_url;
        this.prev_page_url_adminList = response.response.prev_page_url;
        this.path_adminList = response.response.path;
        this.adminList.forEach( (element) => { 
          
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
          
        });
      }
    })
  }
  fnChageAdminStatus(event,adminId){
    if(event.checked){
      this.adminStatus = 'Y'
    }else{
      this.adminStatus = 'N'
    }
    let requestObject = {
      'admin_id':adminId,
      'status':this.adminStatus

    }
    this.SuperAdminService.fnChageAdminStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }},(err) =>{
        console.log(err)
      })

    }
}
