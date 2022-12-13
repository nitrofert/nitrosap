
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
  })
export class UrlApiService {

    env:string = 'test';
    url_api:string ="";
    headers:any;
    constructor() {}

    getUrlAPI():string{
        
        this.url_api= this.env==='dev'?'http://localhost:3001':this.env==='test'?'http://backend.dev.nitrofert.com.co':'http://backend.nitrofert.com.co';
        //console.log('url api:',this.url_api);
        return this.url_api;
    }

    getHeadersAPI(tokenid?:string):any{
        
        let headers = new HttpHeaders()
 
        headers=headers.append('content-type','application/json')
        headers=headers.append('Access-Control-Allow-Origin', '*')
        //headers=headers.append('content-type','application/x-www-form-urlencoded')
        if(tokenid){
            headers=headers.append('withCredentials','true')
            headers=headers.append('Authorization','Bearer ' + tokenid) 
        }
        
        //console.log(headers) 
       
        return headers;
    }
}
