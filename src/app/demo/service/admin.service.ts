import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompaniesUser } from '../api/companiesUser';
import { CompanyInterface } from '../api/company';
import { MenuInterface } from '../api/menu.interface';
import { PerfilInterface } from '../api/perfil';
import { PermisosInterface } from '../api/permiso';
import { UserInterface } from '../api/users';
import { UrlApiService } from './urlapi.service';



@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private api_url:string = "";
  //private api_url:string = "http://backend.nitrofert.com.co";

  constructor(private http: HttpClient,
              private urlApiService:UrlApiService) { 
                  this.api_url = this.urlApiService.getUrlAPI();
              }

  listMenu(token:string):Observable<MenuInterface[]>{
    
      const headers = this.urlApiService.getHeadersAPI(token);
      //console.log(headers);
 
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/menu/list`;
    return this.http.get<MenuInterface[]>(url,requestOptions);
  }

  
  loadMenuFather(token:string):Observable<MenuInterface[]>{
    /*const headers = new HttpHeaders({
      
        
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/

    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    

    const url:string = `${this.api_url}/api/menu/listFather`;
    return this.http.get<MenuInterface[]>(url,requestOptions);
  }

  orderNum(token:string,hierarchy:string, padre:any):Observable<any[]>{
    
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/

    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };

    let params:string ="";

    //console.log(hierarchy,padre);
    
    if(hierarchy) params = params+'/'+hierarchy;
    if(padre === undefined){console.log('padre undefined')}else{params = params+`/${padre}`;} 

    //console.log(params);
  
    const url:string = `${this.api_url}/api/menu/orderNum${params}`;
    ////console.log(url);
    return this.http.get<any[]>(url,requestOptions);
  }

  saveMenuOpcion(token:string, menu:MenuInterface):Observable<any[]>{
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/menu`;
    return this.http.post<any[]>(url,menu,requestOptions);
  }

  getMuenuById(token:string,idMenu:number):Observable<MenuInterface[]>{
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/menu/${idMenu}`;
    ////console.log(url);
    return this.http.get<MenuInterface[]>(url,requestOptions);
  }

  updateMenuOpcion(token:string, menu:MenuInterface):Observable<any[]>{
 
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/menu`;
    return this.http.put<any[]>(url,menu,requestOptions);
  }

  //**************** Perfiles ********************************/

  listPerfil(token:string):Observable<PerfilInterface[]>{
    
   
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/perfiles/list`;
    return this.http.get<PerfilInterface[]>(url,requestOptions);
  }

  savePerfil(token:string, perfil:PerfilInterface):Observable<any[]>{
   
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/perfiles`;
    return this.http.post<any[]>(url,perfil,requestOptions);
  }

  getPerfilById(token:string,idMenu:number):Observable<PerfilInterface[]>{
 
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/perfiles/${idMenu}`;
    ////console.log(url);
    return this.http.get<PerfilInterface[]>(url,requestOptions);
  }

  updatePerfil(token:string, perfil:PerfilInterface):Observable<any[]>{
    
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/perfiles`;
    return this.http.put<any[]>(url,perfil,requestOptions);
  }

  /***********************************************************/
  //**************** comapanies ********************************/

  listCompanies(token:string):Observable<CompanyInterface[]>{

  

    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/companies/list`;
    return this.http.get<CompanyInterface[]>(url,requestOptions);
  }

  saveCompany(token:string, company:CompanyInterface):Observable<any[]>{
   
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/companies`;
    return this.http.post<any[]>(url,company,requestOptions);
  }

  getCompanyById(token:string,idCompany:number):Observable<CompanyInterface[]>{
  
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };

    const url:string = `${this.api_url}/api/companies/${idCompany}`;
    ////console.log(url);
    return this.http.get<CompanyInterface[]>(url,requestOptions);
  }

  updateCompany(token:string, company:CompanyInterface):Observable<any[]>{
  
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/companies`;
    return this.http.put<any[]>(url,company,requestOptions);
  }
  /***********************************************************/

//**************** Permisos ********************************/
listPermisos(token:string):Observable<PermisosInterface[]>{

  
    const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/permisos/list`;
  return this.http.get<PermisosInterface[]>(url,requestOptions);
}

