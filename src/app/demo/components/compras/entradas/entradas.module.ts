import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { EntradasComponent } from './entradas.component';
import { EntradasRoutingModule } from './entradas-routing.module';
import { FormEntradaComponent } from './pages/form-entrada/form-entrada.component';
import { NuevaEntradaComponent } from './pages/nueva-entrada/nueva-entrada.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { ConsultaEntradaComponent } from './pages/consulta-entrada/consulta-entrada.component';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/breadcrumb.module';
import { ImpresionComponent } from './pages/impresion/impresion.component';
import { PdfComponent } from 'src/app/layout/shared/pdf/pdf.component';




@NgModule({
  declarations: [
    EntradasComponent,
    FormEntradaComponent,
    NuevaEntradaComponent,
    ConsultaEntradaComponent,
    ImpresionComponent,
    PdfComponent
    
  ],
  imports: [
    CommonModule,
    PrimengModule,
    EntradasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicationPipesModule,
    BreadCrumbModule
  ]
})
export class EntradasModule { }
