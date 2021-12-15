import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { Role } from '../_models';
import { AuthService, FacebookLoginProvider,GoogleLoginProvider, SocialUser } from 'angularx-social-login';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate  {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        
        localStorage.setItem('isFront', "false");
        if (currentUser) {

            var is_logout = this.authenticationService.logoutTime();

            if(is_logout==true){
                this.router.navigate(['/login']);
                return false;
            }
            // check if route is restricted by role
            if (route.data.roles && route.data.roles == currentUser.user_type) {
                // role not authorised so redirect to home page
                //this.router.navigate(['/']);

                if(this.authenticationService.currentUserValue.google_id){
                    this.authService.authState.subscribe((user) => {
                        // alert(JSON.stringify(this.authenticationService.currentUserValue));
                        if(this.authenticationService.currentUserValue){
                          if(user && user.provider == "GOOGLE" && user.id == this.authenticationService.currentUserValue.google_id){
                              return true;
                          }else{
                                this.authenticationService.logout();
                                this.router.navigate(['/login']);
                              return false;
                          }
                        }
                    });
                }
                if(this.authenticationService.currentUserValue.facebook_id){
                    this.authService.authState.subscribe((user) => {
                        if(user && user.provider == "FACEBOOK" && user.id == this.authenticationService.currentUserValue.facebook_id){
                            return true;
                        }else{
                            this.authenticationService.logout();
                            this.router.navigate(['/login']);
                            return false;
                        }
                    });
                }
                if(!this.authenticationService.currentUserValue.google_id && !this.authenticationService.currentUserValue.facebook_id){
                  return true;
                }
                // authorised so return true
                return true;
            }else{
               if(currentUser.user_type == Role.Admin){
                    this.router.navigate(['/admin']);
                    return false;
               } else if(currentUser.user_type == Role.Staff){
                    this.router.navigate(['/staff']);
                    return false;
               } else if(currentUser.user_type == Role.Customer){
                    this.router.navigate(['/user']);
                    return false;
               } else if(currentUser.user_type == Role.SuperAdmin){
                    this.router.navigate(['/super-admin']);
                    return false;
               }
            }
            
            
        }

        // not logged in so redirect to login page with the return url
        //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        this.router.navigate(['/login']);
        return false;
    }
}                                             