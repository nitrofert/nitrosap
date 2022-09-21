import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInterface } from '../api/company';
import { LoginFormInterface } from '../api/frmlogin';
import { InfoUsuario, ResponsWsLoginInterface } from '../api/responseloginws';
import { JwtHelperService } from '@auth0/angular-jwt'
import decode from 'jwt-decode';
import { DecodeTokenInterface, DependenciasUsuario } from '../api/decodeToken';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api_url:string = "http://localhost:3000";

  

  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) { }

  isAuth():boolean{
    const token:string = localStorage.getItem('token') || '';
    if(this.jwtHelperService.isTokenExpired(token) ||  !localStorage.getItem('token')){
      return false; 
    } 
    return true;
  }

  login(loginForm:LoginFormInterface):Observable<ResponsWsLoginInterface>{
    const url:string = `${this.api_url}/api/auth/login`;
    return this.http.post<ResponsWsLoginInterface>(url,loginForm);
  }

  companies():Observable<CompanyInterface[]>{
    const url:string = `${this.api_url}/api/companies/listActive`;
    return this.http.get<CompanyInterface[]>(url);
  }

  getToken():string{
    let infoSessionStr:string = localStorage.getItem('infoSession') ||'';
    const infoSession:InfoUsuario[]    =  JSON.parse(infoSessionStr);
    const token = localStorage.getItem('token') || '';
    return token
  }

  getInfoToken(token:string){
    const infoToken:DecodeTokenInterface = decode(token);
    return infoToken;
  }

  getInfoUsuario(){
    const infoToken = this.getInfoToken(this.getToken());
    return infoToken.infoUsuario;
  }

  getPermisosUsuario(){
    const infoToken = this.getInfoToken(this.getToken());
    return infoToken.permisosUsuario;
  }

  getPerfilesUsuario(){
    const infoToken = this.getInfoToken(this.getToken());
    return infoToken.perfilesUsuario;
  }



  getDependeciasUsuario():Observable<DependenciasUsuario[]>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/auth/dependenciesUser`;
  return this.http.get<DependenciasUsuario[]>(url,requestOptions);
  }

  getAlmacenesUsuario():Observable<any[]>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/auth/storesUser`;
  return this.http.get<any[]>(url,requestOptions);
  }

  getAlmacenesUsuarioXE():Observable<any[]>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/auth/storesUser2`;
  return this.http.get<any[]>(url,requestOptions);
  }

  getDependeciasUsuarioXE():Observable<DependenciasUsuario[]>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/auth/dependenciesUserXE`;
  return this.http.get<DependenciasUsuario[]>(url,requestOptions);
  }

  getAreasUsuarioXE():Observable<any[]>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/auth/areasUser`;
  return this.http.get<any[]>(url,requestOptions);
  }

}
