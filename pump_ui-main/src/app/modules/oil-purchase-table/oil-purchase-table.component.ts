import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_OIL_PURCHASE_LIST } from 'app/serviceult';
import { PuchasePdfExcelComponent } from '../table-list/puchase-pdf-excel/puchase-pdf-excel.component';
import { PurchaseReportComponent } from '../table-list/purchase-report/purchase-report.component';
import { OilPuchasePdfExcelComponent } from './oil-puchase-pdf-excel/oil-puchase-pdf-excel.component';

@Component({
  selector: 'app-oil-purchase-table',
  templateUrl: './oil-purchase-table.component.html',
  styleUrls: ['./oil-purchase-table.component.scss']
})
export class OilPurchaseTableComponent implements OnInit {

  isReload: boolean;
  oilProductList: any = [];
  tableData: any[] = [];
  searchTerm: string = '';
  compD: any;
  dataSource: any[] | undefined;
  currentPage = 1;
  itemsPerPage = 2;
  userId: string;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog, private notificationService: NotificationService) {
  }

  role: string = '';

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.getdata();
    this.dataSource = [
    ];
  }

  getdata() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_OIL_PURCHASE_LIST, { params }).subscribe((data) => {
      this.oilProductList = data;
    });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.oilProductList.filter = filterValue;
  }


  search(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.oilProductList = this.oilProductList.filter((item: any) => {
      const formattedDate = formatDate(item.date, 'dd-MM-yyyy', 'en-US');
      return (
        formattedDate.includes(term) ||
        item.type?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term)
      );
    });

    if (!term) {
      this.oilProductList = [...this.oilProductList];
    }
  }


  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  openExcelPdf() {
    const dialogRef = this.dialog.open(OilPuchasePdfExcelComponent, {
      width: '70%',
      height: '70%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }

  deleteRow(id: any) {
    this.use.deleteOilPurchasedata(id).subscribe((result) => {
      this.oilProductList = result;
      this.notificationService.success('Oil Product deleted successfully');
      this.getdata();
    });
  }


  searchData(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.getdata();
      return;
    }
    this.oilProductList = this.oilProductList.filter((item: any) =>
      (item.type && item.type.toLowerCase().includes(term)) ||
      (item.date && item.date.toLowerCase().includes(term))
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.getdata();
  }


  sortBy(column: string) {
    if (this.sortColumn === column) {
      // toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.oilProductList.sort((a, b) => {
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
