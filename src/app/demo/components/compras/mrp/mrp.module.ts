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







@NgModule({
  declarations: [
    MrpComponent,
    FromTableCalculadoraComponent
  ],
  imports: [
    CommonModule,
    MrpRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    ApplicationPipesModule,
    BreadCrumbModule
  ]
})
export class MrpModule { }
