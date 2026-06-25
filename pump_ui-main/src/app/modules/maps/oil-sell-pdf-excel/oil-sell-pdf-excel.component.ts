import { ExportService } from 'app/services/export.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { API_OILSELL_ADD, API_OILSELL_LIST } from 'app/serviceult';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-oil-sell-pdf-excel',
  templateUrl: './oil-sell-pdf-excel.component.html',
  styleUrls: ['./oil-sell-pdf-excel.component.css']
})
export class OilSellPdfExcelComponent implements OnInit {

  isReload: boolean;
  OilsellList: any = [];
  userId:string;
  constructor(private exportService: ExportService, private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<OilSellPdfExcelComponent>) {
    // this.compD = data;
  }

  ngOnInit(): void {
    this.getOilSell();
  }

  allSelected: boolean = true;

  getOilSell() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_OILSELL_LIST, { params }).subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.OilsellList = data.map(item => ({ ...item, selected: true }));
        this.allSelected = true;
      }
    });
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;
    this.OilsellList.forEach(item => item.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.OilsellList.length > 0 && this.OilsellList.every(item => item.selected);
  }
  exportToExcel() {
    const selectedData = this.OilsellList.filter(p => p.selected);
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(selectedData.map(product => ({
      Date: product.date,
      Value: product.value,
      TotalSell: product.price,
      oilSellNote: product.oilSellNote
    })));

    // Add the total row
    const totalRow = {
      Date: '',
      Value: '',
      Price: this.getTotalOilSell(),
      oilSellNote:''
    };
    XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Oil Sell');

    // Save the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'Oil_Sell.xlsx');
  }


  printTable(): void {
    this.exportService.printElement('OilsellTable', 'Oil Sell Report');
  }
  getTotalOilSell(): number {
      return this.OilsellList
        .filter(p => p.selected)
        .reduce((total, product) => 
          total + (parseFloat(product.price) || 0), 0
        );
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

