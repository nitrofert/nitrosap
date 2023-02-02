import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'solped', loadChildren: () => import('./solped/solped.module').then(m => m.SolpedModule) },
        { path: 'pedidos', loadChildren: () => import('./pedidos/pedidos.module').then(m => m.PedidosModule) },
        { path: 'entradas', loadChildren: () => import('./entradas/entradas.module').then(m => m.EntradasModule) },
        { path: 'mrp', loadChildren: () => import('./mrp/mrp.module').then(m => m.MrpModule) },
        { path: 'reportes', loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule) },
        
    ])],
    exports: [RouterModule]
})
export class ComprasRoutingModule { } 
