import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DieselSellDetails } from 'app/models/DieselSellDetails';
import { powerDiesel } from 'app/models/powerDiesel';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-editpower-diesel',
  templateUrl: './editpower-diesel.component.html',
  styleUrls: ['./editpower-diesel.component.scss']
})
export class EditpowerDieselComponent implements OnInit {

  isReload: boolean;
  powerpumpList: string[] = ['powerDiesel Pump 1', 'powerDiesel Pump 2', 'powerDiesel Pump 3', 'powerDiesel Pump 4', 'powerDiesel Pump 5'];


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    public dialogRef: MatDialogRef<EditpowerDieselComponent>,
  private notificationService:NotificationService) {
    this.powerdieselDetails = { ...data };
  }

  ngOnInit(): void {
  }
  powerdieselDetails: powerDiesel = {
    date: '',
    pump: '',
    close_meter: '',
    open_meter: '',
    total: '',
    testing: '',
    powerdiesel_ltr: '',
    rate: '',
    total_sell: '',
  };
  calculateValues(): void {
    const openMeter = parseFloat(this.powerdieselDetails.open_meter);
    const closeMeter = parseFloat(this.powerdieselDetails.close_meter);
    const testing = parseFloat(this.powerdieselDetails.testing);
    const rate = parseFloat(this.powerdieselDetails.rate);

    const total = closeMeter - openMeter;
    const powerdiesel_ltr = total - testing;
    const totalSell = powerdiesel_ltr * rate;

    // Ensure total is positive
    const positiveTotal = Math.abs(total);
    const positiveTotal1 = Math.abs(powerdiesel_ltr);
    const positiveTotal2 = Math.abs(totalSell);

    // Update the powerdieselDetails object
    this.powerdieselDetails.total = positiveTotal.toString();
    this.powerdieselDetails.powerdiesel_ltr = positiveTotal1.toString();
    this.powerdieselDetails.total_sell = positiveTotal2.toString();
  }


  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  Edit(powerdieselDetails: any) {
    // singupobj.ID=this.x.id;
    this.use.getUpdatepowerDiesel(powerdieselDetails).subscribe(
      (response) => {
        this.notificationService.success('Power_Diesel data updated successfully');
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


}
