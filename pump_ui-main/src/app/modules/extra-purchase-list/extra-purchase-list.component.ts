import { Component, OnInit } from '@angular/core';
import { API_EXTRA_PURCHASE_LIST } from 'app/serviceult';
import { AddExtraPurchaseComponent } from './add-extra-purchase/add-extra-purchase.component';
import { EditExtraPurchaseComponent } from './edit-extra-purchase/edit-extra-purchase.component';
import { ExtraPurchasePdfExcelComponent } from './extra-purchase-pdf-excel/extra-purchase-pdf-excel.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-extra-purchase-list',
  templateUrl: './extra-purchase-list.component.html',
  styleUrls: ['./extra-purchase-list.component.scss']
})
export class ExtraPurchaseListComponent implements OnInit {

  isReload: boolean;
  extraPurchaseList: any = [];
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
    this.getExtraPurchase();
    this.dataSource = [
    ];
  }
  getExtraPurchase() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_EXTRA_PURCHASE_LIST, { params }).subscribe((data: any) => {
      const raw = data || [];
      this.extraPurchaseList = raw.map((item: any) => {
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
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(AddExtraPurchaseComponent, {
      width: '60%',
      height: '81%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getExtraPurchase();
    });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.extraPurchaseList.filter = filterValue;
  }


  search(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.extraPurchaseList = this.extraPurchaseList.filter((item: any) => {
      // convert item's date to dd-MM-yyyy string
      const formattedDate = formatDate(item.date, 'dd-MM-yyyy', 'en-US');

      return (
        formattedDate.includes(term) ||
        item.type?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term)
      );
    });

    if (!term) {
      this.extraPurchaseList = [...this.extraPurchaseList];
    }
  }

  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(EditExtraPurchaseComponent, {
      width: '50%',
      height: '70%',
      data: item,
      disableClose: true,
    });

    // Subscribe to the afterClosed event to handle any actions after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      if (result?.isReload) {
        this.getExtraPurchase(); // or any method that reloads your data
      }
    });
  }


  // Method to change the current page
  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  openExcelPdf() {
    const dialogRef = this.dialog.open(ExtraPurchasePdfExcelComponent, {
      width: '70%',
      height: '100%',
      disableClose: true,
    });

    // Subscribe to the afterClosed event to handle any actions after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      this.getExtraPurchase();
    });
  }

  deleteRow(id: any) {
    this.use.deleteExtraPurchasedata(id).subscribe((result) => {
      this.extraPurchaseList = result;
      this.notificationService.success('Extra Product deleted successfully');
      this.getExtraPurchase();
    });
  }


  searchData(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.getExtraPurchase();
      return;
    }

    this.extraPurchaseList = this.extraPurchaseList.filter((item: any) =>
      (item.type && item.type.toLowerCase().includes(term)) ||
      (item.date && item.date.toLowerCase().includes(term))
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.getExtraPurchase();
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      // toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.extraPurchaseList.sort((a, b) => {
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

