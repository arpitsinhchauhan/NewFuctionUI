import { ExportService } from 'app/services/export.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import * as XLSX from 'xlsx';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-expenses-excel',
  templateUrl: './expenses-excel.component.html',
  styleUrls: ['./expenses-excel.component.scss']
})
export class ExpensesExcelComponent implements OnInit {

  isReload: boolean;
  expenseList: any[] = [];
  
  constructor(private exportService: ExportService, @Inject(MAT_DIALOG_DATA) public data: any,
    private user: UserServiceService, private dialogRef: MatDialogRef<ExpensesExcelComponent>) {
  }

  ngOnInit(): void {
    this.fetchExpence();
  }

  allSelected: boolean = true;

  fetchExpence(): void {
    if (this.data.managerId && this.data.employeeIds && this.data.employeeIds.length > 0) {
      const requests = this.data.employeeIds.map((empId: number) =>
        this.user.getExpenses(this.data.expense, this.data.startDate, this.data.endDate, empId.toString())
          .pipe(catchError(() => of([] as any[])))
      );
      forkJoin(requests).subscribe((results: any[][]) => {
        const flat = results.flat();
        this.expenseList = flat.map(item => ({
          date: item.date,
          expenses: item.expenses,
          price: item.price,
          note: item.notes,
          selected: true
        }));
        this.allSelected = true;
      });
    } else {
      this.user.getExpenses(this.data.expense, this.data.startDate, this.data.endDate).subscribe((data: any[]) => {
        if (Array.isArray(data)) {
          this.expenseList = data.map(item => ({
            date: item.date,
            expenses: item.expenses,
            price: item.price,
            note: item.notes,
            selected: true
          }));
          this.allSelected = true;
        }
      });
    }
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;
    this.expenseList.forEach(item => item.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.expenseList.length > 0 && this.expenseList.every(item => item.selected);
  }


  printTable() {
    this.exportService.printElement('ExpenseTable', 'Expenses Report');
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  exportToExcel() {
    const selectedData = this.expenseList.filter(p => p.selected);
    const worksheet = XLSX.utils.json_to_sheet(selectedData.map(item => ({
      Date: item.date,
      Expenses: item.expenses,
      Price: item.price,
      Note: item.note
    })));

    // Add the total row
    const totalRow = {
      Date: 'Grand Total',
      Expenses: '',
      Price: this.getTotalPrice(),
      Note: ''
    };
    XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Expenses');
  
    XLSX.writeFile(wb, 'Expense_Data.xlsx');
  }
  

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
  getTotalPrice(): number {
    return this.expenseList
      .filter(p => p.selected)
      .reduce((sum, item) => sum + (+item.price || 0), 0);
  }
  

}
