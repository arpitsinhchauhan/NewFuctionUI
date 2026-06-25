import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DieselSellDetails } from 'app/models/DieselSellDetails';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-edit-diesel-sell',
  templateUrl: './edit-diesel-sell.component.html',
  styleUrls: ['./edit-diesel-sell.component.css']
})
export class EditDieselSellComponent implements OnInit {
  isReload: boolean;
  pumpList: string[] = ['Diesel Pump 1', 'Diesel Pump 2', 'Diesel Pump 3', 'Diesel Pump 4', 'Diesel Pump 5'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    public dialogRef: MatDialogRef<EditDieselSellComponent>,
  private notificationService:NotificationService) {
    this.dieselDetails = { ...data };
  }

  ngOnInit(): void {
  }
  dieselDetails: DieselSellDetails = {
    date: '',
    pump: '',
    close_meter: '',
    open_meter: '',
    total: '',
    testing: '',
    diesel_ltr: '',
    rate: '',
    total_sell: '',
  };
  calculateValues(): void {
    const openMeter = parseFloat(this.dieselDetails.open_meter);
    const closeMeter = parseFloat(this.dieselDetails.close_meter);
    const testing = parseFloat(this.dieselDetails.testing);
    const rate = parseFloat(this.dieselDetails.rate);

    const total = closeMeter - openMeter;
    const diesel_ltr = total - testing;
    const totalSell = diesel_ltr * rate;

    // Ensure total is positive
    const positiveTotal = Math.abs(total);
    const positiveTotal1 = Math.abs(diesel_ltr);
    const positiveTotal2 = Math.abs(totalSell);

    // Update the dieselDetails object
    this.dieselDetails.total = positiveTotal.toString();
    this.dieselDetails.diesel_ltr = positiveTotal1.toString();
    this.dieselDetails.total_sell = positiveTotal2.toString();
  }



  logData(): void {
    // Check if all fields are filled
    if (
      this.dieselDetails.pump &&
      this.dieselDetails.close_meter &&
      this.dieselDetails.open_meter &&
      this.dieselDetails.testing &&
      this.dieselDetails.rate
    ) {
      // Call calculateValues to update values
      this.calculateValues();

      // Then proceed with adding the details
      this.use.addDiesellSell(this.dieselDetails).subscribe(
        (response) => {
          this.notificationService.success("DieselSell Details Successfully added.");
          this.dialogRef.close({ 'isReload': this.isReload });
        },
        (error) => {
          console.error('API Error:', error);
        }
      );
    } else {
      // Show error if any field is empty
      this.notificationService.failure("Please fill all the form fields.");
    }

  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  Edit(dieselDetails: any) {
    // singupobj.ID=this.x.id;
    this.use.getUpdateDiesel(dieselDetails).subscribe(
      (response) => {
        this.notificationService.success('DieselSell data updated successfully');
        this.isReload=true;
        this.dialogRef.close({ 'isReload': this.isReload });
      },
      (error) => {
        console.error('Error updating society data:', error);
        this.isReload=false;
        this.dialogRef.close({ 'isReload': this.isReload });
      }
    );
  }

  // }


}
