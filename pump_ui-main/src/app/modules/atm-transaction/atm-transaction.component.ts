import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_ATMSELL_LIST } from 'app/serviceult';
import { AtmTransactionPdfExcelComponent } from './atm-transaction-pdf-excel/atm-transaction-pdf-excel.component';
import { TransactionReportComponent } from './transaction-report/transaction-report.component';

@Component({
  selector: 'app-atm-transaction',
  templateUrl: './atm-transaction.component.html',
  styleUrls: ['./atm-transaction.component.css']
})
export class AtmTransactionComponent implements OnInit {
  searchTerm: string = '';
  transaction: any = [];
  dataSource: any[] | undefined; // Your data source array
  currentPage = 1; // Current page index
  itemsPerPage = 4;
  userId: string;
  sortColumn: string = '';
sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService) { }

  role: string = '';

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.gettransaction();
  }


  gettransaction() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_ATMSELL_LIST, { params }).subscribe((data) => {
      this.transaction = data;
    });
  }
  deletetransaction(id: any) {
    // alert('Product deleted successfully');
    this.use.deleteTransaction(id).subscribe((result) => {
      this.transaction = result;
      this.notificationService.success("Succefully Delete Transaction");
      this.gettransaction();
    });
  }

  openTransaction(): void {
    const dialogRef = this.dialog.open(TransactionReportComponent, {
      panelClass: ['dialog-modern-wrapper', 'dialog-lg'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.gettransaction();
    });
  }
  openExcelPdfAtm() {
    const dialogRef = this.dialog.open(AtmTransactionPdfExcelComponent, {
      width: '70%',
      height: '70%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.gettransaction();
    });
  }
  pageChanged(event: any): void {
    this.currentPage = event.page;
  }
   
  searchData(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.gettransaction();
      return;
    }             
  
    this.transaction = this.transaction.filter((item: any) =>
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.date && item.date.toLowerCase().includes(term))
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.gettransaction();
  }
  
  sortBy(column: string) {
  if (this.sortColumn === column) {
    // toggle direction
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
