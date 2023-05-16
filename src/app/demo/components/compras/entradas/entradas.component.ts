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

  
  series:any[] = [];
  displayModal:boolean = false;
  dialogCancel:boolean = false;
  comentariosCancel:string = "";
 

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
