import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { ExportService } from 'app/services/export.service';
import { API_XP_PETROL_LIST } from 'app/serviceult';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-xp-petrol-pdf-excel',
  templateUrl: './xp-petrol-pdf-excel.component.html',
  styleUrls: ['./xp-petrol-pdf-excel.component.scss']
})
export class XpPetrolPdfExcelComponent implements OnInit {

  
  isReload: boolean;
  xpPetrolList: any = [];
  userId: string;
  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<XpPetrolPdfExcelComponent>,
    private exportService: ExportService
  ) {
  }

  ngOnInit(): void {
    this.getdata();
  }

  allSelected: boolean = true;

  getdata() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_XP_PETROL_LIST, { params }).subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.xpPetrolList = data.map(item => ({ ...item, selected: true }));
        this.allSelected = true;
      }
    });
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;
    this.xpPetrolList.forEach(item => item.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.xpPetrolList.length > 0 && this.xpPetrolList.every(item => item.selected);
  }
  exportToExcel() {
    const selectedData = this.xpPetrolList.filter(p => p.selected);
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(selectedData.map(product => ({
      Date: product.date,
      Pump: product.pump,
      CloseMeter: product.close_meter,
      OpenMeter: product.open_meter,
      Total: product.total,
      Testing: product.testing,
      xppetrol_ltr: product.xppetrol_ltr,
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
      xppetrol_ltr: '',
      Rate: '',
      TotalSell: this.getTotalPetrolSell()
    };
    XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'XP_PetrolTable');

    // Save the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'XP_Petrol.xlsx');
  }


  printTable(): void {
    this.exportService.printElement('XPPetrolTable', 'XP Petrol Report');
  }
  getTotalPetrolSell(): number {
    return this.xpPetrolList
      .filter(p => p.selected)
      .reduce((total, product) => 
        total + (parseFloat(product.total_sell) || 0), 0
      );
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
