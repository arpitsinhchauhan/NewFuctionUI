import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  userId = '';
  message = 'Please update your password.';

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserServiceService,
    private notificationService: NotificationService
  ) {
    if (data) {
      this.userId = data.userId || '';
      this.message = data.message || this.message;
      this.oldPassword = data.oldPassword || '';
    }
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  changePassword() {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.notificationService.failure("All fields are required!");
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.notificationService.failure("New passwords do not match!");
      return;
    }

    const changePasswordData = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };
    this.userService.changePassword(changePasswordData, this.userId).subscribe(
      (res) => {
        this.notificationService.success("Password changed successfully! Please log in with your new password.");
        this.dialogRef.close(true);
      },
      (err) => {
        const errMsg = err.error?.message || err.error || "Failed to update password.";
        this.notificationService.failure(errMsg);
      }
    );
  }
}
