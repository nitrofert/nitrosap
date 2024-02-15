import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, TreeNode } from 'primeng/api';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ComprasService } from 'src/app/demo/service/compras.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { SAPService } from 'src/app/demo/service/sap.service';

@Component({
  selector: 'app-mapa-relaciones',
  templateUrl: './mapa-relaciones.component.html',
  styleUrls: ['./mapa-relaciones.component.scss']
})
export class MapaRelacionesComponent implements OnInit{

  
  @Input() docType!:string;
  @Input() docNum!:any;

  @ViewChild('filter') filter!: ElementRef;
  
  loadingMapa:boolean = true;
  mapaRelaciones!:TreeNode[];
  selectedNodes!: TreeNode[];
  tituloDocumento:string ="";
  visualizarDocumento:boolean = false;
  infoDocumento!:any;
  loading:boolean = false;
  infoDocumentosMR!:any;

  constructor(private comprasService:ComprasService,
    public authService: AuthService,
    private adminService:AdminService,
    private confirmationService: ConfirmationService,
    private router:Router,
    private sapService:SAPService,
    private rutaActiva: ActivatedRoute,
    private functionsService :FunctionsService) { }

  async ngOnInit(): Promise<void> {

    //////console.log('docType',this.docType);
    //////console.log('docNum',this.docNum);

    if(this.docNum!=0){
      let trazabilidadDocumentoSeleccionado = await this.tazabilidadDocumento(this.docType,this.docNum);
      //console.log('trazabilidadDocumentoSeleccionado',trazabilidadDocumentoSeleccionado);
      let documentoOrigen = await this.getDocumentoOrigen(trazabilidadDocumentoSeleccionado);
      //console.log('documentoOrigen',documentoOrigen);
      let trazabilidadDocumentoOrigen = await this.tazabilidadDocumento(documentoOrigen.docType,documentoOrigen.docNum);
      //console.log('trazabilidadDocumentoOrigen',trazabilidadDocumentoOrigen);
      let documentosMR = await this.getDocumentosMR(trazabilidadDocumentoOrigen);
      //////console.log('documentosMR',documentosMR);
      let infoDocumentosMR = await this.getInfoDocumentosMR(documentosMR);
      //////console.log('infoDocumentosMR',infoDocumentosMR);
      this.infoDocumentosMR = infoDocumentosMR;
      let treeTrazabilidad= await this.setNodoORG(documentoOrigen,trazabilidadDocumentoOrigen,infoDocumentosMR)
      ////console.log('treeTrazabilidad',treeTrazabilidad);
      this.mapaRelaciones = treeTrazabilidad;

      this.loadingMapa = false;

      /*const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      async function recursion(value:any):Promise<any> {
        if (value === 0) return 0;

        await timeout(1000);
        return value + await recursion(value - 1);
      }

      (async () => ////console.log(await recursion(3)))();*/

    }

    
    
  }

  async getDocumentoOrigen(trazabilidadDocumentoSeleccionado:any[]): Promise<any> {
    
    //////console.log("getDocumentoOrigen");
    let solpeds= await this.functionsService.groupArray( await this.functionsService.groupArray(await this.functionsService.clonObject(trazabilidadDocumentoSeleccionado.filter((traza: { SP_INDEX: any; })=>traza.SP_INDEX!=null)),'SP_INDEX'),'SP_DOCNUM',[{SP_SUBTOTAL:0, SP_TOTAL_CON_IVA:0,SP_IMPUESTO:0}]);
    //////console.log('solpeds',solpeds);
    let pedidos = await this.functionsService.groupArray(await this.functionsService.groupArray(await this.functionsService.clonObject(trazabilidadDocumentoSeleccionado.filter((traza: { PD_INDEX: any; })=>traza.PD_INDEX!=null)),'PD_INDEX'),'PD_DOCNUM',[{PD_SUBTOTAL:0, PD_TOTAL_CON_IVA:0,PD_IMPUESTO:0}]);
    //////console.log('pedidos',pedidos);
    let entradas = await this.functionsService.groupArray(await this.functionsService.groupArray(await this.functionsService.clonObject(trazabilidadDocumentoSeleccionado.filter((traza: { EN_INDEX: any; })=>traza.EN_INDEX!=null)),'EN_INDEX'),'EN_DOCNUM',[{EN_SUBTOTAL:0,EN_TOTAL_CON_IVA:0,EN_IMPUESTO:0}]);
    //////console.log('entradas',entradas)
    let facturas = await this.functionsService.groupArray(await this.functionsService.groupArray(await this.functionsService.clonObject(trazabilidadDocumentoSeleccionado.filter((traza: { FA_INDEX: any; })=>traza.FA_INDEX!=null)),'FA_INDEX'),'FA_DOCNUM',[{FA_SUBTOTAL:0,FA_TOTAL_CON_IVA:0,FA_IMPUESTO:0}]);
    //////console.log('facturas',facturas)

    let documentoOrigen:any ;

    if(solpeds.length > 0){
      documentoOrigen = {docType:"SP", docNum: solpeds[0].SOLPED};
    }else if(pedidos.length > 0){
      documentoOrigen = {docType:"PD", docNum:pedidos[0].PEDIDO};
    }else if(entradas.length > 0){
      documentoOrigen = {docType:"HE", docNum:entradas[0].ENTRADA};
    }else if(facturas.length > 0){
      documentoOrigen = {docType:"FA", docNum:facturas[0].FACTURA};
    }

    return documentoOrigen;
  }

