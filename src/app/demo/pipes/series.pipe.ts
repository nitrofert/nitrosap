import { getSupportedInputTypes } from '@angular/cdk/platform';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { SAPService } from '../service/sap.service';

@Pipe({
  name: 'series'
})
export class SeriesPipe implements PipeTransform {

    series:any[]=[];
    doctype:string = "";
    serie!:string;

    constructor(private sapService:SAPService,
                private authService: AuthService) {
                
               
    }

  async transform(value: string, modulo: string): Promise<any>  {
    switch (modulo) {
      case 'solped':
          this.doctype ="1470000113";
          
          this.sapService.seriesDocXEngineSAP(this.authService.getToken(),this.doctype)
          .subscribe({
              next: (series)=>{
                  let serie = "";
                  for(let item in series){
                    if(series[item].code===value){
                      serie = series[item].name;  
                    }
                  }
                  return serie;
              },
              error:(err)=>{
                  console.error(err);
                  return value;
              }
          });
          
      break;

      case 'pedido':
        this.doctype = "22";
        
        this.sapService.seriesDocXEngineSAP(this.authService.getToken(),this.doctype)
          .subscribe({
              next: (series)=>{
                  let serie = "";
                  for(let item in series){
                    if(series[item].code===value){
                      serie = series[item].name;  
                    }
                  }
                  //console.log(serie);
                  return serie;
              },
              error:(err)=>{
                  console.error(err);
                  return value;
              }
          });
          
      break;

      case 'entrada':
        this.doctype = "20";

        this.sapService.seriesDocXEngineSAP(this.authService.getToken(),this.doctype)
          .subscribe({
              next: (series)=>{
                  let serie = "";
                  for(let item in series){
                    if(series[item].code===value){
                      serie = series[item].name;  
                    }
                  }

                  return serie;
              },
              error:(err)=>{
                  console.error(err);
                  return value;
              }
          });
        
       
      break;

      default: return value
    }

   

  }



 

}


