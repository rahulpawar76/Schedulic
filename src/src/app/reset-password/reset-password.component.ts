import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  user_id: string;
  resetPasswordForm: FormGroup;
  dataLoaded: boolean = true;
  error= '';
  submitted = false;
  matcher = new MyErrorStateMatcher();
  constructor(
  		private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
        ) {
  	
         }

  ngOnInit() {  	
    this.user_id = this.route.snapshot.queryParams['id'] || '/';    
  	this.resetPasswordForm = this.formBuilder.group({
        new_password: ['', Validators.required],
        confirm_password: ['', Validators.required]            
    },{validator: this.checkPasswords });
  }

/* Check password and confirm password */
 checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.new_password.value;
    let confirmPass = group.controls.confirm_password.value;

    return pass === confirmPass ? null : { notSame: true }
  }

/*checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  let pass = group.get('new_password').value;
  let confirmPass = group.get('confirm_password').value; 
  return pass === confirmPass ? null : { notSame: true }     
}*/

// convenience getter for easy access to form fields
    get f() { return this.resetPasswordForm.controls; }


/* That function will reset password */
  fnResetPassword() {   
  		this.submitted = true;   
        // stop here if form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }       
        this.dataLoaded = false;
        this.authenticationService.setNewPassword(this.f.new_password.value,this.user_id)
            .pipe(first())
            .subscribe(
                data => {                     
                  if(data.status === "true" ){                    
                    this.router.navigate(['/login']);
                  }      
                },
                error => {                    
                    this.error = "Email is incorrect"; 
                    this.dataLoaded = true;                    
                });
        
    }

}
