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
import { AdminService } from 'src/app/demo/service/admin.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';


interface expandedRows {
  [key: string]: boolean;
}


@Component({
  selector: 'app-pedidos',
  providers: [MessageService, ConfirmationService],
  templateUrl: './entradas-abiertas.component.html',
  //styleUrls: ['./entradas-abiertas.component.scss'],
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
export class EntradasAbiertasComponent implements OnInit {

  @ViewChild('filter') filter!: ElementRef;

  infoUsuario!: InfoUsuario;
  perfilesUsuario: PerfilesUsuario[] = [];
  permisosUsuario: PermisosUsuario[] = [];
  permisosUsuarioPagina!:PermisosUsuario[];
  series:any[]=[];

  urlBreadCrumb:string ="";

  entradas:any[] = [];

  loading:boolean = true;

  pedidoSeleccionado:any[]= [];

  areas_user:any[] = [];
  areas_user_selected:string ="";


  constructor(private comprasService:ComprasService,
              public authService: AuthService,
              private adminService:AdminService,
              private router:Router,
              private sapService:SAPService,
              private rutaActiva: ActivatedRoute,
              private functionsService :FunctionsService) { }

  ngOnInit(): void {

    //console.log("pedidos");
     //Cargar informacion del usuario
     this.getInfoUsuario();
     //Cargar perfiles del usuario
     this.getPerfilesUsuario();
     //Cargar permisos del usuario
     this.getPermisosUsuario();
     //Cargar permisos usuario pagina
     this.getPermisosUsuarioPagina();
     //Cargar listado de pedidos pendientes por realizar entradas y que estan asociados a una solped
     this.getAreasByUserSAP();
   
    
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
    ////console.log("URL origen",this.router.url);
    ////console.log("URL params",this.rutaActiva.snapshot.params['solped']);
    if(this.rutaActiva.snapshot.params['solped']){
      let idSolpedSelected = this.rutaActiva.snapshot.params;
      if(this.router.url.indexOf("/"+idSolpedSelected['solped'])>=0){
        url = this.router.url.substring(0,this.router.url.indexOf("/"+idSolpedSelected['solped']));
      }
      ////console.log("URL con parametros: ",url);
    }else{
      url= this.router.url;
      ////console.log("URL sin parametros: ",url);
    }
    this.urlBreadCrumb = url;
    this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===url);
    ////console.log(this.permisosUsuario,this.permisosUsuarioPagina);
  }

  getAreasByUserSAP(){
    this.adminService.getAreasByUserSAP(this.authService.getToken())
        .subscribe({
          next: (areas)=>{
              //console.log(areas);
              if(areas.length>0){
                this.areas_user = areas;
                this.areas_user_selected = this.areas_user[0].area
                this.getListado();
              }
              
          },
          error: (err)=>{
            console.error(err);
          }
      });
  }
  



  getListado(){
    this.comprasService.entradasAbiertasUsuarioXE(this.authService.getToken(),this.areas_user_selected)
    //this.comprasService.ordenesAbiertasUsuarioSL(this.authService.getToken())
    
        .subscribe({
            next: async (entradas)=>{
                
                let entradasAbiertas = (await this.functionsService.objectToArray(entradas)).filter((entrada: { ENTRADA: null; }) => entrada.ENTRADA != null)

                //console.log('entradasAbiertas',entradasAbiertas);

                let entradasAgrupadas = await this.functionsService.groupArray(await this.functionsService.clonObject(entradasAbiertas),'ENTRADA',[{EN_TOTAL_CON_IVA:0}]);

                //console.log('entradasAgrupadas',entradasAgrupadas);

                //this.pedidos = [];
                /*let lineaEntradas:any[] = []
                for(let item in entradasAgrupadas){

                 lineaEntradas.push(entradasAgrupadas[item]);
                }*/
                //this.entradas = lineaEntradas;

                this.entradas = entradasAgrupadas;
                //console.log(this.pedidos);
                this.loading = false;
            },
            error: (err)=>{
              //console.log(err);
            }
        });
  }

  SeleccionarArea(){
    //console.log(this.areas_user_selected);
    this.getListado();
  }


  nuevaEntrada(){
    //console.log(this.pedidos);
    //console.log(this.pedidoSeleccionado);

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
