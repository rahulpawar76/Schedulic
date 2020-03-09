import { Component, OnInit ,Inject} from '@angular/core';
import { AppComponent } from '@app/app.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
  
}
@Component({
  selector: 'app-postalcodes',
  templateUrl: './postalcodes.component.html',
  styleUrls: ['./postalcodes.component.scss']
})
export class PostalcodesComponent implements OnInit {
  adminSettings : boolean = true;
  animal: any;

  constructor(public dialog: MatDialog,private appComponent : AppComponent) {

    this.appComponent.settingsModule(this.adminSettings);
   }

  ngOnInit() {
  }
  addPostalCode(){

    const dialogRef = this.dialog.open(DialogAddPostalCode, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
       this.animal = result;
     });
  }
  

}

@Component({
  selector: 'new-postalcode',
  templateUrl: '../_dialogs/add-new-postalcode.html',
})
export class DialogAddPostalCode {

constructor(
  public dialogRef: MatDialogRef<DialogAddPostalCode>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}


}

