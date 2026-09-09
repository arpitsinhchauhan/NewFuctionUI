import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { API_AGGREGATED_DATA } from "app/serviceult";
import { UserServiceService } from "app/services/user-service.service";
import { AggregatedDataDTO } from "app/models/AggregatedDataDTO";
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Component({
  selector: "app-pump-detail",
  templateUrl: "./pump-detail.component.html",
  styleUrls: ["./pump-detail.component.css"],
})
export class PumpDetailComponent implements OnInit {
  // productList: any = [];
  startDate: string;
  totalPetrolSum: number = 0;
  endDate: string;
  combinedSummary: any[] = [];
  productList: AggregatedDataDTO[] = [];
  expenseHeaders: any[] = [];
  totalPetroltotalsum: number = 0;
  totalDieselsum: number = 0;
  totalDieseltotalSum: number = 0;
  totalOilTotalPrice: number = 0;
  totalKharchTotal: number = 0;
  totalPetrolQuantity: number = 0;
  totalPetrolTotal: number = 0;
  totalPetrolVat: number = 0;
  totalPetrolCess: number = 0;
  totalPetrolJtcpercentage: number = 0;
  totalPetrolTotalPurchase: number = 0;
  totalDieselQuantity: number = 0;
  totalDieselTotal: number = 0;
  totalDieselVat: number = 0;
  totalDieselCess: number = 0;
  totalDieselJtcpercentage: number = 0;
  totalDieselTotalPurchase: number = 0;
  totalOilQuantity: number = 0;
  totalOilNetTotal: number = 0;
  totalOilGstAmount: number = 0;
  totalOilCessAmount: number = 0;
  totalOilGstPercentage: number = 0;
  totalOilNetAmount: number = 0;
  totalOilMrp: number = 0;
  totalOilQtyLtrOrKg: number = 0;
  totalOilRate: number = 0;
  totalOilTaxableValue: number = 0;
  totalOilCessPercentage: number = 0;
  totalOilDiscount: number = 0;
  totalAmountTotal: number = 0;
  totalJamaTotal: number = 0;
  totalBakiTotal: number = 0;
  totalloclTotal: number = 0;
  // XP Petrol Totals
  totalXpPetrolTotalSum: number = 0;
  totalXpPetrolTotalSell: number = 0;
  totalXpPetrolQuantity: number = 0;
  totalXpPetrolTotal: number = 0;
  totalXpPetrolVat: number = 0;
  totalXpPetrolCess: number = 0;
  totalXpPetrolJtcpercentage: number = 0;
  totalXpPetrolTotalPurchase: number = 0;

