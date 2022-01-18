import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../_services';
import { environment } from '@environments/environment';
import {  DialogReAuthentication  } from './../../app.component';

export interface DialogData {
    animal: string;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  businessId : any = localStorage.getItem('business_id')?localStorage.getItem('business_id'):'';
  currentUser : any;
  animal:any;
  dialogRef:any;
  constructor(
    private http: HttpClient,
    private authenticationService:AuthenticationService,
    public dialog: MatDialog,
    public router: Router,
    ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    
    localStorage.setItem('isBusiness', 'false');
  }  
    private handleError(error: HttpErrorResponse) {
        console.log(error);
        return throwError('Error! something went wrong.');
    }

    ngOnInit() {
       
      }

      
  checkAuthentication(){
    let requestObject = {
      "user_type": this.currentUser.user_type,
      "user_id" : this.currentUser.user_id,
      "token" : this.currentUser.token
    };
    this.http.post(`${environment.apiUrl}/check-token`,requestObject).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
      if (response.data == true) {
      }
      else if(response.data == false){
        this.reAuthenticateUser();
      }
    },(err) =>{
        console.log(err)
    });

  }
    
    //   Business Module
    getAllBusiness(){
        this.checkAuthentication();
        let requestObject = {
            'admin_id' : JSON.stringify(this.currentUser.user_id),
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token
        });
        return this.http.post(`${environment.apiUrl}/list-business`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    gelAllCountry(){
        this.checkAuthentication();
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
        this.checkAuthentication();
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
        this.checkAuthentication();
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
    getBusinessCategory(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token
        });
        return this.http.post(`${environment.apiUrl}/get-business-categories`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getTimeZone(){
        this.checkAuthentication();
        let requestObject = {
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/get-timezone`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    createNewBusiness(newBusinessData){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token
        });
        return this.http.post(`${environment.apiUrl}/create-business`,newBusinessData,{headers:headers}).pipe(
        map((res) => {
           
            return res;
        }),
        catchError(this.handleError));
    }

    // Appointment Module

    getAllAppointments(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        

        return this.http.post(`${environment.apiUrl}/admin-booking-listing`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getAllAppointmentsData(url,requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(url,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    // Get All Services

    getAllServices(requestObject){
        this.checkAuthentication();
        
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/admin-service-list`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    // Customer Module
    getAllCustomers(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/admin-customer-list`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getCustomersDetails(customer_id){
        this.checkAuthentication();
        let requestObject = {
            'customer_id': customer_id,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/admin-customer-details`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnCreateNewCustomer(newCustomerData){
        this.checkAuthentication();
        //let requestObject = {
        //     'customer_id': customer_id,
        // };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/admin-customer-create`,newCustomerData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    removeImage(newCustomerData){
        this.checkAuthentication();
        //let requestObject = {
        //     'customer_id': customer_id,
        // };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/remove-profile-image`,newCustomerData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    customerUpdate(existingCustomerData){
         this.checkAuthentication();
        // let requestObject = {
        //     'customer_id': customer_id,
        // };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/customer-profile-update`,existingCustomerData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnDeleteCustomer(customerId){
        this.checkAuthentication();
        let requestObject = {
            'customer_id': customerId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/customer-delete`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnDeleteNote(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/note-delete`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fncreateNewNote(createNewNoteData){
        this.checkAuthentication();
        // let requestObject = {
        //     'customer_id': customer_id,
        // };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/customer-note-create`,createNewNoteData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnEditNote(editNoteData){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/customer-note-edit`,editNoteData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnSaveTags(customerId,tags){
        this.checkAuthentication();
        let requestObject = {
            'customer_id': customerId,
            'tags': tags
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/customer-tags`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    // Get Appointments by Category and Status
    getAllAppointmentsByCategoryAndStatus(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/admin-today-listing`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    // Get Categories
    getAllCategories(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });

        return this.http.post(`${environment.apiUrl}/get-all-category`,requestObject,{headers:headers} ).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError));
    }

    // Get 
    get(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });

        return this.http.post(`${environment.apiUrl}/get-all-category`,requestObject,{headers:headers} ).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError));
    }

    // Get TodayRevenue
    getTodayRevenue(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });

        return this.http.post(`${environment.apiUrl}/admin-today-revenue`,requestObject,{headers:headers} ).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError));
    }

    // Couponcode

    getAllCouponCode(url,requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(url,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    createNewCouponCode(createdCouponCodeData){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/create-discount-coupon`,createdCouponCodeData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    updateCouponCode(createdCouponCodeData){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/discount-coupon-update`,createdCouponCodeData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    deleteCoupon(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/discount-coupon-delete`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    changeCouponStaus(couponCodeStatus,coupon_id){
        this.checkAuthentication();
        let requestObject = {
            'coupon_id': coupon_id,
            'status' : couponCodeStatus
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/discount-coupon-status-update`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

     rescheduleAppointment(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
        'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/admin-booking-resedule`,requestObject,{headers:headers}).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError));
      }
      
    //   fncustomerReport(){
    //     this.checkAuthentication();
       // let requestObject = {
    //         'business_id': this.businessId,
    //     };
    //     let headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'admin-id' : JSON.stringify(this.currentUser.user_id),
    //         'api-token' : this.currentUser.token 
    //     });
    //     return this.http.post(`${environment.apiUrl}/customer-reports`,requestObject,{headers:headers}).pipe(
    //     map((res) => {
    //         return res;
    //     }),
    //     catchError(this.handleError));
    // }

     updateAppointmentStatus(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
        'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/admin-booking-single-update`,requestObject,{headers:headers}).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError));
      }

     assignStaffToOrder(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
        'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/admin-assignStaff-update`,requestObject,{headers:headers}).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError));
      }

    // get category and services

    getCateServiceList(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/get-category-service`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getGetCategory(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/get-pos-category`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getService(requestObject){
        
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/get-pos-service`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getStaff(requestObject){
        
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/get-pos-staff`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    

    placeOrder(requestObject){
        
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/create-pos-order`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getWatinglist(requestObject){
        
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/create-pos-waiting-list`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    cancelOrder(requestObject){
        
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/create-pos-cancel-booking`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }


    PendingBilling(requestObject){
        
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/get-pos-pending-billing`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    pendingbillAction(requestObject){
        
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/billing-order`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    outdoorOrders(requestObject){
        
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/get-pos-ontheway-billing`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    outdoorGoogleaddress(address){

        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${environment.googleMapAPIKey}`).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));

    }

    OrderUpdateStatus(requestObject){
        
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/admin-booking-single-update`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    // live pending appointments

    getPendingAppointments(search,URL){
        this.checkAuthentication();
        let requestObject = {
            'business_id': localStorage.getItem('business_id'),
            'search' : search,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${URL}`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    
    getNotAssignedAppointments(URL){
        this.checkAuthentication();
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${URL}`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getOnThewayAppointments(URL){
        this.checkAuthentication();
        let requestObject = {
            'business_id': localStorage.getItem('business_id'),
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${URL}`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    
    getWorkStartedAppointments(searchKeyword,URL){
        this.checkAuthentication();
        let requestObject = {
            'business_id': localStorage.getItem('business_id'),
            'search' : searchKeyword
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${URL}`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
///appointment-reports
    getAppointmentsReports(requestObject,api_url){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${api_url}`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getSalesReports(requestObject,api_url){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${api_url}`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getCustomerReports(requestObject,api_url){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${api_url}`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    // Get Tax details

    getTaxDetails(requestObject){
        this.checkAuthentication();
        
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/tax-list`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    //setting my profile

    getMyProfileDetails(){
        this.checkAuthentication();
        let requestObject = {
            'business_id': this.businessId,
        };
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/get-admin-profile`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    updateProfile(updatedAdminProfileData){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/admin-profile-update`,updatedAdminProfileData,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getOffDays(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/list-holidays`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getSettingValue(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': JSON.stringify(this.currentUser.user_id),
            'api-token': this.currentUser.token
        });
        return this.http.post(`${environment.apiUrl}/get-setting-value`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnAppointAction(status, orderItemsIdArr){
        this.checkAuthentication();
        let requestObject = {
            'business_id': this.businessId,
            'order_item_list' : orderItemsIdArr,
            'action' : status
        };
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        }); 
        return this.http.post(`${environment.apiUrl}/admin-booking-update-multiple`,requestObject,{headers:headers}).pipe(
                    map((res) => {
                        return res;
                    }),
                    catchError(this.handleError));
        }

    fnExportCustomer(selectedCustomerId){
        this.checkAuthentication();
        let requestObject = {
            'customer_id': selectedCustomerId,
        };
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/export-customer`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getCoupon(requestObject) {
		this.checkAuthentication();
		let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': JSON.stringify(this.currentUser.user_id),
            'api-token': this.currentUser.token
		});
		return this.http.post(`${environment.apiUrl}/get-coupon`, requestObject, { headers: headers }).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
	}
    checkCoupon(requestObject) {
		this.checkAuthentication();
		let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': JSON.stringify(this.currentUser.user_id),
            'api-token': this.currentUser.token
		});
		return this.http.post(`${environment.apiUrl}/check-discount-coupon`, requestObject, { headers: headers }).pipe(
		map((res) => {
			return res;
		}),
		catchError(this.handleError));
	}
    viewReviewDetail(orderId){
        this.checkAuthentication();
        let requestObject = {
            'order_item_id': orderId,
        };
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/rating-orderinfo`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getServiceListForCoupon(couponId){
        this.checkAuthentication();
        let requestObject = {
            'dis_coupon_id': couponId,
        };
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/discount-coupon-details`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    updatePaymentInfoAndStatus(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/update-payments`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getActivityLog(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });

        return this.http.post(`${environment.apiUrl}/logs-list`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    fnMultiDeleteCustomer(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });

        return this.http.post(`${environment.apiUrl}/customer-multi-action`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    
    saveBookingNotes(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/add-booking-notes`,requestObject,{headers:headers}).pipe(
        // return this.http.post(`${environment.apiUrl}/booking-note-update`,requestObject,{headers:headers}).pipe(
            map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getBookingNotes(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/get-booking-notes`,requestObject,{headers:headers}).pipe(
           map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getBusinessDetail(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/get-business`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getBusinessImage(requestObject){
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/get-business-image`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }


    todayBookingSearch(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/search-todays-booking`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    customerSearch(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/search-customer`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    sendInvoiceEmail(requestObject){
        this.checkAuthentication();
      let headers = new HttpHeaders({
        'admin-id' : JSON.stringify(this.currentUser.user_id),
        'api-token' : this.currentUser.token,
        // 'Content-Type': 'application/pdf'
      });
      return this.http.post(`${environment.apiUrl}/send-invoice`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
    }
    
    onlinePayment(requestObject){
        this.checkAuthentication();
      let headers = new HttpHeaders({
        'admin-id' : JSON.stringify(this.currentUser.user_id),
        'api-token' : this.currentUser.token,
        'Content-Type': 'application/json'
      });
      return this.http.post(`${environment.apiUrl}/send-payment-url`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
    }
    customerNewAppointment(requestObject){
        this.checkAuthentication();
      let headers = new HttpHeaders({
        'admin-id' : JSON.stringify(this.currentUser.user_id),
        'api-token' : this.currentUser.token,
        'Content-Type': 'application/json'
      });
      return this.http.post(`${environment.apiUrl}/order-create-check`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError));
    }
    
    getPostalCodeList(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
        });
        return this.http.post(`${environment.apiUrl}/postal-code-list`, requestObject, { headers: headers }).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }
    getGeoLocation(IP) {
        let requestObject = {
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`https://api.ipgeolocationapi.com/geolocate/`+IP, requestObject, { headers: headers }).pipe(
        // return this.http.post(`https://api.ipgeolocation.io/ipgeo?apiKey=AIzaSyDIx_jprz_nOTY0XoE8uhbX6oAy16GIyOc&ip=`+IP, requestObject, { headers: headers }).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    reAuthenticateUser() {
        if (this.dialogRef) return;
        this.dialogRef = this.dialog.open(DialogReAuthentication, {
          width: '500px',
    
        });
    
        this.dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.currentUser = result
                console.log(this.currentUser)
            }else{
                this.authenticationService.logout();
                this.router.navigate(['/login']);
            }
        });
      }

      changePassword(requestObject){
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'staff-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/change-password`,requestObject,{headers:headers}).pipe(
           map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    deleteBusiness(bussinessId){
        this.checkAuthentication();
        let requestObject = {
            'business_id': bussinessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/business-delete`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    duplicateBusiness(bussinessId){
        this.checkAuthentication();
        let requestObject = {
            'business_id': bussinessId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        return this.http.post(`${environment.apiUrl}/business-duplicate`,requestObject,{headers:headers}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    getBusinessSetup(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : JSON.stringify(this.currentUser.user_id),
            'api-token' : this.currentUser.token 
        });
        this.checkAuthentication();
        return this.http.post(`${environment.apiUrl}/getting-setup-api`, requestObject, { headers: headers }).pipe(
          map((res) => {
            return res;
          }),
          catchError(this.handleError));
      }
}

    