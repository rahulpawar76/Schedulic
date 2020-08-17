import { Component, OnInit,Inject } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { AdminService } from '../_services/admin-main.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { D } from '@angular/cdk/keycodes';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AppComponent } from '@app/app.component';
import { AuthenticationService } from '@app/_services';

export interface DialogData {
  animal: string;
}
@Component({
  selector: 'app-appointment-live',
  templateUrl: './appointment-live.component.html',
  styleUrls: ['./appointment-live.component.scss'],
  providers: [DatePipe]
})
export class AppointmentLiveComponent implements OnInit {
 
  businessId: any;
  animal: string;
  isLoaderAdmin : boolean = false;
  pendingAppointments : any=[];
  notAssignedAppointments : any=[];
  onTheWayAppointments : any=[];
  workStartedAppointments : any=[];
  staffList:any;
  todayDate:any;
  todayTime:any;
  todayDays:any;
  todayPeriod:any;
  CategoryList :any = [];
  ServiceList :any = [];
  StaffList:any = [];

  booking_date:any;
  settingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;

  pendingApiUrl:any =  `${environment.apiUrl}/get-pending-live`;
  
  current_page_pending:any;
  first_page_url_pending:any;
  last_page_pending:any;
  last_page_url_pending:any;
  next_page_url_pending:any;
  prev_page_url_pending:any;
  path_pending:any;
  notassignApiUrl:any =  `${environment.apiUrl}/get-notassign-live`;
  
  current_page_notassign:any;
  first_page_url_notassign:any;
  last_page_notassign:any;
  last_page_url_notassign:any;
  next_page_url_notassign:any;
  prev_page_url_notassign:any;
  path_notassign:any;
  onthewayApiUrl:any =  `${environment.apiUrl}/get-ontheway-live`;
  
  current_page_ontheway:any;
  first_page_url_ontheway:any;
  last_page_ontheway:any;
  last_page_url_ontheway:any;
  next_page_url_ontheway:any;
  prev_page_url_ontheway:any;
  path_ontheway:any;

  workstartApiUrl:any =  `${environment.apiUrl}/get-workstart-live`;
  
  current_page_workstart:any;
  first_page_url_workstart:any;
  last_page_workstart:any;
  last_page_url_workstart:any;
  next_page_url_workstart:any;
  prev_page_url_workstart:any;
  path_workstart:any;
  inStoreTabName:any = 'service';
  newCustomer:FormGroup;
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  service_index:any;
  staff_id:any;
  cartArr:any = [];
  service_id:any;
  categoryServiceCheckServiceId = [];
  totalCost = 0;
  note_description='';
  paymentData:any;

