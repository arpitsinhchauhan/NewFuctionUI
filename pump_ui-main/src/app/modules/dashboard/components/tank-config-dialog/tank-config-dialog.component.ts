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
    this.loadConfigurations();
  }

  loadConfigurations(): void {
    this.isLoading = true;
    this.userService.getTankConfigs(this.userId).subscribe(
      (res: any[]) => {
        this.isLoading = false;
        if (res && res.length > 0) {
          this.tanks = res.map(t => this.normalizeTank(t));
        } else if (this.data?.tanks && this.data.tanks.length > 0) {
          this.tanks = this.data.tanks.map((t: any) => this.normalizeTank(t));
        }
      },
      (err) => {
        this.isLoading = false;
        console.error('Error loading tank configs', err);
        if (this.data?.tanks && this.data.tanks.length > 0) {
          this.tanks = this.data.tanks.map((t: any) => this.normalizeTank(t));
        }
      }
    );
  }

  normalizeTank(tank: any): any {
    const fuel = (tank.fuelType || '').toLowerCase();
    const defaultCapacity = (fuel.includes('xp') || fuel.includes('power')) ? 10000 : 20000;
    const defaultCritical = (fuel.includes('xp') || fuel.includes('power')) ? 1500 : 3000;
    const defaultWarning = (fuel.includes('xp') || fuel.includes('power')) ? 3000 : 6000;

    const cap = Number(tank.tankCapacity || tank.capacity) || defaultCapacity;

    // Resolve Critical Limit in Litres
    let crit = Number(tank.criticalLimit);
    if (isNaN(crit) || crit === undefined || crit === null) {
      if (tank.alertLevel !== undefined && tank.alertLevel !== null) {
        crit = Number(tank.alertLevel);
        // If legacy percentage <= 100, convert to Litres
        if (crit <= 100) {
          crit = Math.round((cap * crit) / 100);
        }
      } else {
        crit = defaultCritical;
      }
    } else if (crit <= 100) {
      // Legacy percentage conversion
      crit = Math.round((cap * crit) / 100);
    }

    // Resolve Warning Limit in Litres
    let warn = Number(tank.warningLimit);
    if (isNaN(warn) || warn === undefined || warn === null) {
      const rawMin = tank.minStockLevel !== undefined ? tank.minStockLevel : tank.minimumStock;
      if (rawMin !== undefined && rawMin !== null) {
        warn = Number(rawMin);
        // If legacy percentage <= 100, convert to Litres
        if (warn <= 100) {
          warn = Math.round((cap * warn) / 100);
        }
      } else {
        warn = defaultWarning;
      }
    } else if (warn <= 100) {
      // Legacy percentage conversion
      warn = Math.round((cap * warn) / 100);
    }

    return {
      id: tank.id,
      pumpId: tank.pumpId,
      userId: this.userId,
      fuelType: tank.fuelType || 'petrol',
      tankName: tank.tankName || (fuel.includes('diesel') ? 'Diesel Tank' : 'Petrol Tank'),
      tankCapacity: cap,
      capacity: cap,
      criticalLimit: crit,
      warningLimit: warn,
      active: tank.active !== undefined ? tank.active : true
    };
  }

  saveTank(tank: any): void {
    const cap = Number(tank.tankCapacity || tank.capacity);
    const crit = Number(tank.criticalLimit);
    const warn = Number(tank.warningLimit);

    // Strict Validations required by business rules
    if (!cap || cap <= 0) {
      this.notificationService.failure('Tank capacity must be greater than 0 Litres.');
      return;
    }
    if (crit === undefined || isNaN(crit) || crit < 0) {
      this.notificationService.failure('Critical limit must be 0 or greater.');
      return;
    }
    if (crit >= cap) {
      this.notificationService.failure(`Critical limit (${crit} L) must be strictly less than capacity (${cap} L).`);
      return;
    }
    if (warn === undefined || isNaN(warn) || warn <= crit) {
      this.notificationService.failure(`Warning limit (${warn} L) must be strictly greater than critical limit (${crit} L).`);
      return;
    }
    if (warn >= cap) {
      this.notificationService.failure(`Warning limit (${warn} L) must be strictly less than capacity (${cap} L).`);
      return;
    }

    const payload = {
      id: tank.id,
      pumpId: tank.pumpId,
      userId: this.userId,
      fuelType: tank.fuelType,
      tankName: tank.tankName,
      tankCapacity: cap,
      capacity: cap,
      criticalLimit: crit,
      alertLevel: crit,
      warningLimit: warn,
      minStockLevel: warn,
      active: true
    };

    this.isSaving = true;
    this.userService.saveTankConfig(payload).subscribe(
      (res) => {
        this.isSaving = false;
        this.notificationService.success(`${tank.tankName || tank.fuelType} configuration saved successfully.`);
      },
      (err) => {
        this.isSaving = false;
        const msg = err?.error?.message || err?.error || 'Failed to save tank configuration.';
        this.notificationService.failure(msg);
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
