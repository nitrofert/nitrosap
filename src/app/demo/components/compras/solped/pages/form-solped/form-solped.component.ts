import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api'
import { Table } from 'primeng/table';
import { CuentasSAP } from 'src/app/demo/api/accountsSAP';
import { BusinessPartners } from 'src/app/demo/api/businessPartners';


import { DependenciasUsuario, InfoUsuario,PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';
import { ItemsSAP } from 'src/app/demo/api/itemsSAP';
import { SolpedDet, SolpedInterface } from 'src/app/demo/api/solped';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { SAPService } from 'src/app/demo/service/sap.service';

interface expandedRows {
  [key: string]: boolean;
}


@Component({
  selector: 'app-form-solped',
  providers:[MessageService],
  templateUrl: './form-solped.component.html',
  styleUrls: ['./form-solped.component.scss'],
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
export class FormSolpedComponent implements OnInit {


  @Input() solpedEditar:any;
  @Input() registroSolped:any;
  @Output() onNewSolped: EventEmitter<SolpedInterface> = new EventEmitter();

  @ViewChild('filter') filter!: ElementRef;

  infoUsuario!: InfoUsuario;
  perfilesUsuario: PerfilesUsuario[] = [];
  permisosUsuario: PermisosUsuario[] = [];
  permisosUsuarioPagina!:PermisosUsuario[];

  dependenciasUsuario:DependenciasUsuario[] = [];
  vicepresidencias:DependenciasUsuario[] = [];
  dependencias:DependenciasUsuario[] = [];
  localidades:DependenciasUsuario[] = [];
  series:any[] = [];
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

  /***** NG Model ******/

  /*** Encabezado Solped ***/
  nombreusuario:string ="";
  area:string="";
  clase:string = "";
  serie:string ="";
  serieName:string ="";
  codigoSap:string ="0";
  fechaContable:Date = new Date();
  fechaCaducidad:Date = new Date();
  fechaDocumento:Date = new Date();
  fechaNecesidad:Date = new Date();
  comentarios:string = "";
  currency:string = "COP";
  /*** Detalle solped *****/
  iteradorLinea:number =0;
  numeroLinea:number=-1;
  fechaRequerida:Date = new Date();
  proveedor!:BusinessPartners;
  item!:ItemsSAP;
  descripcion:string = "";
  viceprecidencia!:DependenciasUsuario;
  dependencia!:DependenciasUsuario;
  localidad!:DependenciasUsuario;
  almacen:any = "";
  cuenta!:CuentasSAP;
  cuentasDependencia!:CuentasSAP[];
  nombreCuenta:string = "";
  cantidad:number = 1;
  moneda:string ="";
  precio:number =0;
  subtotalLinea:number = 0;
  impuesto:any = "";
  prcImpuesto:number =0;
  valorImpuesto:number =0;
  totalLinea:number =0;

  totalimpuestos:number =0;
  subtotal:number =0;
  grantotal:number =0;

  /*********************/

  /*** Validadores ****/
  lineasSolped:SolpedDet[] = []; // Array para guardar temporalmente las lineas de la solped que se van a guardar o editar
  lineasSolpedCVS:any[] = []; // Array
  lineaSolped!:SolpedDet; //Linea para registrar o actualizar
  lineaSeleccionada:SolpedDet[] = []; //array de lineas seleccionadas del listado de lineas de la solped

  anexosSolped:any[] = [];
  lineaAnexoSeleccionada:any[]=[];

  envioFormulario:boolean =false;  //Controla el envio del formulario
  nuevaLinea:boolean = false; //Controla el llenado de los campos del encabezado
  editarLinea:boolean = false; //Controla la accion "Edita o Adicionar" del fromulario de linea solped
  formularioLinea:boolean = false;  // Controla la visibilidad del formulario de linea solped
  formularioAnexo:boolean = false; // Controla la visibilidad del formulario de cargue de anexos
  envioLinea:boolean = false; // Controla el llenado de los campos del formulario de linea solped
  formularioCSV:boolean = false; //Controla el formulario de cargue CSV detalle solped
 
  
  envioLineaanexo:boolean = false; // Controla el llenado de los campos del formulario de linea solped 
  listadoLineas:boolean = false; //Controla la visibilidad del listado de lineas de la solped
  listadoAnexos:boolean = false; //Controla la visibilidad del listado de anexos

  uploadedFiles: any[] = [];
  uploadedFiles2: any[] = [];
  tiposanexo:any[] = [{name:"Revisión presupuestal"},{name:"Especificación técnica"},{name:"Otro"}];
  tipoanexo!:any ; 

  loading:boolean = false; // Controla el spiner de cargue del listado de lineas de la solped
  solpedAprobada: string = "N";
  urlBreadCrumb:string ="";

  file!: any ;
  fileTmp:any;

  file2!: any ;
  fileTmp2:any;

  /******************* */

  /******* Filtros autocompetar ********/

  proveedoresFiltrados:BusinessPartners[] = [];
  itemsFiltrados:ItemsSAP[] = [];
  cuentasFiltradas:CuentasSAP[] = [];

  cargueValido:boolean = false;
  loadingCargueCSV:boolean =false;
  


  /*********************************** */

  constructor(private authService: AuthService,
              private sapService:SAPService,
              private comprasService: ComprasService,
              private router:Router,
              private messageService: MessageService,
              private rutaActiva: ActivatedRoute) {

               }

  ngOnInit(): void {

     
       
        //Cargar informacion del usuario
        this.getInfoUsuario();
        //Cargar perfiles del usuario
        this.getPerfilesUsuario();
        //Cargar permisos del usuario
        this.getPermisosUsuario();
        //Cargar permisos usuario pagina
        this.getPermisosUsuarioPagina();
        //Cargar dependencia x usuario
        this.getDependenciasUsuario();
        //Cargar series de la solped
        this.getSeries();
        //Cargar areas asociadas al usuario para la solped
       this.getAreas();
        //Cargar clases de solped
        this.getClases();
        //Cargar proveedores
        this.getProveedores();
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
        setTimeout(()=>{this.getInformacionSolped();},500);
        
        this.resetearFormularioLinea();
        
        console.log(this.authService.getInfoUsuario().companyname.toLowerCase());

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
    //console.log(this.permisosUsuario,this.permisosUsuarioPagina);
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
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getSeries(){
    //this.series = [{name:'SPB',code:'94'},{name:'SPS',code:'62'}];

    this.sapService.seriesDocXEngineSAP(this.authService.getToken(),'1470000113')
        .subscribe({
            next: (series)=>{
                
                for(let item in series){
                  if(series[item].name!='SPMP'){
                    this.series.push(series[item]);
                  }
                  
              }
                //this.series = series.filter(item => item.)
                this.serie = this.series[0].code;
                this.serieName =this.series[0].name;
                this.clase ='I';
                //console.log(this.series);
            },
            error: (err)=>{
              console.log(err);
            }
        });

    
  }

  async getAreas(){
    await this.authService.getAreasUsuarioXE()
     .subscribe({
       next:  (areas) => {
          for(let item in areas){
             this.areas.push(areas[item]);
         }
         //console.log(this.areas);
       },
       error: (error) => {
         //console.log(error);
       }
     });
  }

  getClases(){
    this.clases = [{code:"I", name:"Artículo"},{code:"S",name:"Servicio"}];
  }

  getProveedores(){
    this.sapService.BusinessPartnersXE(this.authService.getToken())
        .subscribe({
          next: (businessPartners) => {
            for(let item in businessPartners){
              this.proveedores.push(businessPartners[item]);
           }
          },
          error: (error) => {
              //console.log(error);      
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
           //console.log(cuentas);
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
        //console.log(stores);
        for(let item in stores){
          this.almacenes.push(stores[item]);
       }
       console.log(this.almacenes);
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
           
           this.setearTRMSolped('USD');
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

  getInformacionSolped(){

    if(this.solpedEditar){
      //console.log('Informacion solped',this.solpedEditar);
      //Cargar datos de la solped por el id
      this.comprasService.solpedById(this.authService.getToken(),this.solpedEditar)
          .subscribe({
                next:  (solped)=>{
                  //console.log(solped);
                  this.infoSolpedEditar = solped;
                  this.lineasSolped = this.infoSolpedEditar.solpedDet;
                  console.log(this.lineasSolped);
                  //this.anexosSolped = this.infoSolpedEditar.anexos;

                  for(let anexo of this.infoSolpedEditar.anexos){
                    
                    this.anexosSolped.push({tipo:anexo.tipo, file:{name:anexo.nombre, size:anexo.size}, url:anexo.ruta, idanexo:anexo.id});
                  }
          
                 
                  this.serie = this.series.filter(item=>item.code==this.infoSolpedEditar.solped.serie)[0].code;
                  
                  this.codigoSap = this.infoSolpedEditar.solped.sapdocnum || '0';
                  
                  this.clase = this.infoSolpedEditar.solped.doctype || '';
                  this.fechaContable = new Date(this.infoSolpedEditar.solped.docdate);
                  this.fechaCaducidad = new Date( this.infoSolpedEditar.solped.docduedate);
                  this.fechaDocumento = new Date(this.infoSolpedEditar.solped.taxdate);
                  this.fechaNecesidad = new Date(this.infoSolpedEditar.solped.reqdate);
                  this.comentarios = this.infoSolpedEditar.solped.comments || '';
                  this.trm = this.infoSolpedEditar.solped.trm;
                  this.currency = this.infoSolpedEditar.solped.currency || this.trm ===1?'COP':'USD';
                  this.iteradorLinea = (this.lineasSolped[this.lineasSolped.length-1].linenum)+1;
                  this.solpedAprobada = this.infoSolpedEditar.solped.approved || 'N';
                  //console.log( this.areas);
                  this.area = this.areas.filter(item => item.area === this.infoSolpedEditar.solped.u_nf_depen_solped )[0].area;
                  //console.log(this.iteradorLinea);
                  
                }, 
                error: (error)  => {
                    console.log(error);
                }
           });


    }else{
          console.log('Nueva solped');
    }

    
  }


  /************** */

  /**** Selecteds objects */

  SeleccionarArea(){
    //console.log(this.area);
  }

  SeleccionarClase(){
    //console.log(this.clase);
  }

  SeleccionarSerie(){
    //console.log(this.serie,this.series);

    this.serieName = this.series.filter(item => item.code===this.serie)[0].name;
    //console.log(this.serieName);
    if(this.serieName=='SPB'){
      this.clase ='I';
    }else{
      this.clase ="";
    }
    //Resetear formulario de linea solped
    this.resetearFormularioLinea();
  }

  SeleccionarFechaContable(){
    //console.log(this.fechaContable);
    this.getMonedas(this.fechaContable);
  }

  SeleccionarProveedor(){
    //console.log("Valor proveedor",this.proveedor);
  }

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
    console.log(this.dependencia);
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

  SeleccionarMoneda(){
    //console.log(this.monedas);
    
    //this.trm= this.monedas.filter(item => item.Currency === this.moneda)[0].TRM;
    this.currency = this.monedas.filter(item => item.Currency === this.moneda)[0].Currency;
    //console.log( "seleccion moneda",this.trm );
    
    this.calcularSubtotalLinea();
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

  SeleccionarLinea(){
    //console.log(this.lineaSeleccionada);
  }

  /************* */

/*** eventos ******/

filtrarProveedores(event:any){
  let filtered : any[] = [];
    let proveedores:any;
    let query = event.query;
    for(let i = 0; i < this.proveedores.length; i++) {
      proveedores = this.proveedores[i];
         if((proveedores.CardCode.toLowerCase().indexOf(query.toLowerCase())>=0) ||
            (proveedores.CardName.toLowerCase().indexOf(query.toLowerCase())>=0)){
            ////console.log(businessPartner);
            filtered.push(proveedores);
         }
    }
    this.proveedoresFiltrados = filtered;
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

clearItemCode(){
 
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
             //console.log(this.cuentasDependencia);
          },
          error: (err) => {
            //console.log(err);
          }
      });

      console.log(this.dependencia.dependence);
}

filtrarCuentas(event:any){
  let filtered : any[] = [];
  let query = event.query;
   //console.log(this.cuentasDependencia);

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

resetearFormularioLinea(){
  ////console.log(this.monedas);
  this.numeroLinea = -1;
  this.fechaRequerida = new Date();
  this.proveedor = {CardCode:"",CardName:""};
  this.proveedoresFiltrados=[];
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
  this.moneda = this.lineasSolped.length>0? this.lineasSolped[0].moneda || 'COP':'COP';
  this.precio =0;
  this.subtotalLinea = 0;
  this.impuesto = "";
  this.prcImpuesto =0;
  this.valorImpuesto =0;
  this.totalLinea =0;
}

setearTRMSolped(currency:string){
  if(this.monedas.filter(moneda => moneda.Currency === currency).length >0){
    this.trm = this.monedas.filter(moneda => moneda.Currency === currency)[0].TRM;
  }else{
    this.trm = 0;
  }
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

calcularTotalLinea(){
  this.totalLinea = this.subtotalLinea+this.valorImpuesto;
}

calculatTotales(){
  this.totalimpuestos =0;
  this.subtotal = 0;
  this.grantotal = 0;

  for(let item of this.lineasSolped){
    this.totalimpuestos +=item.taxvalor;
    this.subtotal += item.linetotal;
    this.grantotal += item.linegtotal;
  }
}

/*****************/


  /***** Funciones buttons */

  verAnexos(){
    this.listadoAnexos = true;
  }

  adicionarlineaAnexo(){
    //console.log(this.tipoanexo,this.fileTmp);
    this.envioLineaanexo = true;
    if(this.tipoanexo && this.tipoanexo!="" &&  this.fileTmp && this.fileTmp!=""){
    
      if(this.solpedEditar){
        let anexo = {tipo:this.tipoanexo.name, file:this.fileTmp.fileRaw,url:'#'};
        this.loadFile(this.solpedEditar,anexo);
      }else{
        this.anexosSolped.push({tipo:this.tipoanexo.name, file:this.fileTmp.fileRaw,url:'#'});
      }
      this.tipoanexo = "";
      this.fileTmp ="";
      this.formularioAnexo = false;
    }else{
      this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Debe seleccionar el tipo y el archivo a anexar a la solped'});
    }
    


  }

  loadFile(solpedID:number,anexo:any ){
    
    let body:any; 

      //console.log(anexo.file, anexo.file.name);
      body = new FormData();
      body.append('myFile', anexo.file, anexo.file.name);
      body.append('anexotipo',anexo.tipo);
      body.append('solpedID',solpedID);

      this.comprasService.uploadAnexo(this.authService.getToken(),body)
        .subscribe({
           next:(result)=>{
              
              //console.log(result);
              //this.anexosSolped.push({tipo:anexo.tipo, file: anexo.file,url:'#'});
              this.anexosSolped.push({tipo:anexo.tipo, file:anexo.file, url:result.ruta, idanexo:result.idanexo});
              this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
              
           },
           error:(err)=>{
              console.log(err);
              this.messageService.add({severity:'error', summary: '!Error¡', detail: err});
           }
        });
      
    
    
  }

  AdicionarAnexo(){
    this.formularioAnexo = true;
    let tiposAnexosTMP =[];
    if(this.anexosSolped.length>0){

        //Recorrer el arreglo de tipos de anexo
        for(let tipo of this.tiposanexo){
          //validar tipo.name en el array de anexos
          //console.log(this.anexosSolped.filter(anexo => anexo.tipo == tipo.name));
          if(tipo.name!='Otro'){
            if(this.anexosSolped.filter(anexo => anexo.tipo == tipo.name).length==0){
              tiposAnexosTMP.push({name:tipo.name});
            }
          }else{
            tiposAnexosTMP.push({name:tipo.name});
          }
        }
        this.tiposanexo = tiposAnexosTMP;
      
    }
  }

  BorrarAnexo(){
    let lineasAnexoMP=[];
    let existe = false;
    for(let linea of this.anexosSolped){
      existe = false;
      for(let lineaSelect of this.lineaAnexoSeleccionada){
          if(linea === lineaSelect){
            existe = true;
    
          }
      }
      if(!existe){
        lineasAnexoMP.push(linea);
      }
    }
    //console.log(this.anexosSolped,lineasAnexoMP);
    this.anexosSolped = lineasAnexoMP;

    if(this.solpedEditar){
      
      for(let anexo of this.lineaAnexoSeleccionada){
        //console.log();
        let fileInfo = {ruta: anexo.url, name: anexo.file.name, tipo:anexo.tipo, idsolped:this.infoSolpedEditar.solped.id, idanexo:anexo.idanexo}
        this.comprasService.borrarAnexo(this.authService.getToken(),fileInfo)
            .subscribe({
                next:(result)=>{
                    //console.log(result);
                    this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                },
                error:(err)=>{
                  console.log(err);
                  this.messageService.add({severity:'error', summary: '!Error', detail: err});
                }
                
            });
      }
    }
  }

  seleccionarTipoAnexo(){

  }

  loadFiles(){
    
    let body:any; 
    for(let anexo of this.anexosSolped){
      //console.log=(anexo.file, anexo.file.name);
      body = new FormData();
      body.append('myFile', anexo.file, anexo.file.name);
      body.append('anexotipo',anexo.tipo);

      this.comprasService.uploadAnexo(this.authService.getToken(),body)
        .subscribe({
           next:(result)=>{
            //console.log('upload service');
              console.log(result)
           },
           error:(err)=>{
              console.log(err);
           }
        });
      
    }
  }

 

  onLoad($event:any){

    const [ file ] = $event.currentFiles;
    //console.log(file);
    this.fileTmp = {
      fileRaw:file,
      fileName:file.name
    }

   
  }

  


  

  consultarAnexo(url:string){
      //console.log(url);
      let urlFile= this.comprasService.downloadAnexo(url);
      //console.log(urlFile);
      window.open(urlFile,'blank');

  }

  consultarAnexo3(url:string){

    this.comprasService.downloadAnexo3(this.authService.getToken(),url)
        .subscribe({
            next:(result)=>{

            },
            error:(err)=>{
                console.log(err);
            }
        });

}

  consultarAnexo2(file:any){
    console.log(file);
    let fileInfo = {ruta: file.url, name: file.file.name, tipo:file.tipo, idsolped:this.infoSolpedEditar.solped.id, idanexo:file.idanexo};
    this.comprasService.downloadAnexo2(this.authService.getToken(),fileInfo)
            .subscribe({
                next:(result)=>{
                    //console.log(result);
                    //this.messageService.add({severity:'success', summary: '!Ok¡', detail: result.message});
                },
                error:(err)=>{
                  console.log(err);
                  //this.messageService.add({severity:'error', summary: '!Error', detail: err});
                }
                
            });

}
  

  AdicionarLinea(){
    this.nuevaLinea =true;

    if( this.clase &&  this.serie &&  this.area && this.fechaContable && this.fechaCaducidad && this.fechaDocumento && this.fechaNecesidad){
      
      this.resetearFormularioLinea();
      this.numeroLinea = this.iteradorLinea;
      this.MostrarFormularioLinea();
    }else{
      this.messageService.add({severity:'error', summary: '!Opps', detail: 'Debe diligenciar los campos resaltados en rojo'});
    }

  }

  MostrarFormularioLinea(){
    this.formularioLinea = true;
    this.nuevaLinea = false;
  }

  MostrarDetalle(){
    this.listadoLineas =  true;
    
    this.calculatTotales();
  }

  importarCSV(){

    this.nuevaLinea =true;

    if( this.clase &&  this.serie &&  this.area && this.fechaContable && this.fechaCaducidad && this.fechaDocumento && this.fechaNecesidad){
      
      this.formularioCSV = true;

    }else{
      this.messageService.add({severity:'error', summary: '!Opps', detail: 'Debe diligenciar los campos resaltados en rojo'});
    }
    
  }

  onLoad2($event:any){

  
    this.loadingCargueCSV = true;
    const [ file ] = $event.currentFiles;
    this.fileTmp2 = {
      fileRaw:file,
      fileName:file.name
    }
    this.readDocument(file);
  
  }

  readDocument(file:Blob) {
    let fileReader = new FileReader();
    let arrayTexto:any[] =[];
    fileReader.onload = (e) => {
      let text:any =fileReader.result ;
      var lines = text.split('\n') ;
      for(let line of lines){
        arrayTexto.push(this.reemplazarCaracteresEspeciales(line));
      }
      this.validarArchivoDetalle(arrayTexto);
    }
    fileReader.readAsText(file);
}

reemplazarCaracteresEspeciales(texto:string){
  return texto.replace('\r','').replace('\t','');
}


async validarArchivoDetalle(lienasArchivo:any){
  //console.log(lienasArchivo.length);
  if(this.validarEncabezado(lienasArchivo[0].split(","))){
    //validar contenido 
    this.cargueValido = await this.validarContenidoCSV(lienasArchivo,',');
    if(this.cargueValido){
      
      this.messageService.add({severity:'success', summary: '!Ok', detail: 'El archivo cargado cumple con la estructura básica requerida'});
    }

  }else if(this.validarEncabezado(lienasArchivo[0].split(";"))){
    //validar contenido
    this.cargueValido = await this.validarContenidoCSV(lienasArchivo,';');
    if(this.cargueValido){
      
      this.messageService.add({severity:'success', summary: '!Ok', detail: 'El archivo cargado cumple con la estructura básica requerida'});
    }
  }else{
    this.messageService.add({severity:'error', summary: '!Error', detail: 'El archivo cargado no cumple con la estructura básica requerida'});
  }


  
  this.loadingCargueCSV = false;
}

validarEncabezado(arrayLineaEncabezado:any[]){
  let camposEncabezado:any =['CODITEM',	'DESCITEM',	'FECHAREQ',	'IDPROVEEDOR',	'CANTIDAD',	'MONEDA',	'PRECIO',	'IMPUESTO',	'VICEPRESIDENCIA',	'DEPENDENCIA',	'LOCALIDAD',	'ALMACEN',	'CODCUENTA'];
  let valido = true;
  if(arrayLineaEncabezado.length != camposEncabezado.length){
    //this.messageService.add({severity:'error', summary: '!Error', detail: 'El archivo cargado no cumple con la estructura básica requerida'});
    valido = false;
  }else if(!this.encabezadosValidos(camposEncabezado,arrayLineaEncabezado)){
    //this.messageService.add({severity:'error', summary: '!Error', detail: 'El archivo cargado no cumple con la estructura básica requerida'});    
    valido = false;
  }

  return valido;
}

encabezadosValidos(camposEncabezado:any[], arrayLineaEncabezado:any[]){
    let valido = true;
    for(let encabezado of arrayLineaEncabezado){
        if(!camposEncabezado.includes(encabezado)){
          valido = false;
          break;
        }
    }
    return valido;
}

  async validarDependencia(vicepresidencia:any,dependencia:any):Promise<boolean>{
  let valido = false;
  //console.log(this.vicepresidencias.filter(data => data.vicepresidency === vicepresidencia)[0]);
  this.viceprecidencia = this.vicepresidencias.filter(data => data.vicepresidency === vicepresidencia)[0];
  await this.SeleccionarVicepresidencia();
  //console.log(dependencia,this.dependencias.filter(data => data.dependence === dependencia).length);
  if(this.dependencias.filter(data => data.dependence === dependencia).length>0){
    valido = true;
  }
  //console.log(valido);
  return valido;
}

 async validarLocalidad(dependencia:any,localidad:any):Promise<boolean>{
  let valido = false;
  this.dependencia = this.dependencias.filter(data => data.dependence === dependencia)[0];
  await this.SeleccionarDependencia();
  
  //console.log(this.localidades.filter(data => data.location === localidad).length);
  if(this.localidades.filter(data => data.location === localidad).length>0){
    valido = true;
  }
  return valido;

}

async validarCuentaContable(cuenta:any){
  let valido = false;

  
  //console.log(valido);
  if(this.cuentas.filter(data => data.Code === cuenta).length>0){
    valido = true;
  }
  return valido;
}


 async validarContenidoCSV(lienasArchivo:any,separador:string):Promise<boolean>{
  let valido = true;
  console.log(lienasArchivo);
  let arrayLinea:any;
  this.lineasSolpedCVS = [];
  
  let lineasProcesadas =0;
  let linetotal:any;
  let taxvalor:any;

  for(let linea = 1 ;linea < lienasArchivo.length; linea ++){
    
      arrayLinea = lienasArchivo[linea].split(separador);
                
      if(arrayLinea.length==13){
        if(this.clase =='I' && arrayLinea[0]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código del item de la linea ${linea}, es obligatorio para solicitudes de bienes`});
          valido = false;  
        }else if(arrayLinea[0]!='' && this.items.filter(item =>item.ItemCode==arrayLinea[0]).length==0){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código del item  de la linea ${linea}, no existe en el listado de items de SAP`});
          valido = false;
        }else if(arrayLinea[1]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `La descripción del articulo o servicio de la linea ${linea} es obligatoria`});
          valido = false;
        }else if(arrayLinea[2]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `La fecha requerida de la linea ${linea} es obligatoria`});
          valido = false;
        }else if(arrayLinea[2]!='' && isNaN(Date.parse(arrayLinea[2]))){
          this.messageService.add({severity:'error', summary: '!Error', detail: `La fecha requerida de la linea ${linea} no es valida`});
          valido = false;
        }else if(arrayLinea[3]!='' && this.proveedores.filter(item =>item.CardCode==arrayLinea[3]).length==0){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código del proveedor de la linea ${linea}, no existe en el listado de proveedores de SAP`});
          valido = false;
        }else if(arrayLinea[4]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `La cantidad de la linea ${linea} es obligatoria`});
          valido = false;
        }else if(arrayLinea[4]!='' && isNaN(arrayLinea[4])){
          this.messageService.add({severity:'error', summary: '!Error', detail: `La cantidad de la linea ${linea} no es un número`});
          valido = false;
        }else if(arrayLinea[5]!='' && this.monedas.filter(item =>item.Currency==arrayLinea[5]).length==0){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de la moneda de la linea ${linea}, no existe en el listado de monedas de SAP ${JSON.stringify(this.monedas)}`});
          valido = false;
        }else if(arrayLinea[6]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El precio de la linea ${linea} es obligatorio`});
          valido = false;
        }else if(arrayLinea[6]!='' && isNaN(arrayLinea[6])){
          this.messageService.add({severity:'error', summary: '!Error', detail: `La precio de la linea ${linea} no es un número`});
          valido = false;
        }else if(arrayLinea[7]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código del impuesto de la linea ${linea} es obligatorio`});
          valido = false;
        }else if(arrayLinea[7]!='' && this.impuestos.filter(item =>item.Code==arrayLinea[7]).length==0){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de impuesto de la linea ${linea}, no existe en el listado de impuestos de SAP`});
          valido = false;
        }else if(arrayLinea[8]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de la viceprecidencia de la linea ${linea} es obligatorio`});
          valido = false;
        }else if(arrayLinea[8]!='' && this.vicepresidencias.filter(item =>item.vicepresidency==arrayLinea[8]).length==0){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de la viceprecidencia de la linea ${linea}, no existe en el listado de viceprecidencias asociadas al usuario`});
          valido = false;
        }else if(arrayLinea[9]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de la dependencia de la linea ${linea} es obligatorio`});
          valido = false;
        }else if(arrayLinea[9]!='' && !( await this.validarDependencia(arrayLinea[8],arrayLinea[9]))){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de la dependencia de la linea ${linea}, no existe en el listado de dependencias asociadas al usuario`});
          valido = false;
        }else if(arrayLinea[10]==''){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de la localidad de la linea ${linea} es obligatorio`});
          valido = false;
        }else if(arrayLinea[10]!='' && !(await this.validarLocalidad(arrayLinea[9],arrayLinea[10]))){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de la localidad de la linea ${linea}, no existe en el listado de localidades asociadas al usuario`});
          valido = false;
        }/*else if(arrayLinea[11]!='' && this.almacenes.filter(item =>item.store==arrayLinea[11]).length==0){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código del almacen de la linea ${linea}, no existe en el listado de almacenes asociadas al usuario`});
          valido = false;
        }*/else if(arrayLinea[12]=='' && this.clase =='S'){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de la cuenta contable de la linea ${linea} es obligatorio`});
          valido = false;
        }else if(arrayLinea[12]!='' && !( await this.validarCuentaContable(arrayLinea[12]))){
          this.messageService.add({severity:'error', summary: '!Error', detail: `El código de la cuenta contable de la linea ${linea}, no existe en el listado de cuentas asociadas a la dependencia seleccionada`});
          valido = false;
        }else{
            // Linea Valida

            if(arrayLinea[5]=='COP'){
              linetotal =arrayLinea[4]*arrayLinea[6];
              taxvalor =(arrayLinea[4]*arrayLinea[6])*((this.impuestos.filter(item=>item.Code == arrayLinea[7])[0].tax)/100);
            }else{
              linetotal =arrayLinea[4]*arrayLinea[6]*(this.monedas.filter(item=>item.Currency==arrayLinea[5])[0].TRM);
              taxvalor =(arrayLinea[4]*arrayLinea[6]*(this.monedas.filter(item=>item.Currency==arrayLinea[5])[0].TRM))*((this.impuestos.filter(item=>item.Code == arrayLinea[7])[0].tax)/100);
            }

            this.lineasSolpedCVS.push({
              itemcode:arrayLinea[0],
              dscription:arrayLinea[1],
              reqdatedet:arrayLinea[2],
              linevendor:arrayLinea[3],
              quantity:arrayLinea[4],
              moneda:arrayLinea[5],
              price:arrayLinea[6],
              tax:arrayLinea[7],
              ocrcode3:arrayLinea[8],
              ocrcode2:arrayLinea[9],
              ocrcode:arrayLinea[10],
              whscode:arrayLinea[11],
              acctcode:arrayLinea[12],
              acctcodename:arrayLinea[12]!=''?this.cuentasDependencia.filter(data => data.Code === arrayLinea[12])[0].Name:'',
              id_user:this.infoUsuario.id,
              id_solped : 0,
              linenum:linea-1,
              linetotal,
              linestatus:'O',
              taxvalor,
              trm:this.trm,
              linegtotal:linetotal+taxvalor

            });
        }


        lineasProcesadas++;
      }else{
        if(arrayLinea.length>1){
          lineasProcesadas++;
          this.messageService.add({severity:'error', summary: '!Error', detail: `La líena ${linea} del archivo a cargar, no posee la estructura básica requerida`});
          valido = false;
        }
      }
      
       
  }
  
  console.log(lineasProcesadas);

  if(lineasProcesadas==0){
    this.messageService.add({severity:'error', summary: '!Error', detail: 'El archivo seleccionado no posse lineas para agregar a la solped'});
    valido = false;
  }

  return valido;

}



 

  adicionarCSV(){
    this.lineasSolped = this.lineasSolpedCVS;
    this.formularioCSV = false;
  }

  GuardarSolped(){

               

                this.envioFormulario = true;
                if( this.clase &&  this.serie &&  this.area && this.fechaContable && this.fechaCaducidad && this.fechaDocumento && this.fechaNecesidad){
                  if(this.lineasSolped.length > 0){

                    if(this.anexosSolped.length > 0){
                        if((this.authService.getInfoUsuario().companyname.toLowerCase()=='nitrofert' && this.anexosSolped.filter(anexo => anexo.tipo == 'Revisión presupuestal').length>0 && this.anexosSolped.filter(anexo => anexo.tipo == 'Especificación técnica').length>0) ||
                           (this.authService.getInfoUsuario().companyname.toLowerCase()!='nitrofert'  && this.anexosSolped.filter(anexo => anexo.tipo == 'Especificación técnica').length>0)){

                          //this.submittedBotton = true;
                        //console.log(this.solped, this.solpedDetLines);
                
                        const data:any = {
                          solped:  {
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
                            u_nf_depen_solped:this.area,
                            comments:this.comentarios,
                            trm:this.trm,
                            currency:this.currency
                          },
                          solpedDet:this.lineasSolped,
                          anexos:this.anexosSolped
                        }

                        if(this.solpedEditar) data.solped.id = this.solpedEditar;
                
                        //console.log(data);      
                        this.onNewSolped.emit(data);              
                
                        this.registroSolped = true;
                        this.envioFormulario = false;

                        }else{
                          if(this.authService.getInfoUsuario().companyname.toLowerCase()=='nitrofert'){
                            this.messageService.add({severity:'error', summary: '!Error', detail: 'Los anexos de revisión presupuestal y revisión técnica son obligatorios'});
                          }
                          if(this.authService.getInfoUsuario().companyname.toLowerCase()=='intefert'){
                            this.messageService.add({severity:'error', summary: '!Error', detail: 'El anexo de revisión técnica es obligatorio'});
                          }
                          
                        }

                    }else{
                      this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe adjuntar los anexos requeridos'});
                     
                    }
                    
                  }else{
                    this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar al menos una línea en la solped'});
                   
                  }
                  
                }else{
                  this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar los campos resaltados en rojo'});
                  
                }
  }

  

  NuevaSolped(){

  }

  RegistrarLinea(){
    this.envioLinea = true;
    //console.log(this.numeroLinea, this.iteradorLinea);
    if(this.descripcion && 
      this.fechaRequerida && 
      this.viceprecidencia.vicepresidency && 
      this.dependencia.dependence && 
      this.localidad.location && 
      this.cantidad &&
      this.precio &&
      this.impuesto &&
      ((this.cuenta.Code && !this.item.ItemCode) || (!this.cuenta.Code && this.item.ItemCode))){

        let indexLineaDuplicada = this.LineaDuplicada();
        
        if(indexLineaDuplicada>=0 && this.lineasSolped[indexLineaDuplicada].linenum!==this.numeroLinea){
          //console.log(indexLineaDuplicada,this.lineasSolped[indexLineaDuplicada].linenum,this.numeroLinea);
          this.messageService.add({severity:'warn', 
                                   summary: '!Atención', 
                                   detail: `Los siguientes datos item: ${this.item.ItemCode}, 
                                            Vicepresidencia: ${this.viceprecidencia.vicepresidency}, 
                                            Dependencia: ${this.dependencia.dependence} y 
                                            localidad: ${this.localidad.location} 
                                            ya se encuentran registrados en la 
                                            linea ${this.lineasSolped[indexLineaDuplicada].linenum} de esta solped`});    
        }else{
          if(this.editarLinea){
            
            this.asignarCamposLinea(this.lineaSeleccionada[0].linenum);
            this.lineasSolped.splice(this.lineasSolped.indexOf(this.lineaSeleccionada[0]),1,this.lineaSolped);
            //console.log(this.lineasSolped);
            this.messageService.add({severity:'success', summary: '!OK¡', detail: 'Se realizo correctamente la actualización de la línea'});
            this.editarLinea = false;
          }else{
            
            
            //this.lineaSolped.id_user = this.infoUsuario.id;
            //this.lineaSolped.linenum =  this.numeroLinea;
            this.asignarCamposLinea(this.numeroLinea);
            this.lineasSolped.push(this.lineaSolped);
            this.iteradorLinea++;
            //console.log(this.lineasSolped);
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

  asignarCamposLinea(linea:number){
            this.lineaSolped = {
            id_solped:!this.solpedEditar?0:this.solpedEditar,
            linenum :linea,
            id_user:this.infoUsuario.id,
            reqdatedet : this.fechaRequerida,
            linevendor : this.proveedor.CardCode,
            itemcode : this.item.ItemCode,
            dscription : this.descripcion,
            ocrcode3 : this.viceprecidencia.vicepresidency,
            ocrcode2 : this.dependencia.dependence,
            ocrcode : this.localidad.location,
            whscode : this.almacen!=''?this.almacen.store:'SM_N300',
            acctcode : this.cuenta.Code,
            acctcodename : this.nombreCuenta,
            quantity : this.cantidad,
            moneda : this.moneda,
            price : this.precio,
            trm : this.trm,
            linetotal : this.subtotalLinea,
            tax : this.impuesto.Code,
            taxvalor : this.valorImpuesto,
            linegtotal : this.totalLinea,
            }
            
  }

  LineaDuplicada():number{
    let sameLine = this.lineasSolped.filter(line => line.itemcode === this.item.ItemCode &&
                                                    line.dscription === this.descripcion &&   
                                                    line.ocrcode === this.localidad.location && 
                                                    line.ocrcode2 === this.dependencia.dependence &&
                                                    line.ocrcode3 === this.viceprecidencia.vicepresidency);
    //console.log(this.lineasSolped.indexOf(sameLine[0]));
    return this.lineasSolped.indexOf(sameLine[0]); 
  }

  EditarLinea(){
    //console.log(this.lineaSeleccionada[0]);
    this.lineaSolped = this.lineaSeleccionada[0];
    
    this.editarLinea = true;
    this.MostrarFormularioLinea();
    this.numeroLinea = this.lineaSolped.linenum;
   
    if(this.lineaSolped.itemcode){
      this.item = this.items.filter(item => item.ItemCode ===this.lineaSolped.itemcode)[0];
    }
    this.descripcion = this.lineaSolped.dscription;

    if(this.lineaSolped.linevendor){
      this.proveedor = this.proveedores.filter(item =>item.CardCode === this.lineaSolped.linevendor)[0];
    }
    if(this.lineaSolped.acctcode){
      this.cuenta = this.cuentas.filter(item =>item.Code === this.lineaSolped.acctcode)[0];
    }

    if(this.lineaSolped.ocrcode3){
      this.viceprecidencia = this.vicepresidencias.filter(item =>item.vicepresidency === this.lineaSolped.ocrcode3)[0];
      this.SeleccionarVicepresidencia();
    }

    if(this.lineaSolped.ocrcode2){
      this.dependencia = this.dependencias.filter(item =>item.dependence === this.lineaSolped.ocrcode2)[0];
      this.SeleccionarDependencia();
    }

    if(this.lineaSolped.ocrcode){
      this.localidad = this.localidades.filter(item =>item.location === this.lineaSolped.ocrcode)[0];
      
    }

    if(this.lineaSolped.whscode){
      if(this.almacenes.filter(item => item.store === this.lineaSolped.whscode).length>0){
        this.almacen = this.almacenes.filter(item => item.store === this.lineaSolped.whscode)[0];
      }else{
        this.almacen ="";
      }
      
      
    }


    if(this.lineaSolped.tax){
      this.impuesto = this.impuestos.filter(item =>item.Code === this.lineaSolped.tax)[0];
    }

    if(this.lineaSolped.acctcode){
      this.cuenta = this.cuentas.filter(item =>item.Code === this.lineaSolped.acctcode)[0];
      this.nombreCuenta = this.cuenta.Name;
    }
    
    this.cantidad = this.lineaSolped.quantity || 1;
    this.moneda = this.monedas.filter(item =>item.Currency === this.lineaSolped.moneda)[0].Currency;
   
    this.precio = this.lineaSolped.price || 0;
    this.subtotalLinea = this.lineaSolped.linetotal;

    this.prcImpuesto = ((this.lineaSolped.linegtotal/this.lineaSolped.linetotal)-1)*100;
    this.valorImpuesto = this.lineaSolped.linegtotal*(this.prcImpuesto/100);
    this.totalLinea = this.lineaSolped.linegtotal;
    
  }

  BorrarLineas(){
    
    let lineasSolpedTMP=[];
    let existe = false;
    for(let linea of this.lineasSolped){
      existe = false;
      for(let lineaSelect of this.lineaSeleccionada){
          if(linea === lineaSelect){
            existe = true;
            //console.log(linea,lineaSelect);
            ////console.log(lineSelected);
            ////console.log( this.solpedDetLines.indexOf(line));
            //this.lineasSolped.splice(this.lineasSolped.indexOf(linea),1);
            //this.lineaSeleccionada.splice(this.lineaSeleccionada.indexOf(linea),1);
          }
      }
      if(!existe){
        lineasSolpedTMP.push(linea);
      }
    }
    //console.log(this.lineasSolped,lineasSolpedTMP);
    this.lineasSolped = lineasSolpedTMP;
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
