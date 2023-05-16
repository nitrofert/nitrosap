import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../demo/service/auth.service';
import decode from 'jwt-decode'
import { DecodeTokenInterface } from '../demo/api/decodeToken';

@Injectable({
  providedIn: 'root'
})
export class RoleAccesGuard implements CanActivate {

  constructor(public authService: AuthService,
    private router: Router){}

  canActivate(route:ActivatedRouteSnapshot):boolean  {
    const expectedRole = route.data['expectedRole'];
    //console.log(expectedRole);
    const token = this.authService.getToken();
    //const infoToken:DecodeTokenInterface = this.authService.getInfoToken(token);
    const perfilesUsuario = this.authService.getPerfilesUsuario();

    //console.log(perfilesUsuario.find((element: any) => element.perfil === expectedRole));
    if(!perfilesUsuario.find((element: any) => element.perfil === expectedRole)){
      return false;
    } 
      
    return true;
  }
  
}
