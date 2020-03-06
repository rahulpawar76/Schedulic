import { Component, OnInit , Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  animal: any;

  constructor(
    public dialog: MatDialog,
  ) { }

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
