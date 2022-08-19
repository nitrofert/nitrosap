import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';
import { NuevoPerfilComponent } from './pages/nuevo-perfil/nuevo-perfil.component';

import { PerfilesComponent } from './perfiles.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PerfilesComponent },
        { path: 'nuevo', component: NuevoPerfilComponent },
        { path: 'editar/:perfil', component: EditarPerfilComponent }
    ])],
    exports: [RouterModule]
})
export class PerfilRoutingModule { }
