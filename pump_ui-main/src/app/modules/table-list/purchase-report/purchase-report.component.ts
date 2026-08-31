import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { API_PURCHASE_ADD, API_PURCHASE_LIST } from 'app/serviceult';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

export interface PurchaseRow {
  id?: any;
  type: string;
  quantity: any;
  total: any;
  vat: any;
  cess: any;
  total_purchase: any;
  jtcpercentage: any;
  date: string;
  userId: string;
}

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent implements OnInit {

  isReload: boolean = false;
  userId = localStorage.getItem('userId');
  purchaDipStockseDetails = {
    date: ''
  };

  row: PurchaseRow[] = [
    {
      id: this.purchase?.id,
      type: 'Petrol',
      quantity: '',
      total: '',
      vat: '',
      cess: '',
      total_purchase: '',
      jtcpercentage: '',
      date: '',
      userId: this.userId
    },
    {
      id: this.purchase?.id,
      type: 'Diesel',
      quantity: '',
      total: '',
      vat: '',
      cess: '',
      total_purchase: '',
      jtcpercentage: "",
      date: '',
      userId: this.userId
    }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    @Inject(MAT_DIALOG_DATA) public purchase: any,
    public dialogRef: MatDialogRef<PurchaseReportComponent>,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.use.dialogZIndexAdjustment();
    if (this.purchase && this.purchase.date) {
      this.purchaDipStockseDetails.date = this.purchase.date;
    } else {
      const today = new Date().toISOString().split('T')[0];
      this.purchaDipStockseDetails.date = today;
    }
    this.getPurchaseReport();
  }

  updateDate() {
    if (this.row) {
      this.row.forEach(row => {
        row.date = this.purchaDipStockseDetails.date;
      });
    }
    if (this.purchase) {
      this.purchase.date = this.purchaDipStockseDetails.date;
    }
    this.getPurchaseReport();
  }

  calculateRow(item: any) {
    const total = Number(item.total) || 0;
    const vat = Number(item.vat) || 0;
    const cess = Number(item.cess) || 0;
    item.total_purchase = parseFloat((total + vat + cess).toFixed(2));
  }

  addTable() {
    this.row.push({
      id: this.purchase?.id,
      type: '',
      quantity: '',
      total: '',
      vat: '',
      cess: '',
      total_purchase: '',
      jtcpercentage: '',
      date: this.purchaDipStockseDetails.date || '',
      userId: this.userId
    });
  }

  deleteRow(index: number) {
    this.row.splice(index, 1);
    this.notificationService.success('Purchase Data Succefully Delete.');
  }

  totalPrice(): number {
    const total = this.row.reduce(
      (acc, item) => acc + (Number(item.total_purchase) || 0),
      0
    );
    return parseFloat(total.toFixed(2));
  }

  validateData(): boolean {
    if (!this.purchaDipStockseDetails.date) {
      this.notificationService.failure('Date is required.');
      return false;
    }
    for (let item of this.row) {
      item.quantity = item.quantity === null || item.quantity === '' ? 0 : Number(item.quantity);
      item.total = item.total === null || item.total === '' ? 0 : Number(item.total);
      item.vat = item.vat === null || item.vat === '' ? 0 : Number(item.vat);
      item.cess = item.cess === null || item.cess === '' ? 0 : Number(item.cess);
      item.jtcpercentage = item.jtcpercentage === null || item.jtcpercentage === '' ? 0 : Number(item.jtcpercentage);
      item.total_purchase = item.total_purchase === null || item.total_purchase === '' ? 0 : Number(item.total_purchase);
      if (
        isNaN(item.quantity) ||
        isNaN(item.total) ||
        isNaN(item.vat) ||
        isNaN(item.cess) ||
        isNaN(item.jtcpercentage) ||
        isNaN(item.total_purchase)
      ) {
        this.notificationService.failure('All numeric fields must contain valid numbers.');
        return false;
      }
      if (!item.type) {
        this.notificationService.failure('Type field is required.');
        return false;
      }
    }

    return true;
  }

  order() {
    if (!this.validateData()) {
      return;
    }
    this.row.forEach(row => {
      row.date = this.purchaDipStockseDetails.date;
    });

    this.http.post<any>(API_PURCHASE_ADD, this.row)
      .subscribe(response => {
        this.notificationService.success("Purchase data Succefully Add");
        this.isReload = true;
        this.dialogRef.close({ 'isReload': true });
      }, error => {
        this.notificationService.failure("Error saving purchase data");
      });
  }

  isNumber(value: any): boolean {
    return !isNaN(value) && value !== '';
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  getPurchaseReport() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    const selectedDate = this.purchaDipStockseDetails.date || this.purchase?.date;

    this.http.get<any[]>(API_PURCHASE_LIST, { params }).subscribe((data: any[]) => {
      let filteredData: any[] = [];

      if (selectedDate) {
        filteredData = data.filter(
          (item) => new Date(item.date).toDateString() === new Date(selectedDate).toDateString()
        );
      } else {
        filteredData = data;
      }

      const petrolRow = filteredData.find(item => item.type === 'Petrol') || {
        id: this.purchase?.id,
        type: 'Petrol',
        quantity: '',
        total: '',
        vat: '',
        cess: '',
        jtcpercentage: '',
        total_purchase: '',
        date: selectedDate || '',
        userId: this.userId
      };

      const dieselRow = filteredData.find(item => item.type === 'Diesel') || {
        id: this.purchase?.id,
        type: 'Diesel',
        quantity: '',
        total: '',
        vat: '',
        cess: '',
        jtcpercentage: '',
        total_purchase: '',
        date: selectedDate || '',
        userId: this.userId
      };

      this.row = [petrolRow, dieselRow, ...filteredData.filter(item => item.type !== 'Petrol' && item.type !== 'Diesel')];
      this.row.forEach(r => {
        if (r.total !== null && r.total !== undefined && r.total !== '') {
          r.total = parseFloat(Number(r.total).toFixed(2));
        }
        if (r.vat !== null && r.vat !== undefined && r.vat !== '') {
          r.vat = parseFloat(Number(r.vat).toFixed(2));
        }
        if (r.cess !== null && r.cess !== undefined && r.cess !== '') {
          r.cess = parseFloat(Number(r.cess).toFixed(2));
        }
        if (r.total_purchase !== null && r.total_purchase !== undefined && r.total_purchase !== '') {
          r.total_purchase = parseFloat(Number(r.total_purchase).toFixed(2));
        } else if (r.total || r.vat || r.cess) {
          this.calculateRow(r);
        }
      });
    });
  }

}
