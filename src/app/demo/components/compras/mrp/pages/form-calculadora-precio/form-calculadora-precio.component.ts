import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { filter,  lastValueFrom, Subject } from 'rxjs';
import { InfoUsuario, PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';
import * as FileSaver from 'file-saver';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-form-calculadora-precio',
  providers: [MessageService, ConfirmationService, DialogService],
  templateUrl: './form-calculadora-precio.component.html',
  styleUrls: ['./form-calculadora-precio.component.scss']
})
export class FormCalculadoraPrecioComponent implements OnInit {


  @ViewChild('filter') filter!: ElementRef;


  idCalculo!:any;
  permisosUsuario!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  permisosPerfilesPagina!:PermisosUsuario[];
  perfilesUsuario!:PerfilesUsuario[];
  urlBreadCrumb:string ="";
  infoUsuario!:InfoUsuario;

  displayModal:boolean = false;
  loadingCargue:boolean = false;
  editarCalculo:boolean = false;

  envioForm:boolean = false;


  items:any[] = [];
  item!:any;
  itemsFiltrados:any[] = [];

  monedas:any[] =[];
  moneda:any;
  trm_dia:number =0;
  trm_moneda:number =0;
  zonas:any[] = [];
  parametros:any[] = [];
  promedios_localidad:any[] = [];
  costos_localidad:any[] = [];
  presentacion_items:any[] = [];

  preciosListaItem:any[] = [];
  checkPreciosListaItem:boolean = false;
  preciosMPItemUltimasSemanas:any[] = [];
  checkPreciosMPItemUltimasSemanas:boolean = false;
  precioMercadoItemSemana:any[] = []
  checkPrecioMercadoItemSemana:boolean = false;
  checkItemsMPbyItemPT:boolean = false;

  fecha:Date = new Date();
  
  semanaAnio:number = 0;
  semanaMes:string = "";
  observacion:string ="";

  precioVendedor:number =0;
  precioGerente:number =0;
  precioLista:number =0;

  precioPromedioMercadoPT:number =0;
  precioVentaSAPPT:number = 0;

  detalle_receta:any[] = [];

  totalEmpaque:number =0;
  totalMPsemana0:number =0;
  totalMPsemana1:number =0;
  totalMPsemana2:number =0;

  costoVentaPTsemana0:number =0;
  costoVentaPTsemana1:number =0;
  costoVentaPTsemana2:number =0;

  costoTotalPTsemana0:number =0;
  costoTotalPTsemana1:number =0;
  costoTotalPTsemana2:number =0;

  totalCostoPTSAP:number =0;
  costoVentaPTSAP:number =0;
  costoTotalPTSAP:number =0;


  precioBaseCalculo:number =0;
  precioBaseCalculo2:number = 0;

  tablaCalculadora:any[] =[];
  tablaCalculadoraCostos:any[] =[];

  opcionesPrecioBase:any[] = [
    {
      code:'LPGERENTE',
      name:'Precio Gerente',
      label:'Precio Gerente'
    },
    {
      code:'LPVENDEDOR',
      name:'Precio Vendedor',
      label:'Precio Vendedor'
    },
    {
      code:'LP',
      name:'Precio Lista',
      label:'Precio Lista'
    },
];

precioBase!:any;

prcGerente:number =0;
prcLPrecio:number =0;

recursoPT:number =0;
administracion:number =0;
cambioPrecioGerenteDB:Subject<number> = new Subject(); 
cambioPrcGerenteDB:Subject<number> = new Subject(); 

cambioPrecioLPDB:Subject<number> = new Subject(); 
cambioPrcLPDB:Subject<number> = new Subject(); 

formDetalleCalculo:boolean = false;

formParametrosG:boolean = false;

envioFormParametrosG:boolean = false;

diasInteres:number =0;

prcInteres:number =0;

precioEntrega:number = 0;

