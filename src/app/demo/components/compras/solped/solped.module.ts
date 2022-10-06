import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SolpedComponent } from './solped.component';
import { SolpedRoutingModule } from './solped-routing.module';
import { EditarSolpedComponent } from './pages/editar-solped/editar-solped.component';
import { NuevaSolpedComponent } from './pages/nueva-solped/nueva-solped.component';
import { RechazoSolpedComponent } from './pages/rechazo-solped/rechazo-solped.component';
import { TestMailComponent } from './pages/test-mail/test-mail.component';
import { ResponseApprovedComponent } from './pages/response-approved/response-approved.component'

import { EstadosPipe } from 'src/app/demo/pipes/estados.pipe';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { FormSolpedComponent } from './pages/form-solped/form-solped.component';
import { NewSolpedComponent } from './pages/new-solped/new-solped.component';
import { EditSolpedComponent } from './pages/edit-solped/edit-solped.component';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/breadcrumb.module';






@NgModule({
  declarations: [
    SolpedComponent,
    NuevaSolpedComponent,
    EditarSolpedComponent,
    //EstadosPipe,
    RechazoSolpedComponent,
    TestMailComponent,
    ResponseApprovedComponent,
    FormSolpedComponent,
    NewSolpedComponent,
    EditSolpedComponent
  ],
  imports: [
    CommonModule,
    SolpedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    ApplicationPipesModule,
    BreadCrumbModule
  ]
})
export class SolpedModule { }
