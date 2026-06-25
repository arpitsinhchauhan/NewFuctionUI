import { Component, Inject, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { ExportService } from 'app/services/export.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-locl-details',
  templateUrl: './locl-details.component.html',
  styleUrls: ['./locl-details.component.scss']
})
export class LoclDetailsComponent implements OnInit {

  startDate!: string;
  endDate!: string;
  userId: string | null = localStorage.getItem('userId');
  managerId: string | null = null;
  employeeIds: number[] = [];
  creditList: any[] = [];

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    private exportService: ExportService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.managerId = data.managerId || null;
    this.employeeIds = data.employeeIds || [];
    // Do NOT override userId with managerId — DB stores only employee user_id
  }

  ngOnInit(): void {
    this.getTotalCreditDetails();
  }

  getTotalCreditDetails(): void {
    if (this.managerId && this.employeeIds && this.employeeIds.length > 0) {
      // PUMP MANAGER: fetch credit details for each employee and merge
      const requests = this.employeeIds.map(empId =>
        this.use.getTotalLoclReport(this.startDate, this.endDate, empId.toString())
          .pipe(catchError(() => of([] as any[])))
      );
      forkJoin(requests).subscribe((results: any[][]) => {
        const flat = results.flat();
        this.creditList = flat.map(r => ({
          date: r[0], balance: r[1], credit: r[2], remark: r[3],
        }));
      });
    } else {
      // SINGLE USER
      this.use.getTotalLoclReport(this.startDate, this.endDate, this.userId!)
        .subscribe((res: any[]) => {
          this.creditList = res.map(r => ({
            date: r[0], balance: r[1], credit: r[2], remark: r[3],
          }));
        });
    }
  }



  exportExcel(): void {
    const excelData = this.creditList.map(b => ({
      Date: b.date,
      Balance: b.balance,
      Credit: b.credit,
      Remark: b.remark,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Baki Report');

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob: Blob = new Blob(
      [excelBuffer],
      { type: 'application/octet-stream' }
    );

    saveAs(blob, 'Credit_Report.xlsx');
  }

  pdf(): void {
    this.exportService.printElement('creditListTable', 'Credit Report');
  }


  getTotalBalance(): number {
    return this.creditList.reduce((sum, locl) =>
      sum + (parseFloat(locl.balance) || 0), 0
    );
  }

  cancel(): void {
    this.dialog.closeAll();
  }
}
