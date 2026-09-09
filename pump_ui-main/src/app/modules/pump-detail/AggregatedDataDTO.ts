
export interface AggregatedDataDTO {
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
  pType: String ;
  petrolQuantity: number;
  petrolTotal: number;
  petrolVat: number;
  petrolCess: number;
  petrolJtcpercentage: number;
  petrolTotalPurchase: number;
  dType: String ;
  dieselQuantity: number;
  dieselTotal: number;
  dieselVat: number;
  dieselCess: number;
  dieselJtcpercentage: number;
  dieselTotalPurchase: number;
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
}
