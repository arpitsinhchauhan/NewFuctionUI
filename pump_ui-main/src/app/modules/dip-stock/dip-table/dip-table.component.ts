import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { API_PD_DIP_LIST, API_PD_DIP_MAIN_TABLE_LIST } from 'app/serviceult';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-dip-table',
  templateUrl: './dip-table.component.html',
  styleUrls: ['./dip-table.component.css']
})
export class DipTableComponent implements OnInit {
  productList: any = [];
  pagedList: any = [];
  currentPage = 1; // Current page index
  itemsPerPage = 5;
  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog, private router: Router,
    public dialogRef: MatDialogRef<DipTableComponent>
  ) { }
  ngOnInit(): void {
    // this.loadPdf('report_2024-04-17');
    // this.fetchData();
    this.getAll();
  }
  getAll() {
    this.http.get(API_PD_DIP_MAIN_TABLE_LIST).subscribe((data) => {
      this.productList = data;
      (data);
    });
  }
  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.productList.forEach((item: { selected: any; }) => item.selected = isChecked);
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  sendSelected() {
    const selectedItems = this.productList.filter((item: { selected: any; }) => item.selected);
    this.use.updateSelectedItems(selectedItems);
    this.dialogRef.close();
  }

}
