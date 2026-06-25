import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { customer } from 'app/modules/jama-baki/jama-baki-report/customer';
import { CommonService } from 'app/services/common.service';
import { LoaderService } from 'app/services/loader.service';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_CUSTOMER_ADD } from 'app/serviceult';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {


  isReload: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient, private commonService: CommonService,
    private use: UserServiceService, private loaderService: LoaderService,
    public dialogRef: MatDialogRef<CustomerComponent>,
    private notificationService: NotificationService) {
    this.customerDetails = { ...data };
    this.commonService.dialogZIndexAdjustment();
  }

  ngOnInit(): void {
  }

  selectField: string;

  // updatePrice(): void {
  //   // Calculate or set the price based on the selected field
  //   if (this.selectField === '1 Ltr') {
  //     this.customerDetails.price = '100';
  //   } else if (this.selectField === '0.500 Ltr') {
  //     this.customerDetails.price = '200';
  //   }
  // }
  customerDetails: customer = {
    date: new Date(),
    name: '',
    phone: '',
    email: '',
    userId: ''
  };
  // logData(): void {
  //   ('DieselSell Details:', this.customerDetails);
  //   this.use.addOilSell(this.customerDetails).subscribe(
  //     (response) => {
  //       alert("DieselSell Details Successful add........");
  //     },
  //     (error) => {
  //       console.error('API Error:', error);
  //     }
  //   );
  // }
  logData(): void {
    const userId = localStorage.getItem('userId');
    this.customerDetails.userId = userId;
    if (
      !this.customerDetails.date ||
      !this.customerDetails.name?.trim() ||
      !this.customerDetails.phone?.trim() ||
      !this.customerDetails.email?.trim() ||
      !this.customerDetails.userId?.trim()
    ) {
      this.notificationService.failure("Please fill all required fields.");
      return;
    }

    // Make API request to add OilSell details
    this.http.post<any>(API_CUSTOMER_ADD, this.customerDetails).subscribe(
      (response) => {
        this.notificationService.success('Customer Details Successfully added.');
        this.dialogRef.close({ 'isReload': this.isReload });
      },
      (error) => {
        this.notificationService.failure("Customer already add");
        this.dialogRef.close({ 'isReload': this.isReload });
      }
    );
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  Edit(customer: any) {
    // singupobj.ID=this.x.id;
    this.use.getUpdatecustomer(customer).subscribe(
      (response) => {
        this.notificationService.success('Customer data Updated Successfully.');
        this.dialogRef.close({ 'isReload': this.isReload });
      },
      (error) => {
        this.notificationService.failure('Customer data not Updated.');
        this.dialogRef.close({ 'isReload': this.isReload });
      }
    );
  }
}




