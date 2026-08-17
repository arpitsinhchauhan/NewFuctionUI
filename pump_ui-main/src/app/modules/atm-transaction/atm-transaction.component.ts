import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_ATMSELL_LIST } from 'app/serviceult';
import { AtmTransactionPdfExcelComponent } from './atm-transaction-pdf-excel/atm-transaction-pdf-excel.component';
import { TransactionReportComponent } from './transaction-report/transaction-report.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-atm-transaction',
  templateUrl: './atm-transaction.component.html',
  styleUrls: ['./atm-transaction.component.css']
})
export class AtmTransactionComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  transaction: any = [];
  originalTransaction: any = [];
  dataSource: any[] | undefined;
  currentPage = 1;
  itemsPerPage = 4;
  userId: string;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  role: string = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.gettransaction();

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

  gettransaction() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_ATMSELL_LIST, { params }).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.originalTransaction = data || [];
      this.transaction = [...this.originalTransaction];
    });
  }

  deletetransaction(id: any) {
    this.use.deleteTransaction(id).pipe(takeUntil(this.destroy$)).subscribe((result) => {
      this.notificationService.success("Successfully Deleted Transaction");
      this.gettransaction();
    });
  }

  openTransaction(): void {
    const dialogRef = this.dialog.open(TransactionReportComponent, {
      panelClass: ['dialog-modern-wrapper', 'dialog-lg'],
      disableClose: true,
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.gettransaction();
    });
  }

  openExcelPdfAtm() {
    const dialogRef = this.dialog.open(AtmTransactionPdfExcelComponent, {
      width: '70%',
      height: '70%',
      disableClose: true,
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.gettransaction();
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  searchData(): void {
    this.searchSubject.next(this.searchTerm);
  }

  executeSearch(searchTerm: string): void {
    const term = (searchTerm || '').toLowerCase().trim();
    if (!term) {
      this.transaction = [...this.originalTransaction];
      return;
    }

    this.transaction = this.originalTransaction.filter((item: any) =>
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.employeeName && item.employeeName.toLowerCase().includes(term)) ||
      (item.transaction && item.transaction.toLowerCase().includes(term)) ||
      (item.date && item.date.toLowerCase().includes(term))
    );
  }

  trackById(index: number, item: any): any {
    return item.id || index;
  }

  clearSearch() {
    this.searchTerm = '';
    this.transaction = [...this.originalTransaction];
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.transaction.sort((a, b) => {
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
