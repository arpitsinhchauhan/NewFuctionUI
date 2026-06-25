import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserServiceService } from './services/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
  constructor(private authService: UserServiceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const isLoggedIn = this.authService.isLoggedIn();
    const role = localStorage.getItem('role');

    if (!isLoggedIn) {
      this.router.navigate(['/']);
      return of(false);
    }

    if (role === 'PUMP_MANAGER') {
      return of(true);
    }

    this.router.navigate(['/']);
    return of(false);
  }
}
