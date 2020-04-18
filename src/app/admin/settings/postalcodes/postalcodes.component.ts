import { Component, OnInit ,Inject} from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface DialogData {
  
}
@Component({
  selector: 'app-postalcodes',
  templateUrl: './postalcodes.component.html',
  styleUrls: ['./postalcodes.component.scss']
})

export class PostalcodesComponent implements OnInit {
  adminSettings : boolean = true;
  postalCodeList:any;
  changePostalCodeStatusObject:any;
  selectedValue:any;
  arr:any=[];
  constructor(public dialog: MatDialog,
    public adminSettingsService : AdminSettingsService,
    private _snackBar: MatSnackBar) {
    this.fnGetPostalCodeList();
  }

  ngOnInit() {}
  
  onNoClick(): void {
  this.dialogRef.close();
}

  addPostalCode(){

    const dialogRef = this.dialog.open(DialogAddPostalCode, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        this.fnGetPostalCodeList();
      }
    });
  }

  fnGetPostalCodeList(){
    this.adminSettingsService.getPostalCodeList().subscribe((response:any) => {
      if(response.data == true){
        this.postalCodeList = response.response;
        this.postalCodeList.forEach(element => {
          if(element.postal_status == 'E'){
            element.postal_status=true;
          }else{
            element.postal_status=false;
          }
        });
      }
      else if(response.data == false){
       this.postalCodeList = [];
      }
    })
  }

  fnChangePostalCodeStatus(event,postalCodeId){
    console.log(event+" "+postalCodeId);
    
    if(event == true){
      this.changePostalCodeStatusObject = {
        'postal_id': postalCodeId,
        'status': "E"        
      };
    }else{
      this.changePostalCodeStatusObject = {
        'postal_id': postalCodeId,
        'status': "D"        
      };
    }
    this.adminSettingsService.changePostalCodeStatus(this.changePostalCodeStatusObject).subscribe((response:any) => {
      if(response.data == true){
         this._snackBar.open("Status Updated", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
      }
      else{
        this._snackBar.open("Status Not Updated", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
  }

  fnAddPostalCodeId(event,postalCodeId){
    if(event == true){
      console.log(this.arr);
      //this.arr.push(postalCodeId);
    }else{
      const index = this.arr.indexOf(postalCodeId, 0);
      if (index > -1) {
        this.arr.splice(index, 1);
      }
    }
  }

  fnSelectedPostalCodeStatus(event){
    if(this.arr.length>0){
      if(event.value=="active"){
        status="E";
      }else{
        status="D";
      }
      let requestObject={
        "postal_code":this.arr,
        "status":status
      }
      this.adminSettingsService.changeSelectedPostalCodeStatus(requestObject).subscribe((response:any) => {
        if(response.data == true){
           this._snackBar.open("Status Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
           this.arr.length=0;
           this.selectedValue = undefined;
           this.fnGetPostalCodeList();
        }
        else{
          this._snackBar.open("Status Not Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
      })
    }
    
  }

  fnDeletePostalCode(postalCodeId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure?"
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          let requestObject = {
            'postal_id': postalCodeId,
          };
          this.adminSettingsService.deletePostalCode(requestObject).subscribe((response:any) => {
            if(response.data == true){
              this.fnGetPostalCodeList();
            }
            else{

            }
          })
        }
      });

    
  }
}

@Component({
  selector: 'new-postalcode',
  templateUrl: '../_dialogs/add-new-postalcode.html',
})
export class DialogAddPostalCode {
  formCreatePostalCode : FormGroup;
  businessId : any;
  staffList : any;
  constructor(
    public dialogRef: MatDialogRef<DialogAddPostalCode>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public adminSettingsService : AdminSettingsService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {
    if(localStorage.getItem('business_id')){
        this.businessId = localStorage.getItem('business_id');
        this.fnGetStaffList();
    }
    this.formCreatePostalCode = this._formBuilder.group({
      postalCode: ['', Validators.required],
      postalCodeArea: ['', Validators.required],
      postalCodeStaff: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  fnGetStaffList(){
    this.adminSettingsService.getStaffList().subscribe((response:any) => {
      if(response.data == true){
        this.staffList = response.response.data;
      }
      else {
       this.staffList = [];
      }
    })
  }

  fnCreatePostalCode(){
    if(this.formCreatePostalCode.invalid){
      this.formCreatePostalCode.get("postalCode").markAsTouched();
      this.formCreatePostalCode.get("postalCodeArea").markAsTouched();
      this.formCreatePostalCode.get("postalCodeStaff").markAsTouched();
      return false;
    }
    let requestObject = {
      'business_id': this.businessId,
      'postal_code': this.formCreatePostalCode.get("postalCode").value,
      'area': this.formCreatePostalCode.get("postalCodeArea").value,
      'staff_id': this.formCreatePostalCode.get("postalCodeStaff").value,
    };
    this.adminSettingsService.createPostalCode(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("PostalCode Added", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
          this.dialogRef.close(true);
      }
      else if(response.data == false){
      }
    })
  }


}

