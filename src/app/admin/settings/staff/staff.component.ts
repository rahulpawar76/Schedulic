import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
  StaffCreate: FormGroup;
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  animal: any;

  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.dtOptions = {
      // Use this attribute to enable the responsive extension
      responsive: true
    };
  }
  
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  addTimeOff() {
    const dialogRef = this.dialog.open(DialogAddNewTimeOff, {
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
  templateUrl: '../_dialogs/add-new-time-off-dialog.html',
})
export class DialogAddNewTimeOff {

constructor(
  public dialogRef: MatDialogRef<DialogAddNewTimeOff>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}


}