    constructor(
    private AdminService: AdminService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private _formBuilder:FormBuilder,
    private _snackBar: MatSnackBar,
  ) { 
    
    
    localStorage.setItem('isBusiness', 'true');
    this.newCustomer = this._formBuilder.group({
      cus_name : ['', Validators.required],
      cus_email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)]],
      cus_mobile : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
    });
  }

  ngOnInit() {
    if(localStorage.getItem('business_id')){
      this.businessId=localStorage.getItem('business_id');
    }
    this.fnGetSettings();
    this.getPendingAppointments();
    this.getNotAssignedAppointments();
    this.getOnThewayAppointments();
    this.getWorkStartedAppointments();
    
    this.todayDate = this.datePipe.transform(new Date(),"MMMM d");
    this.todayTime = this.datePipe.transform(new Date(),"h:mm ");
    this.todayPeriod = this.datePipe.transform(new Date(),"a");
    this.todayDays = this.datePipe.transform(new Date(),"EEEE");

    this.fnGetCategory();
    this.fngetService();

    
  }

  fnGetSettings(){
    let requestObject = {
      "business_id" : this.businessId
      };

    this.AdminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr = response.response;
        this.currencySymbol = this.settingsArr.currency;
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        this.currencySymbolFormat = this.settingsArr.currency_format;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
      },(err) =>{
        console.log(err)
      })
  }

  getPendingAppointments(){

    this.AdminService.getPendingAppointments(this.pendingApiUrl).subscribe((response:any) => {
      if(response.data == true){

        this.pendingAppointments = response.response.data;
        
        this.current_page_pending = response.response.current_page;
        this.first_page_url_pending = response.response.first_page_url;
        this.last_page_pending = response.response.last_page;
        this.last_page_url_pending = response.response.last_page_url;
        this.next_page_url_pending = response.response.next_page_url;
        this.prev_page_url_pending = response.response.prev_page_url;
        this.path_pending = response.response.path;


        this.pendingAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.pendingAppointments = [];
      }
    });
  }

  
  navigateTo_pending(api_url){
    this.pendingApiUrl=api_url;
    if(this.pendingApiUrl){
      this.getPendingAppointments();
    }
  }

  navigateToPageNumber_pending(index){
    this.pendingApiUrl=this.path_pending+'?page='+index;
    if(this.pendingApiUrl){
      this.getPendingAppointments();
    }
  }
  
  arrayOne_pending(n: number): any[] {
    return Array(n);
  }

  
  getNotAssignedAppointments(){

    this.AdminService.getNotAssignedAppointments(this.notassignApiUrl).subscribe((response:any) => {
      if(response.data == true){

        this.notAssignedAppointments = response.response.data;
        
        this.current_page_notassign = response.response.current_page;
        this.first_page_url_notassign = response.response.first_page_url;
        this.last_page_notassign = response.response.last_page;
        this.last_page_url_notassign = response.response.last_page_url;
        this.next_page_url_notassign = response.response.next_page_url;
        this.prev_page_url_notassign = response.response.prev_page_url;
        this.path_notassign = response.response.path;

        this.notAssignedAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
        });
        
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.notAssignedAppointments = [];
      }
    });
  }

  navigateTo_notassign(api_url){
    this.notassignApiUrl=api_url;
    if(this.notassignApiUrl){
      this.getNotAssignedAppointments();
    }
  }

  navigateToPageNumber_notassign(index){

    this.notassignApiUrl=this.path_notassign+'?page='+index;
    if(this.notassignApiUrl){
      this.getNotAssignedAppointments();
    }
  }
  
  arrayOne_notassign(n: number): any[] {
    return Array(n);
  }



  getOnThewayAppointments(){
    this.AdminService.getOnThewayAppointments(this.onthewayApiUrl).subscribe((response:any) => {
      if(response.data == true){
        this.onTheWayAppointments = response.response;
        
        this.onTheWayAppointments = response.response.data;
        
        this.current_page_ontheway = response.response.current_page;
        this.first_page_url_ontheway = response.response.first_page_url;
        this.last_page_ontheway = response.response.last_page;
        this.last_page_url_ontheway = response.response.last_page_url;
        this.next_page_url_ontheway = response.response.next_page_url;
        this.prev_page_url_ontheway = response.response.prev_page_url;
        this.path_ontheway = response.response.path;

        this.onTheWayAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
          
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.onTheWayAppointments = [];
      }
    })
  }

  navigateTo_ontheway(api_url){
    this.onthewayApiUrl=api_url;
    if(this.onthewayApiUrl){
      this.getOnThewayAppointments();
    }
  }

  navigateToPageNumber_ontheway(index){

    this.onthewayApiUrl=this.path_ontheway+'?page='+index;
    if(this.onthewayApiUrl){
      this.getOnThewayAppointments();
    }
  }
  
  arrayOne_ontheway(n: number): any[] {
    return Array(n);
  }


  getWorkStartedAppointments(){

    this.AdminService.getWorkStartedAppointments(this.workstartApiUrl).subscribe((response:any) => {
      if(response.data == true){
     //   this.workStartedAppointments = response.response;

        this.workStartedAppointments = response.response.data;
        
        this.current_page_workstart = response.response.current_page;
        this.first_page_url_workstart = response.response.first_page_url;
        this.last_page_workstart = response.response.last_page;
        this.last_page_url_workstart = response.response.last_page_url;
        this.next_page_url_workstart = response.response.next_page_url;
        this.prev_page_url_workstart = response.response.prev_page_url;
        this.path_workstart = response.response.path;

        this.workStartedAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
          
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.workStartedAppointments = [];
      }
    })
  }

  navigateTo_workstart(api_url){
    this.workstartApiUrl=api_url;
    if(this.workstartApiUrl){
      this.getWorkStartedAppointments();
    }
  }

  navigateToPageNumber_workstart(index){
    this.workstartApiUrl=this.path_workstart+'?page='+index;
    if(this.workstartApiUrl){
      this.getWorkStartedAppointments();
    }
  }
  
  arrayOne_workstart(n: number): any[] {
    return Array(n);
  }
  
  fnChangeSubTab(tabName){
    this.inStoreTabName = tabName;
  }



  fnOpenDetails(index){
    
    const dialogRef = this.dialog.open(PendingAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.pendingAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getPendingAppointments();
     
      });
  }

  fnAddNote(index){
    
    const dialogRef = this.dialog.open(addPOSBookingNoteDialog, {
      width: '500px',
     });
      dialogRef.afterClosed().subscribe(result => {
       this.note_description = result;
      });
  }

  fnPaymentMode(pos_pdf_type){
    
    const dialogRef = this.dialog.open(paymentModeDialog, {
      width: '500px',
     });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
       if(result){
        this.paymentData = result;
        this.fnplaceOrder(pos_pdf_type);
       }
    });

  }

  fnOpenNotAssignedDetails(index){
    
    const dialogRef = this.dialog.open(NotAssignedAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.notAssignedAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getNotAssignedAppointments();
      
      });
  }

  
  fnOpenOnTheWayDetails(index){
    
    const dialogRef = this.dialog.open(OnTheWayAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.onTheWayAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getOnThewayAppointments();
      
      });
  }
  
  fnOpenWorkStartedDetails(index){
   
    const dialogRef = this.dialog.open(WorkStartedAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.workStartedAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getWorkStartedAppointments();
      
      });
  }

  fnGetCategory(){

    let requestObject = {
      "business_id" : localStorage.getItem('business_id')
    };

    this.AdminService.getGetCategory(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.CategoryList = response.response;
      }
    });
  }

  fngetService(category_id=''){
  
    let  requestObject = {}

    requestObject = {
      "category_id" : category_id==''?'all':category_id, 
      "business_id" : localStorage.getItem('business_id')
    };
    this.AdminService.getService(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ServiceList = response.response;
      }
    });
  
  }

  fngetStaff(service_id,index){

    let requestObject = {
      "service_id" : service_id, 
      "status" : "all", 
      "business_id" : localStorage.getItem('business_id')
    };

    this.service_index = index;
    this.service_id = service_id;

    this.AdminService.getStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.StaffList = response.response;
      }
    });

  }

  fnFilterStaff(event){
    
    var requestObject = {
      "service_id" : this.service_id, 
      "business_id" : localStorage.getItem('business_id'),
      'status' : event
    };

    this.AdminService.getStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.StaffList = response.response;
        console.log(this.StaffList);
      }
    });

  }

  fnAssignStaff(staff_id,staff_index){

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    var current_date = yyyy + '-' + mm  + '-' + dd;

    this.staff_id = staff_id;
    let index = false;
    if(this.categoryServiceCheckServiceId.length == 0){
     
      this.categoryServiceCheckServiceId.push(this.ServiceList[this.service_index].id);
   
    }else{

      index = this.categoryServiceCheckServiceId.includes(this.ServiceList[this.service_index].id);
      var my_index = this.categoryServiceCheckServiceId.indexOf(this.ServiceList[this.service_index].id);
    
      if(index==false){
        this.categoryServiceCheckServiceId.push(this.ServiceList[this.service_index].id);
      }
      
      if(index==true){
        this.cartArr.splice(my_index, 1);
        index=false;
      }

    }
    
    if(index==false){

      this.cartArr.push({
          "id":   this.ServiceList[this.service_index].id,
          "category_id":  this.ServiceList[this.service_index].category_id,
          "sub_category_id":  this.ServiceList[this.service_index].sub_category_id,
          "service_name":   this.ServiceList[this.service_index].service_name,
          "service_description":  this.ServiceList[this.service_index].service_description,
          "service_image":  this.ServiceList[this.service_index].service_image,
          "service_cost": this.ServiceList[this.service_index].service_cost,
          "service_time": this.ServiceList[this.service_index].service_time,
          "service_unit":   this.ServiceList[this.service_index].service_unit,
          "status":   this.ServiceList[this.service_index].status,
          "private_status":   this.ServiceList[this.service_index].private_status,
          "business_id": localStorage.getItem('business_id'),
          "created_at": this.ServiceList[this.service_index].created_at,
          "updated_at": this.ServiceList[this.service_index].updated_at,
          "deleted_at": this.ServiceList[this.service_index].deleted_at,
          "count": 1,
          "subtotal": this.ServiceList[this.service_index].service_cost,
          "totalCost": this.ServiceList[this.service_index].service_cost,
          "appointmentDate": current_date,
          "appointmentTimeSlot": this.StaffList[staff_index].from,
          "assignedStaff" : staff_id,
          "StaffName" : this.StaffList[staff_index].name
      });

      
      this.cartArr.forEach(element => {
        this.totalCost = this.totalCost+parseInt(element.subtotal);
      });

    }

    this.fngetService();
    this.StaffList = [];
    this.service_index = null;
  }

  fncartUpdate(Type,index){

    let cartdata = this.cartArr[index];
    if(Type=='minus'){
       this.cartArr[index].count = parseInt(cartdata.count)-1==0?1:parseInt(cartdata.count)-1;
    }else{
      this.cartArr[index].count = parseInt(cartdata.count)+1;
    }
    
    this.cartArr[index].subtotal = this.cartArr[index].count * this.ServiceList[index].service_cost;
    this.cartArr[index].totalCost = this.cartArr[index].count * this.ServiceList[index].service_cost;

    this.totalCost = 0;
    this.cartArr.forEach(element => {
      this.totalCost = this.totalCost+parseInt(element.subtotal);
    });

  }

  fnDeleteItem(elem){
    this.cartArr.splice(elem, 1);
    this.totalCost = 0;
    this.cartArr.forEach(element => {
      this.totalCost = this.totalCost+parseInt(element.subtotal);
    });

  }

  fnplaceOrder(pos_pdf_type ){

    if(this.newCustomer.invalid){
      this.newCustomer.get('cus_email').markAsTouched();
      this.newCustomer.get('cus_mobile').markAsTouched();
      this.newCustomer.get('cus_name').markAsTouched();
      return false;
    }
    
    this.isLoaderAdmin = true;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    var payment_datetime = yyyy + '-' + mm  + '-' + dd;

    var requestObject = {
      "business_id" : localStorage.getItem('business_id'),
      'serviceInfo' : this.cartArr,
      "customer_name": this.newCustomer.get('cus_name').value,
      "customer_phone": this.newCustomer.get('cus_mobile').value,
      "customer_email": this.newCustomer.get('cus_email').value,
      "created_by": "admin",
      "subtotal": this.totalCost,
      "reference_id": "",
      "transaction_id": "",
      "payment_datetime": payment_datetime,
      "nettotal": this.totalCost,
      "payment_method": this.paymentData ? this.paymentData.payment_method : 'cash',
      "order_date": payment_datetime,
      "booking_notes" : this.note_description,
      'pos_pdf_type' : pos_pdf_type  
    };
  

    this.AdminService.placeOrder(requestObject).subscribe((response:any) => {
      
      if(response.data == true){
        this.cartArr = [];
        this.newCustomer.reset();
        this.totalCost = 0;
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }

      this.isLoaderAdmin = false;

    });

  }
}


