import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompaniesUser } from '../api/companiesUser';
import { CompanyInterface } from '../api/company';
import { MenuInterface } from '../api/menu.interface';
import { PerfilInterface } from '../api/perfil';
import { PermisosInterface } from '../api/permiso';
import { SolpedInterface } from '../api/solped';
import { UserInterface } from '../api/users';



@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private api_url:string = "http://localhost:3000";

  

  constructor(private http: HttpClient) { }

  listSolped(token:string):Observable<any[]>{
    
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
 
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/compras/solped/list`;
    return this.http.get<any[]>(url,requestOptions);
  }

  solpedById(token:string,id:number):Observable<SolpedInterface>{
    
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
 
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/compras/solped/${id}`;
    return this.http.get<SolpedInterface>(url,requestOptions);
  }

  taxes(token:string):Observable<any[]>{
    
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
 
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/shared/functions/taxes/validforap`;
    return this.http.get<any[]>(url,requestOptions);
  }
  taxesXE(token:string):Observable<any[]>{
    
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
 
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/shared/functions/taxes/compras`;
    return this.http.get<any[]>(url,requestOptions);
  }

  saveSolped(token:string,data:any):Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/compras/solped/`;
    return this.http.post<any[]>(url,data,requestOptions);

  }

  updateSolped(token:string,data:any):Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/compras/solped/`;
    return this.http.put<any[]>(url,data,requestOptions);

  }

  envioAprobacionSolped(token:string,idsSolped:number[]):Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let data = JSON.stringify(idsSolped);

    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/compras/solped/envio-aprobacion`;
    return this.http.post<any[]>(url,data,requestOptions);

  }

  aprobacionSolped(token:string,idsSolped:number[]):Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let data = JSON.stringify(idsSolped);

    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/compras/solped/aprobacion`;
    return this.http.post<any[]>(url,data,requestOptions);

  }

  aprobacionesSolped(token:string,idsSolped:number[]):Observable<any[]>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let data = JSON.stringify(idsSolped);

    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/compras/solped/aprobaciones/${idsSolped}`;
    return this.http.get<any[]>(url,requestOptions);

  }

  rechazoSolped(infoSolped:any):Observable<any>{
   

    const url:string = `${this.api_url}/api/compras/solped/rechazar`;
    return this.http.put<any[]>(url,infoSolped);

  }

  

}
