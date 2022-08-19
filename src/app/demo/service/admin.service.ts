import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInterface } from '../api/company';
import { MenuInterface } from '../api/menu.interface';



@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private api_url:string = "http://localhost:3000";

  

  constructor(private http: HttpClient) { }

  listMenu(token:string):Observable<MenuInterface[]>{
    
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
 
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/menu/list`;
    return this.http.get<MenuInterface[]>(url,requestOptions);
  }

  
  loadMenuFather(token:string):Observable<MenuInterface[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/menu/listFather`;
    return this.http.get<MenuInterface[]>(url,requestOptions);
  }

  orderNum(token:string,hierarchy:string, padre:any):Observable<any[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = { headers: headers };

    let params:string ="";

    console.log(hierarchy,padre);
    
    if(hierarchy) params = params+'/'+hierarchy;
    if(padre === undefined){console.log('padre undefined')}else{params = params+`/${padre}`;} 

    console.log(params);
  
    const url:string = `${this.api_url}/api/menu/orderNum${params}`;
    console.log(url);
    return this.http.get<any[]>(url,requestOptions);
  }

  saveMenuOpcion(token:string, menu:MenuInterface):Observable<any[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/menu`;
    return this.http.post<any[]>(url,menu,requestOptions);
  }

  getMuenuById(token:string,idMenu:number):Observable<MenuInterface[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/menu/${idMenu}`;
    console.log(url);
    return this.http.get<MenuInterface[]>(url,requestOptions);
  }

  updateMenuOpcion(token:string, menu:MenuInterface):Observable<any[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/menu`;
    return this.http.put<any[]>(url,menu,requestOptions);
  }

  listCompanies(token:string):Observable<CompanyInterface[]>{

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
 
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/companies/list`;
    return this.http.get<CompanyInterface[]>(url);
  }
}


