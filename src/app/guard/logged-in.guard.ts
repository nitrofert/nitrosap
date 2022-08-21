import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../demo/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements  CanActivate {

  constructor(private authService: AuthService,
              private router: Router){}
  
  canActivate(): boolean {

      
        if(this.authService.isAuth()){
          this.router.navigate(['/portal']);
          return false;
        }
        console.log('Token deactive');
        return true;    
    
  }
  
}
