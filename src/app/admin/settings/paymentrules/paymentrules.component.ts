import { Component, OnInit , Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AppComponent } from '@app/app.component'

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-paymentrules',
  templateUrl: './paymentrules.component.html',
  styleUrls: ['./paymentrules.component.scss']
})
export class PaymentrulesComponent implements OnInit {
  animal: any;
  adminSettings : boolean = true;

  constructor(
    public dialog: MatDialog,
    private appComponent : AppComponent,
  )   {
    this.appComponent.settingsModule(this.adminSettings);
   }

  ngOnInit() {
  }

  addTax() {
    const dialogRef = this.dialog.open(DialogAddNewTax, {
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
  templateUrl: '../_dialogs/add-tax-dialog.html',
})
export class DialogAddNewTax {

constructor(
  public dialogRef: MatDialogRef<DialogAddNewTax>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}

}
