import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimengModule } from '../primeng/primeng.module';
import { DynamicTabmenuComponent } from './dynamic-tabmenu.component';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';



@NgModule({
  declarations: [
    DynamicTabmenuComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    ApplicationPipesModule
  ],
  exports:[DynamicTabmenuComponent]
})
export class DynamicTabmenuModule { }
