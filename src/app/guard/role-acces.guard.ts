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
    const expectedRole:any[] = route.data['expectedRole'];
    //console.log(expectedRole);
    const token = this.authService.getToken();
    //const infoToken:DecodeTokenInterface = this.authService.getInfoToken(token);
    const perfilesUsuario = this.authService.getPerfilesUsuario();

    //console.log(expectedRole, perfilesUsuario,expectedRole.includes('Administrador'),perfilesUsuario.find((element: any) => true === expectedRole.includes(element.perfil)));
    if(!perfilesUsuario.find((element: any) => true === expectedRole.includes(element.perfil))){
      return false;
    } 
      
    return true;
  }
  
}
