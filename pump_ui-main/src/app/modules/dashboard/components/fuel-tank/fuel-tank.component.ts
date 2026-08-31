import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fuel-tank',
  templateUrl: './fuel-tank.component.html',
  styleUrls: ['./fuel-tank.component.css']
})
export class FuelTankComponent implements OnInit {
  @Input() currentStock: number = 0;
  @Input() capacity: number = 20000;
  @Input() label: string = 'Tank';
  @Input() fuelType: 'petrol' | 'diesel' | 'xp' | 'power' = 'petrol';

  constructor() { }

  ngOnInit(): void {
  }

  get percentage(): number {
    if (this.capacity === 0) return 0;
    return Math.min(100, Math.max(0, (this.currentStock / this.capacity) * 100));
  }

  get liquidColor(): string {
    switch (this.fuelType) {
      case 'petrol': return '#28a745'; // Green
      case 'diesel': return '#4b6cb7'; // Blue
      case 'xp': return '#ef7c8f'; // Pink
      case 'power': return '#00A36C'; // Teal
      default: return '#4b6cb7';
    }
  }

  get borderColor(): string {
    switch (this.fuelType) {
      case 'petrol': return '#1e7e34';
      case 'diesel': return '#182848';
      case 'xp': return '#d63384';
      case 'power': return '#00754a';
      default: return '#182848';
    }
  }
}
