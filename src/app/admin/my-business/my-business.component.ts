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
export interface DialogData {
  animal: string;
  name: string;
}

export interface ListTimeZoneListArry {
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
    private _snackBar: MatSnackBar) {
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
  
  // getGeoLocation(IP){
  //   this.isLoaderAdmin = true;
  //   this.AdminService.getGeoLocation(IP).subscribe((response:any) => {
  //     if(response){
  //       console.log(response.response)
  //     }
  //     else {
  //     }
  //     this.isLoaderAdmin = false;
  //   })
  // }
  getAllBusiness(){
    this.isLoaderAdmin = true;
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
    console.log(devidedUrl)
    if((devidedUrl[1] == 'admin' && devidedUrl.length == 2) || devidedUrl[2] == 'my-business'){
      console.log('isBusiness yes')
      // this.AppComponent
      localStorage.setItem('isBusiness','true');
    }else{
      console.log('isBusiness no')
      localStorage.setItem('isBusiness','false');
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
    this.setInitialValue();
  }
  
  ngOnInit() {
    this.gelAllCountry();
    this.getTimeZone();
    

    this.createBusiness = this._formBuilder.group({
      business_name : ['', [Validators.required]],
      business_address : ['', [Validators.required,Validators.minLength(2),Validators.maxLength(30)]],
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
        this.allCountry = response.response
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
        // load the initial bank list
        this.listTimeZoneList.next(this.listTimeZoneListArry.slice());
        this.timeZoneFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
        this.filterBanks();
      });

        this.isLoaderAdmin =false;
        
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.listTimeZoneListArry = []
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.isLoaderAdmin =false;
      }
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
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.listTimeZoneList
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        console.log('fail')
      });
  }

  protected filterBanks() {
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

  
}
