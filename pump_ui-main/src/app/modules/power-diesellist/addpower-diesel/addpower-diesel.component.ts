import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_POWER_DIESEL_ADD } from 'app/serviceult';

@Component({
  selector: 'app-addpower-diesel',
  templateUrl: './addpower-diesel.component.html',
  styleUrls: ['./addpower-diesel.component.scss']
})
export class AddpowerDieselComponent implements OnInit {

  isReload: boolean;
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedNumber: number = 1;
  userId: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    public dialogRef: MatDialogRef<AddpowerDieselComponent>,
    private notificationService: NotificationService) {
  }
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
  }

  updateDate() {
    // Update the date field in each row with the selected date
    this.row.forEach(row => {
      row.date = this.powerDieselDetails.date;
    });
  }
  powerDieselDetails = {
    date: ''
  };

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  row = [
    { pump: 'powerDiesel Pump 1', close_meter: '', open_meter: '', total: '', testing: '', powerdiesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'powerDiesel Pump 2', close_meter: '', open_meter: '', total: '', testing: '', powerdiesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'powerDiesel Pump 3', close_meter: '', open_meter: '', total: '', testing: '', powerdiesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'powerDiesel Pump 4', close_meter: '', open_meter: '', total: '', testing: '', powerdiesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'powerDiesel Pump 5', close_meter: '', open_meter: '', total: '', testing: '', powerdiesel_ltr: '', rate: '', total_sell: '', date: '' },
  ];

  calculateTotals(item) {
    const closeMeter = parseFloat(item.close_meter) || 0;
    const openMeter = parseFloat(item.open_meter) || 0;
    const testing = parseFloat(item.testing) || 0;
    const rate = parseFloat(item.rate) || 0;

    item.total = closeMeter - openMeter;
    item.powerdiesel_ltr = item.total - testing;
    item.total_sell = item.powerdiesel_ltr * rate;
  }

  addTable() {
    this.row.push({
      pump: '',
      close_meter: '',
      open_meter: '',
      total: '',
      testing: '',
      powerdiesel_ltr: '',
      rate: '',
      total_sell: '',
      date: ''
    });
  }

  deleteRow(index: number) {
    this.row.splice(index, 1);
  }

  totalPrice() {
    return this.row.reduce((acc, item) => acc + (parseFloat(item.total_sell) || 0), 0);
  }
  validateData(): boolean {
    if (!this.powerDieselDetails.date) {
      this.notificationService.failure('Date is required.');
      return false;
    }

    // Validate only the rows up to the selected number
    for (let i = 0; i < this.selectedNumber; i++) {
      const item = this.row[i];

      if (!this.isNumber(item.close_meter) || !this.isNumber(item.open_meter) || !this.isNumber(item.testing) || !this.isNumber(item.rate)) {
        this.notificationService.failure('All numeric fields must contain valid numbers.');
        return false;
      }

      if (!item.pump) {
        this.notificationService.failure('powerDiesel Pump field is required.');
        return false;
      }
    }

    return true;
  }

  order() {
    if (!this.validateData()) {
      return;
    }
    const filteredRows = this.row.slice(0, this.selectedNumber);
    const orderData = {
      userId: this.userId, 
      date: this.powerDieselDetails.date,
      rows: filteredRows
    };
    // const orderData = {
    //   rows: this.row
    // };
    // Send data to backend
    this.http.post<any>(API_POWER_DIESEL_ADD, orderData)
      .subscribe(response => {
        if (response.length === 0) {
          this.notificationService.failure('No data received from the server.');
          this.row = [];
          this.dialogRef.close();
          return;
        }
        this.notificationService.success('Power_Diesel Details Succefully Add.');
        this.powerDieselDetails.date = null;
        this.row = [];
        this.dialogRef.close();
      }, error => {
        // Handle any errors that occur during the HTTP request
        this.notificationService.failure('An error occurred while processing your request.');
      });
  }

  isNumber(value: any): boolean {
    return !isNaN(value) && value !== '';
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}