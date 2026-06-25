import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PurchaseDetails } from 'app/models/PurchaseDetails ';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-edit-purchase',
  templateUrl: './edit-purchase.component.html',
  styleUrls: ['./edit-purchase.component.css']
})
export class EditPurchaseComponent implements OnInit {
  isReload: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    public dialogRef: MatDialogRef<EditPurchaseComponent>,
    private notificationService: NotificationService) {
    this.purchaseDetails = { ...data };
  }

  ngOnInit(): void {
  }
  purchaseDetails: PurchaseDetails = {
    date: new Date(),
    type: '',
    quantity: '',
    total: '',
    vat: '',
    cess: '',
    jtcpercentage: '',
    total_purchase: '',
  };

  logData(): void {
    // Assuming this.use.addPurchase(this.purchaseDetails) is your API call
    if (!this.validateForm()) {
      this.notificationService.failure("Please fill all the required fields.")
      return;
    }
    this.use.addPurchase(this.purchaseDetails).subscribe(
      (response) => {
        this.notificationService.success("Purchase Details Successfully added.")
      },
    );
    this.dialogRef.close({ 'isReload': this.isReload });
  }
  validateForm(): boolean {
    // Check if any required field is empty
    return this.purchaseDetails.date !== null && this.purchaseDetails.type !== '' && this.purchaseDetails.quantity !== '' && this.purchaseDetails.total !== '' && this.purchaseDetails.jtcpercentage !== '';
  }
  calculateTotalPurchase(): void {
    // Convert relevant fields to numbers and add them
    const total = parseFloat(this.purchaseDetails.total);
    const vat = parseFloat(this.purchaseDetails.vat);
    const cess = parseFloat(this.purchaseDetails.cess);
    const jtcpercentage = parseFloat(this.purchaseDetails.jtcpercentage);

    // Ensure that all fields are numeric before calculating the sum
    if (!isNaN(total) && !isNaN(vat) && !isNaN(cess) && !isNaN(jtcpercentage)) {
      this.purchaseDetails.total_purchase = (total + vat + cess + jtcpercentage).toString();
    } else {
      // Handle the case where one or more fields are not numeric
      this.purchaseDetails.total_purchase = '';
    }
  }


  Edit(purchaseDetails: any) {
    // singupobj.ID=this.x.id;
    this.use.getUpdatePurchase(purchaseDetails).subscribe(
      (response:any) => {
        this.notificationService.success('Purchase data updated successfully');
        this.isReload = true;
        this.dialogRef.close({ 'isReload': this.isReload });
      },
    );
    // this.use.getUpdatePurchase(purchaseDetails).subscribe(
    //   (response:any) => {
    //     console.log(response);
        
    //     this.notificationService.success('Purchase data updated successfully');
    //   },
    //   (error) => {
    //     console.error('Error updating society data:', error);
    //   }
    // );
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}