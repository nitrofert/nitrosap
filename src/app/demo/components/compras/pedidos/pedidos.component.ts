import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService, TreeNode, ConfirmEventType } from 'primeng/api';
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
  pedidosLineas:any;

  loading:boolean = true;

  pedidoSeleccionado:any[]= [];

  areas_user:any[] = [];
  areas_user_selected:string ="";

  verOrdenCompra:boolean = false;


  mapaRelaciones!:TreeNode[];

  loadingMapa:boolean = true;

  selectedNodes!: TreeNode[];

  nodoSeleccionado!:any;

  visualizarDocumento:boolean = false;

  tituloDocumento:string = "";

  arrayTrazabilidad:any[] = [];

  infoDocumento!:any;

  documentoSeleccionado:any = 0;

  data: TreeNode[] = [
    {
        label: 'Solped',
        expanded: true,
        data: {
          num:5200014,
          estado:'lock'
        },
        children: [
            {
                label: 'Pedido',
                expanded: true,
                data: {
                  num:5600123,
                  estado:'lock'
                },
                children: [
                    {
                        label: 'Entrada',
                        data: {
                          num:66001223,
                          estado:'lock'
                        },
                        expanded: true,
                        children: [
                          {
                              label: 'Factura',
                              data: {
                                num:7858,
                                estado:'lock-open'
                              }
                          }]
                    },
                    {
                        label: 'Entrada',
                        data: {
                          num:66001224,
                          estado:'lock-open'
                        }
                    }
                ]
            }
        ]
    }
];


  constructor(private comprasService:ComprasService,
              public authService: AuthService,
              private adminService:AdminService,
              private confirmationService: ConfirmationService,
              private router:Router,
              private sapService:SAPService,
              private rutaActiva: ActivatedRoute,
              private functionsService :FunctionsService) { }

  ngOnInit(): void {

    ////console.log("pedidos");
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
              ////console.log(areas);
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
    this.comprasService.ordenesAbiertasUsuarioXE(this.authService.getToken(),this.areas_user_selected)
    //this.comprasService.ordenesAbiertasUsuarioSL(this.authService.getToken())
    
        .subscribe({
            next: async (pedidos)=>{
              //console.log(pedidos);

                let pedidosAbiertos = await this.functionsService.objectToArray(pedidos);
                this.pedidosLineas = pedidosAbiertos;
                //console.log('pedidosAbiertos',pedidosAbiertos);
                let pedidosAgrupados = await this.functionsService.groupArray(await this.functionsService.clonObject(pedidosAbiertos),'DocNum',[{LineTotal:0, OpenSum:0}]);

                //console.log('pedidosAgrupados',pedidosAgrupados);
                //this.pedidos = [];
               /* let lineaPedidos:any[] = []
                for(let item in pedidosAgrupados){

                 lineaPedidos.push(pedidosAgrupados[item]);
                }
                this.pedidos = lineaPedidos;
                */
                this.pedidos = pedidosAgrupados;
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
    ////console.log(this.pedidos);
    ////console.log(this.pedidoSeleccionado);

    localStorage.setItem("pedidoSeleccionado",JSON.stringify(this.pedidoSeleccionado[0].DocEntry));
    this.router.navigate(['/portal/compras/entradas/nueva/']);
  }

  verMapaDeRelaciones(Pedido:any){
    this.documentoSeleccionado = Pedido.DocNum;
    
    

    this.loadingMapa = true;
    this.verOrdenCompra = true;
  }

  mapaDeRelaciones(Pedido:any){


    this.documentoSeleccionado = Pedido.DocNum;

    this.loadingMapa = true;
    this.verOrdenCompra = true;

    let lineasPedido = [];
    let parametros:any;

   
     lineasPedido = this.pedidosLineas.filter((pedido: { DocNum: any; })=>pedido.DocNum === Pedido.DocNum);
     parametros = {OC:lineasPedido[0].DocNum, area: this.areas_user_selected}
   

    

    this.comprasService.trazabilidadDocumentoXE(this.authService.getToken(),parametros)
    .subscribe({
      next: async (trazabilidad:any)=>{
        
        this.arrayTrazabilidad = await this.functionsService.objectToArray(trazabilidad);
        let arrayTrazabilidad = await this.functionsService.objectToArray(trazabilidad);
        //console.log('arrayTrazabilidad',arrayTrazabilidad);
        ////console.log('solped - oc',await this.functionsService.groupArray(await this.functionsService.clonObject(arrayTrazabilidad),'SP_SOLPED'));
        ////console.log('oc - oc',await this.functionsService.groupArray(await this.functionsService.clonObject(arrayTrazabilidad),'PEDIDO'));
        ////console.log('entradas - oc',await this.functionsService.groupArray(await this.functionsService.clonObject(arrayTrazabilidad),'ENTRADA'));
        ////console.log('facturas - oc',await this.functionsService.groupArray(await this.functionsService.clonObject(arrayTrazabilidad),'FACTURA'));

        let solped = await this.functionsService.groupArray( await this.functionsService.groupArray(await this.functionsService.clonObject(arrayTrazabilidad.filter((traza: { SP_INDEX: any; })=>traza.SP_INDEX!=null)),'SP_INDEX'),'SOLPED',[{SP_SUBTOTAL:0, SP_TOTAL_CON_IVA:0,SP_IMPUESTO:0}]);
        ///let solped =  await this.functionsService.groupArray(await this.functionsService.clonObject(arrayTrazabilidad),'SP_INDEX',[{SP_SUBTOTAL:0, SP_TOTAL_CON_IVA:0,SP_IMPUESTO:0}]);
        //console.log('solped - oc',solped);

        let oc = await this.functionsService.groupArray(await this.functionsService.groupArray(await this.functionsService.clonObject(arrayTrazabilidad.filter((traza: { PD_INDEX: any; })=>traza.PD_INDEX!=null)),'PD_INDEX'),'PEDIDO',[{PD_SUBTOTAL:0, PD_TOTAL_CON_IVA:0,PD_IMPUESTO:0}]);
        //console.log('oc - oc',oc);
        let entradas = await this.functionsService.groupArray(await this.functionsService.groupArray(await this.functionsService.clonObject(arrayTrazabilidad.filter((traza: { EN_INDEX: any; })=>traza.EN_INDEX!=null)),'EN_INDEX'),'ENTRADA',[{EN_SUBTOTAL:0,EN_TOTAL_CON_IVA:0,EN_IMPUESTO:0}]);
        //console.log('entradas - oc',entradas)
        let facturas = await this.functionsService.groupArray(await this.functionsService.groupArray(await this.functionsService.clonObject(arrayTrazabilidad.filter((traza: { FA_INDEX: any; })=>traza.FA_INDEX!=null)),'FA_INDEX'),'FACTURA',[{FA_SUBTOTAL:0,FA_TOTAL_CON_IVA:0,FA_IMPUESTO:0}]);
        //console.log('facturas - oc',facturas)

        parametros = {};

       if(solped.length > 0){
          parametros.SP = solped.map((linea)=>{ return `'${linea.SOLPED}'`}).join(',')
        }else{
          parametros.SP = "'0'";
        }

        if(oc.length > 0){
          parametros.OC = oc.map((linea)=>{ return `'${linea.PEDIDO}'`}).join(',')
        }else{
          parametros.OC = "'0'";
        }

        if(entradas.length > 0){
          parametros.HE = entradas.map((linea)=>{ return `'${linea.ENTRADA}'`}).join(',')
        }else{
          parametros.HE = "'0'";
        }

        if(facturas.length > 0){
          parametros.FA = facturas.map((linea)=>{ return `'${linea.FACTURA}'`}).join(',')
        }else{
          parametros.FA = "'0'";
        }

        console.log('parametros',parametros);

        let infoDocumentosMR = await this.comprasService.infoDocumentosMR(this.authService.getToken(),parametros);
        console.log(infoDocumentosMR);

       
        let childrenOC:any[] = [];

        for(let entrada of entradas){
          if(entrada.ENTRADA!=null){
            let childrenEntrada:any[] = [];
          ////console.log(arrayTrazabilidad.filter((fila: { ENTRADA: any; })=>fila.ENTRADA === entrada.ENTRADA));
          let facturasEntrada = await this.functionsService.groupArray(await this.functionsService.clonObject(arrayTrazabilidad.filter((fila: { ENTRADA: any; })=>fila.ENTRADA === entrada.ENTRADA)),'FACTURA',[{FA_SUBTOTAL:0,FA_TOTAL_CON_IVA:0,FA_IMPUESTO:0}]);
          //console.log('Entrada',entrada.ENTRADA,'Factras',facturasEntrada.length);

          //console.log('Entrada',entrada.ENTRADA,'Factras',facturasEntrada);
          for(let facturaEntrada of facturasEntrada){
            if(facturaEntrada.FACTURA!=null){
              childrenEntrada.push({
              
                label: 'Factura',
                expanded: true,
                data: {
                  num:facturaEntrada.FACTURA,
                  estado:facturaEntrada.FA_ESTADO_ANULADO=='Y'?'ban':facturaEntrada.FA_ESTADO=='C'?'lock':'lock-open',
                  estadoColor:facturaEntrada.FA_ESTADO_ANULADO=='Y'?'red':facturaEntrada.FA_ESTADO=='C'?'var(--yellow-600);':'green',
                  fecha:facturaEntrada.FA_FECHACONTABLE,
                  fechav:facturaEntrada.FA_FECHAVENCE,
                  subtotal:facturaEntrada.FA_SUBTOTAL,
                  currency:facturaEntrada.FA_MONEDA,
                  iva:facturaEntrada.FA_IMPUESTO,
                  total:facturaEntrada.FA_TOTAL_CON_IVA,
                  retenciones:2312,
                  ref:facturaEntrada.FA_NUM_REFERENCIA_FACTURA

                }
            
            });  
            }
            
          }

          //console.log('childrenEntrada',childrenEntrada);

          let entradaOC:any = {
            label: 'Entrada',
            expanded: true,
            data: {
              num:entrada.ENTRADA,
              estado:entrada.EN_ESTADO_ANULADO=='Y'?'ban':entrada.EN_ESTADO=='C'?'lock':'lock-open',
              estadoColor:entrada.EN_ESTADO_ANULADO=='Y'?'red':entrada.EN_ESTADO=='C'?'var(--yellow-600);':'green',
              fecha:entrada.EN_FECHACONTABLE,
              fechav:entrada.EN_FECHAVENCE,
              subtotal:entrada.EN_SUBTOTAL,
              currency:entrada.EN_MONEDA,
              iva:entrada.EN_IMPUESTO,
              total: entrada.EN_TOTAL_CON_IVA,
              retenciones:0,
              ref:''
            },
            //children:childrenEntrada
            
          };

          if(childrenEntrada.length > 0){
            entradaOC.children = childrenEntrada
          }

          //console.log('entradaOC',entradaOC);

          childrenOC.push(entradaOC);  
          }
          

        }

        //console.log('childrenOC',childrenOC);

        let chlidrenSP:any = [
          {
            label: 'Pedido',
            expanded: true,
            data: {
              num:oc[0].PEDIDO,
              estado:oc[0].PD_ESTADO_ANULADO=='Y'?'ban':oc[0].PD_ESTADO=='C'?'lock':'lock-open',
              estadoColor:oc[0].PD_ESTADO_ANULADO=='Y'?'red':oc[0].PD_ESTADO=='C'?'var(--yellow-600);':'green',
              fecha:oc[0].PD_FECHACONTABLE,
              fechav:oc[0].PD_FECHAVENCE,
              subtotal:oc[0].PD_SUBTOTAL,
              currency:oc[0].PD_MONEDA,
              iva:oc[0].PD_IMPUESTO,
              total: oc[0].PD_TOTAL_CON_IVA,
              retenciones:0,
              ref:''

            },
            //children:childrenOC  
          }
        ];

        if(childrenOC.length > 0){
          chlidrenSP[0].children = childrenOC
        }

        //console.log(chlidrenSP);

        if(solped.length>0){
          this.mapaRelaciones = [{
            label: 'Solped',
            expanded: true,
            data: {
              num:solped[0].SOLPED,
              estado:solped[0].SP_ESTADO_ANULADO=='Y'?'ban':solped[0].SP_ESTADO=='C'?'lock':'lock-open',
              estadoColor:solped[0].SP_ESTADO_ANULADO=='Y'?'red':solped[0].SP_ESTADO=='C'?'var(--yellow-600);':'green',
              fecha:solped[0].SP_FECHACONTABLE,
              fechav:solped[0].SP_FECHAVENCE,
              subtotal:solped[0].SP_SUBTOTAL,
              currency:solped[0].SP_MONEDA,
              iva:solped[0].SP_IMPUESTO,
              total: solped[0].SP_TOTAL_CON_IVA,
              retenciones:0,
              ref:''
            },
            children:chlidrenSP
          }]
        }else{
          this.mapaRelaciones = chlidrenSP
        }
          
        
        console.log(this.mapaRelaciones);
        this.loadingMapa = false;
        //this.asignarValores(pedido, entradasPedido);
      },
      error: (err)=>{
          console.error(err);
      }
  });

  
  }

 

  verDocumento(nodo:any){
    //console.log('nodoSeleccionado',nodo);

    this.confirmationService.confirm({
      message: `¿Desea visualizar el documento seleccionado ${nodo.label} - ${nodo.data.num} ?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
       
       this.nodoSeleccionado = nodo;
       this.tituloDocumento = `${nodo.label} ${nodo.data.num}`;
       this.visualizarDocumento = true;

       let groupField:string = "";
       let filterField:any;
       let sortField:string = "";
       let prefijoDocumento:string = "";

       switch(nodo.label){
          case 'Solped':
            groupField = 'SP_INDEX';
            filterField = 'SOLPED';
            sortField = 'SP_LINEA';
            prefijoDocumento = 'SP'

          break;

          case 'Pedido':
            groupField = 'PD_INDEX';
            filterField = 'PEDIDO';
            sortField = 'PD_LINEA';
            prefijoDocumento = 'PD'
          break;

          case 'Entrada':
            groupField = 'EN_INDEX';
            filterField = 'ENTRADA';
            sortField = 'EN_LINEA';
            prefijoDocumento = 'EN'
          break;

          case 'Factura':
            groupField = 'FA_INDEX';
            filterField = 'FACTURA';
            sortField = 'FA_LINEA';
            prefijoDocumento = 'FA'
          break;


       }

       console.log('groupField',groupField,);
       console.log('filterField',filterField,);
       console.log('sortField',sortField,);
       console.log('prefijoDocumento',prefijoDocumento,);

       let arrayTrazabilidad = await this.functionsService.sortArrayObject(await this.functionsService.clonObject(this.arrayTrazabilidad),prefijoDocumento+'_INDEX','ASC');

       let infoDocument = await this.functionsService.groupArray((await this.functionsService.clonObject(arrayTrazabilidad)),filterField);
       console.log('lineasDocumento',infoDocument);

       let lineasDocumento = (await this.functionsService.clonObject(arrayTrazabilidad)).filter(function(linea: { [x: string]: any; }){
        
        return linea[filterField] == nodo.data.num;
       });

       console.log('lineasDocumento',lineasDocumento);

       let lineasDocumentoAgruadas = await this.functionsService.groupArray(await this.functionsService.clonObject(lineasDocumento),groupField)

       console.log('lineasDocumentoAgruadas', await this.functionsService.sortArrayObject(lineasDocumentoAgruadas,prefijoDocumento+'_INDEX','ASC'));

       this.infoDocumento = {
        
        DocNum: lineasDocumentoAgruadas[0][filterField],
        DocStatus: lineasDocumentoAgruadas[0][prefijoDocumento+'_ESTADO'],
        Cancel: lineasDocumentoAgruadas[0][prefijoDocumento+'_ESTADO_ANULADO'],
        CardCode: lineasDocumentoAgruadas[0][prefijoDocumento+'_CODIGOSN'],
        CardName: lineasDocumentoAgruadas[0][prefijoDocumento+'_NOMBRESN'],
        Comments: lineasDocumentoAgruadas[0][prefijoDocumento+'_COMENTARIOS'],
        Currency: lineasDocumentoAgruadas[0][prefijoDocumento+'_MONEDA'],
        DocDate: new Date(lineasDocumentoAgruadas[0][prefijoDocumento+'_FECHACONTABLE']),
        DocDueDate: new Date(lineasDocumentoAgruadas[0][prefijoDocumento+'_FECHAVENCE']),
        TaxDate:new Date(lineasDocumentoAgruadas[0][prefijoDocumento+'_FECHADOCUMENTO']),

        SeriesName: lineasDocumentoAgruadas[0][prefijoDocumento+'_NOMBRE_SERIE'],
        Series: lineasDocumentoAgruadas[0][prefijoDocumento+'_SERIE'],
        DocumentLines: await this.functionsService.sortArrayObject( lineasDocumentoAgruadas.map((linea)=>{
                           
                            return {
                              LineNum: linea[prefijoDocumento+'_NUMLINEA'],
                              LineStatus: linea[prefijoDocumento+'_ESTADOLINEA'],
                              ItemCode: linea[prefijoDocumento+'_ITEM'],
                              Dscription: linea[prefijoDocumento+'_DESCRIPCION'],
                              Quantity: linea[prefijoDocumento+'_CANTIDAD'],
                              Price: linea[prefijoDocumento+'_PRECIO_ANTES_IVA'],
                              VatPrcnt:linea[prefijoDocumento+'_PORCENTAJE_IMPUESTO'],
                              LineTotal: linea[prefijoDocumento+'_SUBTOTAL'],
                              OcrCode: linea[prefijoDocumento+'_LOCALIDAD'],
                              OcrCode2:linea[prefijoDocumento+'_DEPDENDENCIA'],
                              OcrCode3:linea[prefijoDocumento+'_VICEPRESIDENCIA'],

                              //WhsCode:linea[prefijoDocumento+'_'],
                              //OpenCreQty: linea[prefijoDocumento+'_'],
                              OpenQty: linea[prefijoDocumento+'_CANTIDAD_PENDIENTE'],
                              //OpenSum: linea[prefijoDocumento+'_'],
                              //OpenSumSys: linea[prefijoDocumento+'_'],
                              //PriceAfVAT: linea[prefijoDocumento+'_'],
                              //PriceBefDi:linea[prefijoDocumento+'_'],
                              //U_ID_PORTAL:linea[prefijoDocumento+'_'],
                              //U_NF_DEPEN_SOLPED:linea[prefijoDocumento+'_'],
                              //U_NF_NOM_AUT_PORTAL: linea[prefijoDocumento+'_']
                              iconLine:linea[prefijoDocumento+'_ESTADOLINEA']=='C'?'lock':'lock-open',
                              colorIconLine:linea[prefijoDocumento+'_ESTADOLINEA']=='C'?'orange':'green',

                            }
                        }),'LineNum','ASC')
  
      }

      console.log('infoDocumento',this.infoDocumento);
       
      },
        reject: (type: any) => {
            switch(type) {
                case ConfirmEventType.REJECT:
                    //this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
                break;
                case ConfirmEventType.CANCEL:
                    //this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
                break;
            }
        }
      });
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
