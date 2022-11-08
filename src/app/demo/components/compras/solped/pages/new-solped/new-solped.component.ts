import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private messageService: MessageService,
    private authService: AuthService,
    private router:Router,
    private comprasService: ComprasService) { }

  ngOnInit(): void {
  }

  registrarSolped(dataSolped:any){
    //console.log(dataSolped);
    this.comprasService.saveSolped(this.authService.getToken(),dataSolped)
            .subscribe({
                next: (result) =>{
                    //console.log(result);
                    //this.submittedBotton = true;
                    if(result.status===501){
                      this.messageService.add({severity:'error', summary: '!Error', detail: JSON.stringify(result.err)});
                     
                    }else{
                      this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                      let solpedID = result.solpednum;
                      //Upload files
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
    this.router.navigate(['portal/compras/solped']);
  }

}
