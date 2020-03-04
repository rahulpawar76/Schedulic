import { Component, OnInit } from '@angular/core';
import { AdminService } from '../_services/admin-main.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DatePipe} from '@angular/common';


@Component({
  selector: 'app-discount-coupon',
  templateUrl: './discount-coupon.component.html',
  styleUrls: ['./discount-coupon.component.scss'],
  providers: [DatePipe]
})


export class DiscountCouponComponent implements OnInit {
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isLoaderAdmin : boolean = false;
  animal: any;
  couponListFilter: any;
  couponCodeListing: boolean = true;
  addNewCouponCode: boolean = false;
  couponCodeStatus : any;
  allCouponCode: any;
  CategorySelect : boolean = false;
  createdCouponCodeData: any;
  businessId : any;
  valid_from : any;
  valid_till : any;
  selectedService : any = [];
  categoryServiceList : any;
  
  discountCoupon: FormGroup;


  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/
 
  
  constructor(
    private AdminService: AdminService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    localStorage.setItem('isBusiness', 'false');
    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
  }
   }

  ngOnInit() {
    this.couponListFilter = 'All';
    this.getAllCouponCode(this.couponListFilter);

    this.discountCoupon = this._formBuilder.group({
      coupan_name : ['', Validators.required],
      max_redemption : ['', [Validators.required,Validators.pattern(this.onlynumeric)]],
      coupon_code : ['', Validators.required],
      valid_from : ['', Validators.required],
      discount_type : ['', Validators.required],
      valid_till : ['', Validators.required],
      discount_value : ['', [Validators.required,Validators.pattern(this.onlynumeric)]],
      //user_Mobile : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
    });

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  getAllCouponCode(couponListFilter){
    this.isLoaderAdmin = true;
    this.AdminService.getAllCouponCode(couponListFilter).subscribe((response:any) => {
      if(response.data == true){
        this.allCouponCode = response.response
        this.allCouponCode.forEach( (element) => {
          element.coupon_valid_from=this.datePipe.transform(new Date(element.coupon_valid_from),"MMM d, y")
          element.coupon_valid_till=this.datePipe.transform(new Date(element.coupon_valid_till),"MMM d, y")
          element.created_at=this.datePipe.transform(new Date(element.created_at),"MMM d, y")
        });
        console.log(this.allCouponCode);
        
        this.dtTrigger.next();
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.allCouponCode = ''
        this.isLoaderAdmin = false;
      }
    })
  }

  fnCreateCouponSubmit(){
    if(this.discountCoupon.valid){
      this.valid_from = this.discountCoupon.get('valid_from').value;
      this.valid_till = this.discountCoupon.get('valid_till').value;
      this.valid_from=this.datePipe.transform(new Date(this.valid_from),"yyyy-MM-dd")
      this.valid_till=this.datePipe.transform(new Date(this.valid_till),"yyyy-MM-dd")
      this.createdCouponCodeData = {
        "business_id" : this.businessId,
        "coupon_name" : this.discountCoupon.get('coupan_name').value,
        "coupon_code" : this.discountCoupon.get('coupon_code').value,
        "coupon_max_redemptions" : this.discountCoupon.get('max_redemption').value,
        "valid_from" : this.valid_from,
        "valid_till" : this.valid_till,
        "discount_type" : this.discountCoupon.get('discount_type').value,
        "discount" : this.discountCoupon.get('discount_value').value,
        "services" : this.selectedService
      }
      this.createNewCouponCode(this.createdCouponCodeData);
    }
    console.log(this.createdCouponCodeData);
  }

  createNewCouponCode(createdCouponCodeData){
    this.isLoaderAdmin = true;
    this.AdminService.createNewCouponCode(createdCouponCodeData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Coupon Created", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.isLoaderAdmin = false;
        
      }
    })
  }

  fnStatusChange(status){
    this.couponListFilter = status;
    this.getAllCouponCode(this.couponListFilter);
  }
  changeCouponStaus(event,coupon_id){
    this.isLoaderAdmin = true;
    if(event.checked == true){
      this.couponCodeStatus = 'Active';
    }
    else if(event.checked == false){
      this.couponCodeStatus = 'Inactive';
    }
    this.AdminService.changeCouponStaus(this.couponCodeStatus,coupon_id).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Status Updated", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        
    this.getAllCouponCode(this.couponListFilter);
    this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.isLoaderAdmin = false;
      }
    })
  }

  getCateServiceList(){
    this.isLoaderAdmin = true;
    this.AdminService.getCateServiceList().subscribe((response:any) => {
      if(response.data == true){
        this.categoryServiceList = response.response
        console.log(this.categoryServiceList);
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.categoryServiceList = ''
        this.isLoaderAdmin = false;
      }
    })
  }
  fnCheckService(event,serviceId){
    if(event == true){
      this.selectedService.push(serviceId) 
    }else if(event == false){
      const index = this.selectedService.indexOf(serviceId);
      this.selectedService.splice(index, 1);
    }
    console.log(this.selectedService);
  }

  fnNewCouponCode(){
    this.couponCodeListing = false;
    this.addNewCouponCode = true;
    this.getCateServiceList();
  }
  
}
