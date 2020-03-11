import { Component, OnInit,Inject } from '@angular/core';
import { AppComponent } from '@app/app.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogData {
  animal: string;
  name: string;
  
}
@Component({
  selector: 'app-business-hours',
  templateUrl: './business-hours.component.html',
  styleUrls: ['./business-hours.component.scss']
})
export class BusinessHoursComponent implements OnInit {
  adminSettings : boolean = true;
  animal: any;
  constructor(private appComponent : AppComponent,public dialog: MatDialog) { 

    // this.appComponent.settingsModule(this.adminSettings);
  }

  ngOnInit() {
  }

  addTimeOff(){
    const dialogRef = this.dialog.open(DialogAddNewTimeOffBussiness, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
       this.animal = result;
     });

  }

}

@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/bussiness-hour-add-time-off.html',
})
export class DialogAddNewTimeOffBussiness {

constructor(
  public dialogRef: MatDialogRef<DialogAddNewTimeOffBussiness>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}


}
