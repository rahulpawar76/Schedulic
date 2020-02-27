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
  animal: any;
  couponListFilter: any;
  couponCodeListing: boolean = true;
  addNewCouponCode: boolean = false;
  allCouponCode: any;
  createdCouponCodeData: any;
  businessId : any;
  valid_from : any;
  valid_till : any;
  
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
    this.AdminService.getAllCouponCode(couponListFilter).subscribe((response:any) => {
      if(response.data == true){
        this.allCouponCode = response.response
        this.dtTrigger.next();
      }
      else if(response.data == false){
        this.allCouponCode = ''
      }
    })
  }

  fnCreateCouponSubmit(){
    if(this.discountCoupon.valid){
      alert("Valid");
      this.valid_from = this.discountCoupon.get('valid_from').value;
      this.valid_till = this.discountCoupon.get('valid_till').value;
      this.valid_from=this.datePipe.transform(new Date(this.valid_from),"yyyy-MM-dd")
      this.valid_till=this.datePipe.transform(new Date(this.valid_till),"yyyy-MM-dd")
      this.createdCouponCodeData = {
        "business_id" : this.businessId,
        "coupon_name" : this.discountCoupon.get('coupan_name').value,
        "coupon_code" : this.discountCoupon.get('coupon_code').value,
        "coupon_max_redemptions" : this.discountCoupon.get('max_redemption').value,
        "valid_from" : this.discountCoupon.get('valid_from').value,
        "valid_till" : this.discountCoupon.get('valid_till').value,
        "discount_type" : this.discountCoupon.get('discount_type').value,
        "discount" : this.discountCoupon.get('discount_value').value,
        "services" : [1,2,3]
      }
      this.createNewCouponCode(this.createdCouponCodeData);
    }
  }

  createNewCouponCode(createdCouponCodeData){
    alert("Go to API");
    this.AdminService.createNewCouponCode(createdCouponCodeData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Business Created", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
      }
      else if(response.data == false){
        
      }
    })
  }

  fnStatusChange(status){
    this.couponListFilter = status;
    this.getAllCouponCode(this.couponListFilter);
  }

  fnNewCouponCode(){
    this.couponCodeListing = false;
    this.addNewCouponCode = true;
  }
  
}