@Component({
  selector: 'online-payment-mode',
  templateUrl: '../_dialogs/online-payment-mode.html',
    providers: [DatePipe]
})
export class paymentModeDialog {

  res = {
    'payment_method' : 'cash',
    'reference_id' : '',
    'transaction_id' : '',
  };
constructor(
  public dialogRef: MatDialogRef<paymentModeDialog>,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    

}
  onNoClick(): void {
    this.dialogRef.close();
  }

  fnPaymentMethod(payment_method): void {
     this.res = {
      'payment_method' : payment_method,
      'reference_id' : '',
      'transaction_id' : '',
    };
  }

  Confirm(){
    this.dialogRef.close(this.res);
  }

}

@Component({
  selector: 'add-booking-pos-note',
  templateUrl: '../_dialogs/add-booking-pos-note.html',
    providers: [DatePipe]
})
export class addPOSBookingNoteDialog {
  createNewNote: FormGroup;
  formSettingPage:boolean = false;
  appointmentDetails = {
  bookingNotes : ''
  };

  settingsArr:any =[];

constructor(
  public dialogRef: MatDialogRef<addPOSBookingNoteDialog>,
  private AdminService: AdminService,
  private _snackBar: MatSnackBar,
  private datePipe: DatePipe,
  private _formBuilder:FormBuilder,
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createNewNote = this._formBuilder.group({
      note_description : ['', Validators.required],
    });

  }
  onNoClick(): void {
    this.dialogRef.close('');
  }
  
