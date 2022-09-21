import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolpedComponent } from './solped.component';
import { SolpedRoutingModule } from './solped-routing.module';
import { EditarSolpedComponent } from './pages/editar-solped/editar-solped.component';
import { NuevaSolpedComponent } from './pages/nueva-solped/nueva-solped.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
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
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import {CalendarModule} from 'primeng/calendar';
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {SplitButtonModule} from 'primeng/splitbutton';
import {BadgeModule} from 'primeng/badge';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { EstadosPipe } from 'src/app/demo/pipes/estados.pipe';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { RechazoSolpedComponent } from './pages/rechazo-solped/rechazo-solped.component';
import { TestMailComponent } from './pages/test-mail/test-mail.component';
import { ResponseApprovedComponent } from './pages/response-approved/response-approved.component';
import {TooltipModule} from 'primeng/tooltip';




@NgModule({
  declarations: [
    SolpedComponent,
    NuevaSolpedComponent,
    EditarSolpedComponent,
    EstadosPipe,
    RechazoSolpedComponent,
    TestMailComponent,
    ResponseApprovedComponent
  ],
  imports: [
    CommonModule,
    SolpedRoutingModule,
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
        CalendarModule,
        DialogModule,
        DividerModule,
        AutoCompleteModule,
        ReactiveFormsModule,
        InputNumberModule,
        SplitButtonModule,
        BadgeModule,
        InputTextareaModule,
        ConfirmDialogModule,
        TooltipModule
  ]
})
export class SolpedModule { }
