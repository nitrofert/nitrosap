import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MrpComponent } from './mrp.component';





@NgModule({
    imports: [RouterModule.forChild([
        { path: 'calculadora', component: MrpComponent }, 
      
    ])],
    exports: [RouterModule]
})
export class MrpRoutingModule { }