  mesesAnio:any[] = [ {mes:1, mesStr:'Enero'},
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


  constructor(private rutaActiva: ActivatedRoute,
    private adminService:AdminService,
    private sapService:SAPService,
    private comprasService:ComprasService,
    private router:Router,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    public authService: AuthService,
    public dialogService: DialogService,) { }


  async ngOnInit(): Promise<void> {

    //console.log(this.fecha);
    
    this.infoUsuario = this.authService.getInfoUsuario();
     
    ////////////console.logthis.authService.getPerfilesUsuario());
    this.perfilesUsuario = this.authService.getPerfilesUsuario();

    ////////////console.logthis.router.url);
    ////////////console.logthis.authService.getPermisosUsuario());
    this.permisosUsuario = this.authService.getPermisosUsuario();
    ////////////console.log'Permisos pagina',this.permisosUsuario.filter(item => item.url===this.router.url));
    //this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===this.router.url);

    this.permisosPerfilesPagina = this.permisosUsuario.filter(item => item.url===this.router.url); 
     

     this.permisosUsuarioPagina =  this.authService.permisosPagina(this.permisosPerfilesPagina);
    this.urlBreadCrumb = this.router.url;

   

    this.getConfigCalculadora();

    this.semanaAnio = await this.numeroDeSemana(new Date());
    this.semanaMes = await this.semanaDelMes(new Date());

    this.precioBase = this.opcionesPrecioBase.filter(precioBase => precioBase.code ==='LPGERENTE')[0];
    ////////console.log(this.precioBase);

    this.cambioPrecioGerenteDB
    .pipe(debounceTime(300))
    .subscribe( value =>{
      //////console.log('debouncerG: ',value);

      let event = {value}
      this.cambioPrecioGerente(event);
    });

    this.cambioPrcGerenteDB
    .pipe(debounceTime(300))
    .subscribe( value =>{
      //////console.log('debouncerG: ',value);

      let event = {value}
      this.cambioPrcGerente(event);
    });

    this.cambioPrcLPDB
    .pipe(debounceTime(300))
    .subscribe( value =>{
      //////console.log('debouncerLP: ',value);

      let event = {value}
      this.cambioPrcLP(event);
    });

    this.cambioPrecioLPDB
    .pipe(debounceTime(300))
    .subscribe( value =>{
      //////console.log('debouncerLP: ',value);

      let event = {value}
      this.cambioPrecioLP(event);
    });

    

  }


  

  getConfigCalculadora(){
    this.comprasService.getConfigCalculadora(this.authService.getToken())
    //this.authService.getDependeciasUsuarioXE()
    .subscribe({
      next: async (config:any) => {
        //////console.log(config);

        await this.getItems(config.items);
        //await this.getCuentas(configSolped.cuentas);
        await this.getMonedasMysql(config.monedas);
        await this.getZonas(config.zonas);
        await this.getParametros(config.parametros_calculadora_precio);
        await this.getPromediosLocalidades(config.tabla_promedios_localidad);
        await this.getCostosLocalidades(config.tabla_costos_localidad);
        await this.getPresentacionItems(config.tabla_presentacion_items);
        //this.getInformacionSolped();
        
        if(Object.keys(this.rutaActiva.snapshot.params).length >0){
          ////console.log(this.rutaActiva.snapshot.params);
          this.idCalculo = this.rutaActiva.snapshot.params;
          this.editarCalculo = true;
          this.getInfoCalculoItem(this.idCalculo);

        }

        //console.log(this.editarCalculo);

      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  async  getMonedasMysql(monedas:any){
 
    for(let item in monedas){
       this.monedas.push({
         Currency:monedas[item].Code,
         TRM:monedas[item].TRM,
       });
    }

    
    this.trm_dia = this.monedas.find(moneda=>moneda.Currency=='USD').TRM;
    this.moneda = this.monedas.find(moneda=>moneda.Currency=='COP');
    this.trm_moneda = this.monedas.find(moneda=>moneda.Currency=='COP').TRM;

}

async getZonas(zonas:any){
         for (let item in zonas){
           this.zonas.push(zonas[item]);
         }

}

async getParametros(parametros:any){
for (let item in parametros){
  this.parametros.push(parametros[item]);
}

}

async getPromediosLocalidades(promedios_localidad:any){
  for (let item in promedios_localidad){
    this.promedios_localidad.push(promedios_localidad[item]);
  }

}

async getCostosLocalidades(costos_localidad:any){
  for (let item in costos_localidad){
    this.costos_localidad.push(costos_localidad[item]);
  }

}



async getPresentacionItems(presentacion_items:any){
for (let item in presentacion_items){
this.presentacion_items.push(presentacion_items[item]);
}

}

async getItems(items:any){
            ////console.log(items);
            for(let item in items){
              items[item].label = items[item].ItemCode+' - '+items[item].ItemName;
              this.items.push(items[item]);
             
           }
}

  filtrarItems(event:any){
    let filtered : any[] = [];
       let query = event.query;
       for(let i = 0; i < this.items.length; i++) {
           let items = this.items[i];
  
            if((items.ItemCode.toLowerCase().indexOf(query.toLowerCase())>=0) ||
               (items.ItemName.toLowerCase().indexOf(query.toLowerCase())>=0)){
              filtered.push(items);
           }
       }
       this.itemsFiltrados = filtered;
  }

  SeleccionarMoneda(){
    this.trm_moneda = this.monedas.find(moneda=>moneda.Currency==this.moneda.Currency).TRM;
    this.recalcular();
    //this.getPreciosListaItemSAP(this.item.ItemCode);
  }

  SeleccionarItem(){
   this.getPreciosListaItemSAP(this.item.ItemCode);
   


   this.getPrecioVentaItemSAP(this.item.ItemCode);
  }

  async sumarDias(fecha:Date, dias:number):Promise<Date>{
    fecha.setDate(fecha.getDate() + dias);
    ////console.log(fecha);
    return fecha;
  }

  async getPrecioVentaItemSAP(item: string){

    let fechaFin = new Date(this.fecha);
    let fechaInicio = await this.sumarDias(fechaFin,-14);
    ////console.log(this.fecha,fechaFin);

   
    let data = {
      item,
      fechaInicio:fechaInicio.toISOString(),
      fechaFin:this.fecha.toISOString()
    }

    ////console.log(data);
    this.comprasService.getPrecioVentaItemSAP(this.authService.getToken(),data)
        .subscribe({
            next:(precioVentaItem)=>{
              //console.log('precioVentaItem',precioVentaItem);
              if(precioVentaItem.length>0){
                this.precioVentaSAPPT = precioVentaItem[0].Precio;
                
              }else{
                this.messageService.add({severity:'warn', summary: '!Error', detail: "No se encontraron  precios de venta en SAP para el item seleccionado"});
              }
             

            },
            error:(err)=>{
              console.error(err);
            }
        });
  }

  getInfoCalculoItem(idCalculo:any){
      this.displayModal = true;
      this.loadingCargue = true;

      this.comprasService.getInfoCalculoItem(this.authService.getToken(), idCalculo)
          .subscribe({
             next:(infoCalculoItem)=>{
                ////console.log(infoCalculoItem);

                this.fecha = new Date(infoCalculoItem.calculo_precio_item[0].fecha);
                this.semanaAnio = infoCalculoItem.calculo_precio_item[0].semanaAnio;
                this.semanaMes = infoCalculoItem.calculo_precio_item[0].semanaMes;
                this.trm_dia = infoCalculoItem.calculo_precio_item[0].trmDia;
                this.moneda = this.monedas.find(moneda => moneda.Currency === infoCalculoItem.calculo_precio_item[0].moneda);
                this.trm_moneda = infoCalculoItem.calculo_precio_item[0].trmMoneda;
                this.item = this.items.find(item =>item.ItemCode === infoCalculoItem.calculo_precio_item[0].ItemCode);
                this.observacion = infoCalculoItem.calculo_precio_item[0].observacion;
                this.precioBase = this.opcionesPrecioBase.find(opcionPbase => opcionPbase.code === infoCalculoItem.calculo_precio_item[0].precioRef);
                this.precioVendedor = infoCalculoItem.calculo_precio_item[0].precioBase;
                this.prcGerente = infoCalculoItem.calculo_precio_item[0].prcGerente;
                this.precioGerente = (this.precioVendedor*(this.prcGerente/100))+this.precioVendedor;
                this.prcLPrecio = infoCalculoItem.calculo_precio_item[0].prcLP;
                this.precioLista = (this.precioVendedor*(this.prcLPrecio/100))+this.precioVendedor
                this.recursoPT = infoCalculoItem.calculo_precio_item[0].promRecurso;
                this.administracion = infoCalculoItem.calculo_precio_item[0].promAdmin;

                console.log( this.recursoPT , this.administracion);

                
                
                let detalle_receta:any[] = [];
                let totalCostoMPS0 = 0;
                let totalCostoMPS1 = 0;
                let totalCostoMPS2 = 0;
                let totalCostoEmpaqueMPS0 =0;
                let totalCostoEmpaqueMPS1 =0;
                let totalCostoEmpaqueMPS2 =0;

                this.totalCostoPTSAP = 0;

                for(let detalle_receta_pt of infoCalculoItem.detalle_calculo_mp){
                  detalle_receta.push({
                    itemMP:{
                      Code:detalle_receta_pt.ItemCode,
                      ItemName:detalle_receta_pt.ItemName,
                      EMPAQUE:detalle_receta_pt.empaque,
                      Quantity:detalle_receta_pt.cantidad,
                      costoSAP:detalle_receta_pt.costoSAP
                    },
                    costosItemMP:{
                      semana0:{
                        anio:detalle_receta_pt.anioS0,
                        semana:detalle_receta_pt.semanaS0,
                        costoMP:detalle_receta_pt.costoMPS0,
                        empaqueMP:detalle_receta_pt.costoEmpaqueS0,
                      },
                      semana1:{
                        anio:detalle_receta_pt.anioS1,
                        semana:detalle_receta_pt.semanaS1,
                        costoMP:detalle_receta_pt.costoMPS1,
                        empaqueMP:detalle_receta_pt.costoEmpaqueS1,
                      },
                      semana2:{
                        anio:detalle_receta_pt.anioS2,
                        semana:detalle_receta_pt.semanaS2,
                        costoMP:detalle_receta_pt.costoMPS2,
                        empaqueMP:detalle_receta_pt.costoEmpaqueS2,
                      }
                    }

                  });

                  totalCostoMPS0+=detalle_receta_pt.costoMPS0;
                  totalCostoMPS1+=detalle_receta_pt.costoMPS1;
                  totalCostoMPS2+=detalle_receta_pt.costoMPS2;
                  totalCostoEmpaqueMPS0+=detalle_receta_pt.costoEmpaqueS0;
                  totalCostoEmpaqueMPS2+=detalle_receta_pt.costoEmpaqueS1;
                  totalCostoEmpaqueMPS1+=detalle_receta_pt.costoEmpaqueS2;

                  this.totalCostoPTSAP+=detalle_receta_pt.costoSAP


                 

                }

                this.totalMPsemana0 = totalCostoMPS0;
                this.totalMPsemana1 = totalCostoMPS1;
                this.totalMPsemana2 = totalCostoMPS2;
              
                this.totalEmpaque = totalCostoEmpaqueMPS0;
              
                this.costoVentaPTsemana0 = this.totalMPsemana0+this.totalEmpaque+this.recursoPT;
                this.costoVentaPTsemana1 = this.totalMPsemana1+this.totalEmpaque+this.recursoPT;
                this.costoVentaPTsemana2 = this.totalMPsemana2+this.totalEmpaque+this.recursoPT;
                this.costoVentaPTSAP = this.totalCostoPTSAP+this.recursoPT;
              
                this.costoTotalPTsemana0 = this.costoVentaPTsemana0 + this.administracion;
                this.costoTotalPTsemana1 = this.costoVentaPTsemana1 + this.administracion;
                this.costoTotalPTsemana2 = this.costoVentaPTsemana2 + this.administracion;
                this.costoTotalPTSAP = this.costoVentaPTSAP+ this.administracion;

                for(let detalle_calculo of infoCalculoItem.detalle_precio_calculo_item){

                  ////console.log(detalle_calculo);
                  
                    this.tablaCalculadora.push({
                      ItemCode:detalle_calculo.ItemCode,
                      ItemName:detalle_calculo.ItemName,
                      lpGerente:detalle_calculo.precioGerente,
                      lpVendedor:detalle_calculo.precioVendedor,
                      lPrecio:detalle_calculo.precioLP,
                      precioMercado:detalle_calculo.promMercado,
                      precioVentaPT:detalle_calculo.promVentaSap,
                      brutoS0:detalle_calculo.brutoS0,
                      totalS0:detalle_calculo.netoS0,
                      brutoS1:detalle_calculo.brutoS1,
                      totalS1:detalle_calculo.netoS1,
                      brutoS2:detalle_calculo.brutoS2,
                      totalS2:detalle_calculo.netoS2
                    });

                    let precioBase = this.precioBase.code=='LPGERENTE'?detalle_calculo.precioGerente:this.precioBase.code=='LPVENDEDOR'?detalle_calculo.precioVendedor:this.precioBase.code=='LP'?detalle_calculo.precioLP:0;

                    this.tablaCalculadoraCostos.push({
                      ItemCode:detalle_calculo.ItemCode,
                      ItemName:detalle_calculo.ItemName,
                      lpGerente:detalle_calculo.precioGerente,
                      lpVendedor:detalle_calculo.precioVendedor,
                      lPrecio:detalle_calculo.precioLP,
                      precioMercado:detalle_calculo.promMercado,
                      precioVentaPT:detalle_calculo.promVentaSap,
                      //brutoS0: (precioBase - this.costoVentaPTSAP)/this.costoVentaPTSAP,
                      //totalS0: (precioBase - this.costoTotalPTSAP)/this.costoTotalPTSAP,
                      brutoS0: (precioBase - this.costoVentaPTSAP)/precioBase,
                      totalS0: (precioBase - this.costoTotalPTSAP)/precioBase,
                    
                    });

                }

                ////console.log(this.tablaCalculadora);

                this.detalle_receta = detalle_receta;

                

                this.displayModal = false;
                this.loadingCargue = false;
             },
             error:(err)=>{
                console.error(err);
             }
          });

  }

  clearItem(){}

  getPreciosListaItemSAP(ItemCode:string){
      //Obtener precios de lista
      this.comprasService.getPreciosListaItemSAP(this.authService.getToken(),ItemCode)
      .subscribe({
          next:(preciosListaItem)=>{
              ////console.log('preciosListaItem',preciosListaItem);
              this.preciosListaItem = preciosListaItem;
              this.checkPreciosListaItem = true;
              if(preciosListaItem.length==0){
                this.messageService.add({severity:'warn', summary: '!Error', detail: "No se encontro lista de precios en SAP para el item seleccionado"});
                this.preciosListaItem.push({

                  LPGERENTE:0,
                  LPVENDEDOR:0,
                  LP:0

                })
              }
              
              this.getPrecioMercadoItemSemana(this.item.ItemCode, this.semanaAnio, this.fecha.getFullYear()) ; 
              
          },
          error:(err)=>{
            console.error(err);
          }
      });
  }

  async getPrecioMercadoItemSemana(ItemCode:string,semanaAnio:number,anio:number){
    //Obtener precio promedio del mercado del item PT  de la semana del año seleccionado
    let fechaFin = new Date(this.fecha);
    let fechaInicio = await this.sumarDias(fechaFin,-14);
    
    this.comprasService.getPrecioMercadoItemSemana(this.authService.getToken(),ItemCode, semanaAnio, anio, fechaInicio.toISOString(), this.fecha.toISOString())
    .subscribe({
        next:(precioMercadoItemSemana)=>{
            //////console.log('preciosMercadoItemSemana',precioMercadoItemSemana);
            this.precioMercadoItemSemana = precioMercadoItemSemana;
            this.checkPrecioMercadoItemSemana = true;

            let total_precio = 0;
            let iterador = 1;
            for(let item of precioMercadoItemSemana){
                total_precio+=item.precio;
                iterador++;
            }

            this.precioPromedioMercadoPT = ((total_precio/iterador)/this.trm_moneda);

            this.getItemsMPbyItemPT(this.item.ItemCode);

            //Calcular Bruto
        },
        error:(err)=>{
          console.error(err);
        }
    });
  } 
   
  getItemsMPbyItemPT(ItemCode:string){
    this.comprasService.getItemsMPbyItemPT(this.authService.getToken(),this.item.ItemCode)
    .subscribe({
        next:async (itemsMP)=>{
            
            //console.log('Receta',itemsMP);

            this.trm_dia;
            let recursoPT:number = (parseFloat(this.promedios_localidad[0].promedio_recurso)/this.trm_moneda);
            let administracion:number =  parseFloat(this.promedios_localidad[0].promedio_administracion)/(this.trm_moneda);

            this.recursoPT = recursoPT;
            this.administracion = administracion;

            console.log( this.recursoPT , this.administracion);


            this.setPrecioBase();
            /*
            let costo_itemMP_semana0:number =0;
            let costo_itemMP_semana1:number =0;
            let costo_itemMP_semana2:number =0;
            let costo_empaqueMP_item:number = 0;
            */
            this.costoVentaPTsemana0 = 0;
            this.costoVentaPTsemana1 = 0;
            this.costoVentaPTsemana2 = 0;

            this.costoTotalPTsemana0 = 0;
            this.costoTotalPTsemana1 = 0;
            this.costoTotalPTsemana2 = 0;

            this.totalEmpaque=0;
            this.totalMPsemana0=0;
            this.totalMPsemana1=0;
            this.totalMPsemana2=0;

            this.totalCostoPTSAP = 0;

         

            let detalle_receta:any[] = [];

            for(let item of itemsMP){
             ////console.log(item);


             let costoEmpaque =0;
             let costoMPseman0 =0;
             let costoMPseman1 =0;
             let costoMPseman2=0;
             let precioEmpaque=0;
              
              let presentacion_item:any[any] = this.presentacion_items.filter(data => data.presentacion == item.EMPAQUE);
              ////////console.log('presentacion_item',item.Code,presentacion_item)
              if(presentacion_item.length>0){
                ////////console.log(presentacion_item[0].valor,item.Quantity,trm_dia);
                //costo_empaqueMP_item +=(parseFloat(presentacion_item[0].valor)*parseFloat(item.Quantity))/(this.trm_moneda);
                costoEmpaque = (parseFloat(presentacion_item[0].valor)*parseFloat(item.Quantity))/(this.trm_moneda);
                precioEmpaque = (parseFloat(presentacion_item[0].valor)/this.trm_moneda);
              } 

              let preciosMPItemUltimasSemanas = await this.getPreciosMPItemUltimasSemanas(item.Code);
              ////console.log('preciosMPItemUltimasSemanas',item.Code,preciosMPItemUltimasSemanas)
              if(preciosMPItemUltimasSemanas.length>0){

                if(preciosMPItemUltimasSemanas.length==1){
                  this.messageService.add({severity:'warn', summary: '!Advertencia', detail: `Para la materia prima ${item.ItemName} no se encontraron precios para la semana 1 y 2`});
                  preciosMPItemUltimasSemanas.push({
                    anio:0,
                    semanaAnioLista:0,
                    precioNac:0
                  },
                  {
                    anio:0,
                    semanaAnioLista:0,
                    precioNac:0
                  })
                }
                if(preciosMPItemUltimasSemanas.length==2){
                  this.messageService.add({severity:'warn', summary: '!Advertencia', detail: `Para la materia prima ${item.ItemName} no se encontraron precios para la semana  2`});
                  preciosMPItemUltimasSemanas.push({
                    anio:0,
                    semanaAnioLista:0,
                    precioNac:0
                  })
                }
                /*
                costo_itemMP_semana0 +=parseFloat(preciosMPItemUltimasSemanas[0].precioNac)*parseFloat(item.Quantity);
                costo_itemMP_semana1 +=parseFloat(preciosMPItemUltimasSemanas[1].precioNac)*parseFloat(item.Quantity);
                costo_itemMP_semana2 +=parseFloat(preciosMPItemUltimasSemanas[2].precioNac)*parseFloat(item.Quantity);
                */
                
                costoMPseman0 =(parseFloat(preciosMPItemUltimasSemanas[0].precioNac)*(this.trm_dia)*parseFloat(item.Quantity))/this.trm_moneda;
                costoMPseman1 =(parseFloat(preciosMPItemUltimasSemanas[1].precioNac)*(this.trm_dia)*parseFloat(item.Quantity))/this.trm_moneda;
                costoMPseman2 =(parseFloat(preciosMPItemUltimasSemanas[2].precioNac)*(this.trm_dia)*parseFloat(item.Quantity))/this.trm_moneda;

              } 

              this.totalCostoPTSAP+=(parseFloat(item.Quantity)*parseFloat(item.COSTO))/this.trm_moneda;

               this.totalEmpaque+=costoEmpaque;
               this.totalMPsemana0+=costoMPseman0;
               this.totalMPsemana1+=costoMPseman1;
               this.totalMPsemana2+=costoMPseman2;
              
               item.costoSAP=(parseFloat(item.Quantity)*parseFloat(item.COSTO))/this.trm_moneda;
              
              detalle_receta.push({
                itemMP: item,
                costosItemMP: {
                  semana0: {
                    anio:preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[0].anio:0,
                    semana:preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[0].semanaAnioLista:0,
                    precioMP:preciosMPItemUltimasSemanas.length>0?(parseFloat(preciosMPItemUltimasSemanas[0].precioNac)*(this.trm_dia)/this.trm_moneda):0,
                    precioEmpaque,
                    costoMP:costoMPseman0,
                    empaqueMP:costoEmpaque,
                    recursoMP:recursoPT,
                    costoVentaMP:costoMPseman0+costoEmpaque+recursoPT,
                    administracionMP: administracion,
                    costoTotalMP:costoMPseman0+costoEmpaque+recursoPT+administracion
                    
                  },
                  semana1: {
                    anio:preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[1].anio:0,
                    semana:preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[1].semanaAnioLista:0,
                    precioMP:preciosMPItemUltimasSemanas.length>0?(parseFloat(preciosMPItemUltimasSemanas[1].precioNac)*(this.trm_dia)/this.trm_moneda):0,
                    precioEmpaque,
                    costoMP:costoMPseman1,
                    empaqueMP:costoEmpaque,
                    recursoMP:recursoPT,
                    costoVentaMP:costoMPseman1+costoEmpaque+recursoPT,
                    administracionMP: administracion,
                    costoTotalMP:costoMPseman1+costoEmpaque+recursoPT+administracion
                  },
                  semana2: {
                    anio:preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[2].anio:0,
                    semana:preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[2].semanaAnioLista:0,
                    precioMP:preciosMPItemUltimasSemanas.length>0?(parseFloat(preciosMPItemUltimasSemanas[2].precioNac)*(this.trm_dia)/this.trm_moneda):0,
                    precioEmpaque,
                    costoMP:costoMPseman2,
                    empaqueMP:costoEmpaque,
                    recursoMP:recursoPT,
                    costoVentaMP:costoMPseman2+costoEmpaque+recursoPT,
                    administracionMP: administracion,
                    costoTotalMP:costoMPseman2+costoEmpaque+recursoPT+administracion
                  },

                }
              })
            }

            /*//////console.log(`Costo MP de PT ${ItemCode}:`,costo_itemMP_semana0);
            //////console.log(`Costo Empaque MP de PT ${ItemCode}:`,costo_empaqueMP_item);
            //////console.log(`Costo Recurso de PT ${ItemCode}:`,recursoPT);
            let costoVentaPT:number = (costo_itemMP_semana0+costo_empaqueMP_item+recursoPT);
            //////console.log(`Costo Venta PT ${ItemCode}:`,costoVentaPT);
            let costoTotalPT:number = (costoVentaPT+administracion);
            //////console.log(`Costo Total PT ${ItemCode}:`,costoTotalPT);
            //////console.log('detalle_receta',detalle_receta);
            */

            this.detalle_receta = detalle_receta;

            this.costoVentaPTsemana0 = this.totalMPsemana0+this.totalEmpaque+recursoPT;
            this.costoVentaPTsemana1 = this.totalMPsemana1+this.totalEmpaque+recursoPT;
            this.costoVentaPTsemana2 = this.totalMPsemana2+this.totalEmpaque+recursoPT;
            this.costoVentaPTSAP = this.totalCostoPTSAP+recursoPT;

            this.costoTotalPTsemana0 = this.costoVentaPTsemana0 + administracion;
            this.costoTotalPTsemana1 = this.costoVentaPTsemana1 + administracion;
            this.costoTotalPTsemana2 = this.costoVentaPTsemana2 + administracion;
            this.costoTotalPTSAP = this.costoVentaPTSAP+ administracion;


            




            this.checkItemsMPbyItemPT = true;

            await this.setTablaCalculadora()

            //////console.log(this.tablaCalculadora);
            
        },
        error:(err)=>{
          console.error(err);
        }
    });
  }

  async setTablaCalculadora(){
    this.tablaCalculadora = [];
    this.tablaCalculadoraCostos = [];

    ////console.log(this.precioBaseCalculo, this.precioBaseCalculo2);

    this.tablaCalculadora.push({
      linea:1,
      ItemCode:this.item.ItemCode,
      ItemName:this.item.ItemName,
      lpGerente:this.preciosListaItem.length==0?0:this.preciosListaItem[0].LPGERENTE/(this.trm_moneda),
      lpVendedor:this.preciosListaItem.length==0?0:this.preciosListaItem[0].LPVENDEDOR/(this.trm_moneda),
      lPrecio:this.preciosListaItem.length==0?0:this.preciosListaItem[0].LP/(this.trm_moneda),
      precioMercado:this.precioPromedioMercadoPT,
      precioVentaPT:this.precioVentaSAPPT,
      /*brutoS0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTsemana0)/this.costoVentaPTsemana0,
      totalS0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTsemana0)/this.costoTotalPTsemana0,
      brutoS1: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTsemana1)/this.costoVentaPTsemana1,
      totalS1: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTsemana1)/this.costoTotalPTsemana1,
      brutoS2: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTsemana2)/this.costoVentaPTsemana2,
      totalS2: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTsemana2)/this.costoTotalPTsemana2,*/
      brutoS0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTsemana0)/(this.precioBaseCalculo/(this.trm_moneda)),
      totalS0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTsemana0)/(this.precioBaseCalculo/(this.trm_moneda)),
      brutoS1: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTsemana1)/(this.precioBaseCalculo/(this.trm_moneda)),
      totalS1: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTsemana1)/(this.precioBaseCalculo/(this.trm_moneda)),
      brutoS2: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTsemana2)/(this.precioBaseCalculo/(this.trm_moneda)),
      totalS2: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTsemana2)/(this.precioBaseCalculo/(this.trm_moneda)),


    },
    {
      linea:2,
      ItemCode:this.item.ItemCode,
      ItemName:this.item.ItemName,
      lpGerente:this.precioGerente,
      lpVendedor:this.precioVendedor,
      lPrecio:this.precioLista,
      precioMercado:this.precioPromedioMercadoPT,
      precioVentaPT:this.precioVentaSAPPT,
      /*brutoS0: (this.precioBaseCalculo2 - this.costoVentaPTsemana0)/this.costoVentaPTsemana0,
      totalS0: (this.precioBaseCalculo2 - this.costoTotalPTsemana0)/this.costoTotalPTsemana0,
      brutoS1: (this.precioBaseCalculo2 - this.costoVentaPTsemana1)/this.costoVentaPTsemana1,
      totalS1: (this.precioBaseCalculo2 - this.costoTotalPTsemana1)/this.costoTotalPTsemana1,
      brutoS2: (this.precioBaseCalculo2 - this.costoVentaPTsemana2)/this.costoVentaPTsemana2,
      totalS2: (this.precioBaseCalculo2 - this.costoTotalPTsemana2)/this.costoTotalPTsemana2,*/
      brutoS0: (this.precioBaseCalculo2 - this.costoVentaPTsemana0)/this.precioBaseCalculo2,
      totalS0: (this.precioBaseCalculo2 - this.costoTotalPTsemana0)/this.precioBaseCalculo2,
      brutoS1: (this.precioBaseCalculo2 - this.costoVentaPTsemana1)/this.precioBaseCalculo2,
      totalS1: (this.precioBaseCalculo2 - this.costoTotalPTsemana1)/this.precioBaseCalculo2,
      brutoS2: (this.precioBaseCalculo2 - this.costoVentaPTsemana2)/this.precioBaseCalculo2,
      totalS2: (this.precioBaseCalculo2 - this.costoTotalPTsemana2)/this.precioBaseCalculo2,
    });

    this.tablaCalculadoraCostos.push({
      linea:1,
      ItemCode:this.item.ItemCode,
      ItemName:this.item.ItemName,
      lpGerente:this.preciosListaItem.length==0?0:this.preciosListaItem[0].LPGERENTE/(this.trm_moneda),
      lpVendedor:this.preciosListaItem.length==0?0:this.preciosListaItem[0].LPVENDEDOR/(this.trm_moneda),
      lPrecio:this.preciosListaItem.length==0?0:this.preciosListaItem[0].LP/(this.trm_moneda),
      precioMercado:this.precioPromedioMercadoPT,
      precioVentaPT:this.precioVentaSAPPT,
      /*brutoS0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTSAP)/this.costoVentaPTSAP,
      totalS0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTSAP)/this.costoTotalPTSAP,*/
      brutoS0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTSAP)/(this.precioBaseCalculo/(this.trm_moneda)),
      totalS0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTSAP)/(this.precioBaseCalculo/(this.trm_moneda)),
   
    },
    {
      linea:2,
      ItemCode:this.item.ItemCode,
      ItemName:this.item.ItemName,
      lpGerente:this.precioGerente,
      lpVendedor:this.precioVendedor,
      lPrecio:this.precioLista,
      precioMercado:this.precioPromedioMercadoPT,
      precioVentaPT:this.precioVentaSAPPT,
      /*brutoS0: (this.precioBaseCalculo2 - this.costoVentaPTSAP)/this.costoVentaPTSAP,
      totalS0: (this.precioBaseCalculo2 - this.costoTotalPTSAP)/this.costoTotalPTSAP,*/
      brutoS0: (this.precioBaseCalculo2 - this.costoVentaPTSAP)/this.precioBaseCalculo2,
      totalS0: (this.precioBaseCalculo2 - this.costoTotalPTSAP)/this.precioBaseCalculo2,

  
    });
  }

  async getPreciosMPItemUltimasSemanas(ItemCode:string,semanaAnio?:number,anio?:number):Promise<any>{
    try{

      //Obtener precio de item MP de la semana del año seleccionado
      //const preciosMPItemUltimasSemanas$ =  this.comprasService.getPreciosMPItemUltimasSemanas(this.authService.getToken(),ItemCode, semanaAnio, anio)
      const preciosMPItemUltimasSemanas$ =  this.comprasService.getPreciosMPItemUltimasSemanas(this.authService.getToken(),ItemCode)
      const preciosMPItemUltimasSemanas = await lastValueFrom(preciosMPItemUltimasSemanas$);

      return preciosMPItemUltimasSemanas;
      /*
      this.comprasService.getPreciosMPItemUltimasSemanas(this.authService.getToken(),ItemCode, semanaAnio, anio)
      .subscribe({
          next:(preciosMPItemUltimasSemanas)=>{
              //////console.log('preciosMPItemUltimasSemanas',preciosMPItemUltimasSemanas);
              this.preciosMPItemUltimasSemanas = preciosMPItemUltimasSemanas;
              this.checkPreciosMPItemUltimasSemanas = true;
          },
          error:(err)=>{
            console.error(err);
          }
      });
      **/

    }catch(err){
      //////console.log(err);
    }
      
  }

  recalcular(){
   if(this.item){
    
    //this.getPrecioMercadoItemSemana(this.item.ItemCode, this.semanaAnio, this.fecha.getFullYear()) ; 
    this.getPreciosListaItemSAP(this.item.ItemCode);
   }
    
  }
  

  showDialogLoading(cargaFinalizada:boolean){
   
    if(!cargaFinalizada){
      this.displayModal = true;
      this.loadingCargue = true;
    }
   
    while(!cargaFinalizada){
        if((this.checkPreciosListaItem && this.checkPreciosMPItemUltimasSemanas && this.checkPrecioMercadoItemSemana && this.checkItemsMPbyItemPT)){
          cargaFinalizada = true;
          this.displayModal = false;
          this.loadingCargue = false;
        }

        if((this.checkPreciosListaItem && this.checkPreciosMPItemUltimasSemanas && this.checkPrecioMercadoItemSemana)){
          this.getItemsMPbyItemPT(this.item.ItemCode);
        }
    }
  }
  
  SeleccionarPrecioBase(){

    //////console.log(this.precioBase);
    this.setPrecioBase();
    

    this.recalcular();
  }

  setPrecioBase(){
    this.precioBaseCalculo = 0;
    this.precioBaseCalculo2 = 0 ;
    if(this.preciosListaItem.length>0){
      switch(this.precioBase.code){
          case 'LPGERENTE':
            this.precioBaseCalculo = this.preciosListaItem[0].LPGERENTE;
            this.precioBaseCalculo2 = this.precioGerente;
          break;

          case 'LPVENDEDOR':
            this.precioBaseCalculo = this.preciosListaItem[0].LPVENDEDOR;
            this.precioBaseCalculo2 = this.precioVendedor;
          break;

          case 'LP':
            this.precioBaseCalculo = this.preciosListaItem[0].LP;
            this.precioBaseCalculo2 = this.precioLista;
          break;
      }
    }
  }

  cambiarPrecioGerente(valor:number){
    this.cambioPrecioGerenteDB.next(valor);
  }

  cambioPrecioGerente(event:any){
    let prcGerente:number =0;

    //////console.log(event);

    if(this.precioVendedor!=0){
      prcGerente =(100*(this.precioGerente-this.precioVendedor))/this.precioVendedor;
    }

    this.prcGerente = prcGerente;
    this.SeleccionarPrecioBase();
  }


  cambiarPrcGerente(valor:number){
    this.cambioPrcGerenteDB.next(valor);
  }

  cambioPrcGerente(event:any){
      let precioGerente:number =0;

      //////console.log(event);

      if(this.precioVendedor!=0){
        precioGerente = ((this.precioVendedor*event.value)/100)+this.precioVendedor;
      }

      this.precioGerente = precioGerente;
      this.SeleccionarPrecioBase();
      
  }

  cambioPrecioVendedor(precioVendedor:number){
    
    this. precioGerente = ((this.precioVendedor*this.prcGerente)/100)+this.precioVendedor;

    this.precioLista = ((this.precioVendedor*this.prcLPrecio)/100)+this.precioVendedor;
    this.SeleccionarPrecioBase();
  }

  cambiarPrecioLP(valor:number){
    this.cambioPrecioLPDB.next(valor);
  }

  cambiarPrcLP(valor:number){
    this.cambioPrcLPDB.next(valor);
  }

  cambioPrcLP(event:any){
    let precioLP:number =0;

    if(this.precioVendedor!=0){
      precioLP = ((this.precioVendedor*event.value)/100)+this.precioVendedor;
    }

    this.precioLista = precioLP;
    this.SeleccionarPrecioBase();
}

cambioPrecioLP(event:any){
  let prcLP:number =0;

  if(this.precioVendedor!=0){
    prcLP = (100*(this.precioLista-this.precioVendedor))/this.precioVendedor;
  }

  this.prcLPrecio = prcLP;
  this.SeleccionarPrecioBase();
}

guardarCalculo(){
  
  this.displayModal = true;
  this.loadingCargue = true;
  let data = {
      fecha:this.fecha,
      semanaAnio:this.semanaAnio,
      semanaMes:this.semanaMes,
      ItemCode: this.item.ItemCode,
      ItemName: this.item.ItemName,
      trmDia:this.trm_dia,
      moneda:this.moneda.Currency,
      trmMoneda:this.trm_moneda,
      precioRef:this.precioBase.code,
      precioBase:this.precioVendedor,
      prcGerente:this.prcGerente,
      prcLP:this.prcLPrecio,
      promAdmin:this.administracion,
      promRecurso:this.recursoPT,
      observacion:this.observacion,
      detalle_calculo_mp:this.detalle_receta,
      detalle_calculo_precio_item:this.tablaCalculadora
    }

    ////console.log(data);

    this.comprasService.grabarCalculoPreciosItem(this.authService.getToken(),data)
        .subscribe({
            next:(result)=>{
              this.displayModal = false;
              this.loadingCargue = false;
              this.messageService.add({severity:'success', summary: '!Notificación', detail: `Se registro correctamente el calculo de precios realizado para el item seleccionado.`});

            },
            error:(err)=>{
              console.error(err);
              this.messageService.add({severity:'error', summary: '!Error', detail: `Ocurrio un error al grabar el calculo:`});
            }
        });

}

grabarCambiosParametros(){
    ////console.log(this.parametros,this.costos_localidad,this.presentacion_items);
    let error:boolean = false;
    if(this.parametros.filter(parametro=>parametro.valor === null).length>0){
      this.messageService.add({severity:'error', summary: '!Error', detail: `En la tabla de parametros existen valores en blanco`});
      error = true;
    }

    if(this.costos_localidad.filter(parametro=>parametro.costo_admin === null || parametro.costo_recurso=== null).length>0){
      this.messageService.add({severity:'error', summary: '!Error', detail: `En la tabla costos por localidad existen valores en blanco`});
      error = true;
    }

    if(this.presentacion_items.filter(parametro=>parametro.valor === null).length>0){
      this.messageService.add({severity:'error', summary: '!Error', detail: `En la tabla presentación producto existen valores en blanco`});
      error = true;
    }

    if(!error){
        let data = {
          parametros:this.parametros,
          costos_localidad:this.costos_localidad,
          presentacion_items:this.presentacion_items

        }

        this.comprasService.updateParametrosCalculadora(this.authService.getToken(),data)
            .subscribe({
                next:(result)=>{
                    ////console.log('result',result)
                    if(!result){
                      this.messageService.add({severity:'success', summary: '!Notificación', detail: `Se ha realizado correctamente la actualización de los parametros`});  
                    }
                },
                error:(err)=>{
                    console.error('err',err);
                    this.messageService.add({severity:'error', summary: '!Error', detail: `Ocurrio un error en la actualización de un parametro:${JSON.stringify(err.error)}`});

                }
            })
    }
}

