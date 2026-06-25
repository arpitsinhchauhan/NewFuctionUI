import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-credit-type',
  templateUrl: './credit-type.component.html',
  styleUrls: ['./credit-type.component.scss']
})
export class CreditTypeComponent implements OnInit {

  isReload: boolean;
  inputValue: string = '';

  constructor(public dialogRef: MatDialogRef<CreditTypeComponent>,
    private user: UserServiceService, private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
  }

  logInput() {
    const payload = {
      userId: localStorage.getItem('userId'),
      creditList: this.inputValue
    };
    this.user.addCreditType(payload).subscribe({
      next: res => {
        if (res) {
          this.notificationService.success("✅ Data saved successfully.");
          this.dialogRef.close({ isReload: this.isReload });
        }
      },
      error: (err) => console.error('Error saving:', err),
    });
  }

  cancel() {
    this.dialogRef.close({ isReload: this.isReload });
  }

}
