import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { NgxEditorModule } from 'ngx-editor';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { PrivacyPolicyRoutingModule } from './privacy-policy.routing';
import { PrivacyPolicyService } from './privacy-policy.service';
import { AddPrivacyPolicyComponent } from './add-privacy-policy/add-privacy-policy.component';

const routes: Routes = [{
    path: "",
    component: DefaultComponent,
    children: [{
        path: "",
        component: PrivacyPolicyComponent
    }]
}]

@NgModule({
    imports: [ 
        CommonModule, RouterModule.forChild(routes),
        PrivacyPolicyRoutingModule,
        NgxEditorModule,
        LayoutModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],

    exports: [PrivacyPolicyComponent,AddPrivacyPolicyComponent],
    declarations: [PrivacyPolicyComponent, AddPrivacyPolicyComponent],
    providers: [PrivacyPolicyService],
    entryComponents: [AddPrivacyPolicyComponent]

})
export class PrivacyPolicyModule {
}