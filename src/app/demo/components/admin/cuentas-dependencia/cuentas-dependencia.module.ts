import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuentasDependenciaComponent } from './cuentas-dependencia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { CuentasDependenciaRoutingModule } from './cuentas-dependencias-routing.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [
    CuentasDependenciaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PrimengModule,
    CuentasDependenciaRoutingModule,
    ReactiveFormsModule,
    BreadCrumbModule
  ]
})
export class CuentasDependenciaModule { }
