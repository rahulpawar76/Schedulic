import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    user_id: any;
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {     
         //alert(JSON.stringify(this.currentUserSubject.value));  
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        //return this.http.post<any>(`${environment.authApiUrl}/users/authenticate`, { email, password })
        return this.http.post<any>(`${environment.apiUrl}/customer-staff-login`, { email, password })
        .pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user && user.data== true && user.response.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                // localStorage.setItem('userId', user.response.user_id);
                // localStorage.setItem('userToken', user.response.token);          
                // localStorage.setItem('userName', user.response.fullname);
                // localStorage.setItem('userRole', user.response.user_type);
                // localStorage.setItem('tokenID',user.response.id);
                localStorage.setItem('currentUser', JSON.stringify(user.response));
               // localStorage.setItem('isFront', "false");
                this.currentUserSubject.next(user.response);
            }
            return user;
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
        // localStorage.removeItem('userToken');
        // localStorage.removeItem('userName');
        // localStorage.removeItem('userRole');
        // localStorage.removeItem('tokenID');
        // localStorage.clear();
        this.currentUserSubject.next(null);
    }
}