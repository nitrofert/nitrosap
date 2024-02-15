import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaRelacionesComponent } from './mapa-relaciones.component';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [
    MapaRelacionesComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicationPipesModule,
    BreadCrumbModule
  ],
  exports:[MapaRelacionesComponent]
})
export class MapaRelacionesModule { }
