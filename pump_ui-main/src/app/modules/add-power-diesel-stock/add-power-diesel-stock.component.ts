import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-add-power-diesel-stock',
  templateUrl: './add-power-diesel-stock.component.html',
  styleUrls: ['./add-power-diesel-stock.component.scss']
})
export class AddPowerDieselStockComponent implements OnInit {

  
    
    isReload: boolean;
    stockForm: FormGroup;
    userId: string;
    constructor(private http: HttpClient,private fb: FormBuilder,
      public dialogRef: MatDialogRef<AddPowerDieselStockComponent>,
      @Inject(MAT_DIALOG_DATA) public PowerdieselStock: any,private use:UserServiceService,
      private notificationService: NotificationService, private dialog: MatDialog) {
    }
  
    ngOnInit(): void {
      this.stockForm = this.fb.group({
        date: [''],
        power_ugadto_stock: [''],
      });
      if (this.PowerdieselStock) {
        this.stockForm.patchValue({
          date: this.formatDate(this.PowerdieselStock.date),
          power_ugadto_stock  : this.PowerdieselStock.power_ugadto_stock
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
      this.use.savePowerdieselStock(payload).subscribe(
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
  