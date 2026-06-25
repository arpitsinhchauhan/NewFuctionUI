import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-back-page',
  templateUrl: './back-page.component.html',
  styleUrls: ['./back-page.component.css']
})
export class BackPageComponent implements OnInit {


  kharchSellSummary: any[];
  transactionSellSummary: any[];
  jamaSummary: [string, number][] = [];
  bakiSummary: [string, number][] = [];
  firstTableData: [string, number][] = [];
  secondTableData: [string, number][] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data);
    this.kharchSellSummary = data.kharchSellSummary || [];
    this.transactionSellSummary = data.transactionSellSummary || [];
    this.jamaSummary = data.jamaSummary || [];
    this.bakiSummary = data.bakiSummary || [];
  }
  ngOnInit(): void {
    this.firstTableData = this.jamaSummary.filter(item => item[1] <= 10000);
    this.secondTableData = this.bakiSummary.filter(item => item[1] <= 10000);
  }
}
