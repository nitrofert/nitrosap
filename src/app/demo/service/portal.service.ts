import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuInterface } from '../api/menu.interface';



@Injectable({
  providedIn: 'root'
})
export class Portalervice {

  private api_url:string = "http://localhost:3000";

  

  constructor(private http: HttpClient) { }

  opcionesMenu(idUser:number,token:string):Observable<MenuInterface[]>{
 
    const header:HttpHeaders = new HttpHeaders().set('Authorization','Bearer '+token);
    
    const url:string = `${this.api_url}/api/config/menu/${idUser}`;
    return this.http.get<MenuInterface[]>(url,{ headers: header });
  }

 
}
