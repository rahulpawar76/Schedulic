import { Component, OnInit,Inject } from '@angular/core';
import { AdminService } from '../_services/admin-main.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DatePipe} from '@angular/common';
import { AppComponent } from '@app/app.component'
import { environment } from '@environments/environment';

export interface DialogData {
  animal: string;
 
 
}

@Component({
  selector: 'app-discount-coupon',
  templateUrl: './discount-coupon.component.html',
  styleUrls: ['./discount-coupon.component.scss'],
  providers: [DatePipe]
})


export class DiscountCouponComponent implements OnInit {
  adminSettings : boolean = false;
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
  categoryServiceList : any = '';
  
  categoryServiceCheckCatId: any = [];
  categoryServiceChecksubCatId: any = [];
  categoryServiceCheckServiceId: any = [];
  categoryServiceListTemp: any=[];

  minDate = new Date();
  discountCoupon: FormGroup;


  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  search:any;
  
  current_page : any;
  first_page_url : any;
  last_page : any;
  last_page_url : any;
  next_page_url : any;
  prev_page_url : any;
  discountType: any = 'P';
  path : any;
  searchService: any;
  searchedServices : boolean = false;
  minTillDate : any = new Date();
  discountApiUrl:any =  `${environment.apiUrl}/discount-coupon-list`;
  diccount_error:boolean=false;

  
  constructor(
    private AdminService: AdminService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private appComponent : AppComponent,
  ) {
    localStorage.setItem('isBusiness', 'false');
    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
      
  }
  //this.appComponent.settingsModule(this.adminSettings);
   }

  ngOnInit() {
    this.couponListFilter = 'All';
    this.getAllCouponCode();
    this.discountCoupon = this._formBuilder.group({
      coupan_name : ['', [Validators.required,Validators.maxLength(15)]],
      max_redemption : ['', [Validators.required,Validators.pattern(this.onlynumeric)]],
      coupon_code : ['', [Validators.required,Validators.maxLength(15)]],
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

  Search(value){
    this.search = value
    this.discountApiUrl= `${environment.apiUrl}/discount-coupon-list`;
    this.getAllCouponCode();
  }

  getAllCouponCode(){

    this.isLoaderAdmin = true;
    let requestObject = {
      'business_id': this.businessId,
      'filter' : this.couponListFilter,   
      'search' : this.search   
    };

    this.AdminService.getAllCouponCode(this.discountApiUrl,requestObject).subscribe((response:any) => {
      if(response.data == true){
        
        this.current_page = response.response.current_page;
        this.first_page_url = response.response.first_page_url;
        this.last_page = response.response.last_page;
        this.last_page_url = response.response.last_page_url;
        this.next_page_url = response.response.next_page_url;
        this.prev_page_url = response.response.prev_page_url;
        this.path = response.response.path;

        this.allCouponCode = response.response.data;

        
        this.allCouponCode.forEach((element) => {
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
   
  
  navigateTo(api_url){
    this.discountApiUrl=api_url;
    if(this.discountApiUrl){
      this.getAllCouponCode();
    }
  }

  navigateToPageNumber(index){
    this.discountApiUrl=this.path+'?page='+index;
    if(this.discountApiUrl){
      this.getAllCouponCode();
    }
  }
  
  arrayOne(n: number): any[] {
    return Array(n);
  }

  discount_check(){
    var discount_type = this.discountCoupon.get('discount_type').value;
    var discount_value = this.discountCoupon.get('discount_value').value; 

    if(discount_type=='P' && discount_value > 100){
      this.diccount_error = true;
    }else{
      this.diccount_error = false;
    }
  }

  fnCreateCouponSubmit(){
    if(this.discountCoupon.valid){
      this.valid_from = this.discountCoupon.get('valid_from').value;
      this.valid_till = this.discountCoupon.get('valid_till').value;
      this.valid_from=this.datePipe.transform(new Date(this.valid_from),"yyyy-MM-dd")
      this.valid_till=this.datePipe.transform(new Date(this.valid_till),"yyyy-MM-dd")

      var discount_type = this.discountCoupon.get('discount_type').value;
      var discount_value = this.discountCoupon.get('discount_value').value; 
      if(discount_type=='P' && discount_value > 100){
        this.diccount_error = true;
        return;
      }else{
        this.diccount_error = false;
      }

      this.createdCouponCodeData = {
        "business_id" : this.businessId,
        "coupon_name" : this.discountCoupon.get('coupan_name').value,
        "coupon_code" : this.discountCoupon.get('coupon_code').value,
        "coupon_max_redemptions" : this.discountCoupon.get('max_redemption').value,
        "valid_from" : this.valid_from,
        "valid_till" : this.valid_till,
        "discount_type" : this.discountCoupon.get('discount_type').value,
        "discount" : this.discountCoupon.get('discount_value').value,
        "services" : this.categoryServiceCheckServiceId
      }
      if(this.categoryServiceCheckServiceId != ''){
        this.createNewCouponCode(this.createdCouponCodeData);
      }else if(this.categoryServiceCheckServiceId == ''){
        this._snackBar.open("Select At Lease 1 Service.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    }else{
      this.discountCoupon.get("coupan_name").markAsTouched();
      this.discountCoupon.get("coupon_code").markAsTouched();
      this.discountCoupon.get("max_redemption").markAsTouched();
      this.discountCoupon.get("discount_type").markAsTouched();
      this.discountCoupon.get('valid_from').markAsTouched()
      this.discountCoupon.get('valid_till').markAsTouched()
      this.discountCoupon.get("discount_value").markAsTouched();
    }
    
  }
  fnChangeDiscountType(event){
    this.discountType = event.value
  }
  createNewCouponCode(createdCouponCodeData){
    this.isLoaderAdmin = true;
    this.AdminService.createNewCouponCode(createdCouponCodeData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.couponCodeListing = true;
        this.discountCoupon.reset();
        this.getAllCouponCode();
        this.addNewCouponCode = false;
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.isLoaderAdmin = false;
        
      }
    })
  }

  fnStatusChange(status){
    this.couponListFilter = status;
    this.discountApiUrl= `${environment.apiUrl}/discount-coupon-list`;
    this.getAllCouponCode();
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
        this._snackBar.open("Status Updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        
    this.getAllCouponCode();
    this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.isLoaderAdmin = false;
      }
    })
  }

  getCateServiceList(){
    let requestObject = {
      'business_id': this.businessId,
      'search' : ''
  };
    this.isLoaderAdmin = true;
    this.AdminService.getCateServiceList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.categoryServiceList = response.response;
        
        this.categoryServiceList.forEach(element => {
          element.is_selected  = false;
          element.subcategory.forEach(subelement => {
            subelement.is_selected = false;
            subelement.services.forEach(serviceselement => {
              serviceselement.is_selected = false;
            });
          });
        });
        this.categoryServiceListTemp=this.categoryServiceList;

        this.isLoaderAdmin = false;
      }else if(response.data == false){
        this.categoryServiceList = []
        this.categoryServiceListTemp = [];

        this.isLoaderAdmin = false;
      }
    })
  }
  
  checkServie(event,type,index,sub_index=null,service_index=null){

    if(type=='category'){
        if(event.checked == true) {  this.categoryServiceList[index].is_selected=true; }else{ this.categoryServiceList[index].is_selected=false; }

        this.categoryServiceList[index].subcategory.forEach(subelement => {
          if(event.checked == true) {  
            subelement.is_selected=true;
           }else{ 
            subelement.is_selected=false;
          }
          subelement.services.forEach(serviceselement => {
            if(event.checked == true) {  serviceselement.is_selected=true; }else{ serviceselement.is_selected=false; }
          });
        });
    }
    
    if(type=='subcategory'){

      if(event.checked == true) { 
         this.categoryServiceList[index].subcategory[sub_index].is_selected=true;
      }else{ 
        this.categoryServiceList[index].subcategory[sub_index].is_selected=false;
      }

      this.categoryServiceList[index].subcategory[sub_index].services.forEach(serviceselement => {
        if(event.checked == true) {  serviceselement.is_selected=true; }else{ serviceselement.is_selected=false; }
      });

      var category_i = 0;

      this.categoryServiceList[index].subcategory.forEach(element => {
          if(element.is_selected == true){
            category_i++;
          }
      });

      if(category_i == this.categoryServiceList[index].subcategory.length){
        this.categoryServiceList[index].is_selected = true;
      }else{
        this.categoryServiceList[index].is_selected = false;
      }
      
      
      
    }

    if(type=='service'){

      if(event.checked == true) { 
        this.categoryServiceList[index].subcategory[sub_index].services[service_index].is_selected=true;
      }else{ 
        this.categoryServiceList[index].subcategory[sub_index].services[service_index].is_selected=false;
      }

      var subcategory_i = 0;

      this.categoryServiceList[index].subcategory[sub_index].services.forEach(serviceselement => {
        if(serviceselement.is_selected==true){
          subcategory_i++;
        }
      });
      
      if(subcategory_i == this.categoryServiceList[index].subcategory[sub_index].services.length){
        this.categoryServiceList[index].subcategory[sub_index].is_selected = true;
      }else{
        this.categoryServiceList[index].subcategory[sub_index].is_selected = false;
      }

      
      var category_i = 0;
      this.categoryServiceList[index].subcategory.forEach(element => {
          if(element.is_selected == true){
            category_i++;
          }
      });

      if(category_i == this.categoryServiceList[index].subcategory.length){
        this.categoryServiceList[index].is_selected = true;
      }else{
        this.categoryServiceList[index].is_selected = false;
      }
    }

   
    // this.categoryServiceCheckCatId = [];
    // this.categoryServiceChecksubCatId = [];
    this.categoryServiceCheckServiceId = [];

    this.categoryServiceList.forEach(element => {

      // if(element.is_selected==true){
      //   this.categoryServiceCheckCatId.push({'id':element.id});
      // }

      element.subcategory.forEach(subelement => {
        // if(subelement.is_selected == true){
        //   this.categoryServiceChecksubCatId.push({'id':subelement.id})
        // }
        subelement.services.forEach(serviceselement => {
          if(subelement.is_selected == true){
            this.categoryServiceCheckServiceId.push(serviceselement.id)
          }
        });
      });

    });

    // console.log(this.categoryServiceCheckCatId);
    // console.log(this.categoryServiceChecksubCatId);
    console.log(this.categoryServiceCheckServiceId);

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

  fnCancelNewCoupon(){
    this.couponCodeListing = true;
    this.addNewCouponCode = false;
  }
  fnCouponDetails(index, CouponId){
    const dialogRef = this.dialog.open(DialogCouponDetails, {
      height: '700px',
  
      data :{fulldata : this.allCouponCode[index], couponId : CouponId}
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed.');
      this.animal = result;
      this.getAllCouponCode();
     });

  }

    fnsearchService(event){

      this.categoryServiceListTemp=[];
      console.log(event.target.value);

      this.categoryServiceList.forEach(element => {
        if(element.category_title && element.category_title.toLowerCase().includes(event.target.value.toLowerCase())){
          this.categoryServiceListTemp.push(element);
          console.log(element.category_title);
          return;
        }
        element.subcategory.forEach(subelement => {
          if(subelement.sub_category_name && subelement.sub_category_name.toLowerCase().includes(event.target.value.toLowerCase())){
            if(!this.categoryServiceListTemp.some((item) => item.id == element.id)){
              this.categoryServiceListTemp.push(element);
            }
            console.log(subelement.sub_category_name);
            return;
          }
          subelement.services.forEach(serviceselement => {
            if(serviceselement.service_name && serviceselement.service_name.toLowerCase().includes(event.target.value.toLowerCase())){
              if(!this.categoryServiceListTemp.some((item) => item.id == element.id)){
                this.categoryServiceListTemp.push(element);
              }
              console.log(serviceselement.service_name);
              return;
            }
          });
        });
      });

    }

  
}

@Component({
  selector: 'coupon-details',
  templateUrl: '../_dialogs/coupon-details.html',
})
export class DialogCouponDetails {
  detailsData: any;
  isLoaderAdmin:any;
  couponCodeStatus:any;
  couponId:any;
  couponCodeDetail:any;
  
constructor(
  public dialogRef: MatDialogRef<DialogCouponDetails>,
  private AdminService: AdminService,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {

    this.detailsData =  this.data.fulldata;
    this.couponId = this.data.couponId
    console.log(this.detailsData);
    this.getServiceListForCoupon();
  }

onNoClick(): void {
  this.dialogRef.close();
}

getServiceListForCoupon(){
  this.isLoaderAdmin = true;
  this.AdminService.getServiceListForCoupon(this.couponId).subscribe((response:any) => {
    if(response.data == true){
        this.couponCodeDetail = response.response
        console.log(this.couponCodeDetail);
      this.isLoaderAdmin = false;
    }
    else if(response.data == false){
      this.isLoaderAdmin = false;
    }
  })
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
      this._snackBar.open("Status Updated.", "X", {
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


}
