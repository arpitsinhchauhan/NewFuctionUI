import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from "app/services/notification.service";
import { UserServiceService } from "app/services/user-service.service";
import { API_PD_DIP_LIST } from "app/serviceult";
import { DipStockReportComponent } from "./dip-stock-report/dip-stock-report.component";

@Component({
  selector: "app-dip-stock",
  templateUrl: "./dip-stock.component.html",
  styleUrls: ["./dip-stock.component.css"],
})
export class DipStockComponent implements OnInit {
  // productList: Map<String, String> | undefined;
  productList: any = [];
  tableData: any[] = [];
  searchTerm: string = "";
  compD: any;
  dataSource: any[] | undefined; // Your data source array
  currentPage = 1; // Current page index
  itemsPerPage = 4; // Number of items per page
  userId: string;
  petroldip: number;
  pvalue: number;
  dieseldip: number;
  dvalue: number;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  // Product | undefined;
  // { id: any; Email: any; Phone: any } | undefined
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
    this.getdata();
    this.dataSource = [
      /* Your data goes here */
    ];
  }

  getdata() {
    this.userId = localStorage.getItem("userId");
    const params = { userId: this.userId };
    this.http.get(API_PD_DIP_LIST, { params }).subscribe((data: any) => {
      const raw = data || [];
      this.productList = raw.map((item: any) => {
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
    const dialogRef = this.dialog.open(DipStockReportComponent, {
      panelClass: ['dialog-modern-wrapper', 'dialog-md'],
      disableClose: true,
      data: {
        type: "add",
        date: this.use.getFormattedDate(new Date()),
        userId: this.userId || localStorage.getItem('userId'),
        petroldip: this.petroldip || null,
        pvalue: this.pvalue || null,
        dieseldip: this.dieseldip || null,
        dvalue: this.dvalue || null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getdata();
    });
  }
  deleteRow(id: any) {
    this.use.deletedipdata(id).subscribe((result) => {
      this.notificationService.success("Dipdata deleted successfully");
      this.productList = result;
      this.getdata();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.productList.filter = filterValue;
  }

  search(): void {
    this.productList = this.productList.filter((item: { email: string }) =>
      item.email.toLowerCase().includes(this.searchTerm.toLowerCase().trim())
    );
    if (this.searchTerm.toLowerCase() === "") {
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

  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(DipStockReportComponent, {
      panelClass: ['dialog-modern-wrapper', 'dialog-md'],
      data: item,
      disableClose: true,
    });

    // Subscribe to the afterClosed event to handle any actions after the dialog is closed
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.isReload) {
        this.getdata(); // or any method that reloads your data
      }
    });
  }

  searchData(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.getdata();
      return;
    }

    this.productList = this.productList.filter(
      (item: any) => item.date && item.date.toLowerCase().includes(term)
    );
  }

  clearSearch() {
    this.searchTerm = "";
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
