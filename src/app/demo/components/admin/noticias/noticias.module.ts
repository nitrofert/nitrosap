import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevaNoticiaComponent } from './pages/nueva-noticia/nueva-noticia.component';
import { EditarNoticiaComponent } from './pages/editar-noticia/editar-noticia.component';
import { NoticiasComponent } from './noticias.component';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/breadcrumb.module';
import { NoticiasRoutingModule } from './noticias-routing.module';




@NgModule({
  declarations: [
    NuevaNoticiaComponent,
    EditarNoticiaComponent,
    NoticiasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
        //TableModule,
        //RatingModule,
        //ButtonModule,
        //SliderModule,
        //InputTextModule,
        //ToggleButtonModule,
        //RippleModule,
        //MultiSelectModule,
        //DropdownModule,
        //ProgressBarModule,
        //ToastModule,
        
        //MessagesModule,
        //MessageModule,
        NoticiasRoutingModule,
        PrimengModule,
        BreadCrumbModule,
  ]
})
export class NoticiasModule { }
