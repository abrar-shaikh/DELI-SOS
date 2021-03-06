import  swal  from 'sweetalert2';
import { IndexService } from './index.service';
import { Component, OnInit, AfterViewInit, Input,ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ScriptLoaderService } from './../../../../_services/script-loader.service';
import { ViewrestaurantComponent } from './viewrestaurant/viewrestaurant.component';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

   
  

@Component({

    styleUrls: ['./index.component.css'],
    selector: 'app-index',
    templateUrl: './index.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class IndexComponent implements OnInit, AfterViewInit {
    restList: Array<any>;
    isView: boolean = false;
    constructor(
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _script: ScriptLoaderService,
        private indexService: IndexService,
        private toastService: ToastrService,
        private modalService: NgbModal,
        private location: Location, private spinnerService: Ng4LoadingSpinnerService) {
           this.indexService.getAllRequest().subscribe((response: any) => {
            this.restList = response.data
        }) 
         }

    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/vendors/custom/datatables/datatables.bundle.js',
                'assets/demo/default/custom/crud/datatables/basic/paginations.js']);
    }

    totalUser;
    ngOnInit() {
        this.getAllRequest()
        this.getUserList()
        this.getRestaurant()
      
    }
    usersList:Array<any>;
    getUserList() {
        this.spinnerService.show();
        this.indexService.getAllUsers().subscribe((response: any) => {
           this.usersList = response.data;
           this.spinnerService.hide();
        });
    }
   restaurantList:Array<any>;
   getRestaurant(){
       this.indexService.getAllRestaurant().subscribe((response:any)=>{
           this.restaurantList=response.data
       })
   }

    getAllRequest() {
        this.spinnerService.show();
        this.indexService.getAllRequest().subscribe((response: any) => {
            this.restList = response.data
            this.spinnerService.hide();
            
            
        })
    }
    open(content) {
        const modalRef = this.modalService.open(ViewrestaurantComponent);
        modalRef.componentInstance.id = content ? content._id : "";
        modalRef.componentInstance.name = content ? content.name : "";
        modalRef.componentInstance.description = content ? content.description : "";
        modalRef.componentInstance.latitude = content ? content.location.coordinates[0] : "";
        modalRef.componentInstance.longitude = content ? content.location.coordinates[1] : "";
        modalRef.componentInstance.mealOffers = content ? content.mealOffers : "";
        modalRef.componentInstance.openTime = content ? content.openTime : "";
        modalRef.componentInstance.closeTime = content ? content.closeTime : "";
        modalRef.componentInstance.contactNumber = content ? content.contactNumber : "";
        modalRef.componentInstance.website = content ? content.website : "";
        modalRef.componentInstance.perPersonCost = content ? content.perPersonCost : "";
        modalRef.componentInstance.menuImages = content ? content.menu : "";
        modalRef.componentInstance.restaurantImages = content ? content.photos : "";
        modalRef.componentInstance.cuisinOffered = content ? content.cuisinOffered : "";
    }

    Approve(id) {
       this.indexService.approveRestaurant(id).subscribe((response: any) => {
            this.getAllRequest()
            if (response['code'] ==200 ) {
                swal({
                  position: 'center',
                  type: 'success',
                  title: response['message'],
                  showConfirmButton: false,
                  timer: 1500
                })
                
              } else {
                swal({
                  type: 'error',
                  text: response['message']
                })
               }
        },err=>{
          this.toastService.error(err['message']);
        }
        )
    }
   
    Reject(id){
        console.log("in delete ",id)
        this.indexService.rejectRestaurant(id).subscribe((response:any)=>{
            console.log(response)
            this.getAllRequest()
            if (response['code'] ==200 ) {
                swal({
                  position: 'center',
                  type: 'success',
                  title: response['msg'],
                  showConfirmButton: false,
                  timer: 1500
                })
              } else {
                swal({
                  type: 'error',
                  text: response['msg']
                })
               }
        })
    }
}