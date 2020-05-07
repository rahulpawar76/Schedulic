import { Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AdminService } from '../_services/admin-main.service'
import {MatSnackBar} from '@angular/material/snack-bar';
import { AppComponent } from '@app/app.component';
import { AuthenticationService } from '@app/_services';

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
  adminSettings : boolean = false;
  isLoaderAdmin : boolean = false;
  currentUser:any;
  adminId:any;
  token:any;
   
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public router: Router,
    private AdminService: AdminService,
    private appComponent : AppComponent,
    private authenticationService:AuthenticationService,
    private _snackBar: MatSnackBar) {
    localStorage.setItem('isBusiness', 'true');
    this.currentUser=this.authenticationService.currentUserValue;
    this.adminId=this.currentUser.user_id;
    this.token=this.currentUser.token;
    }

  ngOnInit() {
    this.getAllBusiness();
    console.log(this.currentUser)
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
  fnSelectBusiness(business_id,busisness_name){

    // localStorage.setItem('business_id', business_id);
     localStorage.setItem('business_id', '2');
    localStorage.setItem('business_name', busisness_name);
    this.router.navigate(['/admin/my-workspace']);
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


}


@Component({
  selector: 'Create-New-Business',
  templateUrl: '../_dialogs/create-new-business-dialog.html',
})
export class myCreateNewBusinessDialog {
  allCountry: any;
  allStates: any;
  allCities: any;
  listTimeZone: any;
  newBusinessData: any;
  createBusiness :FormGroup;
  isLoaderAdmin : boolean = false;
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  
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
  ngOnInit() {
    this.gelAllCountry();
    this.getTimeZone();

    this.createBusiness = this._formBuilder.group({
      business_name : ['', Validators.required],
      business_address : ['', Validators.required],
      business_country : ['', Validators.required],
      business_region : ['', Validators.required],
      business_timezone : ['', Validators.required],
      business_city : ['', Validators.required],
      business_zip : ['', [Validators.required,Validators.pattern(this.onlynumeric)]]
    });

  }

  gelAllCountry(){
    this.isLoaderAdmin =true;
    this.AdminService.gelAllCountry().subscribe((response:any) => {
      if(response.data == true){
        this.allCountry = response.response
        this.isLoaderAdmin =false;
      }
      else if(response.data == false){
        this.allCountry = ''
        this._snackBar.open("Country is not loaded", "X", {
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
        this.isLoaderAdmin =false;
      }
      else if(response.data == false){
        this.allStates = ''
        this._snackBar.open("State is not loaded", "X", {
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
        this.allCities = response.response
        if(response.response == "no city found"){
          this._snackBar.open("City is not Found", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
         
        this.isLoaderAdmin =false;
      }
      else if(response.data == false){
        this.allCities = ''
        this._snackBar.open("City is not loaded", "X", {
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
      if(response.status == 'OK'){
        this.listTimeZone = response.zones
        this.isLoaderAdmin =false;
      }
      else if(response.data == false){
        this.listTimeZone = ''
        this._snackBar.open("Time Zone is not loaded", "X", {
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
        "region" : this.createBusiness.get('business_region').value,
        "city" : this.createBusiness.get('business_city').value,
        "time_zone" : this.createBusiness.get('business_timezone').value,
        "zipcode" : this.createBusiness.get('business_zip').value,
      }
    }
    this.createNewBusiness(this.newBusinessData);
  }
  createNewBusiness(newBusinessData){
    this.AdminService.createNewBusiness(newBusinessData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Business Created", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.dialogRef.close();
      }
      else if(response.data == false){
        
      }
    })
  }

  
}