  onAdd(): void {
    this.dialogRef.close(this.createNewNote.get('note_description').value);
  }
}

@Component({
  selector: 'pending-appointment-details',
  templateUrl: '../_dialogs/pending-appointment-details.html',
    providers: [DatePipe]
})
export class PendingAppointmentDetailsDialog {
//notes:any;
detailsData: any;
activityLog: any=[];
formSettingPage:boolean = false;
appointmentDetails = {
  bookingNotes : ''
};
settingsArr:any =[];

constructor(
  public dialogRef: MatDialogRef<PendingAppointmentDetailsDialog>,
  private AdminService: AdminService,
  private _snackBar: MatSnackBar,
  private datePipe: DatePipe,
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
    this.fnGetActivityLog(this.detailsData.id);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  fnGetActivityLog(orderItemId){
    let requestObject = {
      "order_item_id":orderItemId
    };
    this.appointmentDetails.bookingNotes = this.detailsData.booking_notes;

    this.AdminService.getActivityLog(requestObject).subscribe((response:any) => {
      if(response.data == true){
        console.log(response.response);
        this.activityLog=response.response;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.activityLog=[];
      }
    })
  }

  fnRescheduleAppointment(){
    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
    var is_reseduling = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.min_reseduling_time);

    if(is_reseduling==true){
        this._snackBar.open('Minimum notice required for rescheduleing an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }

    const dialogRef = this.dialog.open(RescheduleAppointment, {
      height: '700px',
     data : {appointmentDetails: this.detailsData}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  fnConfirmAppointment(){
      let requestObject = {
       "order_item_id":JSON.stringify(this.detailsData.id),
       "status":"CNF"
      };
      this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Confirmed.", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.dialogRef.close();
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
      })
  }


  fnCancelAppointment(){

    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
    var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.cancellation_buffer_time);

    if(is_cancel==true){
        this._snackBar.open('Minimum notice required for Cancellation an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }
    

    let requestObject = {
     "order_item_id":JSON.stringify(this.detailsData.id),
     "status":"C"
    };
    this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Cancelled.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
        this.dialogRef.close();
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
      }
    })
  }

 
  fnSaveBookingNotes(orderItemId){
    
    if(this.appointmentDetails.bookingNotes == undefined || this.appointmentDetails.bookingNotes == ""){
      return false;
    }
    let requestObject = {
      "order_item_id":orderItemId,
      "booking_notes":this.appointmentDetails.bookingNotes
    };
    this.AdminService.saveBookingNotes(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Booking Notes Updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.formSettingPage = false;
      } else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
  }

  fnGetSettings(){
    let requestObject = {
      "business_id" : localStorage.getItem('business_id')
    };

    this.AdminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr = response.response;
       
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
      },(err) =>{
        console.log(err)
      });
  }

  fncompereDate(APPODate,time){
    var Now = new Date();  
    var  APPO = new Date(APPODate);
    Now.setMinutes(Now.getMinutes() + parseInt(time));

    if (Now>APPO){
      return true;
    }else if (Now<APPO){
       return false;  
    } 
  }

}


