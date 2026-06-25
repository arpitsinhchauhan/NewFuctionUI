package pumpManagment.Entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author Dell
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AggregatedDataDTO {

    private String date;
    private Double petrolTotalCloseMeter;
    private Double petrolTotalOpenMeter;
    private Double petrolTotalSum;
    private Double petrolTotalTesting;
    private Double petrolLtr;
    private Double petrolRate;
    private Double petrolTotalTotalSell;
    private Double dieselTotalCloseMeter;
    private Double dieselTotalOpenMeter;
    private Double dieselTotalSum;
    private Double dieselTotalTesting;
    private Double dieselLtr;
    private Double dieselRate;
    private Double dieselTotalTotalSell;
    private Double oilTotalPrice;
    private Double kharchTotal;
    private String pType;
    private Double petrolQuantity;
    private Double petrolTotal;
    private Double petrolVat;
    private Double petrolCess;
    private Double petrolJtcpercentage;
    private Double petrolTotalPurchase;
    private String dType;
    private Double dieselQuantity;
    private Double dieselTotal;
    private Double dieselVat;
    private Double dieselCess;
    private Double dieselJtcpercentage;
    private Double dieselTotalPurchase;
    private Double oilQuantity;
    private Double oilNetTotal;
    private Double oilGstAmount;
    private Double oilCessAmount;
    private Double oilGstPercentage;
    private Double oilNetAmount;
    private String oilHsn;
    private Double oilMrp;
    private Double oilQtyLtrOrKg;
    private Double oilRate;
    private String oilSkuName;
    private String oilSkuNumber;
    private Double oilTaxableValue;
    private String oilUnit;
    private String oilVendorName;
    private Double oilCessPercentage;
    private Double oilDiscount;
    private Integer oilId;
    private String oilType;
    private String oilUserId;
    private String oilDate;
    private String oType;
    private Double amountTotal;
    private Double jamaTotal;
    private Double bakiTotal;
    private String user_id;

    private Double xppetrolCloseMeter;
    private Double xppetrolOpenMeter;
    private Double xppetrolLtr;
    private Double xppetrolTotalSum;
    private Double xppetrolRate;
    private Double xppetrolTotalTesting;
    private Double xppetrolTotalSell;

    private Double powerdieselCloseMeter;
    private Double powerdieselOpenMeter;
    private Double powerdieselLtr;
    private Double powerdieselTotalSum;
    private Double powerdieselRate;
    private Double powerdieselTotalTesting;
    private Double powerdieselTotalSell;

    // For XP Petrol Purchases
    private Double xppetrolQuantity;
    private Double xppetrolTotal;
    private Double xppetrolVat;
    private Double xppetrolCess;
    private Double xppetrolJtcpercentage;
    private Double xppetrolTotalPurchase;

    // For Power Diesel Purchases
    private Double powerdieselQuantity;
    private Double powerdieselTotal;
    private Double powerdieselVat;
    private Double powerdieselCess;
    private Double powerdieselJtcpercentage;
    private Double powerdieselTotalPurchase;

    private Double petrolgatt_Total;
    private Double dieselgatt_Total;
    private Double xppetrolgatt_Total;
    private Double power_dieselgatt_Total;

    private Double locl_balance_Total;

    private List<Map<String,Object>> expensesList;

    private Map<String, Double> expenseTotals = new HashMap<>();

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Double getPetrolTotalCloseMeter() {
        return petrolTotalCloseMeter;
    }

    public void setPetrolTotalCloseMeter(Double petrolTotalCloseMeter) {
        this.petrolTotalCloseMeter = petrolTotalCloseMeter;
    }

    public Double getPetrolTotalOpenMeter() {
        return petrolTotalOpenMeter;
    }

    public void setPetrolTotalOpenMeter(Double petrolTotalOpenMeter) {
        this.petrolTotalOpenMeter = petrolTotalOpenMeter;
    }

    public Double getPetrolTotalSum() {
        return petrolTotalSum;
    }

    public void setPetrolTotalSum(Double petrolTotalSum) {
        this.petrolTotalSum = petrolTotalSum;
    }

    public Double getPetrolTotalTesting() {
        return petrolTotalTesting;
    }

    public void setPetrolTotalTesting(Double petrolTotalTesting) {
        this.petrolTotalTesting = petrolTotalTesting;
    }

    public Double getPetrolLtr() {
        return petrolLtr;
    }

    public void setPetrolLtr(Double petrolLtr) {
        this.petrolLtr = petrolLtr;
    }

    public Double getPetrolRate() {
        return petrolRate;
    }

    public void setPetrolRate(Double petrolRate) {
        this.petrolRate = petrolRate;
    }

    public Double getPetrolTotalTotalSell() {
        return petrolTotalTotalSell;
    }

    public void setPetrolTotalTotalSell(Double petrolTotalTotalSell) {
        this.petrolTotalTotalSell = petrolTotalTotalSell;
    }

    public Double getDieselTotalCloseMeter() {
        return dieselTotalCloseMeter;
    }

    public void setDieselTotalCloseMeter(Double dieselTotalCloseMeter) {
        this.dieselTotalCloseMeter = dieselTotalCloseMeter;
    }

    public Double getDieselTotalOpenMeter() {
        return dieselTotalOpenMeter;
    }

    public void setDieselTotalOpenMeter(Double dieselTotalOpenMeter) {
        this.dieselTotalOpenMeter = dieselTotalOpenMeter;
    }

    public Double getDieselTotalSum() {
        return dieselTotalSum;
    }

    public void setDieselTotalSum(Double dieselTotalSum) {
        this.dieselTotalSum = dieselTotalSum;
    }

    public Double getDieselTotalTesting() {
        return dieselTotalTesting;
    }

    public void setDieselTotalTesting(Double dieselTotalTesting) {
        this.dieselTotalTesting = dieselTotalTesting;
    }

    public Double getDieselLtr() {
        return dieselLtr;
    }

    public void setDieselLtr(Double dieselLtr) {
        this.dieselLtr = dieselLtr;
    }

    public Double getDieselRate() {
        return dieselRate;
    }

    public void setDieselRate(Double dieselRate) {
        this.dieselRate = dieselRate;
    }

    public Double getDieselTotalTotalSell() {
        return dieselTotalTotalSell;
    }

    public void setDieselTotalTotalSell(Double dieselTotalTotalSell) {
        this.dieselTotalTotalSell = dieselTotalTotalSell;
    }

    public Double getOilTotalPrice() {
        return oilTotalPrice;
    }

    public void setOilTotalPrice(Double oilTotalPrice) {
        this.oilTotalPrice = oilTotalPrice;
    }

    public Double getKharchTotal() {
        return kharchTotal;
    }

    public void setKharchTotal(Double kharchTotal) {
        this.kharchTotal = kharchTotal;
    }

    public String getpType() {
        return pType;
    }

    public void setpType(String pType) {
        this.pType = pType;
    }

    public Double getPetrolQuantity() {
        return petrolQuantity;
    }

    public void setPetrolQuantity(Double petrolQuantity) {
        this.petrolQuantity = petrolQuantity;
    }

    public Double getPetrolTotal() {
        return petrolTotal;
    }

    public void setPetrolTotal(Double petrolTotal) {
        this.petrolTotal = petrolTotal;
    }

    public Double getPetrolVat() {
        return petrolVat;
    }

    public void setPetrolVat(Double petrolVat) {
        this.petrolVat = petrolVat;
    }

    public Double getPetrolCess() {
        return petrolCess;
    }

    public void setPetrolCess(Double petrolCess) {
        this.petrolCess = petrolCess;
    }

    public Double getPetrolJtcpercentage() {
        return petrolJtcpercentage;
    }

    public void setPetrolJtcpercentage(Double petrolJtcpercentage) {
        this.petrolJtcpercentage = petrolJtcpercentage;
    }

    public Double getPetrolTotalPurchase() {
        return petrolTotalPurchase;
    }

    public void setPetrolTotalPurchase(Double petrolTotalPurchase) {
        this.petrolTotalPurchase = petrolTotalPurchase;
    }

    public String getdType() {
        return dType;
    }

    public void setdType(String dType) {
        this.dType = dType;
    }

    public Double getDieselQuantity() {
        return dieselQuantity;
    }

    public void setDieselQuantity(Double dieselQuantity) {
        this.dieselQuantity = dieselQuantity;
    }

    public Double getDieselTotal() {
        return dieselTotal;
    }

    public void setDieselTotal(Double dieselTotal) {
        this.dieselTotal = dieselTotal;
    }

    public Double getDieselVat() {
        return dieselVat;
    }

    public void setDieselVat(Double dieselVat) {
        this.dieselVat = dieselVat;
    }

    public Double getDieselCess() {
        return dieselCess;
    }

    public void setDieselCess(Double dieselCess) {
        this.dieselCess = dieselCess;
    }

    public Double getDieselJtcpercentage() {
        return dieselJtcpercentage;
    }

    public void setDieselJtcpercentage(Double dieselJtcpercentage) {
        this.dieselJtcpercentage = dieselJtcpercentage;
    }

    public Double getDieselTotalPurchase() {
        return dieselTotalPurchase;
    }

    public void setDieselTotalPurchase(Double dieselTotalPurchase) {
        this.dieselTotalPurchase = dieselTotalPurchase;
    }

    public Double getAmountTotal() {
        return amountTotal;
    }

    public void setAmountTotal(Double amountTotal) {
        this.amountTotal = amountTotal;
    }

    public Double getJamaTotal() {
        return jamaTotal;
    }

    public void setJamaTotal(Double jamaTotal) {
        this.jamaTotal = jamaTotal;
    }

    public Double getBakiTotal() {
        return bakiTotal;
    }

    public void setBakiTotal(Double bakiTotal) {
        this.bakiTotal = bakiTotal;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public Double getXppetrolCloseMeter() {
        return xppetrolCloseMeter;
    }

    public void setXppetrolCloseMeter(Double xppetrolCloseMeter) {
        this.xppetrolCloseMeter = xppetrolCloseMeter;
    }

    public Double getXppetrolOpenMeter() {
        return xppetrolOpenMeter;
    }

    public void setXppetrolOpenMeter(Double xppetrolOpenMeter) {
        this.xppetrolOpenMeter = xppetrolOpenMeter;
    }

    public Double getXppetrolLtr() {
        return xppetrolLtr;
    }

    public void setXppetrolLtr(Double xppetrolLtr) {
        this.xppetrolLtr = xppetrolLtr;
    }

    public Double getXppetrolTotalSum() {
        return xppetrolTotalSum;
    }

    public void setXppetrolTotalSum(Double xppetrolTotalSum) {
        this.xppetrolTotalSum = xppetrolTotalSum;
    }

    public Double getXppetrolTotalTesting() {
        return xppetrolTotalTesting;
    }

    public void setXppetrolTotalTesting(Double xppetrolTotalTesting) {
        this.xppetrolTotalTesting = xppetrolTotalTesting;
    }

    public Double getXppetrolTotalSell() {
        return xppetrolTotalSell;
    }

    public void setXppetrolTotalSell(Double xppetrolTotalSell) {
        this.xppetrolTotalSell = xppetrolTotalSell;
    }

    public Double getPowerdieselCloseMeter() {
        return powerdieselCloseMeter;
    }

    public void setPowerdieselCloseMeter(Double powerdieselCloseMeter) {
        this.powerdieselCloseMeter = powerdieselCloseMeter;
    }

    public Double getPowerdieselOpenMeter() {
        return powerdieselOpenMeter;
    }

    public void setPowerdieselOpenMeter(Double powerdieselOpenMeter) {
        this.powerdieselOpenMeter = powerdieselOpenMeter;
    }

    public Double getPowerdieselLtr() {
        return powerdieselLtr;
    }

    public void setPowerdieselLtr(Double powerdieselLtr) {
        this.powerdieselLtr = powerdieselLtr;
    }

    public Double getPowerdieselTotalSum() {
        return powerdieselTotalSum;
    }

    public void setPowerdieselTotalSum(Double powerdieselTotalSum) {
        this.powerdieselTotalSum = powerdieselTotalSum;
    }

    public Double getPowerdieselTotalTesting() {
        return powerdieselTotalTesting;
    }

    public void setPowerdieselTotalTesting(Double powerdieselTotalTesting) {
        this.powerdieselTotalTesting = powerdieselTotalTesting;
    }

    public Double getPowerdieselTotalSell() {
        return powerdieselTotalSell;
    }

    public void setPowerdieselTotalSell(Double powerdieselTotalSell) {
        this.powerdieselTotalSell = powerdieselTotalSell;
    }

    public Double getXppetrolQuantity() {
        return xppetrolQuantity;
    }

    public void setXppetrolQuantity(Double xppetrolQuantity) {
        this.xppetrolQuantity = xppetrolQuantity;
    }

    public Double getXppetrolTotal() {
        return xppetrolTotal;
    }

    public void setXppetrolTotal(Double xppetrolTotal) {
        this.xppetrolTotal = xppetrolTotal;
    }

    public Double getXppetrolVat() {
        return xppetrolVat;
    }

    public void setXppetrolVat(Double xppetrolVat) {
        this.xppetrolVat = xppetrolVat;
    }

    public Double getXppetrolCess() {
        return xppetrolCess;
    }

    public void setXppetrolCess(Double xppetrolCess) {
        this.xppetrolCess = xppetrolCess;
    }

    public Double getXppetrolJtcpercentage() {
        return xppetrolJtcpercentage;
    }

    public void setXppetrolJtcpercentage(Double xppetrolJtcpercentage) {
        this.xppetrolJtcpercentage = xppetrolJtcpercentage;
    }

    public Double getXppetrolTotalPurchase() {
        return xppetrolTotalPurchase;
    }

    public void setXppetrolTotalPurchase(Double xppetrolTotalPurchase) {
        this.xppetrolTotalPurchase = xppetrolTotalPurchase;
    }

    public Double getPowerdieselQuantity() {
        return powerdieselQuantity;
    }

    public void setPowerdieselQuantity(Double powerdieselQuantity) {
        this.powerdieselQuantity = powerdieselQuantity;
    }

    public Double getPowerdieselTotal() {
        return powerdieselTotal;
    }

    public void setPowerdieselTotal(Double powerdieselTotal) {
        this.powerdieselTotal = powerdieselTotal;
    }

    public Double getPowerdieselVat() {
        return powerdieselVat;
    }

    public void setPowerdieselVat(Double powerdieselVat) {
        this.powerdieselVat = powerdieselVat;
    }

    public Double getPowerdieselCess() {
        return powerdieselCess;
    }

    public void setPowerdieselCess(Double powerdieselCess) {
        this.powerdieselCess = powerdieselCess;
    }

    public Double getPowerdieselJtcpercentage() {
        return powerdieselJtcpercentage;
    }

    public void setPowerdieselJtcpercentage(Double powerdieselJtcpercentage) {
        this.powerdieselJtcpercentage = powerdieselJtcpercentage;
    }

    public Double getPowerdieselTotalPurchase() {
        return powerdieselTotalPurchase;
    }

    public void setPowerdieselTotalPurchase(Double powerdieselTotalPurchase) {
        this.powerdieselTotalPurchase = powerdieselTotalPurchase;
    }

    public Double getXppetrolRate() {
        return xppetrolRate;
    }

    public void setXppetrolRate(Double xppetrolRate) {
        this.xppetrolRate = xppetrolRate;
    }

    public Double getPowerdieselRate() {
        return powerdieselRate;
    }

    public void setPowerdieselRate(Double powerdieselRate) {
        this.powerdieselRate = powerdieselRate;
    }

    public Double getPetrolgatt_Total() {
        return petrolgatt_Total;
    }

    public void setPetrolgatt_Total(Double petrolgatt_Total) {
        this.petrolgatt_Total = petrolgatt_Total;
    }

    public Double getDieselgatt_Total() {
        return dieselgatt_Total;
    }

    public void setDieselgatt_Total(Double dieselgatt_Total) {
        this.dieselgatt_Total = dieselgatt_Total;
    }

    public Double getXppetrolgatt_Total() {
        return xppetrolgatt_Total;
    }

    public void setXppetrolgatt_Total(Double xppetrolgatt_Total) {
        this.xppetrolgatt_Total = xppetrolgatt_Total;
    }

    public Double getPower_dieselgatt_Total() {
        return power_dieselgatt_Total;
    }

    public void setPower_dieselgatt_Total(Double power_dieselgatt_Total) {
        this.power_dieselgatt_Total = power_dieselgatt_Total;
    }

    public Map<String, Double> getExpenseTotals() {
        return expenseTotals;
    }

    public void setExpenseTotals(Map<String, Double> expenseTotals) {
        this.expenseTotals = expenseTotals;
    }


    public List<Map<String, Object>> getExpensesList() {
        return expensesList;
    }

    public void setExpensesList(List<Map<String, Object>> expensesList) {
        this.expensesList = expensesList;
    }


    public Double getLocl_balance_Total() {
        return locl_balance_Total;
    }

    public void setLocl_balance_Total(Double locl_balance_Total) {
        this.locl_balance_Total = locl_balance_Total;
    }

    public String getoType() {
        return oType;
    }

    public void setoType(String oType) {
        this.oType = oType;
    }

    public Double getOilQuantity() {
        return oilQuantity;
    }

    public void setOilQuantity(Double oilQuantity) {
        this.oilQuantity = oilQuantity;
    }

    public Double getOilNetTotal() {
        return oilNetTotal;
    }

    public void setOilNetTotal(Double oilNetTotal) {
        this.oilNetTotal = oilNetTotal;
    }

    public Double getOilGstAmount() {
        return oilGstAmount;
    }

    public void setOilGstAmount(Double oilGstAmount) {
        this.oilGstAmount = oilGstAmount;
    }

    public Double getOilCessAmount() {
        return oilCessAmount;
    }

    public void setOilCessAmount(Double oilCessAmount) {
        this.oilCessAmount = oilCessAmount;
    }

    public Double getOilGstPercentage() {
        return oilGstPercentage;
    }

    public void setOilGstPercentage(Double oilGstPercentage) {
        this.oilGstPercentage = oilGstPercentage;
    }

    public Double getOilNetAmount() {
        return oilNetAmount;
    }

    public void setOilNetAmount(Double oilNetAmount) {
        this.oilNetAmount = oilNetAmount;
    }

    public String getOilHsn() {
        return oilHsn;
    }

    public void setOilHsn(String oilHsn) {
        this.oilHsn = oilHsn;
    }

    public Double getOilMrp() {
        return oilMrp;
    }

    public void setOilMrp(Double oilMrp) {
        this.oilMrp = oilMrp;
    }

    public Double getOilQtyLtrOrKg() {
        return oilQtyLtrOrKg;
    }

    public void setOilQtyLtrOrKg(Double oilQtyLtrOrKg) {
        this.oilQtyLtrOrKg = oilQtyLtrOrKg;
    }

    public Double getOilRate() {
        return oilRate;
    }

    public void setOilRate(Double oilRate) {
        this.oilRate = oilRate;
    }

    public String getOilSkuName() {
        return oilSkuName;
    }

    public void setOilSkuName(String oilSkuName) {
        this.oilSkuName = oilSkuName;
    }

    public String getOilSkuNumber() {
        return oilSkuNumber;
    }

    public void setOilSkuNumber(String oilSkuNumber) {
        this.oilSkuNumber = oilSkuNumber;
    }

    public Double getOilTaxableValue() {
        return oilTaxableValue;
    }

    public void setOilTaxableValue(Double oilTaxableValue) {
        this.oilTaxableValue = oilTaxableValue;
    }

    public String getOilUnit() {
        return oilUnit;
    }

    public void setOilUnit(String oilUnit) {
        this.oilUnit = oilUnit;
    }

    public String getOilVendorName() {
        return oilVendorName;
    }

    public void setOilVendorName(String oilVendorName) {
        this.oilVendorName = oilVendorName;
    }

    public Double getOilCessPercentage() {
        return oilCessPercentage;
    }

    public void setOilCessPercentage(Double oilCessPercentage) {
        this.oilCessPercentage = oilCessPercentage;
    }

    public Double getOilDiscount() {
        return oilDiscount;
    }

    public void setOilDiscount(Double oilDiscount) {
        this.oilDiscount = oilDiscount;
    }

    public Integer getOilId() {
        return oilId;
    }

    public void setOilId(Integer oilId) {
        this.oilId = oilId;
    }

    public String getOilType() {
        return oilType;
    }

    public void setOilType(String oilType) {
        this.oilType = oilType;
    }

    public String getOilUserId() {
        return oilUserId;
    }

    public void setOilUserId(String oilUserId) {
        this.oilUserId = oilUserId;
    }

    public String getOilDate() {
        return oilDate;
    }

    public void setOilDate(String oilDate) {
        this.oilDate = oilDate;
    }
}
