(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-default-angular-about-us-about-us-module"],{

/***/ "./src/app/theme/pages/default/angular/about-us/about-us.component.css":
/*!*****************************************************************************!*\
  !*** ./src/app/theme/pages/default/angular/about-us/about-us.component.css ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".btn-add{\n    padding: 1.25rem 1.65rem;\n    font-size: 1.25rem;\n    line-height: 1.5;\n    color:white;\n    \n    background-color: transparent;\n    background: linear-gradient(to right, #fc4a1a, #f7b733);\n    margin-left: 90%;\n    margin-top:2%;\n    margin-right: 5%;\n}\n.header{\n    font-size: 3.15rem;\n  \n    padding: 1.25rem 4.65rem;\n    text-align: center;\n   }\n.btn-edit{\n    color:white;\n    width:80px;\n    background: #2e85a0;\n       border-radius: 25%;\n  \n}\n.btn-edit:hover{opacity: 1;}\n.btn-edit:active {\n  background-color: #3e8e41;\n  box-shadow: 0 5px #666;\n  -webkit-transform: translateY(4px);\n          transform: translateY(4px);\n}\n.btn-delete{\n    color:white;\n    width:80px;\n    background: #a73a08;\n  \n    border-radius: 25%;\n}\n.btn-delete:hover{opacity: 1;}\n.btn-save{\n    color:white;\n    width:80px;\n    background: #49a558;\n   \n    border-radius: 25%;\n   \n}\n.btn-save:hover{opacity: 1;}\n.btn-save:active {\n  background-color: #509952;\n  -webkit-transform: translateY(4px);\n          transform: translateY(4px);\n}\n.banner-image {\n    /* height: 85px; */\n    width: 130px;\n    margin-left: 122px;\n }\n.btn-del{\n    padding: 1.25rem 1.65rem;\n    font-size: 1.25rem;\n    line-height: 1.5;\n    color:white;\n    margin-right:45px;\n background-color: transparent;\n background: #a73a08;\n    border-color: #a73a08;\n }\n:host app-ngx-editor /deep/ .ngx-editor-textarea {\n    height:500px !important;\n    \n }\n#commonCms{\n    padding-top: 5%; \n    padding-right: 10%;\n    padding-left: 10%;\n }\n#customBtns{\n     float: right;\n     margin-right:10%;\n     padding: 5px;\n     opacity: none;\n }\n.mrgRight5{\n     margin-right: 8px;\n }\n "

/***/ }),

/***/ "./src/app/theme/pages/default/angular/about-us/about-us.component.html":
/*!******************************************************************************!*\
  !*** ./src/app/theme/pages/default/angular/about-us/about-us.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 class=\"header\">About Us</h2>\n  \n<button class=\"btn-add\" (click)=\"add()\" ><i class=\"fas fa-plus\"></i></button>\n\n<form name=\"aboutUsForm\" [formGroup]=\"aboutUsForm\" (ngSubmit)=\"onSubmit()\">\n <div id='commonCms'>\n    <app-ngx-editor [placeholder]=\"'Enter text here...'\" [spellcheck]=\"true\" formControlName=\"content\" [(ngModel)]=\"aboutUsLists\"\n      [config]=\"editorConfig\"></app-ngx-editor>\n\n  </div>\n  <div id='customBtns'>\n    <div *ngIf=\"editorConfig.editable;else save;\">\n      <button type=\"button\" [disabled]=\"loading\" class=\"btn btn-outline-ark mrgRight5 btn-save\" (click)=\"addAboutUs()\">Save</button>\n      <button type=\"button\" [disabled]=\"loading\" class=\"btn btn-outline-ark btn-delete\" (click)=\"cancelAboutUs()\">Cancel</button>\n\n    </div>\n\n    <ng-template #save>\n      <button type=\"button\" [disabled]=\"loading\" class=\"btn btn-outline-dark mrgRight5 btn-edit\" (click)=\"addAboutUs()\">Edit</button>\n      <button type=\"button\" [disabled]=\"loading\" class=\"btn btn-outline-dark btn-delete\" (click)=\"delete(content)\">Delete</button>\n\n    </ng-template>\n\n  </div>\n  \n\n</form>\n"

/***/ }),

