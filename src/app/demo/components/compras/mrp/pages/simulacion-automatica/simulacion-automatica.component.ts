import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { PermisosUsuario, PerfilesUsuario } from 'src/app/demo/api/decodeToken';
import { InfoUsuario } from 'src/app/demo/api/decodeToken';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-simulacion-automatica',
  providers: [MessageService, ConfirmationService],
  templateUrl: './simulacion-automatica.component.html',
  styleUrls: ['./simulacion-automatica.component.scss'],
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
export class SimulacionAutomaticaComponent implements OnInit  {

  infoUsuario!:InfoUsuario;
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];

  fechaactual:Date = new Date();
  fechaProyeccion:Date = new Date(this.fechaactual.getFullYear(), this.fechaactual.getMonth() + 7, 0);
  items:any[] = [];
  itemsMP:any[] = [];
  zonas:any[] =[];
  zona!:any;

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

  simulacionSinProyeciones:any=[];
  simulacionConProyeciones:any=[];
  simulacionSinTransitoMP:any=[];
  simulacionesSinSolped:any=[];

  lineasCalculadora:any[] = [];
  tolerancia:number =0;
  arregloSimulacionesItemsZonas:any[] =[];
  arregloInvetariosMP:any[] = [];
  arregloInvetariosTracking:any[] = [];
  arregloPresupuestoMPVenta:any[] = [];
  arregloMaxMin:any[] = [];
  iteracion:number = 0;


  displayModal:boolean = false;
  loadingCargue:boolean = false;


  
  constructor(private rutaActiva: ActivatedRoute,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    public authService: AuthService,
    private sapService:SAPService) { }

    ngOnInit(): void {

    
      
  this.displayModal = true;
  this.loadingCargue = true;

      

      this.getItems();

      //this.fechaProyeccion.setMonth(this.fechaactual.getMonth()+4);       
      console.log(this.fechaactual, this.fechaProyeccion)
       //Cargar informacion del usuario
    this.getInfoUsuario();
    //Cargar perfiles del usuario
    this.getPerfilesUsuario();
    //Cargar permisos del usuario
    this.getPermisosUsuario();
    //Cargar permisos usuario pagina
    this.getPermisosUsuarioPagina();

  

    }

    

    getInfoUsuario(){
      this.infoUsuario = this.authService.getInfoUsuario();
      //console.log('getInfoUsuario: ',this.infoUsuario);
      
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
      if(this.rutaActiva.snapshot.params['entrada']){
        let entradaSeleccionada = this.rutaActiva.snapshot.params;
        if(this.router.url.indexOf("/"+entradaSeleccionada['entrada'])>=0){
          url = this.router.url.substring(0,this.router.url.indexOf("/"+entradaSeleccionada['entrada']));
        }
        ////console.log("URL con parametros: ",url);
      }else{
        url= this.router.url;
        ////console.log("URL sin parametros: ",url);
      }
      //this.urlBreadCrumb = url;
      this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===url);
      ////console.log(this.permisosUsuario,this.permisosUsuarioPagina);
    }

    getItems(){
      this.sapService.itemsSAPXE(this.authService.getToken())
          .subscribe({
            next: (items) => {
              for(let item in items){
                //if(items[item].ItemCode!=null && items[item].ItemName!=null){
                this.items.push(items[item]);
                //}
              }
             this.getItemsMP();
             ////console.log(this.items);
             
            },
            error: (error) => {
                ////console.log(error);      
            }
          });
    }
  
    getItemsMP(){
      this.comprasService.getPresupuestosVentaAll(this.authService.getToken())
          .subscribe({
            next: (items) => {
              let ItemName:string;
              for(let item of items){
                ////console.log(item);
                //Obtener items de materia prima de presupuesto de venta
                //Llenar el array de items de MP
                ////console.log(this.itemsMP.filter(itemMP => itemMP.itemcode == item.itemcode).length);
                if(this.itemsMP.filter(itemMP => itemMP.itemcode == item.itemcode).length===0){
                  ////console.log(this.items.filter(itemSAP => itemSAP.ItemCode == item.itemcode ));
                  if(this.items.filter(itemSAP => itemSAP.ItemCode == item.itemcode ).length>0){
                    ItemName = this.items.filter(itemSAP => itemSAP.ItemCode == item.itemcode )[0].ItemName
                    this.itemsMP.push({itemcode:item.itemcode, ItemName});
                  }  
                }
             }
             this.getZonas();
             ////console.log(this.itemsMP);
            },
            error: (error) => {
                ////console.log(error);      
            }
          });
    }
  
    getZonas(){
      this.comprasService.getZonas(this.authService.getToken())
          .subscribe({
              next: (zonas)=>{
                  ////console.log(zonas);
                  this.zonas = zonas;
                  
                  this.correrSimulacion();
              },
              error: (err)=>{
                //console.log(err);
              }
          });
      
    }

    

    async correrSimulacion(){
      
      for await(let lineaItem of this.itemsMP){
          

          for await(let zona of this.zonas){
            /*this.lineasCalculadora =[];
            this.maxMpZona = 0;
            this.minMpZona = 0;
            this.presupuestoMPVenta = [];
            this.inventarioTramsitoMP = [];
            this.inventarioSolicitadoMP = [];
            this.totalInicialMPZF =0;*/    
            //console.log(lineaItem.itemcode,zona.State)
            
            this.getInventariosMP(lineaItem.itemcode,zona.State);
              
              
          }
          
      }

      //console.log(this.arregloSimulacionesItemsZonas.length);
      //this.debouncer.next(this.arregloSimulacionesItemsZonas.length);
  }

  grabarSimulacion(data:any){
    console.log(data);

    this.comprasService.grabarSimulaciones(this.authService.getToken(),data)
        .subscribe({
          next: (result)=>{
           

            this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
            
          },
          error: (err)=>{
              console.log(err);
              this.messageService.add({severity:'error', summary: '!Error', detail: err});
              
          }
        });

  }

  getInventariosMP(item:string, zona:string){

    ////console.log(this.zona);

    let data = {
      item,
      zona
    };
    
    this.comprasService.getInventariosMpXE(this.authService.getToken(),data)
        .subscribe({
            next: (inventarios:any) => {
                //console.log(inventarios);
                let inventariosMP = inventarios;
                this.arregloInvetariosMP.push({item,zona, inventariosMP});
                //this.ubicacionesInventarioMP = inventarios.ubicacionInvetarioMP;
                //this.ubicacionesInventarioPT = inventarios.ubicacionInvetarioPT;
                if(this.iteracion == 0){
                  //console.log(item,zona,'CP',this.arregloInvetariosMP);
                }
                this.getInventariosTracking(item, zona);
                
            },
            error: (err) =>{
                //console.log(err);
                
            }
        });
  }

  getInventariosTracking(item:string, zona:string ){
    ////console.log(this.item);

    let data = {
      item,
      zona,
      fechainicio:this.fechaactual,
      fechafin:this.fechaProyeccion
    };
      this.comprasService.getInventariosTracking(this.authService.getToken(),data)
          .subscribe({
              next: (inventarios:any) => {
                  //console.log(inventarios);
                  let inventarioTramsitoMP:any = inventarios.inventarioItemTransito;
                  //console.log(inventarioTramsitoMP);
                  
                  let inventarioSolicitadoMP:any = inventarios.inventarioItenSolicitado;
                  //console.log(inventarioSolicitadoMP);
                  
                  let inventarioTramsitoMPPreFecha:any = inventarios.inventarioItemTransitoPreFecha;
                  //console.log(inventarioTramsitoMPPreFecha);

                  let inventarioSolicitadoMPPreFecha:any = inventarios.inventarioItenSolicitadoPreFecha;
                  //console.log(inventarioSolicitadoMPPreFecha);

                  let inventarioProyectadoMP:any = inventarios.comprasProyectadasMP;
                  //console.log(inventarioProyectadoMP);

                  let inventarioItemZF:any = inventarios.inventarioItemZF;
                  //console.log(inventarioItemZF);

                  let totalInicialMPZF = inventarios.totalInventarioItemZF;

                  this.arregloInvetariosTracking.push({item,
                                                 zona, 
                                                 inventarioTramsitoMP, 
                                                 inventarioSolicitadoMP, 
                                                 inventarioTramsitoMPPreFecha, 
                                                 inventarioSolicitadoMPPreFecha, 
                                                 inventarioProyectadoMP, 
                                                 inventarioItemZF, 
                                                 totalInicialMPZF});
                  if(this.iteracion == 0){
                      //console.log(this.arregloInvetariosTracking);
                  }

                  this.gePresupuestoItemZona(item, zona);
                  
                
              },
              error: (error) => {
                  //console.log(error);
              }
          });
  }

  async gePresupuestoItemZona(item:string, zona:string ){
    
    let fechaInicioSemana = await this.fechaInicioSemana(new Date(this.fechaactual));
    //console.log('Presupuesto');
    let data = {
      item,
      zona,
      fechainicio:fechaInicioSemana,
      //fechainicio:this.fechaactual,
      fechafin:this.fechaProyeccion
    };

    this. comprasService.getPresupuestosVenta(this.authService.getToken(), data)
        .subscribe({
            next: (result) =>{
                //console.log('presupuesto',result);
                let presupuestoMPVenta = result;
                this.arregloPresupuestoMPVenta.push({item, 
                                                     zona,
                                                     presupuestoMPVenta })
                if(this.iteracion == 0){
                    //console.log(item,zona,'CP',this.arregloPresupuestoMPVenta);
                }
                this.getMaxMinItemZona(item, zona);
                
            },
            error: (err) =>{
              //console.log(err);
            }
        });
  }
  

  getMaxMinItemZona(item:string, zona:string){
    let data = {
      item,
      zona,
    };

    this.comprasService.getMaxMinItemZona(this.authService.getToken(), data)
        .subscribe({
            next: async (result) =>{
                ////console.log(result);
                let maxMpZona = 0;
                let minMpZona = 0;
                if(result.length >0){
                   maxMpZona = result[0].maximo;
                   minMpZona = result[0].minimo;
                }
                this.arregloMaxMin.push({item, 
                                         zona,
                                         maxMpZona,
                                         minMpZona});
                //console.log(item,zona,'CP');

                if(this.iteracion == 0){
                  //console.log(item,zona,'CP',this.arregloMaxMin);
                }

                this.iteracion++;
                let simulacionConProyeciones = await this.calcularLineas(item,zona,'CP');
                let simulacionSinProyeciones = await this.calcularLineas(item,zona,'SP');
                let simulacionSinTransitoMP =  await this.calcularLineas(item,zona,'ST');
                let simulacionSinSolped =  await this.calcularLineas(item,zona,'SS');
        

                await this.grabarSimulacion({item,
                  zona,
                  simulacionConProyeciones,
                  simulacionSinProyeciones,
                  simulacionSinTransitoMP,
                  simulacionSinSolped
                });
                
                
                
            },
            error: (err) =>{
              //console.log(err);
            }
        });
  }

  fechaInicioSemana(fecha:Date):Date{
    let fechaTMP:Date = new Date(fecha);
    let diaDeLaSemana = fecha.getUTCDay()==0?1:fecha.getUTCDay();
    let numeroDiasRestar = diaDeLaSemana-1;
    fechaTMP.setDate(fecha.getDate()-numeroDiasRestar);

    

    ////console.log(fecha, diaDeLaSemana,fecha.getDate(),numeroDiasRestar,fechaTMP);
    return fechaTMP;
  }


    async calcularLineas(item:string,zona:string,tipo:string){
          this.simulacionConProyeciones=[];
          let lineasCalculadora:any[] =[];
          let maxMpZona = this.arregloMaxMin.filter(itemMaxMin => itemMaxMin.item == item && itemMaxMin.zona == zona)[0].maxMpZona;
          let minMpZona = this.arregloMaxMin.filter(itemMaxMin => itemMaxMin.item == item && itemMaxMin.zona == zona)[0].minMpZona;
          let fechaInicioCalculadora = new Date(this.fechaactual) ;
          let fechaFinalCalculadora = new Date(this.fechaProyeccion) ;
          let semanaFecha:any;
          let fechasemana:Date;
          let semanaMes:string='';
          let inventarioSemanaMP:number= this.getInventarioInicial('MP',item,zona);
          let inventarioSemanaPT:number= this.getInventarioInicial('PT',item,zona);
          let inventarioSemanaMPZF:number= this.arregloInvetariosTracking.filter(itemTR => itemTR.item == item && itemTR.zona == zona)[0].totalInicialMPZF;
          let inventarioSemanaMPTR:number=0;
          let compraSolicitadaMP:number = 0;
          let compraProyectadaMP:number=0;
          let presupuestoVentaMP:number=0;
          let inventarioFinalSemanaMP:number=0;
          let inventarioTransitoProxima:number=0;
          let compraSolicitadaProximaSemana:number = 0;
          let compraProyectadaProximaSemana:number=0;
          let presupuestoProximaSemana:number=0;
          let inventarioFinalProximaSemana:number=0;
          let necesidadCompra:string="";
          let cantidadCompraSugerida:number = 0;
          let inventarioFinalSemanaSugerido:number = 0;
          let estadoCompra:boolean = false;
          let inventarioSolicitadoMPPreFecha:number = this.calcularComprasSolicitadasPreFecha(item,zona);
          let inventarioTramsitoMPPreFecha:number = this.calcularInventarioTRPreFecha(item,zona);
  
          let lineaid:number =0;
          let infoLinea:any;
          let infoLineaSimulacion:any;
          for(;fechaInicioCalculadora<=fechaFinalCalculadora; fechaInicioCalculadora.setDate(fechaInicioCalculadora.getDate()+1)){
              ////console.log(this.zonas.filter(zonamp =>zonamp.State == zona));
              semanaFecha = this.numeroDeSemana(fechaInicioCalculadora);
              fechasemana = fechaInicioCalculadora;
              //fechasemana = this.fechaInicioSemana(fechaInicioCalculadora);
              if(lineasCalculadora.filter(item => item.semana == semanaFecha).length==0 ){
               semanaMes = await this.semanaDelMes(new Date(fechaInicioCalculadora));
               //semanaMes =''; 
                inventarioSemanaMPTR = tipo=='ST'?0:(await this.calcularInventarioSemanaTR(semanaFecha,item,zona))+inventarioTramsitoMPPreFecha;
                  compraSolicitadaMP = tipo=='ST' || tipo=='SS'?0:(await this.calcularComprasSolicitadasSemana(semanaFecha,item,zona))+inventarioSolicitadoMPPreFecha;
                compraProyectadaMP = tipo=='SP' || tipo=='ST' || tipo=='SS'?0:await this.calcularComprasProyectadasSemana(semanaFecha,item,zona);
                presupuestoVentaMP = await this.calcularPresupuestoSemana(semanaFecha,item,zona);

              

                inventarioFinalSemanaMP = inventarioSemanaMP+inventarioSemanaPT+inventarioSemanaMPZF+inventarioSemanaMPTR+compraSolicitadaMP+compraProyectadaMP-presupuestoVentaMP;
                
                inventarioFinalSemanaMP = inventarioFinalSemanaMP<0?0:inventarioFinalSemanaMP;
                estadoCompra = compraProyectadaMP==0?false:true;
                //proxima semana
                inventarioTransitoProxima = await this.calcularInventarioSemanaTR((semanaFecha+1),item,zona);
                compraSolicitadaProximaSemana = await this.calcularComprasSolicitadasSemana((semanaFecha+1),item,zona);
                compraProyectadaProximaSemana = await this.calcularComprasProyectadasSemana((semanaFecha+1),item,zona);
                presupuestoProximaSemana = await this.calcularPresupuestoSemana((eval(semanaFecha)+1),item,zona);
                inventarioFinalProximaSemana = inventarioFinalSemanaMP+inventarioTransitoProxima+compraSolicitadaProximaSemana+compraProyectadaProximaSemana-presupuestoProximaSemana;
                necesidadCompra = inventarioFinalProximaSemana<minMpZona?'Si':'No';
                cantidadCompraSugerida = necesidadCompra=='Si'?(eval(maxMpZona)-inventarioFinalSemanaMP):0;
                inventarioFinalSemanaSugerido = inventarioFinalSemanaMP+cantidadCompraSugerida;
                ////console.log(semanaFecha,presupuestoProximaSemana,inventarioFinalProximaSemana,necesidadCompra)
                ////console.log(`Para ${fechaInicioCalculadora} el número de semana es ${semanaFecha} `);
                infoLinea = {
                  lineaid,
                  fechasemana:this.fechaInicioSemana(new Date(fechasemana)),
                  semana: semanaFecha,
                  semanaMes,
                  numeroSemanaMes:semanaMes.substring(0,1),
                  itemSeleccionado:item +' - '+this.itemsMP.filter(itemMP => itemMP.itemcode == item)[0].ItemName,
                  zonaSeleccionada:this.zonas.filter(zonamp =>zonamp.State == zona)[0].PENTRADA,
                  inventarioSemanaMP,
                  inventarioSemanaPT,
                  inventarioSemanaMPZF,
                  inventarioSemanaMPTR,
                  compraSolicitadaMP,
                  compraProyectadaMP,
                  presupuestoVentaMP,
                  presupuestoVentaMPOriginal:presupuestoVentaMP,
                  inventarioFinalSemanaMP,
                  estadoCompra,
                  necesidadCompra,
                  cantidadCompraSugerida,
                  inventarioFinalSemanaSugerido,
                  classCantidad:inventarioFinalSemanaMP<minMpZona?'c-min-stock':inventarioFinalSemanaMP>maxMpZona?'c-max-stock':''
                }
  
                infoLineaSimulacion ={
                  itemcode:item,
                  codigozona:zona,
                  itemname:this.itemsMP.filter(itemMP => itemMP.itemcode == item)[0].ItemName,
                  zona:this.zonas.filter(zonamp =>zonamp.State == zona)[0].PENTRADA,
                  fecha:this.fechaInicioSemana(new Date(fechasemana)),
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
                  tipo,
                  tolerancia:this.tolerancia,
                  bodega:zona=='900'?'AD_SANTA':'AD_BVTA'
  
                }
  
                //this.simulacionConProyeciones.push(infoLineaSimulacion);
                ////console.log(semanaFecha,fechaInicioCalculadora);
                ////console.log(semanaFecha,inventarioSemanaMP,inventarioSemanaPT,inventarioSemanaMPZF,inventarioSemanaMPTR,compraSolicitadaMP,compraProyectadaMP,estadoCompra);
                //Calcular inventario inicial siguiente semana
                inventarioSemanaMP = inventarioFinalSemanaMP>0?inventarioFinalSemanaMP:0;
                inventarioSemanaPT = 0;
                inventarioSemanaMPZF = 0;
                inventarioSolicitadoMPPreFecha = 0;
                inventarioTramsitoMPPreFecha = 0;
  
                lineasCalculadora.push(infoLineaSimulacion);
                ////console.log(infoLinea);
                //this.lineasCalculadora = lineasCalculadora;
                lineaid++;
  
              }
          }
          ////console.log(this.lineasCalculadora);
          //this.simulacionConProyeciones=this.lineasCalculadora;
          return  lineasCalculadora;
          
    }

    async simulacionSinProyeccion(item:string,zona:string){
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
    
      ////console.log(this.lineasCalculadora.length);
     
      for (let linea of this.lineasCalculadora){
    
        ////console.log(linea);
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
        ////console.log(lineaid,semana,inventarioSemanaMP,inventarioSemanaPT,inventarioSemanaMPTR,compraProyectadaMP,presupuestoVentaMP,inventarioFinalSemanaMP);
    
        //proxima semana
        inventarioTransitoProxima =lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].inventarioSemanaMPTR:0;
        compraSolicitadaProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].compraSolicitadaMP:0;
        compraProyectadaProximaSemana = 0;
        presupuestoProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].presupuestoVentaMP:0;
        inventarioFinalProximaSemana = inventarioFinalSemanaMP+inventarioTransitoProxima+compraSolicitadaProximaSemana+compraProyectadaProximaSemana-presupuestoProximaSemana;
        necesidadCompra = inventarioFinalProximaSemana<this.minMpZona?'Si':'No';
        cantidadCompraSugerida = necesidadCompra=='Si'?(eval(this.maxMpZona)-inventarioFinalSemanaMP):0;
        inventarioFinalSemanaSugerido = inventarioFinalSemanaMP+cantidadCompraSugerida;
        ////console.log(presupuestoProximaSemana,inventarioFinalProximaSemana,necesidadCompra)
    
        infoLineaSimulacion ={
          itemcode:item,
          codigozona:zona,
          itemname:this.itemsMP.filter(itemMP => itemMP.itemcode == item)[0].ItemName,
          zona:this.zonas.filter(zonamp =>zonamp.State == zona)[0].PENTRADA,
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
          bodega:zona=='900'?'AD_SANTA':'AD_BVTA'
    
        }
    
    
        ////console.log(semana,linea.fechasemana);
        //lineasRecalculo.push(infoLinea);
        lineasRecalculoSimulacionSP.push(infoLineaSimulacion);
        //Calcular inventario inicial siguiente semana
        //inventarioSemanaMP = inventarioFinalSemanaMP;
        lineaid++;
      }
      ////console.log(lineaid);
      //this.lineasCalculadora = lineasRecalculo;
      this.simulacionSinProyeciones = lineasRecalculoSimulacionSP;
    }

    async simulacionSinSolped(item:string,zona:string){
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
    
      ////console.log(this.lineasCalculadora.length);
     
      for (let linea of this.lineasCalculadora){
    
        ////console.log(linea);
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
        ////console.log(lineaid,semana,inventarioSemanaMP,inventarioSemanaPT,inventarioSemanaMPTR,compraProyectadaMP,presupuestoVentaMP,inventarioFinalSemanaMP);
    
        //proxima semana
        inventarioTransitoProxima =lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].inventarioSemanaMPTR:0;
        compraSolicitadaProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].compraSolicitadaMP:0;
        compraProyectadaProximaSemana = 0;
        presupuestoProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].presupuestoVentaMP:0;
        inventarioFinalProximaSemana = inventarioFinalSemanaMP+inventarioTransitoProxima+compraSolicitadaProximaSemana+compraProyectadaProximaSemana-presupuestoProximaSemana;
        necesidadCompra = inventarioFinalProximaSemana<this.minMpZona?'Si':'No';
        cantidadCompraSugerida = necesidadCompra=='Si'?(eval(this.maxMpZona)-inventarioFinalSemanaMP):0;
        inventarioFinalSemanaSugerido = inventarioFinalSemanaMP+cantidadCompraSugerida;
        ////console.log(presupuestoProximaSemana,inventarioFinalProximaSemana,necesidadCompra)
    
        infoLineaSimulacion ={
          itemcode:item,
          codigozona:zona,
          itemname:this.itemsMP.filter(itemMP => itemMP.itemcode == item)[0].ItemName,
          zona:this.zonas.filter(zonamp =>zonamp.State == zona)[0].PENTRADA,
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
          bodega:zona=='900'?'AD_SANTA':'AD_BVTA'
    
        }
    
    
        ////console.log(semana,linea.fechasemana);
        //lineasRecalculo.push(infoLinea);
        lineasRecalculoSimulacionSS.push(infoLineaSimulacion);
        //Calcular inventario inicial siguiente semana
        //inventarioSemanaMP = inventarioFinalSemanaMP;
        lineaid++;
      }
      ////console.log(lineaid);
      //this.lineasCalculadora = lineasRecalculo;
      this.simulacionesSinSolped = lineasRecalculoSimulacionSS;
    }
    
    async simulacionSinTransito(item:string,zona:string){
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
    
      ////console.log(this.lineasCalculadora.length);
     
      for (let linea of this.lineasCalculadora){
    
        ////console.log(linea);
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
        ////console.log(lineaid,semana,inventarioSemanaMP,inventarioSemanaPT,inventarioSemanaMPTR,compraProyectadaMP,presupuestoVentaMP,inventarioFinalSemanaMP);
    
        //proxima semana
        inventarioTransitoProxima =lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].inventarioSemanaMPTR:0;
        compraSolicitadaProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].compraSolicitadaMP:0;
        compraProyectadaProximaSemana = 0;
        presupuestoProximaSemana = lineaid<this.lineasCalculadora.length-1?this.lineasCalculadora[lineaid+1].presupuestoVentaMP:0;
        inventarioFinalProximaSemana = inventarioFinalSemanaMP+inventarioTransitoProxima+compraSolicitadaProximaSemana+compraProyectadaProximaSemana-presupuestoProximaSemana;
        necesidadCompra = inventarioFinalProximaSemana<this.minMpZona?'Si':'No';
        cantidadCompraSugerida = necesidadCompra=='Si'?(eval(this.maxMpZona)-inventarioFinalSemanaMP):0;
        inventarioFinalSemanaSugerido = inventarioFinalSemanaMP+cantidadCompraSugerida;
        ////console.log(presupuestoProximaSemana,inventarioFinalProximaSemana,necesidadCompra)
    
        infoLineaSimulacion ={
          itemcode:item,
          codigozona:zona,
          itemname:this.itemsMP.filter(itemMP => itemMP.itemcode == item)[0].ItemName,
          zona:this.zonas.filter(zonamp =>zonamp.State == zona)[0].PENTRADA,
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
          bodega:zona=='900'?'AD_SANTA':'AD_BVTA'
    
        }
    
    
        ////console.log(semana,linea.fechasemana);
        //lineasRecalculo.push(infoLinea);
        lineasRecalculoSinTransito.push(infoLineaSimulacion);
        //Calcular inventario inicial siguiente semana
        //inventarioSemanaMP = inventarioFinalSemanaMP;
        lineaid++;
      }
      ////console.log(lineaid);
      //this.lineasCalculadora = lineasRecalculo;
      this.simulacionSinTransitoMP = lineasRecalculoSinTransito;
    }
    

    getInventarioInicial(tipoInv:string,item:any,zona:any):number{  

      let inventarioInicial:number =0; 
      let inventariosMP = this.arregloInvetariosMP.filter(itemMP => itemMP.item == item && itemMP.zona == zona);

      
      
      if(tipoInv ==='MP' && inventariosMP.length>0){
        inventarioInicial = inventariosMP[0].inventariosMP.inventarioMP;
      }
      if(tipoInv ==='PT' && inventariosMP.length>0){
        inventarioInicial = inventariosMP[0].inventariosMP.inventarioPT;
      }
  
      return inventarioInicial;
  
    }
  
    calcularComprasSolicitadasPreFecha(item:any,zona:any):number{
      let compraSolicitadaMP:number=0;
      //if(this.inventarioSolicitadoMPPreFecha.length >0 && this.inventarioSolicitadoMPPreFecha.filter(item => this.numeroDeSemana(new Date(item.FECHANECESIDAD)) ==  semanaFecha).length>0 ){
        //console.log(this.arregloInvetariosTracking.filter(itemTR => itemTR.item == item && itemTR.zona == zona));
        let filas =  this.arregloInvetariosTracking.filter(itemTR => itemTR.item == item && itemTR.zona == zona).length>0?this.arregloInvetariosTracking.filter(itemTR => itemTR.item == item && itemTR.zona == zona)[0].inventarioSolicitadoMPPreFecha:[];
        ////console.log(semanaFecha,filas);
        for(let fila of filas){
          
          //compraSolicitadaMP = compraSolicitadaMP+eval(fila.Quantity);
          compraSolicitadaMP = compraSolicitadaMP+eval(fila.OpenCreQty);
        }
      //}
      return compraSolicitadaMP;
    }

    calcularInventarioTRPreFecha(item:any, zona:any):number{
      let inventarioSemanaMPTR:number=0;
      //if(this.inventarioTramsitoMPPreFecha.length >0 && this.inventarioTramsitoMPPreFecha.filter((item: { ETA: string | number | Date; }) => this.numeroDeSemana(new Date(item.ETA)) ==  semanaFecha).length>0 ){
      //.filter((item: { ETA: string | number | Date; }) => this.numeroDeSemana(new Date(item.ETA)) ==  semanaFecha);  
      let filas = this.arregloInvetariosTracking.filter(itemTR => itemTR.item == item && itemTR.zona == zona).length>0?this.arregloInvetariosTracking.filter(itemTR => itemTR.item == item && itemTR.zona == zona)[0].inventarioTramsitoMPPreFecha:[];
        for(let fila of filas){
          inventarioSemanaMPTR = inventarioSemanaMPTR+eval(fila.OpenCreQty);
        }
      //}
      return inventarioSemanaMPTR;
    }

    numeroDeSemana(fecha:any){
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

    async semanaDelMes(fecha:Date):Promise<string>{
      let semanaMes:string ='';
      
      //let fechaInicioSemana = await this.fechaInicioSemana(new Date(fecha));
      let fechaInicioSemana = ((fecha));
      fechaInicioSemana.setHours(0,0,0);
      //console.log('Inicio semana',fechaInicioSemana);
      //let siguienteMes = await this.siguienteMes(new Date(fecha));
      let siguienteMes = await this.siguienteMes((fecha));
      siguienteMes.setHours(0,0,0);
      //console.log('Siguiente mes',siguienteMes);
  
      let fechaInicioSemanaSiguienteMes = await this.fechaInicioSemana((siguienteMes));
      fechaInicioSemanaSiguienteMes.setHours(0,0,0);
      //console.log('fecha Inicio Semana Siguiente mes',fechaInicioSemanaSiguienteMes);
      //await console.log(fechaInicioSemana.getFullYear(),fechaInicioSemanaSiguienteMes.getFullYear(),fechaInicioSemana.getMonth(),fechaInicioSemanaSiguienteMes.getMonth(),fechaInicioSemana.getDate(),fechaInicioSemanaSiguienteMes.getDate());
  
      
      let diaDelMes = fechaInicioSemana.getDate();
      let diaFecha = fechaInicioSemana.getDay();
  
      
      let weekOfMonth = Math.ceil((diaDelMes - 1 - diaFecha) / 7);
      ////console.log(`${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`,weekOfMonth+1);
      let mesStr = this.mesesAnio.filter(mes =>mes.mes === (fechaInicioSemana.getMonth()+1))[0].mesStr.substring(0,3).toUpperCase();
      
      if(fechaInicioSemana.getFullYear()===fechaInicioSemanaSiguienteMes.getFullYear() && fechaInicioSemana.getMonth() === fechaInicioSemanaSiguienteMes.getMonth() && fechaInicioSemana.getDate()===fechaInicioSemanaSiguienteMes.getDate()){
        weekOfMonth = 0;
        mesStr = this.mesesAnio.filter(mes =>mes.mes === (siguienteMes.getMonth()+1))[0].mesStr.substring(0,3).toUpperCase();
      }
  
      semanaMes = `${(weekOfMonth+1)}S - ${mesStr}`;
  
      return semanaMes;
    }

    siguienteMes(fecha:Date){
      ////console.log(fecha,fecha.getFullYear(),fecha.getMonth());
  
      let anioMesSiguiente:number = fecha.getMonth()==11?fecha.getFullYear()+1:fecha.getFullYear();
      let mesMesSiguiente:number = fecha.getMonth()==11?0:fecha.getMonth()+1;
      ////console.log('año',anioMesSiguiente,'mes',mesMesSiguiente);
      let fechaInicioMesSiguiente = new Date(anioMesSiguiente, mesMesSiguiente,1);
  
      return fechaInicioMesSiguiente;
    }

    calcularInventarioSemanaTR(semanaFecha:number,item:any,zona:any):number{
      let inventarioSemanaMPTR:number=0;
      let inventarioTramsitoMP = this.arregloInvetariosTracking.filter(itemTR =>itemTR.item == item && itemTR.zona == zona).length>0?this.arregloInvetariosTracking.filter(itemTR =>itemTR.item == item && itemTR.zona == zona)[0].inventarioTramsitoMP:[];
      if(inventarioTramsitoMP.length >0 && inventarioTramsitoMP.filter((itemTMP: { ETA: any; }) => this.numeroDeSemana(new Date(itemTMP.ETA)) ==  semanaFecha).length>0 ){
        let filas = inventarioTramsitoMP.filter((itemTMP: { ETA: any; }) => this.numeroDeSemana(new Date(itemTMP.ETA)) ==  semanaFecha);
        for(let fila of filas){
          //inventarioSemanaMPTR = inventarioSemanaMPTR+eval(fila.Quantity);
          inventarioSemanaMPTR = inventarioSemanaMPTR+eval(fila.OpenCreQty);
        }
      }
      return inventarioSemanaMPTR;
    }

    calcularComprasSolicitadasSemana(semanaFecha:number,item:any,zona:any):number{
      let compraSolicitadaMP:number=0;
      let inventarioSolicitadoMP = this.arregloInvetariosTracking.filter(itemTR => itemTR.item == item && itemTR.zona == zona).length>0?this.arregloInvetariosTracking.filter(itemTR => itemTR.item == item && itemTR.zona == zona)[0].inventarioSolicitadoMP:[];

      if(inventarioSolicitadoMP.length >0 && inventarioSolicitadoMP.filter((itemSMP:{FECHANECESIDAD:any}) => this.numeroDeSemana(new Date(itemSMP.FECHANECESIDAD)) ==  semanaFecha).length>0 ){
        let filas = inventarioSolicitadoMP.filter((itemSMP:{FECHANECESIDAD:any}) => this.numeroDeSemana(new Date(itemSMP.FECHANECESIDAD)) ==  semanaFecha);
        //console.log(semanaFecha,filas);
        for(let fila of filas){
          
          //compraSolicitadaMP = compraSolicitadaMP+eval(fila.Quantity);
          compraSolicitadaMP = compraSolicitadaMP+eval(fila.OpenCreQty);
        }
      }
      return compraSolicitadaMP;
    }

    calcularComprasProyectadasSemana(semanaFecha:number,item:any,zona:any):number{
      let compraProyectadaMP:number=0;
      let inventarioProyectadoMP = this.arregloInvetariosTracking.filter(itemTR=>itemTR.item == item && itemTR.zona == zona)[0].inventarioProyectadoMP;

      if(inventarioProyectadoMP.length >0 && inventarioProyectadoMP.filter((itemPMP:{FECHANECESIDAD:any}) => this.numeroDeSemana(new Date(itemPMP.FECHANECESIDAD)) ==  semanaFecha).length>0 ){
        let filas = inventarioProyectadoMP.filter((itemPMP:{FECHANECESIDAD:any}) => this.numeroDeSemana(new Date(itemPMP.FECHANECESIDAD)) ==  semanaFecha);
        ////console.log(semanaFecha,filas);
        for(let fila of filas){
          
          compraProyectadaMP = compraProyectadaMP+eval(fila.Quantity);
        }
      }
      return compraProyectadaMP;
    }
  
    calcularPresupuestoSemana(semanaFecha:number,item:any,zona:any):number{
      let presupuestoVentaMP:number=0;
      let presupuestoMPVenta = this.arregloPresupuestoMPVenta.filter(itemPMPV => itemPMPV.item == item && itemPMPV.zona == zona).length>0?this.arregloPresupuestoMPVenta.filter(itemPMPV => itemPMPV.item == item && itemPMPV.zona == zona)[0].presupuestoMPVenta:[];

      if(presupuestoMPVenta.length >0 && presupuestoMPVenta.filter((itemPMPV: { semana: number; }) => itemPMPV.semana ==  semanaFecha).length>0 ){
        let filas = presupuestoMPVenta.filter((itemPMPV: { semana: number; }) => itemPMPV.semana ==  semanaFecha);
        ////console.log(filas);
        for(let fila of filas){
          presupuestoVentaMP = presupuestoVentaMP+eval(fila.cantidad);
        }
      }
      return presupuestoVentaMP;
    }
  
}
