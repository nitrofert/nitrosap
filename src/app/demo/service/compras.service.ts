import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompaniesUser } from '../api/companiesUser';
import { CompanyInterface } from '../api/company';
import { ListadoPedidos } from '../api/listadoPedidos';
import { MenuInterface } from '../api/menu.interface';
import { PerfilInterface } from '../api/perfil';
import { PermisosInterface } from '../api/permiso';
import { SolpedInterface } from '../api/solped';
import { UserInterface } from '../api/users';
import { UrlApiService } from './urlapi.service';



@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private api_url:string = "";
  //private api_url:string = "http://backend.nitrofert.com.co";

  constructor(private http: HttpClient,
              private urlApiService:UrlApiService) { 
                  this.api_url = this.urlApiService.getUrlAPI();
              }

  listSolped(token:string):Observable<any[]>{
    
    let headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/list`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getConfigSolped(token:string):Observable<any[]>{
    
    let headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/mysql/query/load-config-solped`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getConfigSolpedMP(token:string):Observable<any[]>{
    
    let headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/mysql/query/load-config-solped-mp`;
    return this.http.get<any[]>(url,requestOptions);
  }

  
  listSolpedAprobadas(token:string):Observable<any[]>{
    
    let headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/list/aprobadas`;
    return this.http.get<any[]>(url,requestOptions);
  }

  solpedById(token:string,id:number):Observable<SolpedInterface>{
    
    const headers = this.urlApiService.getHeadersAPI(token);  
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/compras/solped/${id}`;
    return this.http.get<SolpedInterface>(url,requestOptions);
  }

  taxes(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/shared/functions/taxes/validforap`;
    return this.http.get<any[]>(url,requestOptions);
  }
  taxesXE(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/shared/functions/taxes/compras`;
    return this.http.get<any[]>(url,requestOptions);
  }

  impuestosMysql(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/mysql/query/impuestos-compra`;
    return this.http.get<any[]>(url,requestOptions);
  }

  saveSolped(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/`;
    //console.log(url)
    return this.http.post<any[]>(url,data,requestOptions);

  }

  saveDetailSolped(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/detail`;
    //console.log(url)
    return this.http.post<any[]>(url,data,requestOptions);

  }

  uploadAnexo(token:string,body:FormData):Observable<any>{
    ////console.log(body);
    let headers = this.urlApiService.getHeadersAPI(token);
    headers=headers.delete('content-type');
    //headers=headers.append('content-type','multipart/form-data;');
    //headers = headers.append('enctype', 'multipart/form-data');
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/upload`;
    return this.http.post<any[]>(url,body,requestOptions);
    //return this.http.post<any[]>(url,body);

  }

  getAnexoSolped(token:string,idAnexo:number,idSolped:number):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);  
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/compras/solped/anexo/${idSolped}/${idAnexo}`;
    return this.http.get<any>(url,requestOptions);
  }

  downloadAnexo3(token:string,ruta:string):Observable<any>{
    
    let headers = this.urlApiService.getHeadersAPI();
    headers=headers.delete('content-type');
    const requestOptions = { headers: headers };
    //const url:string = `${this.api_url}/api/compras/solped/upload`;
    const url:string = `${this.api_url}/${ruta}`;
    //return url;
    return this.http.get<any[]>(url,requestOptions);
    //return this.http.post<any[]>(url,body);

  }


  downloadAnexo(ruta:string):string{
    
    //let headers = this.urlApiService.getHeadersAPI(token);

    let file =  fetch(`${this.api_url}/${ruta}`);
    
    //const requestOptions = { headers: headers };
    //const url:string = `${this.api_url}/api/compras/solped/upload`;
    const url:string = `${this.api_url}/${ruta}`;
    return url;
    //return this.http.get<any[]>(url,requestOptions);
    //return this.http.post<any[]>(url,body);

  }

  downloadAnexo2(token:string,fileInfo:any):Observable<any>{
    ////console.log(body);
    
    let headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/download`;
    return this.http.post<any[]>(url,fileInfo,requestOptions);
  }

  borrarAnexo(token:string,fileInfo:any):Observable<any>{
    ////console.log(body);
    
    let headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/borraranexo`;
    return this.http.post<any[]>(url,fileInfo,requestOptions);
  }

  updateSolped(token:string,data:any):Observable<any>{
    let headers = this.urlApiService.getHeadersAPI(token);
    headers=headers.delete('content-type');
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/`;
    return this.http.put<any[]>(url,data,requestOptions);
  }

 

  envioAprobacionSolped(token:string,idsSolped:number[]):Observable<any>{
    let data = JSON.stringify(idsSolped);
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/envio-aprobacion`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  aprobacionSolped(token:string,idsSolped:number[]):Observable<any>{
    let data = JSON.stringify(idsSolped);
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/aprobacion`;
    return this.http.post<any[]>(url,data,requestOptions);

  }

  aprobacionesSolped(token:string,idsSolped:number[]):Observable<any[]>{
    let data = JSON.stringify(idsSolped);
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/aprobaciones/${idsSolped}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  rechazoSolped(infoSolped:any):Observable<any>{
    const url:string = `${this.api_url}/api/compras/solped/rechazar`;
    return this.http.put<any[]>(url,infoSolped);
  }

  cancelacionSolped(token:string,idsSolped:number[]):Observable<any>{
    let data = JSON.stringify(idsSolped);
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/cancelacion`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  ordenesAbiertasUsuarioXE(token:string, area:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/wssap/Xengine/ordenes-open-usuario/${area}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  ordenesAbiertasUsuarioSL(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/wssap/Xengine/ordenes-open-usuario-sl`;
    return this.http.get<any[]>(url,requestOptions);
  }

  pedidoByIdSL(token:string,pedido:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/wssap/Xengine/pedido/${pedido}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  saveEntrada(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/entrada/`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  aprobarEntradas(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/entrada/aprobar-entradas`;
    return this.http.post<any[]>(url,data,requestOptions);
  }


  listEntrada(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/entrada/list`;
    return this.http.get<any[]>(url,requestOptions);
  }

  entradaById(token:string,id:number):Observable<any>{
    ////console.log(id);
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/entrada/${id}`;
    return this.http.get<any>(url,requestOptions);
  }

  impresionEntradaByIdSL(token:string,id:number):Observable<any>{
    ////console.log(id);
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/entrada/impresion/${id}`;
    return this.http.get<any>(url,requestOptions);
  }

  SolpedMP(token:string,status:string):Observable<any>{
    /*const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });*/
      const headers = this.urlApiService.getHeadersAPI(token);
      const requestOptions = { headers: headers };
      const url:string = `${this.api_url}/api/compras/solped/list/mps/${status}`;
      return this.http.get<any>(url,requestOptions);
  }

  PedidosdMP(token:string,status:string):Observable<any>{
    /*const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });*/
      const headers = this.urlApiService.getHeadersAPI(token);
      const requestOptions = { headers: headers };
      const url:string = `${this.api_url}/api/compras/solped/list/ocmp/${status}`;
      return this.http.get<any>(url,requestOptions);
  }

  getDocumentsTrackingSAP(token:string):Observable<any>{
    /*const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });*/
      const headers = this.urlApiService.getHeadersAPI(token);
      const requestOptions = { headers: headers };
      const url:string = `${this.api_url}/api/compras/solped/list/documentsTracking`;
      return this.http.get<any>(url,requestOptions);
  }

  EntradasMP(token:string):Observable<any>{
    /*const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });*/
      const headers = this.urlApiService.getHeadersAPI(token);
      const requestOptions = { headers: headers };
      const url:string = `${this.api_url}/api/compras/solped/list/inmp`;
      return this.http.get<any>(url,requestOptions);
  }

  SolpedMPSL(token:string):Observable<any[]>{
    /*const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });*/
      const headers = this.urlApiService.getHeadersAPI(token);
      const requestOptions = { headers: headers };
      const url:string = `${this.api_url}/api/compras/solped/list/mp`;
      return this.http.get<any[]>(url,requestOptions);
  }


  saveSolpedMP(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/mp`;
    return this.http.post<any[]>(url,data,requestOptions);

  }

  updateSolpedMP(token:string,data:any):Observable<any>{
    ////console.log('data service',data);
    let headers = this.urlApiService.getHeadersAPI(token);
    headers=headers.delete('content-type');
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/mp`;
    return this.http.put<any[]>(url,data,requestOptions);
  }

  updateCantidadSolped(token:string,data:any):Observable<any>{
    ////console.log('data service',data);
    let headers = this.urlApiService.getHeadersAPI(token);
    headers=headers.delete('content-type');
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/cantidadmp`;
    return this.http.put<any[]>(url,data,requestOptions);
  }

  grabarSimulaciones(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/grabarSimulaciones`;
    return this.http.post<any[]>(url,data,requestOptions);

  }

  enviarSolpedSAP(token:string,idSolped:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/enviar-sap`;
    return this.http.post<any[]>(url,idSolped,requestOptions);

  }

  actualizarSolpedSAP(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/enviar-sap`;
    return this.http.put<any[]>(url,data,requestOptions);

  }

  actualizarPedidoSAP(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/enviar-sap-pedido`;
    return this.http.put<any[]>(url,data,requestOptions);

  }

  getInventariosMpXE(token:string,data:any):Observable<any[]>{
   
   
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/inventarios`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  getInventariosTracking(token:string,data:any):Observable<any[]>{
   
   
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/inventariosTracking`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  getPresupuestosVenta(token:string,data:any):Observable<any[]>{
   
   
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/presupuestosVenta`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  getPresupuestosVentaAll(token:string):Observable<any[]>{
   
   
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/presupuestosVenta`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getZonas(token:string):Observable<any[]>{
   
   
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    //const url:string = `${this.api_url}/api/compras/mrp/zonas`;
    const url:string = `${this.api_url}/api/mysql/query/zonas`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getMaxMinItemZona(token:string,data:any):Observable<any[]>{
   
   
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/maxminitemzona`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  getMaxMinAll(token:string):Observable<any[]>{
   
   
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/maxminitemzona`;
    return this.http.get<any[]>(url,requestOptions);
  }

  cargarPresupuestoCVS(token:string,data:any):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/carguepresupuesto`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  

  cargarPresupuestoCVS2(token:string,data:FormData):Observable<any[]>{
    let headers = this.urlApiService.getHeadersAPI(token);
    headers=headers.delete('content-type');
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/carguepresupuesto2`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  cargarLPMercado(token:string,data:FormData):Observable<any[]>{
    let headers = this.urlApiService.getHeadersAPI(token);
    headers=headers.delete('content-type');
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/cargar-lp-mercado`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  cargarLPMP(token:string,data:FormData):Observable<any[]>{
    let headers = this.urlApiService.getHeadersAPI(token);
    headers=headers.delete('content-type');
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/cargar-lp-mp`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  

  cargarLPSugerido(token:string,data:FormData):Observable<any[]>{
    let headers = this.urlApiService.getHeadersAPI(token);
    headers=headers.delete('content-type');
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/cargar-lp-sugerido`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  cargarMaxMinCVS(token:string,data:any):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/carguemaxmin`;
    return this.http.post<any[]>(url,data,requestOptions);
  }

  evaluacionProveedores(token:string,parametros:any):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/rpt/evaluacionProveedores`;
    return this.http.post<any[]>(url,parametros,requestOptions);
  }

  
  detalleEntradasProveedor(token:string,parametros:any):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/rpt/detalleEntradasProveedor`;
    return this.http.post<any[]>(url,parametros,requestOptions);
  }

  entradasByPedido(token:string,DocEntry:any):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/entrada/pedido/${DocEntry}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getListaPreciosMP(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/lista-precios-mp`;
    return this.http.get<any[]>(url,requestOptions);
  }

  grabarListaPreciosMP(token:string,dataListaPreciosMP:any):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/lista-precios-mp`;
    return this.http.post<any[]>(url,dataListaPreciosMP,requestOptions);
  }

  getItemsMPSemana(token:string,semana:number):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/lista-precios-mp/${semana}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getListaPreciosPT(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/lista-precios-pt`;
    return this.http.get<any[]>(url,requestOptions);
  }

  

  getListaPreciosSugeridos(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/lista-precios-sugeridos`;
    return this.http.get<any[]>(url,requestOptions);
  }

  grabarListaPreciosPT(token:string,dataListaPreciosPT:any):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/lista-precios-pt`;
    return this.http.post<any[]>(url,dataListaPreciosPT,requestOptions);
  }

  getItemsPTSemana(token:string,semana:number):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/lista-precios-pt/${semana}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getConfigCalculadora(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/mysql/query/load-config-calculadora-precios`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getPreciosListaItemSAP(token:string,itemCode:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    //const url:string = `${this.api_url}/api/compras/mrp/lista-precios-item/${itemCode}`;
    const url:string = `${this.api_url}/api/mysql/query/lista-precios-sap-item/${itemCode}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getPreciosListaSugeridos(token:string,itemCode:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/lista-precios-sugeridos/${itemCode}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getItemsMPbyItemPT(token:string,itemCode:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    //const url:string = `${this.api_url}/api/compras/mrp/items-mp-by-item-pt/${itemCode}`;

    const url:string = `${this.api_url}/api/mysql/query/receta-item/${itemCode}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  //getPreciosMPItemUltimasSemanas(token:string,itemCode:string, semanaAnio?:number=0, anio?:number=0):Observable<any[]>{
    getPreciosMPItemUltimasSemanas(token:string,itemCode:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    //const requestOptions = { headers: headers, params: {itemCode,semanaAnio,anio} };
    const requestOptions = { headers: headers, params: {itemCode} };
    const url:string = `${this.api_url}/api/compras/mrp/precio-mp-item-ultimas-semanas`;
    return this.http.get<any[]>(url,requestOptions);
  }


  getPrecioMercadoItemSemana(token:string,itemCode:string, semanaAnio:number, anio:number, fechaInicio:string, fechaFin:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers, params: {itemCode,semanaAnio,anio,fechaInicio,fechaFin} };
    const url:string = `${this.api_url}/api/compras/mrp/precio-mercado-item-semana`;
    return this.http.get<any[]>(url,requestOptions);
  }

  updateParametrosCalculadora(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/actualizar-parametros-calculadora`;
    return this.http.post<any>(url,data,requestOptions);
  }

  getParametrosMP(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/parametros-mp-calculadora`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getDimensiones(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/mysql/query/dependencias`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getAutores(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/mysql/query/autores`;
    return this.http.get<any[]>(url,requestOptions);
  }

  nuevoAutor(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/nuevo-autor`;
    return this.http.post<any>(url,data,requestOptions);
  }

  getPreciosPTxSemanaZonaAutor(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers,  params: data  };
    const url:string = `${this.api_url}/api/compras/mrp/lista-precios-pt-seman-zona`;
    return this.http.get<any>(url,requestOptions);
  }

  grabarCalculoPreciosItem(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/mrp/grabar-calculo-precios-item`;
    return this.http.post<any>(url,data,requestOptions);
  }

  listaPreciosCalculados(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/mysql/query/lista-calculos-precios-item`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getInfoCalculoItem(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers,  params: data  };
    const url:string = `${this.api_url}/api/compras/mrp/consulta-calculos-item`;
    return this.http.get<any>(url,requestOptions);
  }

  getPrecioVentaItemSAP(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers,  params: data  };
    const url:string = `${this.api_url}/api/compras/mrp/precio-venta-item`;
    
    return this.http.get<any>(url,requestOptions);
  }

  getPrecioVentaItemSAP2(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers};
    const url:string = `${this.api_url}/api/mysql/query/lista-precios-venta-item/${data.item}`;
    
    return this.http.get<any>(url,requestOptions);
  }

 
  

  getProyectos(token:string):Observable<any[]>{
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/proyectos`;
    return this.http.get<any[]>(url,requestOptions);
  }
 
  
}
