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
    fnstaffList(){
        let requestObject = {
            'business_id': this.businessId,
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

    fnAllCategory() {
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/get-categories`, requestObject, { headers: headers }).pipe(
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
    updateSubCategory(updateSubCategoryData) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/update-sub-category`, updateSubCategoryData, { headers: headers }).pipe(
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
            'subcategory_id': subcategoryId,
            'status': currentSubCategoryStatus,

        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/update-status-subcategory`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    // changeTimeZone(requestObject) {
    //     let headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'admin-id': this.adminId,
    //         'api-token': this.adminToken
    //     });
    //     return this.http.post(`${environment.apiUrl}/timezone-change`, requestObject, { headers: headers }).pipe(
    //         map((res) => {
    //             return res;
    //         }),
    //         catchError(this.handleError));
    // }

    // getWorkingHours(requestObject) {
    //     let headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'admin-id': this.adminId,
    //         'api-token': this.adminToken
    //     });
    //     return this.http.post(`${environment.apiUrl}/business-workhour-list`, requestObject, { headers: headers }).pipe(
    //         map((res) => {
    //             return res;
    //         }),
    //         catchError(this.handleError));
    // }
    fnDeleteService(editServiceId) {
        let requestObject = {
            'service_id': editServiceId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/delete-service`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    deleteSubCategory(deleteSubCategoryId) {
        let requestObject = {
            'sub_category_id': deleteSubCategoryId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/delete-sub-category`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnAddTax(createAddTaxData) {


        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/tax-create`, createAddTaxData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getAllTax() {
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/tax-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    getAllCurrencies() {
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/currency-get`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    //delete tax

    deleteTax(taxId) {
        let requestObject = {
            'tax_id': taxId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/tax-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    // company detail
    getCompanyDetails() {
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/get-business`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    gelAllCountry() {
        let requestObject = {
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/countries`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    gelAllState(country_id) {
        let requestObject = {
            'country_id': country_id
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/states`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    gelAllCities(state_id) {
        let requestObject = {
            'state_id': state_id
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/cities`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnupdateBusineData(updateCompanyDetailsData) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-update`, updateCompanyDetailsData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnChangeCurrency(currencyCode) {
        let requestObject = {
            'business_id': this.businessId,
            "currency_code": currencyCode
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-currency`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnCreateAppearance(AppearanceData) {
        let requestObject = {
            'business_id': this.businessId,
            "appearance": AppearanceData
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-appearance`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    getSettingsValue() {
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/get-setting-value`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnCurrencyFormat(currencyFormat) {
        let requestObject = {
            'business_id': this.businessId,
            'currency_format': currencyFormat
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-currency-format`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnCurrencyPosition(currencyPosition) {
        let requestObject = {
            'business_id': this.businessId,
            'position': currencyPosition
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-currency-position`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnFormSetting(formArr) {
        let requestObject = {
            'business_id': this.businessId,
            'form_settings': formArr
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-form-settings`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    // Staff Module
    getAllStaff(api_url) {
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${api_url}`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnActionStaff(action, staffId) {
        let requestObject = {
            'status': action,
            'staff_id': staffId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-status-change`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnViewSingleStaff(staffId) {
        let requestObject = {
            'business_id': this.businessId,
            'staff_id': staffId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-details`, requestObject, { headers: headers }).pipe(
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

    createWorkingHours(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-workhour-create`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    applyToAll(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/workhour-applyall`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getBussinessTimeZone(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/timezone-get`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getTimeOffList(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-timeoff-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    deleteTimeOff(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-timeoff-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeTimeOffStatus(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-timeoff-status-update`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    addNewTimeOff(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-timeoff-create`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getBreakTimeList(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-breaktime-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    addNewBreak(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-breaktime-create`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    deleteBreak(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-breaktime-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    setMinAdvBookingTime(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-min-advance-booking-time`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    setMaxAdvBookingTime(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-max-advance-booking-time`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    setTimeInterval(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-time-interval-slots`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    setCancellationBufferTime(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-cancel-buffer-time`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    setMinResedulingTime(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-min-reseduling-time`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeCustomerLoginStatus(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-customer-login-status`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeStaffOnFrontStatus(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-staff-list-front`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    updateAppAutoConfirmSettings(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-auto-confirm`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeCustomerAllowStaffRatingStatus(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-customer-allow-staff-rating`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    updateTermsConditionsStatusValues(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-terms-conditions`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    updatePrivacyPolicyStatusValues(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-privacy-policy`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    updateThankyouPageStatusValues(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-thank-you`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getSettingValue(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/get-setting-value`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnChangeInternalStaff(status, staffId) {
        let requestObject = {
            'staff_id': staffId,
            'internal_staff': status,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-internal`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnChangeLoginAllowStaff(status, staffId) {
        let requestObject = {
            'staff_id': staffId,
            'login_allowed': status,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-login-allowed`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnAssignPostalToStaff(status, postalCodeId, staffId) {
        let requestObject = {
            'staff_id': staffId,
            'postalCodes': postalCodeId,
            'status': status,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-postalcode-update`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnAssignServiceToStaff(status, serviceId, staffId) {
        let requestObject = {
            'staff_id': staffId,
            'service_id': serviceId,
            'status': JSON.stringify(status),
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-service-attach`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    
    createWorkingHoursStaff(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-working-hour-update`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    applyToAllStaff(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-working-hour-applyall`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    workingHoursResetToDefault(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-working-hour-default`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    addNewBreakStaff(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-break-create`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    deleteBreakStaff(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-break-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    resetToDefaultBreakStaff(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-break-default`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    deleteTimeOffStaff(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-timeoff-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeTimeOffStatusStaff(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-timeoff-status`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    addNewTimeOffStaff(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-timeoff-create`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    resetToDefaultTimeOffStaff(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-timeoff-default`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    
    createNewStaff(newStaffData) {
        let headers = new HttpHeaders({             
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-create`, newStaffData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnDeleteStaff(staffId) {
        let requestObject = {
            'staff_id': staffId,
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    
    updateStaff(updateStaffData) {
        let headers = new HttpHeaders({           
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-update`, updateStaffData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    
    // get category and services

    getCateServiceList(){
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/get-category-service`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    viewStaffReviewDetail(orderId){
        let requestObject = {
            'order_item_id': orderId,
        };
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/rating-orderinfo`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnAppointmentsReminderCustomer(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-email-alert-setting-customer`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnUpdateStaffEmailAlert(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-email-alert-setting-staff`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnUpdateAdminEmailAlert(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-email-alert-setting-admin`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnSubmitCustomizeAlert(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-customize-email-alert`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getEmailTemplates(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/get-email-template`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnUpdateEmailTemp(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/update-email-template`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnChangeTemStatus(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/update-email-template-status`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnDefaultEmailTemp(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/default-email-message`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnUpdateSmsAlert(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-sms-reminder`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getSmsTemplates(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/get-sms-template`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnChangeSmsTemStatus(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/update-sms-status-template`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnDefaultSmsTemp(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-default-sms-template`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnUpdateSmsTemp(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/update-sms-template`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    updatePaypalSetting(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-paypal`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    updateStripeSetting(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-stripe`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    updatePayumoneySetting(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-payumoney`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    updateBankTransferSetting(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-bank-transfer`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    updateTwillioSettings(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-twilo-sms`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    updateTextLocalSettings(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-textlocal-sms`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    sendEmailVerification(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/send-verification-email`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    sendPhoneVerification(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/send-verification-sms`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    postalCodeSearch(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/search-postal-code`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    staffSearch(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/search-staff`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    
}