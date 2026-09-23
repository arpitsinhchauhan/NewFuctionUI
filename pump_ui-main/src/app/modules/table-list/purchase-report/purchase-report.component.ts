import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { API_PURCHASE_ADD, API_PURCHASE_LIST } from 'app/serviceult';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

export interface PurchaseRow {
  id?: any;
  type: string;
  skuNumber?: string;
  supplier?: string;
  invoiceNumber?: string;
  tankerNumber?: string;
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
  purchaseDate: string = '';

  petrolRows: PurchaseRow[] = [];
  dieselRows: PurchaseRow[] = [];

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
      this.purchaseDate = this.purchase.date;
    } else {
      this.purchaseDate = new Date().toISOString().split('T')[0];
    }
    this.getPurchaseReport();
  }

  createEmptyRow(type: string): PurchaseRow {
    return {
      id: null,
      type: type,
      skuNumber: '',
      supplier: '',
      invoiceNumber: '',
      tankerNumber: '',
      quantity: '',
      total: '',
      vat: '',
      cess: '',
      total_purchase: '',
      jtcpercentage: '',
      date: this.purchaseDate,
      userId: this.userId || ''
    };
  }

  updateDate(): void {
    this.petrolRows.forEach(r => r.date = this.purchaseDate);
    this.dieselRows.forEach(r => r.date = this.purchaseDate);
    if (this.purchase) {
      this.purchase.date = this.purchaseDate;
    }
    this.getPurchaseReport();
  }

  addPetrolPurchase(): void {
    this.petrolRows.push(this.createEmptyRow('Petrol'));
  }

  removePetrolPurchase(index: number): void {
    if (this.petrolRows.length > 1) {
      this.petrolRows.splice(index, 1);
    } else {
      this.petrolRows[0] = this.createEmptyRow('Petrol');
    }
  }

  addDieselPurchase(): void {
    this.dieselRows.push(this.createEmptyRow('Diesel'));
  }

  removeDieselPurchase(index: number): void {
    if (this.dieselRows.length > 1) {
      this.dieselRows.splice(index, 1);
    } else {
      this.dieselRows[0] = this.createEmptyRow('Diesel');
    }
  }

  calculateRow(item: PurchaseRow): void {
    const total = Number(item.total) || 0;
    const vat = Number(item.vat) || 0;
    const cess = Number(item.cess) || 0;
    item.total_purchase = parseFloat((total + vat + cess).toFixed(2));
  }

  getPetrolTotalQuantity(): number {
    return this.petrolRows.reduce((acc, r) => acc + (Number(r.quantity) || 0), 0);
  }

  getPetrolTotalPurchase(): number {
    return parseFloat(this.petrolRows.reduce((acc, r) => acc + (Number(r.total_purchase) || 0), 0).toFixed(2));
  }

  getDieselTotalQuantity(): number {
    return this.dieselRows.reduce((acc, r) => acc + (Number(r.quantity) || 0), 0);
  }

  getDieselTotalPurchase(): number {
    return parseFloat(this.dieselRows.reduce((acc, r) => acc + (Number(r.total_purchase) || 0), 0).toFixed(2));
  }

  grandTotalPurchase(): number {
    return parseFloat((this.getPetrolTotalPurchase() + this.getDieselTotalPurchase()).toFixed(2));
  }

  validateData(): boolean {
    if (!this.purchaseDate) {
      this.notificationService.failure('Purchase Date is required.');
      return false;
    }
    const allRows = [...this.petrolRows, ...this.dieselRows];
    for (let item of allRows) {
      const q = item.quantity === null || item.quantity === '' ? 0 : Number(item.quantity);
      if (isNaN(q)) {
        this.notificationService.failure('Quantity must be a valid number.');
        return false;
      }
    }
    return true;
  }

  order(): void {
    if (!this.validateData()) {
      return;
    }
    const allRows = [...this.petrolRows, ...this.dieselRows];
    const payload = allRows
      .filter(r => (Number(r.quantity) > 0) || (r.id && Number(r.quantity) >= 0))
      .map(r => ({
        ...r,
        quantity: r.quantity ? String(r.quantity) : '0',
        total: r.total ? String(r.total) : '0',
        vat: r.vat ? String(r.vat) : '0',
        cess: r.cess ? String(r.cess) : '0',
        jtcpercentage: r.jtcpercentage ? String(r.jtcpercentage) : '0',
        total_purchase: Number(r.total_purchase) || 0,
        date: this.purchaseDate,
        supplier: r.supplier || '',
        invoiceNumber: r.invoiceNumber || r.skuNumber || '',
        tankerNumber: r.tankerNumber || '',
        skuNumber: r.skuNumber || r.invoiceNumber || '',
        userId: this.userId
      }));

    if (payload.length === 0) {
      this.notificationService.failure("Please enter quantity greater than 0 for at least one purchase entry.");
      return;
    }

    this.http.post<any>(API_PURCHASE_ADD, payload)
      .subscribe(response => {
        this.notificationService.success("Purchase data successfully recorded.");
        this.isReload = true;
        this.dialogRef.close({ 'isReload': true });
      }, error => {
        this.notificationService.failure("Error saving purchase data");
      });
  }

  isNumber(value: any): boolean {
    return !isNaN(value) && value !== '';
  }

  cancel(): void {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  getPurchaseReport(): void {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    const selectedDate = this.purchaseDate || this.purchase?.date;

    this.http.get<any[]>(API_PURCHASE_LIST, { params }).subscribe((data: any[]) => {
      let filteredData: any[] = [];
      if (selectedDate && data) {
        filteredData = data.filter(
          (item) => new Date(item.date).toDateString() === new Date(selectedDate).toDateString()
        );
      } else if (data) {
        filteredData = data;
      }

      const petrols = filteredData.filter(item => (item.type || '').toLowerCase() === 'petrol');
      const diesels = filteredData.filter(item => (item.type || '').toLowerCase() === 'diesel');

      if (petrols.length > 0) {
        this.petrolRows = petrols.map(p => ({
          ...p,
          type: 'Petrol',
          date: selectedDate,
          userId: this.userId,
          total: p.total ? parseFloat(Number(p.total).toFixed(2)) : '',
          vat: p.vat ? parseFloat(Number(p.vat).toFixed(2)) : '',
          cess: p.cess ? parseFloat(Number(p.cess).toFixed(2)) : '',
          total_purchase: p.total_purchase ? parseFloat(Number(p.total_purchase).toFixed(2)) : ''
        }));
      } else {
        this.petrolRows = [this.createEmptyRow('Petrol')];
      }

      if (diesels.length > 0) {
        this.dieselRows = diesels.map(d => ({
          ...d,
          type: 'Diesel',
          date: selectedDate,
          userId: this.userId,
          total: d.total ? parseFloat(Number(d.total).toFixed(2)) : '',
          vat: d.vat ? parseFloat(Number(d.vat).toFixed(2)) : '',
          cess: d.cess ? parseFloat(Number(d.cess).toFixed(2)) : '',
          total_purchase: d.total_purchase ? parseFloat(Number(d.total_purchase).toFixed(2)) : ''
        }));
      } else {
        this.dieselRows = [this.createEmptyRow('Diesel')];
      }
    }, err => {
      this.petrolRows = [this.createEmptyRow('Petrol')];
      this.dieselRows = [this.createEmptyRow('Diesel')];
    });
  }

}
