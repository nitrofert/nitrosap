import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SolpedInterface } from 'src/app/demo/api/solped';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';

@Component({
  selector: 'app-edit-solped',
  providers:[MessageService],
  templateUrl: './edit-solped.component.html',
  styleUrls: ['./edit-solped.component.scss']
})
export class EditSolpedComponent implements OnInit {

  solpedSeleccionada!:any;

  constructor(private rutaActiva: ActivatedRoute,
    private messageService: MessageService,

    private authService: AuthService,

    private router:Router,
    private comprasService: ComprasService) { }

  ngOnInit(): void {

    this.solpedSeleccionada = this.rutaActiva.snapshot.params;

    
  }


 

  actualizarSolped(dataSolped:any){
    console.log(dataSolped);

    this.comprasService.updateSolped(this.authService.getToken(),dataSolped)
            .subscribe({
                next: (result) =>{
                    console.log(result);
                    //this.submittedBotton = true;
                    if(result.status===501){
                      this.messageService.add({severity:'error', summary: '!Error', detail: JSON.stringify(result.err)});
                    }else{
                      this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                      setTimeout(()=>{
                        this.router.navigate(['portal/compras/solped']);
                      },2000);
                    }
                },
                error: (err) =>{
                  console.log(err);
                }
            });
  }

}
