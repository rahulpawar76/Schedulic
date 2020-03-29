import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'root' })

export class AdminService {
    adminId:any
    adminToken:any
    businessId : any;
    constructor(
        private http: HttpClient,
        private _snackBar: MatSnackBar,
        private authenticationService:AuthenticationService
        ) { 

            this.adminId=JSON.stringify(this.authenticationService.currentUserValue.user_id);
            this.adminToken = this.authenticationService.currentUserValue.token;
            localStorage.setItem('isBusiness', 'false');
            if(localStorage.getItem('business_id')){
                this.businessId = localStorage.getItem('business_id');
            }
    }  
    private handleError(error: HttpErrorResponse) {
        console.log(error);
        return throwError('Error! something went wrong.');
    }

    ngOnInit() {
       
      }
    
    //   Business Module
    getAllBusiness(){
        let requestObject = {
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        
        return this.http.post(`${environment.apiUrl}/list-business`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    gelAllCountry(){
        let requestObject = {
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/countries`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    gelAllState(country_id){
        let requestObject = {
            'country_id' : country_id
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/states`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    gelAllCities(state_id){
        let requestObject = {
            'state_id' : state_id
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/cities`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getTimeZone(){
        let requestObject = {
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`http://api.timezonedb.com/v2.1/list-time-zone?key=L1US8PRRVKYX&format=json`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    createNewBusiness(newBusinessData){
        let requestObject = {
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/create-business`,newBusinessData,{headers:headers}).pipe(
        map((res) => {
           
            return res;
        }),
        catchError(this.handleError));
    }

    // Appointment Module

    getAllAppointments(durationType,services){
        let requestObject = {
            'business_id' : this.businessId,
            'duration_type' : durationType,
            'services' : services
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/admin-booking-listing`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    // Get All Services

    getAllServices(){
        let requestObject = {
            'business_id' : this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/admin-service-list`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    // Customer Module
    getAllCustomers(){
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/admin-customer-list`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getCustomersDetails(customer_id){
        let requestObject = {
            'customer_id': customer_id,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/admin-customer-details`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnCreateNewCustomer(newCustomerData){
        // let requestObject = {
        //     'customer_id': customer_id,
        // };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/admin-customer-create`,newCustomerData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    customerUpdate(existingCustomerData){
        // let requestObject = {
        //     'customer_id': customer_id,
        // };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/customer-profile-update`,existingCustomerData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnDeleteCustomer(customerId){
        let requestObject = {
            'customer_id': customerId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/customer-delete`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fncreateNewNote(createNewNoteData){
        // let requestObject = {
        //     'customer_id': customer_id,
        // };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/customer-note-create`,createNewNoteData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnEditNote(editNoteData){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/customer-note-edit`,editNoteData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnSaveTags(customerId,tags){
        let requestObject = {
            'customer_id': customerId,
            'tags': tags
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/customer-tags`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    // Get Appointments by Category and Status
    getAllAppointmentsByCategoryAndStatus(requestObject){
        
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/admin-today-listing`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    // Get Categories
    getAllCategories(requestObject){
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });

        return this.http.post(`${environment.apiUrl}/get-all-category`,requestObject,{headers:headers} ).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError));
    }

    // Get 
    get(requestObject){
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });

        return this.http.post(`${environment.apiUrl}/get-all-category`,requestObject,{headers:headers} ).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError));
    }

    // Get TodayRevenue
    getTodayRevenue(requestObject){
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });

        return this.http.post(`${environment.apiUrl}/admin-today-revenue`,requestObject,{headers:headers} ).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError));
    }

    // Couponcode

    getAllCouponCode(couponListFilter){
        let requestObject = {
            'business_id': this.businessId,
            'filter' : couponListFilter,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/discount-coupon-list`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    createNewCouponCode(createdCouponCodeData){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/create-discount-coupon`,createdCouponCodeData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    changeCouponStaus(couponCodeStatus,coupon_id){
        let requestObject = {
            'coupon_id': coupon_id,
            'status' : couponCodeStatus
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/discount-coupon-status-update`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

     rescheduleAppointment(requestObject){
    
        let headers = new HttpHeaders({
        'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/admin-booking-resedule`,requestObject,{headers:headers}).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError));
      }
      
    //   fncustomerReport(){
    //     let requestObject = {
    //         'business_id': this.businessId,
    //     };
    //     let headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'admin-id' : this.adminId,
    //         'api-token' : this.adminToken 
    //     });
    //     return this.http.post(`${environment.apiUrl}/customer-reports`,requestObject,{headers:headers}).pipe(
    //     map((res) => {
    //         return res;
    //     }),
    //     catchError(this.handleError));
    // }

     updateAppointmentStatus(requestObject){
    
        let headers = new HttpHeaders({
        'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/admin-booking-single-update`,requestObject,{headers:headers}).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError));
      }

     assignStaffToOrder(requestObject){
    
        let headers = new HttpHeaders({
        'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/admin-assignStaff-update`,requestObject,{headers:headers}).pipe(
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

    // live pending appointments

    getPendingAppointments(){
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/get-pending-live`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    
    getNotAssignedAppointments(){
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/get-notassign-live`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getOnThewayAppointments(){
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/get-ontheway-live`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    
    getWorkStartedAppointments(){
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/get-workstart-live`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getAppointmentsReports(requestObject){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/appointment-reports`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getSalesReports(requestObject){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/sales-reports`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getCustomerReports(requestObject){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/customer-reports`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    // Get Tax details

    getTaxDetails(){
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.adminId,
            'api-token' : this.adminToken 
        });
        return this.http.post(`${environment.apiUrl}/tax-list`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    //setting my profile

    getMyProfileDetails(){
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/get-admin-profile`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    updateProfile(updatedAdminProfileData){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/admin-profile-update`,updatedAdminProfileData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getOffDays(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : this.adminId,
            'api-token' : this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/list-holidays`,requestObject,{headers:headers}).pipe(
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

}