/***/ "./src/app/theme/pages/default/angular/about-us/about-us.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/theme/pages/default/angular/about-us/about-us.component.ts ***!
  \****************************************************************************/
/*! exports provided: NgbdModalContent, AboutUsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgbdModalContent", function() { return NgbdModalContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AboutUsComponent", function() { return AboutUsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _about_us_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./about-us.service */ "./src/app/theme/pages/default/angular/about-us/about-us.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var NgbdModalContent = /** @class */ (function () {
    function NgbdModalContent(activeModal, _router, _formBuilder, modalService, aboutUsService, toastService) {
        this.activeModal = activeModal;
        this._router = _router;
        this._formBuilder = _formBuilder;
        this.modalService = modalService;
        this.aboutUsService = aboutUsService;
        this.toastService = toastService;
        this.loading = false;
        this.submitted = false;
    }
    NgbdModalContent.prototype.ngOnInit = function () {
        this.buildAboutForm();
    };
    Object.defineProperty(NgbdModalContent.prototype, "f", {
        get: function () {
            return this.aboutUsForm.controls;
        },
        enumerable: true,
        configurable: true
    });
    NgbdModalContent.prototype.buildAboutForm = function () {
        this.aboutUsForm = this._formBuilder.group({
            content: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required]],
        });
    };
    NgbdModalContent.prototype.getAllAboutus = function () {
        var _this = this;
        this.aboutUsService.getAllAboutus().subscribe(function (response) {
            _this.aboutUsService.setAboutus(response.data);
        });
    };
    NgbdModalContent.prototype.addContent = function () {
        var _this = this;
        var addObj = {
            "content": this.aboutUsForm.controls['content'].value,
        };
        if (this.isAdd) {
            console.log(addObj);
            this.aboutUsService.addAboutus(addObj).subscribe(function (data) {
                console.log(data);
                _this.getAllAboutus();
                _this.activeModal.dismiss();
                _this.toastService.success(data['message']);
            }, function (error) {
                _this.toastService.error(error['message']);
            });
        }
    };
    NgbdModalContent.prototype.validateForm = function () {
        if (this.aboutUsForm.valid) {
            return false;
        }
        else {
            return true;
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], NgbdModalContent.prototype, "id", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], NgbdModalContent.prototype, "content", void 0);
    NgbdModalContent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-about-us',
            template: " <div class=\"modal-header\">\n  <h4 class=\"modal-title\"> Add Content</h4>  \n   <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"activeModal.dismiss('Cross click')\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n</div>\n<div class=\"modal-body\">\n<form [formGroup]=\"aboutUsForm\" (ngSubmit)=\"addContent()\">\n            <div class=\"form-group\">\n                <label for=\"name\">Content</label>\n                <textarea name=\"message\" rows=\"10\" cols=\"30\" formControlName=\"content\" [(ngModel)]=\"content\" class=\"form-control\"></textarea>\n                <p *ngIf=\"aboutUsForm.controls.content.errors?.required && (aboutUsForm.controls.content.dirty || aboutUsForm.controls.content.touched)\" class=\"lbl-err\">Content is required.</p>\n             </div>\n         <div class=\"modal-footer\">\n            <div class=\"form-group\">\n           <button type=\"submit\"  class=\"btn btn-outline-dark\" [disabled]=\"validateForm()\">Save</button>&nbsp;&nbsp;\n           <button type=\"button\" class=\"btn btn-outline-dark\" (click)=\"activeModal.close('Close click')\">Cancel</button>\n            </div>\n         </div>\n        </form>",
            styles: [__webpack_require__(/*! ./about-us.component.css */ "./src/app/theme/pages/default/angular/about-us/about-us.component.css")]
        }),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_6__["NgbActiveModal"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"],
            _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_6__["NgbModal"],
            _about_us_service__WEBPACK_IMPORTED_MODULE_1__["AboutUsService"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrService"]])
    ], NgbdModalContent);
    return NgbdModalContent;
}());

