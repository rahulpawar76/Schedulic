import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-discount-coupon',
  templateUrl: './discount-coupon.component.html',
  styleUrls: ['./discount-coupon.component.scss']
})
export class DiscountCouponComponent implements OnInit {
  dtOptions: any = {};
  animal: any;
  couponCodeListing: boolean = true;
  addNewCouponCode: boolean = false;
  constructor() {
    localStorage.setItem('isBusiness', 'false');
   }


  ngOnInit() {
  }

  fnNewCouponCode(){
    this.couponCodeListing = false;
    this.addNewCouponCode = true;
  }
}
