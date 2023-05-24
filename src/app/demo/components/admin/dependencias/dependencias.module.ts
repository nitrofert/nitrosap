import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DependenciasComponent } from './dependencias.component';
import { DependenciasRoutingModule } from './dependencias-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [
    DependenciasComponent
  ],
  imports: [
    CommonModule,
    DependenciasRoutingModule,
    FormsModule,
    PrimengModule,
    ReactiveFormsModule,
    BreadCrumbModule
  ]
})
export class DependenciasModule { }
