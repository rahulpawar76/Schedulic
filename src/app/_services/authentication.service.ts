import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    user_id: any;
    constructor(private http: HttpClient,
        private _snackBar: MatSnackBar,
        ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    public getIPAddress()  
    {  
      return this.http.get(`${environment.apiUrl}/get-ip`);  
    }  

    public get currentUserValue(): User {       
        return this.currentUserSubject.value;
    }

    getOtp(requestObject){
        return this.http.post<any>(`${environment.apiUrl}/send-otp`, requestObject)
           .pipe(map(data => { 
               return data;
           }));
   }

    getPhoneCode(){
        return this.http.get<any>(`${environment.apiUrl}/get-phone-code`)
            .pipe(map(data => { 
                return data;
        }));
    }

   verifyOtp(requestObject) {
        return this.http.post<any>(`${environment.apiUrl}/otp-login`,  requestObject )
        .pipe(map(user => {
            if (user && user.data== true && user.response.token) {
                localStorage.setItem('currentUser', JSON.stringify(user.response));
               // localStorage.setItem('isFront', "false");
               var logoutTime = new Date();
               logoutTime.setHours( logoutTime.getHours() + 6 );
               localStorage.setItem('logoutTime', JSON.stringify(logoutTime));

                this.currentUserSubject.next(user.response);
            }
            return user;
        }));
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/user-login`, { email, password })
        .pipe(map(user => {
            if (user && user.data== true && user.response.token) {
                localStorage.setItem('currentUser', JSON.stringify(user.response));
               var logoutTime = new Date();
               logoutTime.setHours( logoutTime.getHours() + 6 );
               localStorage.setItem('logoutTime', JSON.stringify(logoutTime));

                this.currentUserSubject.next(user.response);
            }
            console.log(user)
            return user;
        }));
    }

    loginWithGoogleFacebook(authId,email,provider) {
        let requestObject={
            "auth_id":authId,
            "email_id":email,
            "provider":provider
        }
        return this.http.post<any>(`${environment.apiUrl}/facebook-google-login`, requestObject)
        .pipe(map(user => {
            if (user && user.response) {
                localStorage.setItem('currentUser', JSON.stringify(user.response.userData));
                this.currentUserSubject.next(user.response.userData);
                var logoutTime = new Date();
               logoutTime.setHours( logoutTime.getHours() + 6 );
               localStorage.setItem('logoutTime', JSON.stringify(logoutTime));
            }
            return user.response;
        }));
    }

    signup(signUpUserObj) {
        return this.http.post<any>(`${environment.apiUrl}/signup`,signUpUserObj)
        .pipe(map(data => {
            return data;
        }));
    }

/* That function will send email to user with reset link */
    sendResetLink(user_email: string){
         let site_url = environment.urlForLink;
         return this.http.post<any>(`${environment.apiUrl}/ForgotPasswordProcess/send_reset_link`, { user_email, site_url })
            .pipe(map(data => { 
                return data;
            }));

    }

/* That function will update user's password */
    setNewPassword(npassword: string, user_id: string){
        return this.http.post<any>(`${environment.apiUrl}/ForgotPasswordProcess/set_reset_password`, { npassword, user_id })
            .pipe(map(data => {                                              
                return data;
            }));

    }

    logout() {
        // remove user from local storage to log user out
        // localStorage.removeItem('userId');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isFront');
        localStorage.removeItem('logoutTime');
        localStorage.removeItem('business_id');
        localStorage.removeItem('internal_staff');
        localStorage.removeItem('business_name');
        localStorage.removeItem('isBusiness');
        localStorage.removeItem('adminData');
        localStorage.clear();
        // localStorage.removeItem('userToken');
        // localStorage.removeItem('userName');
        // localStorage.removeItem('userRole');
        // localStorage.removeItem('tokenID');
        this.currentUserSubject.next(null);
    }

    customerLogout() {
        // remove user from local storage to log user out
        // localStorage.removeItem('userId');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isFront');
        localStorage.removeItem('logoutTime');
        localStorage.removeItem('business_id');
        localStorage.removeItem('internal_staff');
        localStorage.removeItem('business_name');
        localStorage.removeItem('isBusiness');
        localStorage.removeItem('adminData');
        // localStorage.clear();
        // localStorage.removeItem('userToken');
        // localStorage.removeItem('userName');
        // localStorage.removeItem('userRole');
        // localStorage.removeItem('tokenID');
        this.currentUserSubject.next(null);
        //window.location.reload(true);
     //   console.log(this.currentUserValue);
    }
    pageName(name,user_type){
        

        if(user_type=='SM'){
            if(name==null){
                return 'My Workspace'
            }else if(name=='my-appoi'){
                return 'My Appointments';
            }else if(name=='work-pro'){
                return 'My Work Profile';
            }else if(name=='my-profi'){
                return 'My Profile';
            }
        }
        if(user_type=='SA'){
            if(name==null){
                return 'My Admins'
            }else if(name=='my-trans'){
                return 'My Transactions';
            }else if(name=='my-subsc'){
                return 'My Subscriptions';
            }else if(name=='my-profi'){
                return 'My Profile';
            }
        }

        if(user_type=='C'){
            if(name==null){
                return 'My Appointments'
            }else if(name=='my-profi'){
                return 'My Profile';
            }
        }

        if(name=='my-appoi'){
            return 'My Appointments'
        }else if(name=='my-works'){
            return 'My Workspace';
        }else if(name=='my-custo'){
            return 'My Customer';
        }else if(name=='my-repor'){
            return 'My Reports';
        }else if(name=='my-disco'){
            return 'My Discount Coupon';
        }else if(name=='settings'){
            return 'My Settings';
        }else if(name=='my-profi'){
            return 'My Profile';
        }else if(name=='my-busin'){
            return 'My Business';
        }
    }

    logoutTime(){
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(currentUser){
            var logoutTime = JSON.parse(localStorage.getItem('logoutTime'));
            logoutTime = new Date(logoutTime);
            var currentTime = new Date();
            if(currentTime>logoutTime && localStorage.getItem('logoutTime')){
                this.logout();
                return true;
            }else{
                return false;
            }
        }
    }
}