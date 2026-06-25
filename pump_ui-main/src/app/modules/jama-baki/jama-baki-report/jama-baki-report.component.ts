import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { API_CUSTOMER_NAME, API_JAMABAKI_ADD, API_JAMABAKI_DELETE, API_JAMABAKI_LIST } from 'app/serviceult';
import { CustomerComponent } from '../customer/customer.component';
import { UserServiceService } from 'app/services/user-service.service';
import { BillComponent } from 'app/modules/billing/dailog/bill/bill.component';

@Component({
  selector: 'app-jama-baki-report',
  templateUrl: './jama-baki-report.component.html',
  styleUrls: ['./jama-baki-report.component.css']
})
export class JamaBakiReportComponent implements OnInit {

  selectedDate!: Date | null;
  receiverSearch: string = '';
  isReload: boolean;
  purchaDipStockseDetails: any = {
    date: ''
  };
  row: any[] = [];
  lastRowId: number = 0;
  names: any[] = [];
  purchaseDetails: any = {
    date: ''
  };
  PumpName: string = '';
  userId: string;
  filteredNames: Object;
  petrolTypeList: string[] = ['Petrol', 'Diesel', 'XP Petrol', 'Power Diesel'];

  constructor(private http: HttpClient, private use: UserServiceService,
    public dialogRef: MatDialogRef<JamaBakiReportComponent>, @Inject(MAT_DIALOG_DATA) public jamaBaki: any,
    private notificationService: NotificationService, private dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.use.dialogZIndexAdjustment();
    this.getdata();
    this.getUserName();
  }

  getdata() {
    if (this.jamaBaki && this.jamaBaki.date) {
      this.purchaDipStockseDetails.date = this.jamaBaki.date;
    }

    this.userId = localStorage.getItem('userId');
    const url = `${API_CUSTOMER_NAME}?userId=${this.userId}`;

    this.http.get<any[]>(url).subscribe((data) => {
      this.names = data;
      this.filteredNames = this.names
      // [...this.names];
      this.getJamaBakiList();
    });
  }


  getUserName() {
    this.userId = localStorage.getItem('userId');
    this.use.getUserNameAndNozzle(this.userId).subscribe(data => {
      this.PumpName = data.data.firstName;
    });
  }

  onReceiverOpened() {
    this.receiverSearch = '';
    this.filteredNames = [...this.names];
  }

  filterReceivers() {
    const searchLower = this.receiverSearch.toLowerCase();
    this.filteredNames = this.names.filter(item =>
      item.name.toLowerCase().includes(searchLower)
    );
  }


  addTable() {
    if (this.purchaDipStockseDetails.date) {
      this.lastRowId++;
      this.userId = localStorage.getItem('userId');

      const newRow = {
        id: this.jamaBaki.id,
        date: this.purchaDipStockseDetails.date,
        customer: '',
        jama: 0,
        jamaNote: '',
        baki: 0,
        bakiNote: '',
        type: '',
        ltr: '',
        rate: '',
        userId: this.userId
      };
      this.row.push(newRow);
    } else {
      this.notificationService.failure('Please select a date before adding a new row.');
    }
  }

  totalJama() {
    return this.row.reduce((total, item) => total + parseFloat(item.jama || 0), 0).toFixed(2);
  }

  totalBaki() {
    return this.row.reduce((total, item) => total + parseFloat(item.baki || 0), 0).toFixed(2);
  }

  deleteRow(index: number) {
    const item = this.row[index];
    if (item.id) {
      this.http.delete(`${API_JAMABAKI_DELETE}/${item.id}`).subscribe({
        next: () => {
          this.notificationService.success("Row deleted successfully.");
          this.row.splice(index, 1);
        },
        error: () => {
          this.notificationService.failure("Failed to delete row from backend.");
        }
      });
    } else {
      this.row.splice(index, 1);
      this.notificationService.success("Row removed locally.");
    }
  }

