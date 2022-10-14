import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInterface } from '../api/company';
import { LoginFormInterface } from '../api/frmlogin';
import { InfoUsuario, ResponsWsLoginInterface } from '../api/responseloginws';
import { JwtHelperService } from '@auth0/angular-jwt'
import decode from 'jwt-decode';
import { DecodeTokenInterface, DependenciasUsuario } from '../api/decodeToken';
import { UrlApiService } from './urlapi.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  private api_url:string = "http://localhost:3000";
  //private api_url:string = "http://backend.nitrofert.com.co";

  constructor(private http: HttpClient,
              private urlApiService:UrlApiService,
              private jwtHelperService: JwtHelperService) { 
                  this.api_url = this.urlApiService.getUrlAPI();
              }

  isAuth():boolean{
    const token:string = localStorage.getItem('tokenid') || '';
    if(this.jwtHelperService.isTokenExpired(token) ||  !localStorage.getItem('tokenid')){
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
    const token = localStorage.getItem('tokenid') || '';
    return token
  }
  
  getTokenid():string{

    const token = localStorage.getItem('tokenid') || '';
    return token
  }

  getInfoToken1(token:string){
    const infoToken:DecodeTokenInterface = decode(token);
    return infoToken;
  }

  loadInfoUsuario(tokenid:string):Observable<any>{
    let headers = this.urlApiService.getHeadersAPI(tokenid);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/auth/infoUsuario`;
    return this.http.get<any[]>(url,requestOptions);
  }

  loadMenuUsuario(tokenid:string):Observable<any>{
    let headers = this.urlApiService.getHeadersAPI(tokenid); 
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/auth/menuUsuario`;
    return this.http.get<any[]>(url,requestOptions);
  }

  loadPerfilesUsuario(tokenid:string):Observable<any>{

    let headers = this.urlApiService.getHeadersAPI(tokenid);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/auth/perfilesUsuario`;
    return this.http.get<any[]>(url,requestOptions);
  }

  loadPemisosUsuario(tokenid:string):Observable<any>{
    let headers = this.urlApiService.getHeadersAPI(tokenid);
    const requestOptions = { headers: headers };
    const url:string = `${this.api_url}/api/auth/permisosUsuario`;
    return this.http.get<any[]>(url,requestOptions);
  }

  getMenuUsuario(){
    const menuUsuario = JSON.parse(localStorage.getItem('menuUsuario') || '');
    return menuUsuario;
  }

  getInfoUsuario(){
    const infoUsuario = JSON.parse(localStorage.getItem('infoUsuario') || '');
    return infoUsuario[0];
  }

  getPermisosUsuario(){
    const permisosUsuario = JSON.parse(localStorage.getItem('permisosUsuario') || '');
    return permisosUsuario;
  }

  getPerfilesUsuario(){
    const perfilesUsuario = JSON.parse(localStorage.getItem('perfilesUsuario') || '');
    return perfilesUsuario;
  }

  getDependeciasUsuario():Observable<DependenciasUsuario[]>{

    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });*/

    let headers = this.urlApiService.getHeadersAPI(this.getToken());

  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/auth/dependenciesUser`;
  return this.http.get<DependenciasUsuario[]>(url,requestOptions);
  }

  getAlmacenesUsuario():Observable<any[]>{

    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });*/

    let headers = this.urlApiService.getHeadersAPI(this.getToken());

  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/auth/storesUser`;
  return this.http.get<any[]>(url,requestOptions);
  }

  getAlmacenesUsuarioXE():Observable<any[]>{

    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });*/

    let headers = this.urlApiService.getHeadersAPI(this.getToken());

  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/auth/storesUser2`;
  return this.http.get<any[]>(url,requestOptions);
  }

  getDependeciasUsuarioXE():Observable<DependenciasUsuario[]>{

    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });*/

    let headers = this.urlApiService.getHeadersAPI(this.getToken());

  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/auth/dependenciesUserXE`;
  return this.http.get<DependenciasUsuario[]>(url,requestOptions);
  }

  getAreasUsuarioXE():Observable<any[]>{

    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });*/

    let headers = this.urlApiService.getHeadersAPI(this.getToken());

  const requestOptions = { headers: headers };

  const url:string = `${this.api_url}/api/auth/areasUser`;
  return this.http.get<any[]>(url,requestOptions);
  }

}
