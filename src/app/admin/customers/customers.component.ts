import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AdminService } from '../_services/admin-main.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AppComponent } from '@app/app.component';
//import { IgxExcelExporterService, IgxExcelExporterOptions } from "igniteui-angular";


export interface DialogData {
  fulldata: any;
  animal: string;
  name: string;
 
}
export interface Tag {
  
}
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [DatePipe]
})
export class CustomersComponent implements OnInit {

  adminSettings : boolean = false;
  dtOptions: any = {};
  animal: any;
  allCustomers: any;
  customersDetails: any;
  customerLastbooking:any;
  customerPersonalDetails: any;
  customerAppoint: any;
  reviewOrderData : any;
  customerNotes: any;
  customerReviews: any;
  newCustomer: boolean = false;
  fullDetailsOfCustomer: boolean = true;
  isLoaderAdmin : boolean = false;
  createNewCustomer: FormGroup;
  createNewNote: FormGroup;
  newCustomerData: any;
  existingCustomerData: any;
  existingUserId: any;
  selectedCustomerId: any = [];
  selectedCustomerArr: any;
  businessId: any;
  addNewTag: boolean = false;
  tagsnew: any=[];
  customerImageUrl:any;

  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tag[] = [];
  settingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;

  constructor(
    public dialog: MatDialog,
    private AdminService: AdminService,
    private _formBuilder:FormBuilder,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private datePipe: DatePipe,
    //private excelExportService: IgxExcelExporterService,
    private appComponent : AppComponent,
    ) { 
      localStorage.setItem('isBusiness', 'false');
      if(localStorage.getItem('business_id')){
        this.businessId = localStorage.getItem('business_id');
    }
    //this.appComponent.settingsModule(this.adminSettings);
    }
    private handleError(error: HttpErrorResponse) {
      console.log(error);
      return throwError('Error! something went wrong.');
  }
    add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
      
      // Add our fruit
      if ((value || '').trim()) {
        this.tags.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
      console.log(this.tags);
    }

    remove(tg: Tag): void {
      const index = this.tags.indexOf(tg);

      if (index >= 0) {
        this.tags.splice(index, 1);
      }
      console.log(this.tags);
    }

