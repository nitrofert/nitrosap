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
 

  constructor(private rutaActiva: ActivatedRoute,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private authService: AuthService,
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
        this.getEntradas();

        //this.sapService.getLoginSAP();
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
      console.log("URL con parametros: ",url);
    }else{
      url= this.router.url;
      console.log("URL sin parametros: ",url);
    }
    this.urlBreadCrumb = url;
    this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===url);
    console.log(this.permisosUsuario,this.permisosUsuarioPagina);
  }

  getEntradas(){
    this.comprasService.listEntrada(this.authService.getToken())
    .subscribe({
      next:(entradas =>{
        this.loading = false;
          console.log(entradas);
          this.entradas = entradas;
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
    console.log(this.entradaSeleccionada[0].id);
    this.router.navigate(['portal/compras/entradas/consultar/'+this.entradaSeleccionada[0].id]);
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
