import { Component, Inject,AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { User, Role } from '@app/_models';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({ 
  selector: 'settings', 
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})

export class SettingsComponent implements AfterViewInit {


  currentUser: User;
  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,        
) {        
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

}
  ngAfterViewInit() { 

  }
  
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}