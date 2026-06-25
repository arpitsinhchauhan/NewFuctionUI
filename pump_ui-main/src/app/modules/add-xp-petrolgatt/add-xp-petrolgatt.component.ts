import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-add-xp-petrolgatt',
  templateUrl: './add-xp-petrolgatt.component.html',
  styleUrls: ['./add-xp-petrolgatt.component.scss']
})
export class AddXpPetrolgattComponent implements OnInit {


  isReload: boolean;
  gattForm: FormGroup;
  userId: string;
  constructor(private http: HttpClient,private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddXpPetrolgattComponent>,
    @Inject(MAT_DIALOG_DATA) public xppetrolgatt: any,private use:UserServiceService,
    private notificationService: NotificationService, private dialog: MatDialog) {
    // console.log(xppetrolgatt);
  }

  ngOnInit(): void {
    this.gattForm = this.fb.group({
      date: [''],
      xppetrolgatt: [''],
    });
    if (this.xppetrolgatt) {
      this.gattForm.patchValue({
        date: this.formatDate(this.xppetrolgatt.date),
        xppetrolgatt: this.xppetrolgatt.xppetrolgatt
      });
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().substring(0, 10); 
  }

  onSubmit() {
    this.userId = localStorage.getItem('userId');
    if (this.gattForm.invalid) return;
  
    const payload = {
      ...this.gattForm.value,
      userId: this.userId
    };
    this.use.saveXpPetrolGatt(payload).subscribe(
      res => {
        const message = payload.id ? 'gatt updated successfully' : 'gatt added successfully';
        this.notificationService.success(message);
        this.dialogRef.close({ 'isReload': this.isReload });
      },
      err => {
        const errorMessage = payload.id ? 'Failed to update gatt' : 'Failed to add gatt';
        this.notificationService.failure(errorMessage);
        this.dialogRef.close({ 'isReload': this.isReload });
      }
    );
  }
  
  
  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

}