setPermiso(token:string, permiso:PermisosInterface):Observable<any[]>{

  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/permisos`;
  return this.http.post<any[]>(url,permiso,requestOptions);
}
/***********************************************************/

//**************** Usuarios ********************************/

listUsuarios(token:string):Observable<UserInterface[]>{
    
  
    const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/usuarios/list`;
  return this.http.get<UserInterface[]>(url,requestOptions);
}

saveUser(token:string, usuario:UserInterface):Observable<any[]>{

  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios`;
  return this.http.post<any[]>(url,usuario,requestOptions);
}

getUserById(token:string,idusuario:number):Observable<UserInterface[]>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios/${idusuario}`;
  //console.log(url);
  return this.http.get<UserInterface[]>(url,requestOptions);
}

updateUser(token:string, usuario:UserInterface):Observable<any[]>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios`;
  return this.http.put<any[]>(url,usuario,requestOptions);
}

getCompaniesUser(token:string,idusuario:number):Observable<CompaniesUser[]>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios/companies/${idusuario}`;
  //console.log(url);
  return this.http.get<CompaniesUser[]>(url,requestOptions);
}

setAccess(token:string,accessCompany:any): Observable<any>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios/companies`;
  ////console.log(url);
  return this.http.post<any>(url,accessCompany,requestOptions);

}

getPerfilesUser(token:string,idusuario:number):Observable<CompaniesUser[]>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/usuarios/perfiles/${idusuario}`;
  ////console.log(url);
  return this.http.get<CompaniesUser[]>(url,requestOptions);
}

setPerfilUser(token:string,perfilUser:any): Observable<any>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios/perfiles`;
  ////console.log(url);
  return this.http.post<any>(url,perfilUser,requestOptions);

}


getDependenciasEmpresa(token:string):Observable<any[]>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/mysql/query/dependencias`;
  //console.log(url);
  return this.http.get<any[]>(url,requestOptions);
}

getAlmacenesEmpresa(token:string):Observable<any[]>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/mysql/query/almacenes`;
  //console.log(url);
  return this.http.get<any[]>(url,requestOptions);
}

adicionarAreasUsuario(token:string,data:any): Observable<any>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios/adicionar-areas`;
  ////console.log(url);
  return this.http.post<any>(url,data,requestOptions);

}

adicionarAlmacenesUsuario(token:string,data:any): Observable<any>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios/adicionar-almacen`;
  ////console.log(url);
  return this.http.post<any>(url,data,requestOptions);

}

adicionarDependenciasUsuario(token:string,data:any): Observable<any>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios/adicionar-dependencias`;
  ////console.log(url);
  return this.http.post<any>(url,data,requestOptions);

}

elimnarAreasUsuario(token:string,data:any): Observable<any>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios/eliminar-areas`;
  ////console.log(url);
  return this.http.post<any>(url,data,requestOptions);

}



elimnarDependenciasUsuario(token:string,data:any): Observable<any>{
  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/
  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios/eliminar-dependencias`;
  ////console.log(url);
  return this.http.post<any>(url,data,requestOptions);

}

elimnarAlmacenUsuario(token:string,data:any): Observable<any>{

  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios/eliminar-almacen`;
  ////console.log(url);
  return this.http.post<any>(url,data,requestOptions);

}

getAreasByUserSAP(token:string):Observable<any[]>{

  const headers = this.urlApiService.getHeadersAPI(token);
  const requestOptions = { headers: headers };
  const url:string = `${this.api_url}/api/usuarios/areas-usuario`;
  //console.log(url);
  return this.http.get<any[]>(url,requestOptions);
}





}
