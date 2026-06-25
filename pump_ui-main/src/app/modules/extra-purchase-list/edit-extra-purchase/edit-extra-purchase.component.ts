import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExtraPurchaseDetails } from 'app/models/ExtraPurchaseDetails';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-edit-extra-purchase',
  templateUrl: './edit-extra-purchase.component.html',
  styleUrls: ['./edit-extra-purchase.component.scss']
})
export class EditExtraPurchaseComponent implements OnInit {

  isReload: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    public dialogRef: MatDialogRef<EditExtraPurchaseComponent>,
    private notificationService: NotificationService) {
    this.extraPurchaseDetails = { ...data };
  }

  ngOnInit(): void {
  }
  extraPurchaseDetails: ExtraPurchaseDetails = {
    date: new Date(),
    extraType: '',
    extra_quantity: '',
    extra_total: '',
    extra_vat: '',
    extra_cess: '',
    extra_jtcpercentage: '',
    extra_total_purchase: '',
  };

 
  validateForm(): boolean {
    // Check if any required field is empty
    return this.extraPurchaseDetails.date !== null && this.extraPurchaseDetails.extraType !== '' && this.extraPurchaseDetails.extra_quantity !== '' && this.extraPurchaseDetails.extra_total !== '' && this.extraPurchaseDetails.extra_jtcpercentage !== '';
  }

  calculateTotalPurchase(): void {
    // Convert relevant fields to numbers and add them
    const total = parseFloat(this.extraPurchaseDetails.extra_total);
    const vat = parseFloat(this.extraPurchaseDetails.extra_vat);
    const cess = parseFloat(this.extraPurchaseDetails.extra_cess);
    const jtcpercentage = parseFloat(this.extraPurchaseDetails.extra_jtcpercentage);

    // Ensure that all fields are numeric before calculating the sum
    if (!isNaN(total) && !isNaN(vat) && !isNaN(cess) && !isNaN(jtcpercentage)) {
      this.extraPurchaseDetails.extra_total_purchase = (total + vat + cess + jtcpercentage).toString();
    } else {
      // Handle the case where one or more fields are not numeric
      this.extraPurchaseDetails.extra_total_purchase = '';
    }
  }


  Edit(extraPurchaseDetails: any) {
    // singupobj.ID=this.x.id;
    this.use.getUpdateExtraPurchase(extraPurchaseDetails).subscribe(
      (response:any) => {
        this.notificationService.success('Extra Purchase data updated successfully');
        this.isReload = true;
        this.dialogRef.close({ 'isReload': this.isReload });
      },
    );
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}
