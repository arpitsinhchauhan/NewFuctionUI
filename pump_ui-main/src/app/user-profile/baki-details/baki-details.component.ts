import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { ExportService } from 'app/services/export.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-baki-details',
  templateUrl: './baki-details.component.html',
  styleUrls: ['./baki-details.component.scss']
})
export class BakiDetailsComponent implements OnInit {

  startDate: string;
  endDate: string;
  userId = localStorage.getItem("userId");
  managerId: string | null = null;
  employeeIds: number[] = [];
  bakiList: any[] = [];

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    private exportService: ExportService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.managerId = data.managerId || null;
    this.employeeIds = data.employeeIds || [];
    // Do NOT override userId with managerId — DB stores only employee user_id
  }

  ngOnInit(): void {
    this.getBakiDetails();
  }

  getBakiDetails() {
    if (this.managerId && this.employeeIds && this.employeeIds.length > 0) {
      // PUMP MANAGER: DB stores baki by employee user_id — forkJoin each employee
      const requests = this.employeeIds.map(empId =>
        this.use.getBakiReport(this.startDate, this.endDate, empId.toString())
          .pipe(catchError(() => of([] as any[])))
      );
      forkJoin(requests).subscribe((results: any[][]) => {
        this.bakiList = results.flat();
      });
    } else {
      this.use.getBakiReport(this.startDate, this.endDate, this.userId)
        .subscribe((res) => { this.bakiList = res; });
    }
  }

  exportExcel() {

    const excelData = this.bakiList.map(b => ({
      Date: b[0],
      Name: b[1],
      Type: b[2],
      Rate: b[3],
      LTR: b[4],
      Baki: b[5],
      Note: b[6]
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Baki Report');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, 'Baki_Report.xlsx');
  }

  pdf(): void {
    this.exportService.printElement('bakiListTable', 'Baki Report');
  }

  cancel() {
    this.dialog.closeAll();
  }
}
