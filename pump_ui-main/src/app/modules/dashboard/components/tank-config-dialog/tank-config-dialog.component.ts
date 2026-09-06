import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-tank-config-dialog',
  templateUrl: './tank-config-dialog.component.html',
  styleUrls: ['./tank-config-dialog.component.css']
})
export class TankConfigDialogComponent implements OnInit {

  tanks: any[] = [];
  userId: string = '';
  isLoading: boolean = false;
  isSaving: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TankConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserServiceService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.userId = this.data?.userId || localStorage.getItem('userId') || '';
    if (this.data?.tanks && this.data.tanks.length > 0) {
      // Deep copy to prevent accidental live mutation until saved
      this.tanks = JSON.parse(JSON.stringify(this.data.tanks));
    } else {
      this.loadConfigurations();
    }
  }

  loadConfigurations(): void {
    this.isLoading = true;
    this.userService.getTankConfigs(this.userId).subscribe(
      (res: any[]) => {
        this.isLoading = false;
        if (res && res.length > 0) {
          this.tanks = res;
        }
      },
      (err) => {
        this.isLoading = false;
        console.error('Error loading tank configs', err);
      }
    );
  }

  saveTank(tank: any): void {
    if (!tank.capacity || tank.capacity <= 0) {
      this.notificationService.failure('Please enter a valid tank capacity in litres.');
      return;
    }
    tank.userId = this.userId;
    this.isSaving = true;
    this.userService.saveTankConfig(tank).subscribe(
      (res) => {
        this.isSaving = false;
        this.notificationService.success(`${tank.label || tank.tankName} configuration updated.`);
      },
      (err) => {
        this.isSaving = false;
        this.notificationService.failure('Failed to save configuration.');
      }
    );
  }

  saveAllAndClose(): void {
    this.dialogRef.close(true);
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
