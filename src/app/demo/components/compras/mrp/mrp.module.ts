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







@NgModule({
  declarations: [
    MrpComponent,
    FromTableCalculadoraComponent,
    PresupuestoVentaComponent,
    MaximosMinimosComponent,
    SimulacionAutomaticaComponent
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
  ]
})
export class MrpModule { }
