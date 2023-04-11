import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PermisosUsuario, PerfilesUsuario } from 'src/app/demo/api/decodeToken';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';

@Component({
  selector: 'app-tracking-mp',
  providers: [MessageService, ConfirmationService],
  templateUrl: './tracking-mp.component.html',
  styleUrls: ['./tracking-mp.component.scss']
})
export class TrackingMPComponent implements OnInit {

  infoUsuario!:InfoUsuario;
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];

  urlBreadCrumb:string ="";

  allSolpedMP:any[] = [];
  allSolpedMP2:any[] = [];

  proyecciones:any[] = [];
  proyeccionesBK:any[] = [];
  loadingProyecciones:boolean = false;
  selectedProyecciones:any[] = [];

  solpedRequest:any[] = [];
  solpedRequestBK:any[] = [];
  loadingSR:boolean = true;
  selectedSolpedR:any[] = [];

  pedidosPorCargar:any[] = [];
  pedidosPorCargarBK:any[] = [];
  loadingPxC:boolean = true;
  selectedPedidosPxC:any[] = [];

  pedidosCargados:any[] = [];
  pedidosCargadosBK:any[] = [];
  loadingC:boolean = true;
  selectedPedidosC:any[] = [];

  pedidosDocumentacion:any[] = [];
  pedidosDocumentacionBK:any[] = [];
  loadingD:boolean = true;
  selectedPedidosD:any[] = [];

  pedidosDescargados:any[] = [];
  pedidosDescargadosBK:any[] = [];
  loadingPD:boolean = true;
  selectedPedidosPD:any[] = [];

  entradasNT:any[] = [];
  entradasNTBK:any[] = [];
  loadingNT:boolean = true;
  selectedEntradas:any[] = [];

  almacenes:any[] = [];


  statuses:any[] = [{label:'Abierta', value:'O'},{label:'Cerrada', value:'C'}];
  approves:any[] = [{label:'No aprobada',value:'No'},{label:'Aprobada',value:'A'},{label:'Pendiente',value:'P'},{label:'Rechazada',value:'R'}];

  tiposMateriaPrima:any[] =[{label:'Importada',value:'SI'},{label:'Nacional',value:'NO'},{label:'Todas',value:''}];
  tipoMateriaPrima:string="Todas";


  @ViewChild('filter') filter!: ElementRef;

  constructor(private rutaActiva: ActivatedRoute,
    private adminService:AdminService,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private authService: AuthService,
    private sapService: SAPService) { }

  ngOnInit(): void {

    this.infoUsuario = this.authService.getInfoUsuario();
    ////console.log(this.infoUsuario);
     
     ////console.log(this.authService.getPerfilesUsuario());
     this.perfilesUsuario = this.authService.getPerfilesUsuario();

     ////console.log(this.router.url);
     ////console.log(this.authService.getPermisosUsuario());
     this.permisosUsuario = this.authService.getPermisosUsuario();
     ////console.log('Permisos pagina',this.permisosUsuario.filter(item => item.url===this.router.url));
     this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.router.url);
     this.urlBreadCrumb = this.router.url;

     this.getAlmacenesMPSL();
  }

 
  getAlmacenesMPSL(){
    //this.sapService.getAlmacenesMPSL(this.authService.getToken())
    this.sapService.getAlmacenesMysql(this.authService.getToken())
        .subscribe({
            next: (almacenes) => {
              //console.log(almacenes);
              for(let item in almacenes){
                this.almacenes.push({store:almacenes[item].WarehouseCode, 
                                     storename: almacenes[item].WarehouseName, 
                                     zonacode:almacenes[item].State});
             }
             ////console.log(this.almacenes)
             this.getListadosTrackingMP();
            },
            error: (err) => {
                //console.log(err);
            }

        });
  }

  getListadosTrackingMP(){
    this.getSolpedRequest();

    this.getDocumentsTrackingSAP();

    //this.getPedidosPorCargar();
    //this.getPedidosCargados();
    //this.getPedidosConDocumentacion();
    //this.getPedidosDescargados();
    //this.getEntradasNacionalizadas();
  }


  getSolpedRequest(){
    this.comprasService.SolpedMP(this.authService.getToken(),'Request')
    .subscribe({
      next:(proyeccionesSolicitudes =>{
        //console.log('Solped',proyeccionesSolicitudes);
        let proyecciones:any[] = [];
        for(let line of proyeccionesSolicitudes.proyecciones){
          /*line.WarehouseName ="";
          if(this.almacenes.filter(data =>data.store === line.WarehouseCode).length>0){
            ////console.log(this.almacenes.filter(data =>data.store === line.WarehouseCode)[0].storename);
            line.WarehouseName = this.almacenes.filter(data =>data.store === line.WarehouseCode)[0].storename;
          }*/

          line.U_NF_PEDMP = line.U_NF_PEDMP=='S'?'SI':'NO';
          
          proyecciones.push(line);
        }
        this.proyecciones = proyecciones;  
        this.proyeccionesBK = proyecciones;  

        /*let solicitudes:any[] = [];
        for(let line of proyeccionesSolicitudes.solicitudesSAP){
          line.WarehouseName ="";
          if(this.almacenes.filter(data =>data.store === line.WarehouseCode).length>0){
            line.WarehouseName = this.almacenes.filter(data =>data.store === line.WarehouseCode)[0].storename;
          }
          line.U_NF_PEDMP = line.U_NF_PEDMP=='S'?'SI':'NO';
          solicitudes.push(line);
        }
        
        this.solpedRequest = solicitudes;
        this.solpedRequestBK = solicitudes;*/
      }),
      error:(err =>{
        //console.log(err);
      })
    });

  }

  getDocumentsTrackingSAP(){
    this.comprasService.getDocumentsTrackingSAP(this.authService.getToken())
    .subscribe({
      next:(async documentosTracking =>{
       //console.log('Documentos',documentosTracking);

       for(let documentoTracking of documentosTracking){
          documentoTracking.Comments ='';
          documentoTracking.Incoterms =documentoTracking.U_NT_Incoterms;
          documentoTracking.ItemDescription ='';
          documentoTracking.Description = `${documentoTracking.ItemCode} - ${documentoTracking.ItemDescription}`;
          documentoTracking.LineNum = 0;
          documentoTracking.RequriedDate = documentoTracking.FECHANECESIDAD;
          documentoTracking.U_NF_PAGO = '';
          documentoTracking.U_NF_TIPOCARGA = '';
          documentoTracking.U_NF_PEDMP = documentoTracking.U_NF_PEDMP=='S'?'SI':'NO';
          documentoTracking.WarehouseCode = documentoTracking.WhsCode;
          documentoTracking.WarehouseName = this.almacenes.filter(almacen => almacen.store == documentoTracking.WhsCode)[0].storename;
          documentoTracking.approved = 'S';
          documentoTracking.id =''; //DocEntry
          documentoTracking.key = documentoTracking.DocNum+'-'+documentoTracking.LineNum;
          documentoTracking.DocEntry = 0; //DocEntry
          documentoTracking.RemainingOpenQuantity = documentoTracking.OpenCreQty;
          documentoTracking.MeasureUnit = ''; //MeasureUnit
          documentoTracking.CardName =''; // CardName
          documentoTracking.ProveedorDS = `${documentoTracking.CardCode} - ${documentoTracking.CardName}`;
       }

       this.solpedRequest =  await documentosTracking.filter((documento: {
                                                                              U_NF_STATUS: string; 
                                                                              TIPO: string; 
                                                                          }) => documento.TIPO =='Necesidad' && 
                                                                                documento.U_NF_STATUS=='Solicitado');;
       this.solpedRequestBK = this.solpedRequest;

       this.pedidosPorCargar = await documentosTracking.filter((documento: {
                                                                              U_NF_STATUS: string; 
                                                                              TIPO: string; 
                                                                           }) => documento.TIPO =='Compra' && 
                                                                                 documento.U_NF_STATUS=='Solicitado');
        this.pedidosPorCargarBK = this.pedidosPorCargar;
        
        
        this.pedidosCargados = await documentosTracking.filter((documento: {
                                                                                U_NF_STATUS: string; 
                                                                                TIPO: string; 
                                                                            }) => documento.TIPO =='Compra' && 
                                                                                  documento.U_NF_STATUS=='Cargado');
        this.pedidosCargadosBK = this.pedidosCargados;


        this.pedidosDescargados =  await documentosTracking.filter((documento: {
                                                                                    U_NF_STATUS: string; 
                                                                                    TIPO: string; 
                                                                                }) => documento.TIPO =='Compra' && 
                                                                                      documento.U_NF_STATUS=='Pedidos en puerto');
        this.pedidosDescargadosBK = this.pedidosDescargados;


        this.entradasNT = await documentosTracking.filter((documento: {
                                                                          U_NF_STATUS: string; 
                                                                          TIPO: string; 
                                                                      }) => documento.TIPO =='Entrada');
        this.entradasNTBK = this.entradasNT;
                  

        /*if(pedidos.value){
          this.pedidosPorCargar = await this.convertirObjetoSLtoArray(pedidos);
          this.pedidosPorCargarBK = this.pedidosPorCargar;
          ////console.log(this.pedidosPorCargar);
          
        }*/
        
      }),
      error:(err =>{
        //console.log(err);
      })
    });
  }

  getPedidosPorCargar(){
 
    this.comprasService.PedidosdMP(this.authService.getToken(),'Solicitado')
    .subscribe({
      next:(async pedidos =>{
        ////console.log('Pedido x cargar',pedidos);

        if(pedidos.value){
          this.pedidosPorCargar = await this.convertirObjetoSLtoArray(pedidos);
          this.pedidosPorCargarBK = this.pedidosPorCargar;
          ////console.log(this.pedidosPorCargar);
          
        }
        
      }),
      error:(err =>{
        //console.log(err);
      })
    });

  }
  
  getPedidosCargados(){

    this.comprasService.PedidosdMP(this.authService.getToken(),'Cargado')
    .subscribe({
      next:(async pedidos =>{
       // //console.log('Pedido cargados',pedidos);
        if(pedidos.value){
          this.pedidosCargados = await this.convertirObjetoSLtoArray(pedidos);
          this.pedidosCargadosBK = this.pedidosCargados;
          ////console.log(this.pedidosCargados);
          
        }
      }),
      error:(err =>{
        //console.log(err);
      })
    });
  }

  getPedidosConDocumentacion(){
    /*
    this.comprasService.PedidosdMP(this.authService.getToken(),'Documentación lista')
    .subscribe({
      next:(async pedidos =>{
        
        if(pedidos.value){
          this.pedidosDocumentacion = await this.convertirObjetoSLtoArray(pedidos);
          //console.log(this.pedidosDocumentacion);
          
        }
      }),
      error:(err =>{
        //console.log(err);
      })
    });
    */
  }

  getPedidosDescargados(){

    this.comprasService.PedidosdMP(this.authService.getToken(),'Pedidos en puerto')
    .subscribe({
      next:(async pedidos =>{
        
        if(pedidos.value){
          this.pedidosDescargados = await this.convertirObjetoSLtoArray(pedidos);
          this.pedidosDescargadosBK = this.pedidosDescargados;
          ////console.log(this.pedidosDescargados);
          
        }
      }),
      error:(err =>{
        //console.log(err);
      })
    });
  }

  getEntradasNacionalizadas(){

    this.comprasService.EntradasMP(this.authService.getToken())
    .subscribe({
      next:(async entradas =>{
        let lineaEntradas:any[] = [];
        /*if(entradas.value){
          this.entradasNT = await this.convertirObjetoSLtoArray(entradas);
          //console.log(this.entradasNT);
          
        }*/

        for(let item in entradas){

          let WarehouseName ="";
          if(this.almacenes.filter(data =>data.store === entradas[item].WhsCode).length>0){
            ////console.log('storename',this.almacenes.filter(data =>data.store === entradas[item].WhsCode)[0]);
            WarehouseName = this.almacenes.filter(data =>data.store === entradas[item].WhsCode)[0].storename;
          }
          
          lineaEntradas.push({
                  Comments:entradas[item].Comments,
                  DocNum:entradas[item].DocNum,
                  pedido:entradas[item].pedido,
                  Incoterms:entradas[item].Incoterms,
                  ItemCode:entradas[item].ItemCode,
                  ItemDescription:entradas[item].Dscription,
                  Description:`${entradas[item].ItemCode} - ${entradas[item].Dscription}`,
                  LineNum:entradas[item].LineNum,
                  Quantity:entradas[item].Quantity,
                  RequriedDate:entradas[item].DocDueDate,
                  U_NF_AGENTE:entradas[item].U_NF_AGENTE,
                  U_NF_DATEOFSHIPPING:entradas[item].U_NF_DATEOFSHIPPING,
                  U_NF_LASTSHIPPPING:entradas[item].U_NF_LASTSHIPPPING,
                  U_NF_MOTONAVE:entradas[item].U_NF_MOTONAVE,
                  U_NF_PAGO:entradas[item].U_NF_PAGO,
                  U_NF_PUERTOSALIDA:entradas[item].U_NF_PUERTOSALIDA,
                  U_NF_STATUS:entradas[item].U_NF_STATUS,
                  U_NF_TIPOCARGA:entradas[item].U_NF_TIPOCARGA,
                  U_NF_PEDMP: entradas[item].U_NF_PEDMP=='S'?'SI':'NO',
                  WarehouseCode: entradas[item].WhsCode,
                  WarehouseName,
                  approved:'S',
                  id:entradas[item].DocEntry,
                  key:entradas[item].DocNum+'-'+entradas[item].LineNum,
                  DocEntry:entradas[item].DocEntry,
                  RemainingOpenQuantity:0,
                  U_NT_Incoterms:entradas[item].U_NT_Incoterms,
                  MeasureUnit:entradas[item].unitMsr,
                  CardCode:entradas[item].CardCode,
                  CardName:entradas[item].CardName,
                  ProveedorDS:`${entradas[item].CardCode} - ${entradas[item].CardName}`
          });
        }

        //console.log(lineaEntradas);
        this.entradasNT = lineaEntradas;
        this.entradasNTBK = lineaEntradas;
      }),
      error:(err =>{
        //console.log(err);
      })
    });
  }

  filtrarTablas(){
    //Restablecer valores originales de tablas
    this.proyecciones = this.proyeccionesBK;
    this.solpedRequest = this.solpedRequestBK;
    this.pedidosPorCargar = this.pedidosPorCargarBK;
    this.pedidosCargados = this.pedidosCargadosBK;
    this.pedidosDescargados = this.pedidosDescargadosBK;
    this.entradasNT = this.entradasNTBK;
    //validar cambios en filtros
    if(this.tipoMateriaPrima!="Todas"){
      let valorFiltro = this.tiposMateriaPrima.filter(data=>data.label == this.tipoMateriaPrima)[0].value;
      this.proyecciones = this.proyecciones.filter(data=>data.U_NF_PEDMP==valorFiltro);
      this.solpedRequest = this.solpedRequest.filter(data=>data.U_NF_PEDMP==valorFiltro);
      this.pedidosPorCargar = this.pedidosPorCargar.filter(data=>data.U_NF_PEDMP==valorFiltro);
      this.pedidosCargados = this.pedidosCargados.filter(data=>data.U_NF_PEDMP==valorFiltro);
      this.pedidosDescargados = this.pedidosDescargados.filter(data=>data.U_NF_PEDMP==valorFiltro);
      this.entradasNT = this.entradasNT.filter(data=>data.U_NF_PEDMP==valorFiltro);
    }

  }

  reestablecerFiltro(){
    this.tipoMateriaPrima = "Todas";
    this.filtrarTablas();
  }

  newSolped(){}

   convertirObjetoSLtoArray(pedidosSL:any){
    let lineaPedidos:any[] = [];
          for(let pedido of pedidosSL.value){
              for(let lienaPedido of pedido.DocumentLines){

                let WarehouseName ="";
                if(this.almacenes.filter(data =>data.store === lienaPedido.WarehouseCode).length>0){
                  ////console.log('storename',this.almacenes.filter(data =>data.store === lienaPedido.WarehouseCode)[0]);
                  WarehouseName = this.almacenes.filter(data =>data.store === lienaPedido.WarehouseCode)[0].storename;
                }
                
                
                lineaPedidos.push({
                  Comments:pedido.Comments,
                  DocNum:pedido.DocNum,
                  Incoterms:lienaPedido.Incoterms,
                  ItemCode:lienaPedido.ItemCode,
                  ItemDescription:lienaPedido.ItemDescription,
                  Description:`${lienaPedido.ItemCode} - ${lienaPedido.ItemDescription}`,
                  LineNum:lienaPedido.LineNum,
                  Quantity:lienaPedido.Quantity,
                  RequriedDate:pedido.DocDueDate,
                  U_NF_AGENTE:pedido.U_NF_AGENTE,
                  U_NF_DATEOFSHIPPING:pedido.U_NF_DATEOFSHIPPING,
                  U_NF_LASTSHIPPPING:pedido.U_NF_LASTSHIPPPING,
                  U_NF_MOTONAVE:pedido.U_NF_MOTONAVE,
                  U_NF_PAGO:pedido.U_NF_PAGO,
                  U_NF_PUERTOSALIDA:pedido.U_NF_PUERTOSALIDA,
                  U_NF_STATUS:pedido.U_NF_STATUS,
                  U_NF_TIPOCARGA:pedido.U_NF_TIPOCARGA,
                  U_NF_PEDMP: pedido.U_NF_PEDMP=='S'?'SI':'NO',
                  WarehouseCode: lienaPedido.WarehouseCode,
                  WarehouseName,
                  approved:'S',
                  id:pedido.DocEntry,
                  key:pedido.DocNum+'-'+lienaPedido.LineNum,
                  DocEntry:pedido.DocEntry,
                  RemainingOpenQuantity:lienaPedido.RemainingOpenQuantity,
                  U_NT_Incoterms:pedido.U_NT_Incoterms,
                  MeasureUnit:lienaPedido.MeasureUnit,
                  CardCode:pedido.CardCode,
                  CardName:pedido.CardName,
                  ProveedorDS:`${pedido.CardCode} - ${pedido.CardName}`

                });
              }
              
          }

          ////console.log(lineaPedidos);
    return lineaPedidos;
  }
  
  
  updateTable(lista:any){
    /*switch(lista){

      case 'solpedRequest':
        this.getSolpedRequest();
      break;

      case 'pedidosPorCargar':
        this.getPedidosPorCargar();
        
      break;

      case 'pedidosCargados':
        this.getPedidosCargados();
      break;

      case 'pedidosDocumentacion':
        this.getPedidosConDocumentacion();
      break;

      case 'pedidosDescargados':
        this.getPedidosDescargados();
      break;

      case 'entradasNT':
          this.getEntradasNacionalizadas();
      break;

      
    }*/

      this.getSolpedRequest();
      this.getPedidosPorCargar();
      this.getPedidosCargados();
      this.getPedidosConDocumentacion();
      this.getPedidosDescargados();
      this.getEntradasNacionalizadas();

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