  async tazabilidadDocumento(docType:string,docNum:any): Promise<any> {
    //////console.log("tazabilidadDocumento");
    let parametro:any;
    
    switch(docType){

      case "SP":
        parametro = {"SP":docNum};
      break;

      case "OC": 
      parametro = {"OC":docNum};
      break;

      case "HE":
        parametro = {"HE":docNum};
      break;

      case "FA":
        parametro = {"FA":docNum};
      break;

    }

    let trazabilidadDocumentoSeleccionado$ =  this.comprasService.trazabilidadDocumentoXE(this.authService.getToken(),parametro);
    let trazabilidadDocumentoSeleccionado = await lastValueFrom(trazabilidadDocumentoSeleccionado$);

    return await this.functionsService.objectToArray(trazabilidadDocumentoSeleccionado);

  }

  async getDocumentosMR(trazabilidadDocumentoOrigen:any[]): Promise<any> {

    //////console.log("getDocumentosMR");

    let solpeds= await this.functionsService.groupArray( await this.functionsService.groupArray(await this.functionsService.clonObject(trazabilidadDocumentoOrigen.filter((traza: { SP_INDEX: any; })=>traza.SP_INDEX!=null)),'SP_INDEX'),'SP_DOCNUM',[{SP_SUBTOTAL:0, SP_TOTAL_CON_IVA:0,SP_IMPUESTO:0}]);
    //////console.log('solpeds',solpeds);
    let pedidos = await this.functionsService.groupArray(await this.functionsService.groupArray(await this.functionsService.clonObject(trazabilidadDocumentoOrigen.filter((traza: { PD_INDEX: any; })=>traza.PD_INDEX!=null)),'PD_INDEX'),'PD_DOCNUM',[{PD_SUBTOTAL:0, PD_TOTAL_CON_IVA:0,PD_IMPUESTO:0}]);
    //////console.log('pedidos',pedidos);
    let entradas = await this.functionsService.groupArray(await this.functionsService.groupArray(await this.functionsService.clonObject(trazabilidadDocumentoOrigen.filter((traza: { EN_INDEX: any; })=>traza.EN_INDEX!=null)),'EN_INDEX'),'EN_DOCNUM',[{EN_SUBTOTAL:0,EN_TOTAL_CON_IVA:0,EN_IMPUESTO:0}]);
    //////console.log('entradas',entradas)
    let facturas = await this.functionsService.groupArray(await this.functionsService.groupArray(await this.functionsService.clonObject(trazabilidadDocumentoOrigen.filter((traza: { FA_INDEX: any; })=>traza.FA_INDEX!=null)),'FA_INDEX'),'FA_DOCNUM',[{FA_SUBTOTAL:0,FA_TOTAL_CON_IVA:0,FA_IMPUESTO:0}]);
    //////console.log('facturas',facturas)

    let documentosMR:any = {};

    if(solpeds.length > 0){
      documentosMR.SP = solpeds.map((linea)=>{ return `'${linea.SOLPED}'`}).join(',')
     }else{
      documentosMR.SP = "'0'";
     }

     if(pedidos.length > 0){
      documentosMR.OC = pedidos.map((linea)=>{ return `'${linea.PEDIDO}'`}).join(',')
     }else{
      documentosMR.OC = "'0'";
     }

     if(entradas.length > 0){
      documentosMR.HE = entradas.map((linea)=>{ return `'${linea.ENTRADA}'`}).join(',')
     }else{
      documentosMR.HE = "'0'";
     }

     if(facturas.length > 0){
      documentosMR.FA = facturas.map((linea)=>{ return `'${linea.FACTURA}'`}).join(',')
     }else{
      documentosMR.FA = "'0'";
     }

     //////console.log('documentosMR',documentosMR);

     return documentosMR;

  }

  

