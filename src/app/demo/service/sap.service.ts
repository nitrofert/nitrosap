import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompaniesUser } from '../api/companiesUser';
import { CompanyInterface } from '../api/company';
import { MenuInterface } from '../api/menu.interface';
import { PerfilInterface } from '../api/perfil';
import { PermisosInterface } from '../api/permiso';
import { ResponseLogSAP } from '../api/responseWsSAP';
import { UserInterface } from '../api/users';
import { AuthService } from './auth.service';
import { UrlApiService } from './urlapi.service';



@Injectable({
  providedIn: 'root'
})
export class SAPService {

  private api_url:string = "/b1s/v1/";
  private api_url3:string = "";
  //private api_url3:string = "http://backend.nitrofert.com.co";
  private api_url2:string = "https://nitrofert-hbt.heinsohncloud.com.co:50000/b1s/v1/";
  private tokenSAP:string = "";
  /*private headers: HttpHeaders = new HttpHeaders()
                                     .set('Access-Control-Allow-Origin','*');*/


  constructor(private http: HttpClient,
              private authService: AuthService,
              private urlApiService:UrlApiService) { 
                this.api_url3 = this.urlApiService.getUrlAPI();
              }

  wsLoginCompany(token:string):Observable<ResponseLogSAP>{
    
    //const infoToken = this.authService.getInfoToken(token);
    const infoUsuario = this.authService.getInfoUsuario();
    
    const jsonLog = {"CompanyDB": infoUsuario.dbcompanysap, "UserName": "ABALLESTEROS", "Password": "1234"}
    //console.log(JSON.stringify(jsonLog));
    const url:string = `${this.api_url2}/Login`;

    const headers = this.urlApiService.getHeadersAPI();
    const requestOptions = { headers: headers };

    
    //console.log(url);
    //return this.http.post<ResponseLogSAP>(url,JSON.stringify(jsonLog),{headers:this.headers});
    return this.http.post<ResponseLogSAP>(url,JSON.stringify(jsonLog),requestOptions);
  }

  setTokenSAP(token:string){
    this.tokenSAP = token;
  } 

  getLoginSAP(){

    this.wsLoginCompany(this.authService.getToken())
    .subscribe({
        next: (res) => {
            //console.log(res);
            //this.sapService.setTokenSAP(res.SessionId);
            this.tokenSAP = res.SessionId;
            
            //console.log(this.tokenSAP);
        },
        error: (err) => {
            console.log(err);
            //this.sapService.setTokenSAP('');
            this.tokenSAP = '';
        }
    })
  }

  
  BusinessPartners(token:string):Observable<any[]>{
    /*const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });*/
      const headers = this.urlApiService.getHeadersAPI(token);
      const requestOptions = { headers: headers };
      const url:string = `${this.api_url3}/api/wssap/BusinessPartners`;
      return this.http.get<any[]>(url,requestOptions);
  }



  ItemsSAPSL(token:string):Observable<any[]>{
    /*const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });*/
      const headers = this.urlApiService.getHeadersAPI(token);
      const requestOptions = { headers: headers };
      const url:string = `${this.api_url3}/api/wssap/Items`;
      return this.http.get<any[]>(url,requestOptions);
  }

  CuentasSAPSL(token:string):Observable<any[]>{
    /*const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });*/
      const headers = this.urlApiService.getHeadersAPI(token);
      const requestOptions = { headers: headers };
      const url:string = `${this.api_url3}/api/wssap/Cuentas`;
      return this.http.get<any[]>(url,requestOptions);
  }

  CuentasSAPXE(token:string):Observable<any[]>{
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/Xengine/cuentas`;
    return this.http.get<any[]>(url,requestOptions);
  }


  
  itemsSAPXE(token:string):Observable<any[]>{
   
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/Xengine/items`;
    return this.http.get<any[]>(url,requestOptions);
  }

  itemsSolpedSAPXE(token:string):Observable<any[]>{
   
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/Xengine/itemsSolped`;
    return this.http.get<any[]>(url,requestOptions);
  }

  seriesDocXEngineSAP(token:string,objType?:string):Observable<any[]>{
   
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/
    const headers = this.urlApiService.getHeadersAPI(token);
    let paramObjType = "";
    if(objType) paramObjType =`/${objType}`;
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/Xengine/series${paramObjType}`;
    return this.http.get<any[]>(url,requestOptions);
  }



  monedasXEngineSAP(token:string, date:string):Observable<any[]>{
   
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/
    const headers = this.urlApiService.getHeadersAPI(token);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/Xengine/monedas/${date}`;
    return this.http.get<any[]>(url,requestOptions);
  }


  BusinessPartnersXE(token:string, proveedorId:string=''):Observable<any[]>{
   
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/
    const headers = this.urlApiService.getHeadersAPI(token);
    let proveedorParam:string ="";
    if(proveedorId!=''){
      proveedorParam = `/${proveedorId}`;
    }
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/BusinessPartnersXE${proveedorParam}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  cuentasPorDependenciaXE(token:string, dependencia:string=''):Observable<any[]>{
   
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/
    const headers = this.urlApiService.getHeadersAPI(token);
    let dependenciaParam:string ="";
    if(dependencia!=''){
      dependenciaParam = `/${dependencia}`;
    }
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/shared/functions/cuentas${dependenciaParam}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  aprobacionesXE(token:string, dependencia:string=''):Observable<any[]>{
   
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });*/
    const headers = this.urlApiService.getHeadersAPI(token);
    let dependenciaParam:string ="";
    if(dependencia!=''){
      dependenciaParam = `/${dependencia}`;
    }
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/Xengine/aprobaciones`;
    //console.log(url);
    return this.http.get<any[]>(url,requestOptions);
  }

  getUnidadItemSL(token:string,ItemCode:string):Observable<any>{
   

    const headers = this.urlApiService.getHeadersAPI(token);
  
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/UnidadItem/${ItemCode}`;
    return this.http.get<any>(url,requestOptions);
  }

  

  getAlmacenesMPSL(token:string):Observable<any>{
   

    const headers = this.urlApiService.getHeadersAPI(token);
  
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/almacenesmp`;
    return this.http.get<any>(url,requestOptions);
  }


  

  

}
