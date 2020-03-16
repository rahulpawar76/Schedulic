import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'root' })

export class AdminSettingsService {
    adminId: any
    adminToken: any
    businessId: any;
    constructor(
        private http: HttpClient,
        private _snackBar: MatSnackBar,
        private authenticationService: AuthenticationService
    ) {

        this.adminId = JSON.stringify(this.authenticationService.currentUserValue.user_id);
        this.adminToken = this.authenticationService.currentUserValue.token;
        localStorage.setItem('isBusiness', 'false');
        if (localStorage.getItem('business_id')) {
            this.businessId = localStorage.getItem('business_id');
        }
    }

    private handleError(error: HttpErrorResponse) {
        console.log(error);
        return throwError('Error! something went wrong.');
    }

    ngOnInit() { }

    getTimeZone() {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`http://api.timezonedb.com/v2.1/list-time-zone?key=L1US8PRRVKYX&format=json`, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    fnAllServices() {
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/admin-service-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    fnAllCategory() {
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/get-all-category`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getPostalCodeList() {
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/postal-code-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    createPostalCode(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-postal-code`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    deletePostalCode(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/postal-code-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getStaffList() {
        let requestObject = {
            'business_id': this.businessId,
            'action': 'E',
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changePostalCodeStatus(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/postal-code-status-update`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeSelectedPostalCodeStatus(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/postal-code-status-mulitiple`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getServiceForCategoiry(categoryId, filter) {
        let requestObject = {
            'business_id': this.businessId,
            'category_id': categoryId,
            'filter': filter

        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/list-service`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    createNewSubCategory(newSubCategoryData) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-sub-category`, newSubCategoryData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    createNewCategory(newCategoryData) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-category`, newCategoryData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    updateCategory(updateCategoryData) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/update-category`, updateCategoryData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    deleteCategory(deleteCategoryId) {
        let requestObject = {
            'business_id': this.businessId,
            'category_id': deleteCategoryId,
            'filter': filter

        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/delete-category`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    changeCategoryStatus(currentCategoryStatus, categoryId) {
        let requestObject = {
            'category_id': categoryId,
            'status': currentCategoryStatus,

        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/update-status-category`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnServiceAction(serviceIDArr, action) {
        let requestObject = {
            'services_id': serviceIDArr,
            'action': action,

        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/multiple-action-service`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    getServiceForSubCategoiry(subCategoryId, filter) {
        let requestObject = {
            'business_id': this.businessId,
            'sub_category_id': subCategoryId,
            'filter': filter

        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/list-subcategory-service`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    createNewService(newServiceData) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-service`, newServiceData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    updateService(updateServiceData) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/update-service`, updateServiceData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    changeSubCategoryStatus(currentSubCategoryStatus, subcategoryId) {
        let requestObject = {
            'category_id': subcategoryId,
            'status': currentSubCategoryStatus,

        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-service`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeTimeZone(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/timezone-change`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getWorkingHours(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-workhour-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }


}