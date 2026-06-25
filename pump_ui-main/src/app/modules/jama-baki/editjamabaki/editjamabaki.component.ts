import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-editjamabaki',
  templateUrl: './editjamabaki.component.html',
  styleUrls: ['./editjamabaki.component.css']
})
export class EditjamabakiComponent implements OnInit {

  isReload: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditjamabakiComponent>,
    private userServiceService: UserServiceService,
    private notificationService: NotificationService) {
    // console.log(data);
  }

  ngOnInit(): void {
    if (!this.data.jama) {
      this.data.jama = 0;
    }
    if (!this.data.baki) {
      this.data.baki = 0;
    }
  }

  Edit() {
    this.userServiceService.updateJamabaki(this.data).subscribe(
      response => {
        this.notificationService.success('Edit Data updated successfully');
        this.dialogRef.close();
      },
      error => {
        console.error('Error updating data', error);
        // Handle the error accordingly
      }
    );
  }
  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

}
