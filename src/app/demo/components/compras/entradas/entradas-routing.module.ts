import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { EntradasComponent } from './entradas.component';
import { ConsultaEntradaComponent } from './pages/consulta-entrada/consulta-entrada.component';
import { NuevaEntradaComponent } from './pages/nueva-entrada/nueva-entrada.component';




@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EntradasComponent },
        { path: 'nueva', component: NuevaEntradaComponent }, 
        { path: 'consultar/:entrada', component: ConsultaEntradaComponent }, 
       
    ])],
    exports: [RouterModule]
})
export class EntradasRoutingModule { }