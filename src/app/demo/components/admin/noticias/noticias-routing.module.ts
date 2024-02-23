import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NoticiasComponent } from './noticias.component';
import { NuevaNoticiaComponent } from './pages/nueva-noticia/nueva-noticia.component';
import { EditarNoticiaComponent } from './pages/editar-noticia/editar-noticia.component';




@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: NoticiasComponent },
        { path: 'nuevo', component: NuevaNoticiaComponent },
        { path: 'editar/:noticia', component: EditarNoticiaComponent }
    ])],
    exports: [RouterModule]
})
export class NoticiasRoutingModule { }
