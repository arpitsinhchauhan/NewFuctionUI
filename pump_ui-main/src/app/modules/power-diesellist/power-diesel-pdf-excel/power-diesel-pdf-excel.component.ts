import { ExportService } from 'app/services/export.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_POWER_DIESEL_LIST } from 'app/serviceult';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-power-diesel-pdf-excel',
  templateUrl: './power-diesel-pdf-excel.component.html',
  styleUrls: ['./power-diesel-pdf-excel.component.scss']
})
export class PowerDieselPdfExcelComponent implements OnInit {

  isReload: boolean;
  powerDieselList: any = [];
  userId: string;
  constructor(private exportService: ExportService, private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<PowerDieselPdfExcelComponent>,
  private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getDiesele();
  }


  allSelected: boolean = true;

  getDiesele() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_POWER_DIESEL_LIST, { params }).subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.powerDieselList = data.map(item => ({ ...item, selected: true }));
        this.allSelected = true;
      }
    });
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;
    this.powerDieselList.forEach(item => item.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.powerDieselList.length > 0 && this.powerDieselList.every(item => item.selected);
  }

  exportToExcel() {
    const selectedData = this.powerDieselList.filter(p => p.selected);
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(selectedData.map(product => ({
      Date: product.date,
      Pump: product.pump,
      CloseMeter: product.close_meter,
      OpenMeter: product.open_meter,
      Total: product.total,
      Testing: product.testing,
      PetrolLtr: product.powerdiesel_ltr,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Power Diesel');

    // Save the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'Power_Diesel.xlsx');
  }


  printTable(): void {
    this.exportService.printElement('powerdieselTable', 'Power Diesel Report');
  }
  getTotalDiesel(): number {
      return this.powerDieselList
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
