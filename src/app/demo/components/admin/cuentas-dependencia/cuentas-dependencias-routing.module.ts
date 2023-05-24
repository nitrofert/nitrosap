import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CuentasDependenciaComponent } from './cuentas-dependencia.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CuentasDependenciaComponent },
       
    ])],
    exports: [RouterModule]
})
export class CuentasDependenciaRoutingModule { }