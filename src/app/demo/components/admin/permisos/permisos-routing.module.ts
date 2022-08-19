
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermisosComponent } from './permisos.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PermisosComponent }
    ])],
    exports: [RouterModule]
})
export class PermisosRoutingModule { }
