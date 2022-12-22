import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { UserRoutingModule } from './user-routing.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/breadcrumb.module';
import { UserComponent } from './user.component';



@NgModule({
    imports: [
        CommonModule,
        PrimengModule,
        UserRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BreadCrumbModule
    ],
    declarations: [
        UserComponent
    ]
})
export class UserModule { }
