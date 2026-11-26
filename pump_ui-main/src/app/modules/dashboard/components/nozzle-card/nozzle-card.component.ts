import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Subscription } from 'rxjs';
import { ThemeService } from 'app/services/theme.service';

export interface NozzleSale {
    nozzleName: string;
    fuelType: string;
    liters: number;
    amount: number;
    color?: string;
}

@Component({
    selector: 'app-nozzle-card',
    templateUrl: './nozzle-card.component.html',
    styleUrls: ['./nozzle-card.component.css']
})
export class NozzleCardComponent implements OnInit, OnChanges, OnDestroy {
    @Input() nozzleSales: NozzleSale[] = [];
    @Input() filterType: string = 'today';
    @Output() filterTypeChange = new EventEmitter<string>();
    @Input() selectedYear: number = new Date().getFullYear();
    @Output() selectedYearChange = new EventEmitter<number>();
    @Input() yearList: number[] = [];
    @Output() filterChange = new EventEmitter<void>();

    public totalVolume: number = 0;
    public totalRevenue: number = 0;
    public maxRevenue: number = 0;
    public hasChartData: boolean = false;
    public fuelLegend: { label: string; color: string }[] = [];

    public nozzleChartType: ChartType = 'bar';
    public nozzleChartData: ChartConfiguration['data'] = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: [],
            borderRadius: 6,
            barThickness: 16
        }]
    };
    public nozzleChartOptions: ChartConfiguration['options'] = {};

    private themeSub: Subscription;

    constructor(private themeService: ThemeService) { }

    ngOnInit(): void {
        this.updateChartOptions(this.themeService.getCurrentTheme());
        this.themeSub = this.themeService.theme$.subscribe(theme => {
            this.updateChartOptions(theme);
        });
        this.rebuildViewData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['nozzleSales']) {
            this.rebuildViewData();
        }
    }

    ngOnDestroy(): void {
        if (this.themeSub) {
            this.themeSub.unsubscribe();
        }
    }

    getFuelColor(type: string): string {
        switch ((type || '').toLowerCase()) {
            case 'petrol': return '#0ea5e9';
            case 'diesel': return '#f59e0b';
            case 'xp petrol': return '#8b5cf6';
            case 'power diesel': return '#10b981';
            default: return '#64748b';
        }
    }

    getRevenueBarWidth(amount: number): number {
        if (!this.maxRevenue || this.maxRevenue <= 0) return 0;
        return Math.min(100, Math.max(4, ((Number(amount) || 0) / this.maxRevenue) * 100));
    }

    getChartHeight(): number {
        const count = this.nozzleSales ? this.nozzleSales.length : 0;
        return Math.min(240, Math.max(140, count * 34 + 32));
    }

    private rebuildViewData(): void {
        const list = Array.isArray(this.nozzleSales) ? this.nozzleSales : [];
        this.totalVolume = list.reduce((sum, item) => sum + (Number(item.liters) || 0), 0);
        this.totalRevenue = list.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        this.maxRevenue = list.reduce((max, item) => Math.max(max, Number(item.amount) || 0), 0);
        this.hasChartData = list.some(item => (Number(item.amount) || 0) > 0 || (Number(item.liters) || 0) > 0);

        const seenFuels = new Map<string, string>();
        list.forEach(item => {
            if (item.fuelType && !seenFuels.has(item.fuelType)) {
                seenFuels.set(item.fuelType, this.getFuelColor(item.fuelType));
            }
        });
        this.fuelLegend = Array.from(seenFuels.entries()).map(([label, color]) => ({ label, color }));

        const labels = list.map(n => n.nozzleName);
        const data = list.map(n => Number(n.amount) || 0);
        const colors = list.map(n => this.getFuelColor(n.fuelType));

        this.nozzleChartData = {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                hoverBackgroundColor: colors,
                borderRadius: 6,
                barThickness: 16
            }]
        };
    }

    private updateChartOptions(theme: 'light' | 'dark'): void {
        const isDark = theme === 'dark';
        const textColor = isDark ? '#cbd5e1' : '#475569';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0';

        this.nozzleChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: (context: any) => {
                            const idx = context.dataIndex;
                            const row = this.nozzleSales?.[idx];
                            const rev = Number(context.raw) || 0;
                            const vol = row ? (Number(row.liters) || 0) : 0;
                            return [
                                ` Revenue: ₹${rev.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                ` Volume: ${vol.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    border: { display: false },
                    grid: { color: gridColor },
                    ticks: {
                        color: textColor,
                        font: { size: 11 },
                        callback: (val: any) => {
                            const num = Number(val);
                            if (num === 0) return '₹0';
                            if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
                            if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
                            return `₹${num}`;
                        }
                    }
                },
                y: {
                    border: { display: false },
                    grid: { display: false },
                    ticks: {
                        color: textColor,
                        font: { size: 11, weight: 'bold' }
                    }
                }
            }
        };
    }
}
