import { Component, OnInit,Inject } from '@angular/core';
import { UserService } from '../_services/user.service';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from '@app/_services';
import { Title } from '@angular/platform-browser';

import {MatSnackBar} from '@angular/material/snack-bar';
export interface DialogData {
  animal: string;
  name: string;
  
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
 userId:any;

  customerProfile :FormGroup;
  updatedprofiledata :any;
  profiledata:any = [];
  profileUrl:any;
  error:any;
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^\+(?:[0-9] ?){6,14}[0-9]$/
  bussinessId
  constructor(
    private userService: UserService,
    private _formBuilder:FormBuilder,
    public dialog: MatDialog, 
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private authenticationService : AuthenticationService,
    private titleService: Title

    ){
      this.userId=this.authenticationService.currentUserValue.user_id
      this.bussinessId=this.authenticationService.currentUserValue.business_id
     }

     
  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
    //return error.error ? error.error : error.statusText;
  }


  ngOnInit() {
    localStorage.setItem['session_user_id'] = this.profiledata.id,
    localStorage.setItem['session_user_email'] = this.profiledata.email,
    localStorage.setItem['session_user_type'] = 'C',
    this.customerProfile = this._formBuilder.group({
      user_fullname : ['', Validators.required],
      user_email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)],this.isCustomerEmailUnique.bind(this)],
      user_phone : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)],this.isCustomerPhoneUnique.bind(this)],
      user_address : ['', Validators.required],
      user_state : ['', Validators.required],
      user_city : ['', Validators.required],
      user_postalcode : ['',[Validators.required,Validators.maxLength(7),Validators.minLength(5)]]
    });


    this.getUserProfileData();
    this.titleService.setTitle('My Profile');

  }
    UserImgUpload(){
    const dialogRef = this.dialog.open(DialogUserImageUpload, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
       if(result != undefined){
        this.profileUrl = result;
        this.profiledata.image=result;
        console.log(result);
       }
      
     });
  }

  
  isCustomerEmailUnique(control: FormControl) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          let emailCheckRequestObject = {
            'business_id':this.bussinessId,
            'email': control.value,
            'phone': null,
            'customer_id':this.userId,
            'checkType':'email', 
          }
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/customer-check`, emailCheckRequestObject,{headers:headers}).pipe(map((response : any) =>{
          return response;
        }),
        catchError(this.handleError)).subscribe((res) => {
          if(res){
            if(res.data == false){
            resolve({ isEmailUnique: true });
            }else{
            resolve(null);
            }
          }
        });
      }, 500);
    });
  }
  isCustomerPhoneUnique(control: FormControl) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let phoneCheckRequestObject = {
          'business_id':this.bussinessId,
          'email': null,
          'customer_id':this.userId,
          'phone': control.value,
          'checkType':'phone', 
        }
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/customer-check`, phoneCheckRequestObject,{headers:headers}).pipe(map((response : any) =>{
          return response;
        }),
        catchError(this.handleError)).subscribe((res) => {
          if(res){
            if(res.data == false){
            resolve({ isPhoneUnique: true });
            }else{
            resolve(null);
            }
          }
        });
      }, 500);
    });
  }

getUserProfileData(): void {
  let requestObject = {
    "customer_id":JSON.stringify(this.userId)
  };
  this.userService.getUserProfileData(requestObject).subscribe((response:any) => 
  {
    if(response.data == true){
      this.profiledata = response.response;
      this.customerProfile.controls['user_fullname'].setValue(this.profiledata.fullname);
      this.customerProfile.controls['user_email'].setValue(this.profiledata.email);
      this.customerProfile.controls['user_phone'].setValue(this.profiledata.phone);
      this.customerProfile.controls['user_address'].setValue(this.profiledata.address);
      this.customerProfile.controls['user_state'].setValue(this.profiledata.state);
      this.customerProfile.controls['user_city'].setValue(this.profiledata.city);
      this.customerProfile.controls['user_postalcode'].setValue(this.profiledata.zip);
    }
  },
    (err) => {
      this.error = err;
    }
  )
}
onSubmit(event){
  if(this.customerProfile.valid){
    this.updatedprofiledata ={

      "customer_id" : this.userId,
      "fullname" : this.customerProfile.get('user_fullname').value,
      "email" : this.customerProfile.get('user_email').value,
      "phone" : this.customerProfile.get('user_phone').value,
      "address" : this.customerProfile.get('user_address').value,
      "state" : this.customerProfile.get('user_state').value,
      "city" : this.customerProfile.get('user_city').value,
      "zip" : this.customerProfile.get('user_postalcode').value,
      "image" : this.profileUrl,
    }
    
  this.fnuserprofilesubmit(this.updatedprofiledata);
  
  }
}

  fnuserprofilesubmit(updatedprofiledata){
    this.userService.updateUserProfileData(updatedprofiledata).subscribe((response:any) => 
    {
      if(response.data==true){
        this._snackBar.open("Profile Updated", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.getUserProfileData();
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open("Unable to update profile", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
      },
      (err) => {
        this.error = err;
      }
    )
  }

  }

@Component({
    selector: 'user-image-upload-dialog',
    templateUrl: '../_dialogs/user-image-upload-dialog.html',
  })
  export class DialogUserImageUpload {

    uploadForm: FormGroup;  
    imageSrc: string;
    profileImage: string;

    constructor(
      public dialogRef: MatDialogRef<DialogUserImageUpload>,
      private _formBuilder:FormBuilder,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close(this.profileImage);
    }
    ngOnInit() {
      this.uploadForm = this._formBuilder.group({
        profile: ['']
      });
    }
    get f() {
      return this.uploadForm.controls;
    }

    onFileChange(event) {

      var file_type = event.target.files[0].type;

      if(file_type!='image/jpeg' &&  file_type!='image/png' && file_type!='image/jpg' &&  file_type!='image/gif'){
              
        this._snackBar.open("Sorry, only JPG, JPEG, PNG & GIF files are allowed", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
        });
          return;
      }
     

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
              this.imageSrc = reader.result as string;
              this.uploadForm.patchValue({
                  fileSource: reader.result
              });
          };
      }
  }
  uploadImage() {
    this.profileImage = this.imageSrc
    this.dialogRef.close(this.profileImage);
  }
}