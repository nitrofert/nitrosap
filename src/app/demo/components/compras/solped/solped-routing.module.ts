import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditarSolpedComponent } from './pages/editar-solped/editar-solped.component';
import { NuevaSolpedComponent } from './pages/nueva-solped/nueva-solped.component';

import { SolpedComponent } from './solped.component';




@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SolpedComponent }, 
        { path: 'nueva', component: NuevaSolpedComponent },
        { path: 'editar/:solped', component: EditarSolpedComponent }
    ])],
    exports: [RouterModule]
})
export class SolpedRoutingModule { }