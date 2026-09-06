import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tank-details-dialog',
  templateUrl: './tank-details-dialog.component.html',
  styleUrls: ['./tank-details-dialog.component.css']
})
export class TankDetailsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TankDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

  get fuelColor(): string {
    const f = (this.data?.fuelType || '').toLowerCase();
    if (f.includes('petrol') && !f.includes('xp')) return '#28a745'; // Green
    if (f.includes('diesel') && !f.includes('power')) return '#1e88e5'; // Blue
    if (f.includes('xp')) return '#e91e63'; // Pink/Purple
    if (f.includes('power')) return '#00897b'; // Teal
    return '#1e88e5';
  }

  get fuelIcon(): string {
    const f = (this.data?.fuelType || '').toLowerCase();
    return f.includes('petrol') ? 'local_gas_station' : 'ev_station';
  }
}