  async getInfoDocumentosMR(documentosMR:any):Promise<any>{

   // //console.log('documentosMR',documentosMR);
      
    let infoDocumentosMR:any = await this.functionsService.objectToArray(await this.comprasService.infoDocumentosMR(this.authService.getToken(),documentosMR));

    //console.log('infoDocumentosMR',infoDocumentosMR);

    return infoDocumentosMR;
  }





  async setNodoORG(documento:any,trazabilidadDocumentoOrigen:any[],infoDocumentosMR:any):Promise<any>{

 

  let docType = documento.docType;

  let treeTrazabilidad  = async (docType:any,trazabilidadDocumentoOrigen:any[],documentoPadre?:any):Promise<any> => {

   

    ////console.log('docType',docType);
    ////console.log('trazabilidadDocumentoOrigen',trazabilidadDocumentoOrigen);

        let fieldIndex:string = `${docType=='OC'?'PD':docType=='HE'?'EN':docType}_INDEX`;
        let fieldDocnum:string = `${docType=='OC'?'PD':docType=='HE'?'EN':docType}_DOCNUM`

        ////console.log('fieldIndex',fieldIndex);
        ////console.log('fieldDocnum',fieldDocnum);

        let lineasDocumentoOrigen:any[] =[];
        let lineasDocumentoOrigenAgrupada:any[] =[];

        if(documentoPadre){
          ////console.log('documentoPadre',documentoPadre);

          let fieldIndexPadre:string = `${documentoPadre.docType=='OC'?'PD':documentoPadre.docType=='HE'?'EN':documentoPadre.docType}_INDEX`;
          let fieldDocnumPadre:string = `${documentoPadre.docType=='OC'?'PD':documentoPadre.docType=='HE'?'EN':documentoPadre.docType}_DOCNUM`

          ////console.log('fieldIndexPadre',fieldIndexPadre);
          ////console.log('fieldDocnumPadre',fieldDocnumPadre);

          lineasDocumentoOrigen = (await this.functionsService.clonObject(trazabilidadDocumentoOrigen)).filter(function(linea: { [x: string]: any; }){ return linea[fieldIndex] != null && linea[fieldDocnumPadre] == documentoPadre.docNum });

          ////console.log('lineasDocumentoOrigen',lineasDocumentoOrigen);

          lineasDocumentoOrigenAgrupada = await this.functionsService.groupArray( await this.functionsService.groupArray(lineasDocumentoOrigen,fieldIndex),fieldDocnum);

          ////console.log('lineasDocumentoOrigenAgrupada',lineasDocumentoOrigenAgrupada);
        }else{
          lineasDocumentoOrigen = (await this.functionsService.clonObject(trazabilidadDocumentoOrigen)).filter(function(linea: { [x: string]: any; }){ return linea[fieldIndex] != null });

          ////console.log('lineasDocumentoOrigen',lineasDocumentoOrigen);

          lineasDocumentoOrigenAgrupada = await this.functionsService.groupArray( await this.functionsService.groupArray(lineasDocumentoOrigen,fieldIndex),fieldDocnum);

          ////console.log('lineasDocumentoOrigenAgrupada',lineasDocumentoOrigenAgrupada);
        }
        
        

        let docTypeChild:string = "";
        let label:string = "";
        switch(docType){
          case "SP":
            docTypeChild="OC";
            label="Solped";
          break;
          case "OC":
            docTypeChild="HE";
            label="Pedido";
          break;
          case "HE":
            docTypeChild="FA"
            label="Entrada";
          break;

          case "FA":
            docTypeChild=""
            label="Factura";
          break;

        }
        let treeTrazabildad:TreeNode[] = [];

        for(let linea of lineasDocumentoOrigenAgrupada){

          let lineasDoc:any = (await this.functionsService.clonObject(infoDocumentosMR)).filter((documento: { Key_Doc: string; }) => documento.Key_Doc === `${docType=='OC'?'PD':docType=='HE'?'EN':docType}${linea[fieldDocnum]}`);
          let ducumentoAgrupado = await this.functionsService.groupArray(lineasDoc,'Key_Doc',[{IMPUESTO:0,SUBTOTAL:0,TOTAL_CON_IVA:0 }])
          //console.log(`${docType=='OC'?'PD':docType=='HE'?'EN':docType}${linea[fieldDocnum]}`,lineasDoc,ducumentoAgrupado);

          let nodo:any ={
            label,
            expanded: true,
            data: {
              num:linea[fieldDocnum],
              /*estado:linea[`${docType}_ESTADO_ANULADO`]=='Y'?'ban':linea[`${docType}_ESTADO`]=='C'?'lock':'lock-open',
              estadoColor:linea[`${docType}_ESTADO_ANULADO`]=='Y'?'red':linea[`${docType}_ESTADO`]=='C'?'var(--yellow-600);':'green',
              fecha:linea[`${docType}_FECHACONTABLE`],
              fechav:linea[`${docType}_FECHAVENCE`],
              subtotal:linea[`${docType}_SUBTOTAL`],
              currency:linea[`${docType}_MONEDA`],
              iva:linea[`${docType}_IMPUESTO`],
              total: linea[`${docType}_TOTAL_CON_IVA`],
              retenciones:0,
              ref:linea[`${docType}_NUM_REFERENCIA_FACTURA`],*/
              estado:ducumentoAgrupado[0].ESTADO_ANULADO=='Y'?'ban':ducumentoAgrupado[0].ESTADO=='C'?'lock':'lock-open',
              estadoColor:ducumentoAgrupado[0].ESTADO_ANULADO=='Y'?'red':ducumentoAgrupado[0].ESTADO=='C'?'var(--yellow-600);':'green',
              fecha:ducumentoAgrupado[0].FECHA_CONTABLE,
              fechav:ducumentoAgrupado[0].FECHA_VENCE,
              subtotal:ducumentoAgrupado[0].SUBTOTAL,
              currency:ducumentoAgrupado[0].MONEDA,
              iva:ducumentoAgrupado[0].IMPUESTO,
             
              retenciones:parseFloat(ducumentoAgrupado[0].RETENCIONES),
              total: parseFloat(ducumentoAgrupado[0].TOTAL_CON_IVA)+parseFloat(ducumentoAgrupado[0].RETENCIONES),
              ref:ducumentoAgrupado[0].NUM_REFERENCIA,
              tipoDoc:docType=='OC'?'PD':docType=='HE'?'EN':docType

            }
          }
          console.log(this.docType,docType,this.docNum,linea[fieldDocnum]);
          if(this.docType === docType && this.docNum == linea[fieldDocnum]){
            nodo.styleClass= 'bg-yellow-50';
          }
          let children:any;
    
          if(docTypeChild!=""){
            ////console.log('tiene hijo');
            documentoPadre ={docType,docNum:linea[fieldDocnum]}
            children = await treeTrazabilidad(docTypeChild,trazabilidadDocumentoOrigen,documentoPadre);
            nodo.children = children;
          }else{
            ////console.log('No tiene hijo');
          }
    
          treeTrazabildad.push(nodo);
        }
    
        return treeTrazabildad;

  }

  let arbolTrazabilidad = await treeTrazabilidad(docType,trazabilidadDocumentoOrigen);

  return arbolTrazabilidad;

    
  }


