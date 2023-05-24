import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuentasComponent } from './cuentas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { CuentasRoutingModule } from './cuentas-routing.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/breadcrumb.module';



@NgModule({
  declarations: [
    CuentasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PrimengModule,
    CuentasRoutingModule,
    ReactiveFormsModule,
    BreadCrumbModule
  ]
})
export class CuentasModule { }
