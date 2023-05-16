import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';

@Component({
  selector: 'app-new-solped',
  providers:[MessageService],
  templateUrl: './new-solped.component.html',
  styleUrls: ['./new-solped.component.scss']
})
export class NewSolpedComponent implements OnInit {

  registroSolped:boolean = false;
  displayModal:boolean = false;
  loadingCargue:boolean = true;
  percentProgressBar:number=0;
  idSolped!:any;

  constructor(private messageService: MessageService,
    public authService: AuthService,
    private router:Router,
    private rutaActiva: ActivatedRoute,
    private comprasService: ComprasService) { }

  ngOnInit(): void {
    //console.log(this.rutaActiva);
    if(this.rutaActiva.snapshot.params){
      this.idSolped = this.rutaActiva.snapshot.params;
      //console.log(Object.keys(this.idSolped).length,this.idSolped);

      if(Object.keys(this.idSolped).length>0){
        this.displayModal= true;
        this.comprasService.solpedById(this.authService.getToken(),parseInt(this.idSolped.solped))
            .subscribe({
                  next:(solped)=>{
                        this.messageService.add({severity:'success', summary: 'Ok', detail: `Se han cargado correctamente los datos de la solped`});
                        this.displayModal= false;
                        
                  },
                  error:(err)=>{
                    console.error(err)
                    this.displayModal= false;
                    this.messageService.add({severity:'error', summary: '!Error', detail: err});
                  }
            });
      }
    }
    
  }


  registrarSolped(dataSolped:any){
    //console.log(dataSolped);
    const detalleSolped:any=dataSolped.solpedDet;
    const limit = 200
    const lineasDetSolped = dataSolped.solpedDet.length;
    const iteraciones = Math.ceil((lineasDetSolped / limit));
    const prcAdvance = 100 / (iteraciones+1);
    let rangoinf =0;
    let rangosup = limit;
    this.displayModal =true;
    

    const newDataSolped:any = {
      anexos:dataSolped.anexos,
      solped:dataSolped.solped
    }

    //console.log(newDataSolped);
    
    this.comprasService.saveSolped(this.authService.getToken(),newDataSolped)
            .subscribe({
                next: (result) =>{
                    ////console.log(result);
                    //this.submittedBotton = true;
                    if(result.status===501){
                      this.messageService.add({severity:'error', summary: '!Error', detail: JSON.stringify(result.err)});
                     
                    }else{
                      //this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                      this.percentProgressBar += prcAdvance;
                      let solpedID = result.solpednum;
                      //Upload files
                      
                      
                      for(let i=1;i<=iteraciones;i++){
                        //console.log(dataSolped.solpedDet.slice(rangoinf,rangosup));
                        let detailPartialSolped:any = dataSolped.solpedDet.slice(rangoinf,rangosup);
                        let data:any = {
                          id:solpedID,
                          solpedDet:detailPartialSolped
                        }
                        this.comprasService.saveDetailSolped(this.authService.getToken(),data)
                            .subscribe({
                                next:(result)=>{
                                    //console.log(result);
                                    this.percentProgressBar += prcAdvance;
                                    if(i==iteraciones){
                                      this.displayModal =false;
                                      this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                                      setTimeout(()=>{
                                        this.router.navigate(['portal/compras/solped']);
                                      },2000);
                                    }
                                },
                                error:(error)=>{
                                  console.error(error);
                                  this.displayModal =false;
                                  this.messageService.add({severity:'error', summary: '!Error', detail: error});
                                }
                            });                            
                        rangoinf+=limit;
                        rangosup+=limit;
                      }  
                      
                      this.loadFiles(solpedID,dataSolped.anexos);
                      
                    }
                },
                error: (err) =>{
                  console.log(err);
                  this.registroSolped =false;
                }
            });
  }

  loadFiles(solpedID:number,anexosSolped:any[] ){
    
    let body:any; 
    for(let anexo of anexosSolped){
      //console.log(anexo.file, anexo.file.name);
      body = new FormData();
      body.append('myFile', anexo.file, anexo.file.name);
      body.append('anexotipo',anexo.tipo);
      body.append('solpedID',solpedID);

      this.comprasService.uploadAnexo(this.authService.getToken(),body)
        .subscribe({
           next:(result)=>{
              
              //console.log(result);
              this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
              
           },
           error:(err)=>{
              //console.log(err);
              this.messageService.add({severity:'error', summary: '!Error¡', detail: err});
           }
        });
      
    }
    //this.router.navigate(['portal/compras/solped']);
  }

}
