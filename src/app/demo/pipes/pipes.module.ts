// application-pipes.module.ts
// other imports
import { NgModule } from '@angular/core';
import { EstadosPipe } from './estados.pipe';
import { SeriesPipe } from './series.pipe';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [ 
    EstadosPipe,
    SeriesPipe
  ],
  exports: [
    EstadosPipe,
    SeriesPipe
  ]
})
export class ApplicationPipesModule {}