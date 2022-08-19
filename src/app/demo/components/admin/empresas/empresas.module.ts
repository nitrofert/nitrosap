import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresasComponent } from './empresas.component';
import { NuevaEmpresaComponent } from './pages/nueva-empresa/nueva-empresa.component';
import { EditarEmpresaComponent } from './pages/editar-empresa/editar-empresa.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
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
import { EmpresaRoutingModule } from './empresas-routing.module';







@NgModule({
  declarations: [
    EmpresasComponent,
    NuevaEmpresaComponent,
    EditarEmpresaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
        TableModule,
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
        
        MessagesModule,
        MessageModule,
        EmpresaRoutingModule
  ]
})
export class EmpresasModule { }
