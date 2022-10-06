import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { PedidosComponent } from './pedidos.component';
import { PedidosRoutingModule } from './pedidos-routing.module';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [
    PedidosComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    PedidosRoutingModule,
    ApplicationPipesModule,
    BreadCrumbModule

  ]
})
export class PedidosModule { }
