import { ExportService } from 'app/services/export.service';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { API_DIESEL_LIST } from 'app/serviceult';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-diesel-sell-pdf-excel',
  templateUrl: './diesel-sell-pdf-excel.component.html',
  styleUrls: ['./diesel-sell-pdf-excel.component.css']
})
export class DieselSellPdfExcelComponent implements OnInit {

  isReload: boolean;
  dieselSellList: any = [];
  userId: string;
  constructor(private exportService: ExportService, private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<DieselSellPdfExcelComponent>,
  private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getDiesele();
  }


  allSelected: boolean = true;

  getDiesele() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_DIESEL_LIST, { params }).subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.dieselSellList = data.map(item => ({ ...item, selected: true }));
        this.allSelected = true;
      }
    });
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;
    this.dieselSellList.forEach(item => item.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.dieselSellList.length > 0 && this.dieselSellList.every(item => item.selected);
  }
  exportToExcel() {
    const selectedData = this.dieselSellList.filter(p => p.selected);
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(selectedData.map(product => ({
      Date: product.date,
      Pump: product.pump,
      CloseMeter: product.close_meter,
      OpenMeter: product.open_meter,
      Total: product.total,
      Testing: product.testing,
      DieselLtr: product.diesel_ltr,
      Rate: product.rate,
      TotalSell: product.total_sell
    })));

    // Add the total row
    const totalRow = {
      Date: '',
      Pump: '',
      CloseMeter: '',
      OpenMeter: '',
      Total: '',
      Testing: '',
      Dieselltr: '',
      Rate: '',
      TotalSell: this.getTotalDiesel()
    };
    XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Diesel Sell');

    // Save the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'Diesel_Sell.xlsx');
  }


  printTable(): void {
    this.exportService.printElement('DieselSelltTable', 'Diesel Sell Report');
  }
  getTotalDiesel(): number {
      return this.dieselSellList
        .filter(p => p.selected)
        .reduce((sum, product) => 
          sum + (parseFloat(product.total_sell) || 0), 0
        );
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
