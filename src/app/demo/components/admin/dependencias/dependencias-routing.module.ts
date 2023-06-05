import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DependenciasComponent } from './dependencias.component';





@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DependenciasComponent },
       
    ])],
    exports: [RouterModule]
})
export class DependenciasRoutingModule { }