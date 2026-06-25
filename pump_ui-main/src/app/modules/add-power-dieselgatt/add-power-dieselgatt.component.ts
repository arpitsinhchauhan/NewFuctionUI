import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-add-power-dieselgatt',
  templateUrl: './add-power-dieselgatt.component.html',
  styleUrls: ['./add-power-dieselgatt.component.scss']
})
export class AddPowerDieselgattComponent implements OnInit {

 
  isReload: boolean;
  PowerDieselForm: FormGroup;
  userId: string;
  constructor(private http: HttpClient,private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPowerDieselgattComponent>,
    @Inject(MAT_DIALOG_DATA) public PowerDieselgatt: any,private use:UserServiceService,
    private notificationService: NotificationService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.PowerDieselForm = this.fb.group({
      date: [''],
      powerDieselgatt: [''],
    });
    if (this.PowerDieselgatt) {
      this.PowerDieselForm.patchValue({
        date: this.formatDate(this.PowerDieselgatt.date),
        powerDieselgatt: this.PowerDieselgatt.PowerDieselgatt
      });
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().substring(0, 10); 
  }

  onSubmit() {
    this.userId = localStorage.getItem('userId');
    if (this.PowerDieselForm.invalid) return;
  
    const  payload = {
      ...this.PowerDieselForm.value,
      userId: this.userId
    };
    this.use.savePowerDieselGatt(payload).subscribe(
      res => {
        const message = payload.id ? 'PowerDieselgatt updated successfully' : 'PowerDieselgatt added successfully';
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