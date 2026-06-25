import { AfterContentInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppSettings } from 'app/app-settings';
import { Constants } from 'app/Constants';
import { MatCustomColumnDef } from 'app/models/matcolumnDef';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent implements OnInit, AfterContentInit {

  CT = Constants;
  AS = AppSettings;

  searchText = "";

  private paginator: MatPaginator;
  private sort: MatSort;
  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  @Input('data') data: any[];
  @Input('displayedColumns') public displayedColumns: MatCustomColumnDef[];
  @Input('paginatorSize') pageSize;

  @Input("hidePageSize") hidePageSize: boolean = false;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumnNames = [];
  filterText: string = "";
  constructor() {
  }

  ngAfterContentInit() {
    this.dataSource.paginator = this.paginator;
    if (this.pageSize) {
      this.dataSource.paginator.pageSize = this.pageSize;
    }
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.data;
  }

  ngOnInit() {
    if (this.displayedColumns) {
      this.displayedColumnNames = this.displayedColumns.map(element => element.key);
    }

  }

  setCssStyles() {

  }

  getValue(column: MatCustomColumnDef, element) {
    if (column.valueGetter && element) {
      return column.valueGetter(element);
    }
  }

  submitEvent(column: MatCustomColumnDef, element) {
    if (column.buttonEvent && element) {
      return column.buttonEvent(element);
    }
  }

  getStyles(colmun: MatCustomColumnDef) {
    if (colmun) {
      return { flex: '0 0 ' + colmun.width };
    }
  }

  setDataSourceAttributes() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event) {
    const filterValue = event;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.filterText = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}