import { ExportService } from 'app/services/export.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DailyTotal } from 'app/models/DailyTotal';
import { UserServiceService } from 'app/services/user-service.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-monthly-jama-baki-total',
  templateUrl: './monthly-jama-baki-total.component.html',
  styleUrls: ['./monthly-jama-baki-total.component.css']
})
export class MonthlyJamaBakiTotalComponent implements OnInit {
  dailyTotals: DailyTotal[] = [];
  startDate: string;
  endDate: string;
  use: any;
  isReload: boolean;
  productList: { date: string, jama: string, baki: string}[] = [];

  receivedTransactions: any[] | undefined;
  senderAmountTotal: number = 0;
  receiverAmountTotal: number = 0;
  totalDifference: number = 0;
  constructor(private exportService: ExportService, @Inject(MAT_DIALOG_DATA) public data: any, private user: UserServiceService,private dialogRef:MatDialogRef<MonthlyJamaBakiTotalComponent>) {
    ("customer" + data);
  }

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    this.user.getJamaBAki(this.data.customer, this.data.startDate, this.data.endDate).subscribe((data: any[]) => {
      this.productList = data.map(item => ({
        date: item.date,   // Adjusting to map the correct fields
        jama: item.jama,
        baki: item.baki,
        name: item.name,
      }));

      this.calculateTotals();
    });


  }



  calculateTotals() {
    // Reset totals to ensure fresh calculation each time the method is called
    this.senderAmountTotal = 0;
    this.receiverAmountTotal = 0;

    this.productList.forEach(transaction => {
      const jamaAmount = parseFloat(transaction.jama);  // Convert jama from string to number
      const bakiAmount = parseFloat(transaction.baki);  // Convert baki from string to number

      if (!isNaN(jamaAmount)) {  // Check if the jama amount is a valid number
        this.senderAmountTotal += jamaAmount;
      }

      if (!isNaN(bakiAmount)) {  // Check if the baki amount is a valid number
        this.receiverAmountTotal += bakiAmount;
      }
    });

    this.totalDifference = this.receiverAmountTotal - this.senderAmountTotal;

    ("send" + this.senderAmountTotal);
    ("rec" + this.receiverAmountTotal);
  }

  printTable() {
    this.exportService.printElement('JamaBakilistTable', 'Monthly Jamabaki Total Report');
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  exportToExcel() {
    // Convert HTML table to workbook
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('JamaBakilistTable')!);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // Save the workbook
    XLSX.writeFile(wb, 'JamaBakiData.xlsx');
  }

  close() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}
