import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {LoginServices} from '../../services/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private router: Router, private services:LoginServices) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('token') != null){
      let roles = next.data['permittedRoles'] as Array<string>;
      if(roles){
        if(this.services.roleMatch(roles)) return true;
        else{
          //this.router.navigate(['/forbidden']);
          return false;
        }
      }
    // if(roles){
    //   if(this.service.roleMatch(roles)) return true;
    //   else{
    //     this.router.navigate(['/forbidden']);
    //     return false;
    //   }
    // }
      return true;
    }
    else {
      this.router.navigate(['/user/login']);
      return false;
    }

  }
}