var AboutUsComponent = /** @class */ (function () {
    function AboutUsComponent(modalService, location, toastService, _formBuilder, aboutUsService) {
        var _this = this;
        this.modalService = modalService;
        this.location = location;
        this.toastService = toastService;
        this._formBuilder = _formBuilder;
        this.aboutUsService = aboutUsService;
        this.isAdd = false;
        this.loading = false;
        this.submitted = false;
        this.editorConfig = {
            editable: false,
            spellcheck: true,
            height: '10rem',
            minHeight: '5rem',
            placeholder: 'Type something. Test the Editor... ヽ(^。^)丿'
        };
        this.aboutUsService.getAboutus().subscribe(function (data) {
            console.log("gugugugu", data);
            _this.aboutUsLists = data.aboutUsList.content;
        });
    }
    AboutUsComponent.prototype.ngOnInit = function () {
        this.buildAboutusForm();
        this.getAboutusList();
        this.getAllAboutus();
    };
    AboutUsComponent.prototype.buildAboutusForm = function () {
        this.aboutUsForm = this._formBuilder.group({
            id: '',
            content: '',
        });
    };
    AboutUsComponent.prototype.getAboutusList = function () {
        var _this = this;
        this.aboutUsService.getAllAboutus().subscribe(function (response) {
            _this.aboutUsList = response.data[0];
        });
    };
    AboutUsComponent.prototype.getAllAboutus = function () {
        var _this = this;
        this.aboutUsService.getAllAboutus().subscribe(function (response) {
            _this.aboutUsService.setAboutus(response.data[0]);
        });
    };
    AboutUsComponent.prototype.validateForm = function () {
        if (this.aboutUsForm.valid) {
            return false;
        }
        else {
            return true;
        }
    };
    AboutUsComponent.prototype.addAboutUs = function (id) {
        var _this = this;
        console.log(id);
        console.log("edit obj", this.editorConfig.editable);
        if (this.editorConfig.editable)
            this.editorConfig.editable = false;
        else
            this.editorConfig.editable = true;
        var editObj = {
            "content": this.aboutUsForm.controls['content'].value,
        };
        console.log("....................", editObj);
        console.log("mmmmmmmmmm", this.id);
        this.aboutUsService.editAboutus(editObj, this.id).subscribe(function (data) {
            console.log("dara will be here", data);
            if (!_this.editorConfig.editable) {
                _this.toastService.success(data['response'].responseMessage);
            }
            _this.getAllAboutus();
        }, function (error) {
            _this.toastService.error(error['error'].message);
        });
    };
    Object.defineProperty(AboutUsComponent.prototype, "f", {
        get: function () {
            return this.aboutUsForm.controls;
        },
        enumerable: true,
        configurable: true
    });
    AboutUsComponent.prototype.onSubmit = function () {
        this.submitted = true;
        if (this.aboutUsForm.invalid) {
            return;
        }
        this.loading = true;
    };
    AboutUsComponent.prototype.deleteAboutus = function (id) {
        var _this = this;
        this.aboutUsService.deleteAboutus(this.id).subscribe(function (data) {
            _this.modalReference.close();
            _this.toastService.success(data['response'].responseMessage);
            _this.aboutUsService.getAllAboutus().subscribe(function (response) {
                _this.aboutUsService.setAboutus(response.data);
            });
        }, function (error) {
            _this.toastService.error(error.errors);
        });
    };
    AboutUsComponent.prototype.delete = function (content) {
        this.modalReference = this.modalService.open(content);
    };
    AboutUsComponent.prototype.cancelAboutUs = function () {
        this.editorConfig.editable = false;
        // this.getAllAboutus();
    };
    AboutUsComponent.prototype.add = function (content) {
        if (!content) {
            this.isAdd = true;
        }
        else {
            this.isAdd = false;
        }
        var modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.id = content ? content._id : "";
        modalRef.componentInstance.content = content ? content.content : "";
        modalRef.componentInstance.isAdd = this.isAdd;
        console.log(content._id);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], AboutUsComponent.prototype, "id", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], AboutUsComponent.prototype, "content", void 0);
    AboutUsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-about-us',
            template: __webpack_require__(/*! ./about-us.component.html */ "./src/app/theme/pages/default/angular/about-us/about-us.component.html"),
            styles: [__webpack_require__(/*! ./about-us.component.css */ "./src/app/theme/pages/default/angular/about-us/about-us.component.css")]
        }),
        __metadata("design:paramtypes", [_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_6__["NgbModal"],
            _angular_common__WEBPACK_IMPORTED_MODULE_4__["Location"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_5__["ToastrService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"],
            _about_us_service__WEBPACK_IMPORTED_MODULE_1__["AboutUsService"]])
    ], AboutUsComponent);
    return AboutUsComponent;
}());



