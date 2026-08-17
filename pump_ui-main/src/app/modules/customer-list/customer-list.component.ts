import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_CUSTOMER_NAME, API_PURCHASE_LIST } from 'app/serviceult';
import { CustomerComponent } from '../jama-baki/customer/customer.component';
import { CustomPdfViewerComponent } from 'app/user-profile/custom-pdf-viewer/custom-pdf-viewer.component';
import { CustomerExcelPdfComponent } from './customer-excel-pdf/customer-excel-pdf.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {

  userId: string;
  currentPage = 1;
  searchTerm: string = "";
  itemsPerPage = 4;
  customerList: any = [];
  originalCustomerList: any = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.getcustomer();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.executeSearch(term);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getcustomer() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_CUSTOMER_NAME, { params }).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.originalCustomerList = data || [];
      this.customerList = [...this.originalCustomerList];
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CustomerComponent, {
      width: "550px",
      disableClose: true,
      panelClass: 'dialog-modern-wrapper'
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getcustomer();
    });
  }

  deleteRow(idcustomer: any) {
    this.use.deletecustomerdata(idcustomer).subscribe((result) => {
      this.notificationService.success("Customer details deleted successfully");
      this.getcustomer();
    });
  }

  openExcelPdfKharch() {
    const dialogRef = this.dialog.open(CustomerExcelPdfComponent, {
      width: "70%",
      height: "100%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getcustomer();
    });
  }



  searchData(): void {
    this.searchSubject.next(this.searchTerm);
  }

  executeSearch(searchTerm: string): void {
    const term = (searchTerm || '').toLowerCase().trim();
    if (!term) {
      this.customerList = [...this.originalCustomerList];
      return;
    }

    this.customerList = this.originalCustomerList.filter((item: any) =>
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.email && item.email.toLowerCase().includes(term)) ||
      (item.phone && item.phone.toLowerCase().includes(term)) ||
      (item.date && item.date.toLowerCase().includes(term))
    );
  }

  trackById(index: number, item: any): any {
    return item.idcustomer || index;
  }

  clearSearch() {
    this.searchTerm = '';
    this.getcustomer();
  }

  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(CustomerComponent, {
      width: '50%',
      height: '70%',
      data: item,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getcustomer();
    });
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      // toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.customerList.sort((a, b) => {
      let dateA = new Date(a[column]);
      let dateB = new Date(b[column]);

      if (dateA < dateB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (dateA > dateB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
