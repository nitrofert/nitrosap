import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { EntradasComponent } from './entradas.component';
import { ConsultaEntradaComponent } from './pages/consulta-entrada/consulta-entrada.component';
import { ImpresionComponent } from './pages/impresion/impresion.component';
import { NuevaEntradaComponent } from './pages/nueva-entrada/nueva-entrada.component';
import { EntradasAbiertasComponent } from './pages/rpt-entradas-abiertas/entradas-abiertas.component';





@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EntradasComponent },
        { path: 'nueva', component: NuevaEntradaComponent },
        { path: 'abiertas', component: EntradasAbiertasComponent }, 
        { path: 'consultar/:entrada', component: ConsultaEntradaComponent }, 
        { path: 'impresion/:entrada', component: ImpresionComponent }, 
        
       
    ])],
    exports: [RouterModule]
})
export class EntradasRoutingModule { }