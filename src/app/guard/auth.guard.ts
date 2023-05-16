import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../demo/service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  /*canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }*/
  constructor(public authService: AuthService,
              private router: Router) {}

  canActivate():  boolean {

    if(!this.authService.isAuth()){
      console.log('Token invalido o tiempo expiro');
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

 
 
  
  
}
