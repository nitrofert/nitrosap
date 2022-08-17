import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInterface } from '../components/auth/interfaces/company.interface';
import { LoginFormInterface } from '../api/frmlogin';
import { ResponsWsLoginInterface } from '../api/responseloginws';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api_url:string = "http://localhost:3000";

  

  constructor(private http: HttpClient) { }

  login(loginForm:LoginFormInterface):Observable<ResponsWsLoginInterface>{
    const url:string = `${this.api_url}/api/auth/login`;
    return this.http.post<ResponsWsLoginInterface>(url,loginForm);
  }

  companies():Observable<CompanyInterface[]>{
    const url:string = `${this.api_url}/api/companies/list`;
    return this.http.get<CompanyInterface[]>(url);
  }
}
