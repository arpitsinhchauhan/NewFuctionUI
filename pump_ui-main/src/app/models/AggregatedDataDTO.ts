export interface AggregatedDataDTO {
  expensesList: any[]; // or a proper typed array if you know the structure
  date: string;
  petrolTotalOpenMeter?: number;
  petrolTotalCloseMeter?: number;
  petrolTotalSum: number;
  petrolTotalTesting: number;
  petrolLtr: number;
  petrolRate: number;
  petrolTotalTotalSell: number;
  dieselTotalOpenMeter?: number;
  dieselTotalCloseMeter?: number;
  dieselTotalSum: number;
  dieselTotalTesting: number;
  dieselLtr: number;
  dieselRate: number;
  dieselTotalTotalSell: number;
  xppetrolOpenMeter?: number;
  xppetrolCloseMeter?: number;
  powerdieselOpenMeter?: number;
  powerdieselCloseMeter?: number;
  oilTotalPrice: number;
  kharchTotal: number;
  petrolSkuNumber?: string;
  petrolQuantity: number;
  petrolTotal: number;
  petrolVat: number;
  petrolCess: number;
  petrolJtcpercentage: number;
  petrolTotalPurchase: number;
  dieselSkuNumber?: string;
  dieselQuantity: number;
  dieselTotal: number;
  dieselVat: number;
  dieselCess: number;
  dieselJtcpercentage: number;
  dieselTotalPurchase: number;
  oilQuantity: number;
  oilNetTotal: number;
  oilGstAmount: number;
  oilCessAmount: number;
  oilGstPercentage: number;
  oilNetAmount: number;
  oilHsn: string;
  oilMrp: number;
  oilQtyLtrOrKg: number;
  oilRate: number;
  oilSkuName: string;
  oilSkuNumber: string;
  oilTaxableValue: number;
  oilUnit: string;
  oilVendorName: string;
  oilCessPercentage: number;
  oilDiscount: number;
  oilId: number;
  oilType: string;
  oilUserId: string;
  oilDate: string;
  amountTotal: number;
  jamaTotal: number;
  bakiTotal: number;
  xppetrolLtr: number;
  xppetrolTotalSum: number;
  xppetrolTotalTesting: number;
  xppetrolTotalSell: number;

  powerdieselLtr: number;
  powerdieselTotalSum: number;
  powerdieselTotalTesting: number;
  powerdieselTotalSell: number;

  // ✅ New XP Petrol purchase fields
  xppetrolSkuNumber?: string;
  xppetrolQuantity: number;
  xppetrolTotal: number;
  xppetrolVat: number;
  xppetrolCess: number;
  xppetrolJtcpercentage: number;
  xppetrolTotalPurchase: number;

  // ✅ New Power Diesel purchase fields
  powerdieselSkuNumber?: string;
  powerdieselQuantity: number;
  powerdieselTotal: number;
  powerdieselVat: number;
  powerdieselCess: number;
  powerdieselJtcpercentage: number;
  powerdieselTotalPurchase: number;


  petrolgatt: number;
  dieselgatt: number;
  xppetrolgatt: number;
  power_dieselgatt: number;

  petrolgatt_Total?: number;
  dieselgatt_Total?: number;
  xppetrolgatt_Total?: number;
  power_dieselgatt_Total?: number;
  xppetrolRate?: number;
  powerdieselRate?: number;

  locl_balance_Total: number;
  totalValue?: number;
}