  verDocumento(nodo:any){
    console.log('nodo seleccionado',nodo);
    this.confirmationService.confirm({
      message: `¿Desea visualizar el documento seleccionado ${nodo.label} - ${nodo.data.num} ?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
     
       //this.nodoSeleccionado = nodo;
       this.tituloDocumento = `${nodo.label} ${nodo.data.num}`;
       this.visualizarDocumento = true;

       //console.log(nodo);

       
       
       
       let lineasDoc:any  = (await this.functionsService.clonObject(this.infoDocumentosMR)).filter((documento: { Key_Doc: string; }) => documento.Key_Doc === `${nodo.data.tipoDoc}${nodo.data.num}`);
       let ducumentoAgrupado = await this.functionsService.groupArray(await this.functionsService.clonObject(lineasDoc),'Key_Doc',[{IMPUESTO:0,SUBTOTAL:0,TOTAL_CON_IVA:0 }]);

       this.infoDocumento = {
        
        DocNum: ducumentoAgrupado[0].DOCNUM,
        DocStatus: ducumentoAgrupado[0].ESTADO,
        Cancel: ducumentoAgrupado[0].ESTADO_ANULADO,
        CardCode: ducumentoAgrupado[0].CODIGOSN,
        CardName: ducumentoAgrupado[0].NOMBRESN,
        Comments: ducumentoAgrupado[0].COMENTARIOS,
        Currency: ducumentoAgrupado[0].MONEDA,
        DocDate: new Date(ducumentoAgrupado[0].FECHA_CONTABLE),
        DocDueDate: new Date(ducumentoAgrupado[0].FECHA_VENCE),
        TaxDate:new Date(ducumentoAgrupado[0].FECHA_DOCUMENTO),

        SeriesName: ducumentoAgrupado[0].NOMBRE_SERIE,
        Series: ducumentoAgrupado[0].SERIE,
        SUBTOTAL: ducumentoAgrupado[0].SUBTOTAL,
        IMPUESTO: ducumentoAgrupado[0].IMPUESTO,
        RETENCIONES: parseFloat(ducumentoAgrupado[0].RETENCIONES),
        TOTAL: parseFloat(ducumentoAgrupado[0].TOTAL_CON_IVA)+parseFloat(ducumentoAgrupado[0].RETENCIONES),
        
        DocumentLines: await this.functionsService.sortArrayObject( (await this.functionsService.clonObject(lineasDoc)).map((linea: { NUMLINEA: any; ESTADOLINEA: string; CODIGOITEM: any; DESCRIPCION: any; Quantity: any; PRECIO_UNITARIO: any; LineVat: any; SUBTOTAL: any; LOCALIDAD: any; DEPDENDENCIA: any; VICEPRESIDENCIA: any; })=>{
                           
                            return {
                              LineNum: linea.NUMLINEA,
                              LineStatus: linea.ESTADOLINEA,
                              ItemCode: linea.CODIGOITEM,
                              Dscription: linea.DESCRIPCION,
                              Quantity: linea.Quantity,
                              Price: linea.PRECIO_UNITARIO,
                              VatPrcnt:linea.LineVat,
                              LineTotal: linea.SUBTOTAL,
                              OcrCode: linea.LOCALIDAD,
                              OcrCode2:linea.DEPDENDENCIA,
                              OcrCode3:linea.VICEPRESIDENCIA,

                              //WhsCode:linea[prefijoDocumento+'_'],
                              //OpenCreQty: linea[prefijoDocumento+'_'],
                              //OpenQty: linea[prefijoDocumento+'_CANTIDAD_PENDIENTE'],
                              //OpenSum: linea[prefijoDocumento+'_'],
                              //OpenSumSys: linea[prefijoDocumento+'_'],
                              //PriceAfVAT: linea[prefijoDocumento+'_'],
                              //PriceBefDi:linea[prefijoDocumento+'_'],
                              //U_ID_PORTAL:linea[prefijoDocumento+'_'],
                              //U_NF_DEPEN_SOLPED:linea[prefijoDocumento+'_'],
                              //U_NF_NOM_AUT_PORTAL: linea[prefijoDocumento+'_']
                              iconLine:linea.ESTADOLINEA=='C'?'lock':'lock-open',
                              colorIconLine:linea.ESTADOLINEA=='C'?'orange':'green',

                            }
                        }),'NUMLINEA','ASC')
  
      }


       
  /*
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

       //console.log('groupField',groupField,);
       //console.log('filterField',filterField,);
       //console.log('sortField',sortField,);
       //console.log('prefijoDocumento',prefijoDocumento,);

       let arrayTrazabilidad = await this.functionsService.sortArrayObject(await this.functionsService.clonObject(this.arrayTrazabilidad),prefijoDocumento+'_INDEX','ASC');

       let infoDocument = await this.functionsService.groupArray((await this.functionsService.clonObject(arrayTrazabilidad)),filterField);
       //console.log('lineasDocumento',infoDocument);

       let lineasDocumento = (await this.functionsService.clonObject(arrayTrazabilidad)).filter(function(linea: { [x: string]: any; }){
        
        return linea[filterField] == nodo.data.num;
       });

       //console.log('lineasDocumento',lineasDocumento);

       let lineasDocumentoAgruadas = await this.functionsService.groupArray(await this.functionsService.clonObject(lineasDocumento),groupField)

       //console.log('lineasDocumentoAgruadas', await this.functionsService.sortArrayObject(lineasDocumentoAgruadas,prefijoDocumento+'_INDEX','ASC'));

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

      //console.log('infoDocumento',this.infoDocumento);
      */ 
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
