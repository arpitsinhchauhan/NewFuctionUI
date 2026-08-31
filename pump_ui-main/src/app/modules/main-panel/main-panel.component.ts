import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UserServiceService } from 'app/services/user-service.service';
import { OilReportComponent } from '../maps/oil-report/oil-report.component';
import { TransactionReportComponent } from '../atm-transaction/transaction-report/transaction-report.component';
import { KharchReportComponent } from '../kharch/kharch-report/kharch-report.component';
import { JamaBakiReportComponent } from '../jama-baki/jama-baki-report/jama-baki-report.component';
import { PurchaseReportComponent } from '../table-list/purchase-report/purchase-report.component';
import { DipStockReportComponent } from '../dip-stock/dip-stock-report/dip-stock-report.component';
import { NotificationService } from 'app/services/notification.service';
import { LoaderService } from 'app/services/loader.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { API_BACKPAGE, API_PURCHASE_LIST } from 'app/serviceult';
import { HttpClient } from '@angular/common/http';
import { ExtraDipAddEditComponent } from '../extra-dip/extra-dip-add-edit/extra-dip-add-edit.component';
import { AddExtraPurchaseComponent } from '../extra-purchase-list/add-extra-purchase/add-extra-purchase.component';
import { AddPetrolStockComponent } from '../add-petrol-stock/add-petrol-stock.component';
import { AddDieselStockComponent } from '../add-diesel-stock/add-diesel-stock.component';
import { AddXpPetrolStockComponent } from '../add-xp-petrol-stock/add-xp-petrol-stock.component';
import { AddPowerDieselStockComponent } from '../add-power-diesel-stock/add-power-diesel-stock.component';
import { AddGattComponent } from '../add-gatt/add-gatt.component';
import { AddDieselgattComponent } from '../add-dieselgatt/add-dieselgatt.component';
import { AddXpPetrolgattComponent } from '../add-xp-petrolgatt/add-xp-petrolgatt.component';
import { AddPowerDieselgattComponent } from '../add-power-dieselgatt/add-power-dieselgatt.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { AddloclDetailsComponent } from '../addlocl-details/addlocl-details.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { OilpurchaseComponent } from '../oil-purchase-table/oilpurchase/oilpurchase.component';

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',   // 👈 shown in HTML
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface BackPageResponse {
  purchaseSellSummary: any;
  petrolSellSummary: any;
  dieselSellSummary: any;
  oilSellSummary: any;
  kharchSellSummary: [string, string][];
  transactionSellSummary: [string, string][];
  jamaSummary: [string, number][];
  bakiSummary: [string, number][];
  loclcredit: [string, string][];
}


