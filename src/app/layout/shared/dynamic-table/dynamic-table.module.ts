import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table.component';
import { PrimengModule } from '../primeng/primeng.module';



@NgModule({
  declarations: [
    DynamicTableComponent
  ],
  imports: [
    CommonModule,
    PrimengModule
  ],
  exports:[DynamicTableComponent]
})
export class DynamicTableModule { }
