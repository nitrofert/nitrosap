import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmpresasComponent } from './empresas.component';
import { EditarEmpresaComponent } from './pages/editar-empresa/editar-empresa.component';
import { NuevaEmpresaComponent } from './pages/nueva-empresa/nueva-empresa.component';



@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EmpresasComponent },
        { path: 'nuevo', component: NuevaEmpresaComponent },
        { path: 'editar/:company', component: EditarEmpresaComponent }
    ])],
    exports: [RouterModule]
})
export class EmpresaRoutingModule { }
