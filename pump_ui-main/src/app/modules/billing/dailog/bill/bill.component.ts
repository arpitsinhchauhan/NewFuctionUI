import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_SEND_SMS, API_SEND_WHATSAPP } from 'app/serviceult';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {

  billData: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private use: UserServiceService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    if (data) {
      this.billData = data;
    }
  }

  ngOnInit(): void {
    // console.log('Bill Data Received in ngOnInit:', this.billData);
  }

  getGrandTotal(): number {
    return this.billData?.items?.reduce((sum: number, i: any) => sum + i.total, 0) || 0;
  }


  downloadPDF() {
    this.notificationService.warning('Generating PDF... Please wait', 2000);
    const element = document.getElementById('invoice');
    const options = {
      margin: 10,
      filename: `invoice_${this.billData.date}.pdf`,
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

  sendBakiBill() {
    if (!this.billData?.customer?.phone) {
      alert('Customer phone number not available.');
      return;
    }
    const baseUrl = API_SEND_SMS;
    const to = this.billData.customer.phone.startsWith('+')
      ? this.billData.customer.phone.replace(/\s+/g, '')
      : '+91' + this.billData.customer.phone.trim().replace(/\s+/g, '');
    
    const pumpName = this.billData.PumpName || 'our Fuel Pump';
    const totalAmount = this.getGrandTotal();
    const billDate = new Date(this.billData.date).toLocaleDateString('en-IN');
    const itemSummary = this.billData.items
      .map(item => `${item.type} ${item.ltr}L x ₹${item.rate} = ₹${item.total}`)
      .join(', ');
    
    const message = `Dear ${this.billData.customer.name}, your Baki bill dated ${billDate} at ${pumpName} includes: ${itemSummary}. Total payable: ₹${totalAmount}. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    const finalUrl = `${baseUrl}?to=${to}&message=${encodedMessage}`;
    this.http.get(finalUrl, { responseType: 'text' })
      .subscribe({
        next: (res) => this.notificationService.success(res)
      });
  }

  sendBakiBillWhatsapp() {
    let to = this.billData?.customer?.phone || '';
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
      if (this.billData?.customer) {
        this.billData.customer.phone = to;

        // Persist the updated phone number in the database
        this.use.getUpdatecustomer(this.billData.customer).subscribe({
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
        if (this.billData?.customer) {
          this.billData.customer.phone = to;
          this.use.getUpdatecustomer(this.billData.customer).subscribe();
        }
      }
    }

    const pumpName = this.billData.PumpName || 'Our Fuel Station';
    const totalAmount = this.getGrandTotal();
    const billDate = new Date(this.billData.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    const itemSummary = this.billData.items
      .map(item => `• *${item.type}*: ${item.ltr}L @ ₹${item.rate}/L = ₹${item.total}`)
      .join('\n');

    const message = `⛽ *CREDIT BILL RECEIPT* ⛽\n` +
      `-------------------------------------------\n` +
      `*Station:* ${pumpName}\n` +
      `*Date:* ${billDate}\n` +
      `*Customer:* ${this.billData.customer.name}\n\n` +
      `*Items Summary:*\n${itemSummary}\n` +
      `-------------------------------------------\n` +
      `*Total Payable:* ₹${totalAmount}\n` +
      `-------------------------------------------\n` +
      `Thank you for your business! Please find the attached PDF invoice for your records.\n\n` +
      `*Sent by:* ${pumpName}`;

    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp Web synchronously to bypass browser pop-up blocker
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${to}&text=${encodedMessage}`;
    const newTab = window.open(whatsappUrl, '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      this.notificationService.warning('Pop-up was blocked. Please allow pop-ups for this website.');
    }

    // Generate and download the PDF in the background
    this.notificationService.warning('Generating PDF invoice... Please wait', 2000);
    const element = document.getElementById('invoice');
    const options = {
      margin: 10,
      filename: `invoice_${this.billData.customer.name.replace(/\s+/g, '_')}_${this.billData.date}.pdf`,
      image: { type: 'jpeg', quality: 0.92 },
      html2canvas: { scale: 1.5, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save().then(() => {
      this.notificationService.success('PDF Invoice generated and downloaded!');
      
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
