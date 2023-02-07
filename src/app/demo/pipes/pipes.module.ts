// application-pipes.module.ts
// other imports
import { NgModule } from '@angular/core';
import { DynamicTablePipe } from './dynamic-table.pipe';
import { EstadosPipe } from './estados.pipe';
import { SeriesPipe } from './series.pipe';
import { TooltipsPipe } from './tooltips.pipe';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [ 
    EstadosPipe,
    SeriesPipe,
    TooltipsPipe,
    DynamicTablePipe
  ],
  exports: [
    EstadosPipe,
    SeriesPipe,
    TooltipsPipe,
    DynamicTablePipe
  ]
})
export class ApplicationPipesModule {}