import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface NozzleSale {
    nozzleName: string;
    fuelType: string;
    liters: number;
    amount: number;
    color: string;
}

@Component({
    selector: 'app-nozzle-card',
    templateUrl: './nozzle-card.component.html',
    styleUrls: ['./nozzle-card.component.css']
})
export class NozzleCardComponent implements OnInit {
    @Input() nozzleSales: NozzleSale[] = [];
    @Input() filterType: string = 'today';
    @Output() filterTypeChange = new EventEmitter<string>();
    @Input() selectedYear: number = new Date().getFullYear();
    @Output() selectedYearChange = new EventEmitter<number>();
    @Input() yearList: number[] = [];
    @Output() filterChange = new EventEmitter<void>();

    constructor() { }

    ngOnInit(): void {
    }

    getFuelColor(type: string): string {
        switch (type.toLowerCase()) {
            case 'petrol': return '#28a745';
            case 'diesel': return '#4b6cb7';
            case 'xp petrol': return '#ef7c8f';
            case 'power diesel': return '#00A36C';
            default: return '#6c757d';
        }
    }
}
