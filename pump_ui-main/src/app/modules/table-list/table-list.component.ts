import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_PURCHASE_LIST } from 'app/serviceult';
import { EditPurchaseComponent } from './edit-purchase/edit-purchase.component';
import { PuchasePdfExcelComponent } from './puchase-pdf-excel/puchase-pdf-excel.component';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit, OnDestroy {
  isReload: boolean;
  productList: any = [];
  originalProductList: any = [];
  tableData: any[] = [];
  searchTerm: string = '';
  compD: any;
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
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.getdata();

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

  getdata() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_PURCHASE_LIST, { params }).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      const raw = data || [];
      this.originalProductList = raw.map((item: any) => {
        let emp = item.username || item.employeeName || '';
        if (emp.includes(' ')) {
          const parts = emp.trim().split(/\s+/);
          emp = item.username || parts[parts.length - 1];
        }
        return {
          ...item,
          employeeName: emp || 'N/A'
        };
      });
      this.productList = [...this.originalProductList];
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PurchaseReportComponent, {
      width: '60%',
      height: '81%',
      disableClose: true,
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.getdata();
    });
  }

  searchData(): void {
    this.searchSubject.next(this.searchTerm);
  }

  executeSearch(searchTerm: string): void {
    const term = (searchTerm || '').toLowerCase().trim();
    if (!term) {
      this.productList = [...this.originalProductList];
      return;
    }
    this.productList = this.originalProductList.filter((item: any) =>
      (item.type && item.type.toLowerCase().includes(term)) ||
      (item.employeeName && item.employeeName.toLowerCase().includes(term)) ||
      (item.date && item.date.toLowerCase().includes(term))
    );
  }

  trackById(index: number, item: any): any {
    return item.idpurchase || item.id || index;
  }

  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(EditPurchaseComponent, {
      height: '80%',
      data: item,
      disableClose: true,
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result?.isReload) {
        this.getdata();
      }
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  openExcelPdf() {
    const dialogRef = this.dialog.open(PuchasePdfExcelComponent, {
      width: '70%',
      height: '70%',
      disableClose: true,
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.getdata();
    });
  }

  deleteRow(id: any) {
    this.use.deletePurchasedata(id).pipe(takeUntil(this.destroy$)).subscribe((result) => {
      this.notificationService.success('Product deleted successfully');
      this.getdata();
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.productList = [...this.originalProductList];
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.productList.sort((a, b) => {
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
