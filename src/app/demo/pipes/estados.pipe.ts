import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estados'
})
export class EstadosPipe implements PipeTransform {

  transform(value: string, modulo: string): string  {
    switch (modulo) {
      case 'solped':
          switch (value) {
            case 'O':
                return 'Abierta'
            break;

            case 'C':
                return 'Cerrada'
            break;

            default: return value
            
          }
      break;

      case 'aprobacion':
          switch (value) {
            case 'N':
                return 'No enviada'
            break;

            case 'A':
                return 'Aprobada'
            break;

            case 'P':
                return 'Pendiente'
            break;

            case 'R':
                return 'Rechazada'
            break;

            default: return value
            
          }
      break;

      default: return value
    }
  }

}
