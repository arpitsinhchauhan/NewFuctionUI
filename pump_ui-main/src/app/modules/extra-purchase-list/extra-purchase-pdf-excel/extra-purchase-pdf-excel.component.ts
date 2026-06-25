import { ExportService } from 'app/services/export.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { API_EXTRA_PURCHASE_LIST } from 'app/serviceult';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-extra-purchase-pdf-excel',
  templateUrl: './extra-purchase-pdf-excel.component.html',
  styleUrls: ['./extra-purchase-pdf-excel.component.scss']
})
export class ExtraPurchasePdfExcelComponent implements OnInit {

  extraPurchaseList: any = [];
  isReload: boolean;
  userId: string;
  constructor(private exportService: ExportService, private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<ExtraPurchasePdfExcelComponent>) { }

  ngOnInit(): void {  
    this.getPurchase();
  }


  allSelected: boolean = true;

  getPurchase() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_EXTRA_PURCHASE_LIST, { params }).subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.extraPurchaseList = data.map(item => ({ ...item, selected: true }));
        this.allSelected = true;
      }
    });
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;
    this.extraPurchaseList.forEach(item => item.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.extraPurchaseList.length > 0 && this.extraPurchaseList.every(item => item.selected);
  }
  exportToExcel() {
    const selectedData = this.extraPurchaseList.filter(p => p.selected);
    // Add a total row to the selectedData
    const extraTotalPurchase = this.getTotalPurchase();
    const totalRow = {
      date: 'Total',
      extra_type: '',
      extra_quantity: '',
      extra_total: '',
      extra_vat: '',
      extra_cess: '',
      extra_jtcpercentage: '',
      extra_total_purchase: extraTotalPurchase
    };

    const dataWithTotal = [...selectedData, totalRow];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithTotal);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Extra_purchase_data');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + EXCEL_EXTENSION);
  }

  printTable(): void {
    this.exportService.printElement('ExtraPurchaseTable', 'Extra Purchase Report');
  }
  getTotalPurchase(): number {
    return this.extraPurchaseList
      .filter(p => p.selected)
      .reduce((sum, product) => sum + product.extra_total_purchase, 0);
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';