import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { User, Role } from '@app/_models';
//import { UserService, AuthenticationService } from '@app/_services';

@Component({ 
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})

export class HomeComponent {
    loading = false;
    currentUser: User;
    // userFromApi: User;

    constructor(
        //private userService: UserService,
       // private authenticationService: AuthenticationService
    ) 
    {
       // this.currentUser = this.authenticationService.currentUserValue;
    }

    isManagerUser() {
        return this.currentUser && ((this.currentUser.role === Role.Staff) || (this.currentUser.role === Role.Admin));
    }
  
    isAdminUser() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }

    ngOnInit() {
        this.loading = true;
    }
} 