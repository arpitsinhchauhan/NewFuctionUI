import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_DIESEL_LIST } from 'app/serviceult';
import { DieselSellPdfExcelComponent } from './diesel-sell-pdf-excel/diesel-sell-pdf-excel.component';
import { DieselSellReportComponent } from './diesel-sell-report/diesel-sell-report.component';
import { EditDieselSellComponent } from './edit-diesel-sell/edit-diesel-sell.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit, OnDestroy {
  productList: any = [];
  originalProductList: any = [];
  tableData: any[] = [];
  searchTerm: string = '';
  compD: any;
  dataSource: any[] | undefined;
  currentPage = 1;
  itemsPerPage = 10;
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
    this.http.get(API_DIESEL_LIST, { params }).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
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
    const dialogRef = this.dialog.open(DieselSellReportComponent, {
      panelClass: 'dialog-lg',
      disableClose: true,
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.getdata();
    });
  }

  deleteRow(id: any) {
    this.use.deleteDieseldata(id).pipe(takeUntil(this.destroy$)).subscribe((result) => {
      this.notificationService.success('Diesel deleted successfully');
      this.getdata();
    });
  }

  openExcelPdf() {
    const dialogRef = this.dialog.open(DieselSellPdfExcelComponent, {
      width: '70%',
      height: '70%',
      disableClose: true,
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.getdata();
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(EditDieselSellComponent, {
      panelClass: 'dialog-md',
      data: item,
      disableClose: true,
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result?.isReload) {
        this.getdata();
      }
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
      (item.pump && item.pump.toLowerCase().includes(term)) ||
      (item.employeeName && item.employeeName.toLowerCase().includes(term)) ||
      (item.date && item.date.toLowerCase().includes(term))
    );
  }

  trackById(index: number, item: any): any {
    return item.iddiesel || item.id || index;
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