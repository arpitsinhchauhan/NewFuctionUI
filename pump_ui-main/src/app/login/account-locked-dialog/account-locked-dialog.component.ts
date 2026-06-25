import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-account-locked-dialog',
  templateUrl: './account-locked-dialog.component.html',
  styleUrls: ['./account-locked-dialog.component.css']
})
export class AccountLockedDialogComponent implements OnInit {
  message = 'Your account has been locked due to security policy violations.';

  constructor(
    private dialogRef: MatDialogRef<AccountLockedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.message) {
      this.message = data.message;
    }
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }
}
