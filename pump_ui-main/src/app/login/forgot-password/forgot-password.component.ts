import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  identity: string = '';
  newPass: string = '';
  confirmPass: string = '';
  showNewPass: boolean = false;
  showConfirmPass: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private notificationService: NotificationService,
    private userService: UserServiceService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  resetPasswordDirect() {
    if (!this.identity || !this.newPass || !this.confirmPass) {
      this.notificationService.failure("All fields are required.");
      return;
    }

    if (this.newPass !== this.confirmPass) {
      this.notificationService.failure("Passwords do not match!");
      return;
    }
    
    this.userService.resetForgotPasswordDirect(this.identity, this.newPass).subscribe(
      (res: any) => {
        this.notificationService.success(res.message || "Password has been updated successfully!");
        this.dialogRef.close();
      },
      (err: any) => {
        const errMsg = err?.error?.message || "Failed to update password. Please try again.";
        this.notificationService.failure(errMsg);
      }
    );
  }
}
