import { ExportService } from 'app/services/export.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { API_EMPLOYEE_DATA } from 'app/serviceult';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  expensesAndNotes: any[] = [];

  isReload: boolean;
  totalAmount: number = 0;
  notesParam: string = ''; // Initialize with the default value if needed

  constructor(private exportService: ExportService, private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EmployeeDetailsComponent>) {

  }

  ngOnInit(): void {
    this.fetchExpensesAndNotes();
  }


  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      ['Date', 'Expense', 'Amount', 'Person'],
      ...this.expensesAndNotes,
      ['', '', '', ''],
      ['Total Amount', '', this.totalAmount, '']
    ]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    XLSX.writeFile(wb, 'expenses.xlsx');
  }
  fetchExpensesAndNotes(): void {
    const userId = localStorage.getItem('userId');
    // const params = new HttpParams().set('notes', this.data);
    const params = new HttpParams()
      .set('notes', this.data)
      .set('userId', userId ? userId : '');

    this.http.get<any[]>(API_EMPLOYEE_DATA, { params }).subscribe(
      (data: any[]) => {
        this.expensesAndNotes = data;
        this.calculateTotalAmount();
      },
      (error) => {
        console.error('Error fetching expenses and notes:', error);
      }
    );
  }
  calculateTotalAmount(): void {
    this.totalAmount = this.expensesAndNotes.reduce((total, row) => total + parseFloat(row[2]), 0);
  }

  printTable(): void {
    this.exportService.printElement('expenseTable', 'Employee Report');
  }
  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}
