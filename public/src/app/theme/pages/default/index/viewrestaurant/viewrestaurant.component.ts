import  swal  from 'sweetalert2';
import { IndexService } from '../index.service';
import { Component, OnInit, AfterViewInit, Input,ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

@Component({
  selector: 'app-viewrestaurant',
  templateUrl: './viewrestaurant.component.html',
  styleUrls: ['./viewrestaurant.component.css']
})
export class ViewrestaurantComponent implements OnInit {

  @Input () cuisin;
  RestaurantForm: FormGroup;
  menuImages: Array<any>;
  restaurantImages: Array<any>;
  mealOffers: Array<any> = []

 constructor(
 public activeModal: NgbActiveModal,
      private _router: Router,
      private _formBuilder: FormBuilder,
      private modalService: NgbModal,
      private IndexService: IndexService,
      private toastService: ToastrService) { }

  ngOnInit() {
      this.buildRestaurantForm();
  }

  get f() {
      return this.RestaurantForm.controls;
  }

  buildRestaurantForm() {
      this.RestaurantForm = this._formBuilder.group({
          name: [''],
          description: [''],
          latitude: [''],
          longitude: [''],
          openTime: [''],
          closeTime: [''],
          restaurantImages: [''],
          contactNumber: [''],
          website: [''],
          menu: [''],
          photos: [''],
          mealOffers: [''],
          perPersonCost: [''],
          cuisinOffered:['']
      
      });
  
}
}
