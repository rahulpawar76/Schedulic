import { Component, Inject, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterEvent, RouterOutlet,ActivatedRoute } from '@angular/router';
import { Observable, throwError, ReplaySubject, Subject } from 'rxjs';
import { AdminService } from '../_services/admin-main.service'
import {MatSnackBar} from '@angular/material/snack-bar';
import { AppComponent } from '@app/app.component';
import { AuthenticationService } from '@app/_services';
import { environment } from '@environments/environment';
import { take, takeUntil } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../_components/confirmation-dialog/confirmation-dialog.component';
import { SharedService } from '@app/_services/shared.service';
export interface DialogData {
  animal: string;
  name: string;
}

export interface ListTimeZoneListArry {
  id: string;
  name: string;
}

export interface ListTimeZoneListArry {
  id: string;
  name: string;
}

export interface countryArry {
  id: string;
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
  adminSettings : boolean = false;
  isLoaderAdmin : boolean = true;
  currentUser:any;
  adminId:any;
  token:any;
  getIpAddress : any;
  pageSlug:any;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public router: Router,
    private AdminService: AdminService,
    private appComponent : AppComponent,
    private authenticationService:AuthenticationService,
    private _snackBar: MatSnackBar,
    private sharedService: SharedService) {
    localStorage.setItem('isBusiness', 'true');
    this.router.events.subscribe(event => {
      if (event instanceof RouterEvent) this.handleRoute(event);
        const url = this.getUrl(event);
    });
    this.currentUser=this.authenticationService.currentUserValue;
    this.adminId=this.currentUser.user_id;
    this.token=this.currentUser.token;
    }

  ngOnInit() {
    this.getAllBusiness();
    this.fnGetIpAddress();

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoaderAdmin = false;
    }, 4000);
  }

  fnGetIpAddress(){
    this.authenticationService.getIPAddress().subscribe((res:any)=>{
      this.getIpAddress=res.ip;
      // this.getGeoLocation(this.getIpAddress);
    });
  }

  getAllBusiness(){
    this.isLoaderAdmin = true;
    this.sharedService.updateSideMenuState(false);
    this.AdminService.getAllBusiness().subscribe((response:any) => {
      if(response.data == true){
        this.allBusiness = response.response
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition:'top',
        //   panelClass :['red-snackbar']
        // });
        this.allBusiness = ''
      }
      this.isLoaderAdmin = false;
    })
  }

  delete(id:number){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result){
            this.isLoaderAdmin = true;
            this.AdminService.deleteBusiness(id).subscribe((response:any) => {
              if(response.data == true){
                this._snackBar.open("Bussiness Deleted.", "X", {
                  duration: 2000,
                  verticalPosition:'top',
                  panelClass :['green-snackbar']
                });
                this.getAllBusiness();
                this.isLoaderAdmin = false;
              } else if(response.data == false && response.response !== 'api token or userid invaild'){
                this._snackBar.open(response.response, "X", {
                  duration: 2000,
                  verticalPosition: 'top',
                  panelClass : ['red-snackbar']
                });
                this.isLoaderAdmin = false;
              }
            });
        }
    });
  }

  duplicate(id:number){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to create duplicate?"
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result){
            this.isLoaderAdmin = true;
            this.AdminService.duplicateBusiness(id).subscribe((response:any) => {
              if(response.data == true){
                this._snackBar.open("Duplicate Bussiness Created.", "X", {
                  duration: 2000,
                  verticalPosition:'top',
                  panelClass :['green-snackbar']
                });
                this.getAllBusiness();
                this.isLoaderAdmin = false;
              } else if(response.data == false && response.response !== 'api token or userid invaild'){
                this._snackBar.open(response.response, "X", {
                  duration: 2000,
                  verticalPosition: 'top',
                  panelClass : ['red-snackbar']
                });
                this.isLoaderAdmin = false;
              }
            });
        }
    });
  }

  fnSelectBusiness(business_id,busisness_name){

    localStorage.setItem('business_id', business_id);
    //localStorage.setItem('business_id', '2');
    localStorage.setItem('business_name', busisness_name);
    this.router.navigate(['/admin/my-workspace']);
    this.appComponent.getNotificationCount(business_id);
  }

  creatNewBusiness() {
    const dialogRef = this.dialog.open(myCreateNewBusinessDialog, {
      width: '1100px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      this.getAllBusiness();
     });
  }



  // page url conditions
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
  private getUrl(event: any) {
    if (event && event.url) {
      this.pageSlug = event.url.split('/' , 2)
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    let devidedUrl = url.split('/',4);
    if((devidedUrl[1] == 'admin' && devidedUrl.length == 2) || devidedUrl[2] == 'my-business'){
      // this.AppComponent
      localStorage.setItem('isBusiness','true');
    }else{
      localStorage.setItem('isBusiness','false');
      this.sharedService.updateSideMenuState(true);
    }
  }

}


@Component({
  selector: 'Create-New-Business',
  templateUrl: '../_dialogs/create-new-business-dialog.html',
})


export class myCreateNewBusinessDialog {
  allCountry: any;
  allStates: any;
  allCities: any;
  // listTimeZoneList: any;
  newBusinessData: any;
  createBusiness :FormGroup;
  isLoaderAdmin : boolean = false;
  onlynumeric = /^-?(0|[1-9]\d*)?$/

