import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { PedidosComponent } from './pedidos.component';
import { PedidosRoutingModule } from './pedidos-routing.module';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/breadcrumb.module';
import { FormsModule } from '@angular/forms';
import { MapaRelacionesModule } from '../mapa-relaciones/mapa-relaciones.module';



@NgModule({
  declarations: [
    PedidosComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    PedidosRoutingModule,
    ApplicationPipesModule,
    BreadCrumbModule,
    FormsModule,
    MapaRelacionesModule

  ]
})
export class PedidosModule { }
