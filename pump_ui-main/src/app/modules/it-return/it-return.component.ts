import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it-return',
  templateUrl: './it-return.component.html',
  styleUrls: ['./it-return.component.css']
})
export class ItReturnComponent implements OnInit {
  data = [
    { name: 'John Doe', age: 25, city: 'New York' },
  ];
  ngOnInit(): void {

  }

  startDate = new Date();
  endDate = new Date();
}
