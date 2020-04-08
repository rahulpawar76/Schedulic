import { Component, Inject,AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './_services';
import { User, Role } from './_models';
import { CommonService } from './_services'


//import { slideInAnimation } from './maturity/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';
import { MdePopoverTrigger } from '@material-extended/mde';


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
  
  showSuccess:any;
  animal:any;
  selectedBusinessName: any;
  adminSettings:any="notsettings";
  currentUrl: string;
  loginUserData: any;
  postUrl : any;userType : any;
  userId : any;
  token : any;
  notificationData : any;
  staffStatus : any;
  businessId : any;

  @ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;

  closePopover() {
    this.trigger.togglePopover();
  }

  onSubmit() {

    // Form Logic

    // On Success close popover
    this.closePopover();
    
  }
  
  
    public company_info: string;

    ngAfterViewInit() { 
    }
    
    // myRoute: string;
    currentUser: User;
    selectedSessionId: any;
    selectedSessionName: any;
    timer:any =0;
    settingsArr:any ;
    appearenceColor: any;

    constructor(
        private http: HttpClient,
        public router: Router,
        private authenticationService: AuthenticationService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar, 
        private CommonService:CommonService       
    ) {        
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        if(this.authenticationService.currentUserValue.user_id){
          this.userId=this.currentUser.user_id
        }
        if(localStorage.getItem('business_id')){
          this.businessId = localStorage.getItem('business_id');
      }
        
        //this.token=this.authenticationService.currentUserValue.token
        
        
    }
  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError('Error! something went wrong.');
  }




    ngOnInit() {
    
     this.router.events.subscribe(event => {
        if (event instanceof RouterEvent) this.handleRoute(event);
      });
      this.setcompanycolours();
      
    }

    
    
     dynamicSort(property: string) {
      let sortOrder = 1;

      if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }

  return (a, b) => {
    const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  };
}

    isSettingsModule(url?: string){
      const mod = this.cleanUrl(url || this.currentUrl);
      console.log(mod);
      if(mod == "settings"){
        this.adminSettings  = "settings";
      }
      else{
        this.adminSettings  = "notsettings";
      }
    }

    private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    if (this.urlIsNew(url)) {
      this.currentUrl = url;
      this.isSettingsModule(url);
    }
  }

  private getUrl(event: any) {
    if (event) {
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private cleanUrl(url: string) {
    console.log(url);
    if (url) {
      let cleanUrl = url.substr(1);
      const slashIndex = cleanUrl.indexOf("/");
      console.log(slashIndex);
      if (slashIndex >= 0){
        cleanUrl = cleanUrl.substr(slashIndex+1, 8);
        return cleanUrl;
      }else{
        return null;
      }
    } else return null;
  }

  fnPostUrl(menuItem){
    this.postUrl = menuItem
  }


  private urlIsNew(url: string) {
    return !!url && url.length > 0 && url !== this.currentUrl;
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
    isBusiness(){
        if(localStorage.getItem('isBusiness') && localStorage.getItem('isBusiness')=="true"){
            return true;
        }else{
            return false;
        }
    }
    isBusinessSelected(){
        if(localStorage.getItem('business_id') && localStorage.getItem('business_id')!=""){
          this.selectedBusinessName = localStorage.getItem('business_name');
            return true;
        }else{
            return false;
        }
    }

    /*fnSetSessionValues(){
      this.selectedSessionId=localStorage.getItem("session_id");
      this.selectedSessionName=localStorage.getItem("session_name");
    }*/

    /*Add New Navigation */
      addNewAppointNav(){
        this.router.navigate(['/admin/my-appointment']);
      }
      addNewCategoryNav(){
        this.router.navigate(['/admin/settings/']);
      }
      addNewServicesNav(){
        this.router.navigate(['/admin/settings/services']);
      }
      addNewStaffNav(){
        this.router.navigate(['/admin/settings/staff']);
      }
      addNewCustomerNav(){
        this.router.navigate(['/admin/my-customer']);
      }
      addNewPostalCodeNav(){
        this.router.navigate(['/admin/settings/postalcode']);
      }
      addNewDiscountCouponNav(){
        this.router.navigate(['/admin/my-discountcoupon']);
      }
      addNewTimeOffNav(){
        this.router.navigate(['/admin/settings/business-hours']);
      }



      /*Admin Dashboard Navigation*/
      myWorkSpaceNav(){
        this.router.navigate(['/admin/my-workspace']);
      }
      MyBusinessNav(){
        localStorage.removeItem('business_id');
        localStorage.removeItem('business_name');
        this.router.navigate(['/admin/my-business']);
      }
      MyCustomerNav(){
        this.router.navigate(['/admin/my-customer']);
      }
      MyAppointmentNav(){
        this.router.navigate(['/admin/my-appointment']);
      }
      MyReportsNav(){
        this.router.navigate(['/admin/my-reports']);
      }
      MyDiscountCouponNav(){
        this.router.navigate(['/admin/my-discountcoupon']);
      }
      MyLiveAppointmentNav(){
        this.router.navigate(['/admin/my-appointment-live']);
      }
      MyProfileNav(){
        this.router.navigate(['/admin/my-profile']);
      }
      // Setting Menus
      MySettingsNav(){
        this.router.navigate(['/admin/settings']);
      }
      MySettingsStaffNav(){
        this.router.navigate(['/admin/settings/staff']);
      }
      MySettingsServicesNav(){
        this.router.navigate(['/admin/settings/services']);
      }
      MySettingsBusinessHoursNav(){
        this.router.navigate(['/admin/settings/business-hours']);
      }
      MySettingsProfileNav(){
        this.router.navigate(['/admin/settings/setting-my-profile']);
      }
      MySettingsCompanyDetailsNav(){
        this.router.navigate(['/admin/settings/company-details']);
      }
      MySettingsPaymentGatewayNav(){
        this.router.navigate(['/admin/settings/payment-gateway']);
      }
      MySettingsPaymentRulesNav(){
        this.router.navigate(['/admin/settings/payment-rules']);
      }
      MySettingsBookingRulesNav(){
        this.router.navigate(['/admin/settings/booking-rules']);
      }
      MySettingAlertsNav(){
        this.router.navigate(['/admin/settings/alert-settings']);
      }
      MySettingsApperenceNav(){
        this.router.navigate(['/admin/settings/appearance']);
      }
      MySettingsPostalCodesNav(){
        this.router.navigate(['/admin/settings/postalcode']);
      }



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
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = 0;
        }
        this.router.navigate(['/login']);
      }
      
      initiateTimeout(){
        console.log('initiateTimeout');
        let that=this
        that.timer=setTimeout(function(){
        that.logout()
        },1080000);
        }

      /*Customer Navigation*/
      
      UserProfile(){
        this.router.navigate(['/user/my-profile']);
      }

      UserAppointment(){
      this.router.navigate(['/user']);
      }

      

      /*For notification Dialog*/


      openNotificationDialog() {

        if(this.currentUser.user_type == "A"){
          this.userType =  "admin"
        }else if(this.currentUser.user_type == "SM"){
          this.userType =  "staff"
        }else if(this.currentUser.user_type == "C"){
          this.userType =  "customer"
        }
        this.CommonService.openNotificationDialog(this.userType).subscribe((response:any)=>{
          if(response.data == true){
            this.notificationData = response.response
            const dialogRef = this.dialog.open(DialogNotification, {
              height: '500px',
              data : { fulldata: this.notificationData}
            });
            dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed');
              this.animal = result;
            });
          }
          
        })
        
      }
      staffAvaibility(event){
        if(event == true){
          this.staffStatus = "E"
        }else{
          this.staffStatus = "D"
        }
        this.CommonService.openNotificationDialog(this.staffStatus).subscribe((response:any)=>{
          if(response.data == true){
            alert(response.response);
          }
        })
        
      }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  setcompanycolours() {
    let requestObject = {
      "business_id" : this.businessId
      };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/get-front-setting`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr=response.response;
        console.log(this.settingsArr);
        this.appearenceColor = JSON.parse(this.settingsArr.appearance)
        console.log(this.appearenceColor)
      }
    }, (err) =>{
      console.log(err)
    })
  }

  update_SCSS_var() {
    for (const [key, value] of Object.entries(this.appearenceColor)) {
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

  

  getStatusCurrentStaff(){
    
  }
  
  logoutAlert() {
    const dialogRef = this.dialog.open(DialogLogoutAppointment, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
       this.animal = result;
     });
  }
}

/*For notification Dialog*/

@Component({
    selector: 'dialog-notification',
    templateUrl: './_dialogs/dialog-notification.html',
  })
  export class DialogNotification {
    notifications: any;

    constructor(
      public dialogRef: MatDialogRef<DialogNotification>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.notifications = this.data.fulldata
        console.log(this.notifications)
      }

    onNoClick(): void {
      this.dialogRef.close();
    }

  }
  
@Component({
  selector: 'logout-alert',
  templateUrl: './_dialogs/logout-dialog.html',
})
export class DialogLogoutAppointment {
  
  timer:any =0;

constructor(
  public dialogRef: MatDialogRef<DialogLogoutAppointment>,
  public router: Router,
  private authenticationService: AuthenticationService,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  logout() {
    this.authenticationService.logout();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }
    this.router.navigate(['/login']);
    
    this.dialogRef.close();
  }
  closePopup(){
    this.dialogRef.close();
  }
}

  