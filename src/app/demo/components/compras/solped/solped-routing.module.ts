import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditSolpedMpComponent } from './pages/edit-solped-mp/edit-solped-mp.component';
import { EditSolpedComponent } from './pages/edit-solped/edit-solped.component';
import { EditarSolpedComponent } from './pages/editar-solped/editar-solped.component';
import { FormSolpedComponent } from './pages/form-solped/form-solped.component';
import { NewSolpedMpComponent } from './pages/new-solped-mp/new-solped-mp.component';
import { NewSolpedComponent } from './pages/new-solped/new-solped.component';
import { NuevaSolpedComponent } from './pages/nueva-solped/nueva-solped.component';
import { TrackingMPComponent } from './pages/tracking-mp/tracking-mp.component';

import { SolpedComponent } from './solped.component';
import { SolpedsAprobadasComponent } from './solpeds-aprobadas/solpeds-aprobadas.component';




@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SolpedComponent }, 
        { path: 'nueva', component: NewSolpedComponent },
        { path: 'editar/:solped', component: EditSolpedComponent },
        { path: 'formSolped', component: NewSolpedComponent },
        { path: 'tracking', component: TrackingMPComponent },
        { path: 'nueva-mp', component: NewSolpedMpComponent },
        { path: 'editar-mp/:solped', component: EditSolpedMpComponent },
        { path: 'aprobadas', component: SolpedsAprobadasComponent },
    ])],
    exports: [RouterModule]
})
export class SolpedRoutingModule { }