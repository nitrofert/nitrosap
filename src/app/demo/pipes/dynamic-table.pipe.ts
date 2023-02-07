import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'dynamictable'
})
export class DynamicTablePipe implements PipeTransform {

    constructor(private sanitizer:DomSanitizer){}

  transform(value: any, modulo: string): any  {
        let table = `<app-dynamic-table></app-dynamic-table>`;
        return this.sanitizer.bypassSecurityTrustStyle(table); 
  }

}
