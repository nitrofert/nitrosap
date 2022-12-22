// application-pipes.module.ts
// other imports
import { NgModule } from '@angular/core';
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
    TooltipsPipe
  ],
  exports: [
    EstadosPipe,
    SeriesPipe,
    TooltipsPipe
  ]
})
export class ApplicationPipesModule {}