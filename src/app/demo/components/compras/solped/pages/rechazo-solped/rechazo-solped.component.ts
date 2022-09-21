import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';
import decode from 'jwt-decode';

import { ComprasService } from 'src/app/demo/service/compras.service';
import { AuthService } from 'src/app/demo/service/auth.service';


@Component({
  selector: 'app-rechazo-solped',
  providers: [MessageService],
  templateUrl: './rechazo-solped.component.html',
  styleUrls: ['./rechazo-solped.component.scss']
})
export class RechazoSolpedComponent implements OnInit {

  tokenAprovedLine:any = "";
  infoTokenAprovedLine:any;
  justificacion:string = "";
  submitted:boolean = false;


  constructor(private rutaActiva: ActivatedRoute,
              private jwtHelperService: JwtHelperService,
              private messageService: MessageService,
              private comprasService: ComprasService,
              private router:Router,
              private authService: AuthService){

  }

  ngOnInit(): void {



        // Obtener id de la solped seleccionada
        this.tokenAprovedLine = this.rutaActiva.snapshot.params;
        console.log((this.tokenAprovedLine));
        
        this.infoTokenAprovedLine = decode(this.tokenAprovedLine.crypt);
        console.log(this.infoTokenAprovedLine);

      

      

      

  }


  rechazar(){
      this.submitted = true;
      if(this.justificacion){
          console.log(this.justificacion);

          this.infoTokenAprovedLine.infoSolped.comments = this.justificacion;

          this.comprasService.rechazoSolped(this.infoTokenAprovedLine)
              .subscribe({
                  next: (result) =>{
                      console.log(result);
                      if(result[0].status==='error'){
                        this.messageService.add({severity:'error', summary: '!Ops', detail: result[0].message});
                      }else{
                        this.messageService.add({severity:'success', summary: 'Correcto', detail: result[0].message});
                      }
                      this.router.navigate(['']);
                  },
                  error:(err) =>{
                      console.log(err);
                  }
              });

      }else{
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Debe registrar la justificación del rechazo de la solicitud'});
      }
  }

}