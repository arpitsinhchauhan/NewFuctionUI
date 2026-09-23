import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_OIL_PURCHASE_ADD, API_OIL_PURCHASE_LIST } from 'app/serviceult';

export interface OilPurchaseRow {
  id?: any;
  type: string;
  quantity: any;
  date: string;
  userId: string;
  vendorName: string;
  skuName: string;
  skuNumber: string;
  hsn: string;
  mrp: any;
  qtyLtrOrKg: any;
  unit: string;
  rate: any;
  netTotal: any;
  discount: any;
  taxableValue: any;
  gstPercentage: any;
  gstAmount: any;
  cessPercentage: any;
  cessAmount: any;
  netAmount: any;
  supplier?: string;
  invoiceNumber?: string;
  tankerNumber?: string;
}

@Component({
  selector: 'app-oilpurchase',
  templateUrl: './oilpurchase.component.html',
  styleUrls: ['./oilpurchase.component.scss']
})
export class OilpurchaseComponent implements OnInit {

  isReload: boolean = false;
  userId = localStorage.getItem('userId');
  purchaseDate: string = '';

  row: OilPurchaseRow[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    @Inject(MAT_DIALOG_DATA) public purchase: any,
    public dialogRef: MatDialogRef<OilpurchaseComponent>,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.use.dialogZIndexAdjustment();
    if (this.purchase && this.purchase.date) {
      this.purchaseDate = this.purchase.date;
    } else {
      this.purchaseDate = new Date().toISOString().split('T')[0];
    }
    this.getOilPurchaseReport();
  }

  createEmptyRow(): OilPurchaseRow {
    return {
      id: null,
      type: 'oil',
      quantity: '',
      date: this.purchaseDate,
      userId: this.userId || '',
      vendorName: '',
      skuName: '',
      skuNumber: '',
      hsn: '',
      mrp: '',
      qtyLtrOrKg: '',
      unit: '',
      rate: '',
      netTotal: '',
      discount: '',
      taxableValue: '',
      gstPercentage: '',
      gstAmount: '',
      cessPercentage: '',
      cessAmount: '',
      netAmount: '',
      supplier: '',
      invoiceNumber: '',
      tankerNumber: ''
    };
  }

  updateDate(): void {
    this.row.forEach(r => r.date = this.purchaseDate);
    if (this.purchase) {
      this.purchase.date = this.purchaseDate;
    }
    this.getOilPurchaseReport();
  }

  addTable(): void {
    this.row.push(this.createEmptyRow());
  }

  deleteRow(index: number): void {
    if (this.row.length > 1) {
      this.row.splice(index, 1);
    } else {
      this.row[0] = this.createEmptyRow();
    }
    this.notificationService.success('Purchase row removed.');
  }

  totalPrice(): number {
    return parseFloat(this.row.reduce(
      (acc, item) => acc + (Number(item.netAmount) || 0),
      0
    ).toFixed(2));
  }

  totalQuantity(): number {
    return this.row.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  }

  calculateRow(item: OilPurchaseRow): void {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discount) || 0;
    const gstPct = Number(item.gstPercentage) || 0;
    const cessPct = Number(item.cessPercentage) || 0;

    item.netTotal = parseFloat((qty * rate).toFixed(2));
    item.taxableValue = parseFloat((item.netTotal - discount).toFixed(2));
    item.gstAmount = parseFloat(((item.taxableValue * gstPct) / 100).toFixed(2));
    item.cessAmount = parseFloat(((item.taxableValue * cessPct) / 100).toFixed(2));
    item.netAmount = parseFloat((item.taxableValue + item.gstAmount + item.cessAmount).toFixed(2));
  }

  validateData(): boolean {
    if (!this.purchaseDate) {
      this.notificationService.failure('Purchase Date is required.');
      return false;
    }
    for (let item of this.row) {
      if (!item.type) item.type = 'oil';
    }
    return true;
  }

  order(): void {
    if (!this.validateData()) {
      return;
    }

    const payload = this.row
      .filter(r => (Number(r.quantity) > 0) || (r.id && Number(r.quantity) >= 0))
      .map(r => ({
        ...r,
        type: 'oil',
        quantity: r.quantity ? String(r.quantity) : '0',
        date: this.purchaseDate,
        userId: this.userId,
        mrp: Number(r.mrp) || 0,
        qtyLtrOrKg: Number(r.qtyLtrOrKg) || 0,
        rate: Number(r.rate) || 0,
        netTotal: Number(r.netTotal) || 0,
        discount: Number(r.discount) || 0,
        taxableValue: Number(r.taxableValue) || 0,
        gstPercentage: Number(r.gstPercentage) || 0,
        gstAmount: Number(r.gstAmount) || 0,
        cessPercentage: Number(r.cessPercentage) || 0,
        cessAmount: Number(r.cessAmount) || 0,
        netAmount: Number(r.netAmount) || 0,
        vendorName: r.vendorName || r.supplier || '',
        supplier: r.supplier || r.vendorName || '',
        invoiceNumber: r.invoiceNumber || r.skuNumber || '',
        tankerNumber: r.tankerNumber || '',
        skuNumber: r.skuNumber || r.invoiceNumber || ''
      }));

    if (payload.length === 0) {
      this.notificationService.failure("Please enter quantity greater than 0 for at least one purchase entry.");
      return;
    }

    this.http.post<any>(API_OIL_PURCHASE_ADD, payload)
      .subscribe(response => {
        this.notificationService.success("Oil Purchase data successfully saved.");
        this.isReload = true;
        this.dialogRef.close({ 'isReload': true });
      }, error => {
        this.notificationService.failure("Error saving oil purchase data");
      });
  }

  isNumber(value: any): boolean {
    return !isNaN(value) && value !== '';
  }

  cancel(): void {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  getOilPurchaseReport(): void {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    const selectedDate = this.purchaseDate || this.purchase?.date;

    this.http.get<any[]>(API_OIL_PURCHASE_LIST, { params }).subscribe((data: any[]) => {
      let filteredData: any[] = [];
      if (selectedDate && data) {
        filteredData = data.filter(
          (item) => new Date(item.date).toDateString() === new Date(selectedDate).toDateString()
        );
      } else if (data) {
        filteredData = data;
      }

      if (filteredData && filteredData.length > 0) {
        this.row = filteredData.map(item => ({
          ...item,
          type: 'oil',
          date: selectedDate,
          userId: this.userId,
          quantity: item.quantity || '',
          mrp: item.mrp || '',
          qtyLtrOrKg: item.qtyLtrOrKg || '',
          rate: item.rate || '',
          netTotal: item.netTotal || '',
          discount: item.discount || '',
          taxableValue: item.taxableValue || '',
          gstPercentage: item.gstPercentage || '',
          gstAmount: item.gstAmount || '',
          cessPercentage: item.cessPercentage || '',
          cessAmount: item.cessAmount || '',
          netAmount: item.netAmount || ''
        }));
      } else {
        this.row = [this.createEmptyRow()];
      }
    }, err => {
      this.row = [this.createEmptyRow()];
    });
  }

}


