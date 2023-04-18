import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';



import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/breadcrumb.module';
import { MrpRoutingModule } from './mrp-routing.module';
import { MrpComponent } from './mrp.component';
import { FromTableCalculadoraComponent } from './pages/from-table-calculadora/from-table-calculadora.component';
import { PresupuestoVentaComponent } from './pages/presupuesto-venta/presupuesto-venta.component';
import { MaximosMinimosComponent } from './pages/maximos-minimos/maximos-minimos.component';
import { SimulacionAutomaticaComponent } from './pages/simulacion-automatica/simulacion-automatica.component';
import { DynamicTabmenuModule } from 'src/app/layout/shared/dynamic-tabmenu/dynamic-tabmenu.module';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { CalculadoraPreciosComponent } from './pages/calculadora-precios/calculadora-precios.component';
import { FormPrecioItemComponent } from './pages/form-precio-item/form-precio-item.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ListaPreciosItemMpComponent } from './pages/lista-precios-item-mp/lista-precios-item-mp.component';



@NgModule({
  declarations: [
    MrpComponent,
    FromTableCalculadoraComponent,
    PresupuestoVentaComponent,
    MaximosMinimosComponent,
    SimulacionAutomaticaComponent,
    CalculadoraPreciosComponent,
    FormPrecioItemComponent,
    ListaPreciosItemMpComponent,

  ],
  imports: [
    CommonModule,
    MrpRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    ApplicationPipesModule,
    BreadCrumbModule,
    DynamicTabmenuModule,
    DynamicTableModule
  ],
  providers:[DialogService]
})
export class MrpModule { }