@Component({
  selector: 'interrupted-reschedule-dialog',
  templateUrl: '../_dialogs/interrupted-reschedule-dialog.html',
  providers: [DatePipe]
})
export class RescheduleAppointment {
formAppointmentRescheduleAdmin:FormGroup;
appointmentDetails:any;
businessId:any;
selectedDate:any;
selectedTimeSlot:any;
selectedStaff:any;
minDate = new Date();
timeSlotArr:any= [];
availableStaff:any= [];
constructor(
  public dialogRef: MatDialogRef<RescheduleAppointment>,
  private AdminService: AdminService,
  private datePipe: DatePipe,
  private _formBuilder: FormBuilder,
  private http: HttpClient,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.appointmentDetails =  this.data.appointmentDetails;
    this.businessId=localStorage.getItem('business_id');
    this.formAppointmentRescheduleAdmin = this._formBuilder.group({
      rescheduleDate: ['', Validators.required],
      rescheduleTime: ['', Validators.required],
      rescheduleStaff: ['', Validators.required],
      rescheduleNote: ['', Validators.required],
    });
    console.log(this.appointmentDetails);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  fnDateChange(event:MatDatepickerInputEvent<Date>) {
    console.log(this.datePipe.transform(new Date(event.value),"yyyy-MM-dd"));
    let date = this.datePipe.transform(new Date(event.value),"yyyy-MM-dd")
    this.formAppointmentRescheduleAdmin.controls['rescheduleTime'].setValue(null);
    this.formAppointmentRescheduleAdmin.controls['rescheduleStaff'].setValue(null);
    this.timeSlotArr= [];
    this.availableStaff= [];
    this.selectedDate=date;
    this.fnGetTimeSlots(date);
  }

  fnGetTimeSlots(selectedDate){
    let requestObject = {
      "business_id":this.businessId,
      "selected_date":selectedDate
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/list-availabel-timings`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
     // catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
          this.timeSlotArr=response.response;
          console.log(this.timeSlotArr);
        }
        else{
        }
      },
      (err) =>{
        console.log(err)
      })
    }
   
    fnChangeTimeSlot(selectedTimeSlot){
      console.log(selectedTimeSlot);
      this.formAppointmentRescheduleAdmin.controls['rescheduleStaff'].setValue(null);
      this.selectedTimeSlot=selectedTimeSlot;
      this.fnGetStaff(selectedTimeSlot);
    }

    fnGetStaff(selectedTimeSlot){
      let requestObject = {
        "postal_code":this.appointmentDetails.postal_code,
        "business_id":this.businessId,
        "service_id":JSON.stringify(this.appointmentDetails.service_id),
        "book_date":this.selectedDate,
        "book_time":this.selectedTimeSlot
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      this.http.post(`${environment.apiUrl}/service-staff`,requestObject,{headers:headers} ).pipe(
        map((res) => {
          return res;
        }),
        //catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
            this.availableStaff = response.response;
            console.log(JSON.stringify(this.availableStaff));
        }
        else{
          this.availableStaff.length=0;
        }
        },
        (err) =>{
          console.log(err)
        })
      }

    formRescheduleSubmit(){
      if(this.formAppointmentRescheduleAdmin.invalid){
        return false;
      }

      let requestObject = {
       "order_item_id":JSON.stringify(this.appointmentDetails.id),
       "staff_id":this.formAppointmentRescheduleAdmin.get('rescheduleStaff').value,
       "book_date":this.datePipe.transform(new Date(this.formAppointmentRescheduleAdmin.get('rescheduleDate').value),"yyyy-MM-dd"),
       "book_time":this.formAppointmentRescheduleAdmin.get('rescheduleTime').value,
       "book_notes":this.formAppointmentRescheduleAdmin.get('rescheduleNote').value
      };
      this.AdminService.rescheduleAppointment(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Rescheduled.", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
            this.dialogRef.close();
       }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
      })
    }
}


@Component({
  selector: 'notassigned-appointment-details',
  templateUrl: '../_dialogs/notassigned-appointment-details.html',
  providers:[DatePipe]
})
export class NotAssignedAppointmentDetailsDialog {
//notes:any;
detailsData: any;
businessId: any;
selectedStaff: any;
availableStaff: any=[];
activityLog: any=[];
formSettingPage:boolean = false;
appointmentDetails = {
  bookingNotes : ''
};
settingsArr:any =[];

constructor(
  public dialogRef: MatDialogRef<NotAssignedAppointmentDetailsDialog>,
  private AdminService: AdminService,
  public dialog: MatDialog,
  private datePipe: DatePipe,
  private _formBuilder: FormBuilder,
  private http: HttpClient,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    this.fnGetActivityLog(this.detailsData.id);
    this.fnGetStaff(this.detailsData.booking_date,this.detailsData.booking_time,this.detailsData.service_id,this.detailsData.postal_code);
    this. fnGetSettings();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  fnGetActivityLog(orderItemId){
    let requestObject = {
      "order_item_id":orderItemId
    };

    this.appointmentDetails.bookingNotes = this.detailsData.booking_notes;

    this.AdminService.getActivityLog(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.activityLog=response.response;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.activityLog=[];
      }
    })
  }

  fnRescheduleAppointment(){
  
    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
    var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.min_reseduling_time);
    if(is_cancel==true){
      this._snackBar.open('Minimum notice required for rescheduleing an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }

    const dialogRef = this.dialog.open(RescheduleAppointment, {
      height: '700px',
     data : {appointmentDetails: this.detailsData}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  fnGetStaff(booking_date,booking_time,serviceId,postal_code){
    let requestObject = {
      "postal_code":postal_code,
      "business_id":this.detailsData.business_id,
      "service_id":JSON.stringify(serviceId),
      "book_date":this.datePipe.transform(new Date(booking_date),"yyyy-MM-dd"),
      "book_time":booking_time
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/service-staff`,requestObject,{headers:headers} ).pipe(
    map((res) => {
      return res;
    }),
    //catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        this.availableStaff = response.response;
        console.log(JSON.stringify(this.availableStaff));
      }
      else{
        this.availableStaff.length=0;
      }
    },
    (err) =>{
      console.log(err)
    })
  }

  fnOnClickStaff(event){
    console.log(event.value);
    let requestObject = {
      "order_item_id":this.detailsData.id,
      "staff_id":event.value
      };
    this.AdminService.assignStaffToOrder(requestObject).subscribe((response:any) => 
    {
      if(response.data == true){
          this._snackBar.open("Staff Assigned.", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.dialogRef.close();
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
    },
    (err) => {
      // this.error = err;
    })
  }


  fnCancelAppointment(){

    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
    var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.cancellation_buffer_time);
    if(is_cancel==true){
      this._snackBar.open('Minimum notice required for Cancellation an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }

    let requestObject = {
     "order_item_id":JSON.stringify(this.detailsData.id),
     "status":"C"
    };
    this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Cancelled.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
        this.dialogRef.close();
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
      }
    })
  }

  fnSaveBookingNotes(orderItemId){
    
    if(this.appointmentDetails.bookingNotes == undefined || this.appointmentDetails.bookingNotes == ""){
      return false;
    }
    let requestObject = {
      "order_item_id":orderItemId,
      "booking_notes":this.appointmentDetails.bookingNotes
    };
    this.AdminService.saveBookingNotes(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Booking Notes Updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.formSettingPage = false;
      } else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
  }

  fnGetSettings(){
    let requestObject = {
      "business_id" : localStorage.getItem('business_id')
    };

    this.AdminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr = response.response;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
      },(err) =>{
        console.log(err)
      });
  }


  fncompereDate(APPODate,time){
      var Now = new Date();  
      var  APPO = new Date(APPODate);
      console.log(this.settingsArr);

      Now.setMinutes(Now.getMinutes() + parseInt(time));

      if (Now>APPO){
        return true;
      }else if (Now<APPO){
        return false;  
      } 
  }


}

