import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { API_EXTRA_PD_DIP_MAIN_TABLE_LIST } from 'app/serviceult';

@Component({
  selector: 'app-extra-dip-table',
  templateUrl: './extra-dip-table.component.html',
  styleUrls: ['./extra-dip-table.component.scss']
})
export class ExtraDipTableComponent implements OnInit {

  extradipList: any = [];
   pagedList: any = [];
   currentPage = 1; // Current page index
   itemsPerPage = 5;
   constructor(
     private http: HttpClient,
     private use: UserServiceService,
     private dialog: MatDialog,
     public dialogRef: MatDialogRef<ExtraDipTableComponent>
   ) { }
   ngOnInit(): void {
     // this.loadPdf('report_2024-04-17');
     // this.fetchData();
     this.getAll();
   }
   getAll() {
     this.http.get(API_EXTRA_PD_DIP_MAIN_TABLE_LIST).subscribe((data) => {
       this.extradipList = data;
       (data);
     });
   }
   toggleSelectAll(event: any) {
     const isChecked = event.target.checked;
     this.extradipList.forEach((item: { selected: any; }) => item.selected = isChecked);
   }
 
   pageChanged(event: any): void {
     this.currentPage = event.page;
   }
 
   sendSelected() {
     const selectedItems = this.extradipList.filter((item: { selected: any; }) => item.selected);
     this.use.updateSelectedItems(selectedItems);
     this.dialogRef.close();
   }
 
 }
 
