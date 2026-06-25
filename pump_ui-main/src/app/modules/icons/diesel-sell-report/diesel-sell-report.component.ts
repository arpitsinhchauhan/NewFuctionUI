import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DieselSellDetails } from '../../../models/DieselSellDetails';
import { API_DIESEL_ADD } from 'app/serviceult';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-diesel-sell-report',
  templateUrl: './diesel-sell-report.component.html',
  styleUrls: ['./diesel-sell-report.component.css']
})
export class DieselSellReportComponent implements OnInit {
  isReload: boolean;
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedNumber: number = 1;
  userId: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    public dialogRef: MatDialogRef<DieselSellReportComponent>,
    private notificationService: NotificationService) {
  }
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
  }

  updateDate() {
    // Update the date field in each row with the selected date
    this.row.forEach(row => {
      row.date = this.purchaDipStockseDetails.date;
    });
  }
  purchaDipStockseDetails = {
    date: ''
  };

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  row = [
    { pump: 'Diesel Pump 1', close_meter: '', open_meter: '', total: '', testing: '', diesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Diesel Pump 2', close_meter: '', open_meter: '', total: '', testing: '', diesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Diesel Pump 3', close_meter: '', open_meter: '', total: '', testing: '', diesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Diesel Pump 4', close_meter: '', open_meter: '', total: '', testing: '', diesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Diesel Pump 5', close_meter: '', open_meter: '', total: '', testing: '', diesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Diesel Pump 6', close_meter: '', open_meter: '', total: '', testing: '', diesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Diesel Pump 7', close_meter: '', open_meter: '', total: '', testing: '', diesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Diesel Pump 8', close_meter: '', open_meter: '', total: '', testing: '', diesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Diesel Pump 9', close_meter: '', open_meter: '', total: '', testing: '', diesel_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Diesel Pump 10', close_meter: '', open_meter: '', total: '', testing: '', diesel_ltr: '', rate: '', total_sell: '', date: '' }
  ];

  calculateTotals(item) {
    const closeMeter = parseFloat(item.close_meter) || 0;
    const openMeter = parseFloat(item.open_meter) || 0;
    const testing = parseFloat(item.testing) || 0;
    const rate = parseFloat(item.rate) || 0;

    item.total = closeMeter - openMeter;
    item.diesel_ltr = item.total - testing;
    item.total_sell = item.diesel_ltr * rate;
  }

  addTable() {
    this.row.push({
      pump: '',
      close_meter: '',
      open_meter: '',
      total: '',
      testing: '',
      diesel_ltr: '',
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
    if (!this.purchaDipStockseDetails.date) {
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
        this.notificationService.failure('Diesel Pump field is required.');
        return false;
      }
    }

    return true;
  }

  // validateData(): boolean {
  //   if (!this.purchaDipStockseDetails.date) {
  //     this.notificationService.failure('Date is required.');
  //     return false;
  //   }
  //   for (let item of this.row) {
  //     if (!this.isNumber(item.close_meter) || !this.isNumber(item.open_meter) || !this.isNumber(item.testing) || !this.isNumber(item.rate)) {
  //       this.notificationService.failure('All numeric fields must contain valid numbers.');
  //       return false;
  //     }
  //     if (!item.pump) {
  //       this.notificationService.failure('Diesel Pump field is required.');
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  order() {

    if (!this.validateData()) {
      return;
    }
    const filteredRows = this.row.slice(0, this.selectedNumber);
    const orderData = {
      userId: this.userId, 
      date: this.purchaDipStockseDetails.date,
      rows: filteredRows
    };
    // const orderData = {
    //   rows: this.row
    // };
    // Send data to backend
    this.http.post<any>(API_DIESEL_ADD, orderData)
      .subscribe(response => {
        if (response.length === 0) {
          this.notificationService.failure('No data received from the server.');
          this.row = [];
          this.dialogRef.close();
          return;
        }
        this.notificationService.success('Dieselsell Details Succefully Add.');
        this.purchaDipStockseDetails.date = null;
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
//   constructor(@Inject(MAT_DIALOG_DATA) public data: any,
//     private http: HttpClient,
//     private use: UserServiceService,
//     public dialogRef: MatDialogRef<DieselSellReportComponent>) {
//     this.purchaseDetails = { ...data };
//   }

//   ngOnInit(): void {
//   }
//   purchaseDetails: DieselSellDetails = {
//     date: new Date(),
//     pump: '',
//     close_meter: '',
//     open_meter: '',
//     total: '',
//     testing: '',
//     diesel_ltr: '',
//     rate: '',
//     total_sell: '',
//   };
//   calculateValues(): void {
//     const openMeter = parseFloat(this.purchaseDetails.open_meter);
//     const closeMeter = parseFloat(this.purchaseDetails.close_meter);
//     const testing = parseFloat(this.purchaseDetails.testing);
//     const rate = parseFloat(this.purchaseDetails.rate);

//     const total = closeMeter - openMeter;
//     const diesel_ltr = total - testing;
//     const totalSell = diesel_ltr * rate;

//     // Ensure total is positive
//     const positiveTotal = Math.abs(total);
//     const positiveTotal1 = Math.abs(diesel_ltr);
//     const positiveTotal2 = Math.abs(totalSell);

//     // Update the purchaseDetails object
//     this.purchaseDetails.total = positiveTotal.toString();
//     this.purchaseDetails.diesel_ltr = positiveTotal1.toString();
//     this.purchaseDetails.total_sell = positiveTotal2.toString();
//   }



//   logData(): void {
//     // Check if all fields are filled
//     if (
//       this.purchaseDetails.pump &&
//       this.purchaseDetails.close_meter &&
//       this.purchaseDetails.open_meter &&
//       this.purchaseDetails.testing &&
//       this.purchaseDetails.rate
//     ) {
//       // Call calculateValues to update values
//       this.calculateValues();

//       // Then proceed with adding the details
//       this.use.addDiesellSell(this.purchaseDetails).subscribe(
//         (response) => {
//           (this.purchaseDetails);
//           alert("DieselSell Details Successfully added.");
//           this.dialogRef.close({ 'isReload': this.isReload });
//         },
//         (error) => {
//           console.error('API Error:', error);
//         }
//       );
//     } else {
//       // Show error if any field is empty
//       alert("Please fill all the form fields.");
//     }

//   }

//   cancel(): void {
//     this.dialogRef.close();
//   }

//   Edit(dieseldetails: any) {
//     // singupobj.ID=this.x.id;
//     this.use.getUpdateDiesel(dieseldetails).subscribe(
//       (response) => {
//         alert('DieselSell data updated successfully');
//       },
//       (error) => {
//         console.error('Error updating society data:', error);
//       }
//     );
//     this.dialogRef.close({ 'isReload': this.isReload });
//   }

// }
