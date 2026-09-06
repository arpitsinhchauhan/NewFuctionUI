import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fuel-tank',
  templateUrl: './fuel-tank.component.html',
  styleUrls: ['./fuel-tank.component.css']
})
export class FuelTankComponent implements OnInit {
  @Input() stockData: any = null;
  @Input() currentStock: number = 0;
  @Input() capacity: number = 20000;
  @Input() label: string = 'Tank';
  @Input() fuelType: string = 'petrol';

  @Output() openDetails = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  get effectiveStock(): number {
    return this.stockData?.currentStock ?? this.currentStock ?? 0;
  }

  get effectiveCapacity(): number {
    return this.stockData?.capacity ?? this.capacity ?? 20000;
  }

  get effectiveLabel(): string {
    return this.stockData?.label ?? this.label ?? 'Tank';
  }

  get effectiveFuelType(): string {
    const f = (this.stockData?.fuelType || this.fuelType || 'petrol').toLowerCase();
    if (f.includes('xp')) return 'xp';
    if (f.includes('power')) return 'power';
    if (f.includes('diesel')) return 'diesel';
    return 'petrol';
  }

  get percentage(): number {
    if (this.stockData?.percentage !== undefined && this.stockData?.percentage !== null) {
      return this.stockData.percentage;
    }
    if (this.effectiveCapacity === 0) return 0;
    return Math.min(100, Math.max(0, (this.effectiveStock / this.effectiveCapacity) * 100));
  }

  get effectiveStatus(): string {
    if (this.stockData?.status) {
      return this.stockData.status;
    }
    return this.percentage <= 15 ? 'CRITICAL' : (this.percentage <= 25 ? 'LOW' : 'NORMAL');
  }

  get physicalStock(): number | null {
    return this.stockData?.physicalStock ?? null;
  }

  get dipMm(): string | null {
    return this.stockData?.dipMm ?? null;
  }

  get lossGain(): number | null {
    return this.stockData?.lossGain ?? null;
  }

  get liquidColor(): string {
    switch (this.effectiveFuelType) {
      case 'petrol': return '#10b981'; // Emerald Green
      case 'diesel': return '#2563eb'; // Royal Blue
      case 'xp': return '#ec4899';     // Pink
      case 'power': return '#059669';  // Deep Teal
      default: return '#2563eb';
    }
  }

  get borderColor(): string {
    switch (this.effectiveFuelType) {
      case 'petrol': return '#047857';
      case 'diesel': return '#1d4ed8';
      case 'xp': return '#be185d';
      case 'power': return '#065f46';
      default: return '#1d4ed8';
    }
  }

  onCardClick(): void {
    const payload = this.stockData ? { ...this.stockData } : {
      fuelType: this.fuelType,
      label: this.label,
      currentStock: this.currentStock,
      capacity: this.capacity,
      percentage: this.percentage,
      status: this.effectiveStatus
    };
    this.openDetails.emit(payload);
  }
}