/***/ }),

/***/ "./src/app/theme/pages/default/angular/about-us/about-us.module.ts":
/*!*************************************************************************!*\
  !*** ./src/app/theme/pages/default/angular/about-us/about-us.module.ts ***!
  \*************************************************************************/
/*! exports provided: AboutUsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AboutUsModule", function() { return AboutUsModule; });
/* harmony import */ var _about_us_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./about-us.service */ "./src/app/theme/pages/default/angular/about-us/about-us.service.ts");
/* harmony import */ var _about_us_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./about-us.component */ "./src/app/theme/pages/default/angular/about-us/about-us.component.ts");
/* harmony import */ var _about_us_routing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./about-us.routing */ "./src/app/theme/pages/default/angular/about-us/about-us.routing.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _default_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../default.component */ "./src/app/theme/pages/default/default.component.ts");
/* harmony import */ var _layouts_layout_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../layouts/layout.module */ "./src/app/theme/layouts/layout.module.ts");
/* harmony import */ var ngx_editor__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-editor */ "./node_modules/ngx-editor/esm5/ngx-editor.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











var routes = [
    {
        path: "",
        component: _default_component__WEBPACK_IMPORTED_MODULE_8__["DefaultComponent"],
        children: [
            {
                path: "",
                component: _about_us_component__WEBPACK_IMPORTED_MODULE_1__["AboutUsComponent"]
            }
        ]
    },
];
var AboutUsModule = /** @class */ (function () {
    function AboutUsModule() {
    }
    AboutUsModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"].forChild(routes),
                _about_us_routing__WEBPACK_IMPORTED_MODULE_2__["AboutUsRoutingModule"],
                ngx_editor__WEBPACK_IMPORTED_MODULE_10__["NgxEditorModule"],
                _layouts_layout_module__WEBPACK_IMPORTED_MODULE_9__["LayoutModule"],
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_6__["NgbModule"].forRoot(),
                _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ReactiveFormsModule"]
            ],
            exports: [_about_us_component__WEBPACK_IMPORTED_MODULE_1__["AboutUsComponent"], _about_us_component__WEBPACK_IMPORTED_MODULE_1__["NgbdModalContent"]],
            declarations: [_about_us_component__WEBPACK_IMPORTED_MODULE_1__["AboutUsComponent"], _about_us_component__WEBPACK_IMPORTED_MODULE_1__["NgbdModalContent"]],
            providers: [_about_us_service__WEBPACK_IMPORTED_MODULE_0__["AboutUsService"]],
            entryComponents: [_about_us_component__WEBPACK_IMPORTED_MODULE_1__["NgbdModalContent"]]
        })
    ], AboutUsModule);
    return AboutUsModule;
}());



/***/ }),

