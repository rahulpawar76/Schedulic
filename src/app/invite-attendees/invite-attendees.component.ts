import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/_services';
import { QuestionService} from '@app/_services';
import { environment } from '@environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invite-attendees',
  templateUrl: './invite-attendees.component.html',
  styleUrls: ['./invite-attendees.component.scss']
})
export class InviteAttendeesComponent implements OnInit {
	firstFormGroup: FormGroup;
	jsonUser;
	currentUser:any;
	token:any;
	emailArray :any;
	emailFormat : any;
  	constructor(private _formBuilder: FormBuilder,
  		private questionService: QuestionService,
  		private _snackBar: MatSnackBar,
  		private authenticationService: AuthenticationService) { 
  		this.currentUser = this.authenticationService.currentUserValue;
  		this.token = localStorage.getItem('token');
  		this.emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  		
  		
  	}
  	//, Validators.email
	 ngOnInit() {
	  	this.firstFormGroup = this._formBuilder.group({
	      email: ['',Validators.required],
	    });
	}
	 userInvite(event: Event) {
	 	let that = this;
	 	this.emailArray.forEach(function (email){
	      let  jsonUser = {
	     	"token": that.token,
	      	"email": email,
      		"user_id": that.currentUser.id,
	     	"serverLink" :environment.urlForLink
		}
			that.saveUser(jsonUser);
	    })
 	}
 	// onInput(value){
 	// 	//alert(value);
 	// 	this.emailArray = value.split(/[ ,]+/);
 	// 	alert(JSON.stringify(this.emailArray));
 	// }
 	remove(email): void {
	    const index = this.emailArray.indexOf(email);
	    if (index >= 0) {
	      this.emailArray.splice(index, 1);
	    }
	    this.firstFormGroup.patchValue({"email" :this.emailArray.toString()});
	  }
 	saveUser(reqData) {
 		
    this.questionService.InviteAttendees(reqData)
      .subscribe(
        (res) => {
          if(res.data){
          	this.emailArray =[];
          	this.firstFormGroup.patchValue({"email" :""});
          	//this.success = 'Created successfully';
		    this._snackBar.open("Invitaion sent successfully", "X", {
		      duration: 2000,
		      verticalPosition: 'top',
		      panelClass : ['green-snackbar']
		    });
		
          }else{
          	this._snackBar.open(res.response, "X", {
		      duration: 2000,
		      verticalPosition: 'top',
		      panelClass: ['red-snackbar']
		    });
          }
          
        },
        (err) =>{
        	console.log(err)
        } 
      );
  }

}
