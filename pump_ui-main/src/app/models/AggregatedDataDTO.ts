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
  petrolQuantity: number;
  petrolTotal: number;
  petrolVat: number;
  petrolCess: number;
  petrolJtcpercentage: number;
  petrolTotalPurchase: number;
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
  xppetrolQuantity: number;
  xppetrolTotal: number;
  xppetrolVat: number;
  xppetrolCess: number;
  xppetrolJtcpercentage: number;
  xppetrolTotalPurchase: number;

  // ✅ New Power Diesel purchase fields
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

  locl_balance_Total: number;
  totalValue?: number;
}