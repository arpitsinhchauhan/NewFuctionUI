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
   constructor(private http: HttpClient,
     private use: UserServiceService,
     private dialog: MatDialog,public dialogRef: MatDialogRef<CustomerExcelPdfComponent>,
   private notificationService: NotificationService) { }
 
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
     this.customerList.forEach(item => item.selected = this.allSelected);
   }

   checkIfAllSelected() {
     this.allSelected = this.customerList.length > 0 && this.customerList.every(item => item.selected);
   }
 
   exportToExcel() {
     const selectedData = this.customerList.filter(p => p.selected);
     // Create a worksheet from the data
     const worksheet = XLSX.utils.json_to_sheet(selectedData.map(product => ({
       Date: product.date,
       name:product.name,
       email: product.email,
       phone: product.phone,
     })));
 
     // Add the total row
     const totalRow = {
       Date: '',
       name: '',
       email: '',
       phone: '',
     };
     XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });
 
     // Create a workbook and add the worksheet
     const workbook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workbook, worksheet, 'Customer');
 
     // Save the file
     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
     const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
     saveAs(data, 'Customer.xlsx');
   }
 
 
   printTable(): void {
     const printContent = document.getElementById('CustomerTable')?.outerHTML;
     const originalContent = document.body.innerHTML;
 
     document.body.innerHTML = printContent ?? '';
     window.print();
     document.body.innerHTML = originalContent;
     window.location.reload();
   }
 
   cancel() {
     this.dialogRef.close({ 'isReload': this.isReload });
   }
 
 }
 const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
 const EXCEL_EXTENSION = '.xlsx';
 