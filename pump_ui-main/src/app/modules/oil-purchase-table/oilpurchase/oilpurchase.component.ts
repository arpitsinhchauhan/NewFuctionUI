import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_OIL_PURCHASE_ADD, API_OIL_PURCHASE_LIST } from 'app/serviceult';

@Component({
  selector: 'app-oilpurchase',
  templateUrl: './oilpurchase.component.html',
  styleUrls: ['./oilpurchase.component.scss']
})
export class OilpurchaseComponent implements OnInit {

  isReload: boolean;
  // userId: string;
  userId = localStorage.getItem('userId');
  row: PurchaseRow[] = [
    {
      id: this.purchase.id,
      type: 'oil',
      quantity: '',
      total: '',
      vat: '',
      cess: '',
      total_purchase: '',
      jtcpercentage: '',
      date: '',
      userId: this.userId,
      
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
      netAmount: ''
    }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService, @Inject(MAT_DIALOG_DATA) public purchase: any,
    public dialogRef: MatDialogRef<OilpurchaseComponent>,
    private notificationService: NotificationService) {
  }
  ngOnInit(): void {
    this.use.dialogZIndexAdjustment();
    if (this.purchase && this.purchase.date) {
      this.purchaDipStockseDetails.date = this.purchase.date;
    }
    this.getOilPurchaseReport();
  }

  updateDate() {
    this.row.forEach(row => {
      row.date = this.purchaDipStockseDetails.date;
    });
  }
  purchaDipStockseDetails = {
    date: ''
  };

  addTable() {
    this.row.push({
      id: this.purchase.id,
      type: '',
      quantity: '',
      total: '',
      vat: '',
      cess: '',
      total_purchase: '',
      jtcpercentage: '',
      date: this.purchaDipStockseDetails.date || '',
      userId: this.userId,

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
      netAmount: ''
    });
  }

  deleteRow(index: number) {
    this.row.splice(index, 1);
    this.notificationService.success('Oil Purchase Data Succefully Delete.');
  }

  totalPrice(): number {
    return this.row.reduce(
      (acc, item) => acc + (Number(item.netAmount) || 0),
      0
    );
  }

  calculateRow(item: any) {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discount) || 0;
    const gstPct = Number(item.gstPercentage) || 0;
    const cessPct = Number(item.cessPercentage) || 0;

    item.netTotal = qty * rate;
    item.taxableValue = item.netTotal - discount;
    item.gstAmount = (item.taxableValue * gstPct) / 100;
    item.cessAmount = (item.taxableValue * cessPct) / 100;
    item.netAmount = item.taxableValue + item.gstAmount + item.cessAmount;
  }


  validateData(): boolean {
    if (!this.purchaDipStockseDetails.date) {
      this.notificationService.failure('Date is required.');
      return false;
    }
    for (let item of this.row) {
      item.quantity = item.quantity === null || item.quantity === '' ? 0 : Number(item.quantity);
      item.mrp = item.mrp === null || item.mrp === '' ? 0 : Number(item.mrp);
      item.qtyLtrOrKg = item.qtyLtrOrKg === null || item.qtyLtrOrKg === '' ? 0 : Number(item.qtyLtrOrKg);
      item.rate = item.rate === null || item.rate === '' ? 0 : Number(item.rate);
      item.netTotal = item.netTotal === null || item.netTotal === '' ? 0 : Number(item.netTotal);
      item.discount = item.discount === null || item.discount === '' ? 0 : Number(item.discount);
      item.taxableValue = item.taxableValue === null || item.taxableValue === '' ? 0 : Number(item.taxableValue);
      item.gstPercentage = item.gstPercentage === null || item.gstPercentage === '' ? 0 : Number(item.gstPercentage);
      item.gstAmount = item.gstAmount === null || item.gstAmount === '' ? 0 : Number(item.gstAmount);
      item.cessPercentage = item.cessPercentage === null || item.cessPercentage === '' ? 0 : Number(item.cessPercentage);
      item.cessAmount = item.cessAmount === null || item.cessAmount === '' ? 0 : Number(item.cessAmount);
      item.netAmount = item.netAmount === null || item.netAmount === '' ? 0 : Number(item.netAmount);

      if (
        isNaN(item.quantity) ||
        isNaN(item.mrp) ||
        isNaN(item.qtyLtrOrKg) ||
        isNaN(item.rate) ||
        isNaN(item.netTotal) ||
        isNaN(item.discount) ||
        isNaN(item.taxableValue) ||
        isNaN(item.gstPercentage) ||
        isNaN(item.gstAmount) ||
        isNaN(item.cessPercentage) ||
        isNaN(item.cessAmount) ||
        isNaN(item.netAmount)
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

    this.http.post<any>(API_OIL_PURCHASE_ADD, this.row)
      .subscribe(response => {
        if (response.length === 0) {
          this.notificationService.failure("No data received from the server.");
          this.row = [];
          this.dialogRef.close();
          return;
        }
        this.notificationService.success("Oil Purchase data Succefully Add");
        this.purchaDipStockseDetails.date = null;
        this.row = [];
        this.dialogRef.close();
      });
  }

  Edit(purchaseDetails: any) {
    // singupobj.ID=this.x.id;
    this.use.getUpdateOilPurchase(purchaseDetails).subscribe(
      (response) => {
        this.notificationService.success('OilPurchase data updated successfully');
      },
      (error) => {
        console.error('Error updating data:', error);
      }
    );
    this.dialogRef.close({ 'isReload': this.isReload });
  }
  isNumber(value: any): boolean {
    return !isNaN(value) && value !== '';
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  getOilPurchaseReport() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };

    this.http.get<any[]>(API_OIL_PURCHASE_LIST, { params }).subscribe((data: any[]) => {
      let filteredData: any[] = [];

      if (this.purchase?.date) {
        filteredData = data.filter(
          (item) => new Date(item.date).toDateString() === new Date(this.purchase.date).toDateString()
        );
      } else {
        filteredData = data;
      }

      // Always enforce Petrol and Diesel rows
      const oilRow = filteredData.find(item => item.type === 'oil') || {
        id: this.purchase?.id,
        type: 'oil',
        quantity: '',
        total: '',
        vat: '',
        cess: '',
        jtcpercentage: '',
        total_purchase: '',
        date: this.purchaDipStockseDetails.date || '',
        userId: this.userId,
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
        netAmount: ''
      };


      // Ensure Petrol & Diesel always appear at the top
      this.row = [oilRow, ...filteredData.filter(item => item.type !== 'oil')];
    });
  }

}


