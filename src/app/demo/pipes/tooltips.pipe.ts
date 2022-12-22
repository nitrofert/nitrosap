import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tooltips'
})
export class TooltipsPipe implements PipeTransform {

  transform(value: string, longitud:number,doc?:string): string  {
    //console.log(value,doc);
    //console.log(value.length,longitud);

    if(value.length>=longitud){
        value = value.substring(0,longitud)+' ...';
    }
   return value;
  }

}
