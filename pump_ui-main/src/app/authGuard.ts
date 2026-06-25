import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { UserServiceService } from './services/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
  
  constructor(private authService: UserServiceService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean> {
    const isLoggedIn = this.authService.isLoggedIn();
    const role = localStorage.getItem('role');
     const userId = localStorage.getItem('userId');

    if (!isLoggedIn) {
      this.router.navigate(['/']);
       return of(false);
    }

    // Check route path
    const requestedPath = state.url;

    // if (username === 'aaa' && requestedPath === '/User') {
    //   this.router.navigate(['/dashboard']);
    //   return false;
    // }

    if (role === 'admin' || role === 'SUPER_ADMIN') {
      const allowedAdminPaths = ['/admin/dashboard', '/User', '/Report', '/bill', '/purchasedetails', '/oilPurchasedetails', '/extraPurchasedetails', '/petroldetails', '/dieseldetails', '/XPpetrol', '/powerDiesel', '/oilsell', '/Dipp', '/extraDipp', '/Kharch', '/atm', '/Jama&Baki', '/DipTable', '/image', '/feedback', '/aboutus', '/dailyReport', '/customer', '/loader-preview'];
      if (!allowedAdminPaths.includes(requestedPath)) {
        this.router.navigate(['/User']);
        return of(false);
      }
      return of(true);
    }

    if (role === 'user' || role === 'PUMP_MANAGER') {
      const allowedManagerPaths = ['/manager/dashboard', '/User', '/Report', '/bill', '/purchasedetails', '/oilPurchasedetails', '/extraPurchasedetails', '/petroldetails', '/dieseldetails', '/XPpetrol', '/powerDiesel', '/oilsell', '/Dipp', '/extraDipp', '/Kharch', '/atm', '/Jama&Baki', '/DipTable', '/image', '/feedback', '/aboutus', '/dailyReport', '/customer', '/loader-preview'];
      if (!allowedManagerPaths.includes(requestedPath)) {
        this.router.navigate(['/manager/dashboard']);
        return of(false);
      }
      return of(true);
    }

    if (role === 'EMPLOYEE') {
      if (requestedPath !== '/employee/daily-report') {
        this.router.navigate(['/employee/daily-report']);
        return of(false);
      }
      return of(true);
    }
   if (requestedPath === '/XPpetrol' || requestedPath === '/powerDiesel' ||  requestedPath === '/extraDipp' ||  requestedPath === '/extraPurchasedetails') {
      return this.authService.getUserPump(userId).pipe(
        map(response => {
          const data = response?.data;
          if (requestedPath === '/XPpetrol' && data?.xp_petrol_nozzle === "0") {
            this.router.navigate(['/dashboard']);
            return false;
          }
          if (requestedPath === '/powerDiesel' && data?.powe_diesel_nozzle === "0") {
            this.router.navigate(['/dashboard']);
            return false;
          }
          if (requestedPath === '/extraDipp' && data?.powe_diesel_nozzle === "0") {
            this.router.navigate(['/dashboard']);
            return false;
          }
          if (requestedPath === '/extraPurchasedetails' && data?.powe_diesel_nozzle === "0") {
            this.router.navigate(['/dashboard']);
            return false;
          }
          return true;
        }),
        catchError(error => {
          console.error('AuthGuard error:', error);
          this.router.navigate(['/']);
          return of(false);
        })
      );
    }
     return of(true);
  }
  

}
