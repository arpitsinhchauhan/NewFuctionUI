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

    if (this.managerId && this.employeeIds && this.employeeIds.length > 0) {
      // ─── PUMP MANAGER: DB stores employee user_id, not managerId ───
      // Fetch data separately for each employee, then merge by date
      const requests = this.employeeIds.map(empId => {
        const params = new HttpParams()
          .set("startDate", startDate)
          .set("endDate", endDate)
          .set("userId", empId.toString());
        return this.http.get<AggregatedDataDTO[]>(API_AGGREGATED_DATA, { params })
          .pipe(catchError(() => of([] as AggregatedDataDTO[])));
      });

      forkJoin(requests).subscribe((results: AggregatedDataDTO[][]) => {
        const merged = this.mergeAggregatedByDate(results.flat());
        this.processAggregatedData(merged);
      });
    } else {
      // ─── SINGLE USER (Employee / Owner) ───
      const params = new HttpParams()
        .set("startDate", startDate)
        .set("endDate", endDate)
        .set("userId", this.userId);
      this.http.get<AggregatedDataDTO[]>(API_AGGREGATED_DATA, { params })
        .subscribe(
          (data) => this.processAggregatedData(data),
          (error) => console.error("Error fetching data:", error)
        );
    }
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
        g.petrolTotalSum       = (g.petrolTotalSum || 0)       + (item.petrolTotalSum || 0);
        g.petrolTotalTotalSell = (g.petrolTotalTotalSell || 0) + (item.petrolTotalTotalSell || 0);
        g.petrolRate           = (g.petrolRate || 0)           + (item.petrolRate || 0);
        g.petrolgatt_Total     = (g.petrolgatt_Total || 0)     + ((item as any).petrolgatt_Total || 0);
        // ── Diesel Sell ──
        g.dieselTotalSum       = (g.dieselTotalSum || 0)       + (item.dieselTotalSum || 0);
        g.dieselTotalTotalSell = (g.dieselTotalTotalSell || 0) + (item.dieselTotalTotalSell || 0);
        g.dieselRate           = (g.dieselRate || 0)           + (item.dieselRate || 0);
        g.dieselgatt_Total     = (g.dieselgatt_Total || 0)     + ((item as any).dieselgatt_Total || 0);
        // ── XP Petrol ──
        g.xppetrolTotalSum     = (g.xppetrolTotalSum || 0)     + (item.xppetrolTotalSum || 0);
        g.xppetrolTotalSell    = (g.xppetrolTotalSell || 0)    + (item.xppetrolTotalSell || 0);
        g.xppetrolQuantity     = (g.xppetrolQuantity || 0)     + (item.xppetrolQuantity || 0);
        g.xppetrolTotal        = (g.xppetrolTotal || 0)        + (item.xppetrolTotal || 0);
        g.xppetrolVat          = (g.xppetrolVat || 0)          + (item.xppetrolVat || 0);
        g.xppetrolCess         = (g.xppetrolCess || 0)         + (item.xppetrolCess || 0);
        g.xppetrolJtcpercentage= (g.xppetrolJtcpercentage || 0)+ (item.xppetrolJtcpercentage || 0);
        g.xppetrolTotalPurchase= (g.xppetrolTotalPurchase || 0)+ (item.xppetrolTotalPurchase || 0);
        // ── Power Diesel ──
        g.powerdieselTotalSum  = (g.powerdieselTotalSum || 0)  + (item.powerdieselTotalSum || 0);
        g.powerdieselTotalSell = (g.powerdieselTotalSell || 0) + (item.powerdieselTotalSell || 0);
        g.powerdieselQuantity  = (g.powerdieselQuantity || 0)  + (item.powerdieselQuantity || 0);
        g.powerdieselTotal     = (g.powerdieselTotal || 0)     + (item.powerdieselTotal || 0);
        g.powerdieselVat       = (g.powerdieselVat || 0)       + (item.powerdieselVat || 0);
        g.powerdieselCess      = (g.powerdieselCess || 0)      + (item.powerdieselCess || 0);
        g.powerdieselJtcpercentage=(g.powerdieselJtcpercentage||0)+(item.powerdieselJtcpercentage||0);
        g.powerdieselTotalPurchase=(g.powerdieselTotalPurchase||0)+(item.powerdieselTotalPurchase||0);
        // ── Oil Sell ──
        g.oilTotalPrice        = (g.oilTotalPrice || 0)        + (item.oilTotalPrice || 0);
        g.oilQuantity          = (g.oilQuantity || 0)          + (item.oilQuantity || 0);
        g.oilNetTotal          = (g.oilNetTotal || 0)          + (item.oilNetTotal || 0);
        g.oilGstAmount         = (g.oilGstAmount || 0)         + (item.oilGstAmount || 0);
        g.oilCessAmount        = (g.oilCessAmount || 0)        + (item.oilCessAmount || 0);
        g.oilNetAmount         = (g.oilNetAmount || 0)         + (item.oilNetAmount || 0);
        g.oilMrp               = (g.oilMrp || 0)               + (item.oilMrp || 0);
        g.oilQtyLtrOrKg        = (g.oilQtyLtrOrKg || 0)        + (item.oilQtyLtrOrKg || 0);
        g.oilRate              = (g.oilRate || 0)               + (item.oilRate || 0);
        g.oilTaxableValue      = (g.oilTaxableValue || 0)      + (item.oilTaxableValue || 0);
        g.oilDiscount          = (g.oilDiscount || 0)          + (item.oilDiscount || 0);
        // ── Petrol Purchase ──
        g.petrolQuantity       = (g.petrolQuantity || 0)       + (item.petrolQuantity || 0);
        g.petrolTotal          = (g.petrolTotal || 0)          + (item.petrolTotal || 0);
        g.petrolVat            = (g.petrolVat || 0)            + (item.petrolVat || 0);
        g.petrolCess           = (g.petrolCess || 0)           + (item.petrolCess || 0);
        g.petrolJtcpercentage  = (g.petrolJtcpercentage || 0)  + (item.petrolJtcpercentage || 0);
        g.petrolTotalPurchase  = (g.petrolTotalPurchase || 0)  + (item.petrolTotalPurchase || 0);
        // ── Diesel Purchase ──
        g.dieselQuantity       = (g.dieselQuantity || 0)       + (item.dieselQuantity || 0);
        g.dieselTotal          = (g.dieselTotal || 0)          + (item.dieselTotal || 0);
        g.dieselVat            = (g.dieselVat || 0)            + (item.dieselVat || 0);
        g.dieselCess           = (g.dieselCess || 0)           + (item.dieselCess || 0);
        g.dieselJtcpercentage  = (g.dieselJtcpercentage || 0)  + (item.dieselJtcpercentage || 0);
        g.dieselTotalPurchase  = (g.dieselTotalPurchase || 0)  + (item.dieselTotalPurchase || 0);
        // ── Financials ──
        g.kharchTotal          = (g.kharchTotal || 0)          + (item.kharchTotal || 0);
        g.amountTotal          = (g.amountTotal || 0)          + (item.amountTotal || 0);
        g.jamaTotal            = (g.jamaTotal || 0)            + (item.jamaTotal || 0);
        g.bakiTotal            = (g.bakiTotal || 0)            + (item.bakiTotal || 0);
        g.locl_balance_Total   = (g.locl_balance_Total || 0)   + (item.locl_balance_Total || 0);
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
    this.productList = data.map(item => {
      const totalVal = (item.petrolTotalTotalSell || 0) + (item.dieselTotalTotalSell || 0)
        + (item.xppetrolTotalSell || 0) + (item.powerdieselTotalSell || 0) + (item.oilTotalPrice || 0);
      return {
        ...item,
        expenseMap: this.buildExpenseMap(item.expensesList),
        totalValue: totalVal
      };
    });
    this.calculateTotals();
  }

  getUniqueExpenseHeaders(data: any[]): string[] {
    const headers = new Set<string>();
    data.forEach(item => {
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

  calculateTotals() {
    this.totalPetrolSum = this.productList.reduce((sum, item) => {
      return sum + item.petrolTotalSum;
    }, 0);
    this.totalPetroltotalsum = this.productList.reduce(
      (sum, item) => sum + item.petrolTotalTotalSell,
      0
    );
    this.totalDieselsum = this.productList.reduce(
      (sum, item) => sum + item.dieselTotalSum,
      0
    );
    this.totalDieseltotalSum = this.productList.reduce(
      (sum, item) => sum + item.dieselTotalTotalSell,
      0
    );

    this.totalOilTotalPrice = this.productList.reduce(
      (sum, item) => sum + item.oilTotalPrice,
      0
    );
    this.totalKharchTotal = this.productList.reduce(
      (sum, item) => sum + item.kharchTotal,
      0
    );
    this.totalPetrolQuantity = this.productList.reduce(
      (sum, item) => sum + item.petrolQuantity,
      0
    );
    this.totalPetrolTotal = this.productList.reduce(
      (sum, item) => sum + item.petrolTotal,
      0
    );
    this.totalPetrolVat = this.productList.reduce(
      (sum, item) => sum + item.petrolVat,
      0
    );
    this.totalPetrolCess = this.productList.reduce(
      (sum, item) => sum + item.petrolCess,
      0
    );
    this.totalPetrolJtcpercentage = this.productList.reduce(
      (sum, item) => sum + item.petrolJtcpercentage,
      0
    );
    this.totalPetrolTotalPurchase = this.productList.reduce(
      (sum, item) => sum + item.petrolTotalPurchase,
      0
    );
    this.totalDieselQuantity = this.productList.reduce(
      (sum, item) => sum + item.dieselQuantity,
      0
    );
    this.totalDieselTotal = this.productList.reduce(
      (sum, item) => sum + item.dieselTotal,
      0
    );
    this.totalDieselVat = this.productList.reduce(
      (sum, item) => sum + item.dieselVat,
      0
    );
    this.totalDieselCess = this.productList.reduce(
      (sum, item) => sum + item.dieselCess,
      0
    );
    this.totalDieselJtcpercentage = this.productList.reduce(
      (sum, item) => sum + item.dieselJtcpercentage,
      0
    );
    this.totalDieselTotalPurchase = this.productList.reduce(
      (sum, item) => sum + item.dieselTotalPurchase,
      0
    );
    this.totalOilQuantity = this.productList.reduce(
      (sum, item) => sum + (item.oilQuantity || 0),
      0
    );
    this.totalOilNetTotal = this.productList.reduce(
      (sum, item) => sum + (item.oilNetTotal || 0),
      0
    );
    this.totalOilGstAmount = this.productList.reduce(
      (sum, item) => sum + (item.oilGstAmount || 0),
      0
    );
    this.totalOilCessAmount = this.productList.reduce(
      (sum, item) => sum + (item.oilCessAmount || 0),
      0
    );
    this.totalOilGstPercentage = this.productList.reduce(
      (sum, item) => sum + (item.oilGstPercentage || 0),
      0
    );
    this.totalOilNetAmount = this.productList.reduce(
      (sum, item) => sum + (item.oilNetAmount || 0),
      0
    );
    this.totalOilMrp = this.productList.reduce(
      (sum, item) => sum + (item.oilMrp || 0),
      0
    );
    this.totalOilQtyLtrOrKg = this.productList.reduce(
      (sum, item) => sum + (item.oilQtyLtrOrKg || 0),
      0
    );
    this.totalOilRate = this.productList.reduce(
      (sum, item) => sum + (item.oilRate || 0),
      0
    );
    this.totalOilTaxableValue = this.productList.reduce(
      (sum, item) => sum + (item.oilTaxableValue || 0),
      0
    );
    this.totalOilCessPercentage = this.productList.reduce(
      (sum, item) => sum + (item.oilCessPercentage || 0),
      0
    );
    this.totalOilDiscount = this.productList.reduce(
      (sum, item) => sum + (item.oilDiscount || 0),
      0
    );
    this.totalAmountTotal = this.productList.reduce(
      (sum, item) => sum + item.amountTotal,
      0
    );
    this.totalJamaTotal = this.productList.reduce(
      (sum, item) => sum + item.jamaTotal,
      0
    );
    this.totalBakiTotal = this.productList.reduce(
      (sum, item) => sum + item.bakiTotal,
      0
    );
    this.totalXpPetrolTotalSum = this.productList.reduce(
      (sum, item) => sum + item.xppetrolTotalSum,
      0
    );
    this.totalXpPetrolTotalSell = this.productList.reduce(
      (sum, item) => sum + item.xppetrolTotalSell,
      0
    );
    this.totalXpPetrolQuantity = this.productList.reduce(
      (sum, item) => sum + item.xppetrolQuantity,
      0
    );
    this.totalXpPetrolTotal = this.productList.reduce(
      (sum, item) => sum + item.xppetrolTotal,
      0
    );
    this.totalXpPetrolVat = this.productList.reduce(
      (sum, item) => sum + item.xppetrolVat,
      0
    );
    this.totalXpPetrolCess = this.productList.reduce(
      (sum, item) => sum + item.xppetrolCess,
      0
    );
    this.totalXpPetrolJtcpercentage = this.productList.reduce(
      (sum, item) => sum + item.xppetrolJtcpercentage,
      0
    );
    this.totalXpPetrolTotalPurchase = this.productList.reduce(
      (sum, item) => sum + item.xppetrolTotalPurchase,
      0
    );

    // Power Diesel totals
    this.totalPowerDieselTotalSum = this.productList.reduce(
      (sum, item) => sum + item.powerdieselTotalSum,
      0
    );
    this.totalPowerDieselTotalSell = this.productList.reduce(
      (sum, item) => sum + item.powerdieselTotalSell,
      0
    );
    this.totalPowerDieselQuantity = this.productList.reduce(
      (sum, item) => sum + item.powerdieselQuantity,
      0
    );
    this.totalPowerDieselTotal = this.productList.reduce(
      (sum, item) => sum + item.powerdieselTotal,
      0
    );
    this.totalPowerDieselVat = this.productList.reduce(
      (sum, item) => sum + item.powerdieselVat,
      0
    );
    this.totalPowerDieselCess = this.productList.reduce(
      (sum, item) => sum + item.powerdieselCess,
      0
    );
    this.totalPowerDieselJtcpercentage = this.productList.reduce(
      (sum, item) => sum + item.powerdieselJtcpercentage,
      0
    );
    this.totalPowerDieselTotalPurchase = this.productList.reduce(
      (sum, item) => sum + item.powerdieselTotalPurchase,
      0
    );
    this.totalloclTotal = this.productList.reduce(
      (sum, item) => sum + item.locl_balance_Total,
      0
    );
    this.totalTotalValue = this.productList.reduce(
      (sum, item) => sum + (item.totalValue || 0),
      0
    );
  }

  exportToExcel(): void {

    const dataForExcel = this.productList.map(item => {
      const row: any = { ...item };
      if (item.expensesList) {
        item.expensesList.forEach((exp: any) => {
          row[exp.expenses] = exp.total_price;
        });
      }

      return row;
    });

    const totalsRow: any = {
      date: "Total",
      petrolTotalSum: this.totalPetrolQuantity,
      petrolTotalTotalSell: this.totalPetroltotalsum,
      dieselTotalSum: this.totalDieselsum,
      dieselTotalTotalSell: this.totalDieseltotalSum,
      oilTotalPrice: this.totalOilTotalPrice,
      kharchTotal: this.totalKharchTotal,
      petrolQuantity: this.totalPetrolQuantity,
      petrolTotal: this.totalPetrolTotal,
      petrolVat: this.totalPetrolVat,
      petrolCess: this.totalPetrolCess,
      petrolJtcpercentage: this.totalPetrolJtcpercentage,
      petrolTotalPurchase: this.totalPetrolTotalPurchase,
      dieselQuantity: this.totalDieselQuantity,
      dieselTotal: this.totalDieselTotal,
      dieselVat: this.totalDieselVat,
      dieselCess: this.totalDieselCess,
      dieselJtcpercentage: this.totalDieselJtcpercentage,
      dieselTotalPurchase: this.totalDieselTotalPurchase,
      oilId: "",
      oilQuantity: this.totalOilQuantity,
      oilType: "",
      oilUserId: "",
      oilGstPercentage: this.totalOilGstPercentage,
      oilHsn: "",
      oilMrp: this.totalOilMrp,
      oilNetAmount: this.totalOilNetAmount,
      oilNetTotal: this.totalOilNetTotal,
      oilQtyLtrOrKg: this.totalOilQtyLtrOrKg,
      oilRate: this.totalOilRate,
      oilSkuName: "",
      oilSkuNumber: "",
      oilTaxableValue: this.totalOilTaxableValue,
      oilUnit: "",
      oilVendorName: "",
      oilCessAmount: this.totalOilCessAmount,
      oilCessPercentage: this.totalOilCessPercentage,
      oilDiscount: this.totalOilDiscount,
      oilGstAmount: this.totalOilGstAmount,
      amountTotal: this.totalAmountTotal,
      jamaTotal: this.totalJamaTotal,
      bakiTotal: this.totalBakiTotal,
      locl_balance_Total: this.totalloclTotal,
      totalValue: this.totalTotalValue
    };

    this.expenseHeaders.forEach(header => {
      totalsRow[header] = this.productList.reduce((sum, item) => {
        const match = item.expensesList?.find((exp: any) => exp.expenses === header);
        return sum + (match ? match.total_price : 0);
      }, 0);
    });

    const dataWithTotals = [...dataForExcel, totalsRow];

    const headerOrder = [
      "date",
      "petrolTotalSum", "petrolRate", "petrolTotalTotalSell", "petrolgatt_Total",
      "dieselTotalSum", "dieselRate", "dieselTotalTotalSell", "dieselgatt_Total",
      "oilTotalPrice", "kharchTotal",
      "petrolQuantity", "petrolTotal", "petrolVat", "petrolCess", "petrolJtcpercentage",
      "petrolTotalPurchase",
      "dieselQuantity", "dieselTotal", "dieselVat", "dieselCess",
      "dieselJtcpercentage", "dieselTotalPurchase",
      "oilQuantity", "oilType", "oilGstPercentage",
      "oilHsn", "oilMrp", "oilNetAmount", "oilNetTotal", "oilQtyLtrOrKg", "oilRate",
      "oilSkuName", "oilSkuNumber", "oilTaxableValue", "oilUnit", "oilVendorName",
      "oilCessAmount", "oilCessPercentage", "oilDiscount", "oilGstAmount",
      "amountTotal", "jamaTotal", "bakiTotal", "locl_balance_Total", "totalValue",
      ...this.expenseHeaders
    ];

    const headerDisplayMap: any = {
      date: "Date",
      petrolTotalSum: "Petrol Sale LTR",
      petrolRate: "Petrol Sale Rate",
      petrolTotalTotalSell: "Petrol Sale Rs",
      petrolgatt_Total: "Petrol Gatt LTR",
      dieselTotalSum: "Diesel Sale LTR",
      dieselRate: "Diesel Sale Rate",
      dieselTotalTotalSell: "Diesel Sale Rs",
      dieselgatt_Total: "Diesel Gatt LTR",
      oilTotalPrice: "Oil Sale Total Rs",
      kharchTotal: "Indirect Expenses Rs",
      petrolQuantity: "Petrol Purchase Ltr",
      petrolTotal: "Petrol Purchase Rs",
      petrolVat: "Petrol Purchase Vat",
      petrolCess: "Petrol Purchase Cess",
      petrolJtcpercentage: "Petrol Purchase JTC",
      petrolTotalPurchase: "Petrol Purchase Total Rs",
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
