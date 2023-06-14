import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MrpComponent } from './mrp.component';
import { CalculadoraPreciosComponent } from './pages/calculadora-precios/calculadora-precios.component';
import { FormCalculadoraPrecioComponent } from './pages/form-calculadora-precio/form-calculadora-precio.component';
import { ListaPreciosItemMpComponent } from './pages/lista-precios-item-mp/lista-precios-item-mp.component';
import { ListaPreciosItemPtComponent } from './pages/lista-precios-item-pt/lista-precios-item-pt.component';
import { MaximosMinimosComponent } from './pages/maximos-minimos/maximos-minimos.component';
import { PresupuestoVentaComponent } from './pages/presupuesto-venta/presupuesto-venta.component';
import { SimulacionAutomaticaComponent } from './pages/simulacion-automatica/simulacion-automatica.component';
import { ListaPreciosItemSugeridoComponent } from './pages/lista-precios-item-sugerido/lista-precios-item-sugerido.component';





@NgModule({
    imports: [RouterModule.forChild([
        { path: 'calculadora', component: MrpComponent }, 
        { path: 'calculadora-precios', component: CalculadoraPreciosComponent },
        { path: 'calculadora-precios/nuevo-calculo', component: FormCalculadoraPrecioComponent }, 
        { path: 'calculadora-precios/editar-calculo/:id', component: FormCalculadoraPrecioComponent }, 
        { path: 'lista-precios-mp', component: ListaPreciosItemMpComponent }, 
        { path: 'lista-precios-pt', component: ListaPreciosItemPtComponent },
        { path: 'lista-precios-sugeridos', component: ListaPreciosItemSugeridoComponent },

        { path: 'presupuesto', component: PresupuestoVentaComponent }, 
        { path: 'maximos-minimos', component: MaximosMinimosComponent },
        { path: 'simulacion-automatica', component: SimulacionAutomaticaComponent }, 
      
    ])],
    exports: [RouterModule]
})
export class MrpRoutingModule { }