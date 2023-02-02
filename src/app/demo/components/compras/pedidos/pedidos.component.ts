import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ListadoPedidos } from 'src/app/demo/api/listadoPedidos';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { InfoUsuario, PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { ActivatedRoute, Router } from '@angular/router';
import { SAPService } from 'src/app/demo/service/sap.service';
import {MenuItem} from 'primeng/api';


interface expandedRows {
  [key: string]: boolean;
}


@Component({
  selector: 'app-pedidos',
  providers: [MessageService, ConfirmationService],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
  styles: [`
        :host ::ng-deep  .p-frozen-column {
            font-weight: bold;
        }

        :host ::ng-deep .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        :host ::ng-deep .p-progressbar {
            height:.5rem;
        }
    `]
})
export class PedidosComponent implements OnInit {

  @ViewChild('filter') filter!: ElementRef;

  infoUsuario!: InfoUsuario;
  perfilesUsuario: PerfilesUsuario[] = [];
  permisosUsuario: PermisosUsuario[] = [];
  permisosUsuarioPagina!:PermisosUsuario[];
  series:any[]=[];

  urlBreadCrumb:string ="";

  pedidos:any[] = [];

  loading:boolean = true;

  pedidoSeleccionado:any[]= [];


  constructor(private comprasService:ComprasService,
              private authService: AuthService,
              private router:Router,
              private sapService:SAPService,
              private rutaActiva: ActivatedRoute) { }

  ngOnInit(): void {

    console.log("pedidos");
     //Cargar informacion del usuario
     this.getInfoUsuario();
     //Cargar perfiles del usuario
     this.getPerfilesUsuario();
     //Cargar permisos del usuario
     this.getPermisosUsuario();
     //Cargar permisos usuario pagina
     this.getPermisosUsuarioPagina();
     //Cargar listado de pedidos pendientes por realizar entradas y que estan asociados a una solped
    this.getListado();
    
  }

  /**** Getters ****/

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
    if(this.rutaActiva.snapshot.params['solped']){
      let idSolpedSelected = this.rutaActiva.snapshot.params;
      if(this.router.url.indexOf("/"+idSolpedSelected['solped'])>=0){
        url = this.router.url.substring(0,this.router.url.indexOf("/"+idSolpedSelected['solped']));
      }
      //console.log("URL con parametros: ",url);
    }else{
      url= this.router.url;
      //console.log("URL sin parametros: ",url);
    }
    this.urlBreadCrumb = url;
    this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===url);
    console.log(this.permisosUsuario,this.permisosUsuarioPagina);
  }



  getListado(){
    this.comprasService.ordenesAbiertasUsuarioXE(this.authService.getToken())
        .subscribe({
            next: (pedidos)=>{
                
                //this.pedidos = [];
                let lineaPedidos:any[] = []
                for(let item in pedidos){

                 lineaPedidos.push(pedidos[item]);
                }
                this.pedidos = lineaPedidos;
                console.log(this.pedidos);
                this.loading = false;
            },
            error: (err)=>{
              console.log(err);
            }
        });
  }


  nuevaEntrada(){
    console.log(this.pedidos);
    console.log(this.pedidoSeleccionado);

    localStorage.setItem("pedidoSeleccionado",JSON.stringify(this.pedidoSeleccionado[0].DocEntry));
    this.router.navigate(['/portal/compras/entradas/nueva/']);
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
