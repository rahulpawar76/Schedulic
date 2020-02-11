import { Component, Inject,AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService, CompanyService } from './_services';
import { User, Role } from './_models';

import { slideInAnimation } from './animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar} from '@angular/material/snack-bar';


import {trigger, state, style, transition, animate } from '@angular/animations';




export interface DialogData {
  animal: string;
  name: string;
}

@Component({ 
    selector: 'app', 
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    animations: [slideInAnimation]
})


export class AppComponent implements AfterViewInit {
    public company_info: string;
    

    ngAfterViewInit() { 

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
        private _snackBar: MatSnackBar,        
    ) {        
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.selectedSessionId=localStorage.getItem("session_id");
        this.selectedSessionName=localStorage.getItem("session_name");
    }



    get isAdmin() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }
    
    isManagerUser() {
        return this.currentUser && ((this.currentUser.role === Role.Manager) || (this.currentUser.role === Role.Admin));
    }
    
    isAdminUser() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }
    fnGoTo(path) {
      if(this.selectedSessionId){
        this.router.navigate(['/'+path]);
      }else{
        this.openSelectSessionDialog();
      }
    }
    isLogin(){
        if(localStorage.getItem('currentUser')){
            return true;
        }else{
            return false;
        }
    }

    // ngOnInit() {
    //   this.setcompanycolours();
    // }
    
    logout() {
        this.authenticationService.logout();
        this.selectedSessionId=null;
        this.selectedSessionName=null;
        this.router.navigate(['/login']);
    }

    /*fnSetSessionValues(){
      this.selectedSessionId=localStorage.getItem("session_id");
      this.selectedSessionName=localStorage.getItem("session_name");
    }*/



    openSelectSessionDialog(): void {
    const dialogRef = this.dialog.open(SelectSessionDialog, {
      width: '400px',
      data: {path: ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.animal = result;
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  //  setcompanycolours() {
  //   this._companyService.getCompanyColoursData().subscribe(
  //     (data: any) => {
  //       localStorage.companycolours = JSON.stringify(data[0]);

  //       // you can export below function two functions update_SCSS_var() and setPropertyOfSCSS() 
  //       // in any dot TS file as it will always be updated through localstorage
  //       this.update_SCSS_var();
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

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
}

@Component({
  selector: 'attendee-registration-dialog',
  templateUrl: './_dialogs/attendee-registration-dialog.html',
})

@Component({
  selector: 'select-session-dialog',
  templateUrl: './_dialogs/select-session-dialog.html',
})
export class SelectSessionDialog {
    selectSessionFormGroup: FormGroup;
    currentUser: User;
    token: string;
    sessionData: any;
    selectedSessionId: any;
    selectedSessionName: any;
   // path: any;
    //appComponent: any;
  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<SelectSessionDialog>,
    private _formBuilder: FormBuilder,
    public authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private _companyService: CompanyService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentUser = this.authenticationService.currentUserValue;
      this.token = this.currentUser.token;
      let  jsonUser = {
      "user_id": this.currentUser.id,
      "role": this.currentUser.role,
      "token": this.token
    }
    this.selectedSessionId=localStorage.getItem("session_id");
    this.selectedSessionName=localStorage.getItem("session_name");
  }
  ngOnInit(){    this.selectSessionFormGroup = this._formBuilder.group({
          session: ['',Validators.required]
        });
  }
  isAdminUser() {
      return this.currentUser && this.currentUser.role === Role.Admin;
  }
  saveData(): void {
   if (this.selectSessionFormGroup.valid) {
    let splitted = this.selectSessionFormGroup.get('session').value.split("-", 2); 
    if(splitted[0] != localStorage.getItem("session_id")){
      localStorage.setItem('session_id',splitted[0]);
      localStorage.setItem('session_name',splitted[1]);
      console.log(localStorage.getItem("session_id"));
      console.log(localStorage.getItem("session_name"));
      window.location.reload();
      //this.appComponent.fnSetSessionValues();
      /*if(this.data.path == undefined){
        window.location.reload();
      }else{
        this.router.navigate([this.data.path]);
      }*/
    }
    this.dialogRef.close();
    }else if(!this.selectSessionFormGroup.get('session').value){
      //this.dialogRef.close();
    }else{
      this._snackBar.open("Select Session", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
      });
    }

    
  }
  closeModal(): void {
    
    this.dialogRef.close();
  }


}