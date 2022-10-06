import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditSolpedComponent } from './pages/edit-solped/edit-solped.component';
import { EditarSolpedComponent } from './pages/editar-solped/editar-solped.component';
import { FormSolpedComponent } from './pages/form-solped/form-solped.component';
import { NewSolpedComponent } from './pages/new-solped/new-solped.component';
import { NuevaSolpedComponent } from './pages/nueva-solped/nueva-solped.component';

import { SolpedComponent } from './solped.component';




@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SolpedComponent }, 
        { path: 'nueva', component: NewSolpedComponent },
        { path: 'editar/:solped', component: EditSolpedComponent },
        { path: 'formSolped', component: NewSolpedComponent }
    ])],
    exports: [RouterModule]
})
export class SolpedRoutingModule { }