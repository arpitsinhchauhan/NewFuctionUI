import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { API_PETROL_LIST } from 'app/serviceult';
import { EditPetrolsellComponent } from './edit-petrolsell/edit-petrolsell.component';
import { PetrolSellPdfExcelComponent } from './petrol-sell-pdf-excel/petrol-sell-pdf-excel.component';
import { PetrolSellReportComponent } from './petrol-sell-report/petrol-sell-report.component';
import { NotificationService } from 'app/services/notification.service';
import { secretmanager } from 'googleapis/build/src/apis/secretmanager';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {

  // productList: Map<String, String> | undefined;
  productList: any = [];
  tableData: any[] = [];
  searchTerm: string = '';
  compD: any;
  dataSource: any[] | undefined; // Your data source array
  currentPage = 1; // Current page index
  itemsPerPage = 10; // Number of items per page
  userId: string;
sortColumn: string = '';
sortDirection: 'asc' | 'desc' = 'asc';


  // Product | undefined;
  // { id: any; Email: any; Phone: any } | undefined
  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,private notificationService:NotificationService
  ) {
    // this.compD = data;
  }

  role: string = '';

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.getdata();
    this.dataSource = [
      /* Your data goes here */
    ];
  }

  getdata() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_PETROL_LIST, { params }).subscribe((data) => {
      this.productList = data;
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(PetrolSellReportComponent, {
      panelClass: 'dialog-lg',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }
  // deleteRow(id: number) {
  //   // alert('Product deleted successfully');
  //   this.use.deleteMember(id).subscribe((result) => {
  //     this.productList = result;
  //     this.notificationService.showNotification('Product deleted successfully');
  //   });
  //   this.dialogRef.close({ 'isReload': this.isReload });
  // }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.productList.filter = filterValue;
  }


  search(): void {
    this.productList = this.productList.filter((item: { email: string }) =>
      item.email.toLowerCase().includes(this.searchTerm.toLowerCase().trim())
    );
    if (this.searchTerm.toLowerCase() === '') {
      location.reload();
    }
  }

  // update(id: any) {
  //   this.http.get(this.apiUrl).subscribe((data) => {


  //     let dialogRef = this.dialog.open(UserEditComponent, {
  //       width: '500px',
  //       height: '400px',
  //       data: {
  //         data: id,// Pass the data to the dialog
  //       }
  //     });

  //     dialogRef.afterClosed().subscribe(result => {
  //       // Handle the result returned from the dialog here
  //       ('Dialog result:', result);
  //     });
  //   });

  // }


  // Method to change the current page
  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  deleteRow(id: any) {
    this.use.deletePetroldata(id).subscribe((result) => {
      this.productList = result;
    this.notificationService.success('PetrolData deleted successfully');
    this.getdata();
    });
  }

  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(EditPetrolsellComponent, {
      panelClass: 'dialog-md',
      data: item,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.isReload) {
        this.getdata(); // or any method that reloads your data
      }
    });
  }

  openExcelPdf() {
    const dialogRef = this.dialog.open(PetrolSellPdfExcelComponent, {
      width: '70%',
      height: '70%',
      disableClose: true,
    });

    // Subscribe to the afterClosed event to handle any actions after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }

    searchData(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.getdata();
      return;
    }             
  
    this.productList = this.productList.filter((item: any) =>
      (item.pump && item.pump.toLowerCase().includes(term)) ||
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
