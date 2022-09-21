import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { MenuComponent } from './menu.component';
import { NuevoMenuComponent } from './pages/nuevo-menu/nuevo-menu.component';
import { EditarMenuComponent } from './pages/editar-menu/editar-menu.component';

import { MenuRoutingModule } from './menu-routing.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';

/*import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';


import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';*/



@NgModule({
  declarations: [MenuComponent,NuevoMenuComponent,EditarMenuComponent],
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
        MenuRoutingModule,
        //MessagesModule,
        //MessageModule
        PrimengModule
        
  ]
})
export class MenuModule { }
