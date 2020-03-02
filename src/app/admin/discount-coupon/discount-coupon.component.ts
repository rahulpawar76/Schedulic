import { Component, OnInit } from '@angular/core';
import { AdminService } from '../_services/admin-main.service';
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
  filter: any;
  couponCodeListing: boolean = true;
  addNewCouponCode: boolean = false;
  allCouponCode: any;
  

  constructor(
    private AdminService: AdminService,
  ) {
    localStorage.setItem('isBusiness', 'false');
   }

  ngOnInit() {
    this.filter = 'All';
    this.getAllCouponCode(this.filter);
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  getAllCouponCode(filter){
    this.AdminService.getAllCouponCode(filter).subscribe((response:any) => {
      if(response.data == true){
        this.allCouponCode = response.response
        this.dtTrigger.next();
      }
      else if(response.data == false){
        this.allCouponCode = ''
      }
    })
  }
  statusChange(status){
    this.filter = status;
    this.getAllCouponCode(this.filter);
  }

  fnNewCouponCode(){
    this.couponCodeListing = false;
    this.addNewCouponCode = true;
  }
}
