import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PetrolSellDetails } from 'app/models/PetrolSellDetails';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { EditPurchaseComponent } from '../../table-list/edit-purchase/edit-purchase.component';

@Component({
  selector: 'app-edit-petrolsell',
  templateUrl: './edit-petrolsell.component.html',
  styleUrls: ['./edit-petrolsell.component.css']
})
export class EditPetrolsellComponent implements OnInit {
  isReload: boolean;
  petrolpumpList: string[] = ['Petrol Pump 1', 'Petrol Pump 2', 'Petrol Pump 3', 'Petrol Pump 4', 'Petrol Pump 5'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    public dialogRef: MatDialogRef<EditPurchaseComponent>,
    private notificationService: NotificationService) {
    this.petrolSellDetails = { ...data };
  }
  petrolSellDetails: PetrolSellDetails = {
    date: '',
    pump: '',
    close_meter: '',
    open_meter: '',
    total: '',
    testing: '',
    petrol_ltr: '',
    rate: '',
    total_sell: '',
  };


  ngOnInit(): void {
    // Perform initial calculations when component initializes
    this.calculateValues();
  }

  calculateValues(): void {
    const openMeter = parseFloat(this.petrolSellDetails.open_meter);
    const closeMeter = parseFloat(this.petrolSellDetails.close_meter);
    const testing = parseFloat(this.petrolSellDetails.testing);
    const rate = parseFloat(this.petrolSellDetails.rate);

    const total = closeMeter - openMeter;
    const petrol_ltr = total - testing;
    const totalSell = petrol_ltr * rate;

    // Ensure total is positive
    const positiveTotal = Math.abs(total);
    const positiveTotal1 = Math.abs(petrol_ltr);
    const positiveTotal2 = Math.abs(totalSell);

    // Update the petrolSellDetails object
    this.petrolSellDetails.total = positiveTotal.toString();
    this.petrolSellDetails.petrol_ltr = positiveTotal1.toString();
    this.petrolSellDetails.total_sell = positiveTotal2.toString();
  }



  logData(): void {
    // Check if all fields are filled
    if (
      this.petrolSellDetails.pump &&
      this.petrolSellDetails.close_meter &&
      this.petrolSellDetails.open_meter &&
      this.petrolSellDetails.testing &&
      this.petrolSellDetails.rate
    ) {
      // Call calculateValues to update values

      // Then proceed with adding the details
      this.use.addPetrolSell(this.petrolSellDetails).subscribe(
        (response) => {
          this.notificationService.success("PetrolSell Details Successfully added.");
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
    this.calculateValues();
  }



  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  Edit(petrolSellDetails: any) {
    // singupobj.ID=this.x.id;
    this.use.getUpdatePetrol(petrolSellDetails).subscribe(
      (response) => {
        this.notificationService.success('PetrolSell data updated successfully');
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
