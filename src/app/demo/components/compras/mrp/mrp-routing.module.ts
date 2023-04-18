import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MrpComponent } from './mrp.component';
import { CalculadoraPreciosComponent } from './pages/calculadora-precios/calculadora-precios.component';
import { ListaPreciosItemMpComponent } from './pages/lista-precios-item-mp/lista-precios-item-mp.component';
import { MaximosMinimosComponent } from './pages/maximos-minimos/maximos-minimos.component';
import { PresupuestoVentaComponent } from './pages/presupuesto-venta/presupuesto-venta.component';
import { SimulacionAutomaticaComponent } from './pages/simulacion-automatica/simulacion-automatica.component';





@NgModule({
    imports: [RouterModule.forChild([
        { path: 'calculadora', component: MrpComponent }, 
        { path: 'calculadora-precios', component: CalculadoraPreciosComponent }, 
        { path: 'lista-precios-mp', component: ListaPreciosItemMpComponent }, 
        { path: 'presupuesto', component: PresupuestoVentaComponent }, 
        { path: 'maximos-minimos', component: MaximosMinimosComponent },
        { path: 'simulacion-automatica', component: SimulacionAutomaticaComponent }, 
      
    ])],
    exports: [RouterModule]
})
export class MrpRoutingModule { }