  protected listTimeZoneListArry: ListTimeZoneListArry[];
  public timeZoneFilterCtrl: FormControl = new FormControl();
  public listTimeZoneList: ReplaySubject<ListTimeZoneListArry[]> = new ReplaySubject<ListTimeZoneListArry[]>(1);

  protected countryArry: countryArry[];
  public countryFilterCtrl: FormControl = new FormControl();
  public countryList: ReplaySubject<countryArry[]> = new ReplaySubject<countryArry[]>(1);



  protected _onDestroy = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<myCreateNewBusinessDialog>,
    private http: HttpClient,
    public router: Router,
   private AdminService: AdminService,
   private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  onNoClick(): void {
    this.dialogRef.close();

  }


  ngAfterViewInit() {
    this.setInitialValueTimeZone();
    this.setInitialValueCountry();
  }

  ngOnInit() {
    this.gelAllCountry();
    this.getTimeZone();


    this.createBusiness = this._formBuilder.group({
      business_name : ['', [Validators.required]],
      business_address : ['', [Validators.required,Validators.minLength(2),Validators.maxLength(50)]],
      business_country : ['', Validators.required],
      business_state : ['', Validators.required],
      business_timezone : ['', Validators.required],
      business_city : ['', Validators.required],
      business_zip : ['', [Validators.required,Validators.minLength(5),Validators.maxLength(7)]]
    });

  }

  gelAllCountry(){
    this.isLoaderAdmin =true;
    this.AdminService.gelAllCountry().subscribe((response:any) => {
      if(response.data == true){
        // this.allCountry = response.response
        this.listTimeZoneListArry = response.response
        this.countryList.next(this.listTimeZoneListArry.slice());
        this.countryFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
        this.filterCountries();
      });
        this.isLoaderAdmin =false;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.allCountry = ''
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.isLoaderAdmin =false;
      }
    })
  }
  selectCountry(country_id){
    this.isLoaderAdmin =true;
    this.AdminService.gelAllState(country_id).subscribe((response:any) => {
      if(response.data == true){
        this.allStates = response.response
        this.createBusiness.controls['business_state'].setValue('');
        this.isLoaderAdmin =false;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.allStates = ''
        this.createBusiness.controls['business_state'].setValue('');
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.isLoaderAdmin =false;
      }
    })
  }
  selectStates(state_id){
    this.isLoaderAdmin =true;
    this.AdminService.gelAllCities(state_id).subscribe((response:any) => {
      if(response.data == true){
        this.createBusiness.controls['business_city'].setValue('');
        this.allCities = response.response
        this.isLoaderAdmin =false;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.allCities = [];
        this.createBusiness.controls['business_city'].setValue('');
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.isLoaderAdmin =false;
      }
    })
  }
  getTimeZone(){
    this.isLoaderAdmin =true;
    this.AdminService.getTimeZone().subscribe((response:any) => {
      if(response.data == true){
        this.listTimeZoneListArry = response.response
        this.listTimeZoneList.next(this.listTimeZoneListArry.slice());
        this.timeZoneFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
        this.filterTimezones();
      });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.listTimeZoneListArry = []
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
        this.isLoaderAdmin =false;
    })
  }
  fnCreateBusiness(){
    if(this.createBusiness.valid){
      this.newBusinessData ={
        "business_name" : this.createBusiness.get('business_name').value,
        "address" : this.createBusiness.get('business_address').value,
        "country" : this.createBusiness.get('business_country').value,
        "state" : this.createBusiness.get('business_state').value,
        "city" : this.createBusiness.get('business_city').value,
        "time_zone" : this.createBusiness.get('business_timezone').value,
        "site_url" : environment.urlForLink,
        "zipcode" : this.createBusiness.get('business_zip').value,
      }

    this.createNewBusiness(this.newBusinessData);
    }else{
      this.createBusiness.get('business_name').markAsTouched();
      this.createBusiness.get('business_address').markAsTouched();
      this.createBusiness.get('business_country').markAsTouched();
      this.createBusiness.get('business_state').markAsTouched();
      this.createBusiness.get('business_city').markAsTouched();
      this.createBusiness.get('business_timezone').markAsTouched();
      this.createBusiness.get('business_zip').markAsTouched();
      return false;
    }
  }
  createNewBusiness(newBusinessData){
    this.AdminService.createNewBusiness(newBusinessData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Business Created.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.dialogRef.close();
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
  }

    /**
   * Sets the initial value after the filteredTimezones are loaded initially
   */
  protected setInitialValueTimeZone() {
    this.listTimeZoneList
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

  protected filterTimezones() {
    if (!this.listTimeZoneListArry) {
      return;
    }
    // get the search keyword
    let search = this.timeZoneFilterCtrl.value;
    if (!search) {
      this.listTimeZoneList.next(this.listTimeZoneListArry.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.listTimeZoneList.next(
      this.listTimeZoneListArry.filter(listTimeZoneListArry => listTimeZoneListArry.name.toLowerCase().indexOf(search) > -1)
    );
  }

    /**
   * Sets the initial value after the filteredCountry are loaded initially
   */
  protected setInitialValueCountry() {
    this.listTimeZoneList
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

  protected filterCountries() {
    if (!this.countryArry) {
      return;
    }
    // get the search keyword
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.countryList.next(this.countryArry.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.countryList.next(
      this.countryArry.filter(countryArry => countryArry.name.toLowerCase().indexOf(search) > -1)
    );
  }


}
