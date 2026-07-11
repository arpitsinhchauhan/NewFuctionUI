import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserServiceService } from 'app/services/user-service.service';
import { SingUp } from 'app/models/SingUp';
import { NotificationService } from 'app/services/notification.service';
import { AuthService } from 'app/AuthService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { AccountLockedDialogComponent } from './account-locked-dialog/account-locked-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  data: any = [];
  sign: SingUp = new SingUp();
  dataArray!: any[];
  error: string = '';
  username: string = '';
  password: string = '';
  showPassword: boolean = false;


  constructor(private user: UserServiceService, private notificationService: NotificationService,
    private fb: FormBuilder, private router: Router, private dialog: MatDialog,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    // Dismiss any leftover snackbar from the previous session (e.g. after logout)
    this.snackBar.dismiss();
    this.createForm();
    if (localStorage.token) {
      localStorage.removeItem("token");
    }
  }

  // email: string = '';
  // password: string = '';
  loginError: string = '';



  createForm() {
    this.loginForm = this.fb.group(
      {
        username: [{ value: '' }],
        password: [{ value: '' }],
      }
    );
    this.loginForm.patchValue({
      username: '',
      password: '',
    });
  }
  // onLogin(): void {
  //   this.user.getAllData().subscribe((response: any[]) => {
  //     this.dataArray = response;
  //     const providedUsername = this.loginForm.controls['username'].value;
  //     const providedPassword = this.loginForm.controls['password'].value;
  //     let found = false;

  //     for (let i = 0; i < this.dataArray.length; i++) {
  //       const userData = this.dataArray[i];
  //       if (userData.username === providedUsername && userData.password === providedPassword) {
  //         found = true;
  //         break; // Exit the loop once a match is found
  //       }
  //     }

  //     if (found) {
  //       this.router.navigate(['/dashboard']);
  //     } else {
  //       this.error = 'Invalid username or password';
  //     }
  //   });
  // }

  // onLogin(): void {
  //   if (this.loginForm.invalid) {
  //     // Handle form validation errors
  //     return;
  //   }

  //   const { username, password } = this.loginForm.value;

  //   this.user.login(username, password).subscribe(
  //     (response: any) => {
  //       this.dataArray = response;
  //           const providedUsername = this.loginForm.controls['username'].value;
  //           const providedPassword = this.loginForm.controls['password'].value;
  //           let found = false;

  //           for (let i = 0; i < this.dataArray.length; i++) {
  //             const userData = this.dataArray[i];
  //             if (userData.username === providedUsername && userData.password === providedPassword) {
  //               found = true;
  //               break; // Exit the loop once a match is found
  //             }
  //           }
  //       if (found) {
  //         this.router.navigate(['/dashboard']);
  //       } else {
  //         this.error = response.message || 'Invalid username or password';
  //       }
  //     },
  //     (error) => {
  //       // Handle HTTP errors or other subscription errors
  //       console.error('Login error:', error);
  //       this.error = 'An error occurred while logging in';
  //     }
  //   );
  // }
  onLogin(): void {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    if (!username || !password) {
      this.notificationService.failure("Please enter username and password.");
      return;
    }
    this.user.loginIN(username, password).subscribe(
      (response) => {
        // console.log(response);
        // this.authService.setNozzleValues(response.xpPetrolNozzle, response.powerDieselNozzle);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('username', response.username);
        localStorage.setItem('firstName', response.firstName);
        localStorage.setItem('lastName', response.lastName);
        if (response.token) {
          this.user.setUserId(response.userId);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          if (response.pumpId) {
            localStorage.setItem('pumpId', response.pumpId.toString());
          }
          if (response.managerId) {
            localStorage.setItem('managerId', response.managerId.toString());
          }
          if (response.role === 'SUPER_ADMIN' || response.role === 'admin') {
            this.router.navigate(['/User']);
          } else if (response.role === 'PUMP_MANAGER' || response.role === 'user') {
            this.router.navigate(['/manager/dashboard']);
          } else if (response.role === 'EMPLOYEE') {
            this.router.navigate(['/employee/daily-report']);
          } else {
            this.notificationService.failure("Unknown role: " + response.role);
          }
        } else {
          this.notificationService.failure("Please enter correct username and password.");
        }
        //  alert("Login successful");
        //  (">>>>>>>>>>>");
        // if (response.token && response.role === 'user') {
        //   this.router.navigate(['/dashboard']);
        // } else if (response.token && response.role === 'admin') {
        //   this.router.navigate(['/User']);
        // } else {
        //   alert("Please enter correct username and password.");
        // }

        // if (response.username === 'aaa'||response.token != null || response.token != "") {
        //   this.router.navigate(['/dashboard']);
        //   // localStorage.removeItem("token");    
        // } else if(response.username === 'arpit'||response.token != null || response.token != "" ){
        //   this.router.navigate(['/User']);
        //   // alert("Plz rightp username and password  ");
        // }
      },
      (error) => {
        if (error && error.error && error.error.code) {
          const code = error.error.code;
          const msg = error.error.message || 'Authentication failed';
          
          if (code === 'USER_NOT_FOUND' || code === 'USER_DEACTIVATED' || code === 'ROLE_INACTIVE' || code === 'COMPANY_DEACTIVATED' || code === 'INVALID_CREDENTIALS') {
            this.notificationService.failure(msg);
          } else if (code === 'ACCOUNT_LOCKED') {
            this.dialog.open(AccountLockedDialogComponent, {
              width: '420px',
              panelClass: 'dialog-modern-wrapper',
              data: { message: msg },
              disableClose: true
            });
          } else if (code === 'PASSWORD_EXPIRED') {
            this.dialog.open(ChangePasswordDialogComponent, {
              width: '450px',
              panelClass: 'dialog-modern-wrapper',
              data: { userId: error.error.userId, message: msg, oldPassword: password },
              disableClose: true
            });
          } else if (code === 'FIRST_LOGIN') {
            this.dialog.open(ChangePasswordDialogComponent, {
              width: '450px',
              panelClass: 'dialog-modern-wrapper',
              data: { userId: error.error.userId, message: msg, oldPassword: password },
              disableClose: true
            });
          } else {
            this.notificationService.failure(msg);
          }
        } else {
          this.notificationService.failure("Server Close? Start the Server:");
        }
      }
    );
  }

  openForgotPassword() {
    this.dialog.open(ForgotPasswordComponent, {
      width: '400px',
      panelClass: 'dialog-modern-wrapper',
      disableClose: true
    });
  }
}



