import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';

@Component({
  selector: 'app-nueva-entrada',
  providers:[MessageService],
  templateUrl: './nueva-entrada.component.html',
  styleUrls: ['./nueva-entrada.component.scss']
})
export class NuevaEntradaComponent implements OnInit {

  pedido:any ;
  infoPedido:any;
  envioForm:boolean =false;

  constructor(private router:Router,
              private messageService: MessageService,
              private rutaActiva: ActivatedRoute,
              public authService: AuthService,
              private comprasService:ComprasService) {

     }

  ngOnInit(): void {
    this.pedido = JSON.parse(localStorage.getItem("pedidoSeleccionado") ||'');
    console.log(this.pedido);
    
  }

  registrarEntrada(dataEntrada:any){
    //console.log(dataEntrada);
    this.envioForm = true;
    this.comprasService.saveEntrada(this.authService.getToken(),dataEntrada)
            .subscribe({
                next: (result) =>{
                    console.log('Resultado Registro entrada',result);
                    //this.submittedBotton = true;
                    this.envioForm = false;
                    if(result.status===501){
                      this.messageService.add({severity:'error', summary: '!Error', detail: JSON.stringify(result.err)});
                     
                    }else{
                     this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});

                   
                    
                     
                      setTimeout(()=>{
                        this.router.navigate(['portal/compras/entradas']);
                      },6000);
                      
                    }
                },
                error: (err) =>{
                  console.log(err);
                 
                }
            });
  }

  

}
