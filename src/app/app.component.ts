import { Component, Inject,AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService, CompanyService } from './_services';
import { User, Role } from './_models';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

//import { slideInAnimation } from './maturity/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';




export interface DialogData {
  animal: string;
  name: string;
}



@Component({ 
    selector: 'app', 
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    //animations: [slideInAnimation]
})


export class AppComponent implements AfterViewInit {
  animal:any;
  userData :any;
  userStatus =true;
  currentUserId: any;
  statusStaff: any;
  public company_info: string;

    ngAfterViewInit() { 
      this.getStatusOfCurrentStaff();
    }
    
    // myRoute: string;
    currentUser: User;
    selectedSessionId: any;
    selectedSessionName: any;

    constructor(
        public router: Router,
        private authenticationService: AuthenticationService,
        private _companyService: CompanyService,
        public dialog: MatDialog,
        private http: HttpClient,
        private _snackBar: MatSnackBar,        
    ) {        
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

        this.currentUserId = JSON.stringify(this.authenticationService.currentUserValue.user_id);
        
        // Set company info
     /*    this._companyService.getCompanyInfoData().subscribe(
          (res: any) => {
            this.company_info =res[0];
          },
          (err) => {
             this._snackBar.open("Database Connection Error", "X", {
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }
        ); */
        // this.selectedSessionId=localStorage.getItem("session_id");
        // this.selectedSessionName=localStorage.getItem("session_name");
    }



    get isAdmin() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }
    
    isManagerUser() {
        return this.currentUser && (this.currentUser.role === Role.Staff);
    }
    
    isAdminUser() {
        return this.currentUser && this.currentUser.user_type === Role.Admin;
    }
    
    isCustomerUser() {
        return this.currentUser && this.currentUser.user_type === Role.Customer;
    }
    
    isStaffUser() {
        return this.currentUser && this.currentUser.user_type === Role.Staff;
    }
  
    isLogin(){
        if(localStorage.getItem('currentUser')){
            return true;
        }else{
            return false;
        }
    }
  
    isFront(){
        if(localStorage.getItem('isFront') && localStorage.getItem('isFront')=="true"){
            return true;
        }else{
            return false;
        }
    }

    ngOnInit() {
     // this.setcompanycolours();
    }
    

    /*fnSetSessionValues(){
      this.selectedSessionId=localStorage.getItem("session_id");
      this.selectedSessionName=localStorage.getItem("session_name");
    }*/



      /*StaffDashboard Navigation*/
      StaffProfile(){
        this.router.navigate(['/staff/my-profile']);
      }

      StaffAppointment(){
      this.router.navigate(['/staff/my-appointment']);
      }


      WorkProfile(){
        this.router.navigate(['/staff/work-profile']);
      }

      WorkSpace(){
        this.router.navigate(['/staff']);
      }

      logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
      }
    

      /*Customer Navigation*/
      
      UserProfile(){
        this.router.navigate(['/user/my-profile']);
      }

      UserAppointment(){
      this.router.navigate(['/user']);
      }

      /*For notification Dialog*/


      openNotificationDialog(): void {
          const dialogRef = this.dialog.open(DialogNotification, {
        height: '500px',
        
    
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result;
      });
      }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

   /*setcompanycolours() {
    this._companyService.getCompanyColoursData().subscribe(
      (data: any) => {
        localStorage.companycolours = JSON.stringify(data[0]);

        // you can export below function two functions update_SCSS_var() and setPropertyOfSCSS() 
        // in any dot TS file as it will always be updated through localstorage
        this.update_SCSS_var();
      },
      (err) => {
        console.log(err);
      }
    );
  }*/

  update_SCSS_var() {
    var data = JSON.parse(localStorage.companycolours);
    for (const [key, value] of Object.entries(data)) {
      this.setPropertyOfSCSS('--' + key, value);
      // document.documentElement.style.setProperty('--' + key, value);
    }
  }

  setPropertyOfSCSS(key, value) {
    if (key[0] != '-') {
      key = '--' + key;
    }
    if (value) {
      document.documentElement.style.setProperty(key, value);
    }
    return getComputedStyle(document.documentElement).getPropertyValue(key);
  }

  getStatusOfCurrentStaff(){
    this.userData = this.authenticationService.currentUserValue
    console.log(this.userData);
    if(this.userData.status == 'D'){
      this.userStatus = true;
    }
    else if(this.userData.status == 'E'){
      this.userStatus = false;
    }
  }
  changeStatus(value: MatSlideToggleChange){
    const { checked } = value;
    if(this.userStatus == false){
      this.statusStaff = 'E'
    }
    else{
      this.statusStaff = 'D'
    }
  let requestObject = {
    'status': this.statusStaff
  };
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'staff-id' : this.currentUserId,
  });
  this.http.post(`${environment.apiUrl}/staff-status-update`,requestObject,{headers:headers} ).pipe(
    map((res) => {
      return res;
    }),
  ).subscribe((response:any) => {
    if(response.data == true){
      this._snackBar.open("Availibility Updated", "X", {
        duration: 2000,
        verticalPosition: 'bottom',
        panelClass : ['green-snackbar']
      });
    }
    },
    (err) =>{
      console.log(err)
    })
  }

}

/*For notification Dialog*/

@Component({
    selector: 'dialog-notification',
    templateUrl: './_dialogs/dialog-notification.html',
  })
  export class DialogNotification {

    constructor(
      public dialogRef: MatDialogRef<DialogNotification>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }
