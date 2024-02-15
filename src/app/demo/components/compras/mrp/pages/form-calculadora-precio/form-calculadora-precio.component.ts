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

  categoriasItemPT:any[] = [];
  categoriaItemsPT!:any;

  bkitems:any[] = [];
  items:any[] = [];
  item!:any;
  itemSeleted!:any;
  
  arrayCalculadoraMultiple:any[] = [];

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

  preciosListSugeridosItem:any[] = [];
  checkPreciosListaSugeridosItem:boolean = false;

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
  selectedDetalleReceta:any[] = [];

  totalCantidadArticulos:number =0;

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

  merma:number =0.01;

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

opcionesRecurso:any[] = [];
opcionRecurso!:any;



prcGerente:number =0;
prcLPrecio:number =0;
prcVendedor:number =0;
prcNeto:number =0;

recursoPT:number =0;
administracion:number =0;
recursoPTSAP:number =0;
cambioPrecioVendedorDB:Subject<number> = new Subject(); 
cambioPrcVendedorDB:Subject<number> = new Subject(); 

cambioPrecioLPDB:Subject<number> = new Subject(); 
cambioPrcLPDB:Subject<number> = new Subject(); 

cambioPrcNetoDB:Subject<number> = new Subject(); 

formDetalleCalculo:boolean = false;
formDetalleCalculosItems:boolean = false;
formCrreateDetalleCalculo:boolean = false;

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
  
empaques:any[] = [];
selectedEmpaque!:any;

protectores:any[] = [];
selectedProtector!:any;


itemsMP:any[] = [];
selecteditemMP!:any;

optionSelectItemPT:boolean = false;

tabala_costos_item_pt:any[] = [];

tabla_precios_sugeridos:any[] = [];
tabla_precios_venta_sap:any[] = [];
tabla_recetas_items_pt:any[] = [];
tabla_lista_precios_sap:any[] = [];
tabla_precios_pt_zona:any[] = [];
tabla_lista_precios_mp:any[] = [];

arrayOtrosCostos:any[] = [{code:'flete',label:'Flete',valor:0},{code:'adicionales',label:'Adicionales',valor:0}];
otrosCostos:number = 0;

formOtrosCostos:boolean = false;

