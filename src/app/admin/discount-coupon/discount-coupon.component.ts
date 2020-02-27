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
  allCouponCode: any;
  

  constructor(
    
    private AdminService: AdminService,
  ) {
    
    localStorage.setItem('isBusiness', 'false');
   }

  ngOnInit() {
    this.getAllCouponCode();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  getAllCouponCode(){
    this.AdminService.getAllCouponCode().subscribe((response:any) => {
      if(response.data == true){
        this.allCouponCode = response.response
        this.dtTrigger.next();
      }
      else if(response.data == false){
        this.allCouponCode = ''
      }
    })
  }

}
