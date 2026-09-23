import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_EXTRA_PURCHASE_ADD, API_EXTRA_PURCHASE_LIST } from 'app/serviceult';

export interface ExtraPurchaseRow {
  id?: any;
  extraType: string;
  skuNumber?: string;
  supplier?: string;
  invoiceNumber?: string;
  tankerNumber?: string;
  extra_quantity: any;
  extra_total: any;
  extra_vat: any;
  extra_cess: any;
  extra_total_purchase: any;
  extra_jtcpercentage: any;
  date: string;
  userId: string;
}

@Component({
  selector: 'app-add-extra-purchase',
  templateUrl: './add-extra-purchase.component.html',
  styleUrls: ['./add-extra-purchase.component.scss']
})
export class AddExtraPurchaseComponent implements OnInit {

  isReload: boolean = false;
  userId = localStorage.getItem('userId');
  purchaseDate: string = '';

  xpPetrolRows: ExtraPurchaseRow[] = [];
  powerDieselRows: ExtraPurchaseRow[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    @Inject(MAT_DIALOG_DATA) public purchase: any,
    public dialogRef: MatDialogRef<AddExtraPurchaseComponent>,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.use.dialogZIndexAdjustment();
    if (this.purchase && this.purchase.date) {
      this.purchaseDate = this.purchase.date;
    } else {
      this.purchaseDate = new Date().toISOString().split('T')[0];
    }
    this.getExtraPurchase();
  }

  createEmptyRow(type: string): ExtraPurchaseRow {
    return {
      id: null,
      extraType: type,
      skuNumber: '',
      supplier: '',
      invoiceNumber: '',
      tankerNumber: '',
      extra_quantity: '',
      extra_total: '',
      extra_vat: '',
      extra_cess: '',
      extra_total_purchase: '',
      extra_jtcpercentage: '',
      date: this.purchaseDate,
      userId: this.userId || ''
    };
  }

  updateDate(): void {
    this.xpPetrolRows.forEach(r => r.date = this.purchaseDate);
    this.powerDieselRows.forEach(r => r.date = this.purchaseDate);
    if (this.purchase) {
      this.purchase.date = this.purchaseDate;
    }
    this.getExtraPurchase();
  }

  addXpPetrolPurchase(): void {
    this.xpPetrolRows.push(this.createEmptyRow('XP Petrol'));
  }

  removeXpPetrolPurchase(index: number): void {
    if (this.xpPetrolRows.length > 1) {
      this.xpPetrolRows.splice(index, 1);
    } else {
      this.xpPetrolRows[0] = this.createEmptyRow('XP Petrol');
    }
  }

  addPowerDieselPurchase(): void {
    this.powerDieselRows.push(this.createEmptyRow('Power Diesel'));
  }

  removePowerDieselPurchase(index: number): void {
    if (this.powerDieselRows.length > 1) {
      this.powerDieselRows.splice(index, 1);
    } else {
      this.powerDieselRows[0] = this.createEmptyRow('Power Diesel');
    }
  }

  calculateRow(item: ExtraPurchaseRow): void {
    const total = Number(item.extra_total) || 0;
    const vat = Number(item.extra_vat) || 0;
    const cess = Number(item.extra_cess) || 0;
    item.extra_total_purchase = parseFloat((total + vat + cess).toFixed(2));
  }

  getXpTotalQuantity(): number {
    return this.xpPetrolRows.reduce((acc, r) => acc + (Number(r.extra_quantity) || 0), 0);
  }

  getXpTotalPurchase(): number {
    return parseFloat(this.xpPetrolRows.reduce((acc, r) => acc + (Number(r.extra_total_purchase) || 0), 0).toFixed(2));
  }

  getPowerDieselTotalQuantity(): number {
    return this.powerDieselRows.reduce((acc, r) => acc + (Number(r.extra_quantity) || 0), 0);
  }

  getPowerDieselTotalPurchase(): number {
    return parseFloat(this.powerDieselRows.reduce((acc, r) => acc + (Number(r.extra_total_purchase) || 0), 0).toFixed(2));
  }

