import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesComponent } from './reportes.component';
import { ReportesRoutingModule } from './reportes-routing.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/breadcrumb.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EvaluacionProveedoresComponent } from './pages/evaluacion-proveedores/evaluacion-proveedores.component';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';




@NgModule({
  declarations: [ReportesComponent,
                 EvaluacionProveedoresComponent],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    PrimengModule,
    BreadCrumbModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicationPipesModule
  ]
})
export class ReportesModule { }