  ngOnInit() {
    this.fnGetSettings();
    this.getAllCustomers();
    if(this.existingUserId != ''){
      this.createNewCustomer = this._formBuilder.group({
        cus_fullname : ['', Validators.required],
        cus_email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)]],
        cus_phone : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
        cus_officenumber : ['', [Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
        cus_homenumber : ['', [Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
        cus_address : ['', Validators.required],
        cus_state : ['', Validators.required],
        cus_city : ['', Validators.required],
        cus_zip : ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
        customer_id : ['']
      });
    }
    else{
      this.createNewCustomer = this._formBuilder.group({
        cus_fullname : ['', Validators.required],
        cus_email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)],
        this.isEmailUnique.bind(this)],
        cus_phone : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
        cus_officenumber : ['', [Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
        cus_homenumber : ['', [Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
        cus_address : ['', Validators.required],
        cus_state : ['', Validators.required],
        cus_city : ['', Validators.required],
        cus_zip : ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
        customer_id : ['']
      });
    }
  
  }

  fnGetSettings(){
    let requestObject = {
      "business_id" : this.businessId
      };

    this.AdminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr = response.response;
        console.log(this.settingsArr);

        this.currencySymbol = this.settingsArr.currency;
        console.log(this.currencySymbol);
        
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        console.log(this.currencySymbolPosition);
        
        this.currencySymbolFormat = this.settingsArr.currency_format;
        console.log(this.currencySymbolFormat);
      }else{
      }
      },
      (err) =>{
        console.log(err)
      })
  }

  getAllCustomers(){
    this.isLoaderAdmin = true;
    this.AdminService.getAllCustomers().subscribe((response:any) => {
      if(response.data == true){
        this.allCustomers = response.response;
       
        this.allCustomers.forEach( (element) => {
          // var str = element.fullname;
          // var matches = str.match(/\b(\w)/g); 
          // element.initials = matches.join(''); 
          var splitted = element.fullname.split(" ",2);
          element.initials='';
          splitted.forEach( (element2) => {
            element.initials=element.initials+element2.charAt(0);
          });
        });
        this.fnSelectCustomer(this.allCustomers[0].id);
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.allCustomers = ''
        this.isLoaderAdmin = false;
      }
    })
  }

  fnCreateCustomerSubmit(){
    if(this.createNewCustomer.get('customer_id').value != null){
      this.existingUserId = this.createNewCustomer.get('customer_id').value
      if(this.createNewCustomer.valid){
        this.existingCustomerData ={
          "customer_id" :  this.existingUserId,
          "business_id" : this.businessId,
          "fullname" : this.createNewCustomer.get('cus_fullname').value,
          "email" : this.createNewCustomer.get('cus_email').value,
          "phone" : this.createNewCustomer.get('cus_phone').value,
          "office_phone" : this.createNewCustomer.get('cus_officenumber').value,
          "home_phone" : this.createNewCustomer.get('cus_homenumber').value,
          "address" : this.createNewCustomer.get('cus_address').value,
          "state" : this.createNewCustomer.get('cus_state').value,
          "city" : this.createNewCustomer.get('cus_city').value,
          "zip" : this.createNewCustomer.get('cus_zip').value,
          'image': this.customerImageUrl
        }
    } else{
        this.createNewCustomer.get('cus_fullname').markAsTouched();
        this.createNewCustomer.get('cus_email').markAsTouched();
        this.createNewCustomer.get('cus_phone').markAsTouched();
        this.createNewCustomer.get('cus_officenumber').markAsTouched();
        this.createNewCustomer.get('cus_homenumber').markAsTouched();
        this.createNewCustomer.get('cus_address').markAsTouched();
        this.createNewCustomer.get('cus_state').markAsTouched();
        this.createNewCustomer.get('cus_city').markAsTouched();
        this.createNewCustomer.get('cus_zip').markAsTouched();
    }
    this.customerUpdate(this.existingCustomerData);
  }
  else{
      if(this.createNewCustomer.valid){
        this.newCustomerData ={
          "business_id" : this.businessId,
          "fullname" : this.createNewCustomer.get('cus_fullname').value,
          "email" : this.createNewCustomer.get('cus_email').value,
          "phone" : this.createNewCustomer.get('cus_phone').value,
          "office_phone" : this.createNewCustomer.get('cus_officenumber').value,
          "home_phone" : this.createNewCustomer.get('cus_homenumber').value,
          "address" : this.createNewCustomer.get('cus_address').value,
          "state" : this.createNewCustomer.get('cus_state').value,
          "city" : this.createNewCustomer.get('cus_city').value,
          "zip" : this.createNewCustomer.get('cus_zip').value,
        }
    }else{
        this.createNewCustomer.get('cus_fullname').markAsTouched();
        this.createNewCustomer.get('cus_email').markAsTouched();
        this.createNewCustomer.get('cus_phone').markAsTouched();
        this.createNewCustomer.get('cus_officenumber').markAsTouched();
        this.createNewCustomer.get('cus_homenumber').markAsTouched();
        this.createNewCustomer.get('cus_address').markAsTouched();
        this.createNewCustomer.get('cus_state').markAsTouched();
        this.createNewCustomer.get('cus_city').markAsTouched();
        this.createNewCustomer.get('cus_zip').markAsTouched();
    }
    this.fnCreateNewCustomer(this.newCustomerData);
  }
}

