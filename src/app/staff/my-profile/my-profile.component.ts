import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '@environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { StaffService } from '../_services/staff.service'
import { AuthenticationService } from '@app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit {

  myProfile: FormGroup;
  profiledata : any =[];
 animal: any;
 error:any;
 updatedprofiledata: any =[];
 staffId: any;
 profileImage : any;

 emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
 onlynumeric = /^-?(0|[1-9]\d*)?$/
 isLoader : boolean=true;
 changePwd:FormGroup;
 hide1 = true;
 hide2 = true;

  constructor(
    public dialog: MatDialog, private http: HttpClient,
    private StaffService: StaffService,
    private _formBuilder: FormBuilder,
    private appComponent : AppComponent,
    private authenticationService:AuthenticationService,
    private _snackBar: MatSnackBar,
    private titleService: Title

    ) { 
      this.staffId=JSON.stringify(this.authenticationService.currentUserValue.user_id);
    }

    private handleError(error: HttpErrorResponse) {
      return throwError('Error! something went wrong.');
      //return error.error ? error.error : error.statusText;
    }

  ngOnInit() {

    this.myProfile = this._formBuilder.group({
      user_FirstName : ['', Validators.required],
      user_LastName : ['', Validators.required],
      user_Email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)],this.isEmailUniqueForEdit.bind(this)],
      user_Mobile : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
    });
    this.titleService.setTitle('My Profile');

    this.changePwd = this._formBuilder.group({
      oldPassword : ['',[Validators.required]],
      newPassword:['',[Validators.required,Validators.minLength(8)]],
      ReNewPassword: ['', Validators.required]            
    
    },{validator: this.checkPasswords });

    this.getProfiledata();
  }

  
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.newPassword.value;
    let confirmPass = group.controls.ReNewPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  getProfiledata(){
    this.StaffService.getProfiledata().subscribe((response:any) => 
    {
      if(response.data == true){
        this.isLoader=false;
        this.profiledata = response.response;
        this.myProfile.controls['user_FirstName'].setValue(this.profiledata.firstname);
        this.myProfile.controls['user_LastName'].setValue(this.profiledata.lastname);
        this.myProfile.controls['user_Email'].setValue(this.profiledata.email);
        this.myProfile.controls['user_Mobile'].setValue(this.profiledata.phone);
      }
      else if(response.data == false){
        this.isLoader=false;
        this._snackBar.open(response.response, "X", {
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
  onSubmit(){
    if(this.myProfile.valid){
      this.isLoader=true;
      this.updatedprofiledata ={
        "staff_id" : this.staffId,
        "firstname" : this.myProfile.get('user_FirstName').value,
        "lastname" : this.myProfile.get('user_LastName').value,
        "email" : this.myProfile.get('user_Email').value,
        "phone" : this.myProfile.get('user_Mobile').value,
        "image" : this.profileImage,
      }
      
    this.fnprofilesubmit(this.updatedprofiledata)
    }else{
      this.myProfile.get("user_FirstName").markAsTouched();
      this.myProfile.get("user_LastName").markAsTouched();
      this.myProfile.get("user_Email").markAsTouched();
      this.myProfile.get("user_Mobile").markAsTouched();
    }
  }
  fnprofilesubmit(updatedprofiledata){
    this.StaffService.fnprofilesubmit(updatedprofiledata).subscribe((response:any) => {
      if(response.data == true){
         this._snackBar.open("Profile Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          localStorage.setItem('currentUser', JSON.stringify(response.response));
          this.appComponent.loadLocalStorage();
         window.location.reload();
         this.getProfiledata();
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
         this._snackBar.open("Profile Not Updated", "X", {
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

  
  fnChangePassword(){
    if(this.changePwd.valid){
      this.isLoader = true;
      let requestObject = {
        'user_id': this.staffId,
        'user_type':'SM',
        "old_password" : this.changePwd.get('oldPassword').value,
        "password" : this.changePwd.get('ReNewPassword').value,
      }
      this.StaffService.changePassword(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          window.location.reload();
          this.changePwd.reset();
        }
        else if(response.data == false){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
        this.isLoader = false;
      })
    }
    else{
      this.changePwd.get("oldPassword").markAsTouched();
      this.changePwd.get("newPassword").markAsTouched();
    }
  }

  
  onRemoveProfile(){
    let requestObject = {
      'user_type': 'SM',
      'user_id': this.staffId
    }
    this.isLoader =true;
    this.StaffService.removeImage(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.getProfiledata();
      }else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
      this.isLoader =false;
    })
  }

  isEmailUniqueForEdit(control: FormControl) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/admin-staff-email-check`,{ email: control.value,user_id:parseInt(this.staffId) },{headers:headers}).pipe(map((response : any) =>{
          return response;
        }),
        catchError(this.handleError)).subscribe((res) => {
          if(res){
            if(res.data == false){
            resolve({ isEmailUniqueForEdit: true });
            }else{
            resolve(null);
            }
          }
        });
      }, 500);
    });
  }
  
     ImgUpload() {
    const dialogRef = this.dialog.open(DialogStaffImageUpload, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
       if(result != undefined){
        this.profileImage = result;
       }
     });
  }

}

@Component({
	  selector: 'image-upload-dialog',
	  templateUrl: '../_dialogs/image-upload-dialog.html',
	})
	export class DialogStaffImageUpload {

    uploadForm: FormGroup;  
    imageSrc: any;  
    profileImage: string;
	  constructor(
	    public dialogRef: MatDialogRef<DialogStaffImageUpload>,
      private _formBuilder:FormBuilder,
      private _snackBar: MatSnackBar,
	    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

	  onNoClick(): void {
	    this.dialogRef.close();
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
  uploadImage(){
    this.profileImage = this.imageSrc
    this.dialogRef.close(this.profileImage);
  }

	}