import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User } from '@app/_models';

const users: User[] = [
    { id: 1, email: 'admin', password: '007', firstname: 'Admin', lastname: 'User', role: 'admin' },
    { id: 201, email: 'manager', password: '1515', firstname: 'Manager', lastname: 'User', role: 'manager' },
    { id: 35, email: 'employee', password: '1515', firstname: 'John', lastname: 'Doe', role: 'employee' },
    { id: 220, email: 'tony', password: '1515', firstname: 'Tony', lastname: 'Kelly', role: 'employee' },
    { id: 221, email: 'douglas', password: '1515', firstname: 'Douglas', lastname: 'Glennie', role: 'employee' },
    { id: 222, email: 'ravi', password: '1515', firstname: 'Ravi', lastname: 'Naicker', role: 'employee' },
    { id: 223, email: 'siyabonga', password: '1515', firstname: 'Siyabonga', lastname: 'Malevu', role: 'employee' },
    { id: 224, email: 'kugen', password: '1515', firstname: 'Kugen', lastname: 'Govender ', role: 'employee' },
    { id: 225, email: 'joel', password: '1515', firstname: 'Joel', lastname: 'Ellaya', role: 'employee' },
    { id: 226, email: 'blessing', password: '1515', firstname: 'Blessing', lastname: 'Nzimande', role: 'employee' },
    { id: 227, email: 'robin', password: '1515', firstname: 'Robin', lastname: 'Colborne', role: 'employee' },
    { id: 228, email: 'levern', password: '1515', firstname: 'Le Vern ', lastname: 'Wang', role: 'employee' },
    { id: 229, email: 'muhammad', password: '1515', firstname: 'Muhammad', lastname: 'Ali', role: 'employee' },
    { id: 230, email: 'lungile', password: '1515', firstname: 'Lungile', lastname: 'Koti', role: 'employee' },
    { id: 231, email: 'sabelon', password: '1515', firstname: 'Sabelo', lastname: 'Nkumane', role: 'employee' },
    { id: 232, email: 'vincent', password: '1515', firstname: 'Vincent', lastname: 'Mbedzi', role: 'employee' },
    { id: 233, email: 'phozisa', password: '1515', firstname: 'Phozisa', lastname: 'Qutu', role: 'employee' },
    { id: 234, email: 'thomas', password: '1515', firstname: 'Thomas', lastname: 'Skosana', role: 'employee' },
    { id: 235, email: 'robert', password: '1515', firstname: 'Robert', lastname: 'Mashele', role: 'employee' },
    { id: 236, email: 'albert', password: '1515', firstname: 'Albert', lastname: 'Maqabe', role: 'employee' },
    { id: 237, email: 'sibusiso', password: '1515', firstname: 'Sibusiso', lastname: 'Mahlangu', role: 'manager' },
    { id: 238, email: 'sabelom', password: '1515', firstname: 'Sabelo', lastname: 'Mdlalose', role: 'employee' },
    { id: 239, email: 'silindile', password: '1515', firstname: 'Silindile', lastname: 'Shandu', role: 'employee' },
    { id: 240, email: 'william', password: '1515', firstname: 'William ', lastname: 'Dingiswayo', role: 'employee' },
    { id: 241, email: 'sandy', password: '1515', firstname: 'Sandy', lastname: 'Sithole', role: 'employee' },
    { id: 242, email: 'tanith', password: '1515', firstname: 'Tanith', lastname: 'Stuart', role: 'employee' },
    { id: 243, email: 'stephen', password: '1515', firstname: 'Stephen', lastname: 'Foster', role: 'employee' },
    { id: 244, email: 'johan', password: '1515', firstname: 'Johan', lastname: 'Greyling ', role: 'employee' },
    { id: 245, email: 'kaleesha', password: '1515', firstname: 'Kaleesha', lastname: 'Singh', role: 'employee' },
    { id: 246, email: 'amanda', password: '1515', firstname: 'Amanda', lastname: 'Voges', role: 'employee' },
    { id: 247, email: 'errol', password: '1515', firstname: 'Errol', lastname: 'Kubarilall', role: 'employee' },
    { id: 248, email: 'sibongile', password: '1515', firstname: 'Sibongile', lastname: 'Mayisela', role: 'employee' },
    { id: 249, email: 'tebogo', password: '1515', firstname: 'Tebogo', lastname: 'Seakamela', role: 'employee' },
    { id: 250, email: 'marinda', password: '1515', firstname: 'Marinda', lastname: 'Swart', role: 'manager' }];


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            // .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            // .pipe(delay(500))
            // .pipe(dematerialize())
            ;

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { email, password } = body;
            const user = users.find(x => x.email === email && x.password === password);
            if (!user) return error('Email or password is incorrect');
            return ok({
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                token: 'fake-jwt-token'
            })
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};