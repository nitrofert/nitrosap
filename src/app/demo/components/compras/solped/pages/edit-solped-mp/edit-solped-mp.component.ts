import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';


@Component({
  selector: 'app-edit-solped-mp',
  providers:[MessageService],
  templateUrl: './edit-solped-mp.component.html',
  styleUrls: ['./edit-solped-mp.component.scss']
})
export class EditSolpedMpComponent implements OnInit {

  solpedSeleccionada!:any;
  pathSolped:string="";

  constructor(private rutaActiva: ActivatedRoute,
    private messageService: MessageService,

    private authService: AuthService,

    private router:Router,
    private comprasService: ComprasService) { }

  ngOnInit(): void {

    this.solpedSeleccionada = this.rutaActiva.snapshot.params;
    this.pathSolped = this.rutaActiva.snapshot.url[0].path;
   
    
    
  }


 

  actualizarSolped(dataSolped:any){
    //console.log(dataSolped);

    this.comprasService.updateSolpedMP(this.authService.getToken(),dataSolped)
            .subscribe({
                next: (result) =>{
                    //console.log(result);
                    //this.submittedBotton = true;
                    if(result.status===501){
                      this.messageService.add({severity:'error', summary: '!Error', detail: JSON.stringify(result.err)});
                    }else{
                        console.log(dataSolped.solped.approved);
                        if(dataSolped.solped.approved=='A'){
                          //Actualizar info de solped en SAP
                          //console.log('Update info en SAp');
                          this.comprasService.actualizarSolpedSAP(this.authService.getToken(),dataSolped)
                              .subscribe({
                                next:(result)=>{
                                  //console.log(result);
                                  this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                                  setTimeout(()=>{
                                    this.router.navigate(['portal/compras/solped/tracking']);
                                    
                                  },2000);
                                },
                                error: (err)=>{
                                  console.log(err);
                                }
                              });
                        }else{
                          this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                                  setTimeout(()=>{
                                    this.router.navigate(['portal/compras/solped/tracking']);
                                  },2000);
                        }

                      
                    }
                },
                error: (err) =>{
                  console.log(err);
                }
            });
  }
}
