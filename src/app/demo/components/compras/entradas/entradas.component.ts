import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { InfoUsuario, PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';

import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';

interface expandedRows {
  [key: string]: boolean;
}


@Component({
  selector: 'app-entradas',
  providers: [MessageService, ConfirmationService],
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.scss']
})
export class EntradasComponent implements OnInit {

  @ViewChild('filter') filter!: ElementRef;

  loading:boolean =false;
  entradas:any[] = [];
  entradaSeleccionada:any[]=[];

  urlBreadCrumb:string ="";

  infoUsuario!:InfoUsuario;
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];
  statuses:any = [{label:'Abierta', value:'O'},{label:'Cerrada', value:'C'}];
  approveds:any = [{label:'Pendiente', value:'P'},{label:'Aprobada', value:'A'}];

  
  series:any[] = [];
  displayModal:boolean = false;
  dialogCancel:boolean = false;
  comentariosCancel:string = "";

  dialogRechazo:boolean = false;

  documentoSeleccionado!:any;
  loadingMapa:boolean = false;
  verDocumento:boolean = false;
 

  constructor(private rutaActiva: ActivatedRoute,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    public authService: AuthService,
    private sapService:SAPService) { }

  ngOnInit(): void {


        //Cargar informacion del usuario
        this.getInfoUsuario();
        //Cargar perfiles del usuario
        this.getPerfilesUsuario();
        //Cargar permisos del usuario
        this.getPermisosUsuario();
        //Cargar permisos usuario pagina
        this.getPermisosUsuarioPagina();
        //Cargar listado de entradas registradas
        //this.getSeries();

        //this.sapService.getLoginSAP();
        this.getEntradas();
  }

  getInfoUsuario(){
    this.infoUsuario = this.authService.getInfoUsuario();
  }

  getPerfilesUsuario(){
    this.perfilesUsuario = this.authService.getPerfilesUsuario();
  }

  getPermisosUsuario(){
    this.permisosUsuario = this.authService.getPermisosUsuario();
  }

  getPermisosUsuarioPagina(){
    let url ="";
    //console.log("URL origen",this.router.url);
    //console.log("URL params",this.rutaActiva.snapshot.params['solped']);
    if(this.rutaActiva.snapshot.params['entrada']){
      let entradaSeleccionada = this.rutaActiva.snapshot.params;
      if(this.router.url.indexOf("/"+entradaSeleccionada['entrada'])>=0){
        url = this.router.url.substring(0,this.router.url.indexOf("/"+entradaSeleccionada['entrada']));
      }
      //console.log("URL con parametros: ",url);
    }else{
      url= this.router.url;
      //console.log("URL sin parametros: ",url);
    }
    this.urlBreadCrumb = url;
    this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===url);
    //console.log(this.permisosUsuario,this.permisosUsuarioPagina);
  }

  getSeries(){
    this.sapService.seriesDocXEngineSAP(this.authService.getToken(),'20')
        .subscribe({
            next: (series)=>{
                for(let item in series){
                    this.series.push(series[item]);
              }
              this.getEntradas();
            },
            error: (err)=>{
              console.log(err);
            }
        });
  }


  getEntradas(){
    this.displayModal = true;
    this.comprasService.listEntrada(this.authService.getToken())
    .subscribe({
      next:(entradas =>{

        console.log(entradas);
        this.loading = false;


         
          /*for(let lineaEntrada of entradas){
            lineaEntrada.serieStr = this.series.filter(data => data.code == lineaEntrada.serie)[0].name;
          }*/
          this.entradas = entradas;
          console.log(this.entradas);
          this.loading = false;
          this.displayModal = false;
      }),
      error:(err =>{
        console.log(err);
      })
    });
  }

  nuevaEntrada(){
    this.router.navigate(['portal/compras/pedidos']);
  }

  VerEntrada(){
    //console.log(this.entradaSeleccionada[0].id);
    this.router.navigate(['portal/compras/entradas/consultar/'+this.entradaSeleccionada[0].id]);
  }

  cancelar(){
    if(this.entradaSeleccionada[0].status == 'C' ){
      this.messageService.add({severity:'warn', summary: '!Error', detail: "La entrada seleccionada ya se encuentra cancelada"});
    }else if(this.entradaSeleccionada[0].approved == 'P'){
      this.messageService.add({severity:'warn', summary: '!Error', detail: "La entrada seleccionada se encuentra en un proceso de aprobación"});
    }else{
      this.dialogCancel=true;
    }
  }

  cancelarEntrada(){

    
      console.log(this.entradaSeleccionada);

      if(this.comentariosCancel!=""){

        this.confirmationService.confirm({
          message: `Esta usted seguro de cancelar la entrada número ${this.entradaSeleccionada[0].id}?`,

          accept: () => {
              //Actual logic to perform a confirmation
              const data:any = {
                  comment: this.comentariosCancel,
                  sapdocnum: this.entradaSeleccionada[0].sapdocnum
              }
              this.displayModal= true;
              this.sapService.cancelarEntrada(this.authService.getToken(),this.entradaSeleccionada[0].id,data)
                  .subscribe({
                        next:(result)=>{
                            console.log('next',result)
                            if(result.status ===200){
                              this.messageService.add({severity:'success', summary: 'Ok', detail: result.message});
                              this.getEntradas();
                              this.comentariosCancel="";
                              this.dialogCancel = false;
                            }else{
                              this.messageService.add({severity:'error', summary: '!Error', detail: result.err});
                            }
                            this.displayModal= false;
                        },
                        error:(err)=>{
                          console.error(err)
                          this.displayModal= false;
                          this.messageService.add({severity:'error', summary: '!Error', detail: err});
                        }
                  });
          }
      });

      }else{
        this.messageService.add({severity:'error', summary: '!Error', detail: "Debe ingresar un comentario para cancelar la entrada"});
      }
    

    

      
  
  
  }

  impresion(id:number){
    console.log(id);
    //window.open('portal/compras/entradas/impresion/'+id,'_blank')
    this.router.navigate(['portal/compras/entradas/impresion/'+id]);
  }

  solicitudAprobacion(entradas:any){
    console.log(entradas);
  }

 

  rechazarEntrada(){
    console.log(this.entradaSeleccionada);
    if(this.comentariosCancel!=""){

      this.confirmationService.confirm({
        message: `Esta usted seguro de rechazar la entrada número ${this.entradaSeleccionada[0].id}?`,

        accept: () => {
            //Actual logic to perform a confirmation
            const data:any = {
                comment: this.comentariosCancel,
                sapdocnum: this.entradaSeleccionada[0].id
            }
            this.displayModal= true;
            this.sapService.rechazarEntrada(this.authService.getToken(),this.entradaSeleccionada[0].id,data)
                .subscribe({
                      next:(result)=>{
                          console.log('next',result)
                          if(result.status ===200){
                            this.messageService.add({severity:'success', summary: 'Ok', detail: result.message});
                            this.getEntradas();
                            this.comentariosCancel="";
                            this.dialogRechazo = false;
                          }else{
                            this.messageService.add({severity:'error', summary: '!Error', detail: result.err});
                          }
                          this.displayModal= false;
                      },
                      error:(err)=>{
                        console.error(err)
                        this.displayModal= false;
                        this.messageService.add({severity:'error', summary: '!Error', detail: err});
                      }
                });
        }
    });

    }else{
      this.messageService.add({severity:'error', summary: '!Error', detail: "Debe ingresar un comentario para rechazar la entrada"});
    }
  }

  aprobar(entradas:any[]){

    
    this.confirmationService.confirm({
      message: entradas.length>1?`¿Esta usted seguro de aprobar las entradas seleccionadas ?`:`¿Esta usted seguro de aprobar la entrada seleccionada?`,

      accept: () => {
        console.log(entradas);
        let arrayEntradasAprobar:any[] = [];
        this.displayModal = true;
        for(let entrada of entradas){
          if(entrada.approved != 'P'){
            this.messageService.add({severity:'error', summary: '!Error', detail: `La entrada ${entrada.id} no puede ser enviada a aprobación. Ya fue aprobada` });
          }else{
            arrayEntradasAprobar.push(entrada.id);
          }
        }
    
        if(arrayEntradasAprobar.length>0){
          this.comprasService.aprobarEntradas(this.authService.getToken(),arrayEntradasAprobar)
        .subscribe({
          next:(entradas =>{
    
       
            for(let entradaApproved of entradas.arrayAproved){
              this.messageService.add({severity:'success', summary: '!Ok', detail: entradaApproved.message });
            }

            for(let entradaError of entradas.arrayErrors){
              this.messageService.add({severity:'error', summary: '!Error', detail: entradaError.message });
            }
    
             
              /*for(let lineaEntrada of entradas){
                lineaEntrada.serieStr = this.series.filter(data => data.code == lineaEntrada.serie)[0].name;
              }*/
              
              this.loading = false;
              

              this.getEntradas();
              
          }),
          error:(err =>{
            console.log(err);
          })
        });
        }
      }
    });
    
  }

  verMapaDeRelaciones(entrada:any){
    this.documentoSeleccionado = entrada.sapdocnum;
    this.loadingMapa = true;
    this.verDocumento = true;
  }

  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

}
