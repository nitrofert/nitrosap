import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EvaluacionProveedoresComponent } from './pages/evaluacion-proveedores/evaluacion-proveedores.component';
import { ReportesComponent } from './reportes.component';

@NgModule({
   
    imports: [RouterModule.forChild([
        { path: '', component: ReportesComponent, },
        { path: 'evaluacion-proveedores', component: EvaluacionProveedoresComponent }, 
    ])],
    exports: [RouterModule]
})
export class ReportesRoutingModule { }