/***/ "./src/app/theme/pages/default/angular/about-us/about-us.routing.ts":
/*!**************************************************************************!*\
  !*** ./src/app/theme/pages/default/angular/about-us/about-us.routing.ts ***!
  \**************************************************************************/
/*! exports provided: AboutUsRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AboutUsRoutingModule", function() { return AboutUsRoutingModule; });
/* harmony import */ var _about_us_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./about-us.component */ "./src/app/theme/pages/default/angular/about-us/about-us.component.ts");
/* harmony import */ var _default_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../default.component */ "./src/app/theme/pages/default/default.component.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var routes = [
    {
        path: "",
        component: _default_component__WEBPACK_IMPORTED_MODULE_1__["DefaultComponent"],
        children: [
            {
                path: '',
                component: _about_us_component__WEBPACK_IMPORTED_MODULE_0__["AboutUsComponent"],
            },
        ]
    },
];
var AboutUsRoutingModule = /** @class */ (function () {
    function AboutUsRoutingModule() {
    }
    AboutUsRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes)],
            exports: [],
            providers: []
        })
    ], AboutUsRoutingModule);
    return AboutUsRoutingModule;
}());



/***/ }),

/***/ "./src/app/theme/pages/default/angular/about-us/about-us.service.ts":
/*!**************************************************************************!*\
  !*** ./src/app/theme/pages/default/angular/about-us/about-us.service.ts ***!
  \**************************************************************************/
/*! exports provided: AboutUsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AboutUsService", function() { return AboutUsService; });
/* harmony import */ var rxjs_Subject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/Subject */ "./node_modules/rxjs-compat/_esm5/Subject.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _app_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../../../../app.service */ "./src/app/app.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AboutUsService = /** @class */ (function () {
    function AboutUsService(http) {
        this.http = http;
        this.aboutUsList = new rxjs_Subject__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
    }
    AboutUsService.prototype.setAboutus = function (data) {
        console.log("kkkkkkkkkkkkk");
        console.log(data);
        this.aboutUsList.next({ aboutUsList: data });
    };
    AboutUsService.prototype.getAboutus = function () {
        return this.aboutUsList.asObservable();
    };
    AboutUsService.prototype.getHeaderWithToken = function () {
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
        headers = headers.set('Content-Type', 'application/json');
        var token = JSON.parse(localStorage.getItem('_token'));
        headers = headers.set('Authorization', token);
        return headers;
    };
    AboutUsService.prototype.addAboutus = function (about) {
        console.log("lllll", about);
        return this.http.post(_app_service__WEBPACK_IMPORTED_MODULE_4__["URL"] + 'admin/addAboutUs', about, { headers: this.getHeaderWithToken() })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (res) { return res; }));
    };
    AboutUsService.prototype.getAllAboutus = function () {
        return this.http.get(_app_service__WEBPACK_IMPORTED_MODULE_4__["URL"] + 'admin/aboutUsList', { headers: this.getHeaderWithToken() })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (res) {
            console.log("get", res);
            return res;
        }));
    };
    AboutUsService.prototype.editAboutus = function (about, id) {
        console.log(id);
        var admin_id = JSON.parse(localStorage.getItem('_id'));
        return this.http.put(_app_service__WEBPACK_IMPORTED_MODULE_4__["URL"] + 'admin/updateAboutUs/' + id, about, { headers: this.getHeaderWithToken() })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (res) {
            console.log(">>>>>>>>>>>>>>>>>>>>", res);
            return res;
        }));
    };
    AboutUsService.prototype.deleteAboutus = function (id) {
        var admin_id = JSON.parse(localStorage.getItem('_id'));
        return this.http.put(_app_service__WEBPACK_IMPORTED_MODULE_4__["URL"] + 'admin/delAbout_Us' + admin_id, { headers: this.getHeaderWithToken() }).map(function (res) {
            return res;
        });
    };
    AboutUsService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], AboutUsService);
    return AboutUsService;
}());



/***/ })

}]);
//# sourceMappingURL=pages-default-angular-about-us-about-us-module.js.map