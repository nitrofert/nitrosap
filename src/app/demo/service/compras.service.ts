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

  saveSolped(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/`;
    return this.http.post<any[]>(url,data,requestOptions);

  }

  uploadAnexo(token:string,body:FormData):Observable<any>{
    //console.log(body);
    let headers = this.urlApiService.getHeadersAPI(token);
    headers=headers.delete('content-type');
    //headers=headers.append('content-type','multipart/form-data;');
    //headers = headers.append('enctype', 'multipart/form-data');
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/upload`;
    return this.http.post<any[]>(url,body,requestOptions);
    //return this.http.post<any[]>(url,body);

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
    //console.log(body);
    
    let headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/download`;
    return this.http.post<any[]>(url,fileInfo,requestOptions);
  }

  borrarAnexo(token:string,fileInfo:any):Observable<any>{
    //console.log(body);
    
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

  ordenesAbiertasUsuarioXE(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/wssap/Xengine/ordenes-open-usuario`;
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

  listEntrada(token:string):Observable<any[]>{
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/entrada/list`;
    return this.http.get<any[]>(url,requestOptions);
  }

  entradaById(token:string,id:number):Observable<any>{
    //console.log(id);
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/entrada/${id}`;
    return this.http.get<any>(url,requestOptions);
  }

  impresionEntradaByIdSL(token:string,id:number):Observable<any>{
    //console.log(id);
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/entrada/impresion/${id}`;
    return this.http.get<any>(url,requestOptions);
  }

  SolpedMP(token:string,status:string):Observable<any[]>{
    /*const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });*/
      const headers = this.urlApiService.getHeadersAPI(token);
      const requestOptions = { headers: headers };
      const url:string = `${this.api_url}/api/compras/solped/list/mps/${status}`;
      return this.http.get<any[]>(url,requestOptions);
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
    //console.log('data service',data);
    let headers = this.urlApiService.getHeadersAPI(token);
    headers=headers.delete('content-type');
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/solped/mp`;
    return this.http.put<any[]>(url,data,requestOptions);
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


}
