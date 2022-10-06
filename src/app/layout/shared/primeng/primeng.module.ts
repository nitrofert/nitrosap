import { NgModule } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge'
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton'
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import {BreadcrumbModule} from 'primeng/breadcrumb';



@NgModule({
  exports:[
    AutoCompleteModule,
    BadgeModule,
    ButtonModule,
    BreadcrumbModule,
    CalendarModule,
    ChartModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    DividerModule,
    DropdownModule,
    InputNumberModule,
    InputSwitchModule,
    InputTextareaModule,
    InputTextModule,
    MenuModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    PasswordModule,
    PanelMenuModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    RippleModule,
    SelectButtonModule,
    SidebarModule,
    SliderModule,
    SplitButtonModule,
    StyleClassModule,
    TableModule,
    ToastModule,
    ToggleButtonModule,
    TooltipModule
  ]
})
export class PrimengModule { }
