import { Component, Inject,AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService, CompanyService, QuestionService } from './_services';
import { User, Role } from './_models';

//import { slideInAnimation } from './maturity/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar} from '@angular/material/snack-bar';


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
  
    public company_info: string;
    public usertype: string = "SM";

    ngAfterViewInit() { 

    }
    
    // myRoute: string;
    currentUser: User;
    selectedSessionId: any;
    selectedSessionName: any;

    constructor(
        public router: Router,
        public questionService: QuestionService,
        private authenticationService: AuthenticationService,
        private _companyService: CompanyService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,        
    ) {        
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
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
  
    isLogin(){
        if(localStorage.getItem('currentUser')){
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

    openDialog(): void {
    const dialogRef = this.dialog.open(AttendeeRegistrationDialog, {
      width: '500px',
      data: {name: "this.name", animal: "this.animal"}
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.animal = result;
    });
  }

    openSelectSessionDialog(): void {
    const dialogRef = this.dialog.open(SelectSessionDialog, {
      width: '400px',
      data: {path: ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.animal = result;
    });
  }

      /*StaffDashboard Navigation*/
      StaffProfile(){
        this.router.navigate(['/staff-profile']);
      }

      StaffAppointment(){
      this.router.navigate(['/staff-appointment']);
      }

      WorkProfile(){
        this.router.navigate(['/work-profile']);
      }

      WorkSpace(){
        this.router.navigate(['/my-work-space']);
      }

      logout() {
        this.authenticationService.logout();
        this.selectedSessionId=null;
        this.selectedSessionName=null;
        this.router.navigate(['/login']);
      }
    

      /*Customer Navigation*/
      
      UserProfile(){
        this.router.navigate(['/user-profile']);
      }

      UserAppointment(){
      this.router.navigate(['/user-appointment']);
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
}

@Component({
  selector: 'attendee-registration-dialog',
  templateUrl: './_dialogs/attendee-registration-dialog.html',
})
export class AttendeeRegistrationDialog {
    firstFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AttendeeRegistrationDialog>,
    private _formBuilder: FormBuilder,
    public questionService: QuestionService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  ngOnInit(){
      this.firstFormGroup = this._formBuilder.group({
          email: ['',[ Validators.email,Validators.required]],
          firstname: [''],
          lastname: [''],
          password : ['',Validators.required]
        });
  }
  saveData(): void {
   if (this.firstFormGroup.invalid) {
            return;
    }
  let  jsonUser = {
      "email": this.firstFormGroup.get('email').value,
      "firstname": this.firstFormGroup.get('firstname').value,
      "lastname": this.firstFormGroup.get('lastname').value,
      "password" : this.firstFormGroup.get('password').value,
      "role" : "employee"
    }
    console.log("jsonUser",jsonUser)
    this.questionService.SaveAttendees(jsonUser)
      .subscribe(
        (res) => {
          if(res.data){
            this._snackBar.open("Created successfully", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
            this.dialogRef.close();
          }else{
              this._snackBar.open(res.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
            });
          }
          
        },
        (err) =>{
            console.log(err)
        } 
      );
    
  }
  closeModal(): void {
    
    this.dialogRef.close();
  }
}

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
    public questionService: QuestionService,
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
    this.fnGetAllSessions(jsonUser)
  }
  ngOnInit(){
      //this.appComponent = new AppComponent(this.router, this.questionService, this.authenticationService, this._companyService, this.dialog);
      this.selectSessionFormGroup = this._formBuilder.group({
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

  fnGetAllSessions(jsonUser){
    this.questionService.GetAllSessions(jsonUser)
      .subscribe(
        (res) => {
          if(res){
            this.sessionData=res.data;
            }else{
              
          }
        },
        (err) =>{
            console.log(err)
        } 
      );
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