fnCreateNewCustomer(newCustomerData){
  this.isLoaderAdmin = true;
  this.AdminService.fnCreateNewCustomer(newCustomerData).subscribe((response:any) => {
    if(response.data == true){
      this._snackBar.open("Customer Created", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['green-snackbar']
      });
      this.getAllCustomers();
      this.fnCancelNewCustomer();
      this.isLoaderAdmin = false;
    }
    else if(response.data == false){
      // this.allCustomers = ''
    this.isLoaderAdmin = false;
    }
  })
}
customerUpdate(existingCustomerData){
  this.isLoaderAdmin = true;
  this.AdminService.customerUpdate(existingCustomerData).subscribe((response:any) => {
    if(response.data == true){
      this._snackBar.open("Customer Details Updated", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['green-snackbar']
      });
      this.fnSelectCustomer(existingCustomerData.customer_id);
      this.fnCancelNewCustomer();
      this.isLoaderAdmin = false;
    }
    else if(response.data == false){
      // this.allCustomers = ''
    this.isLoaderAdmin = false;
    }
  })
}

  fnAddNewCustomer(){
    this.newCustomer = true;
    this.fullDetailsOfCustomer = false;
    this.createNewCustomer.controls['customer_id'].setValue(null);
    this.createNewCustomer.controls['cus_fullname'].setValue(null);
    this.createNewCustomer.controls['cus_email'].setValue(null);
    this.createNewCustomer.controls['cus_phone'].setValue(null);
    this.createNewCustomer.controls['cus_officenumber'].setValue(null);
    this.createNewCustomer.controls['cus_homenumber'].setValue(null);
    this.createNewCustomer.controls['cus_address'].setValue(null);
    this.createNewCustomer.controls['cus_state'].setValue(null);
    this.createNewCustomer.controls['cus_city'].setValue(null);
    this.createNewCustomer.controls['cus_zip'].setValue(null);
  }
  fnCancelNewCustomer(){
    this.newCustomer = false;
    this.fullDetailsOfCustomer = true;
  }

  
  fnSelectCustomer(customer_id){
    this.isLoaderAdmin = true;
    this.AdminService.getCustomersDetails(customer_id).subscribe((response:any) => {
      if(response.data == true){
        this.customersDetails = response.response
        if(this.customersDetails.lastBooking){
          this.customersDetails.lastBooking.booking_date=this.datePipe.transform(new Date(this.customersDetails.lastBooking.booking_date),"d MMM y,")
          this.customersDetails.lastBooking.booking_time=this.datePipe.transform(new Date(this.customersDetails.lastBooking.booking_date+" "+this.customersDetails.lastBooking.booking_time),"hh:mm a")
        }
        this.customerPersonalDetails = response.response.customer_details 
        this.customerAppoint = response.response.appointmets
        console.log( this.customerAppoint)
        console.log( this.customerPersonalDetails)
        this.customerNotes = response.response.notes
        this.customerReviews = response.response.revirew
        console.log(this.customerReviews);

        this.customerPersonalDetails.created_at=this.datePipe.transform(new Date(this.customerPersonalDetails.created_at),"d MMM y, h:mm a")
        if(this.customerPersonalDetails.tag_id != null){
          this.tags = this.customerPersonalDetails.tag_id.split(",");
        }
        console.log(this.tags);

        this.customerAppoint.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")   
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
        });
        this.isLoaderAdmin = false;
        this.newCustomer = false;
        this.fullDetailsOfCustomer = true;
      }
      else if(response.data == false){
        this.customersDetails = ''
        this.isLoaderAdmin = false;
      }
    })
  }
  fnDeleteCustomer(customerId){
  this.isLoaderAdmin = true;
  this.AdminService.fnDeleteCustomer(customerId).subscribe((response:any) => {
    if(response.data == true){
      this._snackBar.open("Customer Deleted", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['green-snackbar']
      });
      this.getAllCustomers();
      this.isLoaderAdmin = false;
    }
    else if(response.data == false){
      // this.allCustomers = ''
    this.isLoaderAdmin = false;
    }
  })
  }
  
  editCustomer(customer_id){
    this.existingUserId = customer_id
    this.newCustomer = true;
    this.fullDetailsOfCustomer = false;
    this.isLoaderAdmin = true;
    console.log(this.customerPersonalDetails);
    this.createNewCustomer.controls['customer_id'].setValue(this.existingUserId);
    this.createNewCustomer.controls['cus_fullname'].setValue(this.customerPersonalDetails.fullname);
    this.createNewCustomer.controls['cus_email'].setValue(this.customerPersonalDetails.email);
    this.createNewCustomer.controls['cus_phone'].setValue(this.customerPersonalDetails.phone);
    this.createNewCustomer.controls['cus_officenumber'].setValue(this.customerPersonalDetails.phone_office);
    this.createNewCustomer.controls['cus_homenumber'].setValue(this.customerPersonalDetails.phone_home);
    this.createNewCustomer.controls['cus_address'].setValue(this.customerPersonalDetails.address);
    this.createNewCustomer.controls['cus_state'].setValue(this.customerPersonalDetails.state);
    this.createNewCustomer.controls['cus_city'].setValue(this.customerPersonalDetails.city);
    this.createNewCustomer.controls['cus_zip'].setValue(this.customerPersonalDetails.zip);
    this.isLoaderAdmin = false;
  }

  // email check
  isEmailUnique(control: FormControl) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/verify-email`,{ emailid: control.value },{headers:headers}).pipe(map((response : any) =>{
          return response;
        }),
        catchError(this.handleError)).subscribe((res) => {
          if(res){
            if(res.data == false){
            resolve({ isEmailUnique: true });
            }else{
            resolve(null);
            }
          }
        });
      }, 500);
    });
  }

  newCustomerAppointment() {
    const dialogRef = this.dialog.open(DialogNewCustomerAppointment, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }

  newAddNote(customer_id,index) {
    const dialogRef = this.dialog.open(DialogAddNewNote, {
      width: '500px',
      data:{customer_id : customer_id, fulldata : this.customerNotes[index]}
      
    });
     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.fnSelectCustomer(customer_id);
      this.animal = result;
     });
  }

  newPaymentNote() {
    const dialogRef = this.dialog.open(DialogPaymentNote, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }
  
  viewReviewDetail(index, OrderId){
    //alert(OrderId);
    this.isLoaderAdmin = true;
    this.AdminService.viewReviewDetail(OrderId).subscribe((response:any) => {
      if(response.data == true){
        this.reviewOrderData = response.response;
        console.log(this.reviewOrderData)
        this.reviewOrderData.forEach( (element) => { 
                  element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")   
                  element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
                  element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
                });

         const dialogRef = this.dialog.open(DialogViewReview, {
          width: '500px',
          data :{fulldata : this.customerReviews[index], orderData : this.reviewOrderData}
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.animal = result;
        });
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.isLoaderAdmin = false;
      }
    })
   
  }

  fnAddNewTag(){
    this.addNewTag = true;
  }
  fnSaveTags(customerId){
    this.addNewTag = false;
    this.isLoaderAdmin = true;
    this.AdminService.fnSaveTags(customerId,this.tags).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Customer Tag Added", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.fnSelectCustomer(customerId);
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.isLoaderAdmin = false;
      }
    })

  }
  fnAddCustomerId(event, customerId){
    if(event == true){
      this.selectedCustomerId.push(customerId);
    }else if(event == false){
      const index = this.selectedCustomerId.indexOf(customerId, 0);
      if (index > -1) {
          this.selectedCustomerId.splice(index, 1);
      }
    }
  }

  // fnExportCustomer(exportType){
  //   if(exportType == 'all'){
  //     this.excelExportService.exportData(this.allCustomers, new IgxExcelExporterOptions("MyCustomers"));
  //   }else if(exportType == 'selected'){
  //     this.AdminService.fnExportCustomer(this.selectedCustomerId).subscribe((response:any) => {
  //       if(response.data == true){
  //         this.selectedCustomerArr = response.response
  //         this.excelExportService.exportData(this.selectedCustomerArr, new IgxExcelExporterOptions("MyCustomers"));
  //         this.selectedCustomerId.length = 0;
  //         this.isLoaderAdmin = false;
  //       }
  //       else if(response.data == false){
  //         this.isLoaderAdmin = false;
  //       }
  //     })
  //   }
  // }
  customerImage() {
    const dialogRef = this.dialog.open(DialogCustomerImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.customerImageUrl = result;
            console.log(result);
           }
     });
  }

  ImportFileUpload() {
    const dialogRef = this.dialog.open(DialogImportFileUpload, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
        // if(result != undefined){
        //     this.subCategoryImageUrl = result;
        //     console.log(result);
        //    }
     });
  }

  fnCustomerAppointmentDetails(index){

    const dialogRef = this.dialog.open(CustomerAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.customerAppoint[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      //this.getPendingAppointments();
     
      });

  }
}

@Component({
  selector: 'customer-appointment-details-dialog',
  templateUrl: '../_dialogs/customer-appointment-details-dialog.html',
})
export class CustomerAppointmentDetailsDialog {
  detailsData: any;
constructor(
  public dialogRef: MatDialogRef<CustomerAppointmentDetailsDialog>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
  }

onNoClick(): void {
  this.dialogRef.close();
}

}

@Component({
  selector: 'import-file-upload',
  templateUrl: '../_dialogs/import-file-upload.html',
})
export class DialogImportFileUpload {

constructor(
  public dialogRef: MatDialogRef<DialogImportFileUpload>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}

}

@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/new-appointment.html',
})
export class DialogNewCustomerAppointment {

constructor(
  public dialogRef: MatDialogRef<DialogNewCustomerAppointment>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}

}

@Component({
  selector: 'new-note',
  templateUrl: '../_dialogs/add-new-note-dialog.html',
})
export class DialogAddNewNote {
  createNewNote:FormGroup;
  createNewNoteData:any;
  editNoteData:any;
  customer_id : any;
  noteData : any;
  businessId : any;
  isLoaderAdmin : boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogAddNewNote>,
    private AdminService: AdminService,
    private _formBuilder:FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.customer_id = this.data.customer_id
      this.noteData = this.data.fulldata
      console.log(this.noteData);

      if(localStorage.getItem('business_id')){
        this.businessId = localStorage.getItem('business_id');
    }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.createNewNote = this._formBuilder.group({
      note_subject : ['', Validators.required],
      note_description : ['', Validators.required],
    });
    if(this.noteData != undefined){
      this.createNewNote.controls['note_subject'].setValue(this.noteData.note_subject);
      this.createNewNote.controls['note_description'].setValue(this.noteData.note_decreption);
    }
    
  }
  fnSubmit(){
    if(this.noteData != undefined){
      if(this.createNewNote.valid){
        this.editNoteData ={
          
          "customer_note_id" : this.noteData.id,
          "subject" : this.createNewNote.get('note_subject').value,
          "description" : this.createNewNote.get('note_description').value,
        }
      }else{
          this.createNewNote.get('note_subject').markAsTouched();
          this.createNewNote.get('note_description').markAsTouched();
      }
      this.fnEditNote(this.editNoteData);
    }
    else{
      if(this.createNewNote.valid){
        this.createNewNoteData ={
          "business_id" : this.businessId,
          "customer_id" : this.customer_id,
          "subject" : this.createNewNote.get('note_subject').value,
          "description" : this.createNewNote.get('note_description').value,
        }
      }else{
          this.createNewNote.get('note_subject').markAsTouched();
          this.createNewNote.get('note_description').markAsTouched();
      }
      this.fncreateNewNote(this.createNewNoteData);
    }
  }
  fncreateNewNote(createNewNoteData){
    this.isLoaderAdmin = true;
    this.AdminService.fncreateNewNote(createNewNoteData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Customer Note Created", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.dialogRef.close();
        this.isLoaderAdmin = false;
        
      }
      else if(response.data == false){
        // this.allCustomers = ''
      this.isLoaderAdmin = false;
      }
    })
  }
  fnEditNote(editNoteData){
    this.isLoaderAdmin = true;
    this.AdminService.fnEditNote(editNoteData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Customer Note Updated", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.dialogRef.close();
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        // this.allCustomers = ''
      this.isLoaderAdmin = false;
      }
    })
  }

}

@Component({
  selector: 'customer-image-upload',
  templateUrl: '../_dialogs/customer-upload-profile-image-dialog.html',
})
export class DialogCustomerImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogCustomerImageUpload>,
  private _formBuilder:FormBuilder,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
      this.dialogRef.close(this.profileImage);
    }
    ngOnInit() {
      this.uploadForm = this._formBuilder.group({
        profile: ['']
      });
    }
    get f() {
      return this.uploadForm.controls;
    }
    
onFileChange(event) {
  const reader = new FileReader();
  if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.uploadForm.patchValue({
              fileSource: reader.result
          });
      };
  }
}
uploadImage() {
  this.profileImage = this.imageSrc
  this.dialogRef.close(this.profileImage);
}


}


@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/payment-note-dialog.html',
})
export class DialogPaymentNote {

constructor(
  public dialogRef: MatDialogRef<DialogPaymentNote>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}

}

@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/view-review-dialog.html',
})
export class DialogViewReview {
detailsData: any;
orderDataFull:any;
constructor(
  public dialogRef: MatDialogRef<DialogViewReview>,
  private AdminService: AdminService,
  @Inject(MAT_DIALOG_DATA) public data: any) {

     this.detailsData =  this.data.fulldata;
     this.orderDataFull =  this.data.orderData[0];
     console.log(this.orderDataFull);
    console.log(this.detailsData);
  }

onNoClick(): void {
  this.dialogRef.close();
}

}