@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // dd/MM/yyyy
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class MainPanelComponent implements OnInit {

  showPetrolPumpsCount: number = 0;
  showDieselPumpsCount: number = 0;
  showXpPetrolCount: number = 0;
  showPowerDieselCount: number = 0;


  kharchSellSummary: any[];
  transactionSellSummary: any[];
  jamaSummary: [string, number][] = [];
  bakiSummary: [string, number][] = [];
  firstTableData: [string, number][] = [];
  secondTableData: [string, number][] = [];
  creditTableData: any[];

  reportDate: any;
  userId = localStorage.getItem('userId');

  currentTime: string = '';
  petrolPumps: any[] = [];
  dieselPumps: any[] = [];
  xpPetrol: any[] = [];
  powerDiesel: any[] = [];

  Petrolgatt: number = 0;
  dieselgatt: number = 0;
  XpPetrolgatt: number = 0;
  PowerDieselgatt: number = 0;

  petrolTotalLTR: number = 0;
  dieselTotalLTR: number = 0;

  xpPetrolTotalLTR: number = 0;
  xpPetrolTotalRS: number = 0;

  powerDieselTotalLTR: number = 0;
  powerDieselTotalRS: number = 0;

  petrolTotalRS: number = 0;
  dieselTotalRS: number = 0;

  totalRs: number = 0;
  oilsellTotal: number = 0;
  ATMTotal: number = 0;
  kharchTotal: number = 0;
  jamaTotal: number = 0;
  bakiTotal: number = 0;


  petrolPurchaseLTR: number = 0;
  dieselPurchaseLTR: number = 0;
  Total_Case: number = 0;

  Petrol_Ugadto_Stock: number = 0;
  Diesel_Ugadto_Stock: number = 0;

  XP_Petrol_Ugadto_Stock: number = 0;
  Power_Diesel_Ugadto_Stock: number = 0;

  petolQuantity: number = 0;
  dieselQuantity: number = 0;
  oilQuantity: number = 0;

  xpPetolQuantity: number = 0;
  powerDieselQuantity: number = 0;

  Petrol_dip: number = 0;
  Petrol_stock: number = 0;
  Diesel_dip: number = 0;
  Diesel_stock: number = 0;

  Extra_Petrol_dip: number = 0;
  Extra_Petrol_stock: number = 0;
  Extra_Diesel_dip: number = 0;
  Extra_Diesel_stock: number = 0;

  Total_petrol_stock: number = 0;
  Total_diesel_stock: number = 0;

  Total_Petrol: number = 0;
  Total_Diesel: number = 0;

  PumpName: string = '';
  xp_petrol_nozzle: number;
  powe_diesel_nozzle: number;
  multipliers = {
    twothousand: null,
    fivehundred: null,
    twohundred: null,
    onehundred: null,
    fifty: null,
    twenty: null,
    ten: null
  };

  twothousand = 0;
  fivehundred = 0;
  twohundred = 0;
  onehundred = 0;
  fifty = 0;
  twenty = 0;
  ten = 0;
  totalCaseCase = 0;
  note: String = '';
  creditNOteIOCL: number = 0;
  selectedShift: string = 'Morning';
  availableShifts: string[] = ['Morning', 'Afternoon', 'Night'];
  currentShiftStatus: string = 'OPEN';
  isShiftLocked: boolean = false;
  isDayLocked: boolean = false;
  shiftClosedBy: string = '';
  shiftCloseTime: string = '';

  showShiftReportModal: boolean = false;
  showDailyConsolidatedModal: boolean = false;
  shiftReportData: any = null;
  dailyConsolidatedData: any = null;

  // Manager Dashboard Properties
  userRole: string = '';
  managerSelectedDate: any = new Date();
  managerFromDate: any = null;
  managerToDate: any = null;
  managerSelectedEmployee: string = '';
  managerSelectedShift: string = '';
  employeeList: string[] = [];
  managerReports: any[] = [];
  filteredReports: any[] = [];
  searchQuery: string = '';
  selectedEmployeeIdForView: string = 'ALL';
  managerEmployeeList: any[] = [];
  displayedColumns: string[] = ['employeeName', 'reportTime', 'reportDate', 'shift', 'petrolSales', 'dieselSales', 'expenses', 'cash', 'status', 'actions'];
  editingReportId: number | null = null;

  get totalManagerPetrolSales(): number {
    return this.filteredReports.reduce((sum, r) => sum + (Number(r.petrolSales) || 0), 0);
  }

  get totalManagerDieselSales(): number {
    return this.filteredReports.reduce((sum, r) => sum + (Number(r.dieselSales) || 0), 0);
  }

  get totalManagerExpenses(): number {
    return this.filteredReports.reduce((sum, r) => sum + (Number(r.expenses) || 0), 0);
  }

  get totalManagerCash(): number {
    return this.filteredReports.reduce((sum, r) => sum + (Number(r.cash) || 0), 0);
  }

  get totalManagerRevenue(): number {
    return this.filteredReports.reduce((sum, r) => sum + (Number(r.salesAmount) || 0), 0);
  }

  denominations = [
    { val: 2000, key: 'twothousand' },
    { val: 500, key: 'fivehundred' },
    { val: 200, key: 'twohundred' },
    { val: 100, key: 'onehundred' },
    { val: 50, key: 'fifty' },
    { val: 20, key: 'twenty' },
    { val: 10, key: 'ten' }
  ];

  trackByDenKey(index: number, item: any): string {
    return item.key;
  }

  getDenominationDisplay(key: string): number {
    return (this as any)[key] || 0;
  }

  onDenominationFocus(event: any, key: string) {
    const multipliersAny = this.multipliers as any;
    if (multipliersAny[key] === 0 || multipliersAny[key] === '0' || multipliersAny[key] === null) {
      multipliersAny[key] = null;
      if (event && event.target) {
        event.target.value = '';
      }
    } else {
      if (event && event.target && typeof event.target.select === 'function') {
        event.target.select();
      }
    }
  }

  onDenominationBlur(key: string) {
    const multipliersAny = this.multipliers as any;
    if (multipliersAny[key] === null || multipliersAny[key] === undefined || multipliersAny[key] === '' || multipliersAny[key] === 0) {
      multipliersAny[key] = null;
    }
    this.calculateTotal();
  }

  constructor(private dialog: MatDialog, private use: UserServiceService,
    private notificationService: NotificationService, private http: HttpClient,
    private loaderService: LoaderService
  ) { }

  showSelectedDate() {
    if (!this.reportDate) {
      this.reportDate = new Date();
    }
    const formatted = this.use.getFormattedDate(this.reportDate);
    this.getPetrolUgadtoStock();
    this.getDieselUgadtoStock();
    // this.getOnedayAgoUgadtoStock();
    this.getPetrolStock(formatted, this.userId);
    this.getDieselStock(formatted, this.userId);
    this.getXPPetrol(formatted, this.userId);
    this.getpowerDiesel(formatted, this.userId);
    this.getoillist();
    this.getTransactionlist();
    this.getKharchlist();
    this.getJamaBakilist();
    this.getPurchaselist();
    this.getExtraPurchaselist();
    this.getDiplist();
    this.getextraDiplist();
    this.getMoneyDetailsList();
    this.getxpPetrolUgadtoStock();
    this.getpowerDieselUgadtoStock();
    this.getPetrolGatt();
    this.getDieselGatt();
    this.getXpPetrolGatt();
    this.getPowerDieselGatt();
    this.getcreditNOteIOCL();
    this.getOilPurchaseList();
    this.backPage();
    this.use.checkEodLock(formatted, this.userId).subscribe(res => {
      this.isDayLocked = res && res.locked;
    });
    setTimeout(() => this.fetchPreviousClosingMeters(), 300);
  }


  ngOnInit() {
    this.userRole = localStorage.getItem('role') || 'EMPLOYEE';
    if (this.userRole !== 'EMPLOYEE' && this.userRole !== 'employee') {
      this.reportDate = this.managerSelectedDate || new Date();
      this.selectedEmployeeIdForView = 'ALL';
      this.getManagerEmployees();
      this.loadManagerReportsByDate();
      setTimeout(() => {
        this.onManagerViewChange();
      }, 500);
    } else {
      this.showSelectedDate();
    }
    this.getUserName();
    this.getUserPump();
    this.petrolPumps = [
      { name: 'Petrol nozzle 1', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Petrol nozzle 2', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Petrol nozzle 3', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Petrol nozzle 4', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Petrol nozzle 5', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 }
    ];

    this.dieselPumps = [
      { name: 'Diesel nozzle 1', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Diesel nozzle 2', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Diesel nozzle 3', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Diesel nozzle 4', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'Diesel nozzle 5', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 }
    ];

    this.xpPetrol = [
      { name: 'xpPetrol nozzle 1', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'xpPetrol nozzle 2', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
    ];

    this.powerDiesel = [
      { name: 'powerDiesel nozzle 1', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
      { name: 'powerDiesel nozzle 2', openingMeter: null, closingMeter: null, saleLtr: 0, testing: null, ltr: 0, rate: null, total_rs: 0 },
    ];

    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  getUserPump() {
    this.use.getUserPump(this.userId).subscribe(
      response => {
        if (response && response.success && response.data) {
          const data = response.data;

          this.showPetrolPumpsCount = data.petrol_nozzle;
          this.showDieselPumpsCount = data.diesel_nozzle;
          this.showXpPetrolCount = data.xp_petrol_nozzle;
          this.showPowerDieselCount = data.powe_diesel_nozzle;
          // If you want total count
          const totalPumpCount = this.showPetrolPumpsCount + this.showDieselPumpsCount + this.showXpPetrolCount + this.showPowerDieselCount;
        }
      },
      error => {
        console.error("Error fetching pump data", error);
      }
    );
  }

  getUserName() {
    this.use.getUserNameAndNozzle(this.userId).subscribe(
      data => {
        this.PumpName = data.data.firstName;
        this.xp_petrol_nozzle = Number(data.data.xp_petrol_nozzle);
        this.powe_diesel_nozzle = Number(data.data.powe_diesel_nozzle);
      }
    );
  }

  private aggregateFuelItems(pumps: any[], allItems: any[], ltrKey: string) {
    pumps.forEach(pump => {
      pump.openingMeter = null;
      pump.closingMeter = null;
      pump.saleLtr = 0;
      pump.testing = null;
      pump.ltr = 0;
      pump.rate = null;
      pump.total_rs = 0;
    });

    if (!allItems || allItems.length === 0) return;

    const pumpGroupMap = new Map<string, any[]>();
    allItems.forEach((item: any) => {
      if (item && item.pump) {
        if (!pumpGroupMap.has(item.pump)) {
          pumpGroupMap.set(item.pump, []);
        }
        pumpGroupMap.get(item.pump).push(item);
      }
    });

    pumpGroupMap.forEach((items, pumpName) => {
      const normalizedPumpName = pumpName.replace(/Pump/gi, 'nozzle');
      const pump = pumps.find(p => p.name === pumpName || p.name === normalizedPumpName);
      if (pump && items.length > 0) {
        // Sort by id ascending (chronological shift order)
        items.sort((a, b) => (a.id || 0) - (b.id || 0));

        const firstItem = items[0];
        const lastItem = items[items.length - 1];

        pump.openingMeter = (firstItem.open_meter !== null && firstItem.open_meter !== undefined && firstItem.open_meter !== '') ? +firstItem.open_meter : null;
        pump.closingMeter = (lastItem.close_meter !== null && lastItem.close_meter !== undefined && lastItem.close_meter !== '') ? +lastItem.close_meter : null;

        pump.testing = items.reduce((sum, i) => sum + (+i.testing || 0), 0);

        if (pump.openingMeter !== null && pump.closingMeter !== null) {
          pump.saleLtr = Math.abs(pump.closingMeter - pump.openingMeter);
        } else {
          pump.saleLtr = items.reduce((sum, i) => sum + (+i[ltrKey] || 0), 0);
        }

        pump.rate = (lastItem.rate !== null && lastItem.rate !== undefined && lastItem.rate !== '') ? +lastItem.rate : null;
        pump.ltr = (pump.saleLtr || 0) - (pump.testing || 0);
        pump.total_rs = parseFloat(items.reduce((sum, i) => sum + (+i.total_sell || 0), 0).toFixed(2));
      }
    });
  }

  getPetrolStock(date: string, userId: string) {
    this.use.getPetrolList(date, userId).subscribe((data: any[]) => {
      this.aggregateFuelItems(this.petrolPumps, data || [], 'petrol_ltr');
      this.calculateTotals();
    });
  }

  getDieselStock(date: string, userId: string) {
    this.use.getDieselList(date, userId).subscribe((data: any[]) => {
      this.aggregateFuelItems(this.dieselPumps, data || [], 'diesel_ltr');
      this.calculateTotals();
    });
  }

  getXPPetrol(date: string, userId: string) {
    this.use.getXPPetrolList(date, userId).subscribe((data: any[]) => {
      this.aggregateFuelItems(this.xpPetrol, data || [], 'xppetrol_ltr');
      this.calculateTotals();
    });
  }

  getpowerDiesel(date: string, userId: string) {
    this.use.getpowerDiesel(date, userId).subscribe((data: any[]) => {
      this.aggregateFuelItems(this.powerDiesel, data || [], 'powerdiesel_ltr');
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.petrolTotalLTR = this.petrolPumps.reduce((sum, p) => sum + p.ltr, 0);
    this.petrolTotalRS = this.petrolPumps.reduce((sum, p) => sum + p.total_rs, 0);

    this.dieselTotalLTR = this.dieselPumps.reduce((sum, p) => sum + p.ltr, 0);
    this.dieselTotalRS = this.dieselPumps.reduce((sum, p) => sum + p.total_rs, 0);

    this.xpPetrolTotalLTR = this.xpPetrol.reduce((sum, p) => sum + p.ltr, 0);
    this.xpPetrolTotalRS = this.xpPetrol.reduce((sum, p) => sum + p.total_rs, 0);

    this.powerDieselTotalLTR = this.powerDiesel.reduce((sum, p) => sum + p.ltr, 0);
    this.powerDieselTotalRS = this.powerDiesel.reduce((sum, p) => sum + p.total_rs, 0);

    this.totalRs = this.petrolTotalRS + this.dieselTotalRS + this.xpPetrolTotalRS + this.powerDieselTotalRS;
  }


  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  getAbs(value: number): number {
    return Math.abs(value || 0);
  }


  calculatePetrol(index: number) {
    const petrol = this.petrolPumps[index];
    const total = (petrol.closingMeter || 0) - (petrol.openingMeter || 0);
    const testing = petrol.testing || 0;
    const rate = petrol.rate || 0;

    petrol.saleLtr = Math.abs(total);
    petrol.ltr = total - testing;

    // Round to 2 decimal places
    petrol.total_rs = parseFloat(Math.abs(petrol.ltr * rate).toFixed(2));

    // Update Totals
    this.petrolTotalLTR = parseFloat(
      this.petrolPumps.reduce((sum, p) => sum + Math.abs(p.ltr || 0), 0).toFixed(2)
    );
    this.petrolTotalRS = parseFloat(
      this.petrolPumps.reduce((sum, p) => sum + (p.total_rs || 0), 0).toFixed(2)
    );

    this.updateTotalRs();
  }


  calculateDiesel(index: number) {
    const diesel = this.dieselPumps[index];
    const total = (diesel.closingMeter || 0) - (diesel.openingMeter || 0);
    const testing = diesel.testing || 0;
    const rate = diesel.rate || 0;

    diesel.saleLtr = parseFloat(Math.abs(total).toFixed(2));
    diesel.ltr = parseFloat((total - testing).toFixed(2));
    diesel.total_rs = parseFloat(Math.abs(diesel.ltr * rate).toFixed(2));

    // Update Totals
    this.dieselTotalLTR = parseFloat(
      this.dieselPumps.reduce((sum, d) => sum + Math.abs(d.ltr || 0), 0).toFixed(2)
    );
    this.dieselTotalRS = parseFloat(
      this.dieselPumps.reduce((sum, d) => sum + (d.total_rs || 0), 0).toFixed(2)
    );

    this.updateTotalRs();
  }



  calculateXpPetrol(index: number) {
    const xpPetrol = this.xpPetrol[index];
    const total = (xpPetrol.closingMeter || 0) - (xpPetrol.openingMeter || 0);
    const testing = xpPetrol.testing || 0;
    const rate = xpPetrol.rate || 0;

    xpPetrol.saleLtr = parseFloat(Math.abs(total).toFixed(2));
    xpPetrol.ltr = parseFloat((total - testing).toFixed(2));
    xpPetrol.total_rs = parseFloat(Math.abs(xpPetrol.ltr * rate).toFixed(2));

    // Update Totals
    this.xpPetrolTotalLTR = parseFloat(
      this.xpPetrol.reduce((sum, d) => sum + Math.abs(d.ltr || 0), 0).toFixed(2)
    );
    this.xpPetrolTotalRS = parseFloat(
      this.xpPetrol.reduce((sum, d) => sum + (d.total_rs || 0), 0).toFixed(2)
    );

    this.updateTotalRs();
  }


  calculatepowerDiesel(index: number) {
    const powerDiesel = this.powerDiesel[index];
    const total = (powerDiesel.closingMeter || 0) - (powerDiesel.openingMeter || 0);
    const testing = powerDiesel.testing || 0;
    const rate = powerDiesel.rate || 0;

    powerDiesel.saleLtr = parseFloat(Math.abs(total).toFixed(2));
    powerDiesel.ltr = parseFloat((total - testing).toFixed(2));
    powerDiesel.total_rs = parseFloat(Math.abs(powerDiesel.ltr * rate).toFixed(2));

    // Update Totals
    this.powerDieselTotalLTR = parseFloat(
      this.powerDiesel.reduce((sum, d) => sum + Math.abs(d.ltr || 0), 0).toFixed(2)
    );
    this.powerDieselTotalRS = parseFloat(
      this.powerDiesel.reduce((sum, d) => sum + (d.total_rs || 0), 0).toFixed(2)
    );

    this.updateTotalRs();
  }

  onShiftChange() {
    this.showSelectedDate();
  }

  checkOpeningMismatch(pump: any) {
    if (pump && pump.autoOpeningMeter !== undefined && pump.autoOpeningMeter !== null && pump.openingMeter !== null) {
      pump.warningMismatch = (+pump.openingMeter !== +pump.autoOpeningMeter);
    } else {
      pump.warningMismatch = false;
    }
  }

  fetchPreviousClosingMeters() {
    if (!this.reportDate) return;
    const formatted = this.use.getFormattedDate(this.reportDate);

    // Petrol
    this.petrolPumps.slice(0, this.showPetrolPumpsCount).forEach((pump, index) => {
      if (pump.openingMeter === null || pump.openingMeter === 0) {
        this.use.getPreviousClosingMeter('petrol', pump.name, formatted).subscribe(res => {
          if (res && res.previousClosingMeter !== undefined && res.previousClosingMeter !== null && res.previousClosingMeter !== '') {
            if (pump.openingMeter === null || pump.openingMeter === 0) {
              pump.openingMeter = +res.previousClosingMeter;
              pump.autoOpeningMeter = +res.previousClosingMeter;
              this.calculatePetrol(index);
            }
          }
        });
      }
    });

    // Diesel
    this.dieselPumps.slice(0, this.showDieselPumpsCount).forEach((pump, index) => {
      if (pump.openingMeter === null || pump.openingMeter === 0) {
        this.use.getPreviousClosingMeter('diesel', pump.name, formatted).subscribe(res => {
          if (res && res.previousClosingMeter !== undefined && res.previousClosingMeter !== null && res.previousClosingMeter !== '') {
            if (pump.openingMeter === null || pump.openingMeter === 0) {
              pump.openingMeter = +res.previousClosingMeter;
              pump.autoOpeningMeter = +res.previousClosingMeter;
              this.calculateDiesel(index);
            }
          }
        });
      }
    });

    // XP Petrol
    if (this.showXpPetrolCount > 0) {
      this.xpPetrol.slice(0, this.showXpPetrolCount).forEach((pump, index) => {
        if (pump.openingMeter === null || pump.openingMeter === 0) {
          this.use.getPreviousClosingMeter('xppetrol', pump.name, formatted).subscribe(res => {
            if (res && res.previousClosingMeter !== undefined && res.previousClosingMeter !== null && res.previousClosingMeter !== '') {
              if (pump.openingMeter === null || pump.openingMeter === 0) {
                pump.openingMeter = +res.previousClosingMeter;
                pump.autoOpeningMeter = +res.previousClosingMeter;
                this.calculateXpPetrol(index);
              }
            }
          });
        }
      });
    }

    // Power Diesel
    if (this.showPowerDieselCount > 0) {
      this.powerDiesel.slice(0, this.showPowerDieselCount).forEach((pump, index) => {
        if (pump.openingMeter === null || pump.openingMeter === 0) {
          this.use.getPreviousClosingMeter('powerdiesel', pump.name, formatted).subscribe(res => {
            if (res && res.previousClosingMeter !== undefined && res.previousClosingMeter !== null && res.previousClosingMeter !== '') {
              if (pump.openingMeter === null || pump.openingMeter === 0) {
                pump.openingMeter = +res.previousClosingMeter;
                pump.autoOpeningMeter = +res.previousClosingMeter;
                this.calculatepowerDiesel(index);
              }
            }
          });
        }
      });
    }
  }

  onCloseShift() {
    if (!this.reportDate) {
      this.notificationService.failure("Please select date first.");
      return;
    }
    const formatted = this.use.getFormattedDate(this.reportDate);
    const username = localStorage.getItem('username') || 'Operator';

    // Close petrol shift
    this.petrolPumps.slice(0, this.showPetrolPumpsCount).forEach(p => {
      this.use.closeShift({
        fuelType: 'petrol',
        date: formatted,
        shift: this.selectedShift,
        pump: p.name,
        userId: this.userId,
        closedBy: username
      }).subscribe();
    });

    // Close diesel shift
    this.dieselPumps.slice(0, this.showDieselPumpsCount).forEach(d => {
      this.use.closeShift({
        fuelType: 'diesel',
        date: formatted,
        shift: this.selectedShift,
        pump: d.name,
        userId: this.userId,
        closedBy: username
      }).subscribe();
    });

    this.isShiftLocked = true;
    this.currentShiftStatus = 'CLOSED';
    this.notificationService.success("🔒 Shift " + this.selectedShift + " has been closed and locked.");
  }

  onReopenShift() {
    if (!this.reportDate) return;
    const formatted = this.use.getFormattedDate(this.reportDate);

    this.petrolPumps.slice(0, this.showPetrolPumpsCount).forEach(p => {
      this.use.reopenShift({
        fuelType: 'petrol',
        date: formatted,
        shift: this.selectedShift,
        pump: p.name,
        userId: this.userId
      }).subscribe();
    });

    this.dieselPumps.slice(0, this.showDieselPumpsCount).forEach(d => {
      this.use.reopenShift({
        fuelType: 'diesel',
        date: formatted,
        shift: this.selectedShift,
        pump: d.name,
        userId: this.userId
      }).subscribe();
    });

    this.isShiftLocked = false;
    this.currentShiftStatus = 'OPEN';
    this.notificationService.success("🔓 Shift " + this.selectedShift + " unlocked successfully.");
  }

  openShiftReportModal() {
    if (!this.reportDate) {
      this.notificationService.failure("Please select date first.");
      return;
    }
    const formatted = this.use.getFormattedDate(this.reportDate);
    this.use.getShiftSalesReport(formatted, this.userId, this.selectedShift).subscribe(res => {
      if (res && res.shiftRecords) {
        this.shiftReportData = res.shiftRecords;
        this.showShiftReportModal = true;
      }
    });
  }

  openDailyConsolidatedModal() {
    if (!this.reportDate) {
      this.notificationService.failure("Please select date first.");
      return;
    }
    const formatted = this.use.getFormattedDate(this.reportDate);
    this.use.getDailyConsolidatedReport(formatted, this.userId).subscribe(res => {
      if (res && res.success) {
        this.dailyConsolidatedData = res;
        this.showDailyConsolidatedModal = true;
      }
    });
  }

  closeShiftReportModal() {
    this.showShiftReportModal = false;
  }

  closeDailyConsolidatedModal() {
    this.showDailyConsolidatedModal = false;
  }



  updateTotalRs() {
    const round = (value: number) => parseFloat(value.toFixed(2));

    this.petrolTotalRS = round(this.petrolPumps.reduce((sum, p) => sum + (p.total_rs || 0), 0));
    this.dieselTotalRS = round(this.dieselPumps.reduce((sum, d) => sum + (d.total_rs || 0), 0));
    this.xpPetrolTotalRS = round(this.xpPetrol.reduce((sum, d) => sum + (d.total_rs || 0), 0));
    this.powerDieselTotalRS = round(this.powerDiesel.reduce((sum, d) => sum + (d.total_rs || 0), 0));
    this.totalRs = round(
      this.petrolTotalRS + this.dieselTotalRS + this.xpPetrolTotalRS + this.powerDieselTotalRS
    );
  }


  openOilsellBakComponent(): void {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    if (this.reportDate) {
      const dialogRef = this.dialog.open(OilReportComponent, {
        data: { date: formattedDate },
        hasBackdrop: true,
        panelClass: ['dialog-modern-wrapper', 'dialog-xl']
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getoillist();
      });
    } else {
      this.notificationService.failure("Select the Date ?");
    }
  }

  getoillist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getOillsellList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.oilsellTotal = data[0] ?? 0;
        } else {
          this.oilsellTotal = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch oil sell data.");
      }
    );
  }



  openAtmBakComponent() {
    const dialogRef = this.dialog.open(TransactionReportComponent, {
      data: { date: this.use.getFormattedDate(this.reportDate), },
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-lg']
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTransactionlist();
      this.backPage();
    });
  }

  getTransactionlist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getTransactionList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.ATMTotal = data[0] ?? 0;
        } else {
          this.ATMTotal = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Transaction sell data.");
      }
    );
  }

  openKharchComponent() {
    const dialogRef = this.dialog.open(KharchReportComponent, {
      data: { date: this.use.getFormattedDate(this.reportDate) },
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-lg']
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getKharchlist();
      this.backPage();
      // this.use.getKharchList(this.use.getFormattedDate(this.reportDate), this.userId).subscribe(
      //   data => {
      //     this.kharchTotal=data[0];
      //   }
      // );
    });
  }

  getKharchlist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getKharchList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.kharchTotal = data[0] ?? 0;
        } else {
          this.kharchTotal = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Kharch data.");
      }
    );
  }

  openJamaComponent() {
    const dialogRef = this.dialog.open(JamaBakiReportComponent, {
      data: {
        date: this.use.getFormattedDate(this.reportDate),
        type: 'jama'
      },
      hasBackdrop: true,
      panelClass: 'dialog-lg'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getJamaBakilist();
      this.backPage();
    });
  }

  openBakiComponent() {
    const dialogRef = this.dialog.open(JamaBakiReportComponent, {
      data: {
        date: this.use.getFormattedDate(this.reportDate),
        type: 'baki'
      },
      hasBackdrop: true,
      panelClass: 'dialog-lg'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getJamaBakilist();
      this.backPage();
    });
  }

  getJamaBakilist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getJamaBakiList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.jamaTotal = data[0][0] ?? 0;
          this.bakiTotal = data[0][1] ?? 0;
        } else {
          this.jamaTotal = 0;
          this.bakiTotal = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Jama&Baki data.");
      }
    );
  }

  addPetrolStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddPetrolStockComponent, {
      data: {
        date: formattedDate,
        openstock: this.Petrol_Ugadto_Stock,
        userId: this.userId || localStorage.getItem('userId')
      },
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-md']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPetrolUgadtoStock();
      }
    });
  }


  getPetrolUgadtoStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const uid = localStorage.getItem('userId') || this.userId;
    this.use.getPetrolStock(formattedDate, uid).subscribe(
      data => {
        if (data) {
          const item = Array.isArray(data) ? data[0] : data;
          this.Petrol_Ugadto_Stock = item ? (item.petrol ?? item.petrol_stock ?? item.openstock ?? (typeof item === 'number' ? item : 0)) : 0;
        } else {
          this.Petrol_Ugadto_Stock = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.Petrol_Ugadto_Stock = 0;
      }
    );
  }

  addDieselStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddDieselStockComponent, {
      data: {
        date: formattedDate,
        dieselopenstock: this.Diesel_Ugadto_Stock,
        userId: localStorage.getItem('userId') || this.userId
      },
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-md']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDieselUgadtoStock();
      }
    });
  }

  getDieselUgadtoStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const uid = localStorage.getItem('userId') || this.userId;
    this.use.getDieselStock(formattedDate, uid).subscribe(
      data => {
        if (data) {
          const item = Array.isArray(data) ? data[0] : data;
          this.Diesel_Ugadto_Stock = item ? (item.diesel ?? item.diesel_stock ?? item.dieselopenstock ?? (typeof item === 'number' ? item : 0)) : 0;
        } else {
          this.Diesel_Ugadto_Stock = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.Diesel_Ugadto_Stock = 0;
      }
    );
  }

  addXPPetrolStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddXpPetrolStockComponent, {
      data: {
        date: formattedDate,
        xp_ugadto_stock: this.XP_Petrol_Ugadto_Stock,
        userId: localStorage.getItem('userId') || this.userId
      },
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-md']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getxpPetrolUgadtoStock();
      }
    });
  }

  getxpPetrolUgadtoStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const uid = localStorage.getItem('userId') || this.userId;
    this.use.getXpPetrolStock(formattedDate, uid).subscribe(
      data => {
        if (data) {
          const item = Array.isArray(data) ? data[0] : data;
          this.XP_Petrol_Ugadto_Stock = item ? (item.Xppetrol ?? item.xp_petrol ?? item.xp_ugadto_stock ?? item.xp_petrol_stock ?? (typeof item === 'number' ? item : 0)) : 0;
        } else {
          this.XP_Petrol_Ugadto_Stock = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.XP_Petrol_Ugadto_Stock = 0;
      }
    );
  }

  addPowerDieselStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddPowerDieselStockComponent, {
      data: {
        date: formattedDate,
        power_ugadto_stock: this.Power_Diesel_Ugadto_Stock,
        userId: localStorage.getItem('userId') || this.userId
      },
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-md']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getpowerDieselUgadtoStock();
      }
    });
  }

  getpowerDieselUgadtoStock() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const uid = localStorage.getItem('userId') || this.userId;
    this.use.getPowerDieselStock(formattedDate, uid).subscribe(
      data => {
        if (data) {
          const item = Array.isArray(data) ? data[0] : data;
          this.Power_Diesel_Ugadto_Stock = item ? (item.Powerdiesel ?? item.power_diesel ?? item.power_ugadto_stock ?? item.power_diesel_stock ?? (typeof item === 'number' ? item : 0)) : 0;
        } else {
          this.Power_Diesel_Ugadto_Stock = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.Power_Diesel_Ugadto_Stock = 0;
      }
    );
  }

  //   getOnedayAgoUgadtoStock() {
  //     const formattedDate = this.use.getFormattedDate(this.reportDate);
  //    this.use.getOneDayAgoStock(formattedDate, this.userId).subscribe(
  //     data => {
  //       if (data) {
  //         this.Petrol_Ugadto_Stock = data.petrol ?? 0;
  //         this.Diesel_Ugadto_Stock = data.diesel ?? 0;
  //       } else {
  //         this.Petrol_Ugadto_Stock = 0;
  //         this.Diesel_Ugadto_Stock = 0;
  //       }
  //     },
  //     error => {
  //       console.error('Error fetching stock data', error);
  //       this.Petrol_Ugadto_Stock = 0;
  //       this.Diesel_Ugadto_Stock = 0;
  //     }
  //   );
  // }

  openPurchase(data?: any): void {
    if (this.userRole === 'EMPLOYEE' || this.userRole === 'employee') {
      this.notificationService.failure("Only Pump Managers can add/view fuel purchases.");
      return;
    }
    let dateStr = '';
    try {
      dateStr = this.use.getFormattedDate(this.reportDate || new Date());
    } catch (e) {
      dateStr = this.use.getFormattedDate(new Date());
    }
    const dialogRef = this.dialog.open(PurchaseReportComponent, {
      data: { date: dateStr },
      hasBackdrop: true,
      panelClass: 'dialog-lg'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPurchaselist();
      this.backPage();
    });
  }

  getPurchaselist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getPurchaseiList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          for (const item of data) {
            const [quantity, type] = item;
            if (type === 'Petrol') {
              this.petolQuantity = quantity;
            } else if (type === 'Diesel') {
              this.dieselQuantity = quantity;
            }
          }
        } else {
          this.petolQuantity = 0;
          this.dieselQuantity = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Purchase data.");
      }
    );
  }

  openOilPurchase(data?: any): void {
    if (this.userRole === 'EMPLOYEE' || this.userRole === 'employee') {
      this.notificationService.failure("Only Pump Managers can add/view lube oil purchases.");
      return;
    }
    let dateStr = '';
    try {
      dateStr = this.use.getFormattedDate(this.reportDate || new Date());
    } catch (e) {
      dateStr = this.use.getFormattedDate(new Date());
    }
    const dialogRef = this.dialog.open(OilpurchaseComponent, {
      data: { date: dateStr },
      hasBackdrop: true,
      panelClass: 'dialog-lg'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getOilPurchaseList();
      this.backPage();
    });
  }

  getOilPurchaseList() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getOilPurchaseiList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          for (const item of data) {
            const [quantity, type] = item;
            if (type === 'oil') {
              this.oilQuantity = quantity;
            }
          }
        } else {
          this.oilQuantity = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Purchase data.");
      }
    );
  }

  openExtraPurchase(data?: any): void {
    if (this.userRole === 'EMPLOYEE' || this.userRole === 'employee') {
      this.notificationService.failure("Only Pump Managers can add/view extra fuel purchases.");
      return;
    }
    let dateStr = '';
    try {
      dateStr = this.use.getFormattedDate(this.reportDate || new Date());
    } catch (e) {
      dateStr = this.use.getFormattedDate(new Date());
    }
    const dialogRef = this.dialog.open(AddExtraPurchaseComponent, {
      data: { date: dateStr },
      hasBackdrop: true,
      panelClass: 'dialog-lg'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getExtraPurchaselist();
      this.backPage();
    });
  }

  getExtraPurchaselist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getExtraPurchaseiList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          for (const item of data) {
            const [quantity, type] = item;
            if (type === 'XP Petrol') {
              this.xpPetolQuantity = quantity;
            } else if (type === 'Power Diesel') {
              this.powerDieselQuantity = quantity;
            }
          }
        } else {
          this.xpPetolQuantity = 0;
          this.powerDieselQuantity = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Purchase data.");
      }
    );
  }

  creditNoteIOCL(data?: any): void {
    const dialogRef = this.dialog.open(AddloclDetailsComponent, {
      data: { date: this.use.getFormattedDate(this.reportDate) },
      hasBackdrop: true,
      panelClass: 'dialog-lg'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getcreditNOteIOCL();
      this.backPage();
    });
  }

  getcreditNOteIOCL() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getcreditNOteIOCL(formattedDate, this.userId).subscribe(
      data => {
        if (data) {
          this.creditNOteIOCL = data.loclCredit ?? 0;
        } else {
          this.creditNOteIOCL = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.creditNOteIOCL = 0;
      }
    );
  }


  get totalRevenue(): number {
    return (
      (Number(this.totalRs) || 0) +
      (Number(this.oilsellTotal) || 0) -
      (Number(this.ATMTotal) || 0) -
      (Number(this.kharchTotal) || 0) -
      (Number(this.bakiTotal) || 0) +
      (Number(this.jamaTotal) || 0) -
      (Number(this.Petrolgatt) || 0) -
      (Number(this.dieselgatt) || 0) -
      (Number(this.XpPetrolgatt) || 0) -
      (Number(this.PowerDieselgatt) || 0) +
      (Number(this.creditNOteIOCL) || 0)
    );
  }

  get totalCase(): number {
    return this.totalRevenue;
  }

  get cashDifference(): number {
    return (Number(this.totalCaseCase) || 0) - (Number(this.totalCase) || 0);
  }


  dipstock() {
    const dataToSend: any = {
      date: this.use.getFormattedDate(this.reportDate),
      userId: this.userId || localStorage.getItem('userId')
    };

    if (this.Petrol_dip || this.Petrol_stock || this.Diesel_dip || this.Diesel_stock) {
      dataToSend.type = 'edit';
      dataToSend.petroldip = this.Petrol_dip || null;
      dataToSend.pvalue = this.Petrol_stock || null;
      dataToSend.dieseldip = this.Diesel_dip || null;
      dataToSend.dvalue = this.Diesel_stock || null;
    } else {
      // If all data values are null, send 'add' type only with date
      dataToSend.type = 'add';
      dataToSend.petroldip = this.Petrol_dip || null;
      dataToSend.pvalue = this.Petrol_stock || null;
      dataToSend.dieseldip = this.Diesel_dip || null;
      dataToSend.dvalue = this.Diesel_stock || null;
    }

    // Open the dialog with the prepared data
    const dialogRef = this.dialog.open(DipStockReportComponent, {
      data: dataToSend,
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-md']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.isReload || result === true)) {
        this.getDiplist();
      }
    });
  }

  getDiplist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const uid = this.userId || localStorage.getItem('userId');
    this.use.getDipList(formattedDate, uid).subscribe(
      (data) => {
        if (data && data.length > 0 && Array.isArray(data[0])) {
          this.Petrol_dip = data[0][2] ?? this.Petrol_dip ?? 0;
          this.Petrol_stock = data[0][3] ?? this.Petrol_stock ?? 0;
          this.Diesel_dip = data[0][0] ?? this.Diesel_dip ?? 0;
          this.Diesel_stock = data[0][1] ?? this.Diesel_stock ?? 0;
        }
      },
      (error) => {
        console.error("Failed to fetch Dip data.", error);
      }
    );
  }


  extraDipstock() {
    const dataToSend: any = {
      date: this.use.getFormattedDate(this.reportDate),
      userId: this.userId || localStorage.getItem('userId')
    };

    if (this.Petrol_dip || this.Petrol_stock || this.Diesel_dip || this.Diesel_stock) {
      dataToSend.type = 'edit';
      dataToSend.petroldip = this.Extra_Petrol_dip || null;
      dataToSend.pvalue = this.Extra_Petrol_stock || null;
      dataToSend.dieseldip = this.Extra_Diesel_dip || null;
      dataToSend.dvalue = this.Extra_Diesel_stock || null;
    } else {
      // If all data values are null, send 'add' type only with date
      dataToSend.type = 'add';
      dataToSend.petroldip = this.Extra_Petrol_dip || null;
      dataToSend.pvalue = this.Extra_Petrol_stock || null;
      dataToSend.dieseldip = this.Extra_Diesel_dip || null;
      dataToSend.dvalue = this.Extra_Diesel_stock || null;
    }

    // Open the dialog with the prepared data
    const dialogRef = this.dialog.open(ExtraDipAddEditComponent, {
      data: dataToSend,
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-md']
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getextraDiplist();
    });
  }

  getextraDiplist() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getextraDipList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.Extra_Petrol_dip = data[0][2] ?? 0;
          this.Extra_Petrol_stock = data[0][3] ?? 0;
          this.Extra_Diesel_dip = data[0][0] ?? 0;
          this.Extra_Diesel_stock = data[0][1] ?? 0;
        } else {
          this.Extra_Petrol_dip = 0;
          this.Extra_Petrol_stock = 0;
          this.Extra_Diesel_dip = 0;
          this.Extra_Diesel_stock = 0;
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Purchase data.");
      }
    );
  }


  get TotalPetrolStock(): number {
    const petrolUgadto = Number(this.Petrol_Ugadto_Stock) || 0;
    const petrolQty = Number(this.petolQuantity) || 0;
    const petrolGatt = Number(this.Petrolgatt) || 0;
    return petrolUgadto + petrolQty - petrolGatt;
  }

  get TotalDieselStock(): number {
    const dieselUgadto = Number(this.Diesel_Ugadto_Stock) || 0;
    const dieselQty = Number(this.dieselQuantity) || 0;
    const dieselGatt = Number(this.dieselgatt) || 0;
    return dieselUgadto + dieselQty - dieselGatt;
  }

  get TotalXPPetrolStock(): number {
    const xppetrolUgadto = Number(this.XP_Petrol_Ugadto_Stock) || 0;
    const xppetrolQty = Number(this.xpPetolQuantity) || 0;
    const xpPetrolGatt = Number(this.XpPetrolgatt) || 0;
    return xppetrolUgadto + xppetrolQty - xpPetrolGatt;
  }

  get TotalPowerDieselStock(): number {
    const PowerdieselUgadto = Number(this.Power_Diesel_Ugadto_Stock) || 0;
    const PowerdieselQty = Number(this.powerDieselQuantity) || 0;
    const Powerdieselgatt = Number(this.PowerDieselgatt) || 0;
    return PowerdieselUgadto + PowerdieselQty - Powerdieselgatt;
  }

  get TotalPetrolRemaining(): number {
    return this.TotalPetrolStock - (Number(this.petrolTotalLTR) || 0);
  }

  get TotalDieselRemaining(): number {
    return this.TotalDieselStock - (Number(this.dieselTotalLTR) || 0);
  }

  get TotalXPPetrolRemaining(): number {
    return this.TotalXPPetrolStock - (Number(this.xpPetrolTotalLTR) || 0);
  }

  get TotalPowerDieselRemaining(): number {
    return this.TotalPowerDieselStock - (Number(this.powerDieselTotalLTR) || 0);
  }


  Submit() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.userId = this.userId || localStorage.getItem('userId');
    //   const petrolInputData = this.petrolPumps
    //   .filter(p => !(p.openingMeter === 0 && p.closingMeter === 0 && p.testing === 0 && p.rate === 0 && p.saleLtr === 0 && p.total_rs === 0 && p.ltr === 0))
    //   .map(p => ({
    //     date: String(this.use.getFormattedDate(this.reportDate)),      
    //     user_id: String(this.userId),                                  
    //     pump: String(p.name),                                          
    //     open_meter: String(p.openingMeter),                            
    //     close_meter: String(p.closingMeter),                           
    //     testing: String(p.testing),                                    
    //     rate: String(p.rate),                                          
    //     petrol_ltr: String(p.saleLtr),                                      
    //     total_sell: String(p.total_rs),                                
    //     total: String(p.ltr)                                      
    //   }));

    // const dieselInputData = this.dieselPumps
    //   .filter(d => !(d.openingMeter === 0 && d.closingMeter === 0 && d.testing === 0 && d.rate === 0 && d.saleLtr === 0 && d.total_rs === 0 && d.ltr === 0))
    //   .map(d => ({
    //     date: String(this.use.getFormattedDate(this.reportDate)),     
    //     user_id: String(this.userId),                                 
    //     pump: String(d.name),                                         
    //     open_meter: String(d.openingMeter),                           
    //     close_meter: String(d.closingMeter),                          
    //     testing: String(d.testing),                                   
    //     rate: String(d.rate),                                         
    //     diesel_ltr: String(d.saleLtr),                                     
    //     total_sell: String(d.total_rs),                               
    //     total: String(d.ltr)                                     
    //   }));
    const petrolInputData = this.petrolPumps
      .filter(p => !(
        (p.openingMeter === 0 || p.openingMeter === null) &&
        (p.closingMeter === 0 || p.closingMeter === null) &&
        (p.testing === 0 || p.testing === null) &&
        (p.rate === 0 || p.rate === null) &&
        (p.saleLtr === 0 || p.saleLtr === null) &&
        (p.total_rs === 0 || p.total_rs === null) &&
        (p.ltr === 0 || p.ltr === null)
      ))
      .map(p => ({
        date: String(this.use.getFormattedDate(this.reportDate)),
        user_id: String(this.userId),
        pump: String(p.name),
        open_meter: p.openingMeter !== null ? String(p.openingMeter) : '',
        close_meter: p.closingMeter !== null ? String(p.closingMeter) : '',
        testing: p.testing !== null ? String(p.testing) : '',
        rate: p.rate !== null ? String(p.rate) : '',
        petrol_ltr: p.saleLtr !== null ? String(p.saleLtr) : '',
        total_sell: p.total_rs !== null ? String(p.total_rs) : '',
        total: p.ltr !== null ? String(p.ltr) : ''
      }));
    const dieselInputData = this.dieselPumps
      .filter(d => !(
        (d.openingMeter === 0 || d.openingMeter === null) &&
        (d.closingMeter === 0 || d.closingMeter === null) &&
        (d.testing === 0 || d.testing === null) &&
        (d.rate === 0 || d.rate === null) &&
        (d.saleLtr === 0 || d.saleLtr === null) &&
        (d.total_rs === 0 || d.total_rs === null) &&
        (d.ltr === 0 || d.ltr === null)
      ))
      .map(d => ({
        date: String(this.use.getFormattedDate(this.reportDate)),
        user_id: String(this.userId),
        pump: String(d.name),
        open_meter: d.openingMeter !== null ? String(d.openingMeter) : '',
        close_meter: d.closingMeter !== null ? String(d.closingMeter) : '',
        testing: d.testing !== null ? String(d.testing) : '',
        rate: d.rate !== null ? String(d.rate) : '',
        diesel_ltr: d.saleLtr !== null ? String(d.saleLtr) : '',
        total_sell: d.total_rs !== null ? String(d.total_rs) : '',
        total: d.ltr !== null ? String(d.ltr) : ''
      }));


    const XppetrolInputData = this.xpPetrol
      .filter(p => !(
        (p.openingMeter === 0 || p.openingMeter === null) &&
        (p.closingMeter === 0 || p.closingMeter === null) &&
        (p.testing === 0 || p.testing === null) &&
        (p.rate === 0 || p.rate === null) &&
        (p.saleLtr === 0 || p.saleLtr === null) &&
        (p.total_rs === 0 || p.total_rs === null) &&
        (p.ltr === 0 || p.ltr === null)
      ))
      .map(p => ({
        date: String(this.use.getFormattedDate(this.reportDate)),
        user_id: String(this.userId),
        pump: String(p.name),
        open_meter: p.openingMeter !== null ? String(p.openingMeter) : '',
        close_meter: p.closingMeter !== null ? String(p.closingMeter) : '',
        testing: p.testing !== null ? String(p.testing) : '',
        rate: p.rate !== null ? String(p.rate) : '',
        xppetrol_ltr: p.saleLtr !== null ? String(p.saleLtr) : '',
        total_sell: p.total_rs !== null ? String(p.total_rs) : '',
        total: p.ltr !== null ? String(p.ltr) : ''
      }));
    const powerDieselInputData = this.powerDiesel
      .filter(p => !(
        (p.openingMeter === 0 || p.openingMeter === null) &&
        (p.closingMeter === 0 || p.closingMeter === null) &&
        (p.testing === 0 || p.testing === null) &&
        (p.rate === 0 || p.rate === null) &&
        (p.saleLtr === 0 || p.saleLtr === null) &&
        (p.total_rs === 0 || p.total_rs === null) &&
        (p.ltr === 0 || p.ltr === null)
      ))
      .map(p => ({
        date: String(this.use.getFormattedDate(this.reportDate)),
        user_id: String(this.userId),
        pump: String(p.name),
        open_meter: p.openingMeter !== null ? String(p.openingMeter) : '',
        close_meter: p.closingMeter !== null ? String(p.closingMeter) : '',
        testing: p.testing !== null ? String(p.testing) : '',
        rate: p.rate !== null ? String(p.rate) : '',
        powerdiesel_ltr: p.saleLtr !== null ? String(p.saleLtr) : '',
        total_sell: p.total_rs !== null ? String(p.total_rs) : '',
        total: p.ltr !== null ? String(p.ltr) : ''
      }));

    const originalDate = new Date(this.reportDate);
    const nextDay = new Date(originalDate);
    nextDay.setDate(originalDate.getDate() + 1);
    const oneformattedDate = this.use.getFormattedDate(nextDay);

    const formatted = this.use.getFormattedDate(this.reportDate);
    const payload = {
      date: formatted,
      note: this.note,
      totalCaseCase: this.totalCaseCase,
      denominations: [
        { value: 'twothousand', total: this.twothousand, count: this.multipliers.twothousand || 0 },
        { value: 'fivehundred', total: this.fivehundred, count: this.multipliers.fivehundred || 0 },
        { value: 'twohundred', total: this.twohundred, count: this.multipliers.twohundred || 0 },
        { value: 'onehundred', total: this.onehundred, count: this.multipliers.onehundred || 0 },
        { value: 'fifty', total: this.fifty, count: this.multipliers.fifty || 0 },
        { value: 'twenty', total: this.twenty, count: this.multipliers.twenty || 0 },
        { value: 'ten', total: this.ten, count: this.multipliers.ten || 0 }
      ],
      userId: this.userId
    };

    const operations = [
      this.use.savefuleData(petrolInputData, dieselInputData),
      this.use.saveXpPowerData(XppetrolInputData, powerDieselInputData),
      this.use.savePetrolStockData(this.userId, oneformattedDate, this.TotalPetrolRemaining),
      this.use.saveDieselStockData(this.userId, oneformattedDate, this.TotalDieselRemaining),
      this.use.saveXPPetrolStockData(this.userId, oneformattedDate, this.TotalXPPetrolRemaining),
      this.use.savePowerDieselStockData(this.userId, oneformattedDate, this.TotalPowerDieselRemaining),
      this.use.saveTotalCase(this.userId, formattedDate, this.totalCase),
      this.use.saveMoneyDetails(payload)
    ];

    const currentRole = localStorage.getItem('role') || '';
    const currentPumpId = localStorage.getItem('pumpId');
    if ((currentRole === 'EMPLOYEE' || currentRole === 'employee' || currentRole === 'PUMP_MANAGER' || currentRole === 'pumpmanager' || currentRole === 'user') && this.userId) {
      const stockDetailsObj = {
        petrolRemaining: this.TotalPetrolRemaining || 0,
        dieselRemaining: this.TotalDieselRemaining || 0,
        xpPetrolRemaining: this.TotalXPPetrolRemaining || 0,
        powerDieselRemaining: this.TotalPowerDieselRemaining || 0
      };
      const dailyReportPayload = {
        pumpId: currentPumpId ? +currentPumpId : 1,
        employeeId: this.userId ? +this.userId : null,
        employeeName: ((localStorage.getItem('firstName') || '') + ' ' + (localStorage.getItem('lastName') || '')).trim() || localStorage.getItem('username') || 'Employee',
        reportDate: formatted,
        reportTime: this.currentTime,
        shift: this.selectedShift,
        createdBy: localStorage.getItem('username') || 'Employee',
        salesAmount: this.totalRs || 0,
        stockDetails: JSON.stringify(stockDetailsObj),
        petrolSales: this.petrolTotalRS || 0,
        dieselSales: this.dieselTotalRS || 0,
        expenses: this.kharchTotal || 0,
        cash: this.totalCase || 0,
        status: 'Pending'
      };
      operations.push(this.use.submitDailyReport(dailyReportPayload));
    }

    forkJoin(operations.map(op =>
      op.pipe(
        catchError(err => {
          this.notificationService.failure("❌ Error: " + (err.message || "Failed to save data"));
          return of({ error: true, message: err.message });
        })
      )
    )).subscribe(results => {
      const issues = results.filter(res => {
        if (!res) return false;
        if (res.error) return true;
        if (res.message && res.message.includes('already')) return true;
        return false;
      });

      if (issues.length === 0) {
        this.notificationService.success("✅ All details added successfully");
      } else {
        // Errors are already shown by catchError or we can show them here for 'already' cases
        issues.forEach(res => {
          if (res.message && res.message.includes('already')) {
            this.notificationService.failure("⚠️ " + res.message);
          }
        });
      }
    });
  }
  printReport() {
    const originalTitle = document.title;
    const formatted = this.use.getFormattedDate(this.reportDate);
    document.title = `${formatted}`;
    window.print();
    document.title = originalTitle;
  }

  saveTotalCase() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    return this.use.saveTotalCase(this.userId, formattedDate, this.totalCase);
  }


  calculateTotal() {
    this.twothousand = 2000 * (this.multipliers.twothousand || 0);
    this.fivehundred = 500 * (this.multipliers.fivehundred || 0);
    this.twohundred = 200 * (this.multipliers.twohundred || 0);
    this.onehundred = 100 * (this.multipliers.onehundred || 0);
    this.fifty = 50 * (this.multipliers.fifty || 0);
    this.twenty = 20 * (this.multipliers.twenty || 0);
    this.ten = 10 * (this.multipliers.ten || 0);

    // Calculate Total
    this.totalCaseCase =
      this.twothousand +
      this.fivehundred +
      this.twohundred +
      this.onehundred +
      this.fifty +
      this.twenty +
      this.ten;
  }

  sendData() {
    const formatted = this.use.getFormattedDate(this.reportDate);
    const payload = {
      date: formatted,
      note: this.note,
      totalCaseCase: this.totalCaseCase,
      denominations: [
        { value: 'twothousand', total: this.twothousand, count: this.multipliers.twothousand || 0 },
        { value: 'fivehundred', total: this.fivehundred, count: this.multipliers.fivehundred || 0 },
        { value: 'twohundred', total: this.twohundred, count: this.multipliers.twohundred || 0 },
        { value: 'onehundred', total: this.onehundred, count: this.multipliers.onehundred || 0 },
        { value: 'fifty', total: this.fifty, count: this.multipliers.fifty || 0 },
        { value: 'twenty', total: this.twenty, count: this.multipliers.twenty || 0 },
        { value: 'ten', total: this.ten, count: this.multipliers.ten || 0 }
      ],
      userId: this.userId
    };
    // console.log("Sending Payload: ", payload);
    return this.use.saveMoneyDetails(payload);
  }
  downloadPDF() {
    this.loaderService.display(true);
    const frontContent = document.getElementById('printable-content') as HTMLElement;
    const backPage = document.getElementById('back-page') as HTMLElement;
    const noPrintElements = document.querySelectorAll('.no-print') as NodeListOf<HTMLElement>;
    const formatted = this.use.getFormattedDate(this.reportDate);

    // Yield main thread to allow loading spinner to render
    setTimeout(() => {
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Hide all no-print elements
      noPrintElements.forEach(el => {
        el.style.display = 'none';
      });

      const canvasOptions = {
        scale: 1.5, // 1.5 is significantly faster than 2.0 with minimal quality loss
        useCORS: true,
        logging: false
      };

      html2canvas(frontContent, canvasOptions).then(frontCanvas => {
        const pageHeight = 297;
        const pageWidth = 210;

        let printWidth = pageWidth;
        let printHeight = (frontCanvas.height * printWidth) / frontCanvas.width;
        let xOffset = 0;
        let yOffset = 0;

        if (printHeight > pageHeight) {
          const ratio = pageHeight / printHeight;
          printWidth = printWidth * ratio;
          printHeight = pageHeight;
          xOffset = (pageWidth - printWidth) / 2;
        }

        const contentDataURL = frontCanvas.toDataURL('image/jpeg', 0.85);
        pdf.addImage(contentDataURL, 'JPEG', xOffset, yOffset, printWidth, printHeight);

        // Back Page - force a new page
        html2canvas(backPage, canvasOptions).then(backCanvas => {
          pdf.addPage();

          let backPrintWidth = pageWidth;
          let backPrintHeight = (backCanvas.height * backPrintWidth) / backCanvas.width;
          let backXOffset = 0;
          let backYOffset = 0;

          if (backPrintHeight > pageHeight) {
            const ratio = pageHeight / backPrintHeight;
            backPrintWidth = backPrintWidth * ratio;
            backPrintHeight = pageHeight;
            backXOffset = (pageWidth - backPrintWidth) / 2;
          }

          const backDataURL = backCanvas.toDataURL('image/jpeg', 0.85);
          pdf.addImage(backDataURL, 'JPEG', backXOffset, backYOffset, backPrintWidth, backPrintHeight);

          pdf.save(`${formatted}.pdf`);

          // Restore no-print elements and hide loader
          noPrintElements.forEach(el => {
            el.style.display = '';
          });
          this.loaderService.display(false);
          this.notificationService.success('PDF Downloaded successfully!');
        }).catch(err => {
          console.error('Back page render error:', err);
          this.loaderService.display(false);
          this.notificationService.failure('Failed to render PDF back page.');
          noPrintElements.forEach(el => {
            el.style.display = '';
          });
        });
      }).catch(err => {
        console.error('Front page render error:', err);
        this.loaderService.display(false);
        this.notificationService.failure('Failed to render PDF front page.');
        noPrintElements.forEach(el => {
          el.style.display = '';
        });
      });
    }, 100);
  }

  getMoneyDetailsList() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    this.use.getMoneyList(formattedDate, this.userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.note = data[0].note;
          this.totalCaseCase = data[0].totalCase;
          this.multipliers.twothousand = data[0].twothousand || null;
          this.multipliers.fivehundred = data[0].fivehundred || null;
          this.multipliers.twohundred = data[0].twohundred || null;
          this.multipliers.onehundred = data[0].onehundred || null;
          this.multipliers.fifty = data[0].fifty || null;
          this.multipliers.twenty = data[0].twenty || null;
          this.multipliers.ten = data[0].ten || null;
          this.calculateTotal();
        } else {
          this.note = '';
          this.totalCaseCase = 0;
          this.multipliers.twothousand = null;
          this.multipliers.fivehundred = null;
          this.multipliers.twohundred = null;
          this.multipliers.onehundred = null;
          this.multipliers.fifty = null;
          this.multipliers.twenty = null;
          this.multipliers.ten = null;
          this.calculateTotal();
        }
      },
      (error) => {
        this.notificationService.failure("Failed to fetch Purchase data.");
      }
    );
  }

  backPage() {
    const userId = this.userId || localStorage.getItem('userId');
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const apiUrl = `${API_BACKPAGE}?date=${formattedDate}&userId=${userId}`;

    this.http.get<BackPageResponse>(apiUrl, {
      headers: {
        'Authorization': `Bearer ${userId}`
      }
    }).subscribe(
      response => {
        this.kharchSellSummary = response.kharchSellSummary || [];
        this.transactionSellSummary = response.transactionSellSummary || [];
        this.jamaSummary = response.jamaSummary || [];
        this.bakiSummary = response.bakiSummary || [];

        this.firstTableData = this.jamaSummary;
        this.secondTableData = this.bakiSummary;
        this.creditTableData = response.loclcredit || [];
        // console.log(this.creditTableData);

        // this.firstTableData = this.jamaSummary.filter(item => item[1] <= 10000);
        // this.secondTableData = this.bakiSummary.filter(item => item[1] <= 10000);
      },
      error => {
        console.error('Error fetching data', error);
        this.firstTableData = [];
        this.secondTableData = [];
        this.creditTableData = [];
      }
    );
  }

  openPetrolGatt(data?: any) {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddGattComponent, {
      data: {
        date: formattedDate,
        petrolgatt: this.Petrolgatt,
        userId: this.userId || localStorage.getItem('userId')
      },
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-md']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPetrolGatt();
      }
    });
  }

  getPetrolGatt() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const uid = this.userId || localStorage.getItem('userId');
    this.use.getPetrolGatt(formattedDate, uid).subscribe(
      data => {
        if (data) {
          this.Petrolgatt = data.petrolgatt ?? 0;
        } else {
          this.Petrolgatt = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.Petrolgatt = 0;
      }
    );
  }

  openDieselGatt(data?: any) {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddDieselgattComponent, {
      data: {
        date: formattedDate,
        dieselgatt: this.dieselgatt,
        userId: this.userId || localStorage.getItem('userId')
      },
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-md']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDieselGatt();
      }
    });
  }

  getDieselGatt() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const uid = this.userId || localStorage.getItem('userId');
    this.use.getDieselGatt(formattedDate, uid).subscribe(
      data => {
        if (data) {
          this.dieselgatt = data.dieselgatt ?? 0;
        } else {
          this.dieselgatt = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.dieselgatt = 0;
      }
    );
  }

  openXpPetrolGatt(data?: any) {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddXpPetrolgattComponent, {
      data: {
        date: formattedDate,
        xppetrolgatt: this.XpPetrolgatt,
        userId: this.userId || localStorage.getItem('userId')
      },
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-md']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getXpPetrolGatt();
      }
    });
  }

  getXpPetrolGatt() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const uid = this.userId || localStorage.getItem('userId');
    this.use.getXpPetrolGatt(formattedDate, uid).subscribe(
      data => {
        if (data) {
          this.XpPetrolgatt = data.xpPetrolgatt ?? 0;
        } else {
          this.XpPetrolgatt = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.XpPetrolgatt = 0;
      }
    );
  }

  openPowerDieselGatt(data?: any) {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const dialogRef = this.dialog.open(AddPowerDieselgattComponent, {
      data: {
        date: formattedDate,
        PowerDieselgatt: this.PowerDieselgatt,
        userId: this.userId || localStorage.getItem('userId')
      },
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-md']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPowerDieselGatt();
      }
    });
  }

  getPowerDieselGatt() {
    const formattedDate = this.use.getFormattedDate(this.reportDate);
    const uid = this.userId || localStorage.getItem('userId');
    this.use.getPowerDieselGatt(formattedDate, uid).subscribe(
      data => {
        if (data) {
          this.PowerDieselgatt = data.powerDieselgatt ?? 0;
        } else {
          this.PowerDieselgatt = 0;
        }
      },
      error => {
        console.error('Error fetching stock data', error);
        this.PowerDieselgatt = 0;
      }
    );
  }

  loadManagerReportsByDate() {
    const pumpId = localStorage.getItem('pumpId');
    const userId = localStorage.getItem('userId');
    if (!pumpId) return;
    const formattedDate = this.use.getFormattedDate(this.managerSelectedDate);
    this.use.getManagerDailyReports(+pumpId, formattedDate, userId ? +userId : undefined).subscribe(
      (data) => {
        this.managerReports = data || [];
        this.populateEmployeeList();
        this.applyManagerFilters();
      },
      (error) => {
        console.error('Error fetching manager daily reports:', error);
      }
    );
  }

  loadAllManagerReports() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    this.use.getManagerReports(+userId).subscribe(
      (data) => {
        this.managerReports = data || [];
        this.populateEmployeeList();
        this.applyManagerFilters();
      },
      (error) => {
        console.error('Error fetching all manager reports:', error);
      }
    );
  }

  populateEmployeeList() {
    const employees = new Set<string>();
    this.managerReports.forEach(r => {
      const name = r.employeeName || r.createdBy;
      if (name) {
        employees.add(name);
      }
    });
    this.employeeList = Array.from(employees);
  }

  applyManagerFilters() {
    let filtered = [...this.managerReports];

    // Filter by Employee Name
    if (this.managerSelectedEmployee) {
      filtered = filtered.filter(r => (r.employeeName || r.createdBy) === this.managerSelectedEmployee);
    }

    // Filter by Shift
    if (this.managerSelectedShift) {
      filtered = filtered.filter(r => r.shift === this.managerSelectedShift);
    }

    // Filter by Date Range (From Date / To Date) if specified
    if (this.managerFromDate) {
      const fromStr = this.use.getFormattedDate(this.managerFromDate);
      filtered = filtered.filter(r => r.reportDate >= fromStr);
    }
    if (this.managerToDate) {
      const toStr = this.use.getFormattedDate(this.managerToDate);
      filtered = filtered.filter(r => r.reportDate <= toStr);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        (r.employeeName && r.employeeName.toLowerCase().includes(query)) ||
        (r.createdBy && r.createdBy.toLowerCase().includes(query)) ||
        (r.shift && r.shift.toLowerCase().includes(query)) ||
        (r.status && r.status.toLowerCase().includes(query))
      );
    }

    this.filteredReports = filtered;
  }

  verifyReport(report: any) {
    report.status = 'Verified';
    this.use.updateDailyReport(report.reportId, report).subscribe(
      (updated) => {
        this.notificationService.success('Report verified successfully!');
        this.loadManagerReportsByDate();
      },
      (err) => {
        this.notificationService.failure('Failed to verify report.');
      }
    );
  }

  approveReport(report: any) {
    report.status = 'Approved';
    this.use.updateDailyReport(report.reportId, report).subscribe(
      (updated) => {
        this.notificationService.success('Report approved successfully!');
        this.loadManagerReportsByDate();
      },
      (err) => {
        this.notificationService.failure('Failed to approve report.');
      }
    );
  }

  startEditingReport(report: any) {
    this.editingReportId = report.reportId;
  }

  saveReportEdit(report: any) {
    report.salesAmount = (Number(report.petrolSales) || 0) + (Number(report.dieselSales) || 0);
    this.use.updateDailyReport(report.reportId, report).subscribe(
      (updated) => {
        this.notificationService.success('Report edited successfully!');
        this.editingReportId = null;
        this.loadManagerReportsByDate();
      },
      (err) => {
        this.notificationService.failure('Failed to save edit.');
      }
    );
  }

  cancelReportEdit() {
    this.editingReportId = null;
    this.loadManagerReportsByDate();
  }

  exportManagerReports() {
    const headers = ['Employee Name', 'Report Time', 'Report Date', 'Shift', 'Petrol Sales', 'Diesel Sales', 'Total Sales', 'Expenses', 'Cash', 'Status'];
    const rows = this.filteredReports.map(r => [
      r.employeeName || r.createdBy || '',
      r.reportTime || '',
      r.reportDate || '',
      r.shift || '',
      r.petrolSales || 0,
      r.dieselSales || 0,
      r.salesAmount || 0,
      r.expenses || 0,
      r.cash || 0,
      r.status || 'Pending'
    ]);

    if (this.filteredReports.length > 0) {
      rows.push([
        'Total (All Managed Employees)',
        '-',
        '-',
        '-',
        this.totalManagerPetrolSales,
        this.totalManagerDieselSales,
        this.totalManagerRevenue,
        this.totalManagerExpenses,
        this.totalManagerCash,
        '-'
      ]);
    }

    let csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Manager_Daily_Reports_${this.use.getFormattedDate(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getManagerEmployees() {
    const mgrId = Number(localStorage.getItem('userId'));
    if (mgrId) {
      this.use.getEmployeesByManager(mgrId).subscribe(
        (data) => {
          this.managerEmployeeList = data || [];
          this.onManagerViewChange();
        },
        (err) => {
          console.error("Failed to load manager's employees:", err);
          this.onManagerViewChange();
        }
      );
    } else {
      this.onManagerViewChange();
    }
  }

  onDateChange() {
    if (this.userRole !== 'EMPLOYEE' && this.userRole !== 'employee') {
      this.managerSelectedDate = this.reportDate;
      this.loadManagerReportsByDate();
      this.onManagerViewChange();
    } else {
      this.showSelectedDate();
    }
  }

  onManagerViewChange() {
    if (this.selectedEmployeeIdForView === 'ALL') {
      this.userId = localStorage.getItem('userId');
      this.getUserPump();
      this.loadAggregatedDailyReportData();
    } else {
      this.userId = this.selectedEmployeeIdForView;
      this.getUserPump();
      this.showSelectedDate();
    }
  }

  resetAllDailyReportFields() {
    this.petrolPumps.forEach(pump => {
      pump.openingMeter = null;
      pump.closingMeter = null;
      pump.saleLtr = 0;
      pump.testing = null;
      pump.ltr = 0;
      pump.rate = null;
      pump.total_rs = 0;
    });
    this.dieselPumps.forEach(pump => {
      pump.openingMeter = null;
      pump.closingMeter = null;
      pump.saleLtr = 0;
      pump.testing = null;
      pump.ltr = 0;
      pump.rate = null;
      pump.total_rs = 0;
    });
    this.xpPetrol.forEach(pump => {
      pump.openingMeter = null;
      pump.closingMeter = null;
      pump.saleLtr = 0;
      pump.testing = null;
      pump.ltr = 0;
      pump.rate = null;
      pump.total_rs = 0;
    });
    this.powerDiesel.forEach(pump => {
      pump.openingMeter = null;
      pump.closingMeter = null;
      pump.saleLtr = 0;
      pump.testing = null;
      pump.ltr = 0;
      pump.rate = null;
      pump.total_rs = 0;
    });
    this.petrolTotalLTR = 0;
    this.petrolTotalRS = 0;
    this.dieselTotalLTR = 0;
    this.dieselTotalRS = 0;
    this.xpPetrolTotalLTR = 0;
    this.xpPetrolTotalRS = 0;
    this.powerDieselTotalLTR = 0;
    this.powerDieselTotalRS = 0;
    this.totalRs = 0;
    this.oilsellTotal = 0;
    this.ATMTotal = 0;
    this.kharchTotal = 0;
    this.jamaTotal = 0;
    this.bakiTotal = 0;
    this.petrolPurchaseLTR = 0;
    this.dieselPurchaseLTR = 0;
    this.xpPetolQuantity = 0;
    this.powerDieselQuantity = 0;
    this.oilQuantity = 0;
    this.Petrol_dip = 0;
    this.Petrol_stock = 0;
    this.Diesel_dip = 0;
    this.Diesel_stock = 0;
    this.Extra_Petrol_dip = 0;
    this.Extra_Petrol_stock = 0;
    this.Extra_Diesel_dip = 0;
    this.Extra_Diesel_stock = 0;
    this.Total_Case = 0;
    this.Petrol_Ugadto_Stock = 0;
    this.Diesel_Ugadto_Stock = 0;
    this.XP_Petrol_Ugadto_Stock = 0;
    this.Power_Diesel_Ugadto_Stock = 0;
    this.Petrolgatt = 0;
    this.dieselgatt = 0;
    this.XpPetrolgatt = 0;
    this.PowerDieselgatt = 0;
    this.creditNOteIOCL = 0;
    this.firstTableData = [];
    this.secondTableData = [];
    this.creditTableData = [];
    this.kharchSellSummary = [];
    this.transactionSellSummary = [];
    this.jamaSummary = [];
    this.bakiSummary = [];
    this.multipliers = {
      twothousand: null,
      fivehundred: null,
      twohundred: null,
      onehundred: null,
      fifty: null,
      twenty: null,
      ten: null
    };
    this.twothousand = 0;
    this.fivehundred = 0;
    this.twohundred = 0;
    this.onehundred = 0;
    this.fifty = 0;
    this.twenty = 0;
    this.ten = 0;
    this.totalCaseCase = 0;
    this.note = '';
  }

  loadAggregatedDailyReportData() {
    const formatted = this.use.getFormattedDate(this.reportDate);
    const empIds = this.managerEmployeeList.map(emp => emp.id.toString());

    if (empIds.length === 0) {
      this.resetAllDailyReportFields();
      return;
    }

    // 1. Petrol Nozzles
    const petrolCalls = empIds.map(id => this.use.getPetrolList(formatted, id).pipe(catchError(() => of([]))));
    forkJoin(petrolCalls).subscribe((results: any[][]) => {
      const allItems = results.reduce((acc, curr) => acc.concat(curr || []), []);
      this.aggregateFuelItems(this.petrolPumps, allItems, 'petrol_ltr');
      this.calculateTotals();
    });

    // 2. Diesel Nozzles
    const dieselCalls = empIds.map(id => this.use.getDieselList(formatted, id).pipe(catchError(() => of([]))));
    forkJoin(dieselCalls).subscribe((results: any[][]) => {
      const allItems = results.reduce((acc, curr) => acc.concat(curr || []), []);
      this.aggregateFuelItems(this.dieselPumps, allItems, 'diesel_ltr');
      this.calculateTotals();
    });

    // 3. XP Petrol Nozzles
    const xpCalls = empIds.map(id => this.use.getXPPetrolList(formatted, id).pipe(catchError(() => of([]))));
    forkJoin(xpCalls).subscribe((results: any[][]) => {
      const allItems = results.reduce((acc, curr) => acc.concat(curr || []), []);
      this.aggregateFuelItems(this.xpPetrol, allItems, 'xppetrol_ltr');
      this.calculateTotals();
    });

    // 4. Power Diesel Nozzles
    const powerCalls = empIds.map(id => this.use.getpowerDiesel(formatted, id).pipe(catchError(() => of([]))));
    forkJoin(powerCalls).subscribe((results: any[][]) => {
      const allItems = results.reduce((acc, curr) => acc.concat(curr || []), []);
      this.aggregateFuelItems(this.powerDiesel, allItems, 'powerdiesel_ltr');
      this.calculateTotals();
    });

    // 5. Oil sell (Lube sales)
    const oilCalls = empIds.map(id => this.use.getOillsellList(formatted, id).pipe(catchError(() => of([]))));
    forkJoin(oilCalls).subscribe((results: any[]) => {
      this.oilsellTotal = results.reduce((sum, list) => sum + (list && list.length > 0 ? (Number(list[0]) || 0) : 0), 0);
    });

    // 6. ATM Transactions (Digital payments)
    const atmCalls = empIds.map(id => this.use.getTransactionList(formatted, id).pipe(catchError(() => of([]))));
    forkJoin(atmCalls).subscribe((results: any[]) => {
      this.ATMTotal = results.reduce((sum, list) => sum + (list && list.length > 0 ? (Number(list[0]) || 0) : 0), 0);
    });

    // 7. Expenses (Kharch list)
    const kharchCalls = empIds.map(id => this.use.getKharchList(formatted, id).pipe(catchError(() => of([]))));
    forkJoin(kharchCalls).subscribe((results: any[]) => {
      this.kharchTotal = results.reduce((sum, list) => sum + (list && list.length > 0 ? (Number(list[0]) || 0) : 0), 0);
    });

    // 8. Jama & Baki list
    const jbCalls = empIds.map(id => this.use.getJamaBakiList(formatted, id).pipe(catchError(() => of([]))));
    forkJoin(jbCalls).subscribe((results: any[][]) => {
      this.jamaTotal = results.reduce((sum, data) => sum + (data && data.length > 0 ? (Number(data[0][0]) || 0) : 0), 0);
      this.bakiTotal = results.reduce((sum, data) => sum + (data && data.length > 0 ? (Number(data[0][1]) || 0) : 0), 0);
    });

    // 9. Purchases list (Inventory Monitoring - current user ID)
    const currentUserId = localStorage.getItem('userId') || this.userId;
    this.use.getPurchaseiList(formatted, currentUserId).subscribe(list => {
      this.petrolPurchaseLTR = 0;
      this.dieselPurchaseLTR = 0;
      if (list && list.length > 0) {
        for (const item of list) {
          const [quantity, type] = item;
          if (type === 'Petrol') this.petrolPurchaseLTR = quantity || 0;
          else if (type === 'Diesel') this.dieselPurchaseLTR = quantity || 0;
        }
      }
    });

    // 10. Extra Purchases list (Inventory Monitoring - current user ID)
    this.use.getExtraPurchaseiList(formatted, currentUserId).subscribe(list => {
      this.xpPetolQuantity = 0;
      this.powerDieselQuantity = 0;
      if (list && list.length > 0) {
        for (const item of list) {
          const [quantity, type] = item;
          if (type === 'XP Petrol') this.xpPetolQuantity = quantity || 0;
          else if (type === 'Power Diesel') this.powerDieselQuantity = quantity || 0;
        }
      }
    });

    // 11. Dip list (Inventory Monitoring - current user ID)
    this.use.getDipList(formatted, currentUserId).subscribe(data => {
      if (data && data.length > 0 && Array.isArray(data[0])) {
        this.Petrol_dip = data[0][2] ?? 0;
        this.Petrol_stock = data[0][3] ?? 0;
        this.Diesel_dip = data[0][0] ?? 0;
        this.Diesel_stock = data[0][1] ?? 0;
      } else {
        this.Petrol_dip = 0;
        this.Petrol_stock = 0;
        this.Diesel_dip = 0;
        this.Diesel_stock = 0;
      }
    });

    // 12. Extra Dip list (Inventory Monitoring - current user ID)
    this.use.getextraDipList(formatted, currentUserId).subscribe(data => {
      if (data && data.length > 0) {
        this.Extra_Petrol_dip = data[0][2] ?? 0;
        this.Extra_Petrol_stock = data[0][3] ?? 0;
        this.Extra_Diesel_dip = data[0][0] ?? 0;
        this.Extra_Diesel_stock = data[0][1] ?? 0;
      } else {
        this.Extra_Petrol_dip = 0;
        this.Extra_Petrol_stock = 0;
        this.Extra_Diesel_dip = 0;
        this.Extra_Diesel_stock = 0;
      }
    });

    // 13. Cash Details
    const moneyCalls = empIds.map(id => this.use.getMoneyList(formatted, id).pipe(catchError(() => of([]))));
    forkJoin(moneyCalls).subscribe((results: any[]) => {
      this.Total_Case = results.reduce((sum, list) => sum + (list && list.length > 0 ? (Number(list[0]) || 0) : 0), 0);
    });

    // 14. Back page ledgers
    const backpageCalls = empIds.map(id => {
      const apiUrl = `${API_BACKPAGE}?date=${formatted}&userId=${id}`;
      return this.http.get<BackPageResponse>(apiUrl, {
        headers: { 'Authorization': `Bearer ${id}` }
      }).pipe(catchError(() => of({ kharchSellSummary: [], transactionSellSummary: [], jamaSummary: [], bakiSummary: [], loclcredit: [] } as any)));
    });
    forkJoin(backpageCalls).subscribe((results: BackPageResponse[]) => {
      this.kharchSellSummary = [];
      this.transactionSellSummary = [];
      this.jamaSummary = [];
      this.bakiSummary = [];
      this.creditTableData = [];

      results.forEach(res => {
        if (res.kharchSellSummary) this.kharchSellSummary.push(...res.kharchSellSummary);
        if (res.transactionSellSummary) this.transactionSellSummary.push(...res.transactionSellSummary);
        if (res.jamaSummary) this.jamaSummary.push(...res.jamaSummary);
        if (res.bakiSummary) this.bakiSummary.push(...res.bakiSummary);
        if (res.loclcredit) this.creditTableData.push(...res.loclcredit);
      });

      this.firstTableData = this.jamaSummary;
      this.secondTableData = this.bakiSummary;
    });

    // 15. Denominations
    const denominationCalls = empIds.map(id => this.use.getMoneyList(formatted, id).pipe(catchError(() => of([]))));
    forkJoin(denominationCalls).subscribe((results: any[][]) => {
      this.multipliers = {
        twothousand: 0,
        fivehundred: 0,
        twohundred: 0,
        onehundred: 0,
        fifty: 0,
        twenty: 0,
        ten: 0
      };
      this.twothousand = 0;
      this.fivehundred = 0;
      this.twohundred = 0;
      this.onehundred = 0;
      this.fifty = 0;
      this.twenty = 0;
      this.ten = 0;
      this.totalCaseCase = 0;
      this.note = '';

      results.forEach(data => {
        if (data && data.length > 0) {
          const row = data[0];
          this.multipliers.twothousand = (this.multipliers.twothousand || 0) + (+row.twothousand || 0);
          this.multipliers.fivehundred = (this.multipliers.fivehundred || 0) + (+row.fivehundred || 0);
          this.multipliers.twohundred = (this.multipliers.twohundred || 0) + (+row.twohundred || 0);
          this.multipliers.onehundred = (this.multipliers.onehundred || 0) + (+row.onehundred || 0);
          this.multipliers.fifty = (this.multipliers.fifty || 0) + (+row.fifty || 0);
          this.multipliers.twenty = (this.multipliers.twenty || 0) + (+row.twenty || 0);
          this.multipliers.ten = (this.multipliers.ten || 0) + (+row.ten || 0);
          if (row.note) {
            if (this.note) this.note += ' | ';
            this.note += row.note;
          }
        }
      });
      const multAny = this.multipliers as any;
      Object.keys(multAny).forEach(k => {
        if (!multAny[k]) multAny[k] = null;
      });
      this.calculateTotal();
    });

    // Stock levels (Inventory Monitoring - current user ID)
    this.use.getPetrolStock(formatted, currentUserId).subscribe(data => {
      if (data) {
        const item = Array.isArray(data) ? data[0] : data;
        this.Petrol_Ugadto_Stock = item ? (item.petrol ?? item.petrol_stock ?? item.openstock ?? (typeof item === 'number' ? item : 0)) : 0;
      } else {
        this.Petrol_Ugadto_Stock = 0;
      }
    });
    this.use.getDieselStock(formatted, currentUserId).subscribe(data => {
      if (data) {
        const item = Array.isArray(data) ? data[0] : data;
        this.Diesel_Ugadto_Stock = item ? (item.diesel ?? item.diesel_stock ?? item.dieselopenstock ?? (typeof item === 'number' ? item : 0)) : 0;
      } else {
        this.Diesel_Ugadto_Stock = 0;
      }
    });
    this.use.getXpPetrolStock(formatted, currentUserId).subscribe(data => {
      if (data) {
        const item = Array.isArray(data) ? data[0] : data;
        this.XP_Petrol_Ugadto_Stock = item ? (item.Xppetrol ?? item.xp_petrol ?? item.xp_ugadto_stock ?? item.xp_petrol_stock ?? (typeof item === 'number' ? item : 0)) : 0;
      } else {
        this.XP_Petrol_Ugadto_Stock = 0;
      }
    });
    this.use.getPowerDieselStock(formatted, currentUserId).subscribe(data => {
      if (data) {
        const item = Array.isArray(data) ? data[0] : data;
        this.Power_Diesel_Ugadto_Stock = item ? (item.Powerdiesel ?? item.power_diesel ?? item.power_ugadto_stock ?? item.power_diesel_stock ?? (typeof item === 'number' ? item : 0)) : 0;
      } else {
        this.Power_Diesel_Ugadto_Stock = 0;
      }
    });

    // Gatt Petrol, Diesel, XP, Power Diesel (Inventory Monitoring - current user ID)
    this.use.getPetrolGatt(formatted, currentUserId).subscribe((res: any) => {
      const item = Array.isArray(res) ? res[0] : res;
      this.Petrolgatt = item?.petrolgatt || 0;
    });
    this.use.getDieselGatt(formatted, currentUserId).subscribe((res: any) => {
      const item = Array.isArray(res) ? res[0] : res;
      this.dieselgatt = item?.dieselgatt || 0;
    });
    this.use.getXpPetrolGatt(formatted, currentUserId).subscribe((res: any) => {
      const item = Array.isArray(res) ? res[0] : res;
      this.XpPetrolgatt = item?.xpPetrolgatt || 0;
    });
    this.use.getPowerDieselGatt(formatted, currentUserId).subscribe((res: any) => {
      const item = Array.isArray(res) ? res[0] : res;
      this.PowerDieselgatt = item?.powerDieselgatt || 0;
    });

    // Credit Note IOCL
    const creditCalls = empIds.map(id => this.use.getcreditNOteIOCL(formatted, id).pipe(catchError(() => of(null))));
    forkJoin(creditCalls).subscribe((results: any[]) => {
      this.creditNOteIOCL = results.reduce((sum, res) => sum + (res?.loclCredit || 0), 0);
    });

    // Oil Purchase List (Inventory Monitoring - current user ID)
    this.use.getOilPurchaseiList(formatted, currentUserId).subscribe((data: any) => {
      this.oilQuantity = 0;
      if (data && data.length > 0) {
        for (const item of data) {
          const [quantity, type] = item;
          if (type === 'oil') {
            this.oilQuantity += quantity || 0;
          }
        }
      }
    });
  }

  cancel() {
    location.reload();
  }

}
