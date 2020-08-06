import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Subject, from } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { DatePipe} from '@angular/common';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {TooltipPosition} from '@angular/material/tooltip';

export interface DialogData {
  selectedStaffId: any;
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  providers: [DatePipe]
})
export class StaffComponent implements OnInit {
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  files: any[] = [];
  animal: any;
  isLoaderAdmin: boolean = false;
  StaffCreate: FormGroup;
  addStaffPage: boolean = false;
  staffListPage: boolean = true;
  singleStaffView: boolean = false;
  businessId: any;
  allStaffList: any;
  staffActionId: any = [];
  addPostalCodeId: any = [];
  singleStaffStatus: any;
  singleStaffDetail: any;
  staffImageUrl:any = '';
  progress: any;
  singleStaffDataRating: any;
  singleStaffIndex: any;
  search ={
    postalCode :"",
    staff : ""
  }

  addStaffPageValid:FormGroup;
  selectedServicesArr: any = [];
  selectedPostalCodeArr: any = [];
  selectedServiceNewStaff: any = [];
  staffInternalStatus: any;
  staffLoginStatus: any;
  selectedStaffId: any;
  singlePostalCodeStatus: any;
  selectedValue: any;
  categoryServiceList: any=[];
  categoryServiceListTemp: any=[];
  newStaffData: any;
  updateStaffData: any;
  editStaffId: any;
  validationArr:any=[];
  settingSideMenuToggle : boolean = false;

  
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/

  formSetWorkingHours: FormGroup;
  timeSlotList: any=[];
  workingHoursList: any=[];
  mondayOn : boolean;
  tuesdayOn : boolean;
  wednesdayOn : boolean;
  thursdayOn : boolean;
  fridayOn : boolean;
  saturdayOn : boolean;
  sundayOn : boolean;
  mondayWorkingHourStartTimeIndex:any;
  mondayWorkingHourEndTimeIndex:any;
  tuesdayWorkingHourStartTimeIndex:any;
  tuesdayWorkingHourEndTimeIndex:any;
  wednesdayWorkingHourStartTimeIndex:any;
  wednesdayWorkingHourEndTimeIndex:any;
  thursdayWorkingHourStartTimeIndex:any;
  thursdayWorkingHourEndTimeIndex:any;
  fridayWorkingHourStartTimeIndex:any;
  fridayWorkingHourEndTimeIndex:any;
  saturdayWorkingHourStartTimeIndex:any;
  saturdayWorkingHourEndTimeIndex:any;
  sundayWorkingHourStartTimeIndex:any;
  sundayWorkingHourEndTimeIndex:any;

  bussinessWorkingHoursList: any=[];
  bussinessSundayOn : boolean;
  bussinessMondayOn : boolean;
  bussinessTuesdayOn : boolean;
  bussinessWednesdayOn : boolean;
  bussinessThursdayOn : boolean;
  bussinessFridayOn : boolean;
  bussinessSaturdayOn : boolean;
  mondayBussinessWorkingHourStartTimeIndex:any;
  mondayBussinessWorkingHourEndTimeIndex:any;
  tuesdayBussinessWorkingHourStartTimeIndex:any;
  tuesdayBussinessWorkingHourEndTimeIndex:any;
  wednesdayBussinessWorkingHourStartTimeIndex:any;
  wednesdayBussinessWorkingHourEndTimeIndex:any;
  thursdayBussinessWorkingHourStartTimeIndex:any;
  thursdayBussinessWorkingHourEndTimeIndex:any;
  fridayBussinessWorkingHourStartTimeIndex:any;
  fridayBussinessWorkingHourEndTimeIndex:any;
  saturdayBussinessWorkingHourStartTimeIndex:any;
  saturdayBussinessWorkingHourEndTimeIndex:any;
  sundayBussinessWorkingHourStartTimeIndex:any;
  sundayBussinessWorkingHourEndTimeIndex:any;

  breakTimeList: any=[];
  selectedStartTimeMonday: any;
  selectedEndTimeMonday: any;
  selectedStartTimeTuesday: any;
  selectedEndTimeTuesday: any;
  selectedStartTimeWednesday: any;
  selectedEndTimeWednesday: any;
  selectedStartTimeThursday: any;
  selectedEndTimeThursday: any;
  selectedStartTimeFriday: any;
  selectedEndTimeFriday: any;
  selectedStartTimeSaturday: any;
  selectedEndTimeSaturday: any;
  selectedStartTimeSunday: any;
  selectedEndTimeSunday: any;
  showMondayAddForm: boolean=false;
  showTuesdayAddForm: boolean=false;
  showWednesdayAddForm: boolean=false;
  showThursdayAddForm: boolean=false;
  showFridayAddForm: boolean=false;
  showSaturdayAddForm: boolean=false;
  showSundayAddForm: boolean=false;
  mondayBreakStartTimeIndex:any;
  mondayBreakEndTimeIndex:any;
  tuesdayBreakStartTimeIndex:any;
  tuesdayBreakEndTimeIndex:any;
  wednesdayBreakStartTimeIndex:any;
  wednesdayBreakEndTimeIndex:any;
  thursdayBreakStartTimeIndex:any;
  thursdayBreakEndTimeIndex:any;
  fridayBreakStartTimeIndex:any;
  fridayBreakEndTimeIndex:any;
  saturdayBreakStartTimeIndex:any;
  saturdayBreakEndTimeIndex:any;
  sundayBreakStartTimeIndex:any;
  sundayBreakEndTimeIndex:any;
  
  timeOffList: any=[];
  settingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;
  reviewOrderData : any;
  staffApiUrl : any;
  current_page : any;
  first_page_url : any;
  last_page : any;
  last_page_url : any;
  next_page_url : any;
  prev_page_url : any;
  path : any;
  selectAll:boolean =false;

