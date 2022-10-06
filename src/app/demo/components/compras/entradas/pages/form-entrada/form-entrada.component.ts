import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CuentasSAP } from 'src/app/demo/api/accountsSAP';
import { BusinessPartners } from 'src/app/demo/api/businessPartners';
import { DependenciasUsuario, InfoUsuario,PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { ItemsSAP } from 'src/app/demo/api/itemsSAP';
import { SolpedInterface } from 'src/app/demo/api/solped';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';

@Component({
  selector: 'app-form-entrada',
  providers: [MessageService],
  templateUrl: './form-entrada.component.html',
  styleUrls: ['./form-entrada.component.scss']
})
export class FormEntradaComponent implements OnInit {

  
  @Input() entradaEditar:any;
  @Input() pedido:any;
  @Input() loadingSave!:boolean;
  @Output() onNewEntrada: EventEmitter<any> = new EventEmitter();

  @ViewChild('filter') filter!: ElementRef;

  dependenciasUsuario:DependenciasUsuario[] = [];
  vicepresidencias:DependenciasUsuario[] = [];
  dependencias:DependenciasUsuario[] = [];
  localidades:DependenciasUsuario[] = [];
  series:any[] = [];
  seriesPedido:any[] = [];
  areas:any[] = [];
  clases:any[] = [];
  proveedores:BusinessPartners[] = [];
  items:ItemsSAP[] = [];
  cuentas:CuentasSAP[]=[];
  almacenes:any[] = [];
  monedas:any[] =[];
  trm:number =0;
  impuestos:any[] =[];
  infoSolpedEditar!:SolpedInterface;

  urlBreadCrumb:string ="";

  infoUsuario!: InfoUsuario;
  perfilesUsuario: PerfilesUsuario[] = [];
  permisosUsuario: PermisosUsuario[] = [];
  permisosUsuarioPagina!:PermisosUsuario[];


   /***** NG Model ******/

  /*** Encabezado entrada ***/
  nombreusuario:string ="";
  codigoproveedor:string="";
  nombreproveedor:string = "";
  serie:string ="";
  serieName:string ="";
  codigoSap:number =0;
  fechaContable:Date = new Date();
  fechaCaducidad:Date = new Date();
  fechaDocumento:Date = new Date();
  fechaNecesidad:Date = new Date();
  comentarios:string = "";
  currency:string = "COP";
  clase:string="";
  pedidonumsap:number = 0;

  /*** Detalle  entrada */
  item!:ItemsSAP;
  itemsFiltrados:ItemsSAP[] = [];
  iteradorLinea:number =0;
  numeroLinea:number=-1;
  fechaRequerida:Date = new Date();
  proveedor!:BusinessPartners;
  descripcion:string = "";
  viceprecidencia!:DependenciasUsuario;
  dependencia!:DependenciasUsuario;
  localidad!:DependenciasUsuario;
  almacen:any = "";
  cuenta!:CuentasSAP;
  cuentasFiltradas:CuentasSAP[] = [];
  cuentasDependencia!:CuentasSAP[];
  nombreCuenta:string = "";
  cantidad:number = 1;
  cantidad_pedido :number=0;
  cantidad_pendiente:number=0;

  moneda:string ="";
  precio:number =0;
  subtotalLinea:number = 0;
  impuesto:any = "";
  prcImpuesto:number =0;
  valorImpuesto:number =0;
  totalLinea:number =0;

  /*** Validadores ****/
  lineasEntrada:any[] = []; // Array para guardar temporalmente las lineas de la entrada que se van a guardar o editar
  lineaEntrada!:any; //Linea para registrar o actualizar
  lineaSeleccionada:any[] = []; //array de lineas seleccionadas del listado de lineas de la entrada

  totalimpuestos:number =0;
  subtotal:number =0;
  grantotal:number =0;
 
  envioFormulario:boolean =false;  //Controla el envio del formulario
  nuevaLinea:boolean = false; //Controla el llenado de los campos del encabezado
  editarLinea:boolean = false; //Controla la accion "Edita o Adicionar" del fromulario de linea solped
  formularioLinea:boolean = false;  // Controla la visibilidad del formulario de linea solped
  envioLinea:boolean = false; // Controla el llenado de los campos del formulario de linea solped
  listadoLineas:boolean = false; //Controla la visibilidad del listado de lineas de la solped
  loading:boolean = false; // Controla el spiner de cargue del listado de lineas de la solped
  entradaEnviadaSAP: string = "N";






  constructor(private authService: AuthService,
    private sapService:SAPService,
    private comprasService: ComprasService,
    private router:Router,
    private messageService: MessageService,
    private rutaActiva: ActivatedRoute) {

     }

  ngOnInit(): void {

    //console.log("form entrada:", this.pedido);

     //Cargar informacion del usuario
     this.getInfoUsuario();
     //Cargar perfiles del usuario
     this.getPerfilesUsuario();
     //Cargar permisos del usuario
     this.getPermisosUsuario();
     //Cargar permisos usuario pagina
     this.getPermisosUsuarioPagina();
    //Cargar dependencias x usuario
    this.getDependenciasUsuario();
    //Cargar Seriies entrada
     this.getSeriesEntrada();
    //Cargar Seriies entrada
    this.getSeriesPedido();
     //Cargar items
     this.getItems();
     //Cargar almacenes x usuario
     this.getAlmacenes();
     //Cargar cuentas
     this.getCuentas();
     //Cargar monedas
     this.getMonedas(new Date());
     //Cargar impuestos
     this.getImpuestos();

     this.getInfoPedido();


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
      console.log("URL origen",this.router.url);
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

    getDependenciasUsuario(){
      this.authService.getDependeciasUsuarioXE()
      .subscribe({
        next: (dependenciasUser) => {
          for(let item in dependenciasUser){
            this.dependenciasUsuario.push(dependenciasUser[item]);
          }
          //Llenara array de vicepresidencias
          for(let dependencia of this.dependenciasUsuario){
              if((this.vicepresidencias.filter(data => data.vicepresidency === dependencia.vicepresidency)).length ===0){
                this.vicepresidencias.push(dependencia);
              }
          }

          //console.log(this.vicepresidencias);
        },
        error: (error) => {
          //console.log(error);
        }
      });
    }

    getSeriesEntrada(){
      //this.series = [{name:'SPB',code:'94'},{name:'SPS',code:'62'}];
  
      this.sapService.seriesDocXEngineSAP(this.authService.getToken(),'20')
          .subscribe({
              next: (series)=>{
                  //console.log(series);
                  for(let item in series){
                    this.series.push(series[item]);
                }
                  this.series = this.series.filter(item => item.name !='Canc');
                  //this.serie = this.series[0].code;
                  //this.serieName =this.series[0].name;
                  console.log(this.series);
                
              },
              error: (err)=>{
                console.log(err);
              }
          });
  
      
    }

    getSeriesPedido(){
      //this.series = [{name:'SPB',code:'94'},{name:'SPS',code:'62'}];
  
      this.sapService.seriesDocXEngineSAP(this.authService.getToken(),'22')
          .subscribe({
              next: (series)=>{
                  //console.log(series);
                  for(let item in series){
                    this.seriesPedido.push(series[item]);
                }
              },
              error: (err)=>{
                console.log(err);
              }
          });
  
      
    }

    getItems(){
      this.sapService.itemsSAPXE(this.authService.getToken())
          .subscribe({
            next: (items) => {
              for(let item in items){
                this.items.push(items[item]);
             }
             ////console.log(cuentas);
             ////console.log(this.items);
            },
            error: (error) => {
                //console.log(error);      
            }
          });
    }
  
    getCuentas(){
      this.sapService.CuentasSAPXE(this.authService.getToken())
          .subscribe({
            next: (cuentas) => {
              for(let item in cuentas){
                this.cuentas.push(cuentas[item]);
             }
             ////console.log(cuentas);
             ////console.log(this.cuentas);
            },
            error: (error) => {
                //console.log(error);      
            }
          });
    }
  
    getAlmacenes(){
      this.authService.getAlmacenesUsuarioXE()
      .subscribe({
        next: (stores) => {
          ////console.log(stores);
          for(let item in stores){
            this.almacenes.push(stores[item]);
         }
         ////console.log(this.stores);
        },
        error: (error) => {
            //console.log(error);      
        }
      });
    }
  
    getMonedas(fecha:Date){
      this.sapService.monedasXEngineSAP(this.authService.getToken(),fecha.toISOString())
         .subscribe({
           next: (monedas) => {
             this.monedas = [{Currency:  'COP',TRM:1}];
             for(let item in monedas){
                this.monedas.push(monedas[item]);
             }
             
             //this.setearTRMSolped('USD');
           },
           error: (error) => {
               //console.log(error);      
           }
         });
    }
  
    getImpuestos(){
      this.comprasService.taxesXE(this.authService.getToken())
          .subscribe({
            next: (taxes) => {
             
              for(let item in taxes){
                this.impuestos.push(taxes[item]);  
              }
              //console.log(this.impuestos);
            },
            error: (error) => {
                //console.log(error);      
            }
          });
    }


    getInfoPedido(){
      //Obtener info entrada desde un pedido SAP
      if(this.pedido){
          //console.log(this.pedido);
                 
            this.comprasService.pedidoByIdSL(this.authService.getToken(),this.pedido)
                .subscribe({
                    next: (pedido)=>{
                        console.log(pedido);
                        this.asignarValores(pedido);
                    },
                    error: (err)=>{
                        console.log(err);
                    }
                });
        
      }else{
          //Obtener info entrada de una entrada registrada en MySQL
          console.log(this.entradaEditar);
          this.getInfoEntrada();
      }
    }

    getInfoEntrada(){
      this.comprasService.entradaById(this.authService.getToken(),this.entradaEditar.entrada)
          .subscribe({
              next: (entrada)=>{
                console.log(entrada);  
                this.asignarValores(entrada);
              },
              error: (err)=>{
                console.log(err);
              }
          });
    }

    async asignarValores (pedido:any){
        this.nombreproveedor = pedido.CardName;
        this.codigoproveedor = pedido.CardCode;
        this.comentarios = !this.entradaEditar?pedido.Comments+" - Basado en pedido de compra "+pedido.DocNum:pedido.Comments;
        this.fechaContable = new Date(pedido.DocDate);
        
        this.fechaCaducidad = new Date(pedido.DocDueDate);
        this.fechaDocumento = new Date(pedido.TaxDate);
        this.fechaNecesidad = new Date(pedido.RequriedDate);
        this.pedidonumsap = pedido.DocNum;
        

        if(!this.entradaEditar){
            //Obtener nombre serie de pedido
          console.log(this.seriesPedido.filter(item=>item.code === pedido.Series)[0].name);
          //Obtener nombre serie de entrada segun serie pedido

          switch(this.seriesPedido.filter(item=>item.code === pedido.Series)[0].name){
            case 'OCB':
            case 'OCM':
            case 'OCE':
              
              this.serieName = 'EM';

            break;

            case 'OCF':
            case 'OCS':
              this.serieName = 'HE';
            break;

          }

          //Obtener codigo de serie entrada
          this.serie = this.series.filter(item=>item.name === this.serieName)[0].code;

        }else{
          //Obtener serie de entradas
          console.log(this.series, pedido.Series,this.series.filter(item=>item.code == pedido.Series));
          this.serieName = this.series.filter(item=>item.code == pedido.Series)[0].name;
          this.serie = this.series.filter(item=>item.code == pedido.Series)[0].code;
          this.codigoSap = pedido.sapdocnum;
        }
        
      
      
        this.clase = pedido.DocType==='dDocument_Service'?'S':'I';


        this.lineasEntrada = [];
        this.lineaEntrada = [];
        for(let lineaPedido of pedido.DocumentLines){
            this.lineasEntrada.push({
                linenum:lineaPedido.LineNum,
                LineStatus:lineaPedido.LineStatus,
                itemcode : lineaPedido.ItemCode,
                dscription:lineaPedido.ItemDescription,
                cantidad_pedido:lineaPedido.BaseOpenQuantity,
                cantidad_pendiente:lineaPedido.RemainingOpenQuantity,
                cantidad:!this.entradaEditar?pedido.DocType==='dDocument_Service'?1:0:lineaPedido.cantidad,
                precio:lineaPedido.Price,
                moneda:lineaPedido.Currency==='$'?'COP':lineaPedido.Currency,
                tax:lineaPedido.TaxCode,
                linetotal:!this.entradaEditar?pedido.DocType==='dDocument_Service'?lineaPedido.LineTotal:0:lineaPedido.LineTotal,
                valortax:!this.entradaEditar?pedido.DocType==='dDocument_Service'?lineaPedido.TaxTotal:0:lineaPedido.TaxTotal,
                linegtotal:!this.entradaEditar?pedido.DocType==='dDocument_Service'?lineaPedido.LineTotal+lineaPedido.TaxTotal:0:lineaPedido.linegtotal,
                acctcode:lineaPedido.AccountCode,
                BaseEntry:pedido.DocEntry,
                BaseDocNum:pedido.DocNum,
                BaseLine:lineaPedido.BaseLine,
                BaseType:22,
                ocrcode:lineaPedido.CostingCode,
                ocrcode2:lineaPedido.CostingCode2,
                ocrcode3:lineaPedido.CostingCode3,
                whscode:lineaPedido.WarehouseCode

            });
            //this.lineasEntrada.push(this.lineaEntrada);

            //if(lineaPedido.ItemCode!=='') this.lineaEntrada.ItemCode = lineaPedido.ItemCode;

        }
    }
  

    SeleccionarSerie(){}
   
    SeleccionarFechaContable(){}

    SeleccionarMoneda(){}

    SeleccionarLinea(){}

    SeleccionarItemCode(){
      //console.log(this.item);
      this.descripcion = this.item.ItemName;
      if(this.item.ApTaxCode){
        
        this.impuesto = this.impuestos.filter(item => item.Code === this.item.ApTaxCode)[0];
        //console.log(this.impuesto);
        
        this.SeleccionarImpuesto();
      }
      this.cuenta = {Code:"",Name:""};
      this.nombreCuenta = "";
    }

    clearItemCode(){
 
    }

    SeleccionarVicepresidencia(){
      //console.log(this.viceprecidencia);
  
      if(this.viceprecidencia){
        
        let dependenciasTMP = this.dependenciasUsuario.filter((data => data.vicepresidency === this.viceprecidencia.vicepresidency));
  
        for(let dependencia of dependenciasTMP){
          if((this.dependencias.filter(data => data.dependence === dependencia.dependence)).length ===0){
            this.dependencias.push(dependencia);
          }
        }
      }
    }

    SeleccionarDependencia(){
      //console.log(this.dependencia);
      if(this.dependencia){
        
        let dependenciesTMP = this.dependenciasUsuario.filter((data => (data.dependence === this.dependencia.dependence && data.vicepresidency === this.dependencia.vicepresidency)));
        
        //Llena locaciones
        for(let dependencia of dependenciesTMP){
          if((this.localidades.filter(data => data.location === dependencia.location)).length ===0){
            this.localidades.push(dependencia);
          }
        }
        //Llenar cuentas segun  dependencia seleccionada
        //Obtener cuentas asociadas a la dependencia
        this.cuentasxDependencia();
      }
  
    }
  
    SeleccionarLocalidad(){
      //console.log(this.localidad);
      
    }
  
    SeleccionarAlmacen(){
      //console.log(this.almacen);
    }
  
    SeleccionarCuenta(){
      //console.log(this.cuenta);
      this.nombreCuenta = this.cuenta.Name;
    }

    SeleccionarImpuesto(){
      //console.log(this.impuesto);
      
      if(!this.impuesto){
        this.prcImpuesto = 0;
      }else{
        
        this.prcImpuesto = this.impuesto.tax;
        this.calcularImpuesto();
      }
    }

    AdicionarLinea(){}

    MostrarDetalle(){
      //console.log(this.lineasEntrada);
      this.listadoLineas =  true;
      this.calculatTotales();
    }

    validarCantidad():boolean{
      let resultadoValidacionForm = false;
      if(this.cantidad_pendiente < this.cantidad){
        this.messageService.add({severity:'error', summary: '!Error', detail: 'La cantidad a recibir no puede ser mayor a la cantidad pendiente del pedido'});
        this.cantidad = 0;
        resultadoValidacionForm = true;
      }else if(0 >= this.cantidad){
        this.messageService.add({severity:'error', summary: '!Error', detail: 'La cantidad a recibir no puede ser menor o igual a cero'});
        this.cantidad = 0;
        resultadoValidacionForm = true;
      }else{
        this.calcularSubtotalLinea();
      }
      return resultadoValidacionForm;
      
    }

    calculatTotales(){
      this.totalimpuestos =0;
      this.subtotal = 0;
      this.grantotal = 0;
    
      for(let item of this.lineasEntrada){
        this.totalimpuestos +=item.valortax;
        this.subtotal += item.linetotal;
        this.grantotal += item.linegtotal;
      }
    }

    calcularSubtotalLinea(){
      //console.log(this.cantidad,this.precio,this.monedas, this.trm);
      let tasaMoneda = this.monedas.filter(item=>item.Currency === this.moneda)[0].TRM;
      //console.log(tasaMoneda);
      if(!this.cantidad || !this.precio){
        this.subtotalLinea =0;
      }else{
        this.subtotalLinea = this.cantidad * (this.precio*(tasaMoneda || 0));
      }
      this.calcularImpuesto(); 
    }

    calcularTotalLinea(){
      this.totalLinea = this.subtotalLinea+this.valorImpuesto;
    }

    calcularImpuesto(){

      if(!this.impuesto.tax || this.subtotalLinea ==0){
        this.valorImpuesto =0;
      }else{
        ///console.log("Calcula impuesto")
        this.valorImpuesto =this.subtotalLinea*(this.impuesto.tax/100);
      }
      this.calcularTotalLinea();
    }

    cuentasxDependencia(){
      this.sapService.cuentasPorDependenciaXE(this.authService.getToken(),this.dependencia.dependence)
          .subscribe({
              next: (cuentas) => {
                //console.log(cuentas);
                let arrayCuentasDep = [];
                for(let item in cuentas){
                  arrayCuentasDep.push(cuentas[item].U_NF_CUENTA);
                }
                let cuenta:any;
                let filtered: any[] = [];
    
                for(let i = 0; i < this.cuentas.length; i++) {
                  cuenta = this.cuentas[i]; 
                  for(let item of arrayCuentasDep){
                    if((cuenta.Code.indexOf(item)==0)){
                    ////console.log(businessPartner);
                    filtered.push(cuenta);
                    }
                  }
                }
                //console.log(filtered);
                this.cuentasDependencia = filtered;
              },
              error: (err) => {
                //console.log(err);
              }
          });
    }

    GuardarEntrada(){
     
      this.envioFormulario = true;
      if( this.clase &&  this.serie &&   this.fechaContable && this.fechaCaducidad && this.fechaDocumento && this.fechaNecesidad){
        if(this.lineasEntrada.length > 0){

            if(this.lineasEntrada.filter(item =>item.cantidad ===0 && item.LineStatus==='bost_Open').length!=this.lineasEntrada.length){

              if(this.lineasEntrada.filter(item =>item.cantidad ===0 && item.LineStatus==='bost_Open').length>0){
                this.messageService.clear();
                this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Confirmación', detail:`Las lineas abiertas que no han sido diligenciadas no seran tenidas en cuenta en la entrada, ¿desea continuar con el registro de la entrada? `});
              }else{
                this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Confirmación', detail:`¿Esta seguro de realizar el registro de la entrada?`});
                
              }
              
             


            }else{
              this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar al menos una línea en la entrada'});
              this.envioFormulario = false;
            }
          //this.submittedBotton = true;
          //console.log(this.solped, this.solpedDetLines);
  
          
        }else{
          this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar al menos una línea en la entrada'});
          this.envioFormulario = false;
        }
        
      }else{
        this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar los campos resaltados en rojo'});
        this.envioFormulario = false;
      }

    }

    GrabarEntrada(){
      const data:any = {
        entrada:  {
          id_user: this.infoUsuario.id,
          usersap: this.infoUsuario.codusersap,
          fullname: this.infoUsuario.fullname,
          serie:this.serie,
          doctype: this.clase,
          docdate:this.fechaContable,
          docduedate: this.fechaCaducidad,
          taxdate:this.fechaDocumento,
          reqdate:this.fechaNecesidad,
          sapdocnum:"0",
          codigoproveedor:this.codigoproveedor,
          nombreproveedor:this.nombreproveedor,
          comments:this.comentarios,
          trm:this.trm,
          currency:this.currency==='COP'?'$':this.currency,
          pedidonumsap:this.pedidonumsap
        },
        EntradaDet:this.lineasEntrada.filter(item =>item.cantidad !==0 && item.LineStatus==='bost_Open')
      }

      //if(this.lineasEntrada) data.entrada.id = this.entradaEditar;

      //console.log(data);      
      this.onNewEntrada.emit(data);              

      this.envioFormulario = false;
    }

    NuevaEntrada(){}

    EditarLinea(){
      //console.log(this.lineaSeleccionada[0]);
      this.lineaEntrada = this.lineaSeleccionada[0];
      //console.log(this.lineaEntrada);
      this.editarLinea = true;
      this.MostrarFormularioLinea();
      this.numeroLinea = this.lineaEntrada.linenum;
      
     
      if(this.lineaEntrada.itemcode){
        
        this.item = this.items.filter(item => item.ItemCode ===this.lineaEntrada.itemcode)[0];
        
      }
      this.descripcion = this.lineaEntrada.dscription;
  
      
      if(this.lineaEntrada.acctcode){
        this.cuenta = this.cuentas.filter(item =>item.Code === this.lineaEntrada.acctcode)[0];
      }
  
      if(this.lineaEntrada.ocrcode3){
        this.viceprecidencia = this.vicepresidencias.filter(item =>item.vicepresidency === this.lineaEntrada.ocrcode3)[0];
        
        this.SeleccionarVicepresidencia();
      }
  
      if(this.lineaEntrada.ocrcode2){
        this.dependencia = this.dependencias.filter(item =>item.dependence === this.lineaEntrada.ocrcode2)[0];
        this.SeleccionarDependencia();
      }
  
      if(this.lineaEntrada.ocrcode){
        this.localidad = this.localidades.filter(item =>item.location === this.lineaEntrada.ocrcode)[0];
        
      }
  
      if(this.lineaEntrada.whscode){
        this.almacen = this.almacenes.filter(item => item.store === this.lineaEntrada.whscode)[0];
      }
  
  
      if(this.lineaEntrada.tax){
        this.impuesto = this.impuestos.filter(item =>item.Code === this.lineaEntrada.tax)[0];
        this.prcImpuesto =  this.impuesto.tax;
        //console.log(this.impuesto);
      }
  
      if(this.lineaEntrada.acctcode){
        this.cuenta = this.cuentas.filter(item =>item.Code === this.lineaEntrada.acctcode)[0];
        this.nombreCuenta = this.cuenta.Name;
      }
      
      this.cantidad = this.lineaEntrada.cantidad || 0;
      this.cantidad_pendiente = this.lineaEntrada.cantidad_pendiente || 0;
      this.cantidad_pedido = this.lineaEntrada.cantidad_pedido || 1;
      this.moneda = this.monedas.filter(item =>item.Currency === this.lineaEntrada.moneda)[0].Currency;
     
      this.precio = this.lineaEntrada.precio || 0;
      this.subtotalLinea = this.lineaEntrada.linetotal;
     
  
     
      this.valorImpuesto = this.lineaEntrada.linetotal*(this.prcImpuesto/100);
      this.totalLinea = this.lineaEntrada.linegtotal;
      
    }

    MostrarFormularioLinea(){
      this.formularioLinea = true;
      this.nuevaLinea = false;
    }

    BorrarLineas(){}

    RegistrarLinea(){
      this.envioLinea = true;
      //console.log(this.numeroLinea, this.iteradorLinea);
      if(this.viceprecidencia.vicepresidency && 
        this.dependencia.dependence && 
        this.localidad.location && 
        this.cantidad &&
        this.precio &&
        this.impuesto &&
        ((this.cuenta.Code && !this.item.ItemCode) || (!this.cuenta.Code && this.item.ItemCode)) || !this.validarCantidad()){
  
          let indexLineaDuplicada = this.LineaDuplicada();
          
          if(indexLineaDuplicada>=0 && this.lineasEntrada[indexLineaDuplicada].linenum!==this.numeroLinea){
            //console.log(indexLineaDuplicada,this.lineasSolped[indexLineaDuplicada].linenum,this.numeroLinea);
            this.messageService.add({severity:'warn', 
                                     summary: '!Atención', 
                                     detail: `Los siguientes datos item: ${this.item.ItemCode}, 
                                              Vicepresidencia: ${this.viceprecidencia.vicepresidency}, 
                                              Dependencia: ${this.dependencia.dependence} y 
                                              localidad: ${this.localidad.location} 
                                              ya se encuentran registrados en la 
                                              linea ${this.lineasEntrada[indexLineaDuplicada].linenum} de esta solped`});    
          }else{
            if(this.editarLinea){
              
              this.asignarCamposLinea(this.lineaSeleccionada[0].linenum);
              //console.log(this.lineasEntrada.indexOf(this.lineaSeleccionada[0]));
              this.lineasEntrada.splice(this.lineasEntrada.indexOf(this.lineaSeleccionada[0]),1,this.lineaEntrada);
              //console.log(this.lineasSolped);
              this.messageService.add({severity:'success', summary: '!OK¡', detail: 'Se realizo correctamente la actualización de la línea'});
              this.editarLinea = false;
            }else{
              
              
              //this.lineaSolped.id_user = this.infoUsuario.id;
              //this.lineaSolped.linenum =  this.numeroLinea;
              this.asignarCamposLinea(this.numeroLinea);
              this.lineasEntrada.push(this.lineaEntrada);
              this.iteradorLinea++;
              //console.log(this.lineasEntrada);
              this.messageService.add({severity:'success', summary: '!OK¡', detail: 'Se realizo correctamente el registro de la línea'});
            }
            //realizar el proceso de registro de linea
            this.formularioLinea = false;
            this.calculatTotales();
            this.resetearFormularioLinea();
            this.envioLinea = false;
  
          }
      }else{
          this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar los campos resaltados en rojo'});
          
      }
    }

    LineaDuplicada():number{
      let sameLine = this.lineasEntrada.filter(line => line.itemcode === this.item.ItemCode &&
                                                      line.dscription === this.descripcion &&   
                                                      line.ocrcode === this.localidad.location && 
                                                      line.ocrcode2 === this.dependencia.dependence &&
                                                      line.ocrcode3 === this.viceprecidencia.vicepresidency);
      //console.log(this.lineasSolped.indexOf(sameLine[0]));
      return this.lineasEntrada.indexOf(sameLine[0]); 
    }

    asignarCamposLinea(linea:number){
      //Validar si el numero de linea esta registrada en las lineasEstrada
      if(this.lineasEntrada.filter(item => item.linenum === linea).length>0){
        //Si existe MOdificar lina
        this.lineaEntrada = this.lineasEntrada.filter(item => item.linenum === linea)[0];
        this.lineaEntrada.id_user=this.infoUsuario.id;
        this.lineaEntrada.cantidad = this.cantidad;
        this.lineaEntrada.linetotal = this.subtotalLinea;
        this.lineaEntrada.taxvalor = this.valorImpuesto;
        this.lineaEntrada.linegtotal = this.totalLinea;

        //console.log("Editar linea",this.lineaEntrada);
      }else{
        //Generar Linea
      }
    }

    resetearFormularioLinea(){
      ////console.log(this.monedas);
      this.numeroLinea = -1;
      this.fechaRequerida = new Date();
      this.proveedor = {CardCode:"",CardName:""};
   
      this.item = {ApTaxCode:"",ItemCode:"",ItemName:""};
      this.itemsFiltrados=[];
      this.descripcion = "";
      this.viceprecidencia = {codusersap:"",dependence:"",id:0,location:"",vicepresidency:""};
      //this.dependencias = [{codusersap:"",dependence:"",id:0,location:"",vicepresidency:""}];
      this.dependencia = {codusersap:"",dependence:"",id:0,location:"",vicepresidency:""};
      //this.localidades =[{codusersap:"",dependence:"",id:0,location:"",vicepresidency:""}];
      this.localidad = {codusersap:"",dependence:"",id:0,location:"",vicepresidency:""};
      this.almacen = "";
      this.cuenta = {Code:"",Name:""};
      this.cuentasFiltradas = [];
      this.nombreCuenta = "";
      this.cantidad = 1;
      this.moneda = this.lineasEntrada.length>0? this.lineasEntrada[0].moneda || 'COP':'COP';
      this.precio =0;
      this.subtotalLinea = 0;
      this.impuesto = "";
      this.prcImpuesto =0;
      this.valorImpuesto =0;
      this.totalLinea =0;
    }

    onReject(){
      this.messageService.clear('c');
      this.envioFormulario = false;
    }

    onConfirm(){
      this.GrabarEntrada();
      this.messageService.clear('c');
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

    filtrarCuentas(event:any){
      let filtered : any[] = [];
      let query = event.query;
    
    
      for(let i = 0; i < this.cuentasDependencia.length; i++) {
        let cuentaDependencia = this.cuentasDependencia[i];
        if(cuentaDependencia.Code!=null && cuentaDependencia.Name!=null){
          
          if((cuentaDependencia.Code.toLowerCase().indexOf(query.toLowerCase())>=0) ||
            (cuentaDependencia.Name.toLowerCase().indexOf(query.toLowerCase())>=0)){
            //console.log(cuentaDependencia);
            filtered.push(cuentaDependencia);
         }
        }
      }
      
    
      this.cuentasFiltradas = filtered;
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
