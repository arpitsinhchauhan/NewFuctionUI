import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_USER_LIST } from 'app/serviceult';
import { AddUserComponent } from '../add-user/add-user.component';
import { ConfirmDialogComponent } from 'app/components/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit, OnDestroy {

  userList: any = [];
  originalUserList: any = [];
  tableData: any[] = [];
  searchTerm: string = '';
  compD: any;
  dataSource: any[] | undefined;
  currentPage = 1;
  itemsPerPage = 4;
  userId: string;
  loggedInRole: string = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

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

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.executeFilter(term);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getdata() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_USER_LIST, { params }).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.originalUserList = data || [];
      this.userList = [...this.originalUserList];
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      panelClass: 'dialog-lg',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.getdata();
    });
  }

  applyFilter(filterValue: string) {
    this.searchSubject.next(filterValue);
  }

  executeFilter(filterValue: string) {
    const term = (filterValue || '').trim().toLowerCase();
    if (!term) {
      this.userList = [...this.originalUserList];
      return;
    }
    this.userList = this.originalUserList.filter((item: any) =>
      (item.username && item.username.toLowerCase().includes(term)) ||
      (item.email && item.email.toLowerCase().includes(term)) ||
      (item.firstName && item.firstName.toLowerCase().includes(term)) ||
      (item.lastName && item.lastName.toLowerCase().includes(term)) ||
      (item.role && item.role.toLowerCase().includes(term))
    );
  }

  trackById(index: number, item: any): any {
    return item.id || index;
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

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
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

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.use.deleteUser(id).pipe(takeUntil(this.destroy$)).subscribe((result) => {
          this.notificationService.success('User deleted successfully');
          this.getdata();
        });
      }
    });
  }

}
