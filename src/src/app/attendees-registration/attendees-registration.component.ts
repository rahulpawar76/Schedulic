import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router, RouterOutlet ,ActivatedRoute} from '@angular/router';
import decode from 'jwt-decode';

@Component({
  selector: 'app-attendees-registration',
  templateUrl: './attendees-registration.component.html',
  styleUrls: ['./attendees-registration.component.scss']
})
export class AttendeesRegistrationComponent implements OnInit {

	loginForm: FormGroup;
	jsonUser;
	accessToken;
  userId;
	session_id;
	statusExpiry;

  	constructor(private _formBuilder: FormBuilder,
  		private _snackBar: MatSnackBar,
  		public router: Router,
  		private route: ActivatedRoute) { 
  		  	}

	 ngOnInit() {
	 	
	}

}
