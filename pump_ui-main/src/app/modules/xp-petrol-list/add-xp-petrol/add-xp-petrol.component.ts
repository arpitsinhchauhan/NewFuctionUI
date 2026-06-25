import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PetrolSellReportComponent } from 'app/modules/typography/petrol-sell-report/petrol-sell-report.component';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_PETROL_ADD, API_XP_PETROL_ADD } from 'app/serviceult';

@Component({
  selector: 'app-add-xp-petrol',
  templateUrl: './add-xp-petrol.component.html',
  styleUrls: ['./add-xp-petrol.component.scss']
})
export class AddXpPetrolComponent implements OnInit {

  isReload: boolean;
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedNumber: number = 1;
  userId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    public dialogRef: MatDialogRef<AddXpPetrolComponent>,
    private notificationService: NotificationService) {
  }
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
  }


  handleSelectedNumber() {
    // console.log(this.selectedNumber);
  }
  updateDate() {
    // Update the date field in each row with the selected date
    this.row.forEach(row => {
      row.date = this.xpPetrolDetails.date;
    });
  }
  xpPetrolDetails = {
    date: ''
  };

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  row = [
    { pump: 'xpPetrol Pump 1', close_meter: '', open_meter: '', total: '', testing: '', xppetrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'xpPetrol Pump 2', close_meter: '', open_meter: '', total: '', testing: '', xppetrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'xpPetrol Pump 3', close_meter: '', open_meter: '', total: '', testing: '', xppetrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'xpPetrol Pump 4', close_meter: '', open_meter: '', total: '', testing: '', xppetrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'xpPetrol Pump 5', close_meter: '', open_meter: '', total: '', testing: '', xppetrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'xpPetrol Pump 6', close_meter: '', open_meter: '', total: '', testing: '', xppetrol_ltr: '', rate: '', total_sell: '', date: '' },
  ];


  calculateTotals(item) {
    const closeMeter = parseFloat(item.close_meter) || 0;
    const openMeter = parseFloat(item.open_meter) || 0;
    const testing = parseFloat(item.testing) || 0;
    const rate = parseFloat(item.rate) || 0;
    
    const total = closeMeter - openMeter;
    const xppetrol_ltr = total - testing;
    const total_sell = xppetrol_ltr * rate;

    item.total = parseFloat(total.toFixed(2));
    item.xppetrol_ltr = parseFloat(xppetrol_ltr.toFixed(2));
    item.total_sell = parseFloat(total_sell.toFixed(2));
  }

  addTable() {
    this.row.push({
      pump: '',
      close_meter: '',
      open_meter: '',
      total: '',
      testing: '',
      xppetrol_ltr: '',
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
    if (!this.xpPetrolDetails.date) {
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
        this.notificationService.failure('Pump field is required.');
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
    const payload = {
      userId: this.userId, 
      date: this.xpPetrolDetails.date,
      rows: filteredRows
    };
    // Send data to backend
    this.http.post<any>(API_XP_PETROL_ADD, payload)
      .subscribe(response => {
        if (response.length === 0) {
          this.notificationService.failure('No data received from the server.');
          this.row = [];
          this.dialogRef.close();
          return;
        }
        this.notificationService.success('PetrolSell Details Succefully Add.');
        this.xpPetrolDetails.date = null;
        this.row = [];
        this.dialogRef.close();
      }, error => {
        // Handle any errors that occur during the HTTP request
        alert('An error occurred while processing your request.');
      });
  }

  isNumber(value: any): boolean {
    return !isNaN(value) && value !== '';
  }


  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}