PresionaEnter(event:any){
    
  if (event.key === "Enter") {
    
    ////////console.log('ENTER PRESS');
    if(event.target.value ===''){
      event.target.value =0;
    }
    
  }
}

cambio(event:any){
  ////////console.log(event.target.value);
  if(event.target.value ===''){
    event.target.value =0;
  }
     
}


PresionaEnterMP(event:any,itemCode:string){
    
  if (event.key === "Enter") {
    
    ////////console.log('ENTER PRESS');
    if(event.target.value ===''){
      event.target.value =0;
    }
    
  }
}

cambioMP(event:any,itemCode:string){
  ////////console.log(event.target.value);
  if(event.target.value ===''){
    event.target.value =0;
  }

  this.recalcularCostosLineaItemMP(event.target.value,itemCode);
}

  async recalcularCostosLineaItemMP(cantidad:number, itemCode:string){

  let indexDetalleReceta = this.detalle_receta.findIndex(item=>item.itemMP.Code == itemCode);
  ////console.log(itemCode,this.detalle_receta,indexDetalleReceta,this.detalle_receta[indexDetalleReceta]);

  let precioMPNacS0 = parseFloat(this.detalle_receta[indexDetalleReceta].costosItemMP.semana0.precioMP);
  let precioMPNacS1 = parseFloat(this.detalle_receta[indexDetalleReceta].costosItemMP.semana1.precioMP);
  let precioMPNacS2 = parseFloat(this.detalle_receta[indexDetalleReceta].costosItemMP.semana2.precioMP);

  let precioEmpaqueMPS0 = parseFloat(this.detalle_receta[indexDetalleReceta].costosItemMP.semana0.precioEmpaque);
  let precioEmpaqueMPS1 = parseFloat(this.detalle_receta[indexDetalleReceta].costosItemMP.semana1.precioEmpaque);
  let precioEmpaqueMPS2 = parseFloat(this.detalle_receta[indexDetalleReceta].costosItemMP.semana2.precioEmpaque);
  

  let costosMPS0 = cantidad * precioMPNacS0;
  let costosMPS1 = cantidad * precioMPNacS1;
  let costosMPS2 = cantidad * precioMPNacS2;

  let costoEmpaqueS0 = cantidad * precioEmpaqueMPS0;
  let costoEmpaqueS1 = cantidad * precioEmpaqueMPS1;
  let costoEmpaqueS2 = cantidad * precioEmpaqueMPS2;

  this.detalle_receta[indexDetalleReceta].costosItemMP.semana0.costoMP = costosMPS0;
  this.detalle_receta[indexDetalleReceta].costosItemMP.semana1.costoMP = costosMPS1;
  this.detalle_receta[indexDetalleReceta].costosItemMP.semana2.costoMP = costosMPS2;

  this.detalle_receta[indexDetalleReceta].costosItemMP.semana0.empaqueMP = costoEmpaqueS0;
  this.detalle_receta[indexDetalleReceta].costosItemMP.semana1.empaqueMP = costoEmpaqueS0;
  this.detalle_receta[indexDetalleReceta].costosItemMP.semana2.empaqueMP = costoEmpaqueS0;

  let totalCostoMPS0 = 0;
  let totalCostoMPS1 = 0;
  let totalCostoMPS2 = 0;
  let totalCostoEmpaqueMPS0 =0;
  let totalCostoEmpaqueMPS1 =0;
  let totalCostoEmpaqueMPS2 =0;

  for(let linea of this.detalle_receta){
    totalCostoMPS0+=linea.costosItemMP.semana0.costoMP;
    totalCostoMPS1+=linea.costosItemMP.semana1.costoMP;
    totalCostoMPS2+=linea.costosItemMP.semana2.costoMP;
    totalCostoEmpaqueMPS0+=linea.costosItemMP.semana0.empaqueMP;
    totalCostoEmpaqueMPS2+=linea.costosItemMP.semana1.empaqueMP;
    totalCostoEmpaqueMPS1+=linea.costosItemMP.semana2.empaqueMP;
  }

  this.totalMPsemana0 = totalCostoMPS0;
  this.totalMPsemana1 = totalCostoMPS1;
  this.totalMPsemana2 = totalCostoMPS2;

  this.totalEmpaque = totalCostoEmpaqueMPS0;

  this.costoVentaPTsemana0 = this.totalMPsemana0+this.totalEmpaque+this.recursoPT;
  this.costoVentaPTsemana1 = this.totalMPsemana1+this.totalEmpaque+this.recursoPT;
  this.costoVentaPTsemana2 = this.totalMPsemana2+this.totalEmpaque+this.recursoPT;

  this.costoTotalPTsemana0 = this.costoVentaPTsemana0 + this.administracion;
  this.costoTotalPTsemana1 = this.costoVentaPTsemana1 + this.administracion;
  this.costoTotalPTsemana2 = this.costoVentaPTsemana2 + this.administracion;

  await this.setTablaCalculadora();
 
}

