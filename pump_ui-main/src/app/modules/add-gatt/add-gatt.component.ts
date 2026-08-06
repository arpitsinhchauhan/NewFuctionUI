import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-add-gatt',
  templateUrl: './add-gatt.component.html',
  styleUrls: ['./add-gatt.component.scss']
})
export class AddGattComponent implements OnInit {

  
    isReload: boolean;
    stockForm: FormGroup;
    userId: string;
    constructor(private http: HttpClient,private fb: FormBuilder,
      public dialogRef: MatDialogRef<AddGattComponent>,
      @Inject(MAT_DIALOG_DATA) public petrolgatt: any,private use:UserServiceService,
      private notificationService: NotificationService, private dialog: MatDialog) {
      // console.log(petrolgatt);
    }
  
    ngOnInit(): void {
      this.stockForm = this.fb.group({
        date: [''],
        petrolgatt: [''],
      });
      if (this.petrolgatt) {
        this.stockForm.patchValue({
          date: this.formatDate(this.petrolgatt.date),
          petrolgatt: this.petrolgatt.petrolgatt
        });
      }
    }
  
    formatDate(dateStr: string): string {
      const date = new Date(dateStr);
      return date.toISOString().substring(0, 10); 
    }
  
    onSubmit() {
      this.userId = this.petrolgatt?.userId || localStorage.getItem('userId');
      if (this.stockForm.invalid) return;
    
      const  payload = {
        ...this.stockForm.value,
        userId: this.userId
      };
      this.use.savePetrolGatt(payload).subscribe(
        res => {
          const message = payload.id ? 'petrolgatt updated successfully' : 'petrolgatt added successfully';
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