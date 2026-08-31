import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { API_PURCHASE_LIST } from 'app/serviceult';
import { UserServiceService } from 'app/services/user-service.service';
import { ExportService } from 'app/services/export.service';

@Component({
  selector: 'app-puchase-pdf-excel',
  templateUrl: './puchase-pdf-excel.component.html',
  styleUrls: ['./puchase-pdf-excel.component.css']
})
export class PuchasePdfExcelComponent implements OnInit {
  productList: any = [];
  isReload: boolean;
  userId: string;
  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PuchasePdfExcelComponent>,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {  
    this.getPurchase();
  }


  // apiUrl = 'http://localhost:8081/purchases';
  allSelected: boolean = true;

  getPurchase() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_PURCHASE_LIST, { params }).subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.productList = data.map(item => ({
          ...item,
          total: item.total != null ? parseFloat(Number(item.total).toFixed(2)) : item.total,
          vat: item.vat != null ? parseFloat(Number(item.vat).toFixed(2)) : item.vat,
          cess: item.cess != null ? parseFloat(Number(item.cess).toFixed(2)) : item.cess,
          total_purchase: item.total_purchase != null ? parseFloat(Number(item.total_purchase).toFixed(2)) : item.total_purchase,
          selected: true
        }));
        this.allSelected = true;
      }
    });
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;
    this.productList.forEach(item => item.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.productList.length > 0 && this.productList.every(item => item.selected);
  }
  exportToExcel() {
    const selectedData = this.productList.filter(p => p.selected);
    // Add a total row to the selectedData
    const totalPurchase = this.getTotalPurchase();
    const totalRow = {
      date: 'Total',
      type: '',
      quantity: '',
      total: '',
      vat: '',
      cess: '',
      jtcpercentage: '',
      total_purchase: totalPurchase
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
    this.exportService.printElement('PurchaseTable', 'Purchase Report');
  }
  getTotalPurchase(): number {
    const total = this.productList
      .filter(p => p.selected)
      .reduce((sum, product) => sum + (Number(product.total_purchase) || 0), 0);
    return parseFloat(total.toFixed(2));
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';