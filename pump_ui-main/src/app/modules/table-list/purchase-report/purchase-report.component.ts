import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { API_PURCHASE_ADD, API_PURCHASE_LIST } from 'app/serviceult';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent implements OnInit {

  isReload: boolean;
  // userId: string;
  userId = localStorage.getItem('userId');
  row: PurchaseRow[] = [
    {
      id: this.purchase.id,
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
      id: this.purchase.id,
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService, @Inject(MAT_DIALOG_DATA) public purchase: any,
    public dialogRef: MatDialogRef<PurchaseReportComponent>,
    private notificationService: NotificationService) {
  }
  ngOnInit(): void {
    this.use.dialogZIndexAdjustment();
    if (this.purchase && this.purchase.date) {
      this.purchaDipStockseDetails.date = this.purchase.date;
    }
    this.getPurchaseReport();
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
      userId: this.userId
    });
  }

  deleteRow(index: number) {
    this.row.splice(index, 1);
    this.notificationService.success('Purchase Data Succefully Delete.');
  }

  totalPrice(): number {
    return this.row.reduce(
      (acc, item) => acc + (Number(item.total_purchase) || 0),
      0
    );
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
        if (response.length === 0) {
          this.notificationService.failure("No data received from the server.");
          this.row = [];
          this.dialogRef.close();
          return;
        }
        this.notificationService.success("Purchase data Succefully Add");
        this.purchaDipStockseDetails.date = null;
        this.row = [];
        this.dialogRef.close();
      });
  }

  Edit(purchaseDetails: any) {
    // singupobj.ID=this.x.id;
    this.use.getUpdatePurchase(purchaseDetails).subscribe(
      (response) => {
        this.notificationService.success('Purchase data updated successfully');
      },
      (error) => {
        console.error('Error updating society data:', error);
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

  getPurchaseReport() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };

    this.http.get<any[]>(API_PURCHASE_LIST, { params }).subscribe((data: any[]) => {
      let filteredData: any[] = [];

      if (this.purchase?.date) {
        filteredData = data.filter(
          (item) => new Date(item.date).toDateString() === new Date(this.purchase.date).toDateString()
        );
      } else {
        filteredData = data;
      }

      // Always enforce Petrol and Diesel rows
      const petrolRow = filteredData.find(item => item.type === 'Petrol') || {
        id: this.purchase?.id,
        type: 'Petrol',
        quantity: '',
        total: '',
        vat: '',
        cess: '',
        jtcpercentage: '',
        total_purchase: '',
        date: this.purchaDipStockseDetails.date || '',
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
        date: this.purchaDipStockseDetails.date || '',
        userId: this.userId
      };

      // Ensure Petrol & Diesel always appear at the top
      this.row = [petrolRow, dieselRow, ...filteredData.filter(item => item.type !== 'Petrol' && item.type !== 'Diesel')];
    });
  }

}

