import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PetrolSellDetails } from 'app/models/PetrolSellDetails';
import { XpPetrol } from 'app/models/XpPetrol';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-edit-xp-petrol',
  templateUrl: './edit-xp-petrol.component.html',
  styleUrls: ['./edit-xp-petrol.component.scss']
})
export class EditXpPetrolComponent implements OnInit {
  isReload: boolean;
  xppumpList: string[] = ['xpPetrol Pump 1', 'xpPetrol Pump 2', 'xpPetrol Pump 3', 'xpPetrol Pump 4', 'xpPetrol Pump 5'];


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    public dialogRef: MatDialogRef<EditXpPetrolComponent>,
    private notificationService: NotificationService) {
    this.xpPetrolDetails = { ...data };
    
  }
  xpPetrolDetails: XpPetrol = {
    date: '',
    pump: '',
    close_meter: '',
    open_meter: '',
    total: '',
    testing: '',
    xppetrol_ltr: '',
    rate: '',
    total_sell: '',
  };


  ngOnInit(): void {
    this.calculateValues();
  }

  calculateValues(): void {
    const openMeter = parseFloat(this.xpPetrolDetails.open_meter);
    const closeMeter = parseFloat(this.xpPetrolDetails.close_meter);
    const testing = parseFloat(this.xpPetrolDetails.testing);
    const rate = parseFloat(this.xpPetrolDetails.rate);

    const total = closeMeter - openMeter;
    const xppetrol_ltr = total - testing;
    const totalSell = xppetrol_ltr * rate;

    // Ensure total is positive
    const positiveTotal = Math.abs(total);
    const positiveTotal1 = Math.abs(xppetrol_ltr);
    const positiveTotal2 = Math.abs(totalSell);

    // Update the xpPetrolDetails object
    this.xpPetrolDetails.total = positiveTotal.toString();
    this.xpPetrolDetails.xppetrol_ltr = positiveTotal1.toString();
    this.xpPetrolDetails.total_sell = positiveTotal2.toString();
  }


  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  Edit(xpPetrolDetails: any) {
    // singupobj.ID=this.x.id;
    this.use.getUpdateXPPetrol(xpPetrolDetails).subscribe(
      (response) => {
        this.notificationService.success('XP_Petrol data updated successfully');
        this.isReload = true;
        this.dialogRef.close({ 'isReload': this.isReload });
      },
      (error) => {
        console.error('Error updating society data:', error);
        this.isReload = false;
        this.dialogRef.close({ 'isReload': this.isReload });
      }
    );
    // this.dialogRef.close({ 'isReload': this.isReload });
  }
}
