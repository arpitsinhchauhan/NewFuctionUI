import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_OILSELL_LIST } from 'app/serviceult';
import { OilReportComponent } from './oil-report/oil-report.component';
import { OilSellPdfExcelComponent } from './oil-sell-pdf-excel/oil-sell-pdf-excel.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {
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
        this.http.get(API_OILSELL_LIST, { params }).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
            this.originalProductList = data || [];
            this.productList = [...this.originalProductList];
        });
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(OilReportComponent, {
            panelClass: ['dialog-modern-wrapper', 'dialog-xl'],
            disableClose: true,
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
            this.getdata();
        });
    }

    deleteRow(id_oil_sell: any) {
        this.use.deleteOildata(id_oil_sell).pipe(takeUntil(this.destroy$)).subscribe((result) => {
            this.notificationService.success('Oildata deleted successfully');
            this.getdata();
        });
    }

    pageChanged(event: any): void {
        this.currentPage = event.page;
    }

    openEditDialog(item: any): void {
        const dialogRef = this.dialog.open(OilReportComponent, {
            panelClass: ['dialog-modern-wrapper', 'dialog-xl'],
            data: item,
            disableClose: true,
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
            this.getdata();
        });
    }

    openExcelPdf() {
        const dialogRef = this.dialog.open(OilSellPdfExcelComponent, {
            width: '50%',
            height: '60%',
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
            (item.value && item.value.toLowerCase().includes(term)) ||
            (item.employeeName && item.employeeName.toLowerCase().includes(term)) ||
            (item.date && item.date.toLowerCase().includes(term))
        );
    }

    trackById(index: number, item: any): any {
        return item.id_oil_sell || item.id || index;
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
