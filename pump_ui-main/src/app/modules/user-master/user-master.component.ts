import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_USER_LIST } from 'app/serviceult';
import { AddUserComponent } from '../add-user/add-user.component';
import { ConfirmDialogComponent } from 'app/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit {

  userList: any = [];
  tableData: any[] = [];
  searchTerm: string = '';
  compD: any;
  dataSource: any[] | undefined;
  currentPage = 1;
  itemsPerPage = 4;
  userId: string;
  loggedInRole: string = '';

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.loggedInRole = localStorage.getItem('role') || 'SUPER_ADMIN';
    this.getdata();
  }

  getdata() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_USER_LIST, { params }).subscribe((data) => {
      this.userList = data;
    });
  }


  addUser() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      panelClass: 'dialog-lg',
      disableClose: true
    });

    // Subscribe to the afterClosed event to handle any actions after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.userList.filter = filterValue;
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  editUser(selectedUser: any) {
    const dialogRef = this.dialog.open(AddUserComponent, {
      panelClass: 'dialog-lg',
      data: selectedUser,
      disableClose: true
    });

    // Subscribe to the afterClosed event to handle any actions after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }

  deleteUser(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete User Account',
        message: 'Are you sure you want to permanently delete this user? This will revoke all their access rights.',
        confirmText: 'Delete User',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.use.deleteUser(id).subscribe((result) => {
          this.userList = result;
          this.notificationService.success('User deleted successfully');
          this.getdata();
        });
      }
    });
  }

}
