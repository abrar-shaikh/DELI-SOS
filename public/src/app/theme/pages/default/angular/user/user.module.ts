import { UserComponent} from './user.component';
import { UserService } from './user.service';
import { UserRoutingModule } from './user.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DataTablesModule } from 'angular-datatables';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';


const routes: Routes = [
	{
		path: "",
		component: DefaultComponent,
		children: [
			{
				path: "",
				component: UserComponent
			}
		]
	},
];

@NgModule({
	imports: [
		CommonModule, RouterModule.forChild(routes),
		UserRoutingModule,
		LayoutModule,
		NgbModule.forRoot(),
		FormsModule,
		ReactiveFormsModule,
		DataTablesModule,

	],

	exports: [UserComponent, AddEditUserComponent],
	declarations: [UserComponent, AddEditUserComponent],
	providers: [UserService,],
	entryComponents: [AddEditUserComponent]

})
export class UserModule {
}