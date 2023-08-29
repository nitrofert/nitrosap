import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BusinessPartners } from 'src/app/demo/api/businessPartners';
import { DependenciasUsuario, InfoUsuario, PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { ItemsSAP } from 'src/app/demo/api/itemsSAP';
import { SolpedDet } from 'src/app/demo/api/solped';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';

@Component({
  selector: 'app-mrp',
  providers: [MessageService, ConfirmationService],
  templateUrl: './mrp.component.html',
  styleUrls: ['./mrp.component.scss'],
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
        .c-min-stock {
          color:red;
          font-weight: bold;
        }
        .c-max-stock {
          color:green;
          font-weight: bold;
        }
    `]
})
export class MrpComponent implements OnInit {

  @ViewChild('filter') filter!: ElementRef;

  urlBreadCrumb:string ="";

  infoUsuario!:InfoUsuario;
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];

  items:ItemsSAP[] = [];
  itemsMP:ItemsSAP[] = [];
  item!:ItemsSAP;
  itemsFiltrados:ItemsSAP[] = [];
  descripcion:string = "";
  itemSeleccionado:string = "";
  fechaProyeccion:Date = new Date();
  fechaProyeccionstr:string =  new Date().toLocaleDateString();
  series:any[] = [];
  serie:string = "";
  serieName:string ="";
  zonas:any[] =[];
  zona!:any;
  zonaSeleccionada:string = "";
  inventariosMP:any;

  maxMpZona:any = 0;
  minMpZona:any = 0;

  presupuestoMPVenta:any[] = [];
  inventarioTramsitoMP:any[] = [];
  inventarioSolicitadoMP:any[] = [];
  inventarioProyectadoMP:any[] = [];
  totalInicialMPZF:any =0;
  inventarioItemZF:any[] = [];
  inventarioTramsitoMPPreFecha:any = [];
  inventarioSolicitadoMPPreFecha:any[] = [];
  
  
  
  busqueda:boolean = false;
  envioForm:boolean = false;
  tolerancia:number=0;

  errorFP:boolean = false;
  calculadora:boolean = false;
  verdocumentos:boolean = false;
  formularioLinea:boolean = false;
  listDocumentos:any[] = [];

  envioLinea:boolean = false;
  fechaRequerida:Date = new Date();
  proveedores:BusinessPartners[] = [];
  proveedor!:BusinessPartners;
  proveedoresFiltrados:BusinessPartners[] = [];
  dependenciasUsuario:DependenciasUsuario[] = [];
  viceprecidencia:string = "VPCADSUM";
  dependencia:string = "VPCADSU2";
  localidades:DependenciasUsuario[] = [];
  localidad!:DependenciasUsuario;
  almacenes:any[] = [];
  almacen:any = "";
  cantidad:number = 1;
  monedas:any[] =[];
  moneda:string ="";
  trm:number =0;
  precio:number =0;
  subtotalLinea:number = 0;
  impuesto:any = "";
  prcImpuesto:number =0;
  valorImpuesto:number =0;
  totalLinea:number =0;
  tiposdecarga:any[] = [{tipo:'Empacado'},{tipo:'Granel'}]
  currency:string = "COP";
  impuestos:any[] =[];
  lineasSolped:SolpedDet[] = []; // Array para guardar temporalmente las lineas de la solped que se van a guardar o editar
  lineaSolped!:SolpedDet; //Linea para registrar o actualizar
  unidad:any = "";
  nf_tipocarga:string = "";
  materiaprima:any[] = [{option:'Si',value:'S'},{option:'No',value:'N'}];
  fechasycantidades:any[] =[];
  nf_pedmp:string = "";
  loadingSave:boolean = false;

  tituloDocumentos:string = "";

  lineasCalculadora:any[] = [];
  loading: boolean = true;
  loadingSimular:boolean = false;
  lineaSeleccionada!:any[];

  fechaactual:Date = new Date();
  fechaactualstr:string = new Date().toLocaleDateString();

  lienas:number =0;
  tituloUbicaciones: string="";
  listUbicaciones: any[] = [];
  verUbicaciones: boolean = false;
  ubicacionesInventarioMP:any;
  ubicacionesInventarioPT:any;

  debouncer:Subject<number> = new Subject(); 

  ultimaTolerancia:number = 0;

  mesesAnio:any[] = [{mes:1, mesStr:'Enero'},
                     {mes:2, mesStr:'Febrero'},
                     {mes:3, mesStr:'Marzo'},
                     {mes:4, mesStr:'Abril'},
                     {mes:5, mesStr:'Mayo'},
                     {mes:6, mesStr:'Junio'},
                     {mes:7, mesStr:'Julio'},
                     {mes:8, mesStr:'Agosto'},
                     {mes:9, mesStr:'Septiembre'},
                     {mes:10, mesStr:'Octubre'},
                     {mes:11, mesStr:'Noviembre'},
                     {mes:12, mesStr:'Diciembre'}];

  editarproyeccion:boolean = false;
  cantidadEditar:number = 0;

  fechaEditar!:Date;

  simulacionSinProyeciones:any=[];
  simulacionConProyeciones:any=[];
  simulacionSinTransitoMP:any=[];
  simulacionesSinSolped:any= [];

  loadingGrabarSimulacion:boolean = false;

  costoUnitarioMP:number = 0;
  costoUnitarioPT:number = 0;
  
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

    this.getConfigSolpedMP();

    //this.getItems();
    //this.getZonas();
    
    //this.getSeries();

    //this.getDependenciasUsuario();

    //this.getProveedores();
    
    //Cargar monedas
    //this.getMonedas(new Date());
    //this.getMonedasMysql();
    //Cargar impuestos
    //this.getImpuestos();

    this.debouncer
    .pipe(debounceTime(300))
    .subscribe( value =>{
      //////////console.log('debouncer: ',value);
      let event = {value}
      this.cambioTolerancia(event);
    });

    //this.fechaInicioSemana(new Date('12/20/2022'));
  }

  getInfoUsuario(){
    this.infoUsuario = this.authService.getInfoUsuario();
    //////////console.log('getInfoUsuario: ',this.infoUsuario);
  }

  getPerfilesUsuario(){
    this.perfilesUsuario = this.authService.getPerfilesUsuario();
  }

  getPermisosUsuario(){
    this.permisosUsuario = this.authService.getPermisosUsuario();
  }

  getPermisosUsuarioPagina(){
    let url ="";
    ////////////console.log("URL origen",this.router.url);
    ////////////console.log("URL params",this.rutaActiva.snapshot.params['solped']);
    if(this.rutaActiva.snapshot.params['entrada']){
      let entradaSeleccionada = this.rutaActiva.snapshot.params;
      if(this.router.url.indexOf("/"+entradaSeleccionada['entrada'])>=0){
        url = this.router.url.substring(0,this.router.url.indexOf("/"+entradaSeleccionada['entrada']));
      }
      ////////////console.log("URL con parametros: ",url);
    }else{
      url= this.router.url;
      ////////////console.log("URL sin parametros: ",url);
    }
    this.urlBreadCrumb = url;
    this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===url);
    ////////console.log(this.permisosUsuarioPagina);
  }

  getConfigSolpedMP(){
    this.comprasService.getConfigSolpedMP(this.authService.getToken())
    //this.authService.getDependeciasUsuarioXE()
    .subscribe({
      next: async (configSolped:any) => {
        ////////console.log(configSolped);

        await this.getDependenciasUsuario(configSolped.dependenciasUsuario);
        await this.getSeries(configSolped.series);
        //await this.getAreas(configSolped.areas);
        await this.getProveedores(configSolped.proveedores);
        await this.getItems(configSolped.items);
        //await this.getCuentas(configSolped.cuentas);
        await this.getAlmacenesMPSL(configSolped.almacenes);
        await this.getMonedasMysql(configSolped.monedas);
        await this.getImpuestos(configSolped.impuestos);
        await this.getZonas(configSolped.zonas);
        //this.getInformacionSolped();

      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  async getItems(items:any){
    //this.sapService.itemsSAPXE(this.authService.getToken())
    //this.sapService.itemsSAPMysql(this.authService.getToken())
    //this.sapService.itemsSAPMysqlCalc(this.authService.getToken())
    
    //    .subscribe({
    //      next: (items) => {
            for(let item in items){
              this.items.push(items[item]);

              //Obtener items de materia prima
              //if((items[item].ItemCode.toLowerCase().indexOf('mp')==0)){
                ////////////console.log(items[item].ItemCode.toLowerCase());
                //Llenar el array de items de MP
                //this.itemsMP.push(items[item]);
              //}
              this.itemsMP.push(items[item]);
           }
           //this.getItemsMP();
          
           ////////////console.log(this.itemsMP);
           //////////console.log(this.itemsMP);
           //this.getZonas();
    //      },
    //      error: (error) => {
              ////////////console.log(error);      
    //      }
    //    });
  }

  getItemsMP(){
    this.comprasService.getPresupuestosVentaAll(this.authService.getToken())
        .subscribe({
          next: (items) => {
            let ItemName:string;
            let ApTaxCode:string;
            for(let item of items){
              //////////////console.log(item);
              //Obtener items de materia prima de presupuesto de venta
              //Llenar el array de items de MP
              //////////////console.log(this.itemsMP.filter(itemMP => itemMP.itemcode == item.itemcode).length);
              if(this.itemsMP.filter(itemMP => itemMP.ItemCode == item.itemcode).length===0){
                //////////////console.log(this.items.filter(itemSAP => itemSAP.ItemCode == item.itemcode ));
                if(this.items.filter(itemSAP => itemSAP.ItemCode == item.itemcode ).length>0){
                  ItemName = this.items.filter(itemSAP => itemSAP.ItemCode == item.itemcode )[0].ItemName;
                  ApTaxCode = this.items.filter(itemSAP => itemSAP.ItemCode == item.itemcode )[0].ApTaxCode
                  this.itemsMP.push({ItemCode:item.itemcode, ItemName, ApTaxCode});
                }  
              }
           }
           //this.getZonas();
           //////////////console.log(this.itemsMP);
          },
          error: (error) => {
              //////////////console.log(error);      
          }
        });
  }

  async getZonas(zonas:any){
    //this.comprasService.getZonas(this.authService.getToken())
    //    .subscribe({
    //        next: (zonas)=>{
                ////////////console.log(zonas);
                
                for (let item in zonas){
                  this.zonas.push(zonas[item]);
                }
    //        },
    //        error: (err)=>{
              //////////console.log(err);
    //        }
    //    });
    
  }

  async getDependenciasUsuario(dependenciasUser:any){
    //this.authService.getDependeciasUsuarioXE()
    //this.authService.getDependeciasUsuarioMysql()
    
    //.subscribe({
    //  next: (dependenciasUser) => {
        
         for (let item in dependenciasUser){
          this.dependenciasUsuario.push(dependenciasUser[item]);
        }
        ////////////console.log('dependencias usuario',this.dependenciasUsuario);

        setTimeout(()=>{
          let dependenciesTMP = this.dependenciasUsuario.filter((data => (data.dependence === 'VPCADSU2' && data.vicepresidency === 'VPCADSUM')));
          ////////////console.log(dependenciesTMP);
          
          //Llena locaciones
          for(let dependencia of dependenciesTMP){
            if((this.localidades.filter(data => data.location === dependencia.location)).length ===0){
              this.localidades.push(dependencia);
            }
          }
          
          if(this.localidades.length==0){
            this.localidades = [{codusersap:this.infoUsuario.codusersap, dependence:'VPCADSU2',location:'SANTAMAR',vicepresidency:'VPCADSUM', id:0},
                                {codusersap:this.infoUsuario.codusersap, dependence:'VPCADSU2',location:'BVENTURA',vicepresidency:'VPCADSUM', id:1},                     
                               ]
            ////////////console.log(this.localidades);
          }
        },500);

        
        
  //    },
  //    error: (error) => {
        ////////////console.log(error);
  //    }
  //  });
  }

  async getProveedores(businessPartners:any){
    //this.sapService.sociosDeNegocioMysql(this.authService.getToken())
    //this.sapService.BusinessPartnersXE(this.authService.getToken())
    //    .subscribe({
    //      next: (businessPartners) => {
            for(let item in businessPartners){
              this.proveedores.push(businessPartners[item]);
           }

           
    //      },
    //      error: (error) => {
              ////////////console.log(error);      
    //      }
    //    });
  }

  
  async getAlmacenesMPSL(almacenes:any){
    //this.sapService.getAlmacenesMPSL(this.authService.getToken())
    //this.sapService.getAlmacenesMysql(this.authService.getToken())
    //    .subscribe({
    //        next: (almacenes) => {
    //          ////////console.log(almacenes);
              let almacenesTMP:any[] = [];
              /*for(let item in almacenes.value){
                almacenesTMP.push({store:almacenes.value[item].WarehouseCode, storename: almacenes.value[item].WarehouseName, zonacode:almacenes.value[item].State});
                
              }*/
             for(let item in almacenes){
              almacenesTMP.push({store:almacenes[item].WarehouseCode, storename: almacenes[item].WarehouseName, zonacode:almacenes[item].State});
              this.almacenes.push({store:almacenes[item].WarehouseCode, storename: almacenes[item].WarehouseName, zonacode:almacenes[item].State}); 
             }
             ////////////console.log(this.almacenes)
             //this.almacenes = almacenesTMP.filter(data => data.zonacode == this.zona.State);
    //        },
    //        error: (err) => {
                //////////console.log(err);
    //        }

    //    });
  }

  async getImpuestos(taxes:any){
    //this.comprasService.taxesXE(this.authService.getToken())
    //this.comprasService.impuestosMysql(this.authService.getToken())
    
    //    .subscribe({
    //      next: (taxes) => {
           
            for(let item in taxes){
              this.impuestos.push(taxes[item]);  
            }
            //////////////console.log(this.taxes);
             //this.impuesto = this.impuestos.filter(item => item.Code === 'ID08')[0];
              ////////////console.log(this.impuesto);
      
            //this.SeleccionarImpuesto();
     //     },
     //     error: (error) => {
              ////////////console.log(error);      
     //     }
     //   });
  }

  getMonedas(fecha:Date){
    this.sapService.monedasXEngineSAP(this.authService.getToken(),fecha.toISOString())
       .subscribe({
         next: (monedas) => {
           this.monedas = [{Currency:  'COP',TRM:1}];
           for(let item in monedas){
              this.monedas.push(monedas[item]);
           }
           
           this.setearTRMSolped('USD');
         },
         error: (error) => {
             ////////////console.log(error);      
         }
       });
  }

  async  getMonedasMysql(monedas:any){
    //this.sapService.monedasMysql(this.authService.getToken())
    //   .subscribe({
    //     next: (monedas) => {
    //        ////////console.log('Monedas Mysql',monedas);
           //this.monedas = [{Currency:  'COP',TRM:1}];
           for(let item in monedas){
              this.monedas.push({
                Currency:monedas[item].Code,
                TRM:monedas[item].TRM,
              });
           }
           
           this.setearTRMSolped('USD');
   //      },
   //      error: (error) => {
             ////////////console.log(error);      
    //     }
    //   });
  }

  async getSeries(series:any){
    //this.series = [{name:'SPB',code:'94'},{name:'SPS',code:'62'}];

    //this.sapService.seriesDocXEngineSAP(this.authService.getToken(),'1470000113')
    //this.sapService.seriesDocSAPMysql(this.authService.getToken(),'1470000113')
    
    //    .subscribe({
    //        next: (series)=>{
                ////////////console.log(series);
                for(let item in series){
                  if(series[item].name=='SPMP'){
                    this.series.push(series[item]);
                  }
                  
                }
                //this.series = series.filter(item => item.)
                this.serie = this.series[0].code;
                this.serieName =this.series[0].name;

    //        },
    //        error: (err)=>{
              //////////console.log(err);
    //        }
    //    });

    
  }


  getInventariosMP(){

    ////////////console.log(this.zona);

    let data = {
      item:this.item.ItemCode,
      zona:this.zona.State
    };
    
    this.comprasService.getInventariosMpXE(this.authService.getToken(),data)
        .subscribe({
            next: (inventarios:any) => {
                console.log('getInventariosMpXE',inventarios);
                this.inventariosMP = inventarios;
                this.costoUnitarioMP = inventarios.costoTotalMP;
                this.ubicacionesInventarioMP = inventarios.ubicacionInvetarioMP;
                this.ubicacionesInventarioPT = inventarios.ubicacionInvetarioPT;
                this.getInventariosTracking();
                
            },
            error: (err) =>{
                //////////console.log(err);
            }
        });
  }

  getInventariosTracking(){
    ////////////console.log(this.item);

    let data = {
      item:this.item.ItemCode,
      zona:this.zona.State,
      fechainicio:this.fechaactual,
      fechafin:this.fechaProyeccion
    };
      this.comprasService.getInventariosTracking(this.authService.getToken(),data)
          .subscribe({
              next: (inventarios:any) => {
                 //////console.log('getInventariosTracking',inventarios);
                  this.inventarioTramsitoMP = inventarios.inventarioItemTransito;
                  this.inventarioSolicitadoMP = inventarios.inventarioItenSolicitado;

                  this.inventarioTramsitoMPPreFecha = inventarios.inventarioItemTransitoPreFecha;
                  //console.log('inventarioTramsitoMPPreFecha',this.inventarioTramsitoMPPreFecha);
                  this.inventarioSolicitadoMPPreFecha = inventarios.inventarioItenSolicitadoPreFecha;
                  this.inventarioProyectadoMP = inventarios.comprasProyectadasMP;
                  this.inventarioItemZF = inventarios.inventarioItemZF;
                  this.totalInicialMPZF = inventarios.totalInventarioItemZF;
                  this.gePresupuestoItemZona();
                  ////////console.log(inventarios.inventarioItemZF);
              },
              error: (error) => {
                  //////////console.log(error);
              }
          });
  }

  async gePresupuestoItemZona(){
    
    let fechaInicioSemana = await this.fechaInicioSemana(new Date(this.fechaactual));
    //////console.log('fechaInicioSemana',fechaInicioSemana);
    let data = {
      item:this.item.ItemCode,
      zona:this.zona.State,
      fechainicio:fechaInicioSemana,
      //fechainicio:this.fechaactual,
      fechafin:this.fechaProyeccion
    };

    this. comprasService.getPresupuestosVenta(this.authService.getToken(), data)
        .subscribe({
            next: (result) =>{
                ////////console.log('presupuesto',result);
                this.presupuestoMPVenta = result;
                this.getMaxMinItemZona();
            },
            error: (err) =>{
              //////////console.log(err);
            }
        });
  }
  

  getMaxMinItemZona(){
    let data = {
      item:this.item.ItemCode,
      zona:this.zona.State,
    };

    this. comprasService.getMaxMinItemZona(this.authService.getToken(), data)
        .subscribe({
            next: async (result) =>{
                ////////////console.log(result);
                if(result.length >0){
                  this.maxMpZona = result[0].maximo;
                  this.minMpZona = result[0].minimo;
                }
                await this.calcularLineas();
            },
            error: (err) =>{
              //////////console.log(err);
            }
        });
  }

  SeleccionarZona(){
    //////////console.log(this.zona);
    //this.getAlmacenesMPSL();
  }


  getUnidadItemSL(){
    this.sapService.getUnidadItemSL(this.authService.getToken(),this.item.ItemCode)
        .subscribe({
          next: (unidad)=>{
             
              this.unidad = unidad.value[0].PurchaseUnit;
              ////////////console.log(this.unidad);
          },
          error: (err)=>{
            //////////console.log(err);
          }
        });
  }

  setearTRMSolped(currency:string){
    if(this.monedas.filter(moneda => moneda.Currency === currency).length >0){
      this.trm = this.monedas.filter(moneda => moneda.Currency === currency)[0].TRM;
      this.moneda = currency;
      ////////////console.log(this.moneda);
    }else{
      this.trm = 0;
    }
  }

  async fechaInicioSemana(fecha:Date):Promise<Date>{
    let fechaTMP:Date = new Date(fecha);
    let diaDeLaSemana = fecha.getUTCDay()==0?1:fecha.getUTCDay();
    let numeroDiasRestar = diaDeLaSemana-1;
    fechaTMP.setDate(fecha.getDate()-numeroDiasRestar);

    

    ////////////console.log(fecha, diaDeLaSemana,fecha.getDate(),numeroDiasRestar,fechaTMP);
    return fechaTMP;
  }

  async siguienteMes(fecha:Date):Promise<Date>{
    ////////////console.log(fecha,fecha.getFullYear(),fecha.getMonth());

    let anioMesSiguiente:number = fecha.getMonth()==11?fecha.getFullYear()+1:fecha.getFullYear();
    let mesMesSiguiente:number = fecha.getMonth()==11?0:fecha.getMonth()+1;
    ////////////console.log('año',anioMesSiguiente,'mes',mesMesSiguiente);
    let fechaInicioMesSiguiente = new Date(anioMesSiguiente, mesMesSiguiente,1);

    return fechaInicioMesSiguiente;
  }

  async semanaDelMes(fecha:Date):Promise<string>{
    let semanaMes:string ='';
    
    //let fechaInicioSemana = await this.fechaInicioSemana(new Date(fecha));
    let fechaInicioSemana = ((fecha));
    fechaInicioSemana.setHours(0,0,0);
    //////////console.log('Inicio semana',fechaInicioSemana);
    //let siguienteMes = await this.siguienteMes(new Date(fecha));
    let siguienteMes = await this.siguienteMes((fecha));
    siguienteMes.setHours(0,0,0);
    //////////console.log('Siguiente mes',siguienteMes);

    let fechaInicioSemanaSiguienteMes = await this.fechaInicioSemana((siguienteMes));
    fechaInicioSemanaSiguienteMes.setHours(0,0,0);
    //////////console.log('fecha Inicio Semana Siguiente mes',fechaInicioSemanaSiguienteMes);
    //await ////////console.log(fechaInicioSemana.getFullYear(),fechaInicioSemanaSiguienteMes.getFullYear(),fechaInicioSemana.getMonth(),fechaInicioSemanaSiguienteMes.getMonth(),fechaInicioSemana.getDate(),fechaInicioSemanaSiguienteMes.getDate());

    
    let diaDelMes = fechaInicioSemana.getDate();
    let diaFecha = fechaInicioSemana.getDay();

    
    let weekOfMonth = Math.ceil((diaDelMes - 1 - diaFecha) / 7);
    ////////////console.log(`${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`,weekOfMonth+1);
    let mesStr = this.mesesAnio.filter(mes =>mes.mes === (fechaInicioSemana.getMonth()+1))[0].mesStr.substring(0,3).toUpperCase();
    
    if(fechaInicioSemana.getFullYear()===fechaInicioSemanaSiguienteMes.getFullYear() && fechaInicioSemana.getMonth() === fechaInicioSemanaSiguienteMes.getMonth() && fechaInicioSemana.getDate()===fechaInicioSemanaSiguienteMes.getDate()){
      weekOfMonth = 0;
      mesStr = this.mesesAnio.filter(mes =>mes.mes === (siguienteMes.getMonth()+1))[0].mesStr.substring(0,3).toUpperCase();
    }

    semanaMes = `${(weekOfMonth+1)}S - ${mesStr}`;

    return semanaMes;
  }

  PresionaEnter(event:any){
    
    if (event.key === "Enter") {
      
      ////////////console.log('ENTER PRESS');
      if(event.target.value ===''){
        event.target.value =0;
      }
      this.recalcular();
    }
  }


  async calcularLineas():Promise<void>{
    this.simulacionConProyeciones=[];
    let fechaInicioCalculadora = new Date(this.fechaactual) ;
        let fechaFinalCalculadora = new Date(this.fechaProyeccion) ;
        let semanaFecha:any;
        let fechasemana:Date;
        let semanaMes:string='';
        let inventarioSemanaMP:number= await this.getInventarioInicial('MP');
        let costoUnitarioInicialMP:number = this.costoUnitarioMP;

        
        let inventarioSemanaPT:number= await this.getInventarioInicial('PT');
        //////console.log(inventarioSemanaMP,inventarioSemanaPT);
        let inventarioSemanaMPZF:number=this.totalInicialMPZF;
        let inventarioSemanaMPTR:number=0;
        let compraSolicitadaMP:number = 0;
        let compraProyectadaMP:number=0;
        let simularCantidadLineaMP:number=0;
        let presupuestoVentaMP:number=0;
        let inventarioFinalSemanaMP:number=0;
        let inventarioTransitoProxima:number=0;
        let compraSolicitadaProximaSemana:number = 0;
        let compraProyectadaProximaSemana:number=0; 
        let simularCantidadLineaMPProximaSemana:number=0;
        let presupuestoProximaSemana:number=0;
        let inventarioFinalProximaSemana:number=0;
        let necesidadCompra:string="";
        let cantidadCompraSugerida:number = 0;
        let inventarioFinalSemanaSugerido:number = 0;
        let estadoCompra:boolean = false;
        
        let inventarioTramsitoMPPreFecha:number = await this.calcularInventarioTRPreFecha();
        let costoInventarioTramsitoMPPreFecha:number = await this.calcularCostoInventarioTramsitoMPPreFecha();
        ////console.log('costoInventarioTramsitoMPPreFecha',costoInventarioTramsitoMPPreFecha);
        let inventarioSolicitadoMPPreFecha:number = await this.calcularComprasSolicitadasPreFecha();
        let costoInventarioSolicitadoMPPreFecha:number = await this.calcularCostoInventrioComprasSolicitadasPreFecha();
        ////console.log('costoInventarioSolicitadoMPPreFecha',costoInventarioSolicitadoMPPreFecha);
        //let costoUnitarioInventarioMPPrefecha:any = await this.calcularCostosPreFecha();

        ////console.log(costoUnitarioInventarioMPPrefecha);
        
        let costoUnitarioInventarioTRMPP:number = 0;
        let costoUnitarioInventarioComprasSol:number = 0;
       //////console.log(inventarioSolicitadoMPPreFecha,inventarioTramsitoMPPreFecha,costoUnitarioInventarioMPPrefecha);

        let costoUnitarioInventarioMPSemana:number =0;

        let lineaid:number =0;
        let infoLinea:any;
        let infoLineaSimulacion:any;
        let lineasCalculadora:any[] = this.lineasCalculadora;
       //////console.log('lineasCalculadora',lineasCalculadora);
        for(;fechaInicioCalculadora<=fechaFinalCalculadora; fechaInicioCalculadora.setDate(fechaInicioCalculadora.getDate()+1)){
            //////////console.log('fechaInicioCalculadora',fechaInicioCalculadora);
            semanaFecha = await this.numeroDeSemana(fechaInicioCalculadora);
           //////console.log('semana',semanaFecha);
            fechasemana = fechaInicioCalculadora;
            //fechasemana = this.fechaInicioSemana(fechaInicioCalculadora);
            //////console.log(semanaFecha, lineasCalculadora.filter(item => item.semana == semanaFecha).length);
            //if(this.lineasCalculadora.filter(item => item.semana == semanaFecha).length==0 ){
            if(lineasCalculadora.filter(item => item.semana == semanaFecha).length==0 ){  
             semanaMes = await this.semanaDelMes(new Date(fechaInicioCalculadora));
             //semanaMes =''; 
             
              inventarioSemanaMPTR = (await this.calcularInventarioSemanaTR(semanaFecha))+inventarioTramsitoMPPreFecha;
              costoUnitarioInventarioTRMPP = await this.calcularCostoUnitarioInventarioTRMPP(semanaFecha,inventarioTramsitoMPPreFecha,costoInventarioTramsitoMPPreFecha);
             //////console.log('inventarioSemanaMPTR',inventarioSemanaMPTR);
              compraSolicitadaMP = (await this.calcularComprasSolicitadasSemana(semanaFecha))+inventarioSolicitadoMPPreFecha;
              costoUnitarioInventarioComprasSol = await this.calcularCostoUnitarioInventarioComprasSol(semanaFecha,inventarioSolicitadoMPPreFecha,costoInventarioSolicitadoMPPreFecha);
             //////console.log('compraSolicitadaMP',compraSolicitadaMP);
             
              compraProyectadaMP = await this.calcularComprasProyectadasSemana(semanaFecha);
             //////console.log('compraProyectadaMP',compraProyectadaMP);
              presupuestoVentaMP = await this.calcularPresupuestoSemana(semanaFecha);
             //////console.log('presupuestoVentaMP',presupuestoVentaMP);
              inventarioFinalSemanaMP = (inventarioSemanaMP+inventarioSemanaPT+inventarioSemanaMPZF+inventarioSemanaMPTR+compraSolicitadaMP+compraProyectadaMP+simularCantidadLineaMP)-presupuestoVentaMP;
              inventarioFinalSemanaMP = inventarioFinalSemanaMP<0?0:inventarioFinalSemanaMP;
              estadoCompra = compraProyectadaMP==0?false:true;
              //proxima semana
              inventarioTransitoProxima = await this.calcularInventarioSemanaTR(semanaFecha+1);
              compraSolicitadaProximaSemana = await this.calcularComprasSolicitadasSemana(semanaFecha+1);
              compraProyectadaProximaSemana = await this.calcularComprasProyectadasSemana(semanaFecha+1);
              
              presupuestoProximaSemana = await this.calcularPresupuestoSemana(eval(semanaFecha)+1);
              inventarioFinalProximaSemana = inventarioFinalSemanaMP+inventarioTransitoProxima+compraSolicitadaProximaSemana+compraProyectadaProximaSemana-presupuestoProximaSemana;
              necesidadCompra = inventarioFinalProximaSemana<this.minMpZona?'Si':'No';
              cantidadCompraSugerida = necesidadCompra=='Si'?(eval(this.maxMpZona)-inventarioFinalSemanaMP):0;
              inventarioFinalSemanaSugerido = inventarioFinalSemanaMP+cantidadCompraSugerida;

              //costoUnitarioInventarioMPSemana = await this.calcularCostoUnitarioMPSemana(semanaFecha,inventarioSemanaMP,costoUnitarioInicialMP,costoUnitarioInventarioMPPrefecha);
              
              costoUnitarioInventarioMPSemana = await this.calcularCostoUntarioMPSemana(inventarioSemanaMP,costoUnitarioInicialMP,inventarioSemanaMPTR,costoUnitarioInventarioTRMPP,compraSolicitadaMP,costoUnitarioInventarioComprasSol);
              ////////////console.log(semanaFecha,presupuestoProximaSemana,inventarioFinalProximaSemana,necesidadCompra)
              ////////////console.log(`Para ${fechaInicioCalculadora} el número de semana es ${semanaFecha} `);
              infoLinea = {
                lineaid,
                fechasemana: await this.fechaInicioSemana(new Date(fechasemana)),
                semana: semanaFecha,
                semanaMes,
                numeroSemanaMes:semanaMes.substring(0,1),
                itemSeleccionado:this.itemSeleccionado,
                zonaSeleccionada:this.zonaSeleccionada,
                inventarioSemanaMP,
                costoUnitarioInicialMP,
                inventarioSemanaPT,
                inventarioSemanaMPZF,
                inventarioSemanaMPTR,
                costoUnitarioInventarioTRMPP,
                compraSolicitadaMP,
                costoUnitarioInventarioComprasSol,
                compraProyectadaMP,
                simularCantidadLineaMP,
                presupuestoVentaMP,
                presupuestoVentaMPOriginal:presupuestoVentaMP,
                inventarioFinalSemanaMP,
                estadoCompra,
                necesidadCompra,
                cantidadCompraSugerida,
                inventarioFinalSemanaSugerido,
                costoUnitarioInventarioMPSemana,
                classCantidad:inventarioFinalSemanaMP<this.minMpZona?'c-min-stock':inventarioFinalSemanaMP>this.maxMpZona?'c-max-stock':''
              }

              infoLineaSimulacion ={
                itemcode:this.item.ItemCode,
                codigozona:this.zona.State,
                itemname:this.descripcion,
                zona:this.zonaSeleccionada,
                fecha:await this.fechaInicioSemana(new Date(fechasemana)),
                semana:semanaFecha,
                semanames:semanaMes,
                inventarioMP:inventarioSemanaMP,
                inventarioMPPT:inventarioSemanaPT,
                inventarioMPZF:inventarioSemanaMPZF,
                inventarioTransito:inventarioSemanaMPTR,
                inventarioSolped:compraSolicitadaMP,
                inventarioProyecciones:compraProyectadaMP,
                presupuestoConsumo:presupuestoVentaMP,
                inventarioFinal:inventarioFinalSemanaMP,
                necesidadCompra:necesidadCompra,
                cantidadSugerida:cantidadCompraSugerida,
                inventarioFinalSugerido:inventarioFinalSemanaSugerido,
                tipo:'CP',
                tolerancia:this.tolerancia,
                bodega:this.zona.State==900?'AD_SANTA':'AD_BVTA',
                costoUnitarioInicialMP,
                costoUnitarioInventarioMPSemana,
                costoUnitarioInventarioTRMPP,
                costoUnitarioInventarioComprasSol
              }

              this.simulacionConProyeciones.push(infoLineaSimulacion);
              ////////////console.log(semanaFecha,fechaInicioCalculadora);
              ////////////console.log(semanaFecha,inventarioSemanaMP,inventarioSemanaPT,inventarioSemanaMPZF,inventarioSemanaMPTR,compraSolicitadaMP,compraProyectadaMP,estadoCompra);
              //Calcular inventario inicial siguiente semana
              inventarioSemanaMP = inventarioFinalSemanaMP>0?inventarioFinalSemanaMP:0;
              inventarioSemanaPT = 0;
              inventarioSemanaMPZF = 0;
              inventarioSolicitadoMPPreFecha = 0;
              inventarioTramsitoMPPreFecha = 0;

              costoUnitarioInicialMP = costoUnitarioInventarioMPSemana;
              inventarioTramsitoMPPreFecha=0;
              costoInventarioTramsitoMPPreFecha=0;
              inventarioSolicitadoMPPreFecha=0;
              costoInventarioSolicitadoMPPreFecha=0;
              //costoUnitarioInventarioMPPrefecha[0].cantidadTotalInventarioMP = 0;
              //costoUnitarioInventarioMPPrefecha[0].costoTotalInventarioMP = 0;
              //costoUnitarioInventarioMPPrefecha[0].costoTotalUnitarioMP = 0;


              //this.lineasCalculadora.push(infoLinea);
              lineasCalculadora.push(infoLinea);
              ////////////console.log(infoLinea);
              lineaid++;

            }
        }
        ////////////console.log(this.lineasCalculadora);
        this.lineasCalculadora=lineasCalculadora;
        this.lienas = lineaid;
        this.busqueda= false;  
        //this.envioForm = true;
        this.loadingSimular = false;
        this.calculadora = true;
        this.loading= false;
        
  }

  
  async recalcular(){
  let lineasRecalculo:any[] = [];
  let lineasRecalculoSimulacionCP:any[] = [];
  
  let lineaid:number =0;
  let infoLinea:any;
  let infoLineaSimulacion:any;
  let fechasemana:Date;
  let semana:number = 0;
  let semanaMes:string ='';
  let inventarioSemanaMP:number = 0;

  let costoUnitarioInicialMP:number = 0;

  let inventarioSemanaMPTR:number = 0;

  let compraSolicitadaMP:number = 0;
  let presupuestoVentaMP:number = 0;
  let presupuestoVentaMPOriginal =0;
  let compraProyectadaMP:number = 0;
  let simularCantidadLineaMP:number=0;
  let inventarioFinalSemanaMP:number = 0;
  let inventarioSemanaPT:number = 0;
  let inventarioSemanaMPZF:number = 0;

  let inventarioTransitoProxima:number=0;
  let compraSolicitadaProximaSemana:number=0;
  let compraProyectadaProximaSemana:number=0;
  let presupuestoProximaSemana:number=0;
  let inventarioFinalProximaSemana:number=0;
  let necesidadCompra:string="";
  let cantidadCompraSugerida:number = 0;
  let inventarioFinalSemanaSugerido:number = 0;

  ////////////console.log(this.lineasCalculadora.length);
  let costoUnitarioInventarioMPSemana:number = 0;
  let costoUnitarioInventarioTRMPP:number = 0;
  let costoUnitarioInventarioComprasSol:number = 0;
  
 
  for (let linea of this.lineasCalculadora){

    ////////////console.log(linea);
    fechasemana= new Date(linea.fechasemana);
    semana = linea.semana;
    semanaMes = linea.semanaMes;
    inventarioSemanaMP = lineaid==0?linea.inventarioSemanaMP:inventarioFinalSemanaMP>0?inventarioFinalSemanaMP:0;
    costoUnitarioInicialMP = linea.costoUnitarioInicialMP;
    inventarioSemanaPT = linea.inventarioSemanaPT;     
    inventarioSemanaMPTR = linea.inventarioSemanaMPTR;
    costoUnitarioInventarioTRMPP= linea.costoUnitarioInventarioTRMPP,
    inventarioSemanaMPZF = linea.inventarioSemanaMPZF;
    compraSolicitadaMP = linea.compraSolicitadaMP;
    costoUnitarioInventarioComprasSol = linea.costoUnitarioInventarioComprasSol;
    compraProyectadaMP = linea.compraProyectadaMP;
    simularCantidadLineaMP = linea.simularCantidadLineaMP;
    presupuestoVentaMP = linea.presupuestoVentaMP;
    presupuestoVentaMPOriginal = linea.presupuestoVentaMPOriginal;
    inventarioFinalSemanaMP = await (eval(lineaid==0?linea.inventarioSemanaMP:inventarioFinalSemanaMP)+eval(linea.inventarioSemanaPT)+eval(linea.inventarioSemanaMPZF)+eval(linea.inventarioSemanaMPTR)+eval(linea.compraSolicitadaMP)+eval(linea.compraProyectadaMP)+eval(linea.simularCantidadLineaMP))-eval(linea.presupuestoVentaMP);
    inventarioFinalSemanaMP = inventarioFinalSemanaMP<0?0:inventarioFinalSemanaMP;
    ////////////console.log(lineaid,semana,inventarioSemanaMP,inventarioSemanaPT,inventarioSemanaMPTR,compraProyectadaMP,presupuestoVentaMP,inventarioFinalSemanaMP);

    //proxima semana
    inventarioTransitoProxima =lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].inventarioSemanaMPTR:0;
    compraSolicitadaProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].compraSolicitadaMP:0;
    compraProyectadaProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].compraProyectadaMP:0;
    presupuestoProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].presupuestoVentaMP:0;
    inventarioFinalProximaSemana = inventarioFinalSemanaMP+inventarioTransitoProxima+compraSolicitadaProximaSemana+compraProyectadaProximaSemana-presupuestoProximaSemana;
    necesidadCompra = inventarioFinalProximaSemana<this.minMpZona?'Si':'No';
    cantidadCompraSugerida = necesidadCompra=='Si'?(eval(this.maxMpZona)-inventarioFinalSemanaMP):0;
    inventarioFinalSemanaSugerido = inventarioFinalSemanaMP+cantidadCompraSugerida;
    costoUnitarioInventarioMPSemana = linea.costoUnitarioInventarioMPSemana;
    ////////////console.log(presupuestoProximaSemana,inventarioFinalProximaSemana,necesidadCompra)

    infoLinea = {
      lineaid,
      fechasemana,
      semana,
      semanaMes,
      itemSeleccionado:this.itemSeleccionado,
      zonaSeleccionada:this.zonaSeleccionada,
      inventarioSemanaMP,
      costoUnitarioInicialMP,
      inventarioSemanaPT,
      inventarioSemanaMPZF,
      inventarioSemanaMPTR,
      compraSolicitadaMP,
      compraProyectadaMP,
      simularCantidadLineaMP,
      presupuestoVentaMP,
      inventarioFinalSemanaMP,
      presupuestoVentaMPOriginal,
      estadoCompra:linea.estadoCompra,
      necesidadCompra,
      cantidadCompraSugerida,
      inventarioFinalSemanaSugerido,
      costoUnitarioInventarioMPSemana,
      classCantidad:inventarioFinalSemanaMP<this.minMpZona?'c-min-stock':inventarioFinalSemanaMP>this.maxMpZona?'c-max-stock':''
      
    }

    infoLineaSimulacion ={
      itemcode:this.item.ItemCode,
      codigozona:this.zona.State,
      itemname:this.descripcion,
      zona:this.zonaSeleccionada,
      fecha:fechasemana,
      semana,
      semanames:semanaMes,
      numeroSemanaMes:semanaMes.substring(0,1),
      inventarioMP:inventarioSemanaMP,
      
      inventarioMPPT:inventarioSemanaPT,
      inventarioMPZF:inventarioSemanaMPZF,
      inventarioTransito:inventarioSemanaMPTR,
      inventarioSolped:compraSolicitadaMP,
      inventarioProyecciones:compraProyectadaMP,
      presupuestoConsumo:presupuestoVentaMP,
      inventarioFinal:inventarioFinalSemanaMP,
      necesidadCompra:necesidadCompra,
      cantidadSugerida:cantidadCompraSugerida,
      inventarioFinalSugerido:inventarioFinalSemanaSugerido,
      tipo:'CP',
      tolerancia:this.tolerancia,
      bodega:this.zona.State==900?'AD_SANTA':'AD_BVTA',
      costoUnitarioInicialMP,
      costoUnitarioInventarioMPSemana,
      costoUnitarioInventarioTRMPP,
      costoUnitarioInventarioComprasSol

    }


    ////////////console.log(semana,linea.fechasemana);
    lineasRecalculo.push(infoLinea);
    lineasRecalculoSimulacionCP.push(infoLineaSimulacion);
    //Calcular inventario inicial siguiente semana
    //inventarioSemanaMP = inventarioFinalSemanaMP;
    lineaid++;
  }
  ////////////console.log(lineaid);
  this.lineasCalculadora = lineasRecalculo;
  this.simulacionConProyeciones = lineasRecalculoSimulacionCP;
}

async simulacionSinProyeccion(){
  let lineasRecalculo:any[] = [];
  let lineasRecalculoSimulacionSP:any[] = [];
  
  let lineaid:number =0;
  let infoLinea:any;
  let infoLineaSimulacion:any;
  let fechasemana:Date;
  let semana:number = 0;
  let semanaMes:string ='';
  let inventarioSemanaMP:number = 0;
  let inventarioSemanaMPTR:number = 0;

  let compraSolicitadaMP:number = 0;
  let presupuestoVentaMP:number = 0;
  let presupuestoVentaMPOriginal =0;
  let compraProyectadaMP:number = 0;
  let inventarioFinalSemanaMP:number = 0;
  let inventarioSemanaPT:number = 0;
  let inventarioSemanaMPZF:number = 0;

  let inventarioTransitoProxima:number=0;
  let compraSolicitadaProximaSemana:number=0;
  let compraProyectadaProximaSemana:number=0;
  let presupuestoProximaSemana:number=0;
  let inventarioFinalProximaSemana:number=0;
  let necesidadCompra:string="";
  let cantidadCompraSugerida:number = 0;
  let inventarioFinalSemanaSugerido:number = 0;

  let costoUnitarioInicialMP:number = 0;
  let costoUnitarioInventarioMPSemana:number = 0;
  let costoUnitarioInventarioTRMPP:number = 0;
  let costoUnitarioInventarioComprasSol:number = 0;

  ////////////console.log(this.lineasCalculadora.length);
 
  for (let linea of this.lineasCalculadora){

    ////////////console.log(linea);
    fechasemana= new Date(linea.fechasemana);
    semana = linea.semana;
    semanaMes = linea.semanaMes;
    inventarioSemanaMP = lineaid==0?linea.inventarioSemanaMP:inventarioFinalSemanaMP>0?inventarioFinalSemanaMP:0;
    inventarioSemanaPT = linea.inventarioSemanaPT;     
    inventarioSemanaMPTR = linea.inventarioSemanaMPTR;
    inventarioSemanaMPZF = linea.inventarioSemanaMPZF;
    compraSolicitadaMP = linea.compraSolicitadaMP;
    compraProyectadaMP = 0;
    presupuestoVentaMP = linea.presupuestoVentaMP;
    presupuestoVentaMPOriginal = linea.presupuestoVentaMPOriginal;
    inventarioFinalSemanaMP = await eval(lineaid==0?linea.inventarioSemanaMP:inventarioFinalSemanaMP)+eval(linea.inventarioSemanaPT)+eval(linea.inventarioSemanaMPZF)+eval(linea.inventarioSemanaMPTR)+eval(linea.compraSolicitadaMP)-eval(linea.presupuestoVentaMP);
    inventarioFinalSemanaMP = inventarioFinalSemanaMP<0?0:inventarioFinalSemanaMP;
    ////////////console.log(lineaid,semana,inventarioSemanaMP,inventarioSemanaPT,inventarioSemanaMPTR,compraProyectadaMP,presupuestoVentaMP,inventarioFinalSemanaMP);

    //proxima semana
    inventarioTransitoProxima =lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].inventarioSemanaMPTR:0;
    compraSolicitadaProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].compraSolicitadaMP:0;
    compraProyectadaProximaSemana = 0;
    presupuestoProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].presupuestoVentaMP:0;
    inventarioFinalProximaSemana = inventarioFinalSemanaMP+inventarioTransitoProxima+compraSolicitadaProximaSemana+compraProyectadaProximaSemana-presupuestoProximaSemana;
    necesidadCompra = inventarioFinalProximaSemana<this.minMpZona?'Si':'No';
    cantidadCompraSugerida = necesidadCompra=='Si'?(eval(this.maxMpZona)-inventarioFinalSemanaMP):0;
    inventarioFinalSemanaSugerido = inventarioFinalSemanaMP+cantidadCompraSugerida;
    ////////////console.log(presupuestoProximaSemana,inventarioFinalProximaSemana,necesidadCompra)

    costoUnitarioInicialMP = linea.costoUnitarioInicialMP;
    costoUnitarioInventarioMPSemana = linea.costoUnitarioInventarioMPSemana;
    costoUnitarioInventarioTRMPP= linea.costoUnitarioInventarioTRMPP,
    costoUnitarioInventarioComprasSol = linea.costoUnitarioInventarioComprasSol;

    infoLineaSimulacion ={
      itemcode:this.item.ItemCode,
      codigozona:this.zona.State,
      itemname:this.descripcion,
      zona:this.zonaSeleccionada,
      fecha:fechasemana,
      semana,
      semanames:semanaMes,
      inventarioMP:inventarioSemanaMP,
      
      inventarioMPPT:inventarioSemanaPT,
      inventarioMPZF:inventarioSemanaMPZF,
      inventarioTransito:inventarioSemanaMPTR,
      inventarioSolped:compraSolicitadaMP,
      inventarioProyecciones:compraProyectadaMP,
      presupuestoConsumo:presupuestoVentaMP,
      inventarioFinal:inventarioFinalSemanaMP,
      necesidadCompra:necesidadCompra,
      cantidadSugerida:cantidadCompraSugerida,
      inventarioFinalSugerido:inventarioFinalSemanaSugerido,
      tipo:'SP',
      tolerancia:this.tolerancia,
      bodega:this.zona.State==900?'AD_SANTA':'AD_BVTA',
      costoUnitarioInicialMP,
      costoUnitarioInventarioMPSemana,
      costoUnitarioInventarioTRMPP,
      costoUnitarioInventarioComprasSol

    }


    ////////////console.log(semana,linea.fechasemana);
    //lineasRecalculo.push(infoLinea);
    lineasRecalculoSimulacionSP.push(infoLineaSimulacion);
    //Calcular inventario inicial siguiente semana
    //inventarioSemanaMP = inventarioFinalSemanaMP;
    lineaid++;
  }
  ////////////console.log(lineaid);
  //this.lineasCalculadora = lineasRecalculo;
  this.simulacionSinProyeciones = lineasRecalculoSimulacionSP;
}

async simulacionSinSolped(){
  let lineasRecalculo:any[] = [];
  let lineasRecalculoSimulacionSS:any[] = [];
  
  let lineaid:number =0;
  let infoLinea:any;
  let infoLineaSimulacion:any;
  let fechasemana:Date;
  let semana:number = 0;
  let semanaMes:string ='';
  let inventarioSemanaMP:number = 0;
  let inventarioSemanaMPTR:number = 0;

  let compraSolicitadaMP:number = 0;
  let presupuestoVentaMP:number = 0;
  let presupuestoVentaMPOriginal =0;
  let compraProyectadaMP:number = 0;
  let inventarioFinalSemanaMP:number = 0;
  let inventarioSemanaPT:number = 0;
  let inventarioSemanaMPZF:number = 0;

  let inventarioTransitoProxima:number=0;
  let compraSolicitadaProximaSemana:number=0;
  let compraProyectadaProximaSemana:number=0;
  let presupuestoProximaSemana:number=0;
  let inventarioFinalProximaSemana:number=0;
  let necesidadCompra:string="";
  let cantidadCompraSugerida:number = 0;
  let inventarioFinalSemanaSugerido:number = 0;

  let costoUnitarioInicialMP:number = 0;
  let costoUnitarioInventarioMPSemana:any;
  let costoUnitarioInventarioTRMPP:number = 0;
  let costoUnitarioInventarioComprasSol:number = 0;


  ////////////console.log(this.lineasCalculadora.length);
 
  for (let linea of this.lineasCalculadora){

    ////////////console.log(linea);
    fechasemana= new Date(linea.fechasemana);
    semana = linea.semana;
    semanaMes = linea.semanaMes;
    inventarioSemanaMP = lineaid==0?linea.inventarioSemanaMP:inventarioFinalSemanaMP>0?inventarioFinalSemanaMP:0;
    inventarioSemanaPT = linea.inventarioSemanaPT;     
    inventarioSemanaMPTR = linea.inventarioSemanaMPTR;
    inventarioSemanaMPZF = linea.inventarioSemanaMPZF;
    compraSolicitadaMP = 0;
    compraProyectadaMP = 0;
    presupuestoVentaMP = linea.presupuestoVentaMP;
    presupuestoVentaMPOriginal = linea.presupuestoVentaMPOriginal;
    inventarioFinalSemanaMP = await eval(lineaid==0?linea.inventarioSemanaMP:inventarioFinalSemanaMP)+eval(linea.inventarioSemanaPT)+eval(linea.inventarioSemanaMPZF)+eval(linea.inventarioSemanaMPTR)+eval(linea.compraSolicitadaMP)-eval(linea.presupuestoVentaMP);
    inventarioFinalSemanaMP = inventarioFinalSemanaMP<0?0:inventarioFinalSemanaMP;
    ////////////console.log(lineaid,semana,inventarioSemanaMP,inventarioSemanaPT,inventarioSemanaMPTR,compraProyectadaMP,presupuestoVentaMP,inventarioFinalSemanaMP);

    //proxima semana
    inventarioTransitoProxima =lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].inventarioSemanaMPTR:0;
    compraSolicitadaProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].compraSolicitadaMP:0;
    compraProyectadaProximaSemana = 0;
    presupuestoProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].presupuestoVentaMP:0;
    inventarioFinalProximaSemana = inventarioFinalSemanaMP+inventarioTransitoProxima+compraSolicitadaProximaSemana+compraProyectadaProximaSemana-presupuestoProximaSemana;
    necesidadCompra = inventarioFinalProximaSemana<this.minMpZona?'Si':'No';
    cantidadCompraSugerida = necesidadCompra=='Si'?(eval(this.maxMpZona)-inventarioFinalSemanaMP):0;
    inventarioFinalSemanaSugerido = inventarioFinalSemanaMP+cantidadCompraSugerida;
    ////////////console.log(presupuestoProximaSemana,inventarioFinalProximaSemana,necesidadCompra)

    costoUnitarioInicialMP = linea.costoUnitarioInicialMP;
    costoUnitarioInventarioMPSemana = linea.costoUnitarioInventarioMPSemana;
    costoUnitarioInventarioTRMPP= linea.costoUnitarioInventarioTRMPP,
    costoUnitarioInventarioComprasSol = linea.costoUnitarioInventarioComprasSol;


    infoLineaSimulacion ={
      itemcode:this.item.ItemCode,
      codigozona:this.zona.State,
      itemname:this.descripcion,
      zona:this.zonaSeleccionada,
      fecha:fechasemana,
      semana,
      semanames:semanaMes,
      inventarioMP:inventarioSemanaMP,
      inventarioMPPT:inventarioSemanaPT,
      inventarioMPZF:inventarioSemanaMPZF,
      inventarioTransito:inventarioSemanaMPTR,
      inventarioSolped:compraSolicitadaMP,
      inventarioProyecciones:compraProyectadaMP,
      presupuestoConsumo:presupuestoVentaMP,
      inventarioFinal:inventarioFinalSemanaMP,
      necesidadCompra:necesidadCompra,
      cantidadSugerida:cantidadCompraSugerida,
      inventarioFinalSugerido:inventarioFinalSemanaSugerido,
      tipo:'SS',
      tolerancia:this.tolerancia,
      bodega:this.zona.State==900?'AD_SANTA':'AD_BVTA',
      costoUnitarioInicialMP,
      costoUnitarioInventarioMPSemana,
      costoUnitarioInventarioTRMPP,
      costoUnitarioInventarioComprasSol

    }


    ////////////console.log(semana,linea.fechasemana);
    //lineasRecalculo.push(infoLinea);
    lineasRecalculoSimulacionSS.push(infoLineaSimulacion);
    //Calcular inventario inicial siguiente semana
    //inventarioSemanaMP = inventarioFinalSemanaMP;
    lineaid++;
  }
  ////////////console.log(lineaid);
  //this.lineasCalculadora = lineasRecalculo;
  this.simulacionesSinSolped = lineasRecalculoSimulacionSS;
}

async simulacionSinTransito(){
  let lineasRecalculo:any[] = [];
  let lineasRecalculoSinTransito:any[] = [];
  
  let lineaid:number =0;
  let infoLinea:any;
  let infoLineaSimulacion:any;
  let fechasemana:Date;
  let semana:number = 0;
  let semanaMes:string ='';
  let inventarioSemanaMP:number = 0;
  let inventarioSemanaMPTR:number = 0;

  let compraSolicitadaMP:number = 0;
  let presupuestoVentaMP:number = 0;
  let presupuestoVentaMPOriginal =0;
  let compraProyectadaMP:number = 0;
  let inventarioFinalSemanaMP:number = 0;
  let inventarioSemanaPT:number = 0;
  let inventarioSemanaMPZF:number = 0;

  let inventarioTransitoProxima:number=0;
  let compraSolicitadaProximaSemana:number=0;
  let compraProyectadaProximaSemana:number=0;
  let presupuestoProximaSemana:number=0;
  let inventarioFinalProximaSemana:number=0;
  let necesidadCompra:string="";
  let cantidadCompraSugerida:number = 0;
  let inventarioFinalSemanaSugerido:number = 0;

  let costoUnitarioInicialMP = 0;
  let costoUnitarioInventarioMPSemana = 0;
  let costoUnitarioInventarioTRMPP:number = 0;
  let costoUnitarioInventarioComprasSol:number = 0;


  ////////////console.log(this.lineasCalculadora.length);
 
  for (let linea of this.lineasCalculadora){

    ////////////console.log(linea);
    fechasemana= new Date(linea.fechasemana);
    semana = linea.semana;
    semanaMes = linea.semanaMes;
    inventarioSemanaMP = lineaid==0?linea.inventarioSemanaMP:inventarioFinalSemanaMP>0?inventarioFinalSemanaMP:0;
    inventarioSemanaPT = linea.inventarioSemanaPT;     
    inventarioSemanaMPTR = 0;
    inventarioSemanaMPZF = linea.inventarioSemanaMPZF;
    compraSolicitadaMP = 0;
    compraProyectadaMP = 0;
    presupuestoVentaMP = linea.presupuestoVentaMP;
    presupuestoVentaMPOriginal = linea.presupuestoVentaMPOriginal;
    inventarioFinalSemanaMP = await eval(lineaid==0?linea.inventarioSemanaMP:inventarioFinalSemanaMP)+eval(linea.inventarioSemanaPT)+eval(linea.inventarioSemanaMPZF)-eval(linea.presupuestoVentaMP);
    inventarioFinalSemanaMP = inventarioFinalSemanaMP<0?0:inventarioFinalSemanaMP;
    ////////////console.log(lineaid,semana,inventarioSemanaMP,inventarioSemanaPT,inventarioSemanaMPTR,compraProyectadaMP,presupuestoVentaMP,inventarioFinalSemanaMP);

    //proxima semana
    inventarioTransitoProxima =lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].inventarioSemanaMPTR:0;
    compraSolicitadaProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].compraSolicitadaMP:0;
    compraProyectadaProximaSemana = 0;
    presupuestoProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].presupuestoVentaMP:0;
    inventarioFinalProximaSemana = inventarioFinalSemanaMP+inventarioTransitoProxima+compraSolicitadaProximaSemana+compraProyectadaProximaSemana-presupuestoProximaSemana;
    necesidadCompra = inventarioFinalProximaSemana<this.minMpZona?'Si':'No';
    cantidadCompraSugerida = necesidadCompra=='Si'?(eval(this.maxMpZona)-inventarioFinalSemanaMP):0;
    inventarioFinalSemanaSugerido = inventarioFinalSemanaMP+cantidadCompraSugerida;
    ////////////console.log(presupuestoProximaSemana,inventarioFinalProximaSemana,necesidadCompra)
    costoUnitarioInicialMP = linea.costoUnitarioInicialMP;
    costoUnitarioInventarioMPSemana = linea.costoUnitarioInventarioMPSemana;
    costoUnitarioInventarioTRMPP= linea.costoUnitarioInventarioTRMPP,
    costoUnitarioInventarioComprasSol = linea.costoUnitarioInventarioComprasSol;


    infoLineaSimulacion ={
      itemcode:this.item.ItemCode,
      codigozona:this.zona.State,
      itemname:this.descripcion,
      zona:this.zonaSeleccionada,
      fecha:fechasemana,
      semana,
      semanames:semanaMes,
      inventarioMP:inventarioSemanaMP,
      inventarioMPPT:inventarioSemanaPT,
      inventarioMPZF:inventarioSemanaMPZF,
      inventarioTransito:inventarioSemanaMPTR,
      inventarioSolped:compraSolicitadaMP,
      inventarioProyecciones:compraProyectadaMP,
      presupuestoConsumo:presupuestoVentaMP,
      inventarioFinal:inventarioFinalSemanaMP,
      necesidadCompra:necesidadCompra,
      cantidadSugerida:cantidadCompraSugerida,
      inventarioFinalSugerido:inventarioFinalSemanaSugerido,
      tipo:'ST',
      tolerancia:this.tolerancia,
      bodega:this.zona.State==900?'AD_SANTA':'AD_BVTA',
      costoUnitarioInicialMP,
      costoUnitarioInventarioMPSemana,
      costoUnitarioInventarioTRMPP,
      costoUnitarioInventarioComprasSol


    }


    ////////////console.log(semana,linea.fechasemana);
    //lineasRecalculo.push(infoLinea);
    lineasRecalculoSinTransito.push(infoLineaSimulacion);
    //Calcular inventario inicial siguiente semana
    //inventarioSemanaMP = inventarioFinalSemanaMP;
    lineaid++;
  }
  ////////////console.log(lineaid);
  //this.lineasCalculadora = lineasRecalculo;
  this.simulacionSinTransitoMP = lineasRecalculoSinTransito;
}

  filtrarItems(event:any){
    let filtered : any[] = [];
       let query = event.query;
       for(let i = 0; i < this.itemsMP.length; i++) {
           let items = this.itemsMP[i];
  
            if((items.ItemCode.toLowerCase().indexOf(query.toLowerCase())>=0) ||
               (items.ItemName.toLowerCase().indexOf(query.toLowerCase())>=0)){
              filtered.push(items);
           }
       }
       this.itemsFiltrados = filtered;
  }

  SeleccionarItemCode(){
    ////////console.log(this.item);
    this.descripcion = this.item.ItemName;
    this.itemSeleccionado = this.item.ItemCode+' - '+ this.item.ItemName;
    this.unidad = this.item.BuyUnitMsr;
    //this.getUnidadItemSL();
  }



  async GuardarSimulacion(){

    //if(this.lineasCalculadora.filter(item =>item.compraProyectadaMP >0 && !item.estadoCompra ).length==0){
    //  this.messageService.add({severity:'error', summary: '!Error', detail: 'No ha registrado proyecciones de compra a guardar'});
   // }else{
      await this.simulacionSinProyeccion();
      await this.simulacionSinTransito();
      this.messageService.add({key: 'confirmGuardarSimulacion', 
      sticky: true, 
      severity:'warn', 
      summary:'Confirmación cargue simulación', 
      detail:`¿Esta seguro de grabar la simulación de la proyección de compra?`

      });
    //}
    
    

   
  }

  onConfirmGS(){
    this.messageService.clear('confirmGuardarSimulacion');
    this.loadingGrabarSimulacion = true;
    
    
    let data ={
      simulacionConProyeciones:this.simulacionConProyeciones,
      simulacionSinProyeciones:this.simulacionSinProyeciones,
      simulacionSinTransitoMP:this.simulacionSinTransitoMP,
      simulacionSinSolped:this.simulacionesSinSolped
    }

    console.log(data);
    
    this.comprasService.grabarSimulaciones(this.authService.getToken(),data)
        .subscribe({
          next: (result)=>{
           console.log(result);

            this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
            this.loadingGrabarSimulacion = false;
          },
          error: (err)=>{
              //////////console.log(err);
              this.messageService.add({severity:'error', summary: '!Error', detail: err});
              this.loadingGrabarSimulacion = false;
          }
        });
  }

  onRejectGS(){
    this.messageService.clear('confirmGuardarSimulacion');
  }

  anularProyeccion(idProyeccion:any,semana:number){
    this.messageService.add({key: 'confirmAnularProyeccion', 
    sticky: true, 
    severity:'warn', 
    summary:'Confirmación anulación de proyección', 
    detail:`¿Esta seguro de anular la  proyección de compra  ${idProyeccion}?`,
    data:{idProyeccion,semana}
  });
  }

  onRejectAP(){
    this.messageService.clear('confirmAnularProyeccion');
  }

  onConfirmAP(idProyeccion:any,semana:number){
    this.messageService.clear('confirmAnularProyeccion');

    this.comprasService.cancelacionSolped(this.authService.getToken(), [idProyeccion])
        .subscribe({
          next:(solpedCanceladas)=>{
            if(solpedCanceladas.status=="ok"){
             
              let message = `La cancelación del documento seleccionado fue realizado correctamente`;
              
              this.messageService.add({key: 'tl',severity:'success', summary: '!Ok', detail: message});

              let indexInvProyeccion:number = this.inventarioProyectadoMP.findIndex(item => item.DocNum == idProyeccion);
              this.inventarioProyectadoMP.splice(indexInvProyeccion,1);

               //Obtener inventarios proyectados pertenecientees a la semana
            let inventarioProyectadoMP = this.inventarioProyectadoMP.filter(async data=> await this.numeroDeSemana(new Date(data.FECHANECESIDAD)) === semana);
            let totalSemana = 0 ;
            for(let item of inventarioProyectadoMP){
              totalSemana+= item.Quantity;
            }
            ////////////console.log(totalSemana);

            let indexLineasCalculadora = this.lineasCalculadora.findIndex(item=> item.semana == semana);
            this.lineasCalculadora[indexLineasCalculadora].compraProyectadaMP=totalSemana;
            this.verdocumentos = false;
            this.recalcular();
              
              //this.getListado();
            }else{
              this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: solpedCanceladas.message});
              this.loading = false;
            }
          },
          error:(err)=>{
            //////////console.log(err);
            this.loading = false
            this.messageService.add({key: 'tl',severity:'error', summary: '!Error', detail: err});
          }
        });
  }

  editarProyeccion(cantidadProyectada:number,fechaEditar:Date,linenum:number){
    this.editarproyeccion = true;
    this.cantidadEditar = cantidadProyectada;
    this.fechaEditar = new Date(fechaEditar);

    ////////////console.log(this.inventarioProyectadoMP);
  }
  
  

  guardarProyeccion(idProyeccion:any,cantidadProyectada:number,semana:number,fechaEditar:Date,linenum:number){
    this.messageService.add({key: 'confirmEditarProyeccion', 
    sticky: true, 
    severity:'warn', 
    summary:'Confirmación de edición de proyección', 
    detail:`¿Esta seguro de realizar la actualización de la cantidad de la proyección de compra  ${idProyeccion}?`,
    data:{idProyeccion,cantidadProyectada,semana,fechaEditar,linenum}
  });
  }

  onRejectCEP(){
    this.messageService.clear('confirmEditarProyeccion');
    this.editarproyeccion = false;
  }

  onConfirmCEP(idProyeccion:any,cantidadProyectada:number,semana:number,fechaEditar:Date,linenum:number){
    this.messageService.clear('confirmEditarProyeccion');
    this.editarproyeccion = false;
    let data = {
      idProyeccion,
      cantidadProyectada,
      item:this.item.ItemCode,
      fechaEditar,
      linenum
    }

    //////////console.log(data);

    this.comprasService.updateCantidadSolped(this.authService.getToken(),data)
        .subscribe({
          next: async (result)=>{
            ////////////console.log(result);
            let semanaProyeccion = await this.numeroDeSemana(fechaEditar);
           
            let indexInvProyeccion:number = this.inventarioProyectadoMP.findIndex(item => item.DocNum == idProyeccion)
            //////////console.log(this.inventarioProyectadoMP);
            this.inventarioProyectadoMP[indexInvProyeccion].Quantity = cantidadProyectada;
            this.inventarioProyectadoMP[indexInvProyeccion].FECHANECESIDAD = fechaEditar;
            //Obtener inventarios proyectados pertenecientees a la semana
            let inventarioProyectadoMP = this.inventarioProyectadoMP.filter(async data=> await this.numeroDeSemana(new Date(data.FECHANECESIDAD)) === semana);
            let totalSemana = 0 ;
            for(let item of inventarioProyectadoMP){
              totalSemana+= item.Quantity;
            }
            //////////console.log(totalSemana);

            let indexLineasCalculadora = this.lineasCalculadora.findIndex(item=> item.semana == semana);
            ////////console.log(this.lineasCalculadora[indexLineasCalculadora]);
            this.lineasCalculadora[indexLineasCalculadora].compraProyectadaMP=totalSemana;
            if(totalSemana<=0){
              this.lineasCalculadora[indexLineasCalculadora].estadoCompra = false;
            }

            //////////console.log(semanaProyeccion,semana);
            if(semanaProyeccion!=semana){

              let inventarioProyectadoMP2 = this.inventarioProyectadoMP.filter(async data2=> await this.numeroDeSemana(new Date(data2.FECHANECESIDAD)) === semanaProyeccion);
              let totalSemana2 = 0 ;
              for(let item2 of inventarioProyectadoMP2){
                totalSemana2+= item2.Quantity;
              }
              //////////console.log(totalSemana2);

              let indexLineasCalculadora = this.lineasCalculadora.findIndex(item=> item.semana == semanaProyeccion);
              ////////console.log(this.lineasCalculadora[indexLineasCalculadora]);
              this.lineasCalculadora[indexLineasCalculadora].compraProyectadaMP=totalSemana2;
              this.lineasCalculadora[indexLineasCalculadora].estadoCompra = true;

            }

            this.recalcular();
            this.verdocumentos = false;
            this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
            
          },
          error: (err)=>{
            //////////console.log(err);
            this.messageService.add({severity:'error', summary: '!Error', detail: err});
          }
        });


    
    this.editarproyeccion = false;
      
  }

  clearItemCode(){
 
  }

  cambio(event:any){
    ////////////console.log(event.target.value);
    if(event.target.value ===''){
      event.target.value =0;
    }
       this.recalcular();
  }

  modificaTolerancia(){

    this.debouncer.next(this.tolerancia);

   
  }

 
  cambioTolerancia(event:any){
    //////////console.log(event.value);

    
    for(let item of this.lineasCalculadora){
       let nuevoPresupuesto = item.presupuestoVentaMPOriginal+(item.presupuestoVentaMPOriginal*(event.value/100));

       ////////////console.log(item.semana,item.presupuestoVentaMP,nuevoPresupuesto);
       item.presupuestoVentaMP = nuevoPresupuesto;
    }
    //this.ultimaTolerancia = event.value;
    this.recalcular();
  }

  validarFP():boolean{
    let valido = false;
    this.fechaProyeccionstr = this.fechaProyeccion.toLocaleDateString();
    this.fechaactual = new Date();
    ////////////console.log(this.fechaProyeccion,this.fechaactual);
   
    if(new Date(this.fechaProyeccion)>new Date(this.fechaactual)){
      valido = true;
      this.errorFP = false;
    }else{
      this.errorFP = true;
      this.messageService.add({severity:'error', summary: '!Error', detail: 'La fecha de proyección no puede ser menor o igual a la fecha actual'});
    }

    ////////////console.log(valido);
    return valido;
  }

  async simular(){
    this.busqueda= true;
    
    if(await !this.validarFP()){
      
    }else if(!this.item || !this.zona || this.descripcion==''){
      this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar los campos resaltados en rojo'});
    }else{
        //this.busqueda= false;  
        //this.envioForm = true;
        //this.calculadora = true;

        this.lineasCalculadora =[];
        this.maxMpZona = 0;
        this.minMpZona = 0;
        this.loadingSimular = true;
        this.presupuestoMPVenta = [];
        this.inventarioTramsitoMP = [];
        this.inventarioSolicitadoMP = [];
        this.totalInicialMPZF =0;
        this.zonaSeleccionada = this.zona.PENTRADA;
        
        this.getInventariosMP();
       
        

      }
  }

  reset(){

  }
  clearItem(){
    this.descripcion = "";
  }
  
  
  async calcularPresupuestoSemana(semanaFecha:number):Promise<number>{
    let presupuestoVentaMP:number=0;
    ////////console.log('semanaFecha', semanaFecha,this.presupuestoMPVenta);
    if(this.presupuestoMPVenta.length >0 && this.presupuestoMPVenta.filter(item => item.semana ==  semanaFecha).length>0 ){
      let filas = this.presupuestoMPVenta.filter(item => item.semana ==  semanaFecha);
      ////////console.log('Presupuesto semana ',semanaFecha,filas);
      for(let fila of filas){
        presupuestoVentaMP = presupuestoVentaMP+eval(fila.cantidad);
      }
    }
    return presupuestoVentaMP;
  }

  async calcularComprasProyectadasSemana(semanaFecha:number):Promise<number>{
    let compraProyectadaMP:number=0;
    /*if(this.inventarioProyectadoMP.length >0 && this.inventarioProyectadoMP.filter(async item => await this.numeroDeSemana(new Date(item.FECHANECESIDAD)) ==  semanaFecha).length>0 ){
      let filas = this.inventarioProyectadoMP.filter(async item => await this.numeroDeSemana(new Date(item.FECHANECESIDAD)) ==  semanaFecha);
      ////////////console.log(semanaFecha,filas);
      for(let fila of filas){
        
        compraProyectadaMP = compraProyectadaMP+eval(fila.Quantity);
      }
    }*/
    for await (let item of this.inventarioProyectadoMP){
      let semanaFechaNecesidad = await this.numeroDeSemana(new Date(item.FECHANECESIDAD));
      if(semanaFechaNecesidad==semanaFecha){
       
        compraProyectadaMP += eval(item.Quantity);
        //////console.log(compraSolicitadaMP);
      }
    }

    return compraProyectadaMP;
  }

  async calcularComprasSolicitadasSemana(semanaFecha:number):Promise<number>{
    let compraSolicitadaMP:number=0;
     
    /*if(this.inventarioSolicitadoMP.length >0 && this.inventarioSolicitadoMP.filter(async item => (await this.numeroDeSemana(new Date(item.FECHANECESIDAD))) ==  semanaFecha).length>0 ){
      let filas = this.inventarioSolicitadoMP.filter(async item => (await this.numeroDeSemana(new Date(item.FECHANECESIDAD))) ==  semanaFecha);
      //////////console.log(semanaFecha,filas);
      for(let fila of filas){
        
        //compraSolicitadaMP = compraSolicitadaMP+eval(fila.Quantity);
        compraSolicitadaMP = compraSolicitadaMP+eval(fila.OpenCreQty);
      }
    }*/
    for await (let item of this.inventarioSolicitadoMP){
      let semanaFechaNecesidad = await this.numeroDeSemana(new Date(item.FECHANECESIDAD));
      if(semanaFechaNecesidad==semanaFecha){
       
        compraSolicitadaMP += eval(item.OpenCreQty);
        //////console.log(compraSolicitadaMP);
      }
    }

    //////console.log(semanaFecha,compraSolicitadaMP);


    return compraSolicitadaMP;
  }

 async calcularCostoComprasSolicitadasSemana(semanaFecha:number):Promise<number>{
    let costoCompraSolicitadaMPSemana:number=0;
    let cantidadTotalInventarioMP = 0;
    let costoTotalUnitarioMP =0;
    let costoTotalInventarioMP =0;
    
    for await (let item of this.inventarioSolicitadoMP){
      let semanaFechaNecesidad = await this.numeroDeSemana(new Date(item.FECHANECESIDAD));
      if(semanaFechaNecesidad==semanaFecha && item.Preciocalcu>0){
       
        cantidadTotalInventarioMP += eval(item.OpenCreQty);
        costoTotalInventarioMP +=eval(item.Preciocalcu)*eval(item.OpenCreQty);
      }
    }

    //costoCompraSolicitadaMPSemana = cantidadTotalInventarioMP==0?0:costoTotalInventarioMP/cantidadTotalInventarioMP;
    costoCompraSolicitadaMPSemana = costoTotalInventarioMP;
                                

    return costoCompraSolicitadaMPSemana;
  }

  async calcularComprasSolicitadasPreFecha():Promise<number>{
    let compraSolicitadaMP:number=0;
    //if(this.inventarioSolicitadoMPPreFecha.length >0 && this.inventarioSolicitadoMPPreFecha.filter(item => this.numeroDeSemana(new Date(item.FECHANECESIDAD)) ==  semanaFecha).length>0 ){
      let filas = this.inventarioSolicitadoMPPreFecha;
      ////////////console.log(semanaFecha,filas);
      for(let fila of filas){
        
        //compraSolicitadaMP = compraSolicitadaMP+eval(fila.Quantity);
        compraSolicitadaMP = compraSolicitadaMP+eval(fila.OpenCreQty);
      }
    //}
    return compraSolicitadaMP;
  }

  async calcularCostoInventrioComprasSolicitadasPreFecha():Promise<number>{
    let costoInventarioCompraSolicitadaMPPrefecha:number=0;
      let filas = this.inventarioSolicitadoMPPreFecha.filter((inventario: { Preciocalcu: number; })=>inventario.Preciocalcu>0);
      let cantidadTotalInventarioMP = 0;
      let costoTotalUnitarioMP =0;
      let costoTotalInventarioMP =0;
      //////console.log(filas);
      for(let fila of filas){
        cantidadTotalInventarioMP += eval(fila.OpenCreQty);
        costoTotalInventarioMP +=eval(fila.Preciocalcu)*eval(fila.OpenCreQty);
      }
      //costoInventarioCompraSolicitadaMPPrefecha= cantidadTotalInventarioMP==0?0:costoTotalInventarioMP/cantidadTotalInventarioMP;
      costoInventarioCompraSolicitadaMPPrefecha= costoTotalInventarioMP;
                                  
    return costoInventarioCompraSolicitadaMPPrefecha;
  }

  async calcularInventarioSemanaTR(semanaFecha:number):Promise<number>{
    let inventarioSemanaMPTR:number=0;
    /*if(this.inventarioTramsitoMP.length >0 && this.inventarioTramsitoMP.filter(async item => await this.numeroDeSemana(new Date(item.ETA)) ==  semanaFecha).length>0 ){
      let filas = this.inventarioTramsitoMP.filter(async item => await this.numeroDeSemana(new Date(item.ETA)) ==  semanaFecha);
      for(let fila of filas){
        //inventarioSemanaMPTR = inventarioSemanaMPTR+eval(fila.Quantity);
        inventarioSemanaMPTR = inventarioSemanaMPTR+eval(fila.OpenCreQty);
      }
    }*/
    for await (let item of this.inventarioTramsitoMP){
      let semanaFechaNecesidad = await this.numeroDeSemana(new Date(item.ETA));
      if(semanaFechaNecesidad==semanaFecha){
       
        inventarioSemanaMPTR += eval(item.OpenCreQty);
       //////console.log(inventarioSemanaMPTR);
      }
    }

   //////console.log(semanaFecha,inventarioSemanaMPTR);


    return inventarioSemanaMPTR;
  }

async  calcularCostoInventarioSemanaTR(semanaFecha:number):Promise<number>{
    let costoInventarioSemanaMPTR:number =0;
    let cantidadTotalInventarioMP = 0;
    let costoTotalUnitarioMP =0;
    let costoTotalInventarioMP = 0;
 
    for await (let item of this.inventarioTramsitoMP){
      let semanaFechaNecesidad = await this.numeroDeSemana(new Date(item.ETA));
      if(semanaFechaNecesidad==semanaFecha && item.Preciocalcu>0){
       
        cantidadTotalInventarioMP += eval(item.OpenCreQty);
        costoTotalInventarioMP +=eval(item.Preciocalcu)*eval(item.OpenCreQty);
      }
    }

    //costoInventarioSemanaMPTR= cantidadTotalInventarioMP==0?0:costoTotalInventarioMP/cantidadTotalInventarioMP
    costoInventarioSemanaMPTR= costoTotalInventarioMP;

    return costoInventarioSemanaMPTR;
  }

  async calcularInventarioTRPreFecha():Promise<number>{
    let inventarioSemanaMPTR:number=0;
    //if(this.inventarioTramsitoMPPreFecha.length >0 && this.inventarioTramsitoMPPreFecha.filter((item: { ETA: string | number | Date; }) => this.numeroDeSemana(new Date(item.ETA)) ==  semanaFecha).length>0 ){
      let filas = this.inventarioTramsitoMPPreFecha;//.filter((item: { ETA: string | number | Date; }) => this.numeroDeSemana(new Date(item.ETA)) ==  semanaFecha);
      ////////console.log('InventarioTRPreFecha',filas);
      for(let fila of filas){
        inventarioSemanaMPTR = inventarioSemanaMPTR+eval(fila.OpenCreQty);
      }
    //}
    return inventarioSemanaMPTR;
  }

  async calcularCostoInventarioTramsitoMPPreFecha():Promise<number>{
        let costoInventarioTramsitoMPPreFecha = 0;
        let filas = this.inventarioTramsitoMPPreFecha.filter((inventario: { Preciocalcu: number; })=>inventario.Preciocalcu>0);
        let cantidadTotalInventarioMP = 0;
        let costoTotalUnitarioMP =0;
        let costoTotalInventarioMP = 0;
        ////////console.log('InventarioTRPreFecha',filas);
        for await (let fila of filas){
            cantidadTotalInventarioMP += eval(fila.OpenCreQty);
            costoTotalInventarioMP +=eval(fila.Preciocalcu)*eval(fila.OpenCreQty);
        }

        //costoInventarioTramsitoMPPreFecha = cantidadTotalInventarioMP==0?0:costoTotalInventarioMP/cantidadTotalInventarioMP; 
        costoInventarioTramsitoMPPreFecha = costoTotalInventarioMP;

        return costoInventarioTramsitoMPPreFecha
  }

  async calcularCostoUnitarioInventarioTRMPP(semana:number,inventarioTRMPPrefecha:number, costoInventarioTRMPPrefecha:number ):Promise<number> {
    
    let costoUnitarioInventarioTRMPPSemana:number =0;
    let inventarioTRMPSemana = await this.calcularInventarioSemanaTR(semana);
    let costoInventarioTRMPSemana:any = await this.calcularCostoInventarioSemanaTR(semana);

    let totalInventarioTRMPSemana = inventarioTRMPPrefecha+inventarioTRMPSemana;
    let costoTotalInventarioTRMPSemana = costoInventarioTRMPPrefecha + costoInventarioTRMPSemana;

    costoUnitarioInventarioTRMPPSemana = totalInventarioTRMPSemana==0?0:costoTotalInventarioTRMPSemana/totalInventarioTRMPSemana;

    ////console.log("semana",semana);
    ////console.log("inventarioTRMPPrefecha",inventarioTRMPPrefecha);
    ////console.log("costoInventarioTRMPPrefecha",costoInventarioTRMPPrefecha);
    ////console.log("inventarioTRMPSemana",inventarioTRMPSemana);
    ////console.log("costoInventarioTRMPSemana",costoInventarioTRMPSemana);
    ////console.log("costoUnitarioInventarioTRMPPSemana",costoUnitarioInventarioTRMPPSemana);
    


    return costoUnitarioInventarioTRMPPSemana;
  }

  async calcularCostoUnitarioInventarioComprasSol(semana:number,inventarioCopmrasSolPrefecha:number, costoInventarioComprasSolPrefecha:number ):Promise<number> {
    let costoUnitarioInventarioComprasSolSemana:number =0;
    let inventarioComprasSolSemana = await this.calcularComprasSolicitadasSemana(semana);
    let costoInventarioComprasSolSemana:any = await this.calcularCostoComprasSolicitadasSemana(semana);

    let totalInventarioComprasSolSemana = inventarioCopmrasSolPrefecha+inventarioComprasSolSemana;
    let costoTotalInventarioComprasSolSemana = costoInventarioComprasSolPrefecha + costoInventarioComprasSolSemana;

    costoUnitarioInventarioComprasSolSemana = totalInventarioComprasSolSemana==0?0:costoTotalInventarioComprasSolSemana/totalInventarioComprasSolSemana;



    return costoUnitarioInventarioComprasSolSemana;
  }

  async calcularCostoUntarioMPSemana(inventarioSemanaMP:number,
                                     costoUnitarioInicialMP:number,
                                     inventarioSemanaMPTR:number,
                                     costoUnitarioInventarioTRMPP:number,
                                     compraSolicitadaMP:number,
                                     costoUnitarioInventarioComprasSol:number):Promise<number>{
    let costoUnitarioMPSemana = 0;

  

    let totalInventarioMPSemana = (costoUnitarioInicialMP==0?0:inventarioSemanaMP)+
                                  (costoUnitarioInventarioTRMPP==0?0:inventarioSemanaMPTR)+
                                  (costoUnitarioInventarioComprasSol==0?0:compraSolicitadaMP);

    ////console.log('totalInventarioMPSemana',totalInventarioMPSemana);

    let costoTotalInventarioMPSemana = (costoUnitarioInicialMP*inventarioSemanaMP)+
                                       (costoUnitarioInventarioTRMPP*inventarioSemanaMPTR)+
                                       (costoUnitarioInventarioComprasSol*compraSolicitadaMP);

    costoUnitarioMPSemana = totalInventarioMPSemana==0?0:costoTotalInventarioMPSemana/totalInventarioMPSemana;

    return costoUnitarioMPSemana;
  }



  SeleccionarLinea(){

  }

 

 async getInventarioInicial(tipoInv:string):Promise<number>{  

    let inventarioInicial:number =0; 

    if(tipoInv ==='MP'){
      inventarioInicial = this.inventariosMP.inventarioMP;
    }
    if(tipoInv ==='PT'){
      inventarioInicial = this.inventariosMP.inventarioPT;
    }

    return inventarioInicial;

  }

  verUbicacionesTipoInv(tipoInv:string){
    if(tipoInv ==='MP'){
      this.verUbicacionesInventario(this.ubicacionesInventarioMP,'Ubicaciones de Materia prima');
    }
    if(tipoInv ==='PT'){
      this.verUbicacionesInventario(this.ubicacionesInventarioPT,'Ubicaciones de Materia prima en producto terminado');
    }
  }

  verproyecciones(semana:number){ 
    //////////console.log(semana,this.inventarioProyectadoMP);
    ////////////console.log(this.inventarioProyectadoMP.filter(data=> this.numeroDeSemana(new Date(data.FECHANECESIDAD)) === semana));
    let inventarioProyectadoMP = this.inventarioProyectadoMP.filter(async data=> await this.numeroDeSemana(new Date(data.FECHANECESIDAD)) === semana);
    this.generarListaDocumentos(inventarioProyectadoMP,'Proyección de compra item',semana);
  }

  versolicitudes(semana:number){
    ////////////console.log(semana,this.inventarioSolicitadoMP);
    ////////////console.log(this.inventarioSolicitadoMP.filter(data=> this.numeroDeSemana(new Date(data.FECHANECESIDAD)) === semana));
    let inventarioSolicitadoMP = this.inventarioSolicitadoMP.filter(async data=> await this.numeroDeSemana(new Date(data.FECHANECESIDAD)) === semana);
    //////console.log(inventarioSolicitadoMP);
    //////////console.log(this.lineasCalculadora.findIndex(data => data.semana === semana));
    if(this.lineasCalculadora.findIndex(data => data.semana === semana)==0 && (this.inventarioSolicitadoMPPreFecha.length>0)){
      inventarioSolicitadoMP = inventarioSolicitadoMP.concat(this.inventarioSolicitadoMPPreFecha);
    }

    this.generarListaDocumentos(inventarioSolicitadoMP,'Solicitud de compra item');
  }

  verpedidostransito(semana:number){
    ////////////console.log(semana,this.inventarioTramsitoMP);
    ////////////console.log(this.inventarioTramsitoMP.filter(data=> this.numeroDeSemana(new Date(data.ETA)) === semana));
    let inventarioTramsitoMP = this.inventarioTramsitoMP.filter(async data=> await this.numeroDeSemana(new Date(data.ETA)) === semana);
    ////////////console.log(this.lineasCalculadora.findIndex(data => data.semana === semana));
    if(this.lineasCalculadora.findIndex(data => data.semana === semana)==0 && (this.inventarioTramsitoMPPreFecha.length>0)){
      inventarioTramsitoMP = inventarioTramsitoMP.concat(this.inventarioTramsitoMPPreFecha);
    }
    this.generarListaDocumentos(inventarioTramsitoMP,'Pedidos item en transito');
  }

  verpedidoszf(semana:number){
    ////////////console.log(semana,this.inventarioItemZF);
    let inventarioItemZF = this.inventarioItemZF;
    this.generarListaDocumentos(inventarioItemZF,'Pedidos item en Zona franca');
  }

  generarListaDocumentos(documentos:any, titulo:string,semana?:number){
      //////////console.log(titulo,documentos);

      this.tituloDocumentos = titulo;
      this.listDocumentos=[];
      for(let documento of documentos){
        this.listDocumentos.push({
          titulo,
          docnum:documento.DocNum,
          proveedor:documento.LineVendor,
          fechadoc:documento.FECHANECESIDAD,
          eta:documento.ETA,
          item:this.itemSeleccionado,
          cantidad: documento.TIPO!='Proyectado'?documento.OpenCreQty:documento.Quantity,
          tipo:documento.TIPO,
          cantidadPedida:documento.Quantity,
          U_NF_DATEOFSHIPPING:documento.U_NF_DATEOFSHIPPING,
          U_NF_LASTSHIPPPING:documento.U_NF_LASTSHIPPPING,
          U_NF_MOTONAVE:documento.U_NF_MOTONAVE,
          U_NF_STATUS:documento.U_NF_STATUS,
          CardName:documento.CardName?documento.CardName:'',
          semana,
          linenum:!documento.linenum?0:documento.linenum

        });
      }
      //////////console.log(this.listDocumentos);
      this.verdocumentos = true;
  }

  

  verUbicacionesInventario(ubicaciones:any, titulo:string){
    this.tituloUbicaciones = titulo;
    this.listUbicaciones=[];
    for(let ubicacion of ubicaciones){
      this.listUbicaciones.push({
        INVENTARIO: ubicacion.INVENTARIO,
        ItemCode: ubicacion.ItemCode,
        ItemName: ubicacion.ItemCode+' - '+ubicacion.ItemName,
        WhsCode: ubicacion.WhsCode,
        WhsName: ubicacion.WhsName,
        OnHand: ubicacion.OnHand,
        Location: ubicacion.Location,
        LOCACION: ubicacion.LOCACION,
        State: ubicacion.State,
        PENTRADA: ubicacion.PENTRADA
      });
    }
    //////////console.log(this.listUbicaciones);
    this.verUbicaciones = true;
}

  GuardarProyecciones(){
    if(this.lineasCalculadora.length==0){
      this.messageService.add({severity:'error', summary: '!Error', detail: 'No existen lineas de proyección para el item y zona seleccinada'});
    }else if(this.lineasCalculadora.filter(item =>item.compraProyectadaMP >0 && !item.estadoCompra ).length==0){
      this.messageService.add({severity:'error', summary: '!Error', detail: 'No ha registrado proyecciones de compra a guardar'});
    }else{
      
      //////////console.log(this.lineasCalculadora.filter(item =>item.compraProyectadaMP >0 && !item.estadoCompra ));
      this.fechasycantidades = this.lineasCalculadora.filter(item =>item.compraProyectadaMP >0 && !item.estadoCompra );
      this.resetearFormularioLinea();
      this.formularioLinea= true;
      
    }
  }

  onReject(){
    this.messageService.clear('confirm');
    this.formularioLinea = false;
    this.resetearFormularioLinea();
     this.envioLinea = false;
  }

  async onConfirm(){
    this.messageService.clear('confirm');
    this.loadingSave = true;
     //Recorrer el array de fechasycantidades a registrar
     for await (let item of this.fechasycantidades){
      //llenado de data para registro de la solped
      
      let data:any = {
        solped:  {
          id_user: this.infoUsuario.id,
          usersap: this.infoUsuario.codusersap,
          fullname: this.infoUsuario.fullname,
          serie:this.serie,
          doctype: 'I',
          docdate:new Date(),
          docduedate: new Date(),
          taxdate:new Date(),
          reqdate:item.fechasemana,
          sapdocnum:0,
          u_nf_depen_solped:'VPCADSU2',
          comments:'',
          trm:this.trm,
          currency:this.currency,
          //nf_lastshippping:new Date(),
          //nf_dateofshipping:new Date(),
          nf_agente:'',
          nf_pago:'',
          nf_tipocarga:this.nf_tipocarga,
          nf_puertosalida:'', 
          nf_motonave:'',
          u_nf_status:'Proyectado',
          nf_pedmp:this.nf_pedmp,
          nf_Incoterms:''
         

        },
        solpedDet:[{
          id_solped:0,
          linenum :0,
          id_user:this.infoUsuario.id,
          reqdatedet : item.fechasemana,
          linevendor : this.proveedor.CardCode,
          itemcode : this.item.ItemCode,
          dscription : this.item.ItemName,
          ocrcode3 : this.viceprecidencia,
          ocrcode2 : this.dependencia,
          ocrcode : this.localidad.location,
          whscode : this.almacen!=''?this.almacen.store:'SM_N300',
          acctcode : '',
          acctcodename : '',
          quantity : item.compraProyectadaMP,
          moneda : this.moneda,
          price : 0,
          trm : this.trm,
          linetotal : 0,
          tax : this.item.ApTaxCode,
          taxvalor : 0,
          linegtotal : 0,
          unidad:this.unidad,
          zonacode:this.zona.State
          }]
      }

    
      //Llamar al wbservice de registro de la solped
      ////////////console.log(data);
      this.registrarSolped(data);
      
      //this.messageService.add({severity:'success', summary: '!OK¡', detail: 'Se realizo correctamente el registro de la línea'});
  
      //realizar el proceso de registro de linea
      //this.formularioLinea = false;
    
      //this.resetearFormularioLinea();
      //this.envioLinea = false;
  }

  this.formularioLinea = false;
  this.resetearFormularioLinea();
  this.envioLinea = false;
  this.loadingSave = false;

  }

  registrarSolped(dataSolped:any){
    ////////////console.log(dataSolped);
    this.comprasService.saveSolpedMP(this.authService.getToken(),dataSolped)
            .subscribe({
                next: (result) =>{
                    //////////console.log(result);
                    //this.submittedBotton = true;
                    if(result.status===501){
                      this.messageService.add({severity:'error', summary: '!Error', detail: JSON.stringify(result.err)});
                     
                    }else{
                      this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                      let solpedID = result.solpednum;
                      //Upload files
                      //this.loadFiles(solpedID,dataSolped.anexos);
                     // setTimeout(()=>{this.router.navigate(['portal/compras/solped/tracking']);},1000);
                     ////////////console.log(this.item,dataSolped,dataSolped.solpedDet[0].quantity);
                     ////////////console.log(this.lineasCalculadora.map(data1 =>data1.fechasemana).indexOf(dataSolped.solped.reqdate));
                     
                     let index = this.lineasCalculadora.map(data1 =>data1.fechasemana).indexOf(dataSolped.solped.reqdate);
               
                     ////////////console.log(index,this.lineasCalculadora[index].estadoCompra);

                     this.lineasCalculadora[index].estadoCompra=true;
                     this.inventarioProyectadoMP.push({
                      BaseRef: "",
                      CANCELED:"",
                      CardCode:"",
                      DocCur: "",
                      DocNum: solpedID,
                      DocStatus:"O",
                      ETA: dataSolped.solped.reqdate,
                      FECHANECESIDAD: dataSolped.solped.reqdate,
                      ItemCode: dataSolped.solpedDet[0].itemcode,
                      LineVendor: dataSolped.solpedDet[0].linevendor,
                      OpenCreQty: "",
                      PENTRADA: "",
                      Price:dataSolped.solpedDet[0].price,
                      Quantity: dataSolped.solpedDet[0].quantity,
                      Rate: dataSolped.solpedDet[0].trm,
                      State_Code: dataSolped.solpedDet[0].zonacode,
                      TIPO: dataSolped.solped.u_nf_status,
                      U_NF_AGENTE: dataSolped.solped.nf_agente,
                      U_NF_DATEOFSHIPPING: dataSolped.solped.nf_dateofshipping,
                      U_NF_LASTSHIPPPING: dataSolped.solped.nf_lastshippping,
                      U_NF_MOTONAVE: dataSolped.solped.nf_motonave,
                      U_NF_PEDMP: dataSolped.solped.nf_pedmp,
                      U_NF_PUERTOSALIDA: dataSolped.solped.nf_puertosalida,
                      U_NF_STATUS:dataSolped.solped.u_nf_status,
                      U_NT_Incoterms: dataSolped.solped.nf_Incoterms,
                      WhsCode:dataSolped.solpedDet[0].whscode
                     });
                      
                      
                    }
                },
                error: (err) =>{
                  //////////console.log(err);
                  //this.registroSolped =false;
                }
            });
  }

  async numeroDeSemana(fecha:any):Promise<any>{
    const DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24,
          DIAS_SEMANA = 7,
          JUEVES = 4;

    //let nuevaFecha:Date;
    fecha = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
    let diaDeLaSemana = fecha.getUTCDay(); // Domingo es 0, sábado es 6
    if (diaDeLaSemana === 0) {
        diaDeLaSemana = 7;
    }
    fecha.setUTCDate(fecha.getUTCDate() - diaDeLaSemana + JUEVES);
    const inicioDelAño:any = new Date(Date.UTC(fecha.getUTCFullYear(), 0, 1));
    const diferenciaDeFechasEnMilisegundos = fecha - inicioDelAño;
    return Math.ceil(((diferenciaDeFechasEnMilisegundos / DIA_EN_MILISEGUNDOS) + 1) / DIAS_SEMANA);
  }

  calcularSubtotalLinea(){
    ////////////console.log(this.cantidad,this.precio,this.monedas, this.trm);
    let tasaMoneda = this.monedas.filter(item=>item.Currency === this.moneda)[0].TRM;
    ////////////console.log(tasaMoneda);
    if(!this.cantidad || !this.precio){
      this.subtotalLinea =0;
    }else{
      //this.subtotalLinea = this.cantidad * (this.precio*(tasaMoneda || 0));
      this.subtotalLinea = this.cantidad * (this.precio);
    }
    this.calcularImpuesto(); 
  }

  SeleccionarImpuesto(){
    ////////////console.log(this.impuesto);
    
    if(!this.impuesto){
      this.prcImpuesto = 0;
    }else{
      
      this.prcImpuesto = this.impuesto.tax;
      this.calcularImpuesto();
    }
  }

  calcularImpuesto(){

    if(!this.impuesto.tax || this.subtotalLinea ==0){
      this.valorImpuesto =0;
    }else{
      /////////////console.log("Calcula impuesto")
      this.valorImpuesto =this.subtotalLinea*(this.impuesto.tax/100);
    }
    this.calcularTotalLinea();
  }

  calcularTotalLinea(){
    this.totalLinea = this.subtotalLinea+this.valorImpuesto;
  }

  SeleccionarMoneda(){
    ////////////console.log(this.monedas);
    
    //this.trm= this.monedas.filter(item => item.Currency === this.moneda)[0].TRM;
    this.currency = this.monedas.filter(item => item.Currency === this.moneda)[0].Currency;
    ////////////console.log( "seleccion moneda",this.trm );
    
    this.calcularSubtotalLinea();
  }

  RegistrarLinea(){
    this.envioLinea = true;
    ////////////console.log(this.numeroLinea, this.iteradorLinea);
    if(this.localidad.location && this.almacen ){

      this.messageService.add({key: 'confirm', 
      sticky: true, 
      severity:'warn', 
      summary:'Confirmación de registro de proyección', 
      detail:`¿Esta seguro de realizar el registro de la proyección de compra realizada para el item ${this.itemSeleccionado}?`});
    }else{
        this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar los campos resaltados en rojo'});
    }
  }

  resetearFormularioLinea(){
    //////////////console.log(this.monedas);
    
    this.fechaRequerida = new Date();
    this.proveedor = {CardCode:"PE821401799",CardName:"NITRON GROUP"};
    this.proveedoresFiltrados=[];
    //this.item = {ApTaxCode:"",ItemCode:"",ItemName:""};
    this.itemsFiltrados=[];
    //this.descripcion = "";
    
    
    this.localidad = {codusersap:"",dependence:"",id:0,location:"",vicepresidency:""};
    this.almacen = "";
    
    this.cantidad = 1;
    this.moneda = this.lineasSolped.length>0? this.lineasSolped[0].moneda || 'COP':'USD';
    this.precio =0;
    this.subtotalLinea = 0;
    this.impuesto = "";
    this.prcImpuesto =0;
    this.valorImpuesto =0;
    this.totalLinea =0;
  }

  asignarCamposLinea(linea:number){
            this.lineaSolped = {
            id_solped:0,
            linenum :linea,
            id_user:this.infoUsuario.id,
            reqdatedet : this.fechaRequerida,
            linevendor : this.proveedor.CardCode,
            itemcode : this.item.ItemCode,
            dscription : this.descripcion,
            ocrcode3 : this.viceprecidencia,
            ocrcode2 : this.dependencia,
            ocrcode : this.localidad.location,
            whscode : this.almacen!=''?this.almacen.store:'SM_N300',
            acctcode : '',
            acctcodename : '',
            quantity : this.cantidad,
            moneda : this.moneda,
            price : this.precio,
            trm : this.trm,
            linetotal : this.subtotalLinea,
            tax : this.impuesto.Code,
            taxvalor : this.valorImpuesto,
            linegtotal : this.totalLinea,
            unidad:this.unidad,
            zonacode:this.zonaSeleccionada
            }
            
  }

  filtrarProveedores(event:any){
    let filtered : any[] = [];
      let proveedores:any;
      let query = event.query;
      for(let i = 0; i < this.proveedores.length; i++) {
        proveedores = this.proveedores[i];
           if((proveedores.CardCode.toLowerCase().indexOf(query.toLowerCase())>=0) ||
              (proveedores.CardName.toLowerCase().indexOf(query.toLowerCase())>=0)){
              //////////////console.log(businessPartner);
              filtered.push(proveedores);
           }
      }
      this.proveedoresFiltrados = filtered;
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

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.lineasCalculadora);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `simulacion_${this.itemSeleccionado}_${this.zonaSeleccionada}_${this.fechaactualstr.replace("/","")}_${this.fechaProyeccionstr.replace("/","")}`);
    });
  }  

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
