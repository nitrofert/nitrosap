import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsuariosComponent } from './usuarios.component';
import { NuevoUsuarioComponent } from './pages/nuevo-usuario/nuevo-usuario.component';
import { EditarUsuarioComponent } from './pages/editar-usuario/editar-usuario.component';
import { EmpresasUsuarioComponent } from './pages/empresas-usuario/empresas-usuario.component';
import { PerfilesUsuarioComponent } from './pages/perfiles-usuario/perfiles-usuario.component';

import { UsuarioRoutingModule } from './usuarios-routing.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';

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
import { ToggleButtonModule } from 'primeng/togglebutton';
import {PasswordModule} from 'primeng/password';

import {SelectButtonModule} from 'primeng/selectbutton';
import {DividerModule} from 'primeng/divider';*/




@NgModule({
  declarations: [
        UsuariosComponent,
             NuevoUsuarioComponent,
             EditarUsuarioComponent,
             EmpresasUsuarioComponent,
             PerfilesUsuarioComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    FormsModule,
        /*TableModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        PasswordModule,
        MessagesModule,
        MessageModule,
        SelectButtonModule,
        DividerModule*/
        PrimengModule
  ]
})
export class UsuariosModule { }
