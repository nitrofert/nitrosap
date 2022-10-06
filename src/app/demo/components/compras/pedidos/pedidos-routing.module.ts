import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { PedidosComponent } from './pedidos.component';




@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PedidosComponent }, 
       
    ])],
    exports: [RouterModule]
})
export class PedidosRoutingModule { }