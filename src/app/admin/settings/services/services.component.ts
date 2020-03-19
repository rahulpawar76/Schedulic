import { Component, OnInit,Inject  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
//import { SettingsComponent } from '../settings.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthenticationService } from '@app/_services';
import { AdminSettingsService } from '../_services/admin-settings.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
    animal: string;
    name: string;
  }

@Component({
    selector: 'settings-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    categoryImageUrl:any;
    subCategoryImageUrl:any;
    serviceImageUrl:any;
    animal: any;



    allCetegoryList: any;
    allServicesList: any;
    allCategoryCount: any;
    allServiceCount: any;
    editCategoryId: any;
    editSubCategoryId: any;
    currentCategoryStatus: any;
    currentSubCategoryStatus: any;
    businessId: any;
    selectedValue: any;
    createServiceCategoryId: any;
    createServiceCategoryType: any;
    editServiceId: any;
    categoryServicesList: any;
    subCategoryServicesList: any;
    service_filter: any = 'all';
    subcategory_service_filter: any = 'all';
    servicesList: boolean = true;
    adminSettings: boolean = true;
    selectedCategoryDetails: any;
    selectedSubCategoryDetails: any;
    selectCategoryPage: any = '';
    createNewCategoryPage: boolean = false;
    createNewSubCategoryPage: boolean = false;
    createNewServicePage: boolean = false;
    singleSubCategoryPage: any = '';
    subCategoryPage: boolean = false;
    addNewServicePage: boolean = false;
    isLoaderAdmin: boolean = false;
    parentCategoryId: any;
    singleServiceStatus: any;
    selectedCategoryIndex: any;
    selectedSubCategoryIndex: any;
    newSubcategoryStatus: any = 'D';
    newSubcategoryPrivate: any = 'N';
    editSubcategoryStatus: any = 'D';
    editSubcategoryPrivate: any = 'N';
    newcategoryStatus: any = 'D';
    newcategoryPrivate: any = 'N';
    editcategoryStatus: any = 'D';
    editcategoryPrivate: any = 'N';
    newServicePrivate: any = 'N';
    newServiceStatus: any = 'D';
    editServicePrivate: any = 'N';
    editServiceStatus: any = 'D';
    newSubCategoryData: any;
    updateSubCategoryData: any;
    newCategoryData: any;
    newServiceData: any;
    updateServiceData: any;
    actionServiceIdarr: any = [];
    updateCategoryData: any;
    editServiceStatusPrevious: any;
    editServicePrivateStatusPrevious: any;
    editServiceImage: any;
    createSubCategory: FormGroup;
    createCategory: FormGroup;
    createService: FormGroup;

    onlynumeric = /^-?(0|[1-9]\d*)?$/
    constructor(
        // private userService: UserService,

        public dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private adminSettingsService: AdminSettingsService,
    ) {
        localStorage.setItem('isBusiness', 'false');
        if (localStorage.getItem('business_id')) {
            this.businessId = localStorage.getItem('business_id');
        }
    }

    ngOnInit() {
        this.fnAllCategory();
        this.fnAllServices();

        this.createSubCategory = this._formBuilder.group({
            subcategory_name: ['', Validators.required],
            subcategory_description: ['', Validators.required],
            subcategory_id: [''],
        });
        this.createCategory = this._formBuilder.group({
            category_name: ['', Validators.required],
            category_description: ['', Validators.required],
            category_id: [''],
        });
        this.createService = this._formBuilder.group({
            service_name: ['', Validators.required],
            service_description: ['', Validators.required],
            service_cost: ['', [Validators.required, Validators.pattern(this.onlynumeric)]],
            service_duration: ['', [Validators.required, Validators.pattern(this.onlynumeric)]],
            service_unit: ['', [Validators.required, Validators.pattern(this.onlynumeric)]],
            service_id: [''],
        });

    }
    fnCreateNewCategory() {
        this.createNewCategoryPage = true;
        this.selectCategoryPage = '';
        this.servicesList = false;
        this.createNewSubCategoryPage = false;
    }
    cancelNewCategory() {
        this.createNewCategoryPage = false;
    }

    fnAllServices() {
        this.isLoaderAdmin = true;
        this.createNewCategoryPage = false;
        this.createNewSubCategoryPage = false;
        this.createNewServicePage = false;
        this.singleSubCategoryPage = '';
        this.selectCategoryPage = '';
        this.subCategoryPage = false;
        this.addNewServicePage = false;
        this.adminSettingsService.fnAllServices().subscribe((response: any) => {
            if (response.data == true) {
                this.allServicesList = response.response
                if (this.allServicesList != '') {
                    this.servicesList = true;
                    this.allServiceCount = this.allServicesList.length
                } else if (this.allServicesList == '') {
                    this.servicesList = false;
                }
                this.isLoaderAdmin = false;
            }
            else if (response.data == false) {
                this.allServicesList = '';
                this.isLoaderAdmin = false;
            }
        })
    }

    fnAllCategory() {
        this.isLoaderAdmin = true;
        this.adminSettingsService.fnAllCategory().subscribe((response: any) => {
            if (response.data == true) {
                this.allCetegoryList = response.response
                this.allCategoryCount = this.allCetegoryList.length
                this.isLoaderAdmin = false;
            }
            else if (response.data == false) {
                this.allCetegoryList = '';
                this.isLoaderAdmin = false;
            }
        })
    }

    dropCategory(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.categoryServicesList, event.previousIndex, event.currentIndex);
    }
    dropSubCategory(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.subCategoryServicesList, event.previousIndex, event.currentIndex);
    }
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.allServicesList, event.previousIndex, event.currentIndex);
    }


    fnSelectCategory(categoryId, index) {
        this.isLoaderAdmin = true;
        this.createNewSubCategoryPage = false;
        this.selectedCategoryIndex = index
        this.createNewCategoryPage = false;
        this.createNewServicePage = false;
        this.adminSettingsService.getServiceForCategoiry(categoryId, this.service_filter).subscribe((response: any) => {
            if (response.data == true) {
                this.categoryServicesList = response.response
                if (this.categoryServicesList != '' && this.categoryServicesList != 'service not found') {
                    this.servicesList = false;
                    this.selectCategoryPage = 'services';
                    this.selectedCategoryDetails = this.allCetegoryList[index]
                } else if (this.categoryServicesList == 'service not found') {
                    this.servicesList = false;
                    this.selectedCategoryDetails = this.allCetegoryList[index]
                    this.selectCategoryPage = 'notservices';
                }
                this.singleSubCategoryPage = '';
                this.isLoaderAdmin = false;
            }
            else if (response.data == false) {
                this.categoryServicesList = '';
                this.isLoaderAdmin = false;
            }
        })
    }
    changeServiceStaus(event, serviceId) {
        if (event == true) {
            this.singleServiceStatus = 'E'
        } else if(event == false){
            this.singleServiceStatus = 'D'
        }
        this.actionServiceIdarr.push(serviceId);
        this.adminSettingsService.fnServiceAction(this.actionServiceIdarr, this.singleServiceStatus).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Status Updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.actionServiceIdarr.length = 0;
            }
            else {
                this._snackBar.open("Status Not Updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
            }
        })
    }
    fnCreateNewSubCategoryPage(categoryId) {
        this.selectCategoryPage = '';
        this.createNewSubCategoryPage = true;
        this.parentCategoryId = categoryId
    }
    newSubCategoryStatus(event) {
        if (event == true) {
            this.newSubcategoryStatus = 'E';
        }
        else if (event == false) {
            this.newSubcategoryStatus = 'D';
        }
    }
    newSubCategoryPrivate(event) {
        if (event == true) {
            this.newSubcategoryPrivate = 'Y';
        }
        else if (event == false) {
            this.newSubcategoryPrivate = 'N';
        }
    }
    editSubCategoryStatus(event) {
        if (event == true) {
            this.editSubcategoryStatus = 'E';
        }
        else if (event == false) {
            this.editSubcategoryStatus = 'D';
        }
    }
    editSubCategoryPrivate(event) {
        if (event == true) {
            this.editSubcategoryPrivate = 'Y';
        }
        else if (event == false) {
            this.editSubcategoryPrivate = 'N';
        }
    }
    fnCreateNewSubCategorySubmit() {
        if(this.editSubCategoryId != undefined){
            if (this.createSubCategory.valid) {
                this.updateSubCategoryData = {
                    'business_id': this.businessId,
                    'sub_category_id': this.editSubCategoryId,
                    'sub_category_name': this.createSubCategory.get('subcategory_name').value,
                    'sub_category_description': this.createSubCategory.get('subcategory_description').value,
                    'sub_category_private': this.editSubcategoryPrivate,
                    'sub_category_status': this.editSubcategoryStatus,
                    'sub_category_image': this.subCategoryImageUrl
                }
                this.updateSubCategory(this.updateSubCategoryData);
            }
        }
        else{
            if (this.createSubCategory.valid) {
                this.newSubCategoryData = {
                    'business_id': this.businessId,
                    'category_id': this.parentCategoryId,
                    'sub_category_name': this.createSubCategory.get('subcategory_name').value,
                    'sub_category_description': this.createSubCategory.get('subcategory_description').value,
                    'sub_category_private': this.newSubcategoryPrivate,
                    'sub_category_status': this.newSubcategoryStatus,
                    'sub_category_image': this.subCategoryImageUrl
                }
                this.createNewSubCategory(this.newSubCategoryData);
            }
        }
    }
    createNewSubCategory(newSubCategoryData) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.createNewSubCategory(newSubCategoryData).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Sub Category Created", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.createSubCategory.reset();
                this.fnAllCategory();
                this.servicesList = true;
                this.createNewSubCategoryPage = false;
                this.isLoaderAdmin = false;
            }
            else if (response.data == false) {
                this._snackBar.open("Sub Category Not Created", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }
    updateSubCategory(updateSubCategoryData) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.updateSubCategory(updateSubCategoryData).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Category updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.createCategory.reset();
                this.fnAllCategory();
                this.servicesList = true;
                this.createNewCategoryPage = false;
                this.isLoaderAdmin = false;
                this.editSubCategoryId = undefined;
            }
            else if (response.data == false) {
                this._snackBar.open("Category Not updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }
    newCategoryStatus(event) {
        if (event == true) {
            this.newcategoryStatus = 'E';
        }
        else if (event == false) {
            this.newcategoryStatus = 'D';
        }
    }
    newCategoryPrivate(event) {
        if (event == true) {
            this.newcategoryPrivate = 'Y';
        }
        else if (event == false) {
            this.newcategoryPrivate = 'N';
        }
    }
    editCategoryStatus(event) {
        if (event == true) {
            this.editcategoryStatus = 'E';
        }
        else if (event == false) {
            this.editcategoryStatus = 'D';
        }
    }
    editCategoryPrivate(event) {
        if (event == true) {
            this.editcategoryPrivate = 'Y';
        }
        else if (event == false) {
            this.editcategoryPrivate = 'N';
        }
    }
    fnCreateNewCategorySubmit() {
        if (this.createCategory.get('category_id').value != '') {
            this.editCategoryId = this.createCategory.get('category_id').value
            if (this.createCategory.valid) {
                this.updateCategoryData = {
                    'category_id': this.editCategoryId,
                    'business_id': this.businessId,
                    'category_title': this.createCategory.get('category_name').value,
                    'category_description': this.createCategory.get('category_description').value,
                    'category_private': this.editcategoryPrivate,
                    'status': this.editcategoryStatus,
                    "category_image" : this.categoryImageUrl,
                }
                this.updateCategory(this.updateCategoryData);
            }
        }
        else {
            if (this.createCategory.valid) {
                this.newCategoryData = {
                    'business_id': this.businessId,
                    'category_title': this.createCategory.get('category_name').value,
                    'category_description': this.createCategory.get('category_description').value,
                    'category_private': this.newcategoryPrivate,
                    'status': this.newcategoryStatus,
                    "category_image" : this.categoryImageUrl,
                }
                this.createNewCategory(this.newCategoryData);
            }
        }
    }
    updateCategory(updateCategoryData) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.updateCategory(updateCategoryData).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Category updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.createCategory.reset();
                this.fnAllCategory();
                this.servicesList = true;
                this.createNewCategoryPage = false;
                this.editCategoryId = undefined;
                this.isLoaderAdmin = false;
            }
            else if (response.data == false) {
                this._snackBar.open("Category Not updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }
    createNewCategory(newCategoryData) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.createNewCategory(newCategoryData).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Category Created", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.createCategory.reset();
                this.fnAllCategory();
                this.servicesList = true;
                this.createNewCategoryPage = false;
                this.isLoaderAdmin = false;
            }
            else if (response.data == false) {
                this._snackBar.open("Category Not Created", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }
    editCategory(editCategoryId) {
        console.log(this.selectedCategoryDetails)
        this.editCategoryId = editCategoryId
        this.selectCategoryPage = '';
        this.createNewCategoryPage = true;
        this.isLoaderAdmin = true;
        this.createCategory.controls['category_id'].setValue(editCategoryId);
        this.createCategory.controls['category_name'].setValue(this.selectedCategoryDetails.category_title);
        this.createCategory.controls['category_description'].setValue(this.selectedCategoryDetails.category_description);
        this.isLoaderAdmin = false;
    }
    deleteCategory(deleteCategoryId) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.deleteCategory(deleteCategoryId).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Category deleted", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.fnAllCategory();
                this.servicesList = true;
                this.createNewCategoryPage = false;
                this.isLoaderAdmin = false;
            }
            else if (response.data == false) {
                this._snackBar.open("Category Not deleted", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }
    deleteSubCategory(deleteSubCategoryId) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.deleteSubCategory(deleteSubCategoryId).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Sub Category deleted", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.fnAllCategory();
                this.servicesList = true;
                this.createNewCategoryPage = false;
                this.isLoaderAdmin = false;
            }
            else if (response.data == false) {
                this._snackBar.open("Sub Category Not deleted", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }

    changeCategoryStatus(categoryStatus, categoryId) {
        if (categoryStatus == true) {
            this.currentCategoryStatus = 'E'
        }
        if (categoryStatus == false) {
            this.currentCategoryStatus = 'D'
        }
        this.adminSettingsService.changeCategoryStatus(this.currentCategoryStatus, categoryId).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Category Status Updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
            }
            else if (response.data == false) {
                this.isLoaderAdmin = false;
            }
        })
    }
    fnActionServiceId(event, serviceId) {
        if (event == true) {
            this.actionServiceIdarr.push(serviceId);
        } else {
            const index = this.actionServiceIdarr.indexOf(serviceId, 0);
            if (index > -1) {
                this.actionServiceIdarr.splice(index, 1);
            }
        }
    }
    fnServiceAction(action, categoryId, type) {
        if (this.actionServiceIdarr.length > 0) {

            this.adminSettingsService.fnServiceAction(this.actionServiceIdarr, action).subscribe((response: any) => {
                if (response.data == true) {
                    this._snackBar.open("Status Updated", "X", {
                        duration: 2000,
                        verticalPosition: 'top',
                        panelClass: ['green-snackbar']
                    });
                    this.actionServiceIdarr.length = 0;
                    this.selectedValue = undefined;
                    if (type == 'category') {
                        this.fnSelectCategory(categoryId, this.selectedCategoryIndex);
                    } else if (type == 'subcategory') {
                        this.fnSelectSubCategory(categoryId, this.selectedSubCategoryIndex)
                    }
                }
                else {
                    this._snackBar.open("Status Not Updated", "X", {
                        duration: 2000,
                        verticalPosition: 'top',
                        panelClass: ['red-snackbar']
                    });
                }
            })
        }
    }

    fnFilterService(categoryId, filter, type) {
        if (type == 'category') {
            this.service_filter = filter
            this.fnSelectCategory(categoryId, this.selectedCategoryIndex)
        } else if (type == 'subcategory') {
            this.subcategory_service_filter = filter
            this.fnSelectSubCategory(categoryId, this.selectedSubCategoryIndex)
        }

    }
    fnSelectSubCategory(subCategoryId, index) {
        this.isLoaderAdmin = true;
        this.createNewSubCategoryPage = false;
        this.createNewCategoryPage = false;
        this.selectedSubCategoryIndex = index;
        this.adminSettingsService.getServiceForSubCategoiry(subCategoryId, this.subcategory_service_filter).subscribe((response: any) => {
            if (response.data == true) {
                this.subCategoryServicesList = response.response
                if (this.subCategoryServicesList != '' && this.subCategoryServicesList != 'service not found') {
                    this.servicesList = false;
                    this.singleSubCategoryPage = 'services';
                    this.selectedSubCategoryDetails = this.allCetegoryList[this.selectedCategoryIndex].subcategory[index]
                    console.log(this.selectedSubCategoryDetails);
                } else if (this.subCategoryServicesList == 'service not found') {
                    this.servicesList = false;
                    this.selectedSubCategoryDetails = this.allCetegoryList[this.selectedCategoryIndex].subcategory[index]
                    this.singleSubCategoryPage = 'notservices';
                }
                this.selectCategoryPage = '';
                this.createNewServicePage = false;
                this.isLoaderAdmin = false;
            }
            else if (response.data == false) {
                this.categoryServicesList = '';
                this.isLoaderAdmin = false;
            }
        })
    }

    fnCreateNewServicePage(categoryId, type) {
        this.createServiceCategoryId = categoryId
        this.createServiceCategoryType = type
        this.createNewServicePage = true;
        this.servicesList = false;
        this.selectCategoryPage = '';
        this.createNewSubCategoryPage = false;
        this.createNewCategoryPage = false;
        this.singleSubCategoryPage = '';
    }
    fnNewServiceStatus(event) {
        if (event == true) {
            this.newServiceStatus = 'E';
        }
        else if (event == false) {
            this.newServiceStatus = 'D';
        }
    }
    fnNewServicePrivate(event) {
        if (event == true) {
            this.newServicePrivate = 'Y';
        }
        else if (event == false) {
            this.newServicePrivate = 'N';
        }
    }
    fnEditServiceStatus(event) {
        if (event == true) {
            this.editServiceStatus = 'E';
        }
        else if (event == false) {
            this.editServiceStatus = 'D';
        }
    }
    fnEditServicePrivate(event) {
        if (event == true) {
            this.editServicePrivate = 'Y';
        }
        else if (event == false) {
            this.editServicePrivate = 'N';
        }
    }
    fnCreateServiceSubmit() {
        if (this.createService.get('service_id').value != '') {
            if (this.createService.valid) {
                this.updateServiceData = {
                    'service_id': this.createService.get('service_id').value,
                    'business_id': this.businessId,
                    'service_name': this.createService.get('service_name').value,
                    'service_description': this.createService.get('service_description').value,
                    'service_cost': this.createService.get('service_cost').value,
                    'service_time': this.createService.get('service_duration').value,
                    'service_unit': this.createService.get('service_unit').value,
                    'service_private': this.editServicePrivate,
                    'service_status': this.editServiceStatus,
                    'service_image': this.serviceImageUrl
                   
                }
                this.updateService(this.updateServiceData);
            }

        }
        else if (this.createService.get('service_id').value == '') {
            if (this.createService.valid) {
                if (this.createServiceCategoryType == 'category') {
                    this.newServiceData = {
                        'category_id': this.createServiceCategoryId,
                        'business_id': this.businessId,
                        'service_name': this.createService.get('service_name').value,
                        'service_description': this.createService.get('service_description').value,
                        'service_cost': this.createService.get('service_cost').value,
                        'service_time': this.createService.get('service_duration').value,
                        'service_unit': this.createService.get('service_unit').value,
                        'service_private': this.newServicePrivate,
                        'service_status': this.newServiceStatus,
                        'service_image': this.serviceImageUrl
                    }
                }
                else if (this.createServiceCategoryType == 'subcategory') {
                    this.newServiceData = {
                        'sub_category_id': this.createServiceCategoryId,
                        'business_id': this.businessId,
                        'service_name': this.createService.get('service_name').value,
                        'service_description': this.createService.get('service_description').value,
                        'service_cost': this.createService.get('service_cost').value,
                        'service_time': this.createService.get('service_duration').value,
                        'service_unit': this.createService.get('service_unit').value,
                        'service_private': this.newServicePrivate,
                        'service_status': this.newServiceStatus,
                        'service_image': this.serviceImageUrl
                    }
                }
                this.createNewService(this.newServiceData);
            }
        }
    }

    createNewService(newServiceData) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.createNewService(newServiceData).subscribe((response: any) => {
            if (response.data == true && response.response == 'service created') {
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.createService.reset();
                this.createNewServicePage = false;
                this.servicesList = true;
                this.isLoaderAdmin = false;
            }
            else if (response.data == false) {
                this._snackBar.open("Service Not Created", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }
    updateService(updateServiceData) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.updateService(updateServiceData).subscribe((response: any) => {
            if (response.data == true && response.response == 'service updated') {
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.createService.reset();
                this.createNewServicePage = false;
                this.servicesList = true;
                this.editServiceId = undefined;
                this.editServiceStatusPrevious = '';
                this.editServicePrivateStatusPrevious = '';
                this.editServiceImage = '';
                this.isLoaderAdmin = false;
            }
            else if (response.data == false) {
                this._snackBar.open("Service Not Updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }
    changeSubCategoryStatus(categoryStatus, subcategoryId) {
        if (categoryStatus == true) {
            this.currentSubCategoryStatus = 'E'
        }
        if (categoryStatus == false) {
            this.currentSubCategoryStatus = 'D'
        }
        this.adminSettingsService.changeSubCategoryStatus(this.currentSubCategoryStatus, subcategoryId).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Sub Category Status Updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
            }
            else if (response.data == false) {
                this.isLoaderAdmin = false;
            }
        })
    }
    editSubCategory(editSubCategoryId){
        this.editSubCategoryId = editSubCategoryId
        this.singleSubCategoryPage = '';
        this.createNewSubCategoryPage = true;
        this.isLoaderAdmin = true;
        this.createSubCategory.controls['subcategory_id'].setValue(editSubCategoryId);
        this.createSubCategory.controls['subcategory_name'].setValue(this.selectedSubCategoryDetails.sub_category_name);
        this.createSubCategory.controls['subcategory_description'].setValue(this.selectedSubCategoryDetails.sub_category_description);
        this.isLoaderAdmin = false;
    }
    fnEditService(index, serviceId, type) {
        this.editServiceId = serviceId
        this.isLoaderAdmin = true;
        this.createNewServicePage = true;
        this.servicesList = false;
        this.selectCategoryPage = '';
        this.singleSubCategoryPage = '';
        if (type == 'category') {
            this.createService.controls['service_id'].setValue(this.editServiceId);
            this.createService.controls['service_name'].setValue(this.categoryServicesList[index].service_name);
            this.createService.controls['service_description'].setValue(this.categoryServicesList[index].service_description);
            this.createService.controls['service_cost'].setValue(this.categoryServicesList[index].service_cost);
            this.createService.controls['service_duration'].setValue(this.categoryServicesList[index].service_time);
            this.createService.controls['service_unit'].setValue(this.categoryServicesList[index].service_unit);
            this.editServiceStatusPrevious = this.categoryServicesList[index].status
            this.editServicePrivateStatusPrevious = this.categoryServicesList[index].private_status
            this.editServiceImage = this.categoryServicesList[index].service_image
        }
        else if(type == 'subcategory'){
            this.createService.controls['service_id'].setValue(this.editServiceId);
            this.createService.controls['service_name'].setValue(this.subCategoryServicesList[index].service_name);
            this.createService.controls['service_description'].setValue(this.subCategoryServicesList[index].service_description);
            this.createService.controls['service_cost'].setValue(this.subCategoryServicesList[index].service_cost);
            this.createService.controls['service_duration'].setValue(this.subCategoryServicesList[index].service_time);
            this.createService.controls['service_unit'].setValue(this.subCategoryServicesList[index].service_unit);
            this.editServiceStatusPrevious = this.subCategoryServicesList[index].status
            this.editServicePrivateStatusPrevious = this.subCategoryServicesList[index].private_status
            this.editServiceImage = this.subCategoryServicesList[index].service_image
        }
        this.isLoaderAdmin = false;
    }
    fnDeleteService(){
        this.isLoaderAdmin = true;
        this.adminSettingsService.fnDeleteService(this.editServiceId).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Service Deleted", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.fnAllServices();
                this.isLoaderAdmin = false;
            }
            else if (response.data == false) {
                this.isLoaderAdmin = false;
            }
        })
    }

    categoryImage() {
        const dialogRef = this.dialog.open(DialogCategoryImageUpload, {
          width: '500px',
          
        });
    
         dialogRef.afterClosed().subscribe(result => {
            if(result != undefined){
                this.categoryImageUrl = result;
                console.log(result);
               }
         });
      }
      subCategoryImage() {
        const dialogRef = this.dialog.open(DialogSubCategoryImageUpload, {
          width: '500px',
          
        });
    
         dialogRef.afterClosed().subscribe(result => {
            if(result != undefined){
                this.subCategoryImageUrl = result;
                console.log(result);
               }
         });
      }
      serviceImage() {
        const dialogRef = this.dialog.open(DialogServiceImageUpload, {
          width: '500px',
          
        });
    
         dialogRef.afterClosed().subscribe(result => {
            if(result != undefined){
                this.serviceImageUrl = result;
                console.log(result);
               }
         });
      }
    }
      
      @Component({
        selector: 'category-image-upload',
        templateUrl: '../_dialogs/category-image-upload.html',
      })
      export class DialogCategoryImageUpload {
      
        uploadForm: FormGroup;  
        imageSrc: string;
        profileImage: string;
        
      constructor(
        public dialogRef: MatDialogRef<DialogCategoryImageUpload>,
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
        selector: 'service-image-upload',
        templateUrl: '../_dialogs/service-image-upload-dialog.html',
      })
      export class DialogServiceImageUpload {
      
        uploadForm: FormGroup;  
        imageSrc: string;
        profileImage: string;
        
      constructor(
        public dialogRef: MatDialogRef<DialogServiceImageUpload>,
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
        selector: 'sub-category-image-upload',
        templateUrl: '../_dialogs/sub-category-image-upload.html',
      })
      export class DialogSubCategoryImageUpload {
      
        uploadForm: FormGroup;  
        imageSrc: string;
        profileImage: string;
        
      constructor(
        public dialogRef: MatDialogRef<DialogSubCategoryImageUpload>,
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