  order() {
    this.userId = localStorage.getItem('userId');

    const payload = this.row.map(item => {
      const base = {
        id: item.id,
        name: item.customer?.name,
        customerId: item.customer?.id,
        date: this.jamaBaki.date,
        userId: this.userId
      };

      if (this.jamaBaki.type === 'jama') {
        return {
          ...base,
          jama: item.jama,
          jamaNote: item.jamaNote
        };
      } else {
        return {
          ...base,
          baki: item.baki,
          bakiNote: item.bakiNote,
          type: item.type,
          ltr: item.ltr,
          rate: item.rate
        };
      }
    });

    this.http.post<any>(API_JAMABAKI_ADD, payload).subscribe({
      next: () => {
        this.notificationService.success(`${this.jamaBaki.type === 'jama' ? 'Jama' : 'Baki'} details added successfully.`);
        this.dialogRef.close();
      },
      error: () => {
        this.notificationService.failure('Failed to save data. Please try again.');
      }
    });
  }


  displayCustomerName(customer: any): string {
    return customer?.name || '';
  }

  compareCustomers(c1: any, c2: any): boolean {
    if (c1 === c2) return true;
    if (!c1 || !c2) return false;
    const id1 = typeof c1 === 'object' ? c1.idcustomer : null;
    const id2 = typeof c2 === 'object' ? c2.idcustomer : null;
    const name1 = typeof c1 === 'object' ? c1.name : c1;
    const name2 = typeof c2 === 'object' ? c2.name : c2;
    if (id1 && id2 && id1 === id2) return true;
    if (name1 && name2 && name1.trim().toLowerCase() === name2.trim().toLowerCase()) return true;
    return false;
  }

  compareStrings(s1: any, s2: any): boolean {
    if (s1 === s2) return true;
    if (!s1 || !s2) return false;
    return s1.toString().trim().toLowerCase() === s2.toString().trim().toLowerCase();
  }


  AddCustomer() {
    const dialogRef = this.dialog.open(CustomerComponent, {
      width: window.innerWidth > 991 ? '600px' : '95vw',
      maxWidth: '95vw',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dialog-modern-wrapper'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  getJamaBakiList() {
    this.userId = localStorage.getItem("userId");
    const params = { userId: this.userId };
    this.http.get<any[]>(API_JAMABAKI_LIST, { params }).subscribe((data) => {
      let filteredData = data;
      if (this.jamaBaki?.date) {
        filteredData = filteredData.filter(
          (item) =>
            new Date(item.date).toDateString() ===
            new Date(this.jamaBaki.date).toDateString()
        );
      }
      if (this.jamaBaki?.type === "jama") {
        filteredData = filteredData.filter(
          (item) => item.jama !== null && item.jama !== undefined && item.jama !== 0
        );
      } else if (this.jamaBaki?.type === "baki") {
        filteredData = filteredData.filter(
          (item) => item.baki !== null && item.baki !== undefined && item.baki !== 0
        );
      }
      this.row = filteredData.map(item => {
        const matchedCustomer = this.names.find(c =>
          c.idcustomer === item.customer?.idcustomer ||
          c.idcustomer === item.customerId ||
          c.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
        );

        return {
          id: item.id,
          date: item.date,
          customer: matchedCustomer
            ? matchedCustomer
            : { idcustomer: null, name: item.name },
          jama: item.jama,
          jamaNote: item.jamaNote,
          baki: item.baki,
          bakiNote: item.bakiNote,
          type: item.type,
          ltr: item.ltr,
          rate: item.rate,
          userId: item.userId
        };
      });
      // console.log(this.row);
    });
  }

  calculateBaki(item: any) {
    const ltr = parseFloat(item.ltr) || 0;
    const rate = parseFloat(item.rate) || 0;
    item.baki = (ltr * rate).toFixed(2);
  }


  billBaki(selectedItem: any, index: number) {
    const billData = {
      date: selectedItem.date,
      customer: selectedItem.customer,
      PumpName: this.PumpName,
      items: [
        {
          type: selectedItem.type,
          ltr: selectedItem.ltr,
          rate: selectedItem.rate,
          total: parseFloat(selectedItem.ltr) * parseFloat(selectedItem.rate) || 0
        }
      ]
    };
    this.dialog.open(BillComponent, {
      width: window.innerWidth > 991 ? '720px' : '98vw',
      maxWidth: '98vw',
      panelClass: 'dialog-modern-wrapper',
      data: billData
    });
  }


}