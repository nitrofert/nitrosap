import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInterface } from '../api/company';
import { LoginFormInterface } from '../api/frmlogin';
import { InfoUsuario, ResponsWsLoginInterface } from '../api/responseloginws';
import { JwtHelperService } from '@auth0/angular-jwt'
import decode from 'jwt-decode';
import { DecodeTokenInterface, DependenciasUsuario } from '../api/decodeToken';
import { UrlApiService } from './urlapi.service';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class RecaptchaService  {

  private api_url:string = "http://localhost:3000";
  //private api_url:string = "http://backend.nitrofert.com.co";

  public isBrowser:boolean = false;

  constructor(private http: HttpClient,
              private urlApiService:UrlApiService,
              private jwtHelperService: JwtHelperService,
              @Inject(PLATFORM_ID) private platformId: Object) { 
                  this.api_url = this.urlApiService.getUrlAPI();
                  if(isPlatformBrowser(platformId)){
                    this.isBrowser = true;
                  }
              }

  getToken(token:string, tipoCaptcha:string):Observable<string>{
    console.log(token);
    const url:string = `${this.api_url}/api/auth/recaptcha`;
    return this.http.post<string>(url,{  token, tipoCaptcha });
  }

  getToken2(token:string):string{
    //console.log(token);
     if(this.isBrowser == true){
         const xhr = new XMLHttpRequest();
         xhr.open('POST',  `${this.api_url}/api/auth/recaptcha/${token}`, false);
         xhr.send();
         const aux = JSON.parse(xhr.responseText);
         return xhr.responseText;
     }else{
         return 'false';
     }

 
}




}
