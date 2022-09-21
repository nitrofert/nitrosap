import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PerfilesComponent } from './perfiles.component';
import { NuevoPerfilComponent } from './pages/nuevo-perfil/nuevo-perfil.component';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';

import { PerfilRoutingModule } from './perfiles-routing.module';

/*import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';*/
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';





@NgModule({
  declarations: [
    PerfilesComponent,NuevoPerfilComponent,EditarPerfilComponent
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
    PerfilRoutingModule,
    PrimengModule
  ]
})
export class PerfilesModule { }
