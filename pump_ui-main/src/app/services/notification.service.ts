import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  success(message: string, duration: number = 3000) {
    if (!message || !message.trim()) return;
    this.showSnackBar(message, 'success-snackbar', 'check_circle', duration);
  }

  warning(message: string, duration: number = 4000) {
    if (!message || !message.trim()) return;
    this.showSnackBar(message, 'warning-snackbar', 'warning', duration);
  }

  failure(message: string, duration: number = 5000) {
    if (!message || !message.trim()) return;
    this.showSnackBar(message, 'danger-snackbar', 'error', duration);
  }

  dismiss() {
    this.snackBar.dismiss();
  }

  private showSnackBar(message: string, panelClass: string, icon: string, duration: number) {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass, 'modern-snackbar']
    });
  }
}
