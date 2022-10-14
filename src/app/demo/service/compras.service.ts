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

  updateSolped(token:string,data:any):Observable<any>{
    const headers = this.urlApiService.getHeadersAPI(token);
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
    console.log(id);
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/compras/entrada/${id}`;
    return this.http.get<any>(url,requestOptions);
  }


}
