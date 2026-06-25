import { ExportService } from 'app/services/export.service';
import { Component, OnInit } from '@angular/core';
import { API_JAMABAKI_LIST } from 'app/serviceult';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-jamabaki-pdf-excel',
  templateUrl: './jamabaki-pdf-excel.component.html',
  styleUrls: ['./jamabaki-pdf-excel.component.scss']
})
export class JamabakiPdfExcelComponent implements OnInit {

  
  isReload: boolean;
  JamabakiList: any = [];
  userId: string;
  constructor(private exportService: ExportService, private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<JamabakiPdfExcelComponent>,
  private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getJamaBaki();
  }


  allSelected: boolean = true;

  getJamaBaki() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_JAMABAKI_LIST, { params }).subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.JamabakiList = data.map(item => ({ ...item, selected: true }));
        this.allSelected = true;
      }
    });
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;
    this.JamabakiList.forEach(item => item.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.JamabakiList.length > 0 && this.JamabakiList.every(item => item.selected);
  }

  exportToExcel() {
    const selectedData = this.JamabakiList.filter(p => p.selected);
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(selectedData.map(product => ({
      Date: product.date,
      name:product.name,
      jama: product.jama,
      jamaNote: product.jamaNote,
      baki: product.baki,
      bakiNote: product.bakiNote,
    })));

    // Add the total row
    const totalRow = {
      Date: '',
      name: '',
      jama: this.getTotalJama,
      jamaNote: '',
      baki: this.getTotalBaki(),
      bakiNote: '',
    };
    XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'JamaBaki');

    // Save the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'JamaBaki.xlsx');
  }


  printTable(): void {
    this.exportService.printElement('JamabakiTable', 'Jamabaki Report');
  }
  getTotalJama(): number {
      return this.JamabakiList
        .filter(p => p.selected)
        .reduce((sum, product) => 
          sum + (parseFloat(product.jama) || 0), 0);
  }

  getTotalBaki(): number {
    return this.JamabakiList
      .filter(p => p.selected)
      .reduce((sum, product) => 
        sum + (parseFloat(product.baki) || 0), 0);
}

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
