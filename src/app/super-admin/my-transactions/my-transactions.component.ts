import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DatePipe} from '@angular/common';
import { AuthenticationService } from '@app/_services';
import { AppComponent } from '@app/app.component'
import { environment } from '@environments/environment';
import { SuperAdminService } from '../_services/super-admin.service';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.scss'],
  providers: [DatePipe]
})
export class MyTransactionsComponent implements OnInit {
  isLoaderAdmin:boolean = false;
  transactionsList:any;
  constructor(
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private SuperAdminService: SuperAdminService,
  ) {
    this.getTransactions();
   }

  ngOnInit() {
  }

  getTransactions(){
    this.isLoaderAdmin= true;
    this.SuperAdminService.getTransactions().subscribe((response:any) => {
      if(response.data == true){
        this.transactionsList = response.response;
        this.transactionsList.forEach( (element) => {
          element.created_atForLabel=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
    this.isLoaderAdmin= false;
  }

}
