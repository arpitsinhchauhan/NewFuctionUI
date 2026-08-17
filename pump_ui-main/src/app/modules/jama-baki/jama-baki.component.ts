import { HttpClient } from "@angular/common/http";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from "app/services/notification.service";
import { UserServiceService } from "app/services/user-service.service";
import { API_JAMABAKI_LIST } from "app/serviceult";
import { CustomerComponent } from "./customer/customer.component";
import { EditjamabakiComponent } from "./editjamabaki/editjamabaki.component";
import { JamaBakiReportComponent } from "./jama-baki-report/jama-baki-report.component";
import { JamabakiPdfExcelComponent } from "./jamabaki-pdf-excel/jamabaki-pdf-excel.component";
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-jama-baki",
  templateUrl: "./jama-baki.component.html",
  styleUrls: ["./jama-baki.component.css"],
})
export class JamaBakiComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  jamabakiList: any = [];
  originalJamabakiList: any = [];
  currentPage = 1;
  itemsPerPage = 4;
  searchText: string = "";
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
    this.getJamaBakiList();

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

  getJamaBakiList() {
    this.userId = localStorage.getItem("userId");
    const params = { userId: this.userId };
    this.http.get(API_JAMABAKI_LIST, { params }).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.originalJamabakiList = data || [];
      this.jamabakiList = [...this.originalJamabakiList];
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  deleteRow(id: any) {
    this.use.deletejamabakidata(id).pipe(takeUntil(this.destroy$)).subscribe((result) => {
      this.notificationService.success("JamaBakidata deleted successfully");
      this.getJamaBakiList();
    });
  }

  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(EditjamabakiComponent, {
      width: window.innerWidth > 991 ? '800px' : '95vw',
      maxWidth: '95vw',
      data: item,
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dialog-modern-wrapper'
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
      this.getJamaBakiList();
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(CustomerComponent, {
      width: window.innerWidth > 991 ? 'auto' : '95vw',
      maxWidth: '95vw',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dialog-modern-wrapper'
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
      this.getJamaBakiList();
    });
  }

  openJamaBaki() {
    const dialogRef = this.dialog.open(JamaBakiReportComponent, {
      width: window.innerWidth > 991 ? '1200px' : '98vw',
      maxWidth: '98vw',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dialog-modern-wrapper'
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
      this.getJamaBakiList();
    });
  }

  searchData(): void {
    this.searchSubject.next(this.searchTerm);
  }

  executeSearch(searchTerm: string): void {
    const term = (searchTerm || '').toLowerCase().trim();
    if (!term) {
      this.jamabakiList = [...this.originalJamabakiList];
      return;
    }

    this.jamabakiList = this.originalJamabakiList.filter((item: any) =>
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.employeeName && item.employeeName.toLowerCase().includes(term)) ||
      (item.jamaNote && item.jamaNote.toLowerCase().includes(term)) ||
      (item.bakiNote && item.bakiNote.toLowerCase().includes(term)) ||
      (item.date && item.date.toLowerCase().includes(term))
    );
  }

  trackById(index: number, item: any): any {
    return item.idjamabaki || item.id || index;
  }

  clearSearch() {
    this.searchTerm = '';
    this.jamabakiList = [...this.originalJamabakiList];
  }

  openJamaBakiPdfExcel() {
    const dialogRef = this.dialog.open(JamabakiPdfExcelComponent, {
      width: window.innerWidth > 991 ? '1000px' : '95vw',
      maxWidth: '95vw',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dialog-modern-wrapper'
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
      this.getJamaBakiList();
    });
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.jamabakiList.sort((a, b) => {
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
