import { Component, OnInit } from '@angular/core';
import { AdminService } from '../_services/admin-main.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-discount-coupon',
  templateUrl: './discount-coupon.component.html',
  styleUrls: ['./discount-coupon.component.scss']
})


export class DiscountCouponComponent implements OnInit {
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  animal: any;
  couponListFilter: any;
  couponCodeListing: boolean = true;
  addNewCouponCode: boolean = false;
  allCouponCode: any;
  
  discountCoupon: FormGroup;


  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/
 
  
  constructor(
    
    private AdminService: AdminService,
    private _formBuilder: FormBuilder,
  ) {
    localStorage.setItem('isBusiness', 'false');
   }

  ngOnInit() {
    this.couponListFilter = 'All';
    this.getAllCouponCode(this.couponListFilter);

    this.discountCoupon = this._formBuilder.group({
      coupan_name : ['', Validators.required],
      max_redemption : ['', [Validators.required,Validators.pattern(this.onlynumeric)]],
      coupan_code : ['', Validators.required],
      valid_form : ['', Validators.required],
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

  fnStatusChange(status){
    this.couponListFilter = status;
    this.getAllCouponCode(this.couponListFilter);


    
  }

  fnNewCouponCode(){
    this.couponCodeListing = false;
    this.addNewCouponCode = true;
  }
  
}
