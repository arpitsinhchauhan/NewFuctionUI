import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-add-petrol-stock',
  templateUrl: './add-petrol-stock.component.html',
  styleUrls: ['./add-petrol-stock.component.scss']
})
export class AddPetrolStockComponent implements OnInit {

  isReload: boolean;
  stockForm: FormGroup;
  userId: string;
  constructor(private http: HttpClient,private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPetrolStockComponent>,
    @Inject(MAT_DIALOG_DATA) public petrolStock: any,private use:UserServiceService,
    private notificationService: NotificationService, private dialog: MatDialog) {
    // console.log(petrolStock);
  }

  ngOnInit(): void {
    this.stockForm = this.fb.group({
      date: [''],
      openstock: [''],
    });
    if (this.petrolStock) {
      this.stockForm.patchValue({
        date: this.formatDate(this.petrolStock.date),
        openstock: this.petrolStock.openstock
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
    this.use.savePetrolStock(payload).subscribe(
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