  // Power Diesel Totals
  totalPowerDieselTotalSum: number = 0;
  totalPowerDieselTotalSell: number = 0;
  totalPowerDieselQuantity: number = 0;
  totalPowerDieselTotal: number = 0;
  totalPowerDieselVat: number = 0;
  totalPowerDieselCess: number = 0;
  totalPowerDieselJtcpercentage: number = 0;
  totalPowerDieselTotalPurchase: number = 0;
  totalTotalValue: number = 0;
  xp_petrol_nozzle: number;
  powe_diesel_nozzle: number;
  loclDetailsTotal: number = 0;
  userId = localStorage.getItem("userId");
  managerId: string | null = null;
  employeeIds: number[] = [];

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.managerId = data.managerId || null;
    this.employeeIds = data.employeeIds || [];
  }

  ngOnInit(): void {
    this.getPurchase();
    this.getUserName();
  }

  getUserName() {
    this.use.getUserNameAndNozzle(this.userId).subscribe((data) => {
      this.xp_petrol_nozzle = Number(data.data.xp_petrol_nozzle);
      this.powe_diesel_nozzle = Number(data.data.powe_diesel_nozzle);
    });
  }

  getPurchase() {
    const startDate = this.startDate.toString().split("T")[0];
    const endDate = this.endDate.toString().split("T")[0];

    let params = new HttpParams()
      .set("startDate", startDate)
      .set("endDate", endDate)
      .set("userId", this.userId || "");

    if (this.managerId) {
      params = params.set("managerId", this.managerId);
    }

    this.http.get<AggregatedDataDTO[]>(API_AGGREGATED_DATA, { params })
      .subscribe({
        next: (data) => this.processAggregatedData(this.mergeAggregatedByDate(data || [])),
        error: (error) => console.error("Error fetching data:", error)
      });
  }

  /**
   * When a PumpManager has multiple employees, each employee's daily records
   * are stored under their own user_id. This method groups all records by date
   * and sums numeric fields, producing one merged row per day.
   */
  mergeAggregatedByDate(data: AggregatedDataDTO[]): AggregatedDataDTO[] {
    const grouped: { [date: string]: any } = {};

    data.forEach(item => {
      const date = (item as any).date || '';
      if (!grouped[date]) {
        grouped[date] = { ...item };
      } else {
        const g = grouped[date];
        // ── Petrol Sell ──
        const itemOpenP = Number((item as any).petrolTotalOpenMeter) || 0;
        const itemCloseP = Number((item as any).petrolTotalCloseMeter) || 0;
        if (itemOpenP > 0) {
          g.petrolTotalOpenMeter = (Number(g.petrolTotalOpenMeter) || 0) > 0 
            ? Math.min(Number(g.petrolTotalOpenMeter), itemOpenP) 
            : itemOpenP;
        }
        if (itemCloseP > 0) {
          g.petrolTotalCloseMeter = Math.max(Number(g.petrolTotalCloseMeter) || 0, itemCloseP);
        }
        g.petrolTotalSum = (Number(g.petrolTotalSum) || 0) + (Number(item.petrolTotalSum) || 0);
        g.petrolTotalTotalSell = (Number(g.petrolTotalTotalSell) || 0) + (Number(item.petrolTotalTotalSell) || 0);
        g.petrolRate = Number(item.petrolRate) || Number(g.petrolRate) || 0;
        g.petrolgatt_Total = (Number(g.petrolgatt_Total) || 0) + (Number((item as any).petrolgatt_Total) || 0);
        // ── Diesel Sell ──
        const itemOpenD = Number((item as any).dieselTotalOpenMeter) || 0;
        const itemCloseD = Number((item as any).dieselTotalCloseMeter) || 0;
        if (itemOpenD > 0) {
          g.dieselTotalOpenMeter = (Number(g.dieselTotalOpenMeter) || 0) > 0 
            ? Math.min(Number(g.dieselTotalOpenMeter), itemOpenD) 
            : itemOpenD;
        }
        if (itemCloseD > 0) {
          g.dieselTotalCloseMeter = Math.max(Number(g.dieselTotalCloseMeter) || 0, itemCloseD);
        }
        g.dieselTotalSum = (Number(g.dieselTotalSum) || 0) + (Number(item.dieselTotalSum) || 0);
        g.dieselTotalTotalSell = (Number(g.dieselTotalTotalSell) || 0) + (Number(item.dieselTotalTotalSell) || 0);
        g.dieselRate = Number(item.dieselRate) || Number(g.dieselRate) || 0;
        g.dieselgatt_Total = (Number(g.dieselgatt_Total) || 0) + (Number((item as any).dieselgatt_Total) || 0);
        // ── XP Petrol ──
        const itemOpenXP = Number((item as any).xppetrolOpenMeter) || 0;
        const itemCloseXP = Number((item as any).xppetrolCloseMeter) || 0;
        if (itemOpenXP > 0) {
          g.xppetrolOpenMeter = (Number(g.xppetrolOpenMeter) || 0) > 0 
            ? Math.min(Number(g.xppetrolOpenMeter), itemOpenXP) 
            : itemOpenXP;
        }
        if (itemCloseXP > 0) {
          g.xppetrolCloseMeter = Math.max(Number(g.xppetrolCloseMeter) || 0, itemCloseXP);
        }
        g.xppetrolTotalSum = (Number(g.xppetrolTotalSum) || 0) + (Number(item.xppetrolTotalSum) || 0);
        g.xppetrolTotalSell = (Number(g.xppetrolTotalSell) || 0) + (Number(item.xppetrolTotalSell) || 0);
        g.xppetrolQuantity = (Number(g.xppetrolQuantity) || 0) + (Number(item.xppetrolQuantity) || 0);
        g.xppetrolTotal = (Number(g.xppetrolTotal) || 0) + (Number(item.xppetrolTotal) || 0);
        g.xppetrolVat = (Number(g.xppetrolVat) || 0) + (Number(item.xppetrolVat) || 0);
        g.xppetrolCess = (Number(g.xppetrolCess) || 0) + (Number(item.xppetrolCess) || 0);
        g.xppetrolJtcpercentage = (Number(g.xppetrolJtcpercentage) || 0) + (Number(item.xppetrolJtcpercentage) || 0);
        g.xppetrolTotalPurchase = (Number(g.xppetrolTotalPurchase) || 0) + (Number(item.xppetrolTotalPurchase) || 0);
        // ── Power Diesel ──
        const itemOpenPD = Number((item as any).powerdieselOpenMeter) || 0;
        const itemClosePD = Number((item as any).powerdieselCloseMeter) || 0;
        if (itemOpenPD > 0) {
          g.powerdieselOpenMeter = (Number(g.powerdieselOpenMeter) || 0) > 0 
            ? Math.min(Number(g.powerdieselOpenMeter), itemOpenPD) 
            : itemOpenPD;
        }
        if (itemClosePD > 0) {
          g.powerdieselCloseMeter = Math.max(Number(g.powerdieselCloseMeter) || 0, itemClosePD);
        }
        g.powerdieselTotalSum = (Number(g.powerdieselTotalSum) || 0) + (Number(item.powerdieselTotalSum) || 0);
        g.powerdieselTotalSell = (Number(g.powerdieselTotalSell) || 0) + (Number(item.powerdieselTotalSell) || 0);
        g.powerdieselQuantity = (Number(g.powerdieselQuantity) || 0) + (Number(item.powerdieselQuantity) || 0);
        g.powerdieselTotal = (Number(g.powerdieselTotal) || 0) + (Number(item.powerdieselTotal) || 0);
        g.powerdieselVat = (Number(g.powerdieselVat) || 0) + (Number(item.powerdieselVat) || 0);
        g.powerdieselCess = (Number(g.powerdieselCess) || 0) + (Number(item.powerdieselCess) || 0);
        g.powerdieselJtcpercentage = (Number(g.powerdieselJtcpercentage) || 0) + (Number(item.powerdieselJtcpercentage) || 0);
        g.powerdieselTotalPurchase = (Number(g.powerdieselTotalPurchase) || 0) + (Number(item.powerdieselTotalPurchase) || 0);
        // ── Oil Sell ──
        g.oilTotalPrice = (Number(g.oilTotalPrice) || 0) + (Number(item.oilTotalPrice) || 0);
        g.oilQuantity = (Number(g.oilQuantity) || 0) + (Number(item.oilQuantity) || 0);
        g.oilNetTotal = (Number(g.oilNetTotal) || 0) + (Number(item.oilNetTotal) || 0);
        g.oilGstAmount = (Number(g.oilGstAmount) || 0) + (Number(item.oilGstAmount) || 0);
        g.oilCessAmount = (Number(g.oilCessAmount) || 0) + (Number(item.oilCessAmount) || 0);
        g.oilNetAmount = (Number(g.oilNetAmount) || 0) + (Number(item.oilNetAmount) || 0);
        g.oilMrp = Number(item.oilMrp) || Number(g.oilMrp) || 0;
        g.oilQtyLtrOrKg = (Number(g.oilQtyLtrOrKg) || 0) + (Number(item.oilQtyLtrOrKg) || 0);
        g.oilRate = Number(item.oilRate) || Number(g.oilRate) || 0;
        g.oilTaxableValue = (Number(g.oilTaxableValue) || 0) + (Number(item.oilTaxableValue) || 0);
        g.oilDiscount = (Number(g.oilDiscount) || 0) + (Number(item.oilDiscount) || 0);
        // ── Petrol Purchase ──
        if (!g.petrolSkuNumber && item.petrolSkuNumber) g.petrolSkuNumber = item.petrolSkuNumber;
        g.petrolQuantity = (Number(g.petrolQuantity) || 0) + (Number(item.petrolQuantity) || 0);
        g.petrolTotal = (Number(g.petrolTotal) || 0) + (Number(item.petrolTotal) || 0);
        g.petrolVat = (Number(g.petrolVat) || 0) + (Number(item.petrolVat) || 0);
        g.petrolCess = (Number(g.petrolCess) || 0) + (Number(item.petrolCess) || 0);
        g.petrolJtcpercentage = (Number(g.petrolJtcpercentage) || 0) + (Number(item.petrolJtcpercentage) || 0);
        g.petrolTotalPurchase = (Number(g.petrolTotalPurchase) || 0) + (Number(item.petrolTotalPurchase) || 0);
        // ── Diesel Purchase ──
        if (!g.dieselSkuNumber && item.dieselSkuNumber) g.dieselSkuNumber = item.dieselSkuNumber;
        g.dieselQuantity = (Number(g.dieselQuantity) || 0) + (Number(item.dieselQuantity) || 0);
        g.dieselTotal = (Number(g.dieselTotal) || 0) + (Number(item.dieselTotal) || 0);
        g.dieselVat = (Number(g.dieselVat) || 0) + (Number(item.dieselVat) || 0);
        g.dieselCess = (Number(g.dieselCess) || 0) + (Number(item.dieselCess) || 0);
        g.dieselJtcpercentage = (Number(g.dieselJtcpercentage) || 0) + (Number(item.dieselJtcpercentage) || 0);
        g.dieselTotalPurchase = (Number(g.dieselTotalPurchase) || 0) + (Number(item.dieselTotalPurchase) || 0);
        // ── XP & Power SKU ──
        if (!g.xppetrolSkuNumber && item.xppetrolSkuNumber) g.xppetrolSkuNumber = item.xppetrolSkuNumber;
        if (!g.powerdieselSkuNumber && item.powerdieselSkuNumber) g.powerdieselSkuNumber = item.powerdieselSkuNumber;
        if (!g.oilSkuNumber && item.oilSkuNumber) g.oilSkuNumber = item.oilSkuNumber;
        if (!g.oilSkuName && item.oilSkuName) g.oilSkuName = item.oilSkuName;
        // ── Financials ──
        g.kharchTotal = (Number(g.kharchTotal) || 0) + (Number(item.kharchTotal) || 0);
        g.amountTotal = (Number(g.amountTotal) || 0) + (Number(item.amountTotal) || 0);
        g.jamaTotal = (Number(g.jamaTotal) || 0) + (Number(item.jamaTotal) || 0);
        g.bakiTotal = (Number(g.bakiTotal) || 0) + (Number(item.bakiTotal) || 0);
        g.locl_balance_Total = (Number(g.locl_balance_Total) || 0) + (Number(item.locl_balance_Total) || 0);
        // ── Merge Expenses Lists ──
        if (Array.isArray(item.expensesList) && item.expensesList.length > 0) {
          if (!Array.isArray(g.expensesList)) g.expensesList = [];
          item.expensesList.forEach((exp: any) => {
            const existing = g.expensesList.find((e: any) => e.expenses === exp.expenses);
            if (existing) {
              existing.total_price = (Number(existing.total_price) || 0) + (Number(exp.total_price) || 0);
            } else {
              g.expensesList.push({ ...exp });
            }
          });
        }
      }
    });

    return Object.values(grouped) as AggregatedDataDTO[];
  }

  processAggregatedData(data: AggregatedDataDTO[]) {
    this.expenseHeaders = this.getUniqueExpenseHeaders(data);
    this.productList = (data || []).map(item => {
      const totalVal = (Number(item.petrolTotalTotalSell) || 0) + (Number(item.dieselTotalTotalSell) || 0)
        + (Number(item.xppetrolTotalSell) || 0) + (Number(item.powerdieselTotalSell) || 0) + (Number(item.oilTotalPrice) || 0);
      return {
        ...item,
        petrolTotalOpenMeter: Number((item as any).petrolTotalOpenMeter) || 0,
        petrolTotalCloseMeter: Number((item as any).petrolTotalCloseMeter) || 0,
        petrolTotalSum: Number(item.petrolTotalSum) || 0,
        petrolRate: Number(item.petrolRate) || 0,
        petrolTotalTotalSell: Number(item.petrolTotalTotalSell) || 0,
        petrolgatt_Total: Number((item as any).petrolgatt_Total) || 0,
        dieselTotalOpenMeter: Number((item as any).dieselTotalOpenMeter) || 0,
        dieselTotalCloseMeter: Number((item as any).dieselTotalCloseMeter) || 0,
        dieselTotalSum: Number(item.dieselTotalSum) || 0,
        dieselRate: Number(item.dieselRate) || 0,
        dieselTotalTotalSell: Number(item.dieselTotalTotalSell) || 0,
        dieselgatt_Total: Number((item as any).dieselgatt_Total) || 0,
        oilTotalPrice: Number(item.oilTotalPrice) || 0,
        kharchTotal: Number(item.kharchTotal) || 0,
        petrolQuantity: Number(item.petrolQuantity) || 0,
        petrolTotal: Number(item.petrolTotal) || 0,
        petrolVat: Number(item.petrolVat) || 0,
        petrolCess: Number(item.petrolCess) || 0,
        petrolJtcpercentage: Number(item.petrolJtcpercentage) || 0,
        petrolTotalPurchase: Number(item.petrolTotalPurchase) || 0,
        dieselQuantity: Number(item.dieselQuantity) || 0,
        dieselTotal: Number(item.dieselTotal) || 0,
        dieselVat: Number(item.dieselVat) || 0,
        dieselCess: Number(item.dieselCess) || 0,
        dieselJtcpercentage: Number(item.dieselJtcpercentage) || 0,
        dieselTotalPurchase: Number(item.dieselTotalPurchase) || 0,
        oilQuantity: Number(item.oilQuantity) || 0,
        oilNetTotal: Number(item.oilNetTotal) || 0,
        oilGstAmount: Number(item.oilGstAmount) || 0,
        oilCessAmount: Number(item.oilCessAmount) || 0,
        oilGstPercentage: Number(item.oilGstPercentage) || 0,
        oilNetAmount: Number(item.oilNetAmount) || 0,
        oilMrp: Number(item.oilMrp) || 0,
        oilQtyLtrOrKg: Number(item.oilQtyLtrOrKg) || 0,
        oilRate: Number(item.oilRate) || 0,
        oilTaxableValue: Number(item.oilTaxableValue) || 0,
        oilCessPercentage: Number(item.oilCessPercentage) || 0,
        oilDiscount: Number(item.oilDiscount) || 0,
        amountTotal: Number(item.amountTotal) || 0,
        jamaTotal: Number(item.jamaTotal) || 0,
        bakiTotal: Number(item.bakiTotal) || 0,
        xppetrolOpenMeter: Number((item as any).xppetrolOpenMeter) || 0,
        xppetrolCloseMeter: Number((item as any).xppetrolCloseMeter) || 0,
        xppetrolTotalSum: Number(item.xppetrolTotalSum) || 0,
        xppetrolRate: Number(item.xppetrolRate) || 0,
        xppetrolTotalSell: Number(item.xppetrolTotalSell) || 0,
        xppetrolgatt_Total: Number((item as any).xppetrolgatt_Total) || 0,
        xppetrolQuantity: Number(item.xppetrolQuantity) || 0,
        xppetrolTotal: Number(item.xppetrolTotal) || 0,
        xppetrolVat: Number(item.xppetrolVat) || 0,
        xppetrolCess: Number(item.xppetrolCess) || 0,
        xppetrolJtcpercentage: Number(item.xppetrolJtcpercentage) || 0,
        xppetrolTotalPurchase: Number(item.xppetrolTotalPurchase) || 0,
        powerdieselOpenMeter: Number((item as any).powerdieselOpenMeter) || 0,
        powerdieselCloseMeter: Number((item as any).powerdieselCloseMeter) || 0,
        powerdieselTotalSum: Number(item.powerdieselTotalSum) || 0,
        powerdieselRate: Number(item.powerdieselRate) || 0,
        powerdieselTotalSell: Number(item.powerdieselTotalSell) || 0,
        power_dieselgatt_Total: Number((item as any).power_dieselgatt_Total) || 0,
        powerdieselQuantity: Number(item.powerdieselQuantity) || 0,
        powerdieselTotal: Number(item.powerdieselTotal) || 0,
        powerdieselVat: Number(item.powerdieselVat) || 0,
        powerdieselCess: Number(item.powerdieselCess) || 0,
        powerdieselJtcpercentage: Number(item.powerdieselJtcpercentage) || 0,
        powerdieselTotalPurchase: Number(item.powerdieselTotalPurchase) || 0,
        locl_balance_Total: Number(item.locl_balance_Total) || 0,
        expenseMap: this.buildExpenseMap(item.expensesList),
        totalValue: totalVal
      };
    });
    this.calculateTotals();
  }

  getUniqueExpenseHeaders(data: any[]): string[] {
    const headers = new Set<string>();
    (data || []).forEach(item => {
      if (Array.isArray(item.expensesList)) {
        item.expensesList.forEach((exp: any) => headers.add(exp.expenses));
      }
    });
    return Array.from(headers);
  }

  // Build a map: { "ASSOSIASAN FEE EXP": 10800, "BANK INTEREST": 2000, ... }
  buildExpenseMap(expensesList: any[]): { [key: string]: number } {
    const map: { [key: string]: number } = {};
    if (!Array.isArray(expensesList)) return map;
    expensesList.forEach(exp => {
      map[exp.expenses] = Number(exp.total_price ?? 0);
    });
    return map;
  }

  // Optional: Keep a function so template call won't break
  public getExpenseValue(expensesList: any[], header: string): number {
    if (!Array.isArray(expensesList)) return 0;
    const exp = expensesList.find(e => e.expenses === header);
    return exp ? Number(exp.total_price) : 0;
  }

  public getExpenseTotal(header: string): number {
    return this.productList.reduce((sum, item) => {
      const match = item.expensesList?.find((exp: any) => exp.expenses === header);
      return sum + (match ? (Number(match.total_price) || 0) : 0);
    }, 0);
  }

  calculateTotals() {
    this.totalPetrolSum = this.productList.reduce((sum, item) => sum + (Number(item.petrolTotalSum) || 0), 0);
    this.totalPetroltotalsum = this.productList.reduce((sum, item) => sum + (Number(item.petrolTotalTotalSell) || 0), 0);
    this.totalDieselsum = this.productList.reduce((sum, item) => sum + (Number(item.dieselTotalSum) || 0), 0);
    this.totalDieseltotalSum = this.productList.reduce((sum, item) => sum + (Number(item.dieselTotalTotalSell) || 0), 0);
    this.totalOilTotalPrice = this.productList.reduce((sum, item) => sum + (Number(item.oilTotalPrice) || 0), 0);
    this.totalKharchTotal = this.productList.reduce((sum, item) => sum + (Number(item.kharchTotal) || 0), 0);
    this.totalPetrolQuantity = this.productList.reduce((sum, item) => sum + (Number(item.petrolQuantity) || 0), 0);
    this.totalPetrolTotal = this.productList.reduce((sum, item) => sum + (Number(item.petrolTotal) || 0), 0);
    this.totalPetrolVat = this.productList.reduce((sum, item) => sum + (Number(item.petrolVat) || 0), 0);
    this.totalPetrolCess = this.productList.reduce((sum, item) => sum + (Number(item.petrolCess) || 0), 0);
    this.totalPetrolJtcpercentage = this.productList.reduce((sum, item) => sum + (Number(item.petrolJtcpercentage) || 0), 0);
    this.totalPetrolTotalPurchase = this.productList.reduce((sum, item) => sum + (Number(item.petrolTotalPurchase) || 0), 0);
    this.totalDieselQuantity = this.productList.reduce((sum, item) => sum + (Number(item.dieselQuantity) || 0), 0);
    this.totalDieselTotal = this.productList.reduce((sum, item) => sum + (Number(item.dieselTotal) || 0), 0);
    this.totalDieselVat = this.productList.reduce((sum, item) => sum + (Number(item.dieselVat) || 0), 0);
    this.totalDieselCess = this.productList.reduce((sum, item) => sum + (Number(item.dieselCess) || 0), 0);
    this.totalDieselJtcpercentage = this.productList.reduce((sum, item) => sum + (Number(item.dieselJtcpercentage) || 0), 0);
    this.totalDieselTotalPurchase = this.productList.reduce((sum, item) => sum + (Number(item.dieselTotalPurchase) || 0), 0);
    this.totalOilQuantity = this.productList.reduce((sum, item) => sum + (Number(item.oilQuantity) || 0), 0);
    this.totalOilNetTotal = this.productList.reduce((sum, item) => sum + (Number(item.oilNetTotal) || 0), 0);
    this.totalOilGstAmount = this.productList.reduce((sum, item) => sum + (Number(item.oilGstAmount) || 0), 0);
    this.totalOilCessAmount = this.productList.reduce((sum, item) => sum + (Number(item.oilCessAmount) || 0), 0);
    this.totalOilGstPercentage = this.productList.reduce((sum, item) => sum + (Number(item.oilGstPercentage) || 0), 0);
    this.totalOilNetAmount = this.productList.reduce((sum, item) => sum + (Number(item.oilNetAmount) || 0), 0);
    this.totalOilMrp = this.productList.reduce((sum, item) => sum + (Number(item.oilMrp) || 0), 0);
    this.totalOilQtyLtrOrKg = this.productList.reduce((sum, item) => sum + (Number(item.oilQtyLtrOrKg) || 0), 0);
    this.totalOilRate = this.productList.reduce((sum, item) => sum + (Number(item.oilRate) || 0), 0);
    this.totalOilTaxableValue = this.productList.reduce((sum, item) => sum + (Number(item.oilTaxableValue) || 0), 0);
    this.totalOilCessPercentage = this.productList.reduce((sum, item) => sum + (Number(item.oilCessPercentage) || 0), 0);
    this.totalOilDiscount = this.productList.reduce((sum, item) => sum + (Number(item.oilDiscount) || 0), 0);
    this.totalAmountTotal = this.productList.reduce((sum, item) => sum + (Number(item.amountTotal) || 0), 0);
    this.totalJamaTotal = this.productList.reduce((sum, item) => sum + (Number(item.jamaTotal) || 0), 0);
    this.totalBakiTotal = this.productList.reduce((sum, item) => sum + (Number(item.bakiTotal) || 0), 0);
    this.totalXpPetrolTotalSum = this.productList.reduce((sum, item) => sum + (Number(item.xppetrolTotalSum) || 0), 0);
    this.totalXpPetrolTotalSell = this.productList.reduce((sum, item) => sum + (Number(item.xppetrolTotalSell) || 0), 0);
    this.totalXpPetrolQuantity = this.productList.reduce((sum, item) => sum + (Number(item.xppetrolQuantity) || 0), 0);
    this.totalXpPetrolTotal = this.productList.reduce((sum, item) => sum + (Number(item.xppetrolTotal) || 0), 0);
    this.totalXpPetrolVat = this.productList.reduce((sum, item) => sum + (Number(item.xppetrolVat) || 0), 0);
    this.totalXpPetrolCess = this.productList.reduce((sum, item) => sum + (Number(item.xppetrolCess) || 0), 0);
    this.totalXpPetrolJtcpercentage = this.productList.reduce((sum, item) => sum + (Number(item.xppetrolJtcpercentage) || 0), 0);
    this.totalXpPetrolTotalPurchase = this.productList.reduce((sum, item) => sum + (Number(item.xppetrolTotalPurchase) || 0), 0);
    this.totalPowerDieselTotalSum = this.productList.reduce((sum, item) => sum + (Number(item.powerdieselTotalSum) || 0), 0);
    this.totalPowerDieselTotalSell = this.productList.reduce((sum, item) => sum + (Number(item.powerdieselTotalSell) || 0), 0);
    this.totalPowerDieselQuantity = this.productList.reduce((sum, item) => sum + (Number(item.powerdieselQuantity) || 0), 0);
    this.totalPowerDieselTotal = this.productList.reduce((sum, item) => sum + (Number(item.powerdieselTotal) || 0), 0);
    this.totalPowerDieselVat = this.productList.reduce((sum, item) => sum + (Number(item.powerdieselVat) || 0), 0);
    this.totalPowerDieselCess = this.productList.reduce((sum, item) => sum + (Number(item.powerdieselCess) || 0), 0);
    this.totalPowerDieselJtcpercentage = this.productList.reduce((sum, item) => sum + (Number(item.powerdieselJtcpercentage) || 0), 0);
    this.totalPowerDieselTotalPurchase = this.productList.reduce((sum, item) => sum + (Number(item.powerdieselTotalPurchase) || 0), 0);
    this.totalloclTotal = this.productList.reduce((sum, item) => sum + (Number(item.locl_balance_Total) || 0), 0);
    this.totalTotalValue = this.productList.reduce((sum, item) => sum + (Number(item.totalValue) || 0), 0);
  }

  exportToExcel(): void {

    const dataForExcel = this.productList.map(item => {
      const row: any = {
        date: item.date || "",
        // Petrol Sale
        petrolTotalOpenMeter: item.petrolTotalOpenMeter ?? 0,
        petrolTotalCloseMeter: item.petrolTotalCloseMeter ?? 0,
        petrolTotalSum: item.petrolTotalSum ?? 0,
        petrolRate: item.petrolRate ?? 0,
        petrolTotalTotalSell: item.petrolTotalTotalSell ?? 0,
        petrolgatt_Total: item.petrolgatt_Total ?? 0,
        // Diesel Sale
        dieselTotalOpenMeter: item.dieselTotalOpenMeter ?? 0,
        dieselTotalCloseMeter: item.dieselTotalCloseMeter ?? 0,
        dieselTotalSum: item.dieselTotalSum ?? 0,
        dieselRate: item.dieselRate ?? 0,
        dieselTotalTotalSell: item.dieselTotalTotalSell ?? 0,
        dieselgatt_Total: item.dieselgatt_Total ?? 0,
        oilTotalPrice: item.oilTotalPrice ?? 0,
        kharchTotal: item.kharchTotal ?? 0,
        // Petrol Purchase
        petrolSkuNumber: item.petrolSkuNumber || "",
        petrolQuantity: item.petrolQuantity ?? 0,
        petrolTotal: item.petrolTotal ?? 0,
        petrolVat: item.petrolVat ?? 0,
        petrolCess: item.petrolCess ?? 0,
        petrolJtcpercentage: item.petrolJtcpercentage ?? 0,
        petrolTotalPurchase: item.petrolTotalPurchase ?? 0,
        // Diesel Purchase
        dieselSkuNumber: item.dieselSkuNumber || "",
        dieselQuantity: item.dieselQuantity ?? 0,
        dieselTotal: item.dieselTotal ?? 0,
        dieselVat: item.dieselVat ?? 0,
        dieselCess: item.dieselCess ?? 0,
        dieselJtcpercentage: item.dieselJtcpercentage ?? 0,
        dieselTotalPurchase: item.dieselTotalPurchase ?? 0,
        // Oil Purchase
        oilQuantity: item.oilQuantity ?? 0,
        oilType: item.oilType || "",
        oilGstPercentage: item.oilGstPercentage ?? 0,
        oilHsn: item.oilHsn || "",
        oilMrp: item.oilMrp ?? 0,
        oilNetAmount: item.oilNetAmount ?? 0,
        oilNetTotal: item.oilNetTotal ?? 0,
        oilQtyLtrOrKg: item.oilQtyLtrOrKg ?? 0,
        oilRate: item.oilRate ?? 0,
        oilSkuName: item.oilSkuName || "",
        oilSkuNumber: item.oilSkuNumber || "",
        oilTaxableValue: item.oilTaxableValue ?? 0,
        oilUnit: item.oilUnit || "",
        oilVendorName: item.oilVendorName || "",
        oilCessAmount: item.oilCessAmount ?? 0,
        oilCessPercentage: item.oilCessPercentage ?? 0,
        oilDiscount: item.oilDiscount ?? 0,
        oilGstAmount: item.oilGstAmount ?? 0,
        // Financials
        amountTotal: item.amountTotal ?? 0,
        jamaTotal: item.jamaTotal ?? 0,
        bakiTotal: item.bakiTotal ?? 0,
        locl_balance_Total: item.locl_balance_Total ?? 0,
        // XP Petrol Sale
        xppetrolOpenMeter: item.xppetrolOpenMeter ?? 0,
        xppetrolCloseMeter: item.xppetrolCloseMeter ?? 0,
        xppetrolTotalSum: item.xppetrolTotalSum ?? 0,
        xppetrolRate: item.xppetrolRate ?? 0,
        xppetrolTotalSell: item.xppetrolTotalSell ?? 0,
        xppetrolgatt_Total: item.xppetrolgatt_Total ?? 0,
        // XP Petrol Purchase
        xppetrolSkuNumber: item.xppetrolSkuNumber || "",
        xppetrolQuantity: item.xppetrolQuantity ?? 0,
        xppetrolTotal: item.xppetrolTotal ?? 0,
        xppetrolVat: item.xppetrolVat ?? 0,
        xppetrolCess: item.xppetrolCess ?? 0,
        xppetrolJtcpercentage: item.xppetrolJtcpercentage ?? 0,
        xppetrolTotalPurchase: item.xppetrolTotalPurchase ?? 0,
        // Power Diesel Sale
        powerdieselOpenMeter: item.powerdieselOpenMeter ?? 0,
        powerdieselCloseMeter: item.powerdieselCloseMeter ?? 0,
        powerdieselTotalSum: item.powerdieselTotalSum ?? 0,
        powerdieselRate: item.powerdieselRate ?? 0,
        powerdieselTotalSell: item.powerdieselTotalSell ?? 0,
        power_dieselgatt_Total: item.power_dieselgatt_Total ?? 0,
        // Power Diesel Purchase
        powerdieselSkuNumber: item.powerdieselSkuNumber || "",
        powerdieselQuantity: item.powerdieselQuantity ?? 0,
        powerdieselTotal: item.powerdieselTotal ?? 0,
        powerdieselVat: item.powerdieselVat ?? 0,
        powerdieselCess: item.powerdieselCess ?? 0,
        powerdieselJtcpercentage: item.powerdieselJtcpercentage ?? 0,
        powerdieselTotalPurchase: item.powerdieselTotalPurchase ?? 0,
        totalValue: item.totalValue ?? 0
      };

      if (item.expensesList) {
        item.expensesList.forEach((exp: any) => {
          row[exp.expenses] = Number(exp.total_price) || 0;
        });
      }

      return row;
    });

    const totalsRow: any = {
      date: "Total",
      // Petrol Sale
      petrolTotalOpenMeter: "",
      petrolTotalCloseMeter: "",
      petrolTotalSum: Number(this.totalPetrolSum) || 0,
      petrolRate: "",
      petrolTotalTotalSell: Number(this.totalPetroltotalsum) || 0,
      petrolgatt_Total: this.productList.reduce((sum, item) => sum + (Number((item as any).petrolgatt_Total) || 0), 0),
      // Diesel Sale
      dieselTotalOpenMeter: "",
      dieselTotalCloseMeter: "",
      dieselTotalSum: Number(this.totalDieselsum) || 0,
      dieselRate: "",
      dieselTotalTotalSell: Number(this.totalDieseltotalSum) || 0,
      dieselgatt_Total: this.productList.reduce((sum, item) => sum + (Number((item as any).dieselgatt_Total) || 0), 0),
      oilTotalPrice: Number(this.totalOilTotalPrice) || 0,
      kharchTotal: Number(this.totalKharchTotal) || 0,
      // Petrol Purchase
      petrolSkuNumber: "",
      petrolQuantity: Number(this.totalPetrolQuantity) || 0,
      petrolTotal: Number(this.totalPetrolTotal) || 0,
      petrolVat: Number(this.totalPetrolVat) || 0,
      petrolCess: Number(this.totalPetrolCess) || 0,
      petrolJtcpercentage: Number(this.totalPetrolJtcpercentage) || 0,
      petrolTotalPurchase: Number(this.totalPetrolTotalPurchase) || 0,
      // Diesel Purchase
      dieselSkuNumber: "",
      dieselQuantity: Number(this.totalDieselQuantity) || 0,
      dieselTotal: Number(this.totalDieselTotal) || 0,
      dieselVat: Number(this.totalDieselVat) || 0,
      dieselCess: Number(this.totalDieselCess) || 0,
      dieselJtcpercentage: Number(this.totalDieselJtcpercentage) || 0,
      dieselTotalPurchase: Number(this.totalDieselTotalPurchase) || 0,
      // Oil Purchase
      oilQuantity: Number(this.totalOilQuantity) || 0,
      oilType: "",
      oilGstPercentage: Number(this.totalOilGstPercentage) || 0,
      oilHsn: "",
      oilMrp: Number(this.totalOilMrp) || 0,
      oilNetAmount: Number(this.totalOilNetAmount) || 0,
      oilNetTotal: Number(this.totalOilNetTotal) || 0,
      oilQtyLtrOrKg: Number(this.totalOilQtyLtrOrKg) || 0,
      oilRate: Number(this.totalOilRate) || 0,
      oilSkuName: "",
      oilSkuNumber: "",
      oilTaxableValue: Number(this.totalOilTaxableValue) || 0,
      oilUnit: "",
      oilVendorName: "",
      oilCessAmount: Number(this.totalOilCessAmount) || 0,
      oilCessPercentage: Number(this.totalOilCessPercentage) || 0,
      oilDiscount: Number(this.totalOilDiscount) || 0,
      oilGstAmount: Number(this.totalOilGstAmount) || 0,
      // Financials
      amountTotal: Number(this.totalAmountTotal) || 0,
      jamaTotal: Number(this.totalJamaTotal) || 0,
      bakiTotal: Number(this.totalBakiTotal) || 0,
      locl_balance_Total: Number(this.totalloclTotal) || 0,
      // XP Petrol Sale
      xppetrolOpenMeter: "",
      xppetrolCloseMeter: "",
      xppetrolTotalSum: Number(this.totalXpPetrolTotalSum) || 0,
      xppetrolRate: "",
      xppetrolTotalSell: Number(this.totalXpPetrolTotalSell) || 0,
      xppetrolgatt_Total: this.productList.reduce((sum, item) => sum + (Number((item as any).xppetrolgatt_Total) || 0), 0),
      // XP Petrol Purchase
      xppetrolSkuNumber: "",
      xppetrolQuantity: Number(this.totalXpPetrolQuantity) || 0,
      xppetrolTotal: Number(this.totalXpPetrolTotal) || 0,
      xppetrolVat: Number(this.totalXpPetrolVat) || 0,
      xppetrolCess: Number(this.totalXpPetrolCess) || 0,
      xppetrolJtcpercentage: Number(this.totalXpPetrolJtcpercentage) || 0,
      xppetrolTotalPurchase: Number(this.totalXpPetrolTotalPurchase) || 0,
      // Power Diesel Sale
      powerdieselOpenMeter: "",
      powerdieselCloseMeter: "",
      powerdieselTotalSum: Number(this.totalPowerDieselTotalSum) || 0,
      powerdieselRate: "",
      powerdieselTotalSell: Number(this.totalPowerDieselTotalSell) || 0,
      power_dieselgatt_Total: this.productList.reduce((sum, item) => sum + (Number((item as any).power_dieselgatt_Total) || 0), 0),
      // Power Diesel Purchase
      powerdieselSkuNumber: "",
      powerdieselQuantity: Number(this.totalPowerDieselQuantity) || 0,
      powerdieselTotal: Number(this.totalPowerDieselTotal) || 0,
      powerdieselVat: Number(this.totalPowerDieselVat) || 0,
      powerdieselCess: Number(this.totalPowerDieselCess) || 0,
      powerdieselJtcpercentage: Number(this.totalPowerDieselJtcpercentage) || 0,
      powerdieselTotalPurchase: Number(this.totalPowerDieselTotalPurchase) || 0,
      totalValue: Number(this.totalTotalValue) || 0
    };

    this.expenseHeaders.forEach(header => {
      totalsRow[header] = this.productList.reduce((sum, item) => {
        const match = item.expensesList?.find((exp: any) => exp.expenses === header);
        return sum + (match ? (Number(match.total_price) || 0) : 0);
      }, 0);
    });

    const dataWithTotals = [...dataForExcel, totalsRow];

    const headerOrder = [
      "date",
      "petrolTotalOpenMeter", "petrolTotalCloseMeter", "petrolTotalSum", "petrolRate", "petrolTotalTotalSell", "petrolgatt_Total",
      "dieselTotalOpenMeter", "dieselTotalCloseMeter", "dieselTotalSum", "dieselRate", "dieselTotalTotalSell", "dieselgatt_Total",
      "oilTotalPrice", "kharchTotal",
      "petrolSkuNumber", "petrolQuantity", "petrolTotal", "petrolVat", "petrolCess", "petrolJtcpercentage", "petrolTotalPurchase",
      "dieselSkuNumber", "dieselQuantity", "dieselTotal", "dieselVat", "dieselCess", "dieselJtcpercentage", "dieselTotalPurchase",
      "oilQuantity", "oilType", "oilGstPercentage",
      "oilHsn", "oilMrp", "oilNetAmount", "oilNetTotal", "oilQtyLtrOrKg", "oilRate",
      "oilSkuName", "oilSkuNumber", "oilTaxableValue", "oilUnit", "oilVendorName",
      "oilCessAmount", "oilCessPercentage", "oilDiscount", "oilGstAmount",
      "amountTotal", "jamaTotal", "bakiTotal", "locl_balance_Total",
      "xppetrolOpenMeter", "xppetrolCloseMeter", "xppetrolTotalSum", "xppetrolRate", "xppetrolTotalSell", "xppetrolgatt_Total",
      "xppetrolSkuNumber", "xppetrolQuantity", "xppetrolTotal", "xppetrolVat", "xppetrolCess", "xppetrolJtcpercentage", "xppetrolTotalPurchase",
      "powerdieselOpenMeter", "powerdieselCloseMeter", "powerdieselTotalSum", "powerdieselRate", "powerdieselTotalSell", "power_dieselgatt_Total",
      "powerdieselSkuNumber", "powerdieselQuantity", "powerdieselTotal", "powerdieselVat", "powerdieselCess", "powerdieselJtcpercentage", "powerdieselTotalPurchase",
      "totalValue",
      ...this.expenseHeaders
    ];

    const headerDisplayMap: any = {
      date: "Date",
      petrolTotalOpenMeter: "Petrol Open Meter",
      petrolTotalCloseMeter: "Petrol Close Meter",
      petrolTotalSum: "Petrol Sale LTR",
      petrolRate: "Petrol Sale Rate",
      petrolTotalTotalSell: "Petrol Sale Rs",
      petrolgatt_Total: "Petrol Gatt LTR",
      dieselTotalOpenMeter: "Diesel Open Meter",
      dieselTotalCloseMeter: "Diesel Close Meter",
      dieselTotalSum: "Diesel Sale LTR",
      dieselRate: "Diesel Sale Rate",
      dieselTotalTotalSell: "Diesel Sale Rs",
      dieselgatt_Total: "Diesel Gatt LTR",
      oilTotalPrice: "Oil Sale Total Rs",
      kharchTotal: "Indirect Expenses Rs",
      petrolSkuNumber: "Petrol Purchase SKU Number",
      petrolQuantity: "Petrol Purchase Ltr",
      petrolTotal: "Petrol Purchase Rs",
      petrolVat: "Petrol Purchase Vat",
      petrolCess: "Petrol Purchase Cess",
      petrolJtcpercentage: "Petrol Purchase JTC",
      petrolTotalPurchase: "Petrol Purchase Total Rs",
      dieselSkuNumber: "Diesel Purchase SKU Number",
      dieselQuantity: "Diesel Purchase Ltr",
      dieselTotal: "Diesel Purchase Rs",
      dieselVat: "Diesel Purchase Vat",
      dieselCess: "Diesel Purchase Cess",
      dieselJtcpercentage: "Diesel Purchase JTC",
      dieselTotalPurchase: "Diesel Purchase Total Rs",
      oilQuantity: "Oil Quantity",
      oilType: "Oil Type",
      oilGstPercentage: "Oil GST %",
      oilHsn: "Oil HSN",
      oilMrp: "Oil MRP",
      oilNetAmount: "Oil Net Amount",
      oilNetTotal: "Oil Net Total",
      oilQtyLtrOrKg: "Oil Qty Ltr/Kg",
      oilRate: "Oil Rate",
      oilSkuName: "Oil SKU Name",
      oilSkuNumber: "Oil SKU Number",
      oilTaxableValue: "Oil Taxable Value",
      oilUnit: "Oil Unit",
      oilVendorName: "Oil Vendor Name",
      oilCessAmount: "Oil Cess Amount",
      oilCessPercentage: "Oil Cess %",
      oilDiscount: "Oil Discount",
      oilGstAmount: "Oil GST Amount",
      amountTotal: "ATM Daily Rs",
      jamaTotal: "Customer Credit Bill",
      bakiTotal: "Customer Outstanding Bill",
      locl_balance_Total: "Credit Total",
      xppetrolOpenMeter: "XP Petrol Open Meter",
      xppetrolCloseMeter: "XP Petrol Close Meter",
      xppetrolTotalSum: "XP Petrol Sale LTR",
      xppetrolRate: "XP Petrol Sale Rate",
      xppetrolTotalSell: "XP Petrol Sale Rs",
      xppetrolgatt_Total: "XP Petrol Gatt LTR",
      xppetrolSkuNumber: "XP Petrol Purchase SKU Number",
      xppetrolQuantity: "XP Petrol Purchase Ltr",
      xppetrolTotal: "XP Petrol Purchase Rs",
      xppetrolVat: "XP Petrol Purchase Vat",
      xppetrolCess: "XP Petrol Purchase Cess",
      xppetrolJtcpercentage: "XP Petrol Purchase JTC",
      xppetrolTotalPurchase: "XP Petrol Purchase Total Rs",
      powerdieselOpenMeter: "Power Diesel Open Meter",
      powerdieselCloseMeter: "Power Diesel Close Meter",
      powerdieselTotalSum: "Power Diesel Sale LTR",
      powerdieselRate: "Power Diesel Sale Rate",
      powerdieselTotalSell: "Power Diesel Sale Rs",
      power_dieselgatt_Total: "Power Diesel Gatt LTR",
      powerdieselSkuNumber: "Power Diesel Purchase SKU Number",
      powerdieselQuantity: "Power Diesel Purchase Ltr",
      powerdieselTotal: "Power Diesel Purchase Rs",
      powerdieselVat: "Power Diesel Purchase Vat",
      powerdieselCess: "Power Diesel Purchase Cess",
      powerdieselJtcpercentage: "Power Diesel Purchase JTC",
      powerdieselTotalPurchase: "Power Diesel Purchase Total Rs",
      totalValue: "Total Value"
    };

    this.expenseHeaders.forEach(h => headerDisplayMap[h] = h);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      dataWithTotals,
      { header: headerOrder }
    );

    const displayHeaders = headerOrder.map(h => headerDisplayMap[h] || h);
    XLSX.utils.sheet_add_aoa(worksheet, [displayHeaders], { origin: "A1" });

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"]
    };

    XLSX.writeFile(workbook, "ProductList.xlsx");
  }


  close() {
    this.dialog.closeAll();
  }
}
