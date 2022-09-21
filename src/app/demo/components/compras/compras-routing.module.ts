import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'solped', loadChildren: () => import('./solped/solped.module').then(m => m.SolpedModule) },
        { path: 'pedidos', loadChildren: () => import('./pedidos/pedidos.module').then(m => m.PedidosModule) },
        { path: 'entradas', loadChildren: () => import('./entradas/entradas.module').then(m => m.EntradasModule) },
        
    ])],
    exports: [RouterModule]
})
export class ComprasRoutingModule { } 
