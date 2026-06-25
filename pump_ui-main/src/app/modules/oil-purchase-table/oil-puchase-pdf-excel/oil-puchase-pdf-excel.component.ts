import { ExportService } from 'app/services/export.service';
import { Component, OnInit } from '@angular/core';
import { API_OIL_PURCHASE_LIST } from 'app/serviceult';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-oil-puchase-pdf-excel',
  templateUrl: './oil-puchase-pdf-excel.component.html',
  styleUrls: ['./oil-puchase-pdf-excel.component.scss']
})
export class OilPuchasePdfExcelComponent implements OnInit {

  oilProductList: any = [];
  isReload: boolean;
  userId: string;
  constructor(private exportService: ExportService, private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog, public dialogRef: MatDialogRef<OilPuchasePdfExcelComponent>) { }

  ngOnInit(): void {
    this.getOilPurchase();
  }


  // apiUrl = 'http://localhost:8081/purchases';
  allSelected: boolean = true;

  getOilPurchase() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_OIL_PURCHASE_LIST, { params }).subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.oilProductList = data.map(item => ({ ...item, selected: true }));
        this.allSelected = true;
      }
    });
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;
    this.oilProductList.forEach(item => item.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.oilProductList.length > 0 && this.oilProductList.every(item => item.selected);
  }
  exportToExcel() {
    const selectedData = this.oilProductList.filter(p => p.selected);
    // Add a total row to the selectedData
    const totalPurchase = this.getTotalPurchase();
    const totalRow = {
      date: 'Total',
      type: '',
      vendorName: '',
      skuName: '',
      skuNumber: '',
      hsn: '',
      mrp: '',
      qtyLtrOrKg: '',
      quantity: '',
      unit: '',
      rate: '',
      netTotal: '',
      discount: '',
      taxableValue: '',
      gstPercentage: '',
      gstAmount: '',
      cessPercentage: '',
      cessAmount: '',
      netAmount: totalPurchase
    };

    const dataWithTotal = [...selectedData, totalRow];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithTotal);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'purchase_data');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + EXCEL_EXTENSION);
  }

  printTable(): void {
    this.exportService.printElement('OilPurchaseTable', 'Oil Purchase Report');
  }
  getTotalPurchase(): number {
    return this.oilProductList
      .filter(p => p.selected)
      .reduce((sum: number, product: any) => sum + (Number(product.netAmount) || 0), 0);
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';