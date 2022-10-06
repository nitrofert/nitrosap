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



@Injectable({
  providedIn: 'root'
})
export class SAPService {

  private api_url:string = "/b1s/v1/";
  private api_url3:string = "http://localhost:3000";
  private api_url2:string = "https://nitrofert-hbt.heinsohncloud.com.co:50000/b1s/v1/";
  private tokenSAP:string = "";
  /*private headers: HttpHeaders = new HttpHeaders()
                                     .set('Access-Control-Allow-Origin','*');*/


  constructor(private http: HttpClient,
              private authService: AuthService) { }

  wsLoginCompany(token:string):Observable<ResponseLogSAP>{
    
    const infoToken = this.authService.getInfoToken(token);
    const infoUsuario = infoToken.infoUsuario
    const jsonLog = {"CompanyDB": infoUsuario.dbcompanysap, "UserName": "ABALLESTEROS", "Password": "1234"}
    //console.log(JSON.stringify(jsonLog));
    const url:string = `${this.api_url2}/Login`;

    const headers = new HttpHeaders({
        'CorsEnable': 'true',
        'CorsAllowedOrigins':'http://localhost:4200',
        "CorsAllowedHeaders":"content-type, accept, B1S-CaseInsensitive"
        
      });
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
            
            console.log(this.tokenSAP);
        },
        error: (err) => {
            console.log(err);
            //this.sapService.setTokenSAP('');
            this.tokenSAP = '';
        }
    })
  }

  
  BusinessPartners(token:string):Observable<any[]>{
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      const requestOptions = { headers: headers };
      const url:string = `${this.api_url3}/api/wssap/BusinessPartners`;
      return this.http.get<any[]>(url,requestOptions);
  }

  ItemsSAP(token:string):Observable<any[]>{
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      const requestOptions = { headers: headers };
      const url:string = `${this.api_url3}/api/wssap/Items`;
      return this.http.get<any[]>(url,requestOptions);
  }

  CuentasSAP(token:string):Observable<any[]>{
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      const requestOptions = { headers: headers };
      const url:string = `${this.api_url3}/api/wssap/Cuentas`;
      return this.http.get<any[]>(url,requestOptions);
  }

  CuentasSAPXE(token:string):Observable<any[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/Xengine/cuentas`;
    return this.http.get<any[]>(url,requestOptions);
  }


  itemsSAPXE(token:string):Observable<any[]>{
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/Xengine/items`;
    return this.http.get<any[]>(url,requestOptions);
  }

  seriesDocXEngineSAP(token:string,objType?:string):Observable<any[]>{
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let paramObjType = "";
    if(objType) paramObjType =`/${objType}`;
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/Xengine/series${paramObjType}`;
    return this.http.get<any[]>(url,requestOptions);
  }



  monedasXEngineSAP(token:string, date:string):Observable<any[]>{
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/Xengine/monedas/${date}`;
    return this.http.get<any[]>(url,requestOptions);
  }


  BusinessPartnersXE(token:string, proveedorId:string=''):Observable<any[]>{
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let proveedorParam:string ="";
    if(proveedorId!=''){
      proveedorParam = `/${proveedorId}`;
    }
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/BusinessPartnersXE${proveedorParam}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  cuentasPorDependenciaXE(token:string, dependencia:string=''):Observable<any[]>{
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let dependenciaParam:string ="";
    if(dependencia!=''){
      dependenciaParam = `/${dependencia}`;
    }
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/shared/functions/cuentas${dependenciaParam}`;
    return this.http.get<any[]>(url,requestOptions);
  }

  aprobacionesXE(token:string, dependencia:string=''):Observable<any[]>{
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let dependenciaParam:string ="";
    if(dependencia!=''){
      dependenciaParam = `/${dependencia}`;
    }
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url3}/api/wssap/Xengine/aprobaciones`;
    console.log(url);
    return this.http.get<any[]>(url,requestOptions);
  }


  

  

}
