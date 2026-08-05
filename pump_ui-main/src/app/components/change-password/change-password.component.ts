import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  submitted = false;
  users: any;
  hideOld = true;
  hideNew = true;
  hideConfirm = true;
  isSelf = true;
  //userId = localStorage.getItem('userId');

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private http: HttpClient, private user: UserServiceService, private notificationService: NotificationService) {
    this.users = this.data.userId;
    this.isSelf = this.data.isSelf !== false;
  }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', this.isSelf ? [Validators.required] : []],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    const { oldPassword, newPassword } = this.changePasswordForm.value;

    this.user.changePassword({ oldPassword, newPassword }, this.users).subscribe(
      (response) => {
        this.notificationService.success('Password changed successfully');
        this.dialogRef.close();
      },
      (error) => {
        this.dialogRef.close();
      }
    );
  }

  close() {
    this.dialogRef.close();
  }

}