@Component({
  selector: 'ontheway-appointment-details',
  templateUrl: '../_dialogs/ontheway-appointment-details.html',
})
export class OnTheWayAppointmentDetailsDialog {
  //notes:any;
  detailsData: any;
  activityLog: any=[];
  formSettingPage:boolean = false;
  appointmentDetails = {
    bookingNotes : ''
  };
  settingsArr:any =[];

  constructor(
    public dialogRef: MatDialogRef<OnTheWayAppointmentDetailsDialog>,
    private AdminService: AdminService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.detailsData =  this.data.fulldata;
      console.log(this.detailsData);
      this.fnGetActivityLog(this.detailsData.id);
      this.fnGetSettings();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  fnGetActivityLog(orderItemId){

    this.appointmentDetails.bookingNotes = this.detailsData.booking_notes;


    let requestObject = {
      "order_item_id":orderItemId
    };
    this.AdminService.getActivityLog(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.activityLog=response.response;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.activityLog=[];
      }
    })
  }

  
  fnGetSettings(){
    let requestObject = {
      "business_id" : localStorage.getItem('business_id')
    };

    this.AdminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr = response.response;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
      },(err) =>{
        console.log(err)
      });
  }

  fnRescheduleAppointment(){

    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
    var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.min_reseduling_time);
    
    if(is_cancel==true){
        this._snackBar.open('Minimum notice required for rescheduleing an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }

    

    const dialogRef = this.dialog.open(RescheduleAppointment, {
      height: '700px',
     data : {appointmentDetails: this.detailsData}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  fnConfirmAppointment(){
      let requestObject = {
       "order_item_id":JSON.stringify(this.detailsData.id),
       "status":"CO"
      };
      this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Confirmed.", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.dialogRef.close();
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
      })
  }


  fnCancelAppointment(){

    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
    var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.cancellation_buffer_time);

    if(is_cancel==true){
        this._snackBar.open('Minimum notice required for Cancellation an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }

    let requestObject = {
     "order_item_id":JSON.stringify(this.detailsData.id),
     "status":"C"
    };
    this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Cancelled.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
        this.dialogRef.close();
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
      }
    })
  }

  fnSaveBookingNotes(orderItemId){
    
    if(this.appointmentDetails.bookingNotes == undefined || this.appointmentDetails.bookingNotes == ""){
      return false;
    }
    let requestObject = {
      "order_item_id":orderItemId,
      "booking_notes":this.appointmentDetails.bookingNotes
    };
    this.AdminService.saveBookingNotes(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Booking Notes Updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.formSettingPage = false;
      } else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
  }

  fncompereDate(APPODate,time){
      
      var Now = new Date();  
      var  APPO = new Date(APPODate);
      console.log(this.settingsArr);

      Now.setMinutes(Now.getMinutes() + parseInt(time));

      if (Now>APPO){
        return true;
      }else if (Now<APPO){
        return false;  
      } 

  }

}

