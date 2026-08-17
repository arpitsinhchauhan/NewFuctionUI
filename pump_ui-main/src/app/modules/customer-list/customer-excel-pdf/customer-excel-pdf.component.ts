import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_CUSTOMER_NAME } from 'app/serviceult';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-customer-excel-pdf',
  templateUrl: './customer-excel-pdf.component.html',
  styleUrls: ['./customer-excel-pdf.component.scss']
})
export class CustomerExcelPdfComponent implements OnInit {

   isReload: boolean;
   customerList: any = [];
   userId: string;
   isExporting: boolean = false;

   constructor(
     private http: HttpClient,
     private use: UserServiceService,
     private dialog: MatDialog,
     public dialogRef: MatDialogRef<CustomerExcelPdfComponent>,
     private notificationService: NotificationService
   ) { }

   ngOnInit(): void {
     this.getcustomer();
   }

   allSelected: boolean = true;

   getcustomer() {
     this.userId = localStorage.getItem('userId');
     const params = { userId: this.userId };
     this.http.get(API_CUSTOMER_NAME, { params }).subscribe((data: any) => {
       if (Array.isArray(data)) {
         this.customerList = data.map(item => ({ ...item, selected: true }));
         this.allSelected = true;
       }
     });
   }

   toggleSelectAll(event: any) {
     this.allSelected = event.target.checked;
     this.customerList.forEach((item: any) => item.selected = this.allSelected);
   }

   checkIfAllSelected() {
     this.allSelected = this.customerList.length > 0 && this.customerList.every((item: any) => item.selected);
   }

   exportToExcel() {
     if (this.isExporting) return;
     this.isExporting = true;
     this.notificationService.success("Generating Excel export...");

     setTimeout(() => {
       try {
         const selectedData = this.customerList.filter((p: any) => p.selected);
         const worksheet = XLSX.utils.json_to_sheet(selectedData.map((product: any) => ({
           Date: product.date,
           name: product.name,
           email: product.email,
           phone: product.phone,
         })));

         const totalRow = {
           Date: '',
           name: '',
           email: '',
           phone: '',
         };
         XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

         const workbook = XLSX.utils.book_new();
         XLSX.utils.book_append_sheet(workbook, worksheet, 'Customer');

         const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
         const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
         saveAs(data, 'Customer.xlsx');
         this.notificationService.success("Excel exported successfully!");
       } catch (err) {
         this.notificationService.failure("Export failed: " + err);
       } finally {
         this.isExporting = false;
       }
     }, 100);
   }

   printTable(): void {
     if (this.isExporting) return;
     this.isExporting = true;

     setTimeout(() => {
       const printContent = document.getElementById('CustomerTable')?.outerHTML;
       const originalContent = document.body.innerHTML;

       document.body.innerHTML = printContent ?? '';
       window.print();
       document.body.innerHTML = originalContent;
       this.isExporting = false;
       window.location.reload();
     }, 100);
   }

   cancel() {
     this.dialogRef.close({ 'isReload': this.isReload });
   }

}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';