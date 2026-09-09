import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError, retry, timeout } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

@Injectable()
export class MyHeaderInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Increment request count and show loading indicator
    this.activeRequests++;
    this.loaderService.display(true);

    // Retrieve token from localStorage
    const token = localStorage.getItem('token');
    const headersConfig: { [key: string]: string } = {
      'Bypass-Tunnel-Reminder': 'true'
    };

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    // Clone request to add Bypass-Tunnel-Reminder and Authorization headers
    const clonedRequest = req.clone({
      setHeaders: headersConfig
    });

    // Process request with timeout, retry, global error handling, and loader cleanup
    return next.handle(clonedRequest).pipe(
      // Timeout after 20 seconds
      timeout(20000),
      // Retry once on failure
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred while connecting to the server.';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status !== 0) {
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error && typeof error.error === 'object' && error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
            }
          } else {
            errorMessage = 'Unable to connect to the backend server. Please verify your connection.';
          }
        }

        // Suppress global toast notifications for business error codes handled specifically by LoginComponent
        const errorCode = error.error && typeof error.error === 'object' ? error.error.code : null;
        const isBusinessError = errorCode && [
          'FIRST_LOGIN',
          'ACCOUNT_LOCKED',
          'PASSWORD_EXPIRED',
          'INVALID_CREDENTIALS',
          'USER_DEACTIVATED',
          'ROLE_INACTIVE',
          'COMPANY_DEACTIVATED',
          'USER_NOT_FOUND'
        ].includes(errorCode);

        // If 401 Unauthorized occurs on an authenticated endpoint, token is missing or expired
        if (error.status === 401 && !req.url.includes('/authenticate')) {
          this.notificationService.failure(errorMessage || 'Session expired or unauthenticated. Please log in again.');
          localStorage.removeItem('token');
          this.router.navigate(['/']);
          return throwError(() => error);
        }

        if (!isBusinessError) {
          this.notificationService.failure(errorMessage);
        }

        // Propagate the original HttpErrorResponse so subscribers can check error.error.code
        return throwError(() => error);
      }),
      finalize(() => {
        // Decrement active request count and hide loader when all requests complete
        this.activeRequests--;
        if (this.activeRequests <= 0) {
          this.activeRequests = 0;
          this.loaderService.display(false);
        }
      })
    );
  }
}
