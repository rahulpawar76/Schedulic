import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from '@app/app.component'
import { AdminService } from '../_services/admin-main.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
  StaffCreate: FormGroup;
}

@Component({
  selector: 'app-settings-my-profile',
  templateUrl: './settings-my-profile.component.html',
  styleUrls: ['./settings-my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  adminSettings : boolean = true;

  profileDetails: any;
  settingMyProfile:FormGroup;
  updatedAdminProfileData:any;

  myProfileImageUrl:any;

  
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  constructor(
    public dialog: MatDialog,
    private appComponent : AppComponent,
    private AdminService: AdminService,
    private _snackBar: MatSnackBar,
    private _formBuilder:FormBuilder) {

    //this.appComponent.settingsModule(this.adminSettings);
   }

  ngOnInit() {
    this.getMyProfileDetails();
    this.settingMyProfile = this._formBuilder.group({
      first_name : ['', [Validators.required,Validators.maxLength(8)]],
      last_name : ['', [Validators.required,Validators.maxLength(8)]],
      email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)]],
      mobile : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
    });
    
  }
  getMyProfileDetails(){
    this.AdminService.getMyProfileDetails().subscribe((response:any) => {
      if(response.data == true){
        this.profileDetails = response.response;
        this.settingMyProfile.controls['first_name'].setValue(this.profileDetails.firstname);
        this.settingMyProfile.controls['last_name'].setValue(this.profileDetails.lastname);
        this.settingMyProfile.controls['email'].setValue(this.profileDetails.email);
        this.settingMyProfile.controls['mobile'].setValue(this.profileDetails.phone);
      }
    })
  }
  fnSubmitMyProfile(){
      if(this.settingMyProfile.valid){
        this.updatedAdminProfileData = {
        'firstname': this.settingMyProfile.controls['first_name'].value,
        'lastname': this.settingMyProfile.controls['last_name'].value,
        'phone': this.settingMyProfile.controls['mobile'].value,
        'email': this.settingMyProfile.controls['email'].value,
        'image': this.myProfileImageUrl
        }
        this.updateProfile(this.updatedAdminProfileData);
      }
  }
  updateProfile(updatedAdminProfileData){
    this.AdminService.updateProfile(updatedAdminProfileData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Profile Updated", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.getMyProfileDetails();
      }
    })
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
        profile: ['']
      });
    }
    get f() {
      return this.uploadForm.controls;
    }
    
onFileChange(event) {
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
