import { Component, OnInit,Inject } from '@angular/core';
import { UserService } from '../_services/user.service';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


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
 animal: any;

  customerProfile :FormGroup;
  updatedprofiledata :any;
  profiledata:any = [];
  error:any;
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/

  constructor(private userService: UserService,private _formBuilder:FormBuilder,public dialog: MatDialog, private http: HttpClient) { }

  ngOnInit() {
    localStorage.setItem['session_user_id'] = '21',
    localStorage.setItem['session_user_email'] = this.profiledata.email,
    localStorage.setItem['session_user_type'] = 'C',
    this.customerProfile = this._formBuilder.group({
      user_fullname : ['', Validators.required],
      user_email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)]],
      user_phone : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
      user_address : ['', Validators.required],
      user_state : ['', Validators.required],
      user_city : ['', Validators.required],
      user_postalcode : ['',[Validators.required,Validators.pattern(this.onlynumeric)]]
    });


    this.getUserProfileData();
    

  }
    UserImgUpload(){
    const dialogRef = this.dialog.open(DialogUserImageUpload, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }

getUserProfileData(): void {
  this.userService.getUserProfileData().subscribe((response:any) => 
  {
    if(response.data == true){
      this.profiledata = response.response;
      console.log(this.profiledata);
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

      "customer_id" : "21",
      "fullname" : this.customerProfile.get('user_fullname').value,
      "email" : this.customerProfile.get('user_email').value,
      "phone" : this.customerProfile.get('user_phone').value,
      "address" : this.customerProfile.get('user_address').value,
      "state" : this.customerProfile.get('user_state').value,
      "city" : this.customerProfile.get('user_city').value,
      "zip" : this.customerProfile.get('user_postalcode').value,
    }
    
  this.fnuserprofilesubmit(this.updatedprofiledata);
  
  }
}

  fnuserprofilesubmit(updatedprofiledata){
    this.userService.updateUserProfileData(updatedprofiledata).subscribe((response:any) => 
    {
        this.profiledata = response.response;
      },
      (err) => {
        this.error = err;
      }
    )
  }

  

logout() {
        // this.authenticationService.logout();
        // this.selectedSessionId=null;
        // this.selectedSessionName=null;
       // this.router.navigate(['/login']);
    }


  }

@Component({
    selector: 'user-image-upload-dialog',
    templateUrl: '../_dialogs/user-image-upload-dialog.html',
  })
  export class DialogUserImageUpload {

    constructor(
      public dialogRef: MatDialogRef<DialogUserImageUpload>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

  }