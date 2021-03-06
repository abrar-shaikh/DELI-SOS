import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { Message, Password } from 'primeng/primeng';
import { CuisinService } from '../cuisin.service';
import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit ,ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2'


@Component({
  selector: 'app-add-editcuisin',
  templateUrl: './add-editcuisin.component.html',
  styleUrls: ['./add-editcuisin.component.css']
})
export class AddEditcuisinComponent implements OnInit {

  cuisinsList: Array<any>;
  cuisinForm: FormGroup;
  
  @Input() id;
  @Input() name;
  @Input() image;
  loading = false;
  submitted = false;
  isAdd: boolean;
  isView: boolean;

  constructor(public activeModal: NgbActiveModal,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private modalService: NgbModal,
    private cuisinService: CuisinService,
    private toastService: ToastrService) { }

  ngOnInit() {
    this.buildCuisinForm();
  }

  get f() {
    return this.cuisinForm.controls;
  }

  buildCuisinForm() {

    if(this.isAdd){
      this.cuisinForm = this._formBuilder.group({
        name: ['', [Validators.required,Validators.pattern(/^(?!\s*$).+/)]],
        image:['',[Validators.required]]
      });
    }else{
      this.cuisinForm = this._formBuilder.group({
        name: ['', [Validators.required,Validators.pattern(/^(?!\s*$).+/)]],
        image:['']
      });
    }
 
  }

  async uploadImage(images) {
    let files = images.target.files;
    return new Promise((resolve, reject) => {
      this.cuisinService.uploadPic(files).subscribe((data) => {
       this.image= data.data[0]
     resolve(data.data)
      });
    })

  }


  addCuisins() {
    this.submitted=true;
    if(this.cuisinForm.invalid){
    return;
     }
    var addObj = {
      "name": this.cuisinForm.controls['name'].value,
     "image":this.image
     
    }
    if (this.isAdd) {
    this.cuisinService.addCuisin(addObj).subscribe(
        data => {
         this.getAllCuisin();
         if (data['code'] == 200 ) {
            swal({
              position: 'center',
              type: 'success',
              title: data['msg'],
              showConfirmButton: false,
              timer: 1500
            })
            this.activeModal.dismiss();
          } else {
            swal({
              type: 'error',
              text: data['msg']
            })
          }
        },
       error => {
        this.toastService.error(error['message']);
       });
    }
   else {
   
     this.cuisinService.editCuisin(addObj, this.id).subscribe(
        data => {
          this.getAllCuisin();
          this.activeModal.dismiss();
          if (data['code'] ==200 ) {
            swal({
              position: 'center',
              type: 'success',
              title:'updated successfully',
              showConfirmButton: false,
              timer: 1500
            })
            this.activeModal.dismiss();
          } else {
            swal({
              type: 'error',
              text: data['message']
            })
          }
        },
        error => {
          this.toastService.error(error['message']);
        });
    }
  }

  getAllCuisin() {
    this.cuisinService.getAllCuisins().subscribe((response: any) => {
      this.cuisinService.setCuisins(response);
    })
  }

 

}
