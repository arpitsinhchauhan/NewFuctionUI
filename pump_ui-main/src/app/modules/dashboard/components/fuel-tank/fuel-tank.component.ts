import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-fuel-tank',
  templateUrl: './fuel-tank.component.html',
  styleUrls: ['./fuel-tank.component.css']
})
export class FuelTankComponent implements OnInit, OnChanges {
  @Input() stockData: any = null;
  @Input() currentStock: number = 0;
  @Input() capacity: number = 20000;
  @Input() label: string = 'Petrol';
  @Input() fuelType: string = 'petrol';

  @Output() openDetails = new EventEmitter<any>();

  // Calculated properties matching exact reference design
  effectiveStock: number = 0;
  effectiveCapacity: number = 20000;
  effectiveCriticalLimit: number = 3000;
  effectiveWarningLimit: number = 6000;
  availableSpace: number = 17000;
  percentage: number = 0;
  displayPercentage: number = 0;

  effectiveStatus: 'CRITICAL' | 'WARNING' | 'NORMAL' | 'FULL' = 'NORMAL';
  statusLabel: string = 'NORMAL';
  statusColor: string = '#16a34a';

  effectiveLabel: string = 'Petrol';
  effectiveFuelType: string = 'petrol';

  // SVG dynamic fill properties
  liquidTopY: number = 180;
  liquidPath: string = '';

  constructor() { }

  ngOnInit(): void {
    this.calculateProperties();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateProperties();
  }

  private calculateProperties(): void {
    const data = this.stockData;

    // 1. Stock & Capacity
    this.effectiveStock = data?.currentStock !== undefined && data?.currentStock !== null
      ? Number(data.currentStock)
      : Number(this.currentStock) || 0;

    this.effectiveCapacity = data?.capacity !== undefined && data?.capacity !== null && Number(data.capacity) > 0
      ? Number(data.capacity)
      : (data?.tankCapacity !== undefined && data?.tankCapacity !== null && Number(data.tankCapacity) > 0
        ? Number(data.tankCapacity)
        : Number(this.capacity) || 20000);

    // 2. Limits (in Litres)
    let crit = Number(data?.criticalLimit);
    if (isNaN(crit) || !crit || crit <= 0) {
      const rawAlert = Number(data?.alertLevel);
      if (!isNaN(rawAlert) && rawAlert > 0) {
        crit = rawAlert <= 100 ? Math.round((this.effectiveCapacity * rawAlert) / 100) : rawAlert;
      } else {
        crit = 3000;
      }
    } else if (crit <= 100) {
      crit = Math.round((this.effectiveCapacity * crit) / 100);
    }
    this.effectiveCriticalLimit = crit || 3000;

    let warn = Number(data?.warningLimit);
    if (isNaN(warn) || !warn || warn <= 0) {
      const rawMin = Number(data?.minimumStock || data?.minStockLevel);
      if (!isNaN(rawMin) && rawMin > 0) {
        warn = rawMin <= 100 ? Math.round((this.effectiveCapacity * rawMin) / 100) : rawMin;
      } else {
        warn = 6000;
      }
    } else if (warn <= 100) {
      warn = Math.round((this.effectiveCapacity * warn) / 100);
    }
    this.effectiveWarningLimit = warn || 6000;

    // 3. Available Space
    this.availableSpace = Math.max(0, this.effectiveCapacity - this.effectiveStock);

    // 4. Percentage: (Current Stock / Tank Capacity) * 100
    if (this.effectiveCapacity > 0) {
      this.percentage = (this.effectiveStock / this.effectiveCapacity) * 100;
      this.displayPercentage = Math.round(this.percentage);
    } else {
      this.percentage = 0;
      this.displayPercentage = 0;
    }

    // 5. Fuel Type & Display Label
    const rawFuel = (data?.fuelType || this.fuelType || 'petrol').toLowerCase();
    if (rawFuel.includes('xp')) {
      this.effectiveFuelType = 'xp';
    } else if (rawFuel.includes('power')) {
      this.effectiveFuelType = 'power';
    } else if (rawFuel.includes('diesel')) {
      this.effectiveFuelType = 'diesel';
    } else {
      this.effectiveFuelType = 'petrol';
    }

    this.effectiveLabel = data?.label || data?.tankName || this.label ||
      (this.effectiveFuelType === 'diesel' ? 'Diesel' : 'Petrol');

    // 6. Status & Color Logic matching exact reference requirements:
    // CRITICAL: currentStock <= 3000 -> RED -> "CRITICAL - LOW STOCK"
    // WARNING: currentStock > 3000 && currentStock <= 6000 -> ORANGE -> "WARNING - LOW STOCK"
    // NORMAL: currentStock > 6000 && currentStock < capacity -> GREEN -> "NORMAL"
    // FULL: currentStock >= capacity -> BLUE -> "FULL"
    if (this.effectiveStock >= this.effectiveCapacity && this.effectiveCapacity > 0) {
      this.effectiveStatus = 'FULL';
      this.statusLabel = 'FULL';
      this.statusColor = '#2563eb'; // Blue
    } else if (this.effectiveStock <= this.effectiveCriticalLimit) {
      this.effectiveStatus = 'CRITICAL';
      this.statusLabel = 'CRITICAL - LOW STOCK';
      this.statusColor = '#dc2626'; // Red
    } else if (this.effectiveStock <= this.effectiveWarningLimit) {
      this.effectiveStatus = 'WARNING';
      this.statusLabel = 'WARNING - LOW STOCK';
      this.statusColor = '#f59e0b'; // Orange
    } else {
      this.effectiveStatus = 'NORMAL';
      this.statusLabel = 'NORMAL';
      this.statusColor = '#16a34a'; // Green
    }

    // 7. Cylindrical SVG Liquid Level Calculations
    // Cylinder body: top Y = 40, bottom Y = 180 (height = 140)
    const clampedPct = Math.min(100, Math.max(0, this.percentage));
    this.liquidTopY = Math.round(180 - (clampedPct / 100) * 140);
    this.liquidPath = `M 25.5 ${this.liquidTopY} L 25.5 180 C 25.5 189.5, 134.5 189.5, 134.5 180 L 134.5 ${this.liquidTopY} Z`;
  }

  get cardThemeClass(): string {
    switch (this.effectiveStatus) {
      case 'CRITICAL': return 'card-theme-critical';
      case 'WARNING': return 'card-theme-warning';
      case 'FULL': return 'card-theme-full';
      case 'NORMAL':
      default: return 'card-theme-normal';
    }
  }

  get statusPillClass(): string {
    switch (this.effectiveStatus) {
      case 'CRITICAL': return 'pill-critical';
      case 'WARNING': return 'pill-warning';
      case 'FULL': return 'pill-full';
      case 'NORMAL':
      default: return 'pill-normal';
    }
  }

  onCardClick(): void {
    const payload = this.stockData ? { ...this.stockData } : {
      fuelType: this.effectiveFuelType,
      label: this.effectiveLabel,
      tankName: this.effectiveLabel,
      currentStock: this.effectiveStock,
      capacity: this.effectiveCapacity,
      criticalLimit: this.effectiveCriticalLimit,
      warningLimit: this.effectiveWarningLimit,
      percentage: this.displayPercentage,
      status: this.effectiveStatus,
      statusLabel: this.statusLabel
    };
    this.openDetails.emit(payload);
  }
}
