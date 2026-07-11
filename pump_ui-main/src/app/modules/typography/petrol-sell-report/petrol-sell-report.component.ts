import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_PETROL_ADD } from 'app/serviceult';

@Component({
  selector: 'app-petrol-sell-report',
  templateUrl: './petrol-sell-report.component.html',
  styleUrls: ['./petrol-sell-report.component.css']
})
export class PetrolSellReportComponent implements OnInit {
  isReload: boolean;
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedNumber: number = 1;
  userId: string; 

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    public dialogRef: MatDialogRef<PetrolSellReportComponent>,
    private notificationService: NotificationService) {
  }
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.purchaDipStockseDetails.date = this.formatDate(new Date());
    this.updateDate();
  }

  handleSelectedNumber() {
    // console.log(this.selectedNumber);
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
    { pump: 'Petrol Pump 1', close_meter: '', open_meter: '', total: '', testing: '', petrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Petrol Pump 2', close_meter: '', open_meter: '', total: '', testing: '', petrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Petrol Pump 3', close_meter: '', open_meter: '', total: '', testing: '', petrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Petrol Pump 4', close_meter: '', open_meter: '', total: '', testing: '', petrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Petrol Pump 5', close_meter: '', open_meter: '', total: '', testing: '', petrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Petrol Pump 6', close_meter: '', open_meter: '', total: '', testing: '', petrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Petrol Pump 7', close_meter: '', open_meter: '', total: '', testing: '', petrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Petrol Pump 8', close_meter: '', open_meter: '', total: '', testing: '', petrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Petrol Pump 9', close_meter: '', open_meter: '', total: '', testing: '', petrol_ltr: '', rate: '', total_sell: '', date: '' },
    { pump: 'Petrol Pump 10', close_meter: '', open_meter: '', total: '', testing: '', petrol_ltr: '', rate: '', total_sell: '', date: '' }
  ];


  calculateTotals(item) {
    const closeMeter = parseFloat(item.close_meter) || 0;
    const openMeter = parseFloat(item.open_meter) || 0;
    const testing = parseFloat(item.testing) || 0;
    const rate = parseFloat(item.rate) || 0;
    
  const total = closeMeter - openMeter;
  const petrol_ltr = total - testing;
  const total_sell = petrol_ltr * rate;

    item.total = parseFloat(total.toFixed(2));
    item.petrol_ltr = parseFloat(petrol_ltr.toFixed(2));
    item.total_sell = parseFloat(total_sell.toFixed(2));
  }

  addTable() {
    this.row.push({
      pump: '',
      close_meter: '',
      open_meter: '',
      total: '',
      testing: '',
      petrol_ltr: '',
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
        this.notificationService.failure('Petrol Pump field is required.');
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
      date: this.purchaDipStockseDetails.date,
      rows: filteredRows
    };
    // Send data to backend
    this.http.post<any>(API_PETROL_ADD, payload)
      .subscribe(response => {
        if (response.length === 0) {
          this.notificationService.failure('No data received from the server.');
          this.row = [];
          this.dialogRef.close();
          return;
        }
        this.notificationService.success('PetrolSell Details Succefully Add.');
        this.purchaDipStockseDetails.date = null;
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



// purchaseDetails: PetrolSellDetails = {
//   date: new Date(),
//   pump: '',
//   close_meter: '',
//   open_meter: '',
//   total: '',
//   testing: '',
//   petrol_ltr: '',
//   rate: '',
//   total_sell: '',
// };


// ngOnInit(): void {
//   // Perform initial calculations when component initializes
//   this.calculateValues();
// }

// calculateValues(): void {
//   const openMeter = parseFloat(this.purchaseDetails.open_meter);
//   const closeMeter = parseFloat(this.purchaseDetails.close_meter);
//   const testing = parseFloat(this.purchaseDetails.testing);
//   const rate = parseFloat(this.purchaseDetails.rate);

//   const total = closeMeter - openMeter;
//   const petrol_ltr = total - testing;
//   const totalSell = petrol_ltr * rate;

//   // Ensure total is positive
//   const positiveTotal = Math.abs(total);
//   const positiveTotal1 = Math.abs(petrol_ltr);
//   const positiveTotal2 = Math.abs(totalSell);

//   // Update the purchaseDetails object
//   this.purchaseDetails.total = positiveTotal.toString();
//   this.purchaseDetails.petrol_ltr = positiveTotal1.toString();
//   this.purchaseDetails.total_sell = positiveTotal2.toString();
// }



// logData(): void {
//   // Check if all fields are filled
//   if (
//     this.purchaseDetails.pump &&
//     this.purchaseDetails.close_meter &&
//     this.purchaseDetails.open_meter &&
//     this.purchaseDetails.testing &&
//     this.purchaseDetails.rate
//   ) {
//     // Call calculateValues to update values

//     // Then proceed with adding the details
//     this.use.addPetrolSell(this.purchaseDetails).subscribe(
//       (response) => {
//         (this.purchaseDetails);
//         alert("PetrolSell Details Successfully added.");
//         this.dialogRef.close({ 'isReload': this.isReload });
//       },
//       (error) => {
//         console.error('API Error:', error);
//       }
//     );
//   } else {
//     // Show error if any field is empty
//     alert("Please fill all the form fields.");
//   }
//   this.calculateValues();
// }



// cancel(): void {
//   this.dialogRef.close();
// }

// Edit(petroldetails: any) {
//   // singupobj.ID=this.x.id;
//   this.use.getUpdatePetrol(petroldetails).subscribe(
//     (response) => {
//       alert('PetrolSell data updated successfully');
//     },
//     (error) => {
//       console.error('Error updating society data:', error);
//     }
//   );
//   this.dialogRef.close({ 'isReload': this.isReload });
// }