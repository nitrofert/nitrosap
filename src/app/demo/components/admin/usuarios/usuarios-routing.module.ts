import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditarUsuarioComponent } from './pages/editar-usuario/editar-usuario.component';
import { EmpresasUsuarioComponent } from './pages/empresas-usuario/empresas-usuario.component';
import { NuevoUsuarioComponent } from './pages/nuevo-usuario/nuevo-usuario.component';
import { PerfilesUsuarioComponent } from './pages/perfiles-usuario/perfiles-usuario.component';
import { UsuariosComponent } from './usuarios.component';




@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: UsuariosComponent },
        { path: 'nuevo', component: NuevoUsuarioComponent },
        { path: 'editar/:user', component: EditarUsuarioComponent },
        { path: 'empresas/:user', component: EmpresasUsuarioComponent},
        { path: 'perfiles/:user', component: PerfilesUsuarioComponent},
    ])],
    exports: [RouterModule]
})
export class UsuarioRoutingModule { }
