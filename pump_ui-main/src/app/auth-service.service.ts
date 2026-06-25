import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError as observableThrowError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Constants } from './Constants';
import { Injectable } from '@angular/core';
import { API_AUTH, API_AUTH_REFRESH_TOKEN, API_AUTH_VALIDATE_TOKEN, API_USER_LOGOUT } from './serviceult';
import { User } from './models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  CT = Constants;
  loggedInUser: User;
  refreshTokenTime = 640 * 6;

  ///to set a variable that will tell wheather the useer has been logged in sucessfully 
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


  private isRoleAdminSubject = new BehaviorSubject<boolean>(false);
  isRoleAdmin$ = this.isRoleAdminSubject.asObservable();




  constructor(private http: HttpClient) { }

  attemptAuth(ussername: string, password: string): Observable<any> {
    const credentials = { username: ussername, password: password };
    return this.http.post<any>(API_AUTH, credentials).pipe(
      tap(value => {
        this.loggedInUser = value.res.user
        if (this.loggedInUser.role === this.CT.ROLE_ADMIN) {
          this.isRoleAdminSubject.next(true);
        } else {
          this.isRoleAdminSubject.next(false);
        }
      }),
      map(value => {
        return value.res.token
      }),
      catchError(this.handleError('attemptAuth'))
    );
  }

  refreshToken(): Observable<any> {
    return this.http.get<any>(API_AUTH_REFRESH_TOKEN).pipe(
      tap(value => {
        this.loggedInUser = value.res.user
      }),
      map(value => {
        return value.res.token
      }),
      catchError(this.handleError('refreshToken'))
    );
  }

  validateToken(): Observable<any> {
    return this.http.get<any>(API_AUTH_VALIDATE_TOKEN).pipe(
      tap(result => {
        this.loggedInUser = result.res;
        //once token is validated set login sucess
        this.isAuthenticatedSubject.next(true);
      }),
      map(result => {
        return result.res.firstTimeFlag;
      }),
      catchError(this.handleError('validateToken'))
    );
  }

  getUser(): User {
    return this.loggedInUser;
  }


  logout(user: User): Observable<any> {
    return this.http.post<any>(API_USER_LOGOUT, user).pipe(
      tap(res => res),
      catchError(this.handleError('logout'))
    );
    ;
  }

  getRefreshTokenTimeOut() {
    return this.refreshTokenTime;
  }


  handleError(message: string) {
    return (error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error(`${message} An error occurred:`, error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `${message} Backend returned code ${error.status}, ` +
          `${message} body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return observableThrowError(error.error);
    };
  }
}