@Component({
  selector: 'workstarted-appointment-details',
  templateUrl: '../_dialogs/workstarted-appointment-details.html',
})
export class WorkStartedAppointmentDetailsDialog {
//notes:any;
detailsData: any;
activityLog: any=[];
formSettingPage:boolean = false;
appointmentDetails = {
  bookingNotes : ''
};
settingsArr:any =[];


constructor(
  public dialogRef: MatDialogRef<WorkStartedAppointmentDetailsDialog>,
  private AdminService: AdminService,
  public dialog: MatDialog,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
    this.fnGetActivityLog(this.detailsData.id);
    this.fnGetSettings();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  fnGetSettings(){

      let requestObject = {
        "business_id" : localStorage.getItem('business_id')
      };

      this.AdminService.getSettingValue(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.settingsArr = response.response;
        }else if(response.data == false && response.response !== 'api token or userid invaild'){
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
        }
      },(err) =>{
        console.log(err)
      });
  }

  fnGetActivityLog(orderItemId){
    this.appointmentDetails.bookingNotes = this.detailsData.booking_notes;

    let requestObject = {
      "order_item_id":orderItemId
    };
    this.AdminService.getActivityLog(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.activityLog=response.response;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.activityLog=[];
      }
    })
  }

  fnRescheduleAppointment(){

    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);

    var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.min_reseduling_time);

    if(is_cancel==true){
        this._snackBar.open('Minimum notice required for rescheduleing an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }

    const dialogRef = this.dialog.open(RescheduleAppointment, {
      height: '700px',
     data : {appointmentDetails: this.detailsData}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  fnConfirmAppointment(){
      let requestObject = {
       "order_item_id":JSON.stringify(this.detailsData.id),
       "status":"CO"
      };
      this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Confirmed.", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.dialogRef.close();
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
      })
  }


  fnCancelAppointment(){
    
    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);

    var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.cancellation_buffer_time);

    if(is_cancel==true){
        this._snackBar.open('Minimum notice required for Cancellation an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }

    let requestObject = {
     "order_item_id":JSON.stringify(this.detailsData.id),
     "status":"C"
    };
    this.AdminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Cancelled.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
        this.dialogRef.close();
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
      }
    })
  }
  
  fnSaveBookingNotes(orderItemId){
    
    if(this.appointmentDetails.bookingNotes == undefined || this.appointmentDetails.bookingNotes == ""){
      return false;
    }
    let requestObject = {
      "order_item_id":orderItemId,
      "booking_notes":this.appointmentDetails.bookingNotes
    };
    this.AdminService.saveBookingNotes(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Booking Notes Updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.formSettingPage = false;
      } else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
  }

  
  fncompereDate(APPODate,time){
        
    var Now = new Date();  
    var  APPO = new Date(APPODate);
    console.log(this.settingsArr);

    Now.setMinutes(Now.getMinutes() + parseInt(time));

    if (Now>APPO){
      return true;
    }else if (Now<APPO){
      return false;  
    } 

  }

}
