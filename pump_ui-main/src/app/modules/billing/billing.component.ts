import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_CUSTOMER_NAME, API_OILSELL_LIST, API_OILSELL_LIST_REPORT } from 'app/serviceult';
import { BillComponent } from './dailog/bill/bill.component';
import { OillBillComponent } from './dailog/oill-bill/oill-bill.component';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  userId: string = localStorage.getItem('userId') || '';
  PumpName: string = '';
  xp_petrol_nozzle: number = 0;
  powe_diesel_nozzle: number = 0;
  billDate: string = '';
  oillDate: string = '';
  customers: any[] = [];
  petrolTypeList: string[] = ['Petrol', 'Diesel', 'XP Petrol', 'Power Diesel'];
  selectedCustomer: any = null;
  selectedOilCustomer: any = null;
  OilsellList: any[] = [];
  billRows: any[] = [];
  oilRows: any[] = [];

  constructor(
    private dialog: MatDialog,
    private use: UserServiceService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getUserName();
    this.getCustomer();
    this.getOilSell();
    this.billRows = [{ ltr: '', rate: '', fuel: '' }];
    this.oilRows = [{ oiltype: '', rate: '', amount: '', note: '' }];
  }

  getUserName() {
    this.use.getUserNameAndNozzle(this.userId).subscribe(data => {
      this.PumpName = data.data.firstName;
      this.xp_petrol_nozzle = Number(data.data.xp_petrol_nozzle);
      this.powe_diesel_nozzle = Number(data.data.powe_diesel_nozzle);
    });
  }

  getCustomer() {
    const url = `${API_CUSTOMER_NAME}?userId=${this.userId}`;
    this.http.get<any>(url).subscribe(data => {
      this.customers = Object.values(data);
    });
  }

  getOilSell() {
    const params = { userId: this.userId };
    this.http.get<any>(API_OILSELL_LIST_REPORT, { params }).subscribe(data => {
      this.OilsellList = data;
    });
  }

  addRow() {
    this.billRows.push({ ltr: '', rate: '', fuel: '' });
  }

  deleteRow(index: number) {
    if (this.billRows.length > 1) {
      this.billRows.splice(index, 1);
    }
  }

  addRowOil() {
    this.oilRows.push({ oiltype: '', amount: '', note: '' });
  }

  deleteRowOil(index: number) {
    if (this.oilRows.length > 1) {
      this.oilRows.splice(index, 1);
    }
  }

  getGrandTotal(): number {
    return this.billRows.reduce((sum, row) => sum + ((row.ltr || 0) * (row.rate || 0)), 0);
  }

  printBill() {
    if (!this.selectedCustomer) {
      this.notificationService.failure('Please select a customer');
      return;
    }

    const billData = {
      date: this.billDate,
      customer: this.selectedCustomer,
      PumpName: this.PumpName,
      items: this.billRows.map(row => ({
        type: row.fuel,
        ltr: row.ltr,
        rate: row.rate,
        total: (row.ltr || 0) * (row.rate || 0)
      })),
      totalAmount: this.getGrandTotal()
    };

    this.dialog.open(BillComponent, {
      width: window.innerWidth > 991 ? '720px' : '98vw',
      maxWidth: '98vw',
      panelClass: 'dialog-modern-wrapper',
      data: billData
    });
  }

  printOillBill() {
    if (!this.selectedOilCustomer) {
      this.notificationService.failure('Please select a customer');
      return;
    }
    const oilTypeList = this.oilRows
      .map(row => row.oiltype.oilSellList)
      .join(', ');
    const note = this.oilRows
      .map(row => row.note)
      .join(', ');

    const totalAmount = this.oilRows
      .reduce((sum, row) => sum + Number(row.amount), 0);
    const billoillData = {
      date: this.oillDate,
      customer: this.selectedOilCustomer,
      PumpName: this.PumpName,
      oilType: oilTypeList,
      price: totalAmount,
      note: note
    };

    this.dialog.open(OillBillComponent, {
      width: window.innerWidth > 991 ? '720px' : '98vw',
      maxWidth: '98vw',
      panelClass: 'dialog-modern-wrapper',
      data: billoillData
    });
  }

}