  grandTotalPurchase(): number {
    return parseFloat((this.getXpTotalPurchase() + this.getPowerDieselTotalPurchase()).toFixed(2));
  }

  validateData(): boolean {
    if (!this.purchaseDate) {
      this.notificationService.failure('Date is required.');
      return false;
    }
    return true;
  }

  order(): void {
    if (!this.validateData()) {
      return;
    }
    const allRows = [...this.xpPetrolRows, ...this.powerDieselRows];
    const payload = allRows
      .filter(r => (Number(r.extra_quantity) > 0) || (r.id && Number(r.extra_quantity) >= 0))
      .map(r => ({
        ...r,
        extra_quantity: r.extra_quantity ? String(r.extra_quantity) : '0',
        extra_total: r.extra_total ? String(r.extra_total) : '0',
        extra_vat: r.extra_vat ? String(r.extra_vat) : '0',
        extra_cess: r.extra_cess ? String(r.extra_cess) : '0',
        extra_jtcpercentage: r.extra_jtcpercentage ? String(r.extra_jtcpercentage) : '0',
        extra_total_purchase: Number(r.extra_total_purchase) || 0,
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

    this.http.post<any>(API_EXTRA_PURCHASE_ADD, payload)
      .subscribe(response => {
        this.notificationService.success("Extra Purchase data successfully recorded.");
        this.isReload = true;
        this.dialogRef.close({ 'isReload': true });
      }, error => {
        this.notificationService.failure("Error saving extra purchase data");
      });
  }

  isNumber(value: any): boolean {
    return !isNaN(value) && value !== '';
  }

  cancel(): void {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  getExtraPurchase(): void {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    const selectedDate = this.purchaseDate || this.purchase?.date;

    this.http.get<any[]>(API_EXTRA_PURCHASE_LIST, { params }).subscribe((data: any[]) => {
      let filteredData: any[] = [];
      if (selectedDate && data) {
        filteredData = data.filter(
          item => new Date(item.date).toDateString() === new Date(selectedDate).toDateString()
        );
      } else if (data) {
        filteredData = data;
      }

      const xps = filteredData.filter(item => (item.extraType || '').toLowerCase().includes('xp'));
      const pds = filteredData.filter(item => (item.extraType || '').toLowerCase().includes('power'));

      if (xps.length > 0) {
        this.xpPetrolRows = xps.map(x => ({
          ...x,
          extraType: 'XP Petrol',
          date: selectedDate,
          userId: this.userId,
          extra_total: x.extra_total ? parseFloat(Number(x.extra_total).toFixed(2)) : '',
          extra_vat: x.extra_vat ? parseFloat(Number(x.extra_vat).toFixed(2)) : '',
          extra_cess: x.extra_cess ? parseFloat(Number(x.extra_cess).toFixed(2)) : '',
          extra_total_purchase: x.extra_total_purchase ? parseFloat(Number(x.extra_total_purchase).toFixed(2)) : ''
        }));
      } else {
        this.xpPetrolRows = [this.createEmptyRow('XP Petrol')];
      }

      if (pds.length > 0) {
        this.powerDieselRows = pds.map(p => ({
          ...p,
          extraType: 'Power Diesel',
          date: selectedDate,
          userId: this.userId,
          extra_total: p.extra_total ? parseFloat(Number(p.extra_total).toFixed(2)) : '',
          extra_vat: p.extra_vat ? parseFloat(Number(p.extra_vat).toFixed(2)) : '',
          extra_cess: p.extra_cess ? parseFloat(Number(p.extra_cess).toFixed(2)) : '',
          extra_total_purchase: p.extra_total_purchase ? parseFloat(Number(p.extra_total_purchase).toFixed(2)) : ''
        }));
      } else {
        this.powerDieselRows = [this.createEmptyRow('Power Diesel')];
      }
    }, err => {
      this.xpPetrolRows = [this.createEmptyRow('XP Petrol')];
      this.powerDieselRows = [this.createEmptyRow('Power Diesel')];
    });
  }
}

