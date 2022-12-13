import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MrpComponent } from './mrp.component';
import { MaximosMinimosComponent } from './pages/maximos-minimos/maximos-minimos.component';
import { PresupuestoVentaComponent } from './pages/presupuesto-venta/presupuesto-venta.component';





@NgModule({
    imports: [RouterModule.forChild([
        { path: 'calculadora', component: MrpComponent }, 
        { path: 'presupuesto', component: PresupuestoVentaComponent }, 
        { path: 'maximos-minimos', component: MaximosMinimosComponent }, 
      
    ])],
    exports: [RouterModule]
})
export class MrpRoutingModule { }