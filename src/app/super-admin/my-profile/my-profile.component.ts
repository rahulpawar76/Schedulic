import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from '@app/app.component'
import { SuperAdminService } from '../_services/super-admin.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


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

  isLoaderAdmin:boolean = false;
  saProfile:FormGroup;
  profileDetails:any;
  updatedAdminProfileData:any;
  myProfileImageUrl:any = '';
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  constructor(
    public dialog: MatDialog,
    private appComponent : AppComponent,
    private SuperAdminService: SuperAdminService,
    private _snackBar: MatSnackBar,
    private _formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    this.getMyProfileDetails();
    this.saProfile = this._formBuilder.group({
      first_name : ['', [Validators.required,Validators.maxLength(10)]],
      last_name : ['', [Validators.required,Validators.maxLength(10)]],
      email : ['', [Validators.required, Validators.pattern(this.emailFormat)]],
      mobile : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      stripe_secret : ['', [Validators.required]],
      stripe_publish : ['', [Validators.required]],
    });
  }

  getMyProfileDetails(){
    this.isLoaderAdmin = true;
    this.SuperAdminService.getMyProfileDetails().subscribe((response:any) => {
      if(response.data == true){
        this.profileDetails = response.response;
        this.saProfile.controls['first_name'].setValue(this.profileDetails.firstname);
        this.saProfile.controls['last_name'].setValue(this.profileDetails.lastname);
        this.saProfile.controls['email'].setValue(this.profileDetails.email);
        this.saProfile.controls['mobile'].setValue(this.profileDetails.phone);
        this.saProfile.controls['stripe_secret'].setValue(this.profileDetails.stripe_sid);
        this.saProfile.controls['stripe_publish'].setValue(this.profileDetails.stripe_pid);
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
    
    this.isLoaderAdmin = false;
  }
  fnSubmitMyProfile(){
    if(this.saProfile.valid){
      if(this.myProfileImageUrl === ''){
        this.updatedAdminProfileData = {
          'firstname': this.saProfile.controls['first_name'].value,
          'lastname': this.saProfile.controls['last_name'].value,
          'phone': this.saProfile.controls['mobile'].value,
          'email': this.saProfile.controls['email'].value,
          'stripe_sid': this.saProfile.controls['stripe_secret'].value,
          'stripe_pid': this.saProfile.controls['stripe_publish'].value,
        }
      }else if(this.myProfileImageUrl !== ''){
        this.updatedAdminProfileData = {
          'firstname': this.saProfile.controls['first_name'].value,
          'lastname': this.saProfile.controls['last_name'].value,
          'phone': this.saProfile.controls['mobile'].value,
          'email': this.saProfile.controls['email'].value,
          'stripe_sid': this.saProfile.controls['stripe_secret'].value,
          'stripe_pid': this.saProfile.controls['stripe_publish'].value,
          'image': this.myProfileImageUrl
        }
      }
      this.updateProfile(this.updatedAdminProfileData);
    }else{
      this.saProfile.get('first_name').markAsTouched();
      this.saProfile.get('last_name').markAsTouched();
      this.saProfile.get('mobile').markAsTouched();
      this.saProfile.get('email').markAsTouched();
      this.saProfile.get('stripe_secret').markAsTouched();
      this.saProfile.get('stripe_publish').markAsTouched();
    }
  }
  updateProfile(updatedAdminProfileData){
    this.isLoaderAdmin = true;
    this.SuperAdminService.updateProfile(updatedAdminProfileData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Profile Updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.getMyProfileDetails();
        localStorage.setItem('currentUser', JSON.stringify(response.response));
        this.appComponent.loadLocalStorage();
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
    this.isLoaderAdmin = false;
  }

  myProfleImage() {
    const dialogRef = this.dialog.open(DialogMyProfileImageUpload, {
      width: '500px',
      
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.myProfileImageUrl = result;
            console.log(result);
          }
    });
  }

}


@Component({
  selector: 'my-profile-image-upload',
  templateUrl: '../_dialogs/my-profile-image-upload-dialog.html',
})
export class DialogMyProfileImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogMyProfileImageUpload>,
  private _formBuilder:FormBuilder,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close(this.profileImage);
    }
    ngOnInit() {
      this.uploadForm = this._formBuilder.group({
        profile: ['',Validators.required]
      });
    }
    get f() {
      return this.uploadForm.controls;
    }
    
onFileChange(event) {
  console.log(event.target.files);
  const reader = new FileReader();
  if (event.target.files && event.target.files.length) {
    for(var i = 0; i < event.target.files.length; i++) {
      if(event.target.files[i].type!="image/png" && event.target.files[i].type!="image/jpeg" && event.target.files[i].type!="image/jpg" && event.target.files[i].type!="image/gif"){
        this._snackBar.open("Select valid image file", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
        return false;
      }
    }
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
  if(this.uploadForm.invalid){
    this.uploadForm.controls['profile'].markAsTouched();
    this._snackBar.open("Select Image", "X", {
      duration: 2000,
      verticalPosition:'top',
      panelClass :['red-snackbar']
    });
    return false;
  }
  this.profileImage = this.imageSrc;
  this.dialogRef.close(this.profileImage);
}



}