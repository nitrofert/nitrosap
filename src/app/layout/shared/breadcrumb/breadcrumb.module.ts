import { NgModule } from '@angular/core';
import { PrimengModule } from '../primeng/primeng.module';
import { BreadcrumbComponent } from './breadcrumb.component';




@NgModule({
    declarations:[
        BreadcrumbComponent
    ],
    exports:[
        BreadcrumbComponent
    ],
    imports:[
        PrimengModule
    ]
})
export class BreadCrumbModule { }
