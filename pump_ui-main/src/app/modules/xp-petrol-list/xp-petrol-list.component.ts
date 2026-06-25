import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_PETROL_LIST, API_XP_PETROL_LIST } from 'app/serviceult';
import { EditPetrolsellComponent } from '../typography/edit-petrolsell/edit-petrolsell.component';
import { PetrolSellPdfExcelComponent } from '../typography/petrol-sell-pdf-excel/petrol-sell-pdf-excel.component';
import { PetrolSellReportComponent } from '../typography/petrol-sell-report/petrol-sell-report.component';
import { AddXpPetrolComponent } from './add-xp-petrol/add-xp-petrol.component';
import { EditXpPetrolComponent } from './edit-xp-petrol/edit-xp-petrol.component';
import { XpPetrolPdfExcelComponent } from './xp-petrol-pdf-excel/xp-petrol-pdf-excel.component';

@Component({
  selector: 'app-xp-petrol-list',
  templateUrl: './xp-petrol-list.component.html',
  styleUrls: ['./xp-petrol-list.component.scss']
})
export class XpPetrolListComponent implements OnInit {

 
  xpPetrolList: any = [];
  tableData: any[] = [];
  searchTerm: string = '';
  compD: any;
  dataSource: any[] | undefined; 
  currentPage = 1; 
  itemsPerPage = 10; 
  userId: string;
  sortColumn: string = '';
sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,private notificationService:NotificationService
  ) {
  }

  role: string = '';

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.getxpData();
    this.dataSource = [
    ];
  }

  getxpData() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_XP_PETROL_LIST, { params }).subscribe((data) => {
      this.xpPetrolList = data;
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(AddXpPetrolComponent, {
      panelClass: 'dialog-lg',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getxpData();
    });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.xpPetrolList.filter = filterValue;
  }


  search(): void {
    this.xpPetrolList = this.xpPetrolList.filter((item: { email: string }) =>
      item.email.toLowerCase().includes(this.searchTerm.toLowerCase().trim())
    );
    if (this.searchTerm.toLowerCase() === '') {
    }
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  deleteRow(id: any) {
    this.use.deleteXPPetroldataid(id).subscribe((result) => {
      this.xpPetrolList = result;
    this.notificationService.success('XP_Petrol deleted successfully');
    this.getxpData();
    });
  }

  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(EditXpPetrolComponent, {
      panelClass: 'dialog-md',
      data: item,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.isReload) {
        this.getxpData(); // or any method that reloads your data
      }
    });
  }

  openExcelPdf() {
    const dialogRef = this.dialog.open(XpPetrolPdfExcelComponent, {
      panelClass: 'dialog-lg',
      disableClose: true,
    });

    // Subscribe to the afterClosed event to handle any actions after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      this.getxpData();
    });
  }

    searchData(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.getxpData();
      return;
    }             
  
    this.xpPetrolList = this.xpPetrolList.filter((item: any) =>
      (item.pump && item.pump.toLowerCase().includes(term)) ||
      (item.date && item.date.toLowerCase().includes(term))
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.getxpData();
  }

  sortBy(column: string) {
  if (this.sortColumn === column) {
    // toggle direction
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  this.xpPetrolList.sort((a, b) => {
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