  categoryServiceCheckCatId: any = [];
  categoryServiceChecksubCatId: any = [];
  categoryServiceCheckServiceId: any = [];

/**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);  
  }
 
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
 
  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      console.log("Upload in progress.");
      return;
    }
    this.files.splice(index, 1);
  }
  
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;

      var file_type = item.type;

      if( file_type!='application/pdf' &&  file_type!='application/msword' && file_type!='image/jpeg' &&  file_type!='image/png' && file_type!='image/jpg' &&  file_type!='image/gif'){
          
          this._snackBar.open("Sorry, only PDF, JPG, PNG, DOC & DOC files are allowed", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
          });
        
      }else{
        this.files.push(item);
      }

      
    }
    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(0);   
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private adminSettingsService: AdminSettingsService,
    private datePipe: DatePipe,
  ) {
    localStorage.setItem('isBusiness', 'false');
    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
    }
    this.fnGetWorkingHours();
    this.fnGetTimeSlotsList("08:00","18:00","30");
    this.formSetWorkingHours = this._formBuilder.group({
      mondayToggle: [false],
      mondayStartTime: [this.timeSlotList[0].long],
      mondayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      tuesdayToggle: [false],
      tuesdayStartTime: [this.timeSlotList[0].long],
      tuesdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      wednesdayToggle: [false],
      wednesdayStartTime: [this.timeSlotList[0].long],
      wednesdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      thursdayToggle: [false],
      thursdayStartTime: [this.timeSlotList[0].long],
      thursdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      fridayToggle: [false],
      fridayStartTime: [this.timeSlotList[0].long],
      fridayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      saturdayToggle: [false],
      saturdayStartTime: [this.timeSlotList[0].long],
      saturdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      sundayToggle: [false],
      sundayStartTime: [this.timeSlotList[0].long],
      sundayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
    })
  }
  
  

  ngOnInit() {
    this.staffApiUrl=environment.apiUrl+"/staff-list-with-review";
    this.fnGetSettings();
    this.getAllStaff();

    this.StaffCreate = this._formBuilder.group({
      firstname : ['',[ Validators.required,]],
      lastname : ['', [Validators.required]],
      address : ['', [Validators.required,]],
      email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)],this.isEmailUnique.bind(this)],
      phone : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      description : ['',Validators.maxLength(255)],
      staff_id : [''],
    });
  }

  // private handleError(error: HttpErrorResponse) {
  //   return throwError('Error! something went wrong.');
  //   //return error.error ? error.error : error.statusText;
  // }

  // isEmailUnique(control: FormControl) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       let headers = new HttpHeaders({
  //         'Content-Type': 'application/json',
  //       });
  //       return this.http.post(`${environment.apiUrl}/verify-email`,{ emailid: control.value },{headers:headers}).pipe(map((response : any) =>{
  //         return response;
  //       }),
  //       catchError(this.handleError)).subscribe((res) => {
  //         if(res){
  //           if(res.data == false){
  //           resolve({ isEmailUnique: true });
  //           }else{
  //           resolve(null);
  //           }
  //         }
  //       });
  //     }, 500);
  //   });
  // }
  fnStaffListing(){
    this.addStaffPage = false;
    this.staffListPage = true;
    this.singleStaffView = false;
  }
  fnSettingMenuToggleSmall(){
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge(){
    this.settingSideMenuToggle = false;
  }


  isEmailUniqueForEdit(control: FormControl) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/check-staff-emailid`,{ emailid: control.value,staff_id:parseInt(this.editStaffId) },{headers:headers}).pipe(map((response : any) =>{
          return response;
        }),
        catchError(this.handleError)).subscribe((res) => {
          if(res){
            if(res.data == false){
            resolve({ isEmailUniqueForEdit: true });
            }else{
            resolve(null);
            }
          }
        });
      }, 500);
    });
  }

  fnGetSettings(){
  let requestObject = {
    "business_id" : this.businessId
    };

  this.adminSettingsService.getSettingValue(requestObject).subscribe((response:any) => {
    if(response.data == true && response.response != ''){
      this.settingsArr = response.response;
     // console.log(this.settingsArr);

      this.currencySymbol = this.settingsArr.currency;
      //console.log(this.currencySymbol);
      
      this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
      //console.log(this.currencySymbolPosition);
      
      this.currencySymbolFormat = this.settingsArr.currency_format;
     // console.log(this.currencySymbolFormat);
    }else{

    }
    },
    (err) =>{
      console.log(err)
    })
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  navigateTo(api_url){
    this.staffApiUrl=api_url;
    console.log(this.staffApiUrl);
    if(this.staffApiUrl){
      this.getAllStaff();
    }
  }
  navigateToPageNumber(index){
    this.staffApiUrl=this.path+'?page='+index;
    console.log(this.staffApiUrl);
    if(this.staffApiUrl){
      this.getAllStaff();
    }
  }

  getAllStaff() {
    this.isLoaderAdmin = true;
    this.adminSettingsService.getAllStaff(this.staffApiUrl).subscribe((response: any) => {
      if (response.data == true) {
        this.current_page = response.response.current_page;
        this.first_page_url = response.response.first_page_url;
        this.last_page = response.response.last_page;
        this.last_page_url = response.response.last_page_url;
        this.next_page_url = response.response.next_page_url;
        this.prev_page_url = response.response.prev_page_url;
        this.path = response.response.path;
        this.allStaffList = response.response.data;

        this.allStaffList.forEach( (element) => { 
          element.is_selected = false;
        });
        this.selectAll = false;

        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.allStaffList = [];
        this.isLoaderAdmin = false;
      }
    })
  }

  fnAddStaffId(event, staffId,i) {
    if (event == true) {
      this.staffActionId.push(staffId)
      this.allStaffList[i].is_selected = true;

    }else if (event == false) {
      this.allStaffList[i].is_selected = false;

      const index = this.staffActionId.indexOf(staffId, 0);
      if (index > -1) {
        this.staffActionId.splice(index, 1);
      }
    }
    
    if (this.staffActionId.length == this.allStaffList.length ) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
    console.log(this.staffActionId);
  }
  
  checkAll(event){
    
    this.staffActionId =[];

    for (let i = 0; i < this.allStaffList.length; i++) {
      const item = this.allStaffList[i];
      item.is_selected = event.checked;
      if(event.checked){
        this.staffActionId.push(item.id)
      }
    }
    
    if(event.checked){
      this.selectAll = true;
    }else{
      this.selectAll = false;
    }

  }
  
  fnActionStaff(action) {
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnActionStaff(action, this.staffActionId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Staff status updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.selectedValue = undefined
        this.staffActionId.length = 0;
        this.getAllStaff();
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnGetWorkingHours(){
    let requestObject={
      "business_id":this.businessId
    }
    this.adminSettingsService.getWorkingHours(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.bussinessWorkingHoursList=response.response;
        console.log(this.bussinessWorkingHoursList);
        this.bussinessWorkingHoursList.forEach(element => {
          if(element.week_day_id == 0){
            element.week_day_name="Sunday";
            if(element.off_day=="N"){
              this.bussinessSundayOn=true;
            }else{
              this.bussinessSundayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 1){
            element.week_day_name="Monday";            
            if(element.off_day=="N"){
              this.bussinessMondayOn=true;
            }else{
              this.bussinessMondayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 2){
            element.week_day_name="Tuesday";         
            if(element.off_day=="N"){
              this.bussinessTuesdayOn=true;
            }else{
              this.bussinessTuesdayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 3){
            element.week_day_name="Wednesday";        
            if(element.off_day=="N"){
              this.bussinessWednesdayOn=true;
            }else{
              this.bussinessWednesdayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 4){
            element.week_day_name="Thursday";       
            if(element.off_day=="N"){
              this.bussinessThursdayOn=true;
            }else{
              this.bussinessThursdayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 5){
            element.week_day_name="Friday";     
            if(element.off_day=="N"){
              this.bussinessFridayOn=true;
            }else{
              this.bussinessFridayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 6){
            element.week_day_name="Saturday";    
            if(element.off_day=="N"){
              this.bussinessSaturdayOn=true;
            }else{
              this.bussinessSaturdayOn=false;
            }
            if(element.day_start_time && element.day_end_time){
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
            }
          }
        });
        console.log(this.bussinessWorkingHoursList);

        for(var i=0; i<this.timeSlotList.length; i++){
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[0].day_start_time){
            this.mondayBussinessWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[0].day_end_time){
            this.mondayBussinessWorkingHourEndTimeIndex=i;
          }
          
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[1].day_start_time){
            this.tuesdayBussinessWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[1].day_end_time){
            this.tuesdayBussinessWorkingHourEndTimeIndex=i;
          }
          
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[2].day_start_time){
            this.wednesdayBussinessWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[2].day_end_time){
            this.wednesdayBussinessWorkingHourEndTimeIndex=i;
          }
          
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[3].day_start_time){
            this.thursdayBussinessWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[3].day_end_time){
            this.thursdayBussinessWorkingHourEndTimeIndex=i;
          }
          
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[4].day_start_time){
            this.fridayBussinessWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[4].day_end_time){
            this.fridayBussinessWorkingHourEndTimeIndex=i;
          }
          
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[5].day_start_time){
            this.saturdayBussinessWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[5].day_end_time){
            this.saturdayBussinessWorkingHourEndTimeIndex=i;
          }
          
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[6].day_start_time){
            this.sundayBussinessWorkingHourStartTimeIndex=i;
          }
          if(this.timeSlotList[i].long==this.bussinessWorkingHoursList[6].day_end_time){
            this.sundayBussinessWorkingHourEndTimeIndex=i;
          }

        }
        console.log(this.mondayBussinessWorkingHourStartTimeIndex);
        console.log(this.mondayBussinessWorkingHourEndTimeIndex);
      }
      else{
       
      }
    })
  }

  fnChangeStaffStatus(event, staffId) {
    this.isLoaderAdmin = true;
    if (event == true) {
      this.singleStaffStatus = 'E'
    }
    else if (event == false) {
      this.singleStaffStatus = 'D'
    }
    this.staffActionId.push(staffId)
    this.adminSettingsService.fnActionStaff(this.singleStaffStatus, this.staffActionId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Staff status updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.getAllStaff();
        this.staffActionId.length = 0;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnViewSingleStaff(staffId,index) {
    this.singleStaffIndex = index;
    this.isLoaderAdmin = true;
    this.selectedStaffId= staffId;
    this.singleStaffDataRating = this.allStaffList[index]
    console.log(this.singleStaffDataRating);
    let requestObject = {
        'business_id': this.businessId,
        'staff_id': staffId,
    };
    this.adminSettingsService.fnViewSingleStaff(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.singleStaffDetail = response.response
        console.log(this.singleStaffDetail);
        this.selectedServiceNewStaff=[];
        this.singleStaffDetail.staff[0].services.forEach(element => {
          // this.selectedServicesArr.push(element.id);
          this.selectedServiceNewStaff.push(element.id);
        });
        console.log("selectedServiceNewStaff");
        console.log(this.selectedServiceNewStaff);
        this.singleStaffDetail.staff[0].postal_codes.forEach(element => {
          this.selectedPostalCodeArr.push(element.id);
        });
        console.log( this.selectedPostalCodeArr);
        if(this.singleStaffDetail.workingHours.length>0){
          this.workingHoursList=this.singleStaffDetail.workingHours;
          console.log(this.workingHoursList);
          this.workingHoursList.forEach(element => {
            if(element.week_day_id == 0){
              element.week_day_name="Sunday";
              if(element.off_day=="N"){
                this.sundayOn=true;
              }else{
                this.sundayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
                element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
                element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 1){
              element.week_day_name="Monday";            
              if(element.off_day=="N"){
                this.mondayOn=true;
              }else{
                this.mondayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
                element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
                element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 2){
              element.week_day_name="Tuesday";         
              if(element.off_day=="N"){
                this.tuesdayOn=true;
              }else{
                this.tuesdayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
                element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
                element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 3){
              element.week_day_name="Wednesday";        
              if(element.off_day=="N"){
                this.wednesdayOn=true;
              }else{
                this.wednesdayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 4){
              element.week_day_name="Thursday";       
              if(element.off_day=="N"){
                this.thursdayOn=true;
              }else{
                this.thursdayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 5){
              element.week_day_name="Friday";     
              if(element.off_day=="N"){
                this.fridayOn=true;
              }else{
                this.fridayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 6){
              element.week_day_name="Saturday";    
              if(element.off_day=="N"){
                this.saturdayOn=true;
              }else{
                this.saturdayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
          });

          for(var i=0; i<this.timeSlotList.length; i++){
            if(this.timeSlotList[i].long==this.workingHoursList[0].day_start_time){
              this.mondayWorkingHourStartTimeIndex=i;
            }
            if(this.timeSlotList[i].long==this.workingHoursList[0].day_end_time){
              this.mondayWorkingHourEndTimeIndex=i;
            }
            
            if(this.timeSlotList[i].long==this.workingHoursList[1].day_start_time){
              this.tuesdayWorkingHourStartTimeIndex=i;
            }
            if(this.timeSlotList[i].long==this.workingHoursList[1].day_end_time){
              this.tuesdayWorkingHourEndTimeIndex=i;
            }
            
            if(this.timeSlotList[i].long==this.workingHoursList[2].day_start_time){
              this.wednesdayWorkingHourStartTimeIndex=i;
            }
            if(this.timeSlotList[i].long==this.workingHoursList[2].day_end_time){
              this.wednesdayWorkingHourEndTimeIndex=i;
            }
            
            if(this.timeSlotList[i].long==this.workingHoursList[3].day_start_time){
              this.thursdayWorkingHourStartTimeIndex=i;
            }
            if(this.timeSlotList[i].long==this.workingHoursList[3].day_end_time){
              this.thursdayWorkingHourEndTimeIndex=i;
            }
            
            if(this.timeSlotList[i].long==this.workingHoursList[4].day_start_time){
              this.fridayWorkingHourStartTimeIndex=i;
            }
            if(this.timeSlotList[i].long==this.workingHoursList[4].day_end_time){
              this.fridayWorkingHourEndTimeIndex=i;
            }
            
            if(this.timeSlotList[i].long==this.workingHoursList[5].day_start_time){
              this.saturdayWorkingHourStartTimeIndex=i;
            }
            if(this.timeSlotList[i].long==this.workingHoursList[5].day_end_time){
              this.saturdayWorkingHourEndTimeIndex=i;
            }
            
            if(this.timeSlotList[i].long==this.workingHoursList[6].day_start_time){
              this.sundayWorkingHourStartTimeIndex=i;
            }
            if(this.timeSlotList[i].long==this.workingHoursList[6].day_end_time){
              this.sundayWorkingHourEndTimeIndex=i;
            }

          }
          this.formSetWorkingHours = this._formBuilder.group({
            mondayToggle: [this.workingHoursList[0].off_day=="N"?true:false,this.mondayOn?Validators.required:''],
            mondayStartTime: [this.workingHoursList[0].day_start_time,this.mondayOn?Validators.required:''],
            mondayEndTime: [this.workingHoursList[0].day_end_time,this.mondayOn?Validators.required:''],
            tuesdayToggle: [this.workingHoursList[1].off_day=="N"?true:false,this.tuesdayOn?Validators.required:''],
            tuesdayStartTime: [this.workingHoursList[1].day_start_time,this.tuesdayOn?Validators.required:''],
            tuesdayEndTime: [this.workingHoursList[1].day_end_time,this.tuesdayOn?Validators.required:''],
            wednesdayToggle: [this.workingHoursList[2].off_day=="N"?true:false,this.wednesdayOn?Validators.required:''],
            wednesdayStartTime: [this.workingHoursList[2].day_start_time,this.wednesdayOn?Validators.required:''],
            wednesdayEndTime: [this.workingHoursList[2].day_end_time,this.wednesdayOn?Validators.required:''],
            thursdayToggle: [this.workingHoursList[3].off_day=="N"?true:false,this.thursdayOn?Validators.required:''],
            thursdayStartTime: [this.workingHoursList[3].day_start_time,this.thursdayOn?Validators.required:''],
            thursdayEndTime: [this.workingHoursList[3].day_end_time,this.thursdayOn?Validators.required:''],
            fridayToggle: [this.workingHoursList[4].off_day=="N"?true:false,this.fridayOn?Validators.required:''],
            fridayStartTime: [this.workingHoursList[4].day_start_time,this.fridayOn?Validators.required:''],
            fridayEndTime: [this.workingHoursList[4].day_end_time,this.fridayOn?Validators.required:''],
            saturdayToggle: [this.workingHoursList[5].off_day=="N"?true:false,this.saturdayOn?Validators.required:''],
            saturdayStartTime: [this.workingHoursList[5].day_start_time,this.saturdayOn?Validators.required:''],
            saturdayEndTime: [this.workingHoursList[5].day_end_time,this.saturdayOn?Validators.required:''],
            sundayToggle: [this.workingHoursList[6].off_day=="N"?true:false,this.sundayOn?Validators.required:''],
            sundayStartTime: [this.workingHoursList[6].day_start_time,this.sundayOn?Validators.required:''],
            sundayEndTime: [this.workingHoursList[6].day_end_time,this.sundayOn?Validators.required:''],
          })
        }
        if(this.singleStaffDetail.breaktime.length>0){
          this.breakTimeList= this.singleStaffDetail.breaktime;
          console.log(this.breakTimeList);
          this.breakTimeList.forEach(element => {
            if(element.break_start_time){
             element.break_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.break_start_time),"HH:mm");
            }
            if(element.break_end_time){
              element.break_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.break_end_time),"HH:mm");
            }
          });
        }else{
          this.breakTimeList= [];
        }

        if(this.singleStaffDetail.timeoff.length>0){
        this.timeOffList= this.singleStaffDetail.timeoff;
        console.log(this.timeOffList);
        this.timeOffList.forEach(element => {
          if(element.start_date){
            element.start_date=this.datePipe.transform(new Date(element.start_date),"MMM dd, yyyy");
          }
          if(element.end_date){
            element.end_date=this.datePipe.transform(new Date(element.end_date),"MMM dd, yyyy");
          }
        });
      }else{
        this.timeOffList= [];
      }

        this.staffListPage = false;
        this.singleStaffView = true;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnChangeInternalStaff(event, staffId) {
    this.isLoaderAdmin = true;
    if (event == true) {
      this.staffInternalStatus = 'Y'
    }
    else if (event == false) {
      this.staffInternalStatus = 'N'
    }
    this.adminSettingsService.fnChangeInternalStaff(this.staffInternalStatus, staffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Internal Staff status updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnChangeLoginAllowStaff(event, staffId) {
    this.isLoaderAdmin = true;
    if (event == true) {
      this.staffLoginStatus = 'Y'
    }
    else if (event == false) {
      this.staffLoginStatus = 'N'
    }
    this.adminSettingsService.fnChangeLoginAllowStaff(this.staffLoginStatus, staffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Login allowed status updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnAddPostalCodeId(event, postalCodeId) {
    if (event == true) {
      this.addPostalCodeId.push(postalCodeId)
    }
    else if (event == false) {
      const index = this.addPostalCodeId.indexOf(postalCodeId, 0);
      if (index > -1) {
        this.addPostalCodeId.splice(index, 1);
      }
    }
  }
  fnAssignPostalToStaff(value) {
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnAssignPostalToStaff(value, this.addPostalCodeId, this.selectedStaffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.selectedPostalCodeArr.length = 0;
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex)
        this.addPostalCodeId.length = 0;
        this.selectedValue = undefined
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnSingleAssignPostalCode(event, postalCodeId) {
    this.isLoaderAdmin = true;
    if (event == true) {
      this.singlePostalCodeStatus = 'E'
    } else if (event == false) {
      this.singlePostalCodeStatus = 'D'
    }
    this.addPostalCodeId.push(postalCodeId)
    this.adminSettingsService.fnAssignPostalToStaff(this.singlePostalCodeStatus, this.addPostalCodeId, this.selectedStaffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.selectedPostalCodeArr.length = 0;
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex)
        this.addPostalCodeId.length = 0;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnAssignServiceToStaff(event, serviceId) {
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnAssignServiceToStaff(event, serviceId, this.selectedStaffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open('Staff service updated.', "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex)
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnBackStaffList(){
    this.isLoaderAdmin = true;
    this.addStaffPage = false;
    this.staffListPage = true;
    this.singleStaffView = false;
    this.getAllStaff();
    this.isLoaderAdmin = false;
  }

  fnAddNewStaff(){
    this.isLoaderAdmin = true;
    this.addStaffPage = true;
    this.staffListPage = false;
    this.singleStaffView = false;
    this.isLoaderAdmin = false;
    this.selectedServiceNewStaff=[];
    this.editStaffId=null;
    this.getCateServiceList();
    this.StaffCreate = this._formBuilder.group({
      firstname : ['',[ Validators.required,Validators]],
      lastname : ['', [Validators.required,Validators]],
      address : ['', [Validators.required,Validators.minLength(3),Validators.maxLength(255)]],
      email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)],this.isEmailUnique.bind(this)],
      phone : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      description : ['',Validators.maxLength(255)],
      staff_id : [''],
    });  
  }

  searchService(event){
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

    
    console.log(this.categoryServiceList);

  }

  getCateServiceList(){
    this.isLoaderAdmin = true;
    let requestObject = {
        'business_id': this.businessId,
        'search': ""
    };

    this.adminSettingsService.getCateServiceList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.categoryServiceList = response.response;

        this.categoryServiceList.forEach(element => {
          element.is_selected  = false;
          
          element.subcategory.forEach(subelement => {
            subelement.is_selected = false;
            subelement.services.forEach(serviceselement => {
              serviceselement.is_selected = false;
              const index = this.selectedServiceNewStaff.indexOf(serviceselement.id, 0);
              if (index > -1) {
                this.categoryServiceCheckServiceId.push(serviceselement.id);
                serviceselement.is_selected = true;
              }
            });
          });

          if(element.getservices){
            element.getservices.forEach(serviceselement => {
              serviceselement.is_selected = false;
              const index = this.selectedServiceNewStaff.indexOf(serviceselement.id, 0);
              if (index > -1) {
                this.categoryServiceCheckServiceId.push(serviceselement.id);
                serviceselement.is_selected = true;
              }
            });
          }

        });

        this.categoryServiceListTemp=this.categoryServiceList;

        this.isLoaderAdmin = false;
      } else if(response.data == false && response.response !== 'api token or userid invaild'){

        this.categoryServiceList = [];
        this.categoryServiceListTemp = [];
        this.isLoaderAdmin = false;

      }
    });

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


    this.categoryServiceCheckServiceId = [];
    this.categoryServiceList.forEach(element => {
      element.subcategory.forEach(subelement => {
        subelement.services.forEach(serviceselement => {
          if(serviceselement.is_selected == true){
            this.categoryServiceCheckServiceId.push(serviceselement.id)
          }
        });
      });
    });

  }

  fnNewCheckService(event,serviceId,index,service_index){

    if(event == true){
      this.categoryServiceCheckServiceId.push(serviceId) 
    }else if(event == false){
      const index = this.categoryServiceCheckServiceId.indexOf(serviceId);
      this.categoryServiceCheckServiceId.splice(index, 1);
    }

    this.categoryServiceList[index].getservices[service_index].is_selected=event;
    var category_i = 0;
    this.categoryServiceList[index].getservices.forEach(serviceselement => {
      if(serviceselement.is_selected==true){
        category_i = category_i+1;
      }
    });

    if(category_i == this.categoryServiceList[index].getservices.length){
      this.categoryServiceList[index].is_selected = true;
    }else{
      this.categoryServiceList[index].is_selected = false;
    }

    
    console.log(this.categoryServiceCheckServiceId);

  }


  fnCheckService(event,serviceId){
    if(event == true){
      this.selectedServiceNewStaff.push(serviceId) 
    }else if(event == false){
      const index = this.selectedServiceNewStaff.indexOf(serviceId);
      this.selectedServiceNewStaff.splice(index, 1);
    }
    console.log(this.selectedServiceNewStaff);
  }

  fnSubmitCreateStaff(){
    console.log(this.StaffCreate.get('staff_id').value);
    if(this.StaffCreate.get('staff_id').value != ''){
      if(this.StaffCreate.valid){
        // New code by RJ
            let formData = new FormData();
            var i=0;
            this.files.forEach(element => {
              formData.append('document[]', this.files[i]); 
              i++;
            });
            formData.append('staff_id', this.StaffCreate.get('staff_id').value);
            formData.append('firstname', this.StaffCreate.get('firstname').value);
            formData.append('lastname', this.StaffCreate.get('lastname').value);
            formData.append('email', this.StaffCreate.get('email').value);
            formData.append('phone', this.StaffCreate.get('phone').value);
            formData.append('address', this.StaffCreate.get('address').value);
            formData.append('description', this.StaffCreate.get('description').value);
            formData.append('servicelist', this.categoryServiceCheckServiceId);
            
            if(this.staffImageUrl!=undefined){
              formData.append('image', this.staffImageUrl);
            }
              
        
        this.updateStaff(formData);
      }else{
        this.StaffCreate.get('firstname').markAsTouched();
        this.StaffCreate.get('lastname').markAsTouched();
        this.StaffCreate.get('email').markAsTouched();
        this.StaffCreate.get('phone').markAsTouched();
        this.StaffCreate.get('address').markAsTouched();
        this.StaffCreate.get('description').markAsTouched();
      }
    }
    else{ 
      if(this.StaffCreate.valid){

        let formData = new FormData();
        var i=0;
        this.files.forEach(element => {
          formData.append('document[]', this.files[i]); 
          i++;
        });
        
        formData.append('business_id', this.businessId);        
        formData.append('firstname', this.StaffCreate.get('firstname').value);
        formData.append('lastname', this.StaffCreate.get('lastname').value);
        formData.append('email', this.StaffCreate.get('email').value);
        formData.append('phone', this.StaffCreate.get('phone').value);
        formData.append('address', this.StaffCreate.get('address').value);
        formData.append('description', this.StaffCreate.get('description').value);
        formData.append('servicelist', this.categoryServiceCheckServiceId);
        formData.append('image', this.staffImageUrl);
         this.createNewStaff(formData);
      }else{
        this.StaffCreate.get('firstname').markAsTouched();
        this.StaffCreate.get('lastname').markAsTouched();
        this.StaffCreate.get('email').markAsTouched();
        this.StaffCreate.get('phone').markAsTouched();
        this.StaffCreate.get('address').markAsTouched();
        this.StaffCreate.get('description').markAsTouched();
      }
    }
  }
  createNewStaff(newStaffData){
    this.isLoaderAdmin = true;
    this.adminSettingsService.createNewStaff(newStaffData).subscribe((response:any) => {
      this.isLoaderAdmin = false;
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
          });
         this.getAllStaff();
         this.StaffCreate.reset();
         this.staffImageUrl = undefined
         this.addStaffPage = false;
         this.staffListPage = true;
        this.isLoaderAdmin = false;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.isLoaderAdmin = false;
      }
    });

  }
  updateStaff(updateStaffData){
    this.isLoaderAdmin = true;
    this.adminSettingsService.updateStaff(updateStaffData).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
          });
         this.getAllStaff();
         this.StaffCreate.reset();
         this.staffImageUrl = undefined
         this.addStaffPage = false;
         this.staffListPage = true;
        this.isLoaderAdmin = false;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){

        this.isLoaderAdmin = false;
      }
    })
  }
  fnDeleteStaff(staffId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(staffId);
        this.selectedStaffId = staffId
        this.isLoaderAdmin = true;
        let requestObject = {
            'staff_id': this.selectedStaffId,
            'business_id': this.businessId,
        };
        this.adminSettingsService.fnDeleteStaff(requestObject).subscribe((response:any) => {
            if(response.data == true){
              this._snackBar.open(response.response, "X", {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: ['green-snackbar']
              });
            this.getAllStaff();
            this.singleStaffView = false;
            this.staffListPage = true;
            this.isLoaderAdmin = false;
          }
          else if(response.data == false && response.response !== 'api token or userid invaild'){
            this.isLoaderAdmin = false;
          }
        })
      }
    });
  }
  fnEditStaff(staffId){
    this.editStaffId = staffId
    this.isLoaderAdmin = true;
    this.addStaffPage = true;
    this.staffListPage = false;
    this.singleStaffView = false;
    this.selectedServiceNewStaff=[];
    // this.validationArr=this.isEmailUnique.bind(this);
    // this.StaffCreate.get('email').clearValidators();
    // this.StaffCreate.controls['email'].setValidators([this.singleStaffDetail.staff[0].email,[Validators.required,Validators.pattern(this.emailFormat)],this.isEmailUnique.bind(this)]); 
    // this.StaffCreate.controls['email'].setValidators([Validators.required,Validators.email,Validators.pattern(this.emailFormat),this.isEmailUnique.bind(this)]);


    //this.StaffCreate.controls['email'].setValidators([[Validators.required,Validators.pattern(this.emailFormat)],this.isEmailUnique.bind(this)]);
    // this.StaffCreate.controls['email'].updateValueAndValidity();

    this.StaffCreate = this._formBuilder.group({
      firstname : ['',[ Validators.required,Validators.minLength(3),Validators.maxLength(11)]],
      lastname : ['', [Validators.required,Validators.minLength(3),Validators.maxLength(11)]],
      address : ['', [Validators.required,Validators.minLength(3),Validators.maxLength(255)]],
      email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)],this.isEmailUniqueForEdit.bind(this)],
      phone : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
      description : ['',Validators.maxLength(255)],
      staff_id : [''],
    });

    this.StaffCreate.controls['firstname'].setValue(this.singleStaffDetail.staff[0].firstname);
    this.StaffCreate.controls['lastname'].setValue(this.singleStaffDetail.staff[0].lastname);
    this.StaffCreate.controls['phone'].setValue(this.singleStaffDetail.staff[0].phone);
    this.StaffCreate.controls['address'].setValue(this.singleStaffDetail.staff[0].address);
    this.StaffCreate.controls['description'].setValue(this.singleStaffDetail.staff[0].description);
    this.StaffCreate.controls['email'].setValue(this.singleStaffDetail.staff[0].email);
    this.StaffCreate.controls['staff_id'].setValue(staffId);
    this.singleStaffDetail.staff[0].services.forEach(element => {
      // this.selectedServicesArr.push(element.id);
      this.selectedServiceNewStaff.push(element.id);
    });
    console.log("selectedServiceNewStaff");
    console.log(this.selectedServiceNewStaff);

    this.getCateServiceList();
    this.isLoaderAdmin = false;
  }

 fnBackStaff(){
   this.addStaffPage = false;
  this.staffListPage = true;
    this.singleStaffView = false;

 }

 fnCancelStaff(){
   if(this.editStaffId){
    this.staffImageUrl = undefined
    this.addStaffPage = false;
    this.staffListPage = false;
    this.singleStaffView = true;
    this.StaffCreate.reset();
   }else{
    this.staffImageUrl = undefined
    this.addStaffPage = false;
    this.staffListPage = true;
    this.singleStaffView = false;
    this.StaffCreate.reset();
   }
   
 }






  addTimeOff() {
    const dialogRef = this.dialog.open(DialogAddNewTimeOff, {
      width: '500px',
      data:{selectedStaffId:this.selectedStaffId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result != undefined){
        if(result.call==true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
       }
      }
    });
  }

  staffImage() {
    const dialogRef = this.dialog.open(DialogStaffImageUpload, {
      width: '500px',

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.staffImageUrl = result;
        this.singleStaffDetail.staff[0].image=result;
      }
    });
  }

  fnGetTimeSlotsList(start, end,interval){
    var start = start.split(":");
    var end = end.split(":");

    start = parseInt(start[0]) * 60 + parseInt(start[1]);
    end = parseInt(end[0]) * 60 + parseInt(end[1]);

    var result = [];

    for ( var time = start; time <= end; time+=parseInt(interval)){
        result.push( this.timeString(time));
    }
  
    this.timeSlotList=result;
    //console.log(this.timeSlotList[0]);
  }

  timeString(time){
      var hours = Math.floor(time / 60);
      var minutes = time % 60;

      if (hours < 10)
      {
        let h="0" + hours;
        hours = parseFloat(h); //optional
      } 
      if (minutes < 10)
      {
        let m="0" + minutes;
        minutes = parseFloat(m); //optional
      }  
      let tempArr={
        //long: hours + ":" + minutes,
        long: this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+hours + ":" + minutes),"HH:mm"),
        short:this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+hours + ":" + minutes),"hh:mm a")
      };
     return tempArr;
  }

  fnChangeToggle(event,day){
//    console.log(event);
    if(day=="Monday"){
      this.mondayOn=event.checked;
    }
    if(day=="Tuesday"){
      this.tuesdayOn=event.checked;
    }
    if(day=="Wednesday"){
      this.wednesdayOn=event.checked;
    }
    if(day=="Thursday"){
      this.thursdayOn=event.checked;
    }
    if(day=="Friday"){
      this.fridayOn=event.checked;
    }
    if(day=="Saturday"){
      this.saturdayOn=event.checked;
    }
    if(day=="Sunday"){
      this.sundayOn=event.checked;
    }
    
    this.fnFormBuild(this.mondayOn,this.tuesdayOn,this.wednesdayOn,this.thursdayOn,this.fridayOn,this.saturdayOn,this.sundayOn);
  }

  fnOnChangeStartTimeWorkingHour(event,day){
    // console.log(event);
    // console.log(day);
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.mondayWorkingHourEndTimeIndex<=this.mondayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["mondayEndTime"].setValue(null);
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.tuesdayWorkingHourEndTimeIndex<=this.tuesdayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["tuesdayEndTime"].setValue(null);
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.wednesdayWorkingHourEndTimeIndex<=this.wednesdayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["wednesdayEndTime"].setValue(null);
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.thursdayWorkingHourEndTimeIndex<=this.thursdayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["thursdayEndTime"].setValue(null);
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.fridayWorkingHourEndTimeIndex<=this.fridayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["fridayEndTime"].setValue(null);
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.saturdayWorkingHourEndTimeIndex<=this.saturdayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["saturdayEndTime"].setValue(null);
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.sundayWorkingHourEndTimeIndex<=this.sundayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["sundayEndTime"].setValue(null);
      }
    }

  }

  fnOnChangeEndTimeWorkingHour(event,day){
    // console.log(event);
    // console.log(day);
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayWorkingHourEndTimeIndex=i;
        }
      }
    }
  }

  fnFormBuild(mondayOn,tuesdayOn,wednesdayOn,thursdayOn,fridayOn,saturdayOn,sundayOn){
   // console.log(mondayOn+"--"+tuesdayOn+"--"+wednesdayOn+"--"+thursdayOn+"--"+fridayOn+"--"+saturdayOn+"--"+sundayOn);
    this.formSetWorkingHours = this._formBuilder.group({
      mondayToggle: [this.formSetWorkingHours.get("mondayToggle").value?true:false,mondayOn?Validators.required:''],
      mondayStartTime: [this.formSetWorkingHours.get("mondayStartTime").value,mondayOn?Validators.required:''],
      mondayEndTime: [this.formSetWorkingHours.get("mondayEndTime").value,mondayOn?Validators.required:''],
      tuesdayToggle: [this.formSetWorkingHours.get("tuesdayToggle").value?true:false,tuesdayOn?Validators.required:''],
      tuesdayStartTime: [this.formSetWorkingHours.get("tuesdayStartTime").value,tuesdayOn?Validators.required:''],
      tuesdayEndTime: [this.formSetWorkingHours.get("tuesdayEndTime").value,tuesdayOn?Validators.required:''],
      wednesdayToggle: [this.formSetWorkingHours.get("wednesdayToggle").value?true:false,wednesdayOn?Validators.required:''],
      wednesdayStartTime: [this.formSetWorkingHours.get("wednesdayStartTime").value,wednesdayOn?Validators.required:''],
      wednesdayEndTime: [this.formSetWorkingHours.get("wednesdayEndTime").value,wednesdayOn?Validators.required:''],
      thursdayToggle: [this.formSetWorkingHours.get("thursdayToggle").value?true:false,thursdayOn?Validators.required:''],
      thursdayStartTime: [this.formSetWorkingHours.get("thursdayStartTime").value,thursdayOn?Validators.required:''],
      thursdayEndTime: [this.formSetWorkingHours.get("thursdayEndTime").value,thursdayOn?Validators.required:''],
      fridayToggle: [this.formSetWorkingHours.get("fridayToggle").value?true:false,fridayOn?Validators.required:''],
      fridayStartTime: [this.formSetWorkingHours.get("fridayStartTime").value,fridayOn?Validators.required:''],
      fridayEndTime: [this.formSetWorkingHours.get("fridayEndTime").value,fridayOn?Validators.required:''],
      saturdayToggle: [this.formSetWorkingHours.get("saturdayToggle").value?true:false,saturdayOn?Validators.required:''],
      saturdayStartTime: [this.formSetWorkingHours.get("saturdayStartTime").value,saturdayOn?Validators.required:''],
      saturdayEndTime: [this.formSetWorkingHours.get("saturdayEndTime").value,saturdayOn?Validators.required:''],
      sundayToggle: [this.formSetWorkingHours.get("sundayToggle").value?true:false,sundayOn?Validators.required:''],
      sundayStartTime: [this.formSetWorkingHours.get("sundayStartTime").value,sundayOn?Validators.required:''],
      sundayEndTime: [this.formSetWorkingHours.get("sundayEndTime").value,sundayOn?Validators.required:''],
    })
  }

  fnCreateWorkingHours(){
    this.isLoaderAdmin = true;
    if(this.formSetWorkingHours.invalid){
      return false;
    }
    let workingHoursArray:any=[];
    let workingHoursTempArray={
      dayNumber:"",
      start_time:"",
      end_time:"",
      offday:""
    };

    workingHoursTempArray={
      dayNumber:"1",
      start_time:this.formSetWorkingHours.get("mondayStartTime").value,
      end_time:this.formSetWorkingHours.get("mondayEndTime").value,
      offday:this.formSetWorkingHours.get("mondayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"2",
      start_time:this.formSetWorkingHours.get("tuesdayStartTime").value,
      end_time:this.formSetWorkingHours.get("tuesdayEndTime").value,
      offday:this.formSetWorkingHours.get("tuesdayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"3",
      start_time:this.formSetWorkingHours.get("wednesdayStartTime").value,
      end_time:this.formSetWorkingHours.get("wednesdayEndTime").value,
      offday:this.formSetWorkingHours.get("wednesdayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"4",
      start_time:this.formSetWorkingHours.get("thursdayStartTime").value,
      end_time:this.formSetWorkingHours.get("thursdayEndTime").value,
      offday:this.formSetWorkingHours.get("thursdayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"5",
      start_time:this.formSetWorkingHours.get("fridayStartTime").value,
      end_time:this.formSetWorkingHours.get("fridayEndTime").value,
      offday:this.formSetWorkingHours.get("fridayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"6",
      start_time:this.formSetWorkingHours.get("saturdayStartTime").value,
      end_time:this.formSetWorkingHours.get("saturdayEndTime").value,
      offday:this.formSetWorkingHours.get("saturdayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"0",
      start_time:this.formSetWorkingHours.get("sundayStartTime").value,
      end_time:this.formSetWorkingHours.get("sundayEndTime").value,
      offday:this.formSetWorkingHours.get("sundayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);
   // console.log(JSON.stringify(workingHoursArray));
    let requestObject={
      "staff_id":this.selectedStaffId,
      "workingHour":workingHoursArray
    }
   // console.log(JSON.stringify(requestObject));

    this.adminSettingsService.createWorkingHoursStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open("Working Hours Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open("Working Hours Not Updated", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnApplyToAll(){
    if(!this.mondayOn){
      return false;
    }
    if(this.formSetWorkingHours.get("mondayToggle").value){
      if(this.formSetWorkingHours.get("mondayStartTime").value == '' || this.formSetWorkingHours.get("mondayEndTime").value == '' || this.formSetWorkingHours.get("mondayStartTime").value == null || this.formSetWorkingHours.get("mondayEndTime").value == null){
        return false;
      }
    }
    this.isLoaderAdmin = true;
    let requestObject={
      "staff_id":this.selectedStaffId,
      "start_time":this.formSetWorkingHours.get("mondayStartTime").value,
      "end_time":this.formSetWorkingHours.get("mondayEndTime").value,
      "off_day":this.formSetWorkingHours.get("mondayToggle").value?"N":"Y"
    }
   // console.log(JSON.stringify(requestObject));
    
    this.adminSettingsService.applyToAllStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open("Working Hours applied to all", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open("Working Hours Not Updated", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnWorkingHoursResetToDefault(){
    this.isLoaderAdmin = true;
    let requestObject={
      "business_id":this.businessId,
      "staff_id":this.selectedStaffId
    }
    this.adminSettingsService.workingHoursResetToDefault(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open("Working Hours Reset", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open("Working Hours Not Reset", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }
  
  fnShowAddBreakForm(day){
    if(day == "Monday"){
      this.selectedStartTimeMonday=this.timeSlotList[0].long;
      this.selectedEndTimeMonday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showMondayAddForm=this.showMondayAddForm==true?false:true;
      this.mondayBreakStartTimeIndex=0;
      this.mondayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Tuesday"){
      this.selectedStartTimeTuesday=this.timeSlotList[0].long;
      this.selectedEndTimeTuesday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showTuesdayAddForm=this.showTuesdayAddForm==true?false:true;
      this.tuesdayBreakStartTimeIndex=0;
      this.tuesdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Wednesday"){
      this.selectedStartTimeWednesday=this.timeSlotList[0].long;
      this.selectedEndTimeWednesday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showWednesdayAddForm=this.showWednesdayAddForm==true?false:true;
      this.wednesdayBreakStartTimeIndex=0;
      this.wednesdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Thursday"){
      this.selectedStartTimeThursday=this.timeSlotList[0].long;
      this.selectedEndTimeThursday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showThursdayAddForm=this.showThursdayAddForm==true?false:true;
      this.thursdayBreakStartTimeIndex=0;
      this.thursdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Friday"){
      this.selectedStartTimeFriday=this.timeSlotList[0].long;
      this.selectedEndTimeFriday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showFridayAddForm=this.showFridayAddForm==true?false:true;
      this.fridayBreakStartTimeIndex=0;
      this.fridayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Saturday"){
      this.selectedStartTimeSaturday=this.timeSlotList[0].long;
      this.selectedEndTimeSaturday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showSaturdayAddForm=this.showSaturdayAddForm==true?false:true;
      this.saturdayBreakStartTimeIndex=0;
      this.saturdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Sunday"){
      this.selectedStartTimeSunday=this.timeSlotList[0].long;
      this.selectedEndTimeSunday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showSundayAddForm=this.showSundayAddForm==true?false:true;
      this.sundayBreakStartTimeIndex=0;
      this.sundayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
  }

  fnOnChangeStartTimeBreak(event,day){
    // console.log(event);
    // console.log(day);
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayBreakStartTimeIndex=i;
        }
      }
      if(this.mondayBreakEndTimeIndex<=this.mondayBreakStartTimeIndex){
        this.selectedEndTimeMonday=null;
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayBreakStartTimeIndex=i;
        }
      }
      if(this.tuesdayBreakEndTimeIndex<=this.tuesdayBreakStartTimeIndex){
        this.selectedEndTimeTuesday=null;
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayBreakStartTimeIndex=i;
        }
      }
      if(this.wednesdayBreakEndTimeIndex<=this.wednesdayBreakStartTimeIndex){
        this.selectedEndTimeWednesday=null;
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayBreakStartTimeIndex=i;
        }
      }
      if(this.thursdayBreakEndTimeIndex<=this.thursdayBreakStartTimeIndex){
        this.selectedEndTimeThursday=null;
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayBreakStartTimeIndex=i;
        }
      }
      if(this.fridayBreakEndTimeIndex<=this.fridayBreakStartTimeIndex){
        this.selectedEndTimeFriday=null;
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayBreakStartTimeIndex=i;
        }
      }
      if(this.saturdayBreakEndTimeIndex<=this.saturdayBreakStartTimeIndex){
        this.selectedEndTimeSaturday=null;
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayBreakStartTimeIndex=i;
        }
      }
      if(this.sundayBreakEndTimeIndex<=this.sundayBreakStartTimeIndex){
        this.selectedEndTimeSunday=null;
      }
    }

  }

  fnOnChangeEndTimeBreak(event,day){
    // console.log(event);
    // console.log(day);
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayBreakEndTimeIndex=i;
        }
      }
    }
  }

  fnAddBreak(day){
    let requestObject={
      "staff_id":'',
      "start_time":'',
      "end_time":'',
      "dayNumber":''
    }
    if(day == "Monday"){
      if(this.selectedStartTimeMonday==null || this.selectedEndTimeMonday==null){
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeMonday,
        "end_time":this.selectedEndTimeMonday,
        "dayNumber":"1"
      }
     // console.log(requestObject);
    }
    if(day == "Tuesday"){
      if(this.selectedStartTimeTuesday==null || this.selectedEndTimeTuesday==null){
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeTuesday,
        "end_time":this.selectedEndTimeTuesday,
        "dayNumber":"2"
      }
      console.log(requestObject);
    }
    if(day == "Wednesday"){
      if(this.selectedStartTimeWednesday==null || this.selectedEndTimeWednesday==null){
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeWednesday,
        "end_time":this.selectedEndTimeWednesday,
        "dayNumber":"3"
      }
      console.log(requestObject);
    }
    if(day == "Thursday"){
      if(this.selectedStartTimeThursday==null || this.selectedEndTimeThursday==null){
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeThursday,
        "end_time":this.selectedEndTimeThursday,
        "dayNumber":"4"
      }
      console.log(requestObject);
    }
    if(day == "Friday"){
      if(this.selectedStartTimeFriday==null || this.selectedEndTimeFriday==null){
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeFriday,
        "end_time":this.selectedEndTimeFriday,
        "dayNumber":"5"
      }
      console.log(requestObject);
    }
    if(day == "Saturday"){
      if(this.selectedStartTimeSaturday==null || this.selectedEndTimeSaturday==null){
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeSaturday,
        "end_time":this.selectedEndTimeSaturday,
        "dayNumber":"6"
      }
      console.log(requestObject);
    }
    if(day == "Sunday"){
      if(this.selectedStartTimeSunday==null || this.selectedEndTimeSunday==null){
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeSunday,
        "end_time":this.selectedEndTimeSunday,
        "dayNumber":"0"
      }
      console.log(requestObject);
    }
    this.isLoaderAdmin = true;
    this.adminSettingsService.addNewBreakStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this.showMondayAddForm=false;
        this.showTuesdayAddForm=false;
        this.showWednesdayAddForm=false;
        this.showThursdayAddForm=false;
        this.showFridayAddForm=false;
        this.showSaturdayAddForm=false;
        this.showSundayAddForm=false;
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnDeleteBreak(breakId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isLoaderAdmin = true;
        console.log(breakId);
        let requestObject={
          "staff_id":this.selectedStaffId ,
          "break_id":breakId
        }

        this.adminSettingsService.deleteBreakStaff(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
          }else if(response.data == false && response.response !== 'api token or userid invaild'){
          this.isLoaderAdmin = false;
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
          }
        })
      }
    });
  }

  fnResetToDefaultBreak(){
    this.isLoaderAdmin = true;
    let requestObject={
      "staff_id":this.selectedStaffId ,
      "business_id":this.businessId
    }

    this.adminSettingsService.resetToDefaultBreakStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnChangeTimeOffStatus(event,timeOffId){
    this.isLoaderAdmin = true;
    console.log(event.checked+"--"+timeOffId);
    let requestObject={
      "staff_id":this.selectedStaffId ,
      "time_off_id":timeOffId,
      "status":event.checked?"E":"D"
    }

    this.adminSettingsService.changeTimeOffStatusStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnResetToDefaultTimeOff(){
    this.isLoaderAdmin = true;
    let requestObject={
      "staff_id":this.selectedStaffId ,
      "business_id":this.businessId
    }

    this.adminSettingsService.resetToDefaultTimeOffStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnDeleteTimeOff(timeOffId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isLoaderAdmin = true;
        console.log(timeOffId);
        let requestObject={
          "time_off_id":timeOffId
        }

        this.adminSettingsService.deleteTimeOff(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
          }else if(response.data == false && response.response !== 'api token or userid invaild'){
            this.isLoaderAdmin = false;
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }
        })
      }
    });
  }

  viewStaffReviewDetail(index,OrderId){
    this.isLoaderAdmin = true;
    this.adminSettingsService.viewStaffReviewDetail(OrderId).subscribe((response:any) => {
      if(response.data == true){
        this.reviewOrderData = response.response;
        console.log(this.reviewOrderData)
        this.reviewOrderData.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")   
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
        });

         const dialogRef = this.dialog.open(DialogStaffViewReview, {
          height: '700px',
          data :{fulldata : this.singleStaffDetail.staff[0].review[index], orderData : this.reviewOrderData}
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.animal = result;
        });
        this.isLoaderAdmin = false;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.isLoaderAdmin = false;
      }
    })
  }  
  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
    //return error.error ? error.error : error.statusText;
  }
  
  isEmailUnique(control: FormControl){
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
  sendEmailVerification(staffId){
    let requestObject={
      "staff_id":staffId
    }
    this.isLoaderAdmin = true;
    this.adminSettingsService.sendEmailVerification(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.isLoaderAdmin = false;
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  sendPhoneVerification(staffId){
    let requestObject={
      "staff_id":staffId
    }
    this.isLoaderAdmin = true;
    this.adminSettingsService.sendPhoneVerification(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.isLoaderAdmin = false;
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  postalCodeSearch(){
    this.isLoaderAdmin=true;
    if(this.search.postalCode.length > 1){
      let requestObject = {
        "search":this.search.postalCode,
        "business_id":this.businessId,
      }
      console.log(requestObject);
      this.adminSettingsService.postalCodeSearch(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this.singleStaffDetail.postalCode = response.response;
          this.isLoaderAdmin=false;
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
          this.singleStaffDetail.postalCode = [];
          this.isLoaderAdmin=false;
        }
      })
    }else{
      this.fnViewSingleStaff(this.selectedStaffId,this.singleStaffIndex);
      this.isLoaderAdmin=false;
    }
  }

  staffSearch(){
    
    if(this.search.staff.length > 2){
      this.isLoaderAdmin=true;
      let requestObject = {
        "search":this.search.staff,
        "business_id":this.businessId,
      }
      console.log(requestObject);
      this.adminSettingsService.staffSearch(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this.current_page = response.response.current_page;
          this.first_page_url = response.response.first_page_url;
          this.last_page = response.response.last_page;
          this.last_page_url = response.response.last_page_url;
          this.next_page_url = response.response.next_page_url;
          this.prev_page_url = response.response.prev_page_url;
          this.path = response.response.path;
          this.allStaffList = response.response.data;

          this.allStaffList.forEach( (element) => { 
            element.is_selected = false;
          });
          this.selectAll = false;

          this.isLoaderAdmin=false;
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
          this.allStaffList = [];
          this.isLoaderAdmin=false;
        }
      })
    }else{
      this.getAllStaff();
      this.isLoaderAdmin=false;
    }
  }

}
@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/staff-view-review-dialog.html',
})
export class DialogStaffViewReview {
detailsData: any;
orderDataFull:any;
constructor(
  public dialogRef: MatDialogRef<DialogStaffViewReview>,
  private adminSettingsService: AdminSettingsService,
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

@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/add-new-time-off-dialog.html',
  providers: [DatePipe]
})
export class DialogAddNewTimeOff {
  businessId:any;
  selectedStaffId:any;
  minStartDate = new Date();
  minEndDate = new Date();
  formAddNewTimeOff: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogAddNewTimeOff>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder, 
    public adminSettingsService: AdminSettingsService,
    private _snackBar: MatSnackBar) {
    this.formAddNewTimeOff = this._formBuilder.group({
      startDate: [this.minStartDate,Validators.required],
      endDate: ['',Validators.required],
      description: ['',Validators.required],
    });
    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
    }
    this.selectedStaffId=this.data.selectedStaffId;
  }

  fnDateChange(event: MatDatepickerInputEvent<Date>){
    console.log(event);
    this.minEndDate=event.value
  }

  onNoClick(): void {
    this.dialogRef.close({ call: false });
  }

  fnAddNewTimeOff(){
    if(this.formAddNewTimeOff.invalid){
      this.formAddNewTimeOff.get("startDate").markAsTouched();
      this.formAddNewTimeOff.get("endDate").markAsTouched();
      this.formAddNewTimeOff.get("description").markAsTouched();
      return false;
    }
    let requestObject={
      "staff_id":this.selectedStaffId,
      "start_date":this.datePipe.transform(new Date(this.formAddNewTimeOff.get("startDate").value),"yyyy-MM-dd"),
      "end_date":this.datePipe.transform(new Date(this.formAddNewTimeOff.get("endDate").value),"yyyy-MM-dd"),
      "description":this.formAddNewTimeOff.get("description").value
    }
    console.log(JSON.stringify(requestObject));
    this.adminSettingsService.addNewTimeOffStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.dialogRef.close({ call: true });
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

}

@Component({
  selector: 'staff-image-upload',
  templateUrl: '../_dialogs/staff-upload-profile-image-dialog.html',
})
export class DialogStaffImageUpload {

  uploadForm: FormGroup;
  imageSrc: string;
  profileImage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogStaffImageUpload>,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

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
    
      var file_type = event.target.files[0].type;
      if(file_type!='image/jpeg' &&  file_type!='image/png' && file_type!='image/jpg' &&  file_type!='image/gif'){
          this._snackBar.open("Sorry, only JPG, JPEG, PNG & GIF files are allowed", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
          });
          return;
      }

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
