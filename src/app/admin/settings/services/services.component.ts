import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
//import { SettingsComponent } from '../settings.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

import { AuthenticationService } from '@app/_services';
import { AdminSettingsService } from '../_services/admin-settings.service'

@Component({
  selector: 'settings-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  
  allCetegoryList : any;
  allServicesList : any;
  allCategoryCount : any;
  allServiceCount : any;
  categoryServicesList : any;
  service_filter: any = 'all';
  servicesList :boolean = true;
  adminSettings : boolean = true;
  selectedCategoryDetails : any;
  selectCategoryPage : boolean = false;
  createNewCategoryPage : boolean = false;
  createNewSubCategoryPage : boolean = false;
  createNewServicePage : boolean = false;
  categoryPage : boolean = false;
  singleSubCategoryPage : boolean = false;
  subCategoryPage : boolean = false;
  addNewServicePage : boolean = false;
  isLoaderAdmin : boolean = false;

  createSubCategory: FormGroup;
  constructor(
    
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private adminSettingsService: AdminSettingsService,
  ) { 
  }

  ngOnInit() {
    this.fnAllCategory();
    this.fnAllServices();

    this.createSubCategory = this._formBuilder.group({
      subcategory_name : ['', Validators.required],
      subcategory_description : ['', Validators.required],
     });

  }
  fnCreateNewCategory(){
    this.createNewCategoryPage = true;
    this.selectCategoryPage = false;
  }
  cancelNewCategory(){
    this.createNewCategoryPage = false;
  }

  fnAllServices(){
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnAllServices().subscribe((response:any) => {
      if(response.data == true){
        this.allServicesList = response.response
        if(this.allServicesList != ''){
          this.servicesList = true;
         this.allServiceCount = this.allServicesList.length
        }else if(this.allServicesList == ''){
          this.servicesList = false;
        }
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
       this.allServicesList = '';
       this.isLoaderAdmin = false;
      }
    })
  }

  fnAllCategory(){
    this.isLoaderAdmin = true;
     this.adminSettingsService.fnAllCategory().subscribe((response:any) => {
       if(response.data == true){
         this.allCetegoryList = response.response
         this.allCategoryCount = this.allCetegoryList.length
        this.isLoaderAdmin = false;
       }
       else if(response.data == false){
        this.allCetegoryList = '';
        this.isLoaderAdmin = false;
       }
     })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allServicesList, event.previousIndex, event.currentIndex);
  }
  
  
  fnSelectCategory(categoryId,index){
    this.isLoaderAdmin = true;
    this.adminSettingsService.getServiceForCategoiry(categoryId,this.service_filter).subscribe((response:any) => {
      if(response.data == true){
        this.categoryServicesList = response.response
        if(this.categoryServicesList != ''){
          this.servicesList = false;
          this.selectCategoryPage = true;
          this.selectedCategoryDetails = this.allCetegoryList[index]
          console.log(this.selectedCategoryDetails);
        }else if(this.categoryServicesList == ''){
          this.selectCategoryPage = false;
        }
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
       this.categoryServicesList = '';
       this.isLoaderAdmin = false;
      }
    })
  }
  changeServiceStaus(event,serviceId){
    console.log(event);
  }
  fnCreateNewSubCategoryPage(categoryId){
    this.selectCategoryPage = false;
    this.createNewSubCategoryPage = true;
  }
  fnCreateNewSubCategory(){

  }


}
