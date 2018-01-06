import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (JSON.parse(sessionStorage.getItem('currentUser')).isAdmin) {
      return true;
    }
    this.router.navigate(['/dashboard']);
    return false;
  }
}