parametrosGlobales(){
    this.formParametrosG= true;
}

  detalleMP(){
    this.formDetalleCalculo = true;
  }

  async calcularSemana(){
    this.semanaAnio= await this.numeroDeSemana(this.fecha);
    this.semanaMes = await this.semanaDelMes(this.fecha);
  }

  async fechaInicioSemana(fecha:Date):Promise<Date>{
    let fechaTMP:Date = new Date(fecha);
    let diaDeLaSemana = fecha.getUTCDay()==0?1:fecha.getUTCDay();
    let numeroDiasRestar = diaDeLaSemana-1;
    fechaTMP.setDate(fecha.getDate()-numeroDiasRestar);

    

    //////////console.log(fecha, diaDeLaSemana,fecha.getDate(),numeroDiasRestar,fechaTMP);
    return fechaTMP;
  }

  async siguienteMes(fecha:Date){
    //////////console.log(fecha,fecha.getFullYear(),fecha.getMonth());

    let anioMesSiguiente:number = fecha.getMonth()==11?fecha.getFullYear()+1:fecha.getFullYear();
    let mesMesSiguiente:number = fecha.getMonth()==11?0:fecha.getMonth()+1;
    //////////console.log('año',anioMesSiguiente,'mes',mesMesSiguiente);
    let fechaInicioMesSiguiente = new Date(anioMesSiguiente, mesMesSiguiente,1);

    return fechaInicioMesSiguiente;
  }

  async semanaDelMes(fecha:Date):Promise<string>{
    let semanaMes:string ='';
    
    //let fechaInicioSemana = await this.fechaInicioSemana(new Date(fecha));
    let fechaInicioSemana = ((fecha));
    fechaInicioSemana.setHours(0,0,0);
    ////////console.log('Inicio semana',fechaInicioSemana);
    //let siguienteMes = await this.siguienteMes(new Date(fecha));
    let siguienteMes = await this.siguienteMes((fecha));
    siguienteMes.setHours(0,0,0);
    ////////console.log('Siguiente mes',siguienteMes);

    let fechaInicioSemanaSiguienteMes = await this.fechaInicioSemana((siguienteMes));
    fechaInicioSemanaSiguienteMes.setHours(0,0,0);
    ////////console.log('fecha Inicio Semana Siguiente mes',fechaInicioSemanaSiguienteMes);
    //await //////console.log(fechaInicioSemana.getFullYear(),fechaInicioSemanaSiguienteMes.getFullYear(),fechaInicioSemana.getMonth(),fechaInicioSemanaSiguienteMes.getMonth(),fechaInicioSemana.getDate(),fechaInicioSemanaSiguienteMes.getDate());

    
    let diaDelMes = fechaInicioSemana.getDate();
    let diaFecha = fechaInicioSemana.getDay();

    
    let weekOfMonth = Math.ceil((diaDelMes - 1 - diaFecha) / 7);
    //////////console.log(`${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`,weekOfMonth+1);
    let mesStr = this.mesesAnio.filter(mes =>mes.mes === (fechaInicioSemana.getMonth()+1))[0].mesStr.substring(0,3).toUpperCase();
    
    if(fechaInicioSemana.getFullYear()===fechaInicioSemanaSiguienteMes.getFullYear() && fechaInicioSemana.getMonth() === fechaInicioSemanaSiguienteMes.getMonth() && fechaInicioSemana.getDate()===fechaInicioSemanaSiguienteMes.getDate()){
      weekOfMonth = 0;
      mesStr = this.mesesAnio.filter(mes =>mes.mes === (siguienteMes.getMonth()+1))[0].mesStr.substring(0,3).toUpperCase();
    }

    semanaMes = `${(weekOfMonth+1)}S - ${mesStr}`;

    return semanaMes;
  }

  async numeroDeSemana(fecha:any):Promise<number>{
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
        const worksheet = xlsx.utils.json_to_sheet(this.detalle_receta);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `detalle_items_mp_${this.item.ItemCode}`);
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
