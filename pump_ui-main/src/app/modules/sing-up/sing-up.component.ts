// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { UserDTO } from 'app/UserDTO';
// import { UserServiceService } from 'app/user-service.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-sing-up',
//   templateUrl: './sing-up.component.html',
//   styleUrls: ['./sing-up.component.css']
// })
// export class SingUPComponent implements OnInit {
//   hide = true;
//   user: UserDTO;
//   constructor(private http: HttpClient,
//     private router: Router,
//     private users: UserServiceService,
//   ) {
//     this.user = {
//       username: '',
//       password: '',
//       role: '',
//       email: '',
//       // Initialize other properties as needed
//     };

//   }
//   ngOnInit() {
//   }
//   // singup: any[] = [];
//   // Singupobj: any = {
//   //   username: '',
//   //   Email: '',
//   //   password: '',
//   //   flateNo: '',
//   // };
//   // loginobj: any = {
//   //   username: '',
//   //   password: '',
//   // };

//   // user: UserDTO = {
//   //   username: '',
//   //   password: '',
//   //   role: ''
//   //   // Initialize other properties as needed
//   // };


//   onSingup() {
//     // this.user.addUser(data).subscribe((res) => { });
//     // this.notificationService.showNotification('User add..');
//     // this.router.navigate(['/']);
//     if (!this.user.username || !this.user.password || !this.user.role || !this.user.email) {
//       alert("Please fill in all fields.");
//       return;
//   }
//     this.users.signUp(this.user).subscribe(
//       response => {
//         this.router.navigate(['/']);
//       },
//       error => {
//         console.error('Error registering user:', error);
//       }
//     );
//   }
// }


