import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-add-xp-petrol-stock',
  templateUrl: './add-xp-petrol-stock.component.html',
  styleUrls: ['./add-xp-petrol-stock.component.scss']
})
export class AddXpPetrolStockComponent implements OnInit {

  isReload: boolean;
    stockForm: FormGroup;
    userId: string;
    constructor(private http: HttpClient,private fb: FormBuilder,
      public dialogRef: MatDialogRef<AddXpPetrolStockComponent>,
      @Inject(MAT_DIALOG_DATA) public XppetrolStock: any,private use:UserServiceService,
      private notificationService: NotificationService, private dialog: MatDialog) {
        // console.log(XppetrolStock);
        
    }
  
    ngOnInit(): void {
      this.stockForm = this.fb.group({
        date: [''],
        xp_ugadto_stock: [''],
      });
      if (this.XppetrolStock) {
        this.stockForm.patchValue({
          date: this.formatDate(this.XppetrolStock.date),
          xp_ugadto_stock: this.XppetrolStock.xp_ugadto_stock
        });
      }
    }
  
    formatDate(dateStr: string): string {
      const date = new Date(dateStr);
      return date.toISOString().substring(0, 10); 
    }
  
    onSubmit() {
      this.userId = localStorage.getItem('userId');
      if (this.stockForm.invalid) return;
      const payload = {
        ...this.stockForm.value,
        userId: this.userId
      };
      this.use.saveXPPetrolStock(payload).subscribe(
        res => {
          const message = payload.id ? 'Stock updated successfully' : 'Stock added successfully';
          this.notificationService.success(message);
          this.dialogRef.close({ 'isReload': this.isReload });
        },
        err => {
          const errorMessage = payload.id ? 'Failed to update stock' : 'Failed to add stock';
          this.notificationService.failure(errorMessage);
          this.dialogRef.close({ 'isReload': this.isReload });
        }
      );
    }
    
    
    cancel() {
      this.dialogRef.close({ 'isReload': this.isReload });
    }
  
  }