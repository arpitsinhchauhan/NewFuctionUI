import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_SEND_SMS, API_SEND_WHATSAPP } from 'app/serviceult';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-oill-bill',
  templateUrl: './oill-bill.component.html',
  styleUrls: ['./oill-bill.component.scss']
})
export class OillBillComponent implements OnInit {

  oillData: any;

  constructor(
    public dialogRef: MatDialogRef<OillBillComponent>,
    public notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService
  ) {
    if (data) {
      this.oillData = data;
    }
  }

  ngOnInit(): void {

  }

  getGrandTotal(): number {
    return this.oillData?.items?.reduce((sum: number, i: any) => sum + i.total, 0) || 0;
  }


  downloadPDF() {
    this.notificationService.warning('Generating PDF... Please wait', 2000);
    const element = document.getElementById('invoice');
    const options = {
      margin: 10,
      filename: `invoice_${this.oillData.date}.pdf`,
      image: { type: 'jpeg', quality: 0.92 },
      html2canvas: { scale: 1.5, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save().then(() => {
      this.notificationService.success('PDF Downloaded successfully!');
    }).catch(err => {
      console.error(err);
      this.notificationService.failure('Failed to download PDF.');
    });
  }

  printInvoice() {
    window.print();
  }

  sendBill() {
    if (!this.oillData?.customer?.phone) {
      alert('Customer phone number not available.');
      return;
    }
    const baseUrl = API_SEND_SMS;
    const to = this.oillData.customer.phone.startsWith('+')
      ? this.oillData.customer.phone
      : '+91' + this.oillData.customer.phone.trim();
    const message = `Dear ${this.oillData.customer.name}, your Oil bill for ${this.oillData.oilType} on ${this.oillData.date} is ₹${this.oillData.price}. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    const finalUrl = `${baseUrl}?to=${to}&message=${encodedMessage}`;
    this.http.get(finalUrl, { responseType: 'text' })
      .subscribe({
        next: (res) =>
          this.notificationService.success(res),
      });
  }

  sendBillWhatsapp() {
    let to = this.oillData?.customer?.phone || '';
    // Clean up spaces/plus signs
    to = to.trim().replace(/\+/g, '').replace(/\s+/g, '');

    // If customer number does NOT exist (or is just '91' prefix), prompt the user to set/enter it
    if (!to || to === '91') {
      const userPhone = prompt('Enter customer WhatsApp number (with country code, e.g. 919876543210):', '91');
      if (userPhone === null) {
        return; // Cancelled by user
      }
      to = userPhone.trim().replace(/\+/g, '').replace(/\s+/g, '');
      if (!to) {
        this.notificationService.failure('WhatsApp number is required.');
        return;
      }

      // Default to +91 (India) country code if the user enters a 10-digit number
      if (to.length === 10) {
        to = '91' + to;
      }

      // Update locally so the UI reflects the new number
      if (this.oillData?.customer) {
        this.oillData.customer.phone = to;

        // Persist the updated phone number in the database
        this.use.getUpdatecustomer(this.oillData.customer).subscribe({
          next: (response) => {
            this.notificationService.success('Customer phone number updated successfully.');
          },
          error: (error) => {
            console.error('Failed to update customer phone number in database:', error);
          }
        });
      }
    } else {
      // If customer phone is already set, ensure it has country code if it is 10 digits
      if (to.length === 10) {
        to = '91' + to;
        
        // Optionally update it in database with country code
        if (this.oillData?.customer) {
          this.oillData.customer.phone = to;
          this.use.getUpdatecustomer(this.oillData.customer).subscribe();
        }
      }
    }

    const pumpName = this.oillData.PumpName || 'Our Fuel Station';
    const totalAmount = this.oillData.price;
    const billDate = new Date(this.oillData.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    const message = `⛽ *LUBRICANT RECEIPT* ⛽\n` +
      `-------------------------------------------\n` +
      `*Station:* ${pumpName}\n` +
      `*Date:* ${billDate}\n` +
      `*Customer:* ${this.oillData.customer.name}\n\n` +
      `*Product:* ${this.oillData.oilType}\n` +
      `*Amount:* ₹${totalAmount}\n` +
      `*Notes:* ${this.oillData.note || 'N/A'}\n` +
      `-------------------------------------------\n` +
      `*Total Paid:* ₹${totalAmount}\n` +
      `-------------------------------------------\n` +
      `Thank you for your business! Please find the attached PDF receipt for your records.\n\n` +
      `*Sent by:* ${pumpName}`;

    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp Web synchronously to bypass browser pop-up blocker
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${to}&text=${encodedMessage}`;
    const newTab = window.open(whatsappUrl, '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      this.notificationService.warning('Pop-up was blocked. Please allow pop-ups for this website.');
    }

    // Generate and download the PDF in the background
    this.notificationService.warning('Generating PDF receipt... Please wait', 2000);
    const element = document.getElementById('invoice');
    const options = {
      margin: 10,
      filename: `receipt_${this.oillData.customer.name.replace(/\s+/g, '_')}_${this.oillData.date}.pdf`,
      image: { type: 'jpeg', quality: 0.92 },
      html2canvas: { scale: 1.5, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save().then(() => {
      this.notificationService.success('PDF Receipt generated and downloaded!');
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message).catch(err => console.warn('Could not copy text to clipboard', err));
      }
      this.notificationService.success('You can now drag the downloaded PDF into the WhatsApp Web chat!');
    }).catch((err: any) => {
      console.error(err);
      this.notificationService.failure('Failed to generate PDF.');
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}