promRecurso:number = 0;
promAdmin:number = 0;



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

    this.infoUsuario = this.authService.getInfoUsuario();
    this.perfilesUsuario = this.authService.getPerfilesUsuario();
    this.permisosUsuario = this.authService.getPermisosUsuario();
    this.permisosPerfilesPagina = this.permisosUsuario.filter(item => item.url===this.router.url); 
    this.permisosUsuarioPagina =  this.authService.permisosPagina(this.permisosPerfilesPagina);
    this.urlBreadCrumb = this.router.url;

    this.getConfigCalculadora();

    this.semanaAnio = await this.numeroDeSemana(new Date());
    this.semanaMes = await this.semanaDelMes(new Date());

    this.precioBase = this.opcionesPrecioBase.filter(precioBase => precioBase.code ==='LPGERENTE')[0];

    this.cambioPrecioVendedorDB
    .pipe(debounceTime(300))
    .subscribe( value =>{


      let event = {value}
      this.cambioPrecioVendedor(event);
    });

    this.cambioPrcVendedorDB
    .pipe(debounceTime(300))
    .subscribe( value =>{

      let event = {value}
      this.cambioPrcVendedor(event);
    });

    this.cambioPrcLPDB
    .pipe(debounceTime(300))
    .subscribe( value =>{

      let event = {value}
      this.cambioPrcLP(event);
    });

    this.cambioPrcNetoDB
    .pipe(debounceTime(300))
    .subscribe( value =>{

      let event = {value}
      this.cambioPrcNeto(event);
    });

    this.cambioPrecioLPDB
    .pipe(debounceTime(300))
    .subscribe( value =>{

      let event = {value}
      this.cambioPrecioLP(event);
    });

    

  }


  

  getConfigCalculadora(){
    this.displayModal = true;
    this.loadingCargue = true
    this.comprasService.getConfigCalculadora(this.authService.getToken())
    .subscribe({
      next: async (config:any) => {

        await this.getItems(config.items);
        await this.getMonedasMysql(config.monedas);
        await this.getZonas(config.zonas);
        await this.getParametros(config.parametros_calculadora_precio);
        await this.getPromediosLocalidades(config.tabla_promedios_localidad);
        await this.getCostosLocalidades(config.tabla_costos_localidad);
        await this.getPresentacionItems(config.tabla_presentacion_items);
        await this.getCategoriasItemsPT(config.categoriasPT);
        
        await this.getItemsMP(config.itemsMP2);
        await this.getItemsEP(config.tabla_presentacion_items)

        this.tabla_precios_sugeridos = config.tabla_precios_sugeridos;
        this.tabla_precios_venta_sap = config.tabla_precios_venta_sap;
        this.tabla_recetas_items_pt = config.tabla_recetas_items_pt;
        this.tabla_lista_precios_sap = config.tabla_lista_precios_sap;
        this.tabla_precios_pt_zona = config.tabla_precios_pt_zona;
        this.tabla_lista_precios_mp = config.tabla_lista_precios_mp;

        this.recursoPT = this.promedios_localidad[0].promedio_recurso;
        this.administracion =this.promedios_localidad[0].promedio_administracion

        this.promAdmin = this.promedios_localidad[0].promedio_administracion;
        this.promRecurso = this.promedios_localidad[0].promedio_recurso;

        await this.setOpcionesRecurso(config.tabla_costos_localidad,config.tabla_promedios_localidad);

        this.recursoPT = this.opcionRecurso.costorecurso;

        
        //////////////////console.log(this.promAdmin,this.promRecurso,this.recursoPT);

        
        if(Object.keys(this.rutaActiva.snapshot.params).length >0){
          this.idCalculo = this.rutaActiva.snapshot.params;
          this.editarCalculo = true;
          this.getInfoCalculoItem(this.idCalculo);

        }

        this.displayModal = false;
        this.loadingCargue = false;


      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  async setOpcionesRecurso(localidades:any, promedio:any): Promise<void> {
      let opciones:any[] = [];
      opciones.push({
        id:0,
        label:'Promedio',
        costoadmin:promedio[0].promedio_administracion,
        costorecurso:promedio[0].promedio_recurso
      });
      for(let localidad of localidades){
        opciones.push({
          id:localidad.id,
          label:localidad.localidad,
          costoadmin:localidad.costo_admin,
          costorecurso:localidad.costo_recurso
        });
      }

     

      this.opcionesRecurso = opciones;
      this.opcionRecurso = opciones.find(opcion => opcion.id === 0);

  }

  getInfoCalculoItem(idCalculo:any){  
    

    this.comprasService.getInfoCalculoItem(this.authService.getToken(), idCalculo)
        .subscribe({
           next:async (infoCalculoItem)=>{
              //////console.log( infoCalculoItem);

              this.fecha = new Date(infoCalculoItem.calculo_precio_item[0].fecha);
              this.semanaAnio = infoCalculoItem.calculo_precio_item[0].semanaAnio;
              this.semanaMes = infoCalculoItem.calculo_precio_item[0].semanaMes;
              this.trm_dia = infoCalculoItem.calculo_precio_item[0].trmDia;
              this.moneda = this.monedas.find(moneda => moneda.Currency === infoCalculoItem.calculo_precio_item[0].moneda);
              this.trm_moneda = infoCalculoItem.calculo_precio_item[0].trmMoneda;

              this.observacion = infoCalculoItem.calculo_precio_item[0].observacion;
              this.precioBase = this.opcionesPrecioBase.find(opcionPbase => opcionPbase.code === infoCalculoItem.calculo_precio_item[0].precioRef);
              this.setPrecioBase();
              this.precioGerente = infoCalculoItem.calculo_precio_item[0].precioBase;
              this.prcGerente = infoCalculoItem.calculo_precio_item[0].prcGerente;

              this.prcVendedor = infoCalculoItem.calculo_precio_item[0].prcVendedor;
              this.precioVendedor = (this.precioGerente*(this.prcVendedor/100))+this.precioGerente;
              
              //this.precioGerente = (this.precioVendedor*(this.prcGerente/100))+this.precioVendedor;
              this.prcLPrecio = infoCalculoItem.calculo_precio_item[0].prcLP;
              this.precioLista = (this.precioGerente*(this.prcLPrecio/100))+this.precioGerente;

              
              if(infoCalculoItem.detalle_precio_calculo_item[0].otrosCostos!=null){
                console.log(infoCalculoItem.detalle_precio_calculo_item[0].otrosCostos);
                this.arrayOtrosCostos = JSON.parse(infoCalculoItem.detalle_precio_calculo_item[0].otrosCostos);
              }
              
              let otrosCostos = (await this.sumColArray(this.arrayOtrosCostos,[{valor:0}]))[0].valor;
              this.otrosCostos = otrosCostos;


              if(infoCalculoItem.detalle_precio_calculo_item[0].recurso!=null){
                
                this.opcionRecurso = this.opcionesRecurso.find(opcion => opcion.label === infoCalculoItem.detalle_precio_calculo_item[0].recurso);
              }

              

              

              //this.recursoPT = infoCalculoItem.calculo_precio_item[0].promRecurso;
              this.recursoPT = infoCalculoItem.detalle_precio_calculo_item[0].costoRecurso;
              ////////////////console.log('getInfoCalculoItem recursoPT',this.recursoPT);
              ////console.log(this.recursoPT);
              this.administracion = infoCalculoItem.calculo_precio_item[0].promAdmin;
              this.merma = infoCalculoItem.detalle_calculo_mp[0].merma;

              ////////////////////////console.log( this.recursoPT,this.administracion,this.merma);

              
              this.categoriaItemsPT = this.categoriasItemPT.find(item =>item.label === infoCalculoItem.calculo_precio_item[0].categoria);

              let itemsPT:any[] = infoCalculoItem.detalle_precio_calculo_item.filter((item: { linea: number; }) => item.linea === 1);

             // ////////////////////////console.log(infoCalculoItem.detalle_calculo_mp);

              let arrayCalculadora:any[] = [];
              let itemsSelected:any[] = [];

              for(let itemPT of itemsPT){

                ////////////console.log(itemPT);

                let infoItem = this.items.find(item => item.ItemCode === itemPT.ItemCode);
                
                itemsSelected.push(infoItem);

                let listaPreciosSAP:any[] =[{
                    ItemCode:infoItem.ItemCode,
                    ItemName:infoItem.ItemName,
                    Currency:'',
                    LPGERENTE:itemPT.precioGerente,
                    LPVENDEDOR:itemPT.precioVendedor,
                    LP:itemPT.precioLP,
                    PriceList:0
                }];

                let listaPrecioSugerido:any[] =[{
                    ItemCode:infoItem.ItemCode,
                    ItemName:infoItem.ItemName,
                    precioGerente:infoCalculoItem.detalle_precio_calculo_item.find((item: { linea: number; ItemCode:any }) => item.linea === 2 && item.ItemCode === itemPT.ItemCode).precioGerente,
                    precioLista:infoCalculoItem.detalle_precio_calculo_item.find((item: { linea: number; ItemCode:any }) => item.linea === 2 && item.ItemCode === itemPT.ItemCode).precioLP,
                    precioVendedor:infoCalculoItem.detalle_precio_calculo_item.find((item: { linea: number; ItemCode:any }) => item.linea === 2 && item.ItemCode === itemPT.ItemCode).precioVendedor
                }];

                ////////////////////////console.log(infoCalculoItem.detalle_calculo_mp.filter((item: { fatherItemCode: any; })=>item.fatherItemCode === itemPT.ItemCode));

               let detalle_calculo_mp_item:any[] = infoCalculoItem.detalle_calculo_mp.filter((item: { fatherItemCode: any; })=>item.fatherItemCode === itemPT.ItemCode);
               let detalle_receta:any[] = detalle_calculo_mp_item.map((item)=>{
                  return {
                            itemMP:{
                              COSTO: item.costoSAP/item.cantidad,
                              Code:item.ItemCode,
                              EMPAQUE:item.empaque,
                              Father:itemPT.ItemCode,
                              ItemName:item.ItemName,
                              MODIFICAR:null,
                              Quantity:item.cantidad,
                              costoSAP:item.costoSAP,
                              merma:item.merma,
                              precioItem:0,
                              recursoPT:itemPT.costoRecurso,
                              recurso:''
                              
                            },
                            costosItemMP:{
                              semana0:{
                                administracionMP:infoCalculoItem.calculo_precio_item[0].promAdmin,
                                anio:item.anioS0,
                                costoMP:item.costoMPS0,
                                costoTotalMP:0,
                                costoVentaMP:0,
                                empaqueMP:item.costoEmpaqueS0,
                                precioEmpaque:item.costoEmpaqueS0/item.cantidad,
                                precioMP:item.costoMPS0/item.cantidad,
                                recursoMP:infoCalculoItem.calculo_precio_item[0].promRecurso,
                                semana:item.semanaS0
                              },
                              semana1:{
                                administracionMP:infoCalculoItem.calculo_precio_item[0].promAdmin,
                                anio:item.anioS1,
                                costoMP:item.costoMPS1,
                                costoTotalMP:0,
                                costoVentaMP:0,
                                empaqueMP:item.costoEmpaqueS1,
                                precioEmpaque:item.costoEmpaqueS1/item.cantidad,
                                precioMP:item.costoMPS1/item.cantidad,
                                recursoMP:infoCalculoItem.calculo_precio_item[0].promRecurso,
                                semana:item.semanaS1
                              },
                              semana2:{
                                administracionMP:infoCalculoItem.calculo_precio_item[0].promAdmin,
                                anio:item.anioS2,
                                costoMP:item.costoMPS2,
                                costoTotalMP:0,
                                costoVentaMP:0,
                                empaqueMP:item.costoEmpaqueS2,
                                precioEmpaque:item.costoEmpaqueS2/item.cantidad,
                                precioMP:item.costoMPS2/item.cantidad,
                                recursoMP:infoCalculoItem.calculo_precio_item[0].promRecurso,
                                semana:item.semanaS2
                              }
                            }

                         }
               });

              

               let arregloCostos:any = await this.calcularTotalesDetalleCalculo2(detalle_receta);

               this.recursoPT = (itemPT.costoRecurso==0 || itemPT.recurso==null)?(infoItem.RECURSOPONDE==null?0:infoItem.RECURSOPONDE):itemPT.costoRecurso;
               ////console.log(this.recursoPT);

               let tablaCostosItemPT:any = {
                  costoAdministracionEstandar: arregloCostos.administracion,
                  costoMermaS0: arregloCostos.costoMermaS0,
                  costoMermaS1: arregloCostos.costoMermaS1,
                  costoMermaS2: arregloCostos.costoMermaS2,
                  costoMermaSAP: arregloCostos.costoMermaSAP,
                  costoRecursoEstandar:arregloCostos.recursoPT,
                  //costoRecursoItemPT:infoItem.RECURSOPONDE==null?0:infoItem.RECURSOPONDE,
                  costoRecursoItemPT: arregloCostos.recursoPT,
                  costoTotalPTSAP: arregloCostos.costoTotalPTSAP,
                  costoTotalPTsemana0: arregloCostos.costoTotalPTsemana0,
                  costoTotalPTsemana1: arregloCostos.costoTotalPTsemana1,
                  costoTotalPTsemana2: arregloCostos.costoTotalPTsemana2,
                  costoVentaPTSAP: arregloCostos.costoVentaPTSAP,
                  costoVentaPTsemana0: arregloCostos.costoVentaPTsemana0,
                  costoVentaPTsemana1: arregloCostos.costoVentaPTsemana1,
                  costoVentaPTsemana2: arregloCostos.costoVentaPTsemana2,
                  detalle_receta,
                  merma: arregloCostos.merma,
                  totalArticulos: arregloCostos.totalArticulos,
                  totalCostoPTSAP: arregloCostos.totalCostoPTSAP,
                  totalEmpaque: arregloCostos.totalEmpaque,
                  totalMPsemana0: arregloCostos.totalMPsemana0,
                  totalMPsemana1: arregloCostos.totalMPsemana1,
                  totalMPsemana2: arregloCostos.totalMPsemana2,
                  otrosCostos: arregloCostos.otrosCostos,
                  recurso:this.opcionRecurso.label

               }


               let itemArray:any = {
                    COSTOUINVET:infoItem.COSTOUINVET==null?0:infoItem.COSTOUINVET,
                    EMPAQUE:infoItem.EMPAQUE,
                    FrgnName:infoItem.FrgnName,
                    FrozenComm:infoItem.FrozenComm,
                    INACTIVO:infoItem.INACTIVO,
                    InvntItem:infoItem.InvntItem,
                    InvntryUom:infoItem.InvntryUom,
                    ItemCode:infoItem.ItemCode,
                    ItemName:infoItem.ItemName,
                    ItmsGrpCod:infoItem.ItmsGrpCod,
                    ItmsGrpNam:infoItem.ItmsGrpNam,
                    NOMBRECATEGORIA:infoItem.NOMBRECATEGORIA,
                    NOMBRESUBCATEGORIA:infoItem.NOMBRESUBCATEGORIA,
                    NOPENTREGA:infoItem.NOPENTREGA,
                    RECURSOPONDE:infoItem.RECURSOPONDE==null?0:infoItem.RECURSOPONDE,
                    TIPOPROD:infoItem.TIPOPROD,
                    U_NF_Categoria:infoItem.U_NF_Categoria,
                    U_NF_MARCA:infoItem.U_NF_MARCA,
                    U_NF_REGICA:infoItem.U_NF_REGICA,
                    U_NF_SubCategoria:infoItem.U_NF_SubCategoria,
                    label:infoItem.label,
                    precioMercado:itemPT.promMercado,
                    precioVentaSAP:itemPT.promVentaSap,
                    listaPreciosSAP,
                    listaPrecioSugerido,
                    tablaCostosItemPT
          
                };

                
                

                    arrayCalculadora.push(itemArray);

              }

              //////////////////////console.log(arrayCalculadora);

              if(this.categoriaItemsPT){
                //Item x categoria
                this.optionSelectItemPT = true;
                this.items = itemsSelected;
                this.item = itemsSelected;
              }else{
                //Item single
                this.optionSelectItemPT = false;
                this.item = itemsSelected[0];
              }


              this.arrayCalculadoraMultiple = arrayCalculadora;
              await this.setTablaCalculadora2(arrayCalculadora);
             
          

              this.displayModal = false;
              this.loadingCargue = false;
           },
           error:(err)=>{
              console.error(err);
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
            ////////////////console.log(items);
            for(let item in items){
              items[item].label = items[item].ItemCode+' - '+items[item].ItemName;
              this.items.push(items[item]);
             
           }

           this.bkitems = this.items;
}

async getCategoriasItemsPT(categorias:any){
  //////////////////////////////////////console.log(items);
  for(let item in categorias){
    categorias[item].label = categorias[item].U_NF_Categoria+' - '+categorias[item].NOMBRECATEGORIA;
    this.categoriasItemPT.push(categorias[item]);
   
 }
}

async getItemsMP(itemsMP:any){
  //////////////////////////////////////console.log(items);
  let articulos:any[] = [];
  

  for(let item in itemsMP){
    itemsMP[item].label = itemsMP[item].ItemCode+' - '+itemsMP[item].ItemName;
    articulos.push(itemsMP[item]);
   
  }
  //this.itemsMP = articulos.filter(articulo => articulo.ItemCode.startsWith('IN')==false );
  this.itemsMP = articulos;
  this.protectores = articulos.filter(articulo => articulo.ItemCode.startsWith('IN') );

}


async getItemsEP(itemsEP:any){
  //////////////////////////////////////console.log(items);
  /*for(let item in itemsEP){
    itemsEP[item].label = itemsEP[item].ItemCode+' - '+itemsEP[item].ItemName;
    this.empaques.push(itemsEP[item]);
   
  }*/

  for(let item in itemsEP){
    itemsEP[item].label = itemsEP[item].id+' - '+itemsEP[item].descripcion;
    itemsEP[item].COSTOUINVET = itemsEP[item].valor;
    itemsEP[item].ItemName = itemsEP[item].descripcion;
    itemsEP[item].ItemCode = itemsEP[item].id;
    this.empaques.push(itemsEP[item]);
   
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

  async SeleccionarMoneda(){
    this.displayModal = true;
    this.loadingCargue = true
    this.trm_moneda = this.monedas.find(moneda=>moneda.Currency==this.moneda.Currency).TRM;
   
    /*
    if(this.categoriaItemsPT){
      if(this.categoriaItemsPT.U_NF_Categoria!=''){
        let arrayCalculadora = await this.calcularCostosItemsPT(this.arrayCalculadoraMultiple);
        await this.setTablaCalculadora2(arrayCalculadora);
      }
    }else{
      this.recalcular();
    }

    */
    let arrayCalculadora = await this.calcularCostosItemsPT(this.arrayCalculadoraMultiple);
    await this.setTablaCalculadora2(arrayCalculadora);
    //this.getPreciosListaItemSAP(this.item.ItemCode);

    this.displayModal = false;
    this.loadingCargue = false
  }

  SeleccionarCategoria(){
    ////////////////////////console.log(this.categoriaItemsPT);
    this.clearItem();
    this.items = this.bkitems;
    //Buscar todos los items PT segun la categoria seleccionada
    if(this.categoriaItemsPT && this.categoriaItemsPT.U_NF_Categoria!=''){
      let itemsPTXCategoria = this.items.filter(item => item.U_NF_SubCategoria===this.categoriaItemsPT.U_NF_Categoria);
      ////////////////////////////////console.log(itemsPTXCategoria);
      let indexMG = itemsPTXCategoria.findIndex(item=>item.ItemCode==='ME2070005');
      ////////////////////////////////console.log(indexMG);
      if(indexMG>=0){
        //Eliminar item ME2070005
        itemsPTXCategoria.splice(indexMG,1);
      }
      ////////////////////////////////console.log(itemsPTXCategoria);
      this.optionSelectItemPT = true;
      this.items = itemsPTXCategoria;
      this.item = itemsPTXCategoria;
      this.setCalculosItems();
      //this.item = [];
    }else{
      this.item = [];
      this.optionSelectItemPT = false;
    }
    
    
    
  }

  clearCategoria(){
    ////////////////////////////////console.log(this.categoriaItemsPT);
    this.optionSelectItemPT = false;
    this.items = this.bkitems;
    this.item = [];
    
  }

   SeleccionarItem(){
    this.clearItem();
    if(this.optionSelectItemPT){
    }else{
      //Single selection
      this.itemSeleted = this.item;
    }

    this.setCalculosItems();
 
   
  }

  async setCalculosItems(){
    //Multiple selection
    this.displayModal = true;
    this.loadingCargue = true
    this.setPrecioBase();

    let itemsPT:any[] = [];
    if(this.optionSelectItemPT){
      itemsPT = this.item
    }else{
      itemsPT.push(this.item);
    }
      
    let arrayCalculadora:any[] = [];

    for(let itemPT of itemsPT){
      
      let listaPreciosSAP = await this.getPreciosListaItemSAP2(itemPT.ItemCode);
      let listaPrecioSugerido = await this.getPreciosListaSugeridos2(itemPT.ItemCode);
      let precioVentaSAP = await this.getPrecioVentaItemSAP2(itemPT.ItemCode)
      let precioMercado = await this.getPrecioMercadoItemSemana2(itemPT.ItemCode,this.semanaAnio, this.fecha.getFullYear())

      let itemArray:any = {
        COSTOUINVET:itemPT.COSTOUINVET==null?0:itemPT.COSTOUINVET,
        EMPAQUE:itemPT.EMPAQUE,
        FrgnName:itemPT.FrgnName,
        FrozenComm:itemPT.FrozenComm,
        INACTIVO:itemPT.INACTIVO,
        InvntItem:itemPT.InvntItem,
        InvntryUom:itemPT.InvntryUom,
        ItemCode:itemPT.ItemCode,
        ItemName:itemPT.ItemName,
        ItmsGrpCod:itemPT.ItmsGrpCod,
        ItmsGrpNam:itemPT.ItmsGrpNam,
        NOMBRECATEGORIA:itemPT.NOMBRECATEGORIA,
        NOMBRESUBCATEGORIA:itemPT.NOMBRESUBCATEGORIA,
        NOPENTREGA:itemPT.NOPENTREGA,
        RECURSOPONDE:itemPT.RECURSOPONDE==null?0:itemPT.RECURSOPONDE,
        TIPOPROD:itemPT.TIPOPROD,
        U_NF_Categoria:itemPT.U_NF_Categoria,
        U_NF_MARCA:itemPT.U_NF_MARCA,
        U_NF_REGICA:itemPT.U_NF_REGICA,
        U_NF_SubCategoria:itemPT.U_NF_SubCategoria,
        label:itemPT.label

      };
      

      itemArray.listaPreciosSAP = listaPreciosSAP;
      itemArray.listaPrecioSugerido = listaPrecioSugerido;
      itemArray.precioVentaSAP = precioVentaSAP;
      itemArray.precioMercado = precioMercado;
      arrayCalculadora.push(itemArray);
    }


    /**
     * Obtener costos asociados a los items seleccionados
     */
    this.arrayCalculadoraMultiple = await this.calcularCostosItemsPT(arrayCalculadora);
    //console.log(this.arrayCalculadoraMultiple);
    /**
     * Setear tablas de de costos de repocisión y cosotos SAP
     */
    await this.setTablaCalculadora2(this.arrayCalculadoraMultiple);
    this.displayModal = false;
    this.loadingCargue = false;
  }

  async calcularCostosItemsPT(arrayCalculadora:any):Promise<any>{ 
    for(let item of arrayCalculadora){
      let itemPT = this.bkitems.find((itempt: { ItemCode: any; }) =>itempt.ItemCode === item.ItemCode);
      let receta_itemPT = await this.getItemsMPbyItemPT2(item.ItemCode);
      let tablaCostosItemPT = await this.setTablaCostosItemPT(receta_itemPT,itemPT);
      item.tablaCostosItemPT = tablaCostosItemPT;
    }
    return arrayCalculadora;
  }

  async getItemsMPbyItemPT2(ItemCode:string){
    /**
     * Obtiene la receta del ItemCode
     *  */    
    let receta_itemPT = this.tabla_recetas_items_pt.filter(item => item.Father === ItemCode);
    return receta_itemPT;

  }

  async setTablaCostosItemPT(receta_itemPT:any[],itemPT:any):Promise<any>{

    /**
     * Obtiene la tabla de costos del item segun la receta 
     */

    let recursoItemPT = itemPT.RECURSOPONDE==null?0:parseFloat(itemPT.RECURSOPONDE);
    
    let tablaCostosItemPT!:any;

    let costoRecursoEstandar:number =  (parseFloat(this.promedios_localidad[0].promedio_recurso)/this.trm_moneda);
    let costoAdministracionEstandar:number = parseFloat(this.promedios_localidad[0].promedio_administracion)/(this.trm_moneda);
    let costoRecursoItemPT:number = recursoItemPT/(this.trm_moneda);
    
    //let merma:number = 0;
    let totalArticulos =0;
    let totalCostoPTSAP = 0;
    let totalEmpaque=0;
    let totalMPsemana0=0;
    let totalMPsemana1=0;
    let totalMPsemana2=0;

    let costoVentaPTsemana0 = 0;
    let costoVentaPTsemana1 = 0;
    let costoVentaPTsemana2 = 0;
    let costoVentaPTSAP =0;
    let costoTotalPTsemana0 = 0;
    let costoTotalPTsemana1 = 0;
    let costoTotalPTsemana2 = 0;
    let costoTotalPTSAP =0;

    let detalle_receta:any[] = [];
    let merma:number = 0;

    for(let item of receta_itemPT){
      ////////////////////////////console.log(item);
      item.merma=0;
       merma = !receta_itemPT[0].merma?0:receta_itemPT[0].merma;
      if(item.COSTO ===null || isNaN(item.COSTO)){
       item.COSTO=0;
      }
      if(item.costoSAP ===null || isNaN(item.costoSAP)){
       item.costoSAP=0;
      }
      item.precioItem = (item.costoSAP/parseFloat(item.Quantity))/this.trm_moneda;

      if(item.Code.startsWith('MP')){
        totalArticulos+=parseFloat(item.Quantity);
      }

      let costoEmpaque =0;
      let costoMPseman0 =0;
      let costoMPseman1 =0;
      let costoMPseman2=0;
      let precioEmpaque=0;
       
      let presentacion_item:any[any] = this.presentacion_items.filter(data => data.presentacion == item.EMPAQUE);
      if(presentacion_item.length>0){
         costoEmpaque = (parseFloat(presentacion_item[0].valor)*parseFloat(item.Quantity))/(this.trm_moneda);
         precioEmpaque = (parseFloat(presentacion_item[0].valor)/this.trm_moneda);
      }

      let preciosMPItemUltimasSemanas = await this.getPreciosMPItemUltimasSemanas(item.Code);
      if(preciosMPItemUltimasSemanas.length>0){
        if(preciosMPItemUltimasSemanas.length==1){
          //this.messageService.add({severity:'warn', summary: '!Advertencia', detail: `Para la materia prima ${item.ItemName} no se encontraron precios para la semana 1 y 2`});
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
          //this.messageService.add({severity:'warn', summary: '!Advertencia', detail: `Para la materia prima ${item.ItemName} no se encontraron precios para la semana  2`});
          preciosMPItemUltimasSemanas.push({
            anio:0,
            semanaAnioLista:0,
            precioNac:0
          })
        }
        
        
        costoMPseman0 =(parseFloat(preciosMPItemUltimasSemanas[0].precioNac)*(this.trm_dia)*parseFloat(item.Quantity))/this.trm_moneda;
        costoMPseman1 =(parseFloat(preciosMPItemUltimasSemanas[1].precioNac)*(this.trm_dia)*parseFloat(item.Quantity))/this.trm_moneda;
        costoMPseman2 =(parseFloat(preciosMPItemUltimasSemanas[2].precioNac)*(this.trm_dia)*parseFloat(item.Quantity))/this.trm_moneda;

      } 

      item.costoSAP=(parseFloat(item.Quantity)*parseFloat(item.COSTO))/this.trm_moneda;
      totalCostoPTSAP+=(parseFloat(item.Quantity)*parseFloat(item.COSTO))/this.trm_moneda;
      totalEmpaque+=costoEmpaque;
      totalMPsemana0+=costoMPseman0;
      totalMPsemana1+=costoMPseman1;
      totalMPsemana2+=costoMPseman2;

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
            recursoMP:costoRecursoEstandar,
            costoVentaMP:costoMPseman0+costoEmpaque+costoRecursoEstandar,
            administracionMP: costoAdministracionEstandar,
            costoTotalMP:costoMPseman0+costoEmpaque+costoRecursoEstandar+costoAdministracionEstandar
            
          },
          semana1: {
            anio:preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[1].anio:0,
            semana:preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[1].semanaAnioLista:0,
            precioMP:preciosMPItemUltimasSemanas.length>0?(parseFloat(preciosMPItemUltimasSemanas[1].precioNac)*(this.trm_dia)/this.trm_moneda):0,
            precioEmpaque,
            costoMP:costoMPseman1,
            empaqueMP:costoEmpaque,
            recursoMP:costoRecursoEstandar,
            costoVentaMP:costoMPseman1+costoEmpaque+costoRecursoEstandar,
            administracionMP: costoAdministracionEstandar,
            costoTotalMP:costoMPseman1+costoEmpaque+costoRecursoEstandar+costoAdministracionEstandar
          },
          semana2: {
            anio:preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[2].anio:0,
            semana:preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[2].semanaAnioLista:0,
            precioMP:preciosMPItemUltimasSemanas.length>0?(parseFloat(preciosMPItemUltimasSemanas[2].precioNac)*(this.trm_dia)/this.trm_moneda):0,
            precioEmpaque,
            costoMP:costoMPseman2,
            empaqueMP:costoEmpaque,
            recursoMP:costoRecursoEstandar,
            costoVentaMP:costoMPseman2+costoEmpaque+costoRecursoEstandar,
            administracionMP: costoAdministracionEstandar,
            costoTotalMP:costoMPseman2+costoEmpaque+costoRecursoEstandar+costoAdministracionEstandar
          },
        },
        
      });

    }

    

    let costoMermaSAP= merma*totalCostoPTSAP;
    let costoMermaS0 = (merma)*(totalMPsemana0+totalEmpaque);
    let costoMermaS1 = (merma)*(totalMPsemana1+totalEmpaque);
    let costoMermaS2 = (merma)*(totalMPsemana2+totalEmpaque);

    //costoVentaPTsemana0 = costoMermaS0+totalMPsemana0+totalEmpaque+costoRecursoEstandar;
    //costoVentaPTsemana1 = costoMermaS1+totalMPsemana1+totalEmpaque+costoRecursoEstandar;
    //costoVentaPTsemana2 = costoMermaS2+totalMPsemana2+totalEmpaque+costoRecursoEstandar;

    costoVentaPTsemana0 = costoMermaS0+totalMPsemana0+totalEmpaque+costoRecursoItemPT;
    costoVentaPTsemana1 = costoMermaS1+totalMPsemana1+totalEmpaque+costoRecursoItemPT;
    costoVentaPTsemana2 = costoMermaS2+totalMPsemana2+totalEmpaque+costoRecursoItemPT;

    costoVentaPTSAP = costoMermaSAP+totalCostoPTSAP+costoRecursoItemPT;

    //////////////////console.log(costoVentaPTSAP);

    costoTotalPTsemana0 = costoVentaPTsemana0 + costoAdministracionEstandar;
    costoTotalPTsemana1 = costoVentaPTsemana1 + costoAdministracionEstandar;
    costoTotalPTsemana2 = costoVentaPTsemana2 + costoAdministracionEstandar;
    costoTotalPTSAP = costoVentaPTSAP+ costoAdministracionEstandar;


    tablaCostosItemPT = {
      costoRecursoEstandar,
      costoAdministracionEstandar,
      costoRecursoItemPT,
      merma,
      detalle_receta,
      totalArticulos,
      totalCostoPTSAP,
      totalEmpaque,
      totalMPsemana0,
      totalMPsemana1,
      totalMPsemana2,
      costoMermaSAP,
      costoMermaS0,
      costoMermaS1,
      costoMermaS2,
      costoVentaPTSAP,
      costoVentaPTsemana0,
      costoVentaPTsemana1,
      costoVentaPTsemana2,
      costoTotalPTSAP,
      costoTotalPTsemana0,
      costoTotalPTsemana1,
      costoTotalPTsemana2,
      recurso:'',
      otrosCostos:this.otrosCostos
    }
   
    
   
    return tablaCostosItemPT;
  }

  async setTablaCalculadora2(arrayCostosItemsPT:any[]):Promise<void>{
    this.tablaCalculadora = [];
    this.tablaCalculadoraCostos = [];
    //////console.log(arrayCostosItemsPT);
    for(let item of arrayCostosItemsPT){

        //////////////////////console.log(item.listaPrecioSugerido, item.listaPreciosSAP)

        let precioBaseCalculo = await this.getPrecioBaseCalculo(item.listaPreciosSAP,'SAP');
        let precioBaseCalculo2 = await this.getPrecioBaseCalculo(item.listaPrecioSugerido,'Sugerido');
                
        //////////////////////////////console.log(precioBaseCalculo2,item.tablaCostosItemPT.costoTotalPTsemana2);
        ////////////////////////////////console.log(((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoTotalPTsemana2)/(precioBaseCalculo/(this.trm_moneda)));
        this.tablaCalculadora.push({
          linea:1,
          ItemCode:item.ItemCode,
          ItemName:item.ItemName,
          lpGerente:item.listaPreciosSAP.length==0?0:item.listaPreciosSAP[0].LPGERENTE/(this.trm_moneda),
          lpVendedor:item.listaPreciosSAP.length==0?0:item.listaPreciosSAP[0].LPVENDEDOR/(this.trm_moneda),
          lPrecio:item.listaPreciosSAP.length==0?0:item.listaPreciosSAP[0].LP/(this.trm_moneda),
          precioMercado:item.precioMercado/(this.trm_moneda),
          precioVentaPT:item.precioVentaSAP/(this.trm_moneda),
          /*brutoS0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTsemana0)/this.costoVentaPTsemana0,
          totalS0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTsemana0)/this.costoTotalPTsemana0,
          brutoS1: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTsemana1)/this.costoVentaPTsemana1,
          totalS1: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTsemana1)/this.costoTotalPTsemana1,
          brutoS2: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTsemana2)/this.costoVentaPTsemana2,
          totalS2: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTsemana2)/this.costoTotalPTsemana2,*/
          brutoS0: precioBaseCalculo==0?0:((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoVentaPTsemana0)/(precioBaseCalculo/(this.trm_moneda)),
          totalS0: precioBaseCalculo==0?0:((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoTotalPTsemana0)/(precioBaseCalculo/(this.trm_moneda)),
          brutoS1: precioBaseCalculo==0?0: ((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoVentaPTsemana1)/(precioBaseCalculo/(this.trm_moneda)),
          totalS1: precioBaseCalculo==0?0:((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoTotalPTsemana1)/(precioBaseCalculo/(this.trm_moneda)),
          brutoS2: precioBaseCalculo==0?0:((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoVentaPTsemana2)/(precioBaseCalculo/(this.trm_moneda)),
          totalS2: precioBaseCalculo==0?0:((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoTotalPTsemana2)/(precioBaseCalculo/(this.trm_moneda)),
          costoVentaPTsemana0:item.tablaCostosItemPT.costoVentaPTsemana0,
          costoTotalPTsemana0: item.tablaCostosItemPT.costoTotalPTsemana0,
          recurso:item.tablaCostosItemPT.recurso,
          costoRecurso:item.tablaCostosItemPT.costoRecursoItemPT,
          brutoS0SAP: precioBaseCalculo==0?0:((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoVentaPTSAP)/(precioBaseCalculo/(this.trm_moneda)),
          totalS0SAP: precioBaseCalculo==0?0:((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoTotalPTSAP)/(precioBaseCalculo/(this.trm_moneda)),
          costoVentaPTSAP:item.tablaCostosItemPT.costoVentaPTSAP,
          costoTotalPTSAP:item.tablaCostosItemPT.costoTotalPTSAP,
          otrosCostos:item.tablaCostosItemPT.otrosCostos
    
        },
        {
          linea:2,
          ItemCode:item.ItemCode,
          ItemName:item.ItemName,
          /*lpGerente:this.precioGerente,
          lpVendedor:this.precioVendedor,
          lPrecio:this.precioLista,*/
          lpGerente:item.listaPrecioSugerido.length>0?item.listaPrecioSugerido[0].precioGerente/(this.trm_moneda):0,
          lpVendedor:item.listaPrecioSugerido.length>0?item.listaPrecioSugerido[0].precioVendedor/(this.trm_moneda):0,
          lPrecio:item.listaPrecioSugerido.length>0?item.listaPrecioSugerido[0].precioLista/(this.trm_moneda):0,
          precioMercado:item.precioMercado/(this.trm_moneda),
          precioVentaPT:item.precioVentaSAP/(this.trm_moneda),
          /*brutoS0: (this.precioBaseCalculo2 - this.costoVentaPTsemana0)/this.costoVentaPTsemana0,
          totalS0: (this.precioBaseCalculo2 - this.costoTotalPTsemana0)/this.costoTotalPTsemana0,
          brutoS1: (this.precioBaseCalculo2 - this.costoVentaPTsemana1)/this.costoVentaPTsemana1,
          totalS1: (this.precioBaseCalculo2 - this.costoTotalPTsemana1)/this.costoTotalPTsemana1,
          brutoS2: (this.precioBaseCalculo2 - this.costoVentaPTsemana2)/this.costoVentaPTsemana2,
          totalS2: (this.precioBaseCalculo2 - this.costoTotalPTsemana2)/this.costoTotalPTsemana2,*/
          brutoS0: precioBaseCalculo2==0?0:(precioBaseCalculo2/this.trm_moneda - item.tablaCostosItemPT.costoVentaPTsemana0)/(precioBaseCalculo2/this.trm_moneda),
          totalS0: precioBaseCalculo2==0?0:(precioBaseCalculo2/this.trm_moneda - item.tablaCostosItemPT.costoTotalPTsemana0)/(precioBaseCalculo2/this.trm_moneda),
          brutoS1: precioBaseCalculo2==0?0:(precioBaseCalculo2/this.trm_moneda - item.tablaCostosItemPT.costoVentaPTsemana1)/(precioBaseCalculo2/this.trm_moneda),
          totalS1: precioBaseCalculo2==0?0:(precioBaseCalculo2/this.trm_moneda - item.tablaCostosItemPT.costoTotalPTsemana1)/(precioBaseCalculo2/this.trm_moneda),
          brutoS2: precioBaseCalculo2==0?0:(precioBaseCalculo2/this.trm_moneda - item.tablaCostosItemPT.costoVentaPTsemana2)/(precioBaseCalculo2/this.trm_moneda),
          totalS2: precioBaseCalculo2==0?0:(precioBaseCalculo2/this.trm_moneda - item.tablaCostosItemPT.costoTotalPTsemana2)/(precioBaseCalculo2/this.trm_moneda),
          costoVentaPTsemana0:item.tablaCostosItemPT.costoVentaPTsemana0,
          costoTotalPTsemana0: item.tablaCostosItemPT.costoTotalPTsemana0,
          recurso:item.tablaCostosItemPT.recurso,
          costoRecurso:item.tablaCostosItemPT.costoRecursoItemPT,
          brutoS0SAP: precioBaseCalculo==0?0:((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoVentaPTSAP)/(precioBaseCalculo/(this.trm_moneda)),
          totalS0SAP: precioBaseCalculo==0?0:((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoTotalPTSAP)/(precioBaseCalculo/(this.trm_moneda)),
          costoVentaPTSAP:item.tablaCostosItemPT.costoVentaPTSAP,
          costoTotalPTSAP:item.tablaCostosItemPT.costoTotalPTSAP,
          otrosCostos:item.tablaCostosItemPT.otrosCostos
        });

        this.tablaCalculadoraCostos.push({
          linea:1,
          ItemCode:item.ItemCode,
          ItemName:item.ItemName,
          lpGerente:item.listaPreciosSAP.length==0?0:item.listaPreciosSAP[0].LPGERENTE/(this.trm_moneda),
          lpVendedor:item.listaPreciosSAP.length==0?0:item.listaPreciosSAP[0].LPVENDEDOR/(this.trm_moneda),
          lPrecio:item.listaPreciosSAP.length==0?0:item.listaPreciosSAP[0].LP/(this.trm_moneda),
          precioMercado:item.precioMercado/(this.trm_moneda),
          precioVentaPT:item.precioVentaSAP/(this.trm_moneda),
          /*brutoS0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTSAP)/this.costoVentaPTSAP,
          totalS0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTSAP)/this.costoTotalPTSAP,*/
          brutoS0: precioBaseCalculo==0?0:((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoVentaPTSAP)/(precioBaseCalculo/(this.trm_moneda)),
          totalS0: precioBaseCalculo==0?0:((precioBaseCalculo/(this.trm_moneda)) - item.tablaCostosItemPT.costoTotalPTSAP)/(precioBaseCalculo/(this.trm_moneda)),
          costoVentaPTSAP:item.tablaCostosItemPT.costoVentaPTSAP,
          costoTotalPTSAP:item.tablaCostosItemPT.costoTotalPTSAP,
          recurso:item.tablaCostosItemPT.recurso,
          costoRecurso:item.tablaCostosItemPT.costoRecursoItemPT,
          otrosCostos:item.tablaCostosItemPT.otrosCostos
        },
        {
          linea:2,
          ItemCode:item.ItemCode,
          ItemName:item.ItemName,
          /*lpGerente:this.precioGerente,
          lpVendedor:this.precioVendedor,
          lPrecio:this.precioLista,*/
          lpGerente:item.listaPrecioSugerido.length>0?item.listaPrecioSugerido[0].precioGerente/(this.trm_moneda):0,
          lpVendedor:item.listaPrecioSugerido.length>0?item.listaPrecioSugerido[0].precioVendedor/(this.trm_moneda):0,
          lPrecio:item.listaPrecioSugerido.length>0?item.listaPrecioSugerido[0].precioLista/(this.trm_moneda):0,
          precioMercado:item.precioMercado/(this.trm_moneda),
          precioVentaPT:item.precioVentaSAP/(this.trm_moneda),
          /*brutoS0: (this.precioBaseCalculo2 - this.costoVentaPTSAP)/this.costoVentaPTSAP,
          totalS0: (this.precioBaseCalculo2 - this.costoTotalPTSAP)/this.costoTotalPTSAP,*/
          brutoS0: precioBaseCalculo2==0?0:(precioBaseCalculo2/this.trm_moneda - item.tablaCostosItemPT.costoVentaPTSAP)/(precioBaseCalculo2/this.trm_moneda),
          totalS0: precioBaseCalculo2==0?0:(precioBaseCalculo2/this.trm_moneda - item.tablaCostosItemPT.costoTotalPTSAP)/(precioBaseCalculo2/this.trm_moneda),
          costoVentaPTSAP:item.tablaCostosItemPT.costoVentaPTSAP,
          costoTotalPTSAP:item.tablaCostosItemPT.costoTotalPTSAP,
          recurso:item.tablaCostosItemPT.recurso,
          costoRecurso:item.tablaCostosItemPT.costoRecursoItemPT,
          otrosCostos:item.tablaCostosItemPT.otrosCostos
        })


    }

    ////////////////////////console.log(this.tablaCalculadora, this.tablaCalculadoraCostos,arrayCostosItemsPT);
  }
   

  async clearItem(){
    
    this.detalle_receta = [];
    this.tablaCalculadora = [];
    this.tablaCalculadoraCostos = [];
    

    //await this.setTablaCalculadora()

    this.costoVentaPTsemana0 = 0;
    this.costoVentaPTsemana1 = 0;
    this.costoVentaPTsemana2 = 0;
    this.costoVentaPTSAP = 0;

    this.costoTotalPTsemana0 = 0;
    this.costoTotalPTsemana1 = 0;
    this.costoTotalPTsemana2 = 0;
    this.costoTotalPTSAP = 0;

    this.totalMPsemana0 =0;
    this.totalMPsemana1 =0;
    this.totalMPsemana2 =0;

    this.totalEmpaque = 0;

    this.totalCostoPTSAP =0;

    this.precioVentaSAPPT =0;

    this.precioPromedioMercadoPT =0;


    this.merma =0.01;

    this.precioGerente = 0;

    this.prcGerente = 0;

    this.precioVendedor =0;

    this.prcVendedor =0;

    this.precioLista = 0 ;

    this.prcLPrecio =0;

  }

  async getPreciosListaItemSAP2(ItemCode:string):Promise<any>{
     
    //let listaPreciosSAP$ =  this.comprasService.getPreciosListaItemSAP(this.authService.getToken(),ItemCode);
    //let listaPreciosSAP:any[] = await lastValueFrom(listaPreciosSAP$);

    let listaPreciosSAP:any[] = this.tabla_lista_precios_sap.filter(item => item.ItemCode === ItemCode);

    if(listaPreciosSAP.length ===0 ){
      listaPreciosSAP.push({
        ItemCode,
        ItemName:'',
        Currency:'',
        LPGERENTE:0,
        LPVENDEDOR:0,
        LP:0,
        PriceList:0
      });
    }

    //////////////////////////////console.log(listaPreciosSAP);
    return listaPreciosSAP;
  }

  getPreciosListaItemSAP(ItemCode:string){
  //Obtener precios de lista
  this.comprasService.getPreciosListaItemSAP(this.authService.getToken(),ItemCode)
  .subscribe({
      next:(preciosListaItem)=>{
          //////////////////////////////////////console.log('preciosListaItem',preciosListaItem);
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

  async getPreciosListaSugeridos2(ItemCode:string):Promise<any>{
      //let listaPreciosSugerido$ = this.comprasService.getPreciosListaSugeridos(this.authService.getToken(),ItemCode);
      //let listaPreciosSugerido:any[] = await lastValueFrom(listaPreciosSugerido$);

      let listaPreciosSugerido:any[] = this.tabla_precios_sugeridos.filter(item => item.ItemCode === ItemCode);

      if(listaPreciosSugerido.length ===0 ){
        listaPreciosSugerido.push({
          ItemCode,
          ItemName:'',
          precioGerente:0,
          precioLista:0,
          precioVendedor:0
        });
      }
      return listaPreciosSugerido;
  } 

   getPreciosListaSugeridos(ItemCode:string){
    //Obtener precios de lista
    this.comprasService.getPreciosListaSugeridos(this.authService.getToken(),ItemCode)
    .subscribe({
        next:(preciosListaItem)=>{
            //////////////////////////////console.log('preciosListSugeridosItem',preciosListaItem);
            this.preciosListSugeridosItem = preciosListaItem;
            this.checkPreciosListaSugeridosItem = true;
            if(preciosListaItem.length==0){
              this.messageService.add({severity:'warn', summary: '!Error', detail: "No se encontro lista de precios sugeridos para el item seleccionado"});
              this.preciosListSugeridosItem.push({

                precioGerente:0,
                precioVendedor:0,
                precioLista:0

              })
              
            }else{
              this.precioGerente = preciosListaItem[0].precioGerente;
              this.precioVendedor = preciosListaItem[0].precioVendedor;
              this.cambioPrecioVendedor(this.precioVendedor)
              this.precioLista = preciosListaItem[0].precioLista;
              this.cambioPrecioLP(this.precioLista);
            }
            this.getPreciosListaItemSAP(this.item.ItemCode);
            //this.getPrecioMercadoItemSemana(this.item.ItemCode, this.semanaAnio, this.fecha.getFullYear()) ; 
            
        },
        error:(err)=>{
          console.error(err);
        }
    });
}

  async getPrecioVentaItemSAP2(item: string):Promise<any>{  
    let precioVentaSAP=0;


   /* let fechaFin = new Date(this.fecha);
    let fechaInicio = await this.sumarDias(fechaFin,-14);
    //////////////////////////////////////console.log(this.fecha,fechaFin);

   
    let data = {
      item,
      fechaInicio:fechaInicio.toISOString(),
      fechaFin:this.fecha.toISOString()
    }*/
    //Webservice XE SAP
    //let precioVentaItemSAP$ = this.comprasService.getPrecioVentaItemSAP(this.authService.getToken(),data);

    //Webservice Mysql
    //let precioVentaItemSAP$ = this.comprasService.getPrecioVentaItemSAP2(this.authService.getToken(),data);
    //let precioVentaItemSAP = await lastValueFrom(precioVentaItemSAP$);


    let precioVentaItemSAP:any[] = this.tabla_precios_venta_sap.filter(itempt => itempt.ItemCode == item )

    ////////////////////////////////console.log(precioVentaItemSAP);

    if(precioVentaItemSAP.length>0){
      precioVentaSAP = precioVentaItemSAP[0].PRECIO;
      
    }else{
      //this.messageService.add({severity:'warn', summary: '!Error', detail: "No se encontraron  precios de venta en SAP para el item seleccionado"});
    }

    return precioVentaSAP;
  } 

  async getPrecioVentaItemSAP(item: string){

    let fechaFin = new Date(this.fecha);
    let fechaInicio = await this.sumarDias(fechaFin,-14);
    //////////////////////////////////////console.log(this.fecha,fechaFin);

   
    let data = {
      item,
      fechaInicio:fechaInicio.toISOString(),
      fechaFin:this.fecha.toISOString()
    }

    //////////////////////////////////////console.log(data);
    this.comprasService.getPrecioVentaItemSAP(this.authService.getToken(),data)
        .subscribe({
            next:(precioVentaItem)=>{
              ////////////////////////////////////console.log('precioVentaItem',precioVentaItem);
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


  async getPrecioMercadoItemSemana2(ItemCode:string,semanaAnio:number,anio:number): Promise<any>{
      
      let fechaFin = new Date(this.fecha);
      let fechaInicio = await this.sumarDias(fechaFin,-14);

      //////////////////////////////console.log(fechaInicio,this.fecha)

      //let precioMercadoItemSemana$ = this.comprasService.getPrecioMercadoItemSemana(this.authService.getToken(),ItemCode, semanaAnio, anio, fechaInicio.toISOString(), this.fecha.toISOString());
      //let precioMercadoItemSemana = await lastValueFrom(precioMercadoItemSemana$);

     // let precioMercadoItemSemana2 = this.tabla_precios_pt_zona.filter(  item => item.ItemCode === ItemCode && item.anio === anio  && (  this.validDateInRange(new Date(item.fechaLista), new Date(fechaInicio), new Date(this.fecha))));

     let precioMercadoItemSemana = this.tabla_precios_pt_zona.filter((item) =>{
        return (item.ItemCode === ItemCode && item.anio === anio && item.semanaAnioLista >=semanaAnio-2);
     });
      //////////////////////////////console.log('precioMercadoItemSemana2',precioMercadoItemSemana);

      let total_precio = 0;
      let iterador = 1;
      for(let item of precioMercadoItemSemana){
          total_precio+=item.precio;
          iterador++;
      }

      let precioPromedioMercadoPT = ((total_precio/iterador)/this.trm_moneda);

      return precioPromedioMercadoPT;

  }

  async validDateInRange(dateTovalid:Date, initRange:Date, endRange:Date): Promise<boolean>{
    let validDate:boolean = false;

    if(dateTovalid>= initRange && dateTovalid <= endRange){
      validDate = true;
    }
    ////////////////////////////console.log(dateTovalid,initRange,endRange,validDate);

    return validDate;
  }



  async getPrecioMercadoItemSemana(ItemCode:string,semanaAnio:number,anio:number){
    //Obtener precio promedio del mercado del item PT  de la semana del año seleccionado
    let fechaFin = new Date(this.fecha);
    let fechaInicio = await this.sumarDias(fechaFin,-14);
    
    this.comprasService.getPrecioMercadoItemSemana(this.authService.getToken(),ItemCode, semanaAnio, anio, fechaInicio.toISOString(), this.fecha.toISOString())
    .subscribe({
        next:(precioMercadoItemSemana)=>{
            ////////////////////////////////////////console.log('preciosMercadoItemSemana',precioMercadoItemSemana);
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
  
  

 
  async getItemsMPbyItemPT(ItemCode:string){

    if(ItemCode!='ME2070005'){
      this.comprasService.getItemsMPbyItemPT(this.authService.getToken(),this.item.ItemCode)
      .subscribe({
          next:async (itemsMP)=>{
              
              //////////////////////////////////console.log('Receta',itemsMP);
  
  
              //this.trm_dia;
              let recursoPT:number = (parseFloat(this.promedios_localidad[0].promedio_recurso)/this.trm_moneda);
              let administracion:number =  parseFloat(this.promedios_localidad[0].promedio_administracion)/(this.trm_moneda);
              this.recursoPTSAP = parseFloat(this.item.RECURSOPONDE)/(this.trm_moneda);
              this.recursoPT = recursoPT;
              ////////////////console.log('getItemsMPbyItemPT recursoPT',this.recursoPT);
              this.administracion = administracion;

              this.merma =0;
  
              //////////////////////////////////console.log( this.recursoPT , this.administracion);  
  
  
              this.setPrecioBase();
              /*
              let costo_itemMP_semana0:number =0;
              let costo_itemMP_semana1:number =0;
              let costo_itemMP_semana2:number =0;
              let costo_empaqueMP_item:number = 0;
              */
              let costoVentaPTsemana0 = 0;
              let costoVentaPTsemana1 = 0;
              let costoVentaPTsemana2 = 0;
  
              let costoTotalPTsemana0 = 0;
              let costoTotalPTsemana1 = 0;
              let costoTotalPTsemana2 = 0;
  
              let totalEmpaque=0;
              let totalMPsemana0=0;
              let totalMPsemana1=0;
              let totalMPsemana2=0;
              let cantidadArticulos =0;
  
              let totalCostoPTSAP = 0;
  
           
  
              let detalle_receta:any[] = [];
              

              

              ////////////////////////////////console.log(itemsMP);
  
              for(let item of itemsMP){
              
                
                    item.merma=0;

                    if(item.COSTO ===null || isNaN(item.COSTO)){
                      item.COSTO=0;
                    }

                    if(item.costoSAP ===null || isNaN(item.costoSAP)){
                      item.costoSAP=0;
                    }

                    item.precioItem = (parseFloat(item.costoSAP)/parseFloat(item.Quantity))/this.trm_moneda;

                    /////////////////////////////////console.log(item);

                    if(item.Code.startsWith('MP')){
                      cantidadArticulos+=parseFloat(item.Quantity);
                    }
  
                    let costoEmpaque =0;
                    let costoMPseman0 =0;
                    let costoMPseman1 =0;
                    let costoMPseman2=0;
                    let precioEmpaque=0;
                
                    let presentacion_item:any[any] = this.presentacion_items.filter(data => data.presentacion == item.EMPAQUE);
                    //////////////////////////////////////////console.log('presentacion_item',item.Code,presentacion_item)
                    if(presentacion_item.length>0){
                      //////////////////////////////////////////console.log(presentacion_item[0].valor,item.Quantity,trm_dia);
                      //costo_empaqueMP_item +=(parseFloat(presentacion_item[0].valor)*parseFloat(item.Quantity))/(this.trm_moneda);
                      costoEmpaque = (parseFloat(presentacion_item[0].valor)*parseFloat(item.Quantity))/(this.trm_moneda);
                      precioEmpaque = (parseFloat(presentacion_item[0].valor)/this.trm_moneda);
                    } 
  
                    let preciosMPItemUltimasSemanas = await this.getPreciosMPItemUltimasSemanas(item.Code);
                    //////////////////////////////////////console.log('preciosMPItemUltimasSemanas',item.Code,preciosMPItemUltimasSemanas)
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
                    
                      
                      costoMPseman0 =(parseFloat(preciosMPItemUltimasSemanas[0].precioNac)*(this.trm_dia)*parseFloat(item.Quantity))/this.trm_moneda;
                      costoMPseman1 =(parseFloat(preciosMPItemUltimasSemanas[1].precioNac)*(this.trm_dia)*parseFloat(item.Quantity))/this.trm_moneda;
                      costoMPseman2 =(parseFloat(preciosMPItemUltimasSemanas[2].precioNac)*(this.trm_dia)*parseFloat(item.Quantity))/this.trm_moneda;
      
                    } 
  
                    totalCostoPTSAP+=(parseFloat(item.Quantity)*parseFloat(item.COSTO))/this.trm_moneda;
  
                    totalEmpaque+=costoEmpaque;
                    totalMPsemana0+=costoMPseman0;
                    totalMPsemana1+=costoMPseman1;
                    totalMPsemana2+=costoMPseman2;
                
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
  
              /*////////////////////////////////////////console.log(`Costo MP de PT ${ItemCode}:`,costo_itemMP_semana0);
              ////////////////////////////////////////console.log(`Costo Empaque MP de PT ${ItemCode}:`,costo_empaqueMP_item);
              ////////////////////////////////////////console.log(`Costo Recurso de PT ${ItemCode}:`,recursoPT);
              let costoVentaPT:number = (costo_itemMP_semana0+costo_empaqueMP_item+recursoPT);
              ////////////////////////////////////////console.log(`Costo Venta PT ${ItemCode}:`,costoVentaPT);
              let costoTotalPT:number = (costoVentaPT+administracion);
              ////////////////////////////////////////console.log(`Costo Total PT ${ItemCode}:`,costoTotalPT);
              ////////////////////////////////////////console.log('detalle_receta',detalle_receta);
              */

              this.totalCostoPTSAP = totalCostoPTSAP;
              this.totalEmpaque = totalEmpaque;
              this.totalMPsemana0 = totalMPsemana0;
              this.totalMPsemana1 = totalMPsemana1;
              this.totalMPsemana2 = totalMPsemana2;



              this.totalCantidadArticulos = cantidadArticulos;
  
              this.detalle_receta = detalle_receta;
              
              
              let costoMermaSAP= this.merma*this.totalCostoPTSAP;
              let costoMermaS0 = (this.merma)*(this.totalMPsemana0+this.totalEmpaque);
              let costoMermaS1 = (this.merma)*(this.totalMPsemana1+this.totalEmpaque);
              let costoMermaS2 = (this.merma)*this.totalMPsemana2+this.totalEmpaque;
  
              this.costoVentaPTsemana0 = costoMermaS0+this.totalMPsemana0+this.totalEmpaque+recursoPT;
              this.costoVentaPTsemana1 = costoMermaS1+this.totalMPsemana1+this.totalEmpaque+recursoPT;
              this.costoVentaPTsemana2 = costoMermaS2+this.totalMPsemana2+this.totalEmpaque+recursoPT;

              ////////////////////////////////console.log(this.totalCostoPTSAP);

              this.costoVentaPTSAP = costoMermaSAP+this.totalCostoPTSAP+this.recursoPTSAP;
  
              this.costoTotalPTsemana0 = this.costoVentaPTsemana0 + administracion;
              this.costoTotalPTsemana1 = this.costoVentaPTsemana1 + administracion;
              this.costoTotalPTsemana2 = this.costoVentaPTsemana2 + administracion;
              this.costoTotalPTSAP = this.costoVentaPTSAP+ administracion;
  
  
              
  
  
  
  
              this.checkItemsMPbyItemPT = true;
  
              
  
              ////////////////////////////////////////console.log(this.tablaCalculadora);
              await this.setTablaCalculadora()
              
          },
          error:(err)=>{
            console.error(err);
          }
      });
    }else{
      await this.setTablaCalculadora()
    }

    
    
  }

  async getPrecioBaseCalculo(arrayPrecios:any[],tipo:string): Promise<any>{

      //////////////////////console.log(arrayPrecios);
      let precioBaseCalculo =0;

      if(arrayPrecios.length>0){
        switch(this.precioBase.code){
            case 'LPGERENTE':
              precioBaseCalculo = tipo==='SAP'?arrayPrecios[0].LPGERENTE:arrayPrecios[0].precioGerente;
            break;
  
            case 'LPVENDEDOR':
              precioBaseCalculo = tipo==='SAP'?arrayPrecios[0].LPVENDEDOR:arrayPrecios[0].precioVendedor;
            break;
  
            case 'LP':
              precioBaseCalculo = tipo==='SAP'?arrayPrecios[0].LP:arrayPrecios[0].precioLista;
            break;
        }
      }  

      return precioBaseCalculo;
  }

 

  async setTablaCalculadora(){
    this.tablaCalculadora = [];
    this.tablaCalculadoraCostos = [];

    ////////////////////////////////console.log(this.precioBaseCalculo, this.precioBaseCalculo2,this.costoVentaPTsemana0);

    ////////////////////////////////console.log('setTablaCalculadora',this.precioGerente,this.preciosListSugeridosItem[0].precioGerente);

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
      brutoS0: this.precioBaseCalculo==0?0:((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTsemana0)/(this.precioBaseCalculo/(this.trm_moneda)),
      totalS0: this.precioBaseCalculo==0?0:((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTsemana0)/(this.precioBaseCalculo/(this.trm_moneda)),
      brutoS1: this.precioBaseCalculo==0?0: ((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTsemana1)/(this.precioBaseCalculo/(this.trm_moneda)),
      totalS1: this.precioBaseCalculo==0?0:((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTsemana1)/(this.precioBaseCalculo/(this.trm_moneda)),
      brutoS2: this.precioBaseCalculo==0?0:((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTsemana2)/(this.precioBaseCalculo/(this.trm_moneda)),
      totalS2: this.precioBaseCalculo==0?0:((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTsemana2)/(this.precioBaseCalculo/(this.trm_moneda)),


    },

    
    {
      linea:2,
      ItemCode:this.item.ItemCode,
      ItemName:this.item.ItemName,
      /*lpGerente:this.precioGerente,
      lpVendedor:this.precioVendedor,
      lPrecio:this.precioLista,*/
      lpGerente:this.precioGerente==0?this.preciosListSugeridosItem[0].precioGerente:this.precioGerente,
      lpVendedor:this.precioVendedor==0?this.preciosListSugeridosItem[0].precioVendedor:this.precioVendedor,
      lPrecio:this.precioLista==0?this.preciosListSugeridosItem[0].precioLista:this.precioLista,
      precioMercado:this.precioPromedioMercadoPT,
      precioVentaPT:this.precioVentaSAPPT,
      /*brutoS0: (this.precioBaseCalculo2 - this.costoVentaPTsemana0)/this.costoVentaPTsemana0,
      totalS0: (this.precioBaseCalculo2 - this.costoTotalPTsemana0)/this.costoTotalPTsemana0,
      brutoS1: (this.precioBaseCalculo2 - this.costoVentaPTsemana1)/this.costoVentaPTsemana1,
      totalS1: (this.precioBaseCalculo2 - this.costoTotalPTsemana1)/this.costoTotalPTsemana1,
      brutoS2: (this.precioBaseCalculo2 - this.costoVentaPTsemana2)/this.costoVentaPTsemana2,
      totalS2: (this.precioBaseCalculo2 - this.costoTotalPTsemana2)/this.costoTotalPTsemana2,*/
      brutoS0: this.precioBaseCalculo2==0?0:(this.precioBaseCalculo2 - this.costoVentaPTsemana0)/this.precioBaseCalculo2,
      totalS0: this.precioBaseCalculo2==0?0:(this.precioBaseCalculo2 - this.costoTotalPTsemana0)/this.precioBaseCalculo2,
      brutoS1: this.precioBaseCalculo2==0?0:(this.precioBaseCalculo2 - this.costoVentaPTsemana1)/this.precioBaseCalculo2,
      totalS1: this.precioBaseCalculo2==0?0:(this.precioBaseCalculo2 - this.costoTotalPTsemana1)/this.precioBaseCalculo2,
      brutoS2: this.precioBaseCalculo2==0?0:(this.precioBaseCalculo2 - this.costoVentaPTsemana2)/this.precioBaseCalculo2,
      totalS2: this.precioBaseCalculo2==0?0:(this.precioBaseCalculo2 - this.costoTotalPTsemana2)/this.precioBaseCalculo2,
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
      brutoS0: this.precioBaseCalculo==0?0:((this.precioBaseCalculo/(this.trm_moneda)) - this.costoVentaPTSAP)/(this.precioBaseCalculo/(this.trm_moneda)),
      totalS0: this.precioBaseCalculo==0?0:((this.precioBaseCalculo/(this.trm_moneda)) - this.costoTotalPTSAP)/(this.precioBaseCalculo/(this.trm_moneda)),
   
    },
    {
      linea:2,
      ItemCode:this.item.ItemCode,
      ItemName:this.item.ItemName,
      /*lpGerente:this.precioGerente,
      lpVendedor:this.precioVendedor,
      lPrecio:this.precioLista,*/
      lpGerente:this.precioGerente==0?this.preciosListSugeridosItem[0].precioGerente:this.precioGerente,
      lpVendedor:this.precioVendedor==0?this.preciosListSugeridosItem[0].precioVendedor:this.precioVendedor,
      lPrecio:this.precioLista==0?this.preciosListSugeridosItem[0].precioLista:this.precioLista,
      
      precioMercado:this.precioPromedioMercadoPT,
      precioVentaPT:this.precioVentaSAPPT,
      /*brutoS0: (this.precioBaseCalculo2 - this.costoVentaPTSAP)/this.costoVentaPTSAP,
      totalS0: (this.precioBaseCalculo2 - this.costoTotalPTSAP)/this.costoTotalPTSAP,*/
      brutoS0: this.precioBaseCalculo2==0?0:(this.precioBaseCalculo2 - this.costoVentaPTSAP)/this.precioBaseCalculo2,
      totalS0: this.precioBaseCalculo2==0?0:(this.precioBaseCalculo2 - this.costoTotalPTSAP)/this.precioBaseCalculo2,

  
    });

    //////////////////////////////////console.log(this.tablaCalculadoraCostos);
  }

  async getPreciosMPItemUltimasSemanas(ItemCode:string,semanaAnio?:number,anio?:number):Promise<any>{
    try{

      //Obtener precio de item MP de la semana del año seleccionado
      //const preciosMPItemUltimasSemanas$ =  this.comprasService.getPreciosMPItemUltimasSemanas(this.authService.getToken(),ItemCode, semanaAnio, anio)
      //const preciosMPItemUltimasSemanas$ =  this.comprasService.getPreciosMPItemUltimasSemanas(this.authService.getToken(),ItemCode)
      //const preciosMPItemUltimasSemanas = await lastValueFrom(preciosMPItemUltimasSemanas$);

      const preciosMPItemUltimasSemanas = this.tabla_lista_precios_mp.filter(item =>item.ItemCode === ItemCode);
      console.log(preciosMPItemUltimasSemanas);

      return preciosMPItemUltimasSemanas;
      /*
      this.comprasService.getPreciosMPItemUltimasSemanas(this.authService.getToken(),ItemCode, semanaAnio, anio)
      .subscribe({
          next:(preciosMPItemUltimasSemanas)=>{
              ////////////////////////////////////////console.log('preciosMPItemUltimasSemanas',preciosMPItemUltimasSemanas);
              this.preciosMPItemUltimasSemanas = preciosMPItemUltimasSemanas;
              this.checkPreciosMPItemUltimasSemanas = true;
          },
          error:(err)=>{
            console.error(err);
          }
      });
      **/

    }catch(err){
      console.error(err);
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
  
  async SeleccionarPrecioBase(){

    ////////////////////////////////////////console.log(this.precioBase);
    this.setPrecioBase();
    
    /*if(this.optionSelectItemPT){
     
      if(this.prcNeto!=0){
        await this.calcularNetoDeseado(this.prcNeto);
      }else{
        await this.setTablaCalculadora2(this.arrayCalculadoraMultiple);
      }
    }else{
      this.recalcular();
    }*/

    if(this.prcNeto!=0){
      await this.calcularNetoDeseado(this.prcNeto);
    }else{
      await this.setTablaCalculadora2(this.arrayCalculadoraMultiple);
    }

    
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
    
    this.precioVendedor = ((this.precioGerente*this.prcVendedor)/100)+this.precioGerente;
    this.precioLista = ((this.precioGerente*this.prcLPrecio)/100)+this.precioGerente;

    this.arrayCalculadoraMultiple[0].listaPrecioSugerido[0].precioGerente = valor;
    this.arrayCalculadoraMultiple[0].listaPrecioSugerido[0].precioVendedor = this.precioVendedor;
    this.arrayCalculadoraMultiple[0].listaPrecioSugerido[0].precioLista = this.precioLista;
    

    this.SeleccionarPrecioBase();
  }

  cambioPrecioGerente(event:any){
    /*let prcGerente:number =0;

    ////////////////////////////////////////console.log(event);

    if(this.precioVendedor!=0){
      prcGerente =(100*(this.precioGerente-this.precioVendedor))/this.precioVendedor;
    }

    this.prcGerente = prcGerente;
    this.SeleccionarPrecioBase();*/
  }


  cambiarPrcGerente(valor:number){
    //this.cambioPrcGerenteDB.next(valor);
  }

  cambioPrcGerente(event:any){
      /*let precioGerente:number =0;

      ////////////////////////////////////////console.log(event);

      if(this.precioVendedor!=0){
        precioGerente = ((this.precioVendedor*event.value)/100)+this.precioVendedor;
      }

      this.precioGerente = precioGerente;
      this.SeleccionarPrecioBase();*/
      
  }


  cambiarPrecioVendedor(valor:number){
    
    this.cambioPrecioVendedorDB.next(valor);
  }

  cambioPrecioVendedor(event:any){
    let prcVendedor:number =0;

    ////////////////////////////////////////console.log(event);

    if(this.precioGerente!=0){
      prcVendedor =(100*(this.precioVendedor-this.precioGerente))/this.precioGerente;
    }

    this.prcVendedor = prcVendedor;
    this.arrayCalculadoraMultiple[0].listaPrecioSugerido[0].precioVendedor = this.precioVendedor;

    this.SeleccionarPrecioBase();
  }

  cambiarPrcVendedor(valor:number){
    this.cambioPrcVendedorDB.next(valor);
  }

  cambioPrcVendedor(event:any){
      let precioVendedor:number =0;

      ////////////////////////////////////////console.log(event);

      if(this.precioGerente!=0){
        precioVendedor = ((this.precioGerente*event.value)/100)+this.precioGerente;
      }

      this.precioVendedor = precioVendedor;
      this.arrayCalculadoraMultiple[0].listaPrecioSugerido[0].precioVendedor = this.precioVendedor;
      this.SeleccionarPrecioBase();
      
  }

  
  cambiarPrecioLP(valor:number){
    this.cambioPrecioLPDB.next(valor);
  }

  cambioPrecioLP(event:any){
    let prcLP:number =0;
  
    if(this.precioGerente!=0){
      prcLP = (100*(this.precioLista-this.precioGerente))/this.precioGerente;
    }
  
    this.prcLPrecio = prcLP;
    this.arrayCalculadoraMultiple[0].listaPrecioSugerido[0].precioLista = this.precioLista;
    this.SeleccionarPrecioBase();
  }

  cambiarPrcLP(valor:number){
    this.cambioPrcLPDB.next(valor);
  }

  cambioPrcLP(event:any){
    let precioLP:number =0;

    if(this.precioGerente!=0){
      precioLP = ((this.precioGerente*event.value)/100)+this.precioGerente;
    }

    this.precioLista = precioLP;
    this.arrayCalculadoraMultiple[0].listaPrecioSugerido[0].precioLista = this.precioLista;
    this.SeleccionarPrecioBase();
}

  cambiarPrcNeto(valor:number){
    this.cambioPrcNetoDB.next(valor);
  }

  cambioPrcNeto(event:any){
    ////////////////////////////console.log(event);
    this.calcularNetoDeseado(this.prcNeto);
    //this.SeleccionarPrecioBase();
}

async calcularNetoDeseado(prcDeseado:number):Promise<void>{
  for(let item of this.arrayCalculadoraMultiple){

    //////////////////////////////console.log(item);

    let costoTotalPTsemana0 = item.tablaCostosItemPT.costoTotalPTsemana0;
    let netoS0 = costoTotalPTsemana0/((-prcDeseado/100)+1);

    //////////////////////////////console.log(netoS0);
    
    switch(this.precioBase.code){
        case 'LPGERENTE':
          item.listaPrecioSugerido[0].precioGerente = netoS0;
        break;
    
        case 'LPVENDEDOR':
          item.listaPrecioSugerido[0].precioVendedor =netoS0;
        break;
    
        case 'LP':
          item.listaPrecioSugerido[0].precioLista = netoS0;
        break;
    }
  }

  //////////////////////////////console.log(this.arrayCalculadoraMultiple);

  await this.setTablaCalculadora2(this.arrayCalculadoraMultiple);


}

async getDetalleReceta(itemsCalulados:any[]):Promise<any[]> {
  let detalle_receta:any[] = [];
  for(let item of itemsCalulados) {
    for(let lineaReceta of item.tablaCostosItemPT.detalle_receta ){
      detalle_receta.push(lineaReceta);
    }
    
  }

  
  return detalle_receta;
}

guardarCalculo(){

  this.confirmationService.confirm({
    message: `Esta usted seguro de guardar los calculos realizados`,

    accept: async () => {
        //Actual logic to perform a confirmation
        this.displayModal = true;
        this.loadingCargue = true;

        let filasCalculadas =  this.tablaCalculadora.filter(item => item.linea === 2 && item.brutoS0!=0);

        if (filasCalculadas.length==0){
          this.messageService.add({severity:'warn', summary: '!Advertencia', detail: `Al menos debe realizar el calculo de una linea`});
          this.displayModal = false;
          this.loadingCargue = false;
        }else{
          //////////////////////////console.log(filasCalculadas);
          let itemsCalulados:any[] = [];

          for(let itemCalculo of filasCalculadas){
            //////////////////////////console.log(this.arrayCalculadoraMultiple.find(item =>item.ItemCode === itemCalculo.ItemCode));
            itemsCalulados.push(this.arrayCalculadoraMultiple.find(item =>item.ItemCode === itemCalculo.ItemCode));
          }

          let detalle_calculo_mp= await this.getDetalleReceta(itemsCalulados);

          let data = {
            fecha:this.fecha,
            semanaAnio:this.semanaAnio,
            semanaMes:this.semanaMes,
            ItemCode:this.categoriaItemsPT?'': this.itemSeleted.ItemCode,
            ItemName: this.categoriaItemsPT?'': this.itemSeleted.ItemName,
            trmDia:this.trm_dia,
            moneda:this.moneda.Currency,
            trmMoneda:this.trm_moneda,
            categoria:this.categoriaItemsPT?this.categoriaItemsPT.label:'',
            precioRef:this.precioBase.code,
            precioBase:this.precioGerente,
            prcGerente:this.prcGerente,
            prcLP:this.prcLPrecio,
            prcVendedor:this.prcVendedor,
            promAdmin:this.administracion,
            promRecurso:this.recursoPT,
            costoRecursoSAP:this.recursoPTSAP,
            observacion:this.observacion,
            otrosCostos:this.arrayOtrosCostos,
            costoVentaPTsemana0:this.tablaCalculadora[0].costoVentaPTsemana0,
            costoTotalPTsemana0:this.tablaCalculadora[0].costoTotalPTsemana0,
            costoVentaPTSAP:this.tablaCalculadoraCostos[0].costoVentaPTSAP,
            costoTotalPTSAP:this.tablaCalculadoraCostos[0].costoTotalPTSAP,
            detalle_calculo_mp,
            detalle_calculo_precio_item:this.tablaCalculadora
          }

          //////console.log(data);

          this.comprasService.grabarCalculoPreciosItem(this.authService.getToken(),data)
        .subscribe({
              next:(result)=>{
                this.displayModal = false;
                this.loadingCargue = false;
                this.messageService.add({severity:'success', summary: '!Notificación', detail: `Se registro correctamente el calculo de precios realizado para el item seleccionado.`});
                setTimeout(()=>{this.router.navigate(['portal/compras/mrp/calculadora-precios']);},500);
                
              },
              error:(err)=>{
                console.error(err);
                this.messageService.add({severity:'error', summary: '!Error', detail: `Ocurrio un error al grabar el calculo:`});
              }
          });

        }
       

    }
});
  
  /*this.displayModal = true;
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
      precioBase:this.precioGerente,
      prcGerente:this.prcGerente,
      prcLP:this.prcLPrecio,
      prcVendedor:this.prcVendedor,
      promAdmin:this.administracion,
      promRecurso:this.recursoPT,
      costoRecursoSAP:this.recursoPTSAP,
      observacion:this.observacion,
      detalle_calculo_mp:this.detalle_receta,
      detalle_calculo_precio_item:this.tablaCalculadora
    }

    //////////////////////////////////////console.log(data);

    this.comprasService.grabarCalculoPreciosItem(this.authService.getToken(),data)
        .subscribe({
            next:(result)=>{
              this.displayModal = false;
              this.loadingCargue = false;
              this.messageService.add({severity:'success', summary: '!Notificación', detail: `Se registro correctamente el calculo de precios realizado para el item seleccionado.`});
              this.router.navigate(['portal/compras/mrp/calculadora-precios']);
            },
            error:(err)=>{
              console.error(err);
              this.messageService.add({severity:'error', summary: '!Error', detail: `Ocurrio un error al grabar el calculo:`});
            }
        });*/

}

grabarCambiosParametros(){
    //////////////////////////////////////console.log(this.parametros,this.costos_localidad,this.presentacion_items);
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
                    //////////////////////////////////////console.log('result',result)
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
    
    //////////////////////////////////////////console.log('ENTER PRESS');
    if(event.target.value ===''){
      event.target.value =0;
    }
    
  }
}

cambio(event:any){
  //////////////////////////////////////////console.log(event.target.value);
  if(event.target.value ===''){
    event.target.value =0;
  }
     
}

PresionaEnterCosto(event:any,costo:any){

  if (event.key === "Enter") {
   
    if(event.target.value =='' ){
      //console.log(event.target,event.target.value.length);
      event.target.value =0;
      costo.valor =0
    }
    this.cambioCosto(event,costo);
  }
}

  async cambioCosto(event:any,costo:any){
    
  if(event.target.value.length ==0){
    //console.log(costo ,event.target.value.length);
    //this.arrayOtrosCostos.find(cost =>cost.label === costo.label)
    costo.valor =0
    event.target.value =0;
  }

 this.SeleccionarRecurso();

}


PresionaEnterMP(event:any,itemCode:string){
    
  if (event.key === "Enter") {
    
    //////////////////////////////////////////console.log('ENTER PRESS');
    if(event.target.value ===''){
      event.target.value =0;
    }
    
  }
}

cambioMP(event:any,itemCode:string){
  //////////////////////////////////////////console.log(event.target.value);
  if(event.target.value ===''){
    event.target.value =0;
  }

  this.recalcularCostosLineaItemMP(event.target.value,itemCode);
}


async PresionaEnterPrecioSugeridoCalculadora(event:any,itemCode:string,tipo:string){
  if (event.key === "Enter") {
    
    //////////////////////////////////////////console.log('ENTER PRESS');
    if(event.target.value ===''){
      event.target.value =0;
    }

    await this.calcularCostosCalculadora(itemCode,tipo,event.target.value)
    
  }
}

async cambioPrecioSugeridoCalculadora(event:any,itemCode:string,tipo:string){
  if(event.target.value ===''){
    event.target.value =0;
  }

  await this.calcularCostosCalculadora(itemCode,tipo,event.target.value)
  
}


async calcularCostosCalculadora(ItemCode:string, tipo:string,valor:number):Promise<void>{


  let itemLineArrayCalculadoraRepo:any[any] = this.arrayCalculadoraMultiple.filter(item => item.ItemCode === ItemCode)[0];

  ////////////////////////////////console.log(itemLineArrayCalculadoraRepo.listaPrecioSugerido);

  switch(tipo){
    case 'LPGERENTE':
      itemLineArrayCalculadoraRepo.listaPrecioSugerido[0].precioGerente = valor*this.trm_moneda;
    break;

    case 'LPVENDEDOR':
      itemLineArrayCalculadoraRepo.listaPrecioSugerido[0].precioVendedor = valor*this.trm_moneda;
    break;

    case 'LP':
      itemLineArrayCalculadoraRepo.listaPrecioSugerido[0].precioLista = valor*this.trm_moneda;
    break;
}

////////////////////////////////console.log(this.arrayCalculadoraMultiple);
  
await this.setTablaCalculadora2(this.arrayCalculadoraMultiple);

}

async getPrecioBaseCalculoLinea(index:number):Promise<number>{
  let precioBaseCalculo =0;
  let lineaArrayCalculadora = this.tablaCalculadora[index];

  switch(this.precioBase.code){
    case 'LPGERENTE':
      precioBaseCalculo = lineaArrayCalculadora.lpGerente;
    break;

    case 'LPVENDEDOR':
      precioBaseCalculo = lineaArrayCalculadora.lpVendedor;
    break;

    case 'LP':
      precioBaseCalculo = lineaArrayCalculadora.lPrecio;
    break;
}

  return precioBaseCalculo;
}



  async recalcularCostosLineaItemMP(cantidad:number, itemCode:string){

  let indexDetalleReceta = this.detalle_receta.findIndex(item=>item.itemMP.Code == itemCode);
  //////////////////////////////////////console.log(itemCode,this.detalle_receta,indexDetalleReceta,this.detalle_receta[indexDetalleReceta]);

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

  detalleMPItems(){
    this.formDetalleCalculosItems = true;
  }

  async crearDetalleMP2(){

    if(this.arrayCalculadoraMultiple.length>0){

      if(this.detalle_receta.length==0){
        this.recursoPT = (parseFloat(this.promedios_localidad[0].promedio_recurso)/this.trm_moneda);
        ////////////////console.log('crearDetalleMP2 recursoPT',this.recursoPT);
        this.administracion =  parseFloat(this.promedios_localidad[0].promedio_administracion)/(this.trm_moneda);
        let detalle_receta:any[] = await this.setDetalleMezclaGenerica();
        let tablaCostosItemPT:any = {
          costoAdministracionEstandar:this.administracion,
          costoRecursoEstandar:this.recursoPT,
          costoRecursoItemPT:0,
          merma:0,
          totalArticulos:0,
          totalCostoPTSAP:0,
          totalEmpaque:0,
          totalMPsemana0:0,
          totalMPsemana1:0,
          totalMPsemana2:0,
          costoMermaSAP:0,
          costoMermaS0:0,
          costoMermaS1:0,
          costoMermaS2:0,
          costoVentaPTSAP:0,
          costoVentaPTsemana0:0,
          costoVentaPTsemana1:0,
          costoVentaPTsemana2:0,
          costoTotalPTSAP:0,
          costoTotalPTsemana0:0,
          costoTotalPTsemana1:0,
          costoTotalPTsemana2:0,
          detalle_receta
        }
        this.arrayCalculadoraMultiple[0].tablaCostosItemPT=tablaCostosItemPT;
        this.detalle_receta = detalle_receta;
      }
      
      //////////////////////////console.log(this.arrayCalculadoraMultiple);
      this.formCrreateDetalleCalculo = true;
    }
    
  }

 async setDetalleMezclaGenerica():Promise<any>{
      let recursoPT:number = this.recursoPT;
      let administracion:number =  this.administracion;
    
      let detalle_receta:any[] = [];
      //Empaque
      detalle_receta.push({
        itemMP:{
          COSTO:0,
          Code:'',
          EMPAQUE:0,
          Father:this.itemSeleted.ItemCode,
          ItemName:'',
          MODIFICAR:'',
          Quantity:0,
          costoSAP:0,
          merma:this.merma,
          tipo:'empaque',
          index:1,
          
        },
        costosItemMP:{
          semana0:{
            administracionMP:administracion,
            anio:0,
            costoMP:0,
            costoTotalMP:0,
            costoVentaMP:0,
            empaqueMP:0,
            precioEmpaque:0,
            precioMP:0,
            recursoMP:recursoPT,
            semana:0,
          },
          semana1:{
            administracionMP:administracion,
            anio:0,
            costoMP:0,
            costoTotalMP:0,
            costoVentaMP:0,
            empaqueMP:0,
            precioEmpaque:0,
            precioMP:0,
            recursoMP:recursoPT,
            semana:0,
          },
          semana2:{
            administracionMP:administracion,
            anio:0,
            costoMP:0,
            costoTotalMP:0,
            costoVentaMP:0,
            empaqueMP:0,
            precioEmpaque:0,
            precioMP:0,
            recursoMP:recursoPT,
            semana:0,
          }
        }

      });

      //Protector
      detalle_receta.push({
        itemMP:{
          COSTO:0,
          Code:'',
          EMPAQUE:0,
          Father:this.itemSeleted.ItemCode,
          ItemName:'',
          MODIFICAR:'',
          Quantity:0,
          costoSAP:0,
          merma:this.merma,
          tipo:'protector',
          index:2,
        },
        costosItemMP:{
          semana0:{
            administracionMP:administracion,
            anio:0,
            costoMP:0,
            costoTotalMP:0,
            costoVentaMP:0,
            empaqueMP:0,
            precioEmpaque:0,
            precioMP:0,
            recursoMP:recursoPT,
            semana:0,  
          },
          semana1:{
            administracionMP:administracion,
            anio:0,
            costoMP:0,
            costoTotalMP:0,
            costoVentaMP:0,
            empaqueMP:0,
            precioEmpaque:0,
            precioMP:0,
            recursoMP:recursoPT,
            semana:0,
          },
          semana2:{
            administracionMP:administracion,
            anio:0,
            costoMP:0,
            costoTotalMP:0,
            costoVentaMP:0,
            empaqueMP:0,
            precioEmpaque:0,
            precioMP:0,
            recursoMP:recursoPT,
            semana:0,
          }
        }

      });
      
      //Articulo
      detalle_receta.push({
        itemMP:{
          COSTO:0,
          Code:'',
          EMPAQUE:0,
          Father:this.itemSeleted.ItemCode,
          ItemName:'',
          MODIFICAR:'',
          Quantity:0,
          costoSAP:0,
          merma:this.merma,
          tipo:'articulo',
          index:3,
        },
        costosItemMP:{
          semana0:{
            administracionMP:administracion,
            anio:0,
            costoMP:0,
            costoTotalMP:0,
            costoVentaMP:0,
            empaqueMP:0,
            precioEmpaque:0,
            precioMP:0,
            recursoMP:recursoPT,
            semana:0,
          },
          semana1:{
            administracionMP:administracion,
            anio:0,
            costoMP:0,
            costoTotalMP:0,
            costoVentaMP:0,
            empaqueMP:0,
            precioEmpaque:0,
            precioMP:0,
            recursoMP:recursoPT,
            semana:0,
          },
          semana2:{
            administracionMP:administracion,
            anio:0,
            costoMP:0,
            costoTotalMP:0,
            costoVentaMP:0,
            empaqueMP:0,
            precioEmpaque:0,
            precioMP:0,
            recursoMP:recursoPT,
            semana:0,
          }
        }

      });


      return detalle_receta;

 }

  crearDetalleMP(){
    
    
    this.formCrreateDetalleCalculo = true;
    //////////////////////////console.log(this.arrayCalculadoraMultiple);
    if(this.detalle_receta.length===0){

      let recursoPT:number = (parseFloat(this.promedios_localidad[0].promedio_recurso)/this.trm_moneda);
      let administracion:number =  parseFloat(this.promedios_localidad[0].promedio_administracion)/(this.trm_moneda);
      //this.recursoPTSAP = parseFloat(this.item.RECURSOPONDE)/(this.trm_moneda);
      this.recursoPT = recursoPT;
      ////////////////console.log('crearDetalleMP recursoPT',this.recursoPT);
      this.administracion = administracion;

      let detalle_receta:any[] = [];

      detalle_receta.push({
        itemMP:{
          Code:'',
          ItemName:'',
          EMPAQUE:0,
          Quantity:0,
          costo:0,
          costoSAP:0,
          tipo:'empaque',
          index:1,
          merma:this.merma
        },
        costosItemMP:{
          semana0:{
            anio:0,
            semana:0,
            precioMP:0,
            precioEmpaque:0,
            costoMP:0,
            empaqueMP:0,
  
          },
          semana1:{
            anio:0,
            semana:0,
            precioMP:0,
            precioEmpaque:0,
            costoMP:0,
            empaqueMP:0,
          },
          semana2:{
            anio:0,
            semana:0,
            precioMP:0,
            precioEmpaque:0,
            costoMP:0,
            empaqueMP:0,
          }
        }
  
      });

      detalle_receta.push({
        itemMP:{
          Code:'',
          ItemName:'',
          EMPAQUE:0,
          Quantity:0,
          costo:0,
          costoSAP:0,
          tipo:'protector',
          index:2,
          merma:this.merma
        },
        costosItemMP:{
          semana0:{
            anio:0,
            semana:0,
            precioMP:0,
            precioEmpaque:0,
            costoMP:0,
            empaqueMP:0,
  
          },
          semana1:{
            anio:0,
            semana:0,
            precioMP:0,
            precioEmpaque:0,
            costoMP:0,
            empaqueMP:0,
          },
          semana2:{
            anio:0,
            semana:0,
            precioMP:0,
            precioEmpaque:0,
            costoMP:0,
            empaqueMP:0,
          }
        }
  
      });
  
      detalle_receta.push({
        itemMP:{
          Code:'',
          ItemName:'',
          EMPAQUE:0,
          Quantity:0,
          costo:0,
          costoSAP:0,
          tipo:'articulo',
          index:3,
          merma:this.merma
        },
        costosItemMP:{
          semana0:{
            anio:0,
            semana:0,
            costoMP:0,
            empaqueMP:0,
            precioMP:0,
            precioEmpaque:0,
          },
          semana1:{
            anio:0,
            semana:0,
            costoMP:0,
            empaqueMP:0,
            precioMP:0,
            precioEmpaque:0,
          },
          semana2:{
            anio:0,
            semana:0,
            costoMP:0,
            empaqueMP:0,
            precioMP:0,
            precioEmpaque:0,
          }
        }
  
      });
  
      this.detalle_receta = detalle_receta;
    }
    
   

    /////////////////////////////////////console.log(this.detalle_receta);

  }

  async cambioMerma(){
    let arregloCostos = await this.calcularTotalesDetalleCalculo2(this.detalle_receta);
    await this.setTablaCostosTotalesItem(arregloCostos);
  }

  async setTablaCostosTotalesItem(arregloCostos:any):Promise<void>{

   //////console.log(arregloCostos);

    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.merma = arregloCostos.merma;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.totalArticulos = arregloCostos.totalArticulos;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.totalEmpaque = arregloCostos.totalEmpaque;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.totalCostoPTSAP = arregloCostos.totalCostoPTSAP;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.totalMPsemana0 = arregloCostos.totalMPsemana0;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.totalMPsemana1 = arregloCostos.totalMPsemana1;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.totalMPsemana2 = arregloCostos.totalMPsemana2;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoMermaSAP = arregloCostos.costoMermaSAP;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoMermaS0 = arregloCostos.costoMermaS0;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoMermaS1 = arregloCostos.costoMermaS1;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoMermaS2 = arregloCostos.costoMermaS2;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoVentaPTSAP = arregloCostos.costoVentaPTSAP;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoVentaPTsemana0 = arregloCostos.costoVentaPTsemana0;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoVentaPTsemana1 = arregloCostos.costoVentaPTsemana1;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoVentaPTsemana2 = arregloCostos.costoVentaPTsemana2;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoTotalPTSAP = arregloCostos.costoTotalPTSAP;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoTotalPTsemana0 = arregloCostos.costoTotalPTsemana0;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoTotalPTsemana1 = arregloCostos.costoTotalPTsemana1;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoTotalPTsemana2 = arregloCostos.costoTotalPTsemana2;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.costoRecursoItemPT = arregloCostos.recursoPT;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.otrosCostos = this.arrayOtrosCostos;
    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.recurso = this.opcionRecurso.label;



    this.totalCantidadArticulos = arregloCostos.totalArticulos;
    this.totalCostoPTSAP = arregloCostos.totalCostoPTSAP;
    this.totalEmpaque = arregloCostos.totalEmpaque;
    this.totalMPsemana0 = arregloCostos.totalMPsemana0;
    this.totalMPsemana1 = arregloCostos.totalMPsemana1;
    this.totalMPsemana2 = arregloCostos.totalMPsemana2;
    this.costoVentaPTSAP = arregloCostos.costoVentaPTSAP;
    this.costoVentaPTsemana0 = arregloCostos.costoVentaPTsemana0;
    this.costoVentaPTsemana1 = arregloCostos.costoVentaPTsemana1;
    this.costoVentaPTsemana2 = arregloCostos.costoVentaPTsemana2;
    this.costoTotalPTSAP = arregloCostos.costoTotalPTSAP;
    this.costoTotalPTsemana0 = arregloCostos.costoTotalPTsemana0;
    this.costoTotalPTsemana1 = arregloCostos.costoTotalPTsemana1;
    this.costoTotalPTsemana2 = arregloCostos.costoTotalPTsemana2;

    ////////////////////////console.log(this.arrayCalculadoraMultiple);

    await this.setTablaCalculadora2(this.arrayCalculadoraMultiple);

  } 


  async seleccionarItemDetalle(index:number, itemSeleccionado:any){
      ////////////console.log(itemSeleccionado, this.opcionRecurso);
      const indexDetalle =this.detalle_receta.findIndex((item: { itemMP: { index: number; }; })  => item.itemMP.index ===index);
     
      this.detalle_receta[indexDetalle].itemMP.Code = itemSeleccionado.ItemCode;
      this.detalle_receta[indexDetalle].itemMP.ItemName = itemSeleccionado.ItemName;
      this.detalle_receta[indexDetalle].itemMP.recursoPT = this.opcionRecurso.costorecurso;
      this.detalle_receta[indexDetalle].itemMP.recurso = this.opcionRecurso.label;
      let costoItem =itemSeleccionado.COSTOUINVET==null?0:parseFloat(itemSeleccionado.COSTOUINVET)/this.trm_moneda;
      this.detalle_receta[indexDetalle].itemMP.COSTO = costoItem;
     
      //let costoSAP = parseFloat(this.detalle_receta[indexDetalle].itemMP.Quantity)*costoItem;
      //this.detalle_receta[indexDetalle].itemMP.costoSAP = costoSAP;

      if(this.detalle_receta[indexDetalle].itemMP.tipo=='empaque'){
        /*this.detalle_receta[indexDetalle].costosItemMP.semana0.empaqueMP = itemSeleccionado.COSTOUINVET==null?0:(parseFloat(itemSeleccionado.COSTOUINVET)/this.trm_moneda)*parseFloat(this.detalle_receta[indexDetalle].itemMP.Quantity);
        this.detalle_receta[indexDetalle].costosItemMP.semana1.empaqueMP = itemSeleccionado.COSTOUINVET==null?0:(parseFloat(itemSeleccionado.COSTOUINVET)/this.trm_moneda)*parseFloat(this.detalle_receta[indexDetalle].itemMP.Quantity);
        this.detalle_receta[indexDetalle].costosItemMP.semana2.empaqueMP = itemSeleccionado.COSTOUINVET==null?0:(parseFloat(itemSeleccionado.COSTOUINVET)/this.trm_moneda)*parseFloat(this.detalle_receta[indexDetalle].itemMP.Quantity);*/

        this.detalle_receta[indexDetalle].costosItemMP.semana0.precioEmpaque = itemSeleccionado.COSTOUINVET==null?0:(parseFloat(itemSeleccionado.COSTOUINVET)/this.trm_moneda);
        this.detalle_receta[indexDetalle].costosItemMP.semana1.precioEmpaque = itemSeleccionado.COSTOUINVET==null?0:(parseFloat(itemSeleccionado.COSTOUINVET)/this.trm_moneda);
        this.detalle_receta[indexDetalle].costosItemMP.semana2.precioEmpaque = itemSeleccionado.COSTOUINVET==null?0:(parseFloat(itemSeleccionado.COSTOUINVET)/this.trm_moneda);
      }

      if(this.detalle_receta[indexDetalle].itemMP.tipo=='articulo' || this.detalle_receta[indexDetalle].itemMP.tipo=='protector'){
         



          let precioMPseman0 =0;
          let precioMPseman1 =0;
          let precioMPseman2 =0;

          let preciosMPItemUltimasSemanas = await this.getPreciosMPItemUltimasSemanas(itemSeleccionado.ItemCode);
            console.log('preciosMPItemUltimasSemanas',itemSeleccionado.ItemCode,preciosMPItemUltimasSemanas)
            if(preciosMPItemUltimasSemanas.length>0){

              if(preciosMPItemUltimasSemanas.length==1){
                this.messageService.add({severity:'warn', summary: '!Advertencia', detail: `Para la materia prima ${itemSeleccionado.ItemName} no se encontraron precios para la semana 1 y 2`});
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
                this.messageService.add({severity:'warn', summary: '!Advertencia', detail: `Para la materia prima ${itemSeleccionado.ItemName} no se encontraron precios para la semana  2`});
                preciosMPItemUltimasSemanas.push({
                  anio:0,
                  semanaAnioLista:0,
                  precioNac:0
                })
              }

              this.detalle_receta[indexDetalle].costosItemMP.semana0.anio = preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[0].anio:0;
              this.detalle_receta[indexDetalle].costosItemMP.semana1.anio = preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[1].anio:0;
              this.detalle_receta[indexDetalle].costosItemMP.semana2.anio = preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[2].anio:0;

              this.detalle_receta[indexDetalle].costosItemMP.semana0.semana = preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[0].semanaAnioLista:0;
              this.detalle_receta[indexDetalle].costosItemMP.semana1.semana = preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[1].semanaAnioLista:0;
              this.detalle_receta[indexDetalle].costosItemMP.semana2.semana = preciosMPItemUltimasSemanas.length>0?preciosMPItemUltimasSemanas[2].semanaAnioLista:0;
  
              
              
              /*costoMPseman0 =(parseFloat(preciosMPItemUltimasSemanas[0].precioNac)*(this.trm_dia)*parseFloat(this.detalle_receta[indexDetalle].itemMP.Quantity))/this.trm_moneda;
              costoMPseman1 =(parseFloat(preciosMPItemUltimasSemanas[1].precioNac)*(this.trm_dia)*parseFloat(this.detalle_receta[indexDetalle].itemMP.Quantity))/this.trm_moneda;
              costoMPseman2 =(parseFloat(preciosMPItemUltimasSemanas[2].precioNac)*(this.trm_dia)*parseFloat(this.detalle_receta[indexDetalle].itemMP.Quantity))/this.trm_moneda;*/

              precioMPseman0 =(parseFloat(preciosMPItemUltimasSemanas[0].precioNac)*(this.trm_dia))/this.trm_moneda;
              precioMPseman1 =(parseFloat(preciosMPItemUltimasSemanas[1].precioNac)*(this.trm_dia))/this.trm_moneda;
              precioMPseman2 =(parseFloat(preciosMPItemUltimasSemanas[2].precioNac)*(this.trm_dia))/this.trm_moneda;


            } 

           
            this.detalle_receta[indexDetalle].costosItemMP.semana0.precioMP = precioMPseman0;
            this.detalle_receta[indexDetalle].costosItemMP.semana1.precioMP = precioMPseman1;
            this.detalle_receta[indexDetalle].costosItemMP.semana2.precioMP = precioMPseman2;
         
      }

      //////////////////////////////////console.log(this.detalle_receta);
      await this.calcularCostosLinea(index);

     

  }

 async calcularCostosLinea(index:number){

    const indexDetalle =this.detalle_receta.findIndex((item: { itemMP: { index: number; }; })  => item.itemMP.index ===index);

    let cantidadItem = this.detalle_receta[indexDetalle].itemMP.Quantity;
    let costoItem = this.detalle_receta[indexDetalle].itemMP.COSTO;
    
    let costoSAP = parseFloat(cantidadItem)*costoItem;
    this.detalle_receta[indexDetalle].itemMP.costoSAP = costoSAP

 
    let costoEmpaque = parseFloat(this.detalle_receta[indexDetalle].costosItemMP.semana0.precioEmpaque)*cantidadItem;
    let costoItemSemana0 = parseFloat(this.detalle_receta[indexDetalle].costosItemMP.semana0.precioMP)*cantidadItem;
    let costoItemSemana1  = parseFloat(this.detalle_receta[indexDetalle].costosItemMP.semana1.precioMP)*cantidadItem;
    let costoItemSemana2 = parseFloat(this.detalle_receta[indexDetalle].costosItemMP.semana2.precioMP)*cantidadItem;

    this.detalle_receta[indexDetalle].costosItemMP.semana0.costoMP = costoItemSemana0;
    this.detalle_receta[indexDetalle].costosItemMP.semana1.costoMP = costoItemSemana1;
    this.detalle_receta[indexDetalle].costosItemMP.semana2.costoMP = costoItemSemana2;

    this.detalle_receta[indexDetalle].costosItemMP.semana0.empaqueMP = costoEmpaque;
    this.detalle_receta[indexDetalle].costosItemMP.semana1.empaqueMP = costoEmpaque;
    this.detalle_receta[indexDetalle].costosItemMP.semana2.empaqueMP = costoEmpaque;

    this.arrayCalculadoraMultiple[0].tablaCostosItemPT.detalle_receta =this.detalle_receta;

    let arregloCostos = await this.calcularTotalesDetalleCalculo2(this.detalle_receta);

    await this.setTablaCostosTotalesItem(arregloCostos);

  }


  async PresionaEnterCantidadMP(event:any,index:number,tipo:string){
    
    if (event.key === "Enter") {
    
      //////////////////////////////////////////console.log('ENTER PRESS');
      if(event.target.value ===''){
        event.target.value =0;
      }

      let error:boolean = await this.validarCantidad(parseFloat(event.target.value),tipo);

      if(!error){
        this.calcularCostosLinea(index);
      }else{
        const indexDetalle =this.detalle_receta.findIndex((item: { itemMP: { index: number; }; })  => item.itemMP.index ===index);
        event.target.value =0;
        this.detalle_receta[indexDetalle].itemMP.Quantity =0;
      }

      /*
      if(tipo!='articulo'){
        this.calcularCostosLinea(index);
      }else if(tipo==='articulo' && event.target.value>=0.1 && event.target.value<=1 ){
        this.calcularCostosLinea(index);
      }else{
        this.messageService.add({severity:'warn', summary: '!Advertencia', detail: `La cantidad del articulo debe ser mayor o igual a 0.1 y menor o igual a 1`});
        const indexDetalle =this.detalle_receta.findIndex((item: { itemMP: { index: number; }; })  => item.itemMP.index ===index);
        event.target.value =0;
        this.detalle_receta[indexDetalle].itemMP.Quantity =0;
      }
      */
      /*if(tipo!='articulo'){
        this.calcularCostosLinea(index);
      }else if(tipo=='articulo' && (this.totalCantidadArticulos+ event.target.value) >1){
        this.messageService.add({severity:'warn', summary: '!Advertencia', detail: `La cantidad ingresada del articulo seleccionado mas la cantidad total de articulos en la receta supera el maximo permitid`});
        const indexDetalle =this.detalle_receta.findIndex((item: { itemMP: { index: number; }; })  => item.itemMP.index ===index);
        event.target.value =0;
        this.detalle_receta[indexDetalle].itemMP.Quantity =0;
      }else{
        this.calcularCostosLinea(index);
      }*/
      
      
      
    }
  }
  
 async cambioCantidadMP(event:any,index:number,tipo:string){
    if(event.target.value ===''){
      event.target.value =0;
    }

    let error:boolean = await this.validarCantidad(parseFloat(event.target.value),tipo);

      if(!error){
        this.calcularCostosLinea(index);
      }else{
        const indexDetalle =this.detalle_receta.findIndex((item: { itemMP: { index: number; }; })  => item.itemMP.index ===index);
        event.target.value =0;
        this.detalle_receta[indexDetalle].itemMP.Quantity =0;
      }

    /*if(tipo!='articulo'){
      this.calcularCostosLinea(index);
    }else if(tipo==='articulo' && event.target.value>=0.1 && event.target.value<=1 ){
      this.calcularCostosLinea(index);
    }else{
      this.messageService.add({severity:'warn', summary: '!Advertencia', detail: `La cantidad del articulo debe ser mayor o igual a 0.1 y menor o igual a 1`});
      event.target.value =0;
    }*/
    /*if(tipo!='articulo'){
      this.calcularCostosLinea(index);
    }else if(tipo=='articulo' && (this.totalCantidadArticulos+ event.target.value) >1){
      this.messageService.add({severity:'warn', summary: '!Advertencia', detail: `La cantidad ingresada del articulo seleccionado mas la cantidad total de articulos en la receta supera el maximo permitid`});
      const indexDetalle =this.detalle_receta.findIndex((item: { itemMP: { index: number; }; })  => item.itemMP.index ===index);
      event.target.value =0;
      this.detalle_receta[indexDetalle].itemMP.Quantity =0;
    }else{
      this.calcularCostosLinea(index);
    }*/
  
    
    
  }


  async validarCantidad(cantidad:number, tipo:string): Promise<boolean>{
      let error = false;
      if(tipo=='articulo' && (this.totalCantidadArticulos+cantidad)>1){
          //////////////////////////console.log(this.totalCantidadArticulos,'-',cantidad);
          this.messageService.add({severity:'warn', summary: '!Advertencia', detail: `La cantidad ingresada del articulo seleccionado mas la cantidad total de articulos en la receta supera el maximo permitido`});
          error = true;
      }

      return error;
  }

  async SeleccionarRecurso(){

    console.log(this.opcionRecurso);
  
    this.detalle_receta.map((receta)=>{
      receta.itemMP.costoRecurso = this.opcionRecurso.costorecurso;
      receta.itemMP.recurso = this.opcionRecurso.label;
    });


    this.recursoPT = this.opcionRecurso.costorecurso;
    let arregloCostos = await this.calcularTotalesDetalleCalculo2(this.detalle_receta);
    await this.setTablaCostosTotalesItem(arregloCostos);
    
  }


 

  async calcularTotalesDetalleCalculo2(detalle_receta: any):Promise<any>{

   //////////console.log(detalle_receta);

    
 
      let arregloCostos:any;

      let costoEmpaque =0;
      let costoMPseman0 =0;
      let costoMPseman1 =0;
      let costoMPseman2=0;
      let costoSAP =0;
      let cantidadArticulos =0;

      let totalMPSAP = 0;
      let totalMPsemana0 = 0;
      let totalMPsemana1 = 0;
      let totalMPsemana2 = 0;

      let costoMermaSAP = 0;
      let costoMermaS0 = 0;
      let costoMermaS1 = 0;
      let costoMermaS2 =0;

      let costoVentaPTSAP = 0;
      let costoVentaPTsemana0 = 0;
      let costoVentaPTsemana1 = 0;
      let costoVentaPTsemana2 = 0;

      let costoTotalPTSAP = 0;
      let costoTotalPTsemana0 = 0;
      let costoTotalPTsemana1 = 0;
      let costoTotalPTsemana2 = 0;

      let otrosCostos = (await this.sumColArray(this.arrayOtrosCostos,[{valor:0}]))[0].valor;
      this.otrosCostos = otrosCostos;

      ////////////////console.log('otrosCostos',this.arrayOtrosCostos,await this.sumColArray(this.arrayOtrosCostos,[{valor:0}]));

      let merma = 0;

      let costoRecursoPTSAP:number = 0;

      //
      ////////console.log(this.opcionRecurso.costorecurso);

      ///let recursoPT = detalle_receta.length==0?0:detalle_receta[0].itemMP.recursoPT==0?this.items.find((itemPT: { ItemCode: any; })=>itemPT.ItemCode == detalle_receta[0].itemMP.Father).RECURSOPONDE: detalle_receta[0].itemMP.recursoPT;
      let recursoPT = this.opcionRecurso.costorecurso;
      ////////console.log(recursoPT);


      for(let linea of detalle_receta){

        //linea.itemMP.merma = this.merma;
        costoSAP+=parseFloat(linea.itemMP.costoSAP);
        costoEmpaque+= parseFloat(linea.costosItemMP.semana0.empaqueMP);
        costoMPseman0+=parseFloat(linea.costosItemMP.semana0.costoMP);
        costoMPseman1+=parseFloat(linea.costosItemMP.semana1.costoMP);
        costoMPseman2+=parseFloat(linea.costosItemMP.semana2.costoMP);
        if(linea.itemMP.tipo=='articulo' && linea.itemMP.Code.toString().startsWith('MP')){
          cantidadArticulos+=parseFloat(linea.itemMP.Quantity);
        }
        //////////////console.log(linea.itemMP);
        costoRecursoPTSAP = this.items.find((itemPT: { ItemCode: any; })=>itemPT.ItemCode == linea.itemMP.Father).RECURSOPONDE;
        ////////////////console.log('calcularTotalesDetalleCalculo2 costoRecursoPTSAP',costoRecursoPTSAP);
        merma = detalle_receta[0].itemMP.merma; 

        

      }

      totalMPSAP = costoSAP;
      /*totalMPsemana0 = costoEmpaque+costoMPseman0;
      totalMPsemana1 = costoEmpaque+costoMPseman1;
      totalMPsemana2 = costoEmpaque+costoMPseman2;*/

      totalMPsemana0 = costoMPseman0;
      totalMPsemana1 = costoMPseman1;
      totalMPsemana2 = costoMPseman2;

      costoMermaSAP = (merma)*totalMPSAP;
      costoMermaS0 = (merma)*(totalMPsemana0+costoEmpaque);
      costoMermaS1 = (merma)*(totalMPsemana1+costoEmpaque);
      costoMermaS2 = (merma)*(totalMPsemana2+costoEmpaque);

      //costoVentaPTSAP = costoMermaSAP+totalMPSAP+costoRecursoPTSAP;
      //costoVentaPTSAP = costoMermaSAP+totalMPSAP+this.recursoPT+this.otrosCostos;
      costoVentaPTSAP = costoMermaSAP+totalMPSAP+recursoPT+this.otrosCostos;
      

      /*costoVentaPTsemana0 = costoMermaS0+totalMPsemana0+costoEmpaque+this.recursoPT+this.otrosCostos;
      costoVentaPTsemana1 = costoMermaS0+totalMPsemana1+costoEmpaque+this.recursoPT+this.otrosCostos;
      costoVentaPTsemana2 = costoMermaS0+totalMPsemana2+costoEmpaque+this.recursoPT+this.otrosCostos;*/

      costoVentaPTsemana0 = costoMermaS0+totalMPsemana0+costoEmpaque+recursoPT+this.otrosCostos;
      costoVentaPTsemana1 = costoMermaS0+totalMPsemana1+costoEmpaque+recursoPT+this.otrosCostos;
      costoVentaPTsemana2 = costoMermaS0+totalMPsemana2+costoEmpaque+recursoPT+this.otrosCostos;

      costoTotalPTSAP = costoVentaPTSAP+this.administracion;
      costoTotalPTsemana0 = costoVentaPTsemana0+this.administracion;
      costoTotalPTsemana1 = costoVentaPTsemana1+this.administracion;
      costoTotalPTsemana2 = costoVentaPTsemana2+this.administracion;

      arregloCostos = {
        administracion:this.administracion,
        recursoPT:recursoPT,
        merma:this.merma,
        totalArticulos:cantidadArticulos,
        totalCostoPTSAP:totalMPSAP,
        totalEmpaque:costoEmpaque,
        totalMPsemana0,
        totalMPsemana1,
        totalMPsemana2,
        costoMermaSAP,
        costoMermaS0,
        costoMermaS1,
        costoMermaS2,
        costoVentaPTSAP,
        costoVentaPTsemana0,
        costoVentaPTsemana1,
        costoVentaPTsemana2,
        costoTotalPTSAP,
        costoTotalPTsemana0,
        costoTotalPTsemana1,
        costoTotalPTsemana2,
        otrosCostos:this.otrosCostos
      }
      //////////////console.log(arregloCostos);
      return arregloCostos;

  }

 async calcularTotalesDetalleCalculo(index: number=0){

    ////////////////////////////////console.log(this.merma);

      let costoEmpaque =0;
      let costoMPseman0 =0;
      let costoMPseman1 =0;
      let costoMPseman2=0;
      let costoSAP =0;
      let cantidadArticulos =0;
      
      for(let linea of this.detalle_receta){

        //////////////////////////////////console.log(linea.itemMP);

        linea.itemMP.merma = this.merma;

        costoSAP+=parseFloat(linea.itemMP.costoSAP);
        costoEmpaque+= parseFloat(linea.costosItemMP.semana0.empaqueMP);
        costoMPseman0+=parseFloat(linea.costosItemMP.semana0.costoMP);
        costoMPseman1+=parseFloat(linea.costosItemMP.semana1.costoMP);
        costoMPseman2+=parseFloat(linea.costosItemMP.semana2.costoMP);
        if(linea.itemMP.tipo=='articulo'){
          cantidadArticulos+=parseFloat(linea.itemMP.Quantity);
        }
        
      }

      this.totalMPsemana0 = costoMPseman0;
      this.totalMPsemana1 = costoMPseman1;
      this.totalMPsemana2 = costoMPseman2;

      this.totalEmpaque = costoEmpaque;

      let costoTotalPTSemana0 =costoEmpaque+costoMPseman0;
      let costoTotalPTSemana1 =costoEmpaque+costoMPseman1;
      let costoTotalPTSemana2 =costoEmpaque+costoMPseman2;

      this.totalCostoPTSAP = costoSAP;

      let costoMermaSAP = (this.merma)*costoSAP;
      let costoMermaS0 = (this.merma)*costoTotalPTSemana0;
      let costoMermaS1 = (this.merma)*costoTotalPTSemana1;
      let costoMermaS2 = (this.merma)*costoTotalPTSemana2;

      this.costoVentaPTsemana0 = costoMermaS0+costoTotalPTSemana0+this.recursoPT;
      this.costoVentaPTsemana1 = costoMermaS1+costoTotalPTSemana1+this.recursoPT;
      this.costoVentaPTsemana2 = costoMermaS2+costoTotalPTSemana2+this.recursoPT;
      
      this.costoVentaPTSAP = costoMermaSAP+costoSAP+this.recursoPT;

      this.costoTotalPTsemana0 = this.costoVentaPTsemana0 + this.administracion;
      this.costoTotalPTsemana1 = this.costoVentaPTsemana1 + this.administracion;
      this.costoTotalPTsemana2 = this.costoVentaPTsemana2 + this.administracion;
      this.costoTotalPTSAP = this.costoVentaPTSAP+ this.administracion;

      

      if(cantidadArticulos>1){
        const indexDetalle =this.detalle_receta.findIndex((item: { itemMP: { index: number; }; })  => item.itemMP.index ===index);
        
        let oldQuantity = this.detalle_receta[indexDetalle].itemMP.Quantity;
        this.messageService.add({severity:'error', summary: '!Error', detail: `La sumatoria total de los articulos mas la cantidad ingresada del item ${this.detalle_receta[indexDetalle].itemMP.ItemName}  es mayor  a 1`});
        this.detalle_receta[indexDetalle].itemMP.Quantity = 0;
        this.calcularCostosLinea(index);
      }else{
        this.totalCantidadArticulos = cantidadArticulos;
        await this.setTablaCalculadora()

      }

      
  }

  adicionarLinea(){
    
    if(this.totalCantidadArticulos >= 1 ){
      this.messageService.add({severity:'error', summary: '!Error', detail: `No puede adicionar mas lineas si la suma de la cantidad de los articlos es mayor o igual a 1`});
    }else{

      let recursoPT:number = (parseFloat(this.promedios_localidad[0].promedio_recurso)/this.trm_moneda);
      let administracion:number =  parseFloat(this.promedios_localidad[0].promedio_administracion)/(this.trm_moneda);
    
      this.detalle_receta.push({
        itemMP:{
          COSTO:0,
          Code:'',
          EMPAQUE:0,
          Father:this.itemSeleted.ItemCode,
          ItemName:'',
          MODIFICAR:'',
          Quantity:0,
          costoSAP:0,
          merma:this.merma,
          tipo:'articulo',
          index:this.detalle_receta.length+1,
        },
        costosItemMP:{
          semana0:{
            administracionMP:administracion,
            anio:0,
            costoMP:0,
            costoTotalMP:0,
            costoVentaMP:0,
            empaqueMP:0,
            precioEmpaque:0,
            precioMP:0,
            recursoMP:recursoPT,
            semana:0,
          },
          semana1:{
            administracionMP:administracion,
            anio:0,
            costoMP:0,
            costoTotalMP:0,
            costoVentaMP:0,
            empaqueMP:0,
            precioEmpaque:0,
            precioMP:0,
            recursoMP:recursoPT,
            semana:0,
          },
          semana2:{
            administracionMP:administracion,
            anio:0,
            costoMP:0,
            costoTotalMP:0,
            costoVentaMP:0,
            empaqueMP:0,
            precioEmpaque:0,
            precioMP:0,
            recursoMP:recursoPT,
            semana:0,
          }
        }

      });
    }
   

   

    //////////////////////////////////console.log(this.detalle_receta);
  }

  async borrarLinea(){
    //////////////////////////////////console.log(this.selectedDetalleReceta);

    for(let lineaSeleccionada of this.selectedDetalleReceta){
      let indexDetalle =this.detalle_receta.findIndex((item: { itemMP: { index: number; }; })  => item.itemMP.index ===lineaSeleccionada.itemMP.index);
      //////////////////////////////////console.log(indexDetalle);
      this.detalle_receta.splice(indexDetalle,1);
    }

    this.selectedDetalleReceta=[];

    //this.calcularTotalesDetalleCalculo(0);
    let arregloCostos = await this.calcularTotalesDetalleCalculo2(this.detalle_receta);

    await this.setTablaCostosTotalesItem(arregloCostos);
  }

  async sumarDias(fecha:Date, dias:number):Promise<Date>{
    fecha.setDate(fecha.getDate() + dias);
    //////////////////////////////////////console.log(fecha);
    return fecha;
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

    

    ////////////////////////////////////////////console.log(fecha, diaDeLaSemana,fecha.getDate(),numeroDiasRestar,fechaTMP);
    return fechaTMP;
  }

  async siguienteMes(fecha:Date){
    ////////////////////////////////////////////console.log(fecha,fecha.getFullYear(),fecha.getMonth());

    let anioMesSiguiente:number = fecha.getMonth()==11?fecha.getFullYear()+1:fecha.getFullYear();
    let mesMesSiguiente:number = fecha.getMonth()==11?0:fecha.getMonth()+1;
    ////////////////////////////////////////////console.log('año',anioMesSiguiente,'mes',mesMesSiguiente);
    let fechaInicioMesSiguiente = new Date(anioMesSiguiente, mesMesSiguiente,1);

    return fechaInicioMesSiguiente;
  }

  async semanaDelMes(fecha:Date):Promise<string>{
    let semanaMes:string ='';
    
    //let fechaInicioSemana = await this.fechaInicioSemana(new Date(fecha));
    let fechaInicioSemana = ((fecha));
    fechaInicioSemana.setHours(0,0,0);
    //////////////////////////////////////////console.log('Inicio semana',fechaInicioSemana);
    //let siguienteMes = await this.siguienteMes(new Date(fecha));
    let siguienteMes = await this.siguienteMes((fecha));
    siguienteMes.setHours(0,0,0);
    //////////////////////////////////////////console.log('Siguiente mes',siguienteMes);

    let fechaInicioSemanaSiguienteMes = await this.fechaInicioSemana((siguienteMes));
    fechaInicioSemanaSiguienteMes.setHours(0,0,0);
    //////////////////////////////////////////console.log('fecha Inicio Semana Siguiente mes',fechaInicioSemanaSiguienteMes);
    //await ////////////////////////////////////////console.log(fechaInicioSemana.getFullYear(),fechaInicioSemanaSiguienteMes.getFullYear(),fechaInicioSemana.getMonth(),fechaInicioSemanaSiguienteMes.getMonth(),fechaInicioSemana.getDate(),fechaInicioSemanaSiguienteMes.getDate());

    
    let diaDelMes = fechaInicioSemana.getDate();
    let diaFecha = fechaInicioSemana.getDay();

    
    let weekOfMonth = Math.ceil((diaDelMes - 1 - diaFecha) / 7);
    ////////////////////////////////////////////console.log(`${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`,weekOfMonth+1);
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

  exportExcel(tabla:any) {
    //////////////////////////////console.log(tabla);
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(tabla);
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

  async sumColArray(arrayData:any[], arrayCols:any[]):Promise<any[]>{
  
    let arrayKeys:any[] = Object.keys(arrayCols[0]);
    for(let itemData of arrayData){
        for(let itemKey of arrayKeys){
            arrayCols[0][itemKey] += parseFloat(itemData[itemKey]);
        }
  
    }
  
    return arrayCols;
  }

}
