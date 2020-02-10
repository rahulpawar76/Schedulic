import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
   forgotForm: FormGroup;
   dataLoaded: boolean = true;
   error = '';
   submitted = false;
  constructor(
  	 	  private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,       
        private authenticationService: AuthenticationService        
        ){ 

  }

  ngOnInit() {   	
  	this.forgotForm = this.formBuilder.group({
        email: ['', Validators.required]        
    });
  }

// convenience getter for easy access to form fields
    get f() { return this.forgotForm.controls; }

    
/* That function will send mail to user with reset link */
  fnForgotPassword() {    
        this.submitted = true;   
        // stop here if form is invalid
        if (this.forgotForm.invalid) {
            return;
        }       
        this.dataLoaded = false;
        // this.authenticationService.sendResetLink(this.f.email.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {                    
        //           if(data.status === "true" ){                    
        //             this.router.navigate(['/login']);
        //           }    
        //         },
        //         error => {                    
        //             this.error = "Email is incorrect";
        //             this.dataLoaded = true;                    
        //         });
    }

}
