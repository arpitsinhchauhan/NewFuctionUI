import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_POWER_DIESEL_LIST } from 'app/serviceult';
import { AddpowerDieselComponent } from './addpower-diesel/addpower-diesel.component';
import { PowerDieselPdfExcelComponent } from './power-diesel-pdf-excel/power-diesel-pdf-excel.component';
import { EditpowerDieselComponent } from './editpower-diesel/editpower-diesel.component';

@Component({
  selector: 'app-power-diesellist',
  templateUrl: './power-diesellist.component.html',
  styleUrls: ['./power-diesellist.component.scss']
})
export class PowerDiesellistComponent implements OnInit {

  powerDieselList: any = [];
  tableData: any[] = [];
  searchTerm: string = '';
  compD: any;
  dataSource: any[] | undefined; // Your data source array
  currentPage = 1; // Current page index
  itemsPerPage = 10; // Number of items per page
  userId: string;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {
    // this.compD = data;
  }

  role: string = '';

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.getpowerDiesel();
    this.dataSource = [
    ];
  }

  getpowerDiesel() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_POWER_DIESEL_LIST, { params }).subscribe((data: any) => {
      const raw = data || [];
      this.powerDieselList = raw.map((item: any) => {
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
    const dialogRef = this.dialog.open(AddpowerDieselComponent, {
      width: '60%',
      height: '81%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getpowerDiesel();
    });
  }
  deleteRow(id: any) {
    this.notificationService.success('Power_Diesel deleted successfully');
    this.use.deletepowerDieselid(id).subscribe((result) => {
      this.powerDieselList = result;
      this.getpowerDiesel();
    });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.powerDieselList.filter = filterValue;
  }


  search(): void {
    this.powerDieselList = this.powerDieselList.filter((item: { email: string }) =>
      item.email.toLowerCase().includes(this.searchTerm.toLowerCase().trim())
    );
    if (this.searchTerm.toLowerCase() === '') {
      location.reload();
    }
  }

  openExcelPdf() {
    const dialogRef = this.dialog.open(PowerDieselPdfExcelComponent, {
      width: '70%',
      height: '70%',
      disableClose: true,
    });

    // Subscribe to the afterClosed event to handle any actions after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      this.getpowerDiesel();
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(EditpowerDieselComponent, {
      width: '50%',
      height: '60%',
      data: item,
      disableClose: true,
    });

    // Subscribe to the afterClosed event to handle any actions after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      if (result?.isReload) {
        this.getpowerDiesel(); // or any method that reloads your data
      }
    });
  }

  searchData(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.getpowerDiesel();
      return;
    }

    this.powerDieselList = this.powerDieselList.filter((item: any) =>
      (item.pump && item.pump.toLowerCase().includes(term)) ||
      (item.date && item.date.toLowerCase().includes(term))
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.getpowerDiesel();
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      // toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.powerDieselList.sort((a, b) => {
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