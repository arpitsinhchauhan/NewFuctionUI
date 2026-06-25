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

@Injectable()
export class MyHeaderInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Increment request count and show loading indicator
    this.activeRequests++;
    this.loaderService.display(true);

    // Clone request to add Bypass-Tunnel-Reminder header
    const clonedRequest = req.clone({
      setHeaders: {
        'Bypass-Tunnel-Reminder': 'true'
      }
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
            errorMessage = error.error?.message || `Server Error Code: ${error.status}\nMessage: ${error.message}`;
          } else {
            errorMessage = 'Unable to connect to the backend server. Please verify your connection.';
          }
        }
        
        // Show toast notification of error
        this.notificationService.failure(errorMessage);
        return throwError(() => new Error(errorMessage));
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
