import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { ExportService } from 'app/services/export.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-pump-total-baki-details',
  templateUrl: './pump-total-baki-details.component.html',
  styleUrls: ['./pump-total-baki-details.component.scss']
})
export class PumpTotalBakiDetailsComponent implements OnInit {

  startDate!: string;
  endDate!: string;
  userId: string | null = localStorage.getItem('userId');
  managerId: string | null = null;
  employeeIds: number[] = [];
  reportList: any[] = [];

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
    this.getTotalBakiDetails();
  }

  getTotalBakiDetails(): void {
    if (this.managerId && this.employeeIds && this.employeeIds.length > 0) {
      // PUMP MANAGER: forkJoin for each employee, then merge by customer name
      const requests = this.employeeIds.map(empId =>
        this.use.getTotalBakiReport(this.startDate, this.endDate, empId.toString())
          .pipe(catchError(() => of([] as any[])))
      );
      forkJoin(requests).subscribe((results: any[][]) => {
        const flat = results.flat();
        // Merge by customer name: sum total_baki, total_jama, baki_total
        const merged: { [name: string]: any } = {};
        flat.forEach(r => {
          const name = r[0];
          if (!merged[name]) {
            merged[name] = { name: r[0], total_baki: Number(r[1]) || 0, total_jama: Number(r[2]) || 0, baki_total: Number(r[3]) || 0 };
          } else {
            merged[name].total_baki += Number(r[1]) || 0;
            merged[name].total_jama += Number(r[2]) || 0;
            merged[name].baki_total += Number(r[3]) || 0;
          }
        });
        this.reportList = Object.values(merged);
      });
    } else {
      this.use.getTotalBakiReport(this.startDate, this.endDate, this.userId!)
        .subscribe((res: any[]) => {
          this.reportList = res.map(r => ({
            name: r[0], total_baki: r[1], total_jama: r[2], baki_total: r[3],
          }));
        });
    }
  }



  exportExcel(): void {

    const excelData = this.reportList.map(b => ({
      Name: b.name,
      Total_Baki: b.total_baki,
      Total_Jama: b.total_jama,
      Baki_Total: b.baki_total,
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

    saveAs(blob, 'Baki_Report.xlsx');
  }

  pdf(): void {
    this.exportService.printElement('bakiListTable', 'Baki Report');
  }

  getTotalBaki(): number {
    return this.reportList.reduce((sum, b) =>
      sum + (parseFloat(b.baki_total) || 0), 0
    );
  }

  cancel(): void {
    this.dialog.closeAll();
  }
}