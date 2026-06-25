package pumpManagment.Entity;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import java.math.BigDecimal;

/**
 *
 * @author Dell
 */
public class DailySalesSummaryDTO {

    private String date;
    private double petrolSellTotal;
    private double dieselSellTotal;
    private double oilSellTotal;
    private double kharchTotal;
    private double atmTotal;
    private double jamaTotal;
    private double bakiTotal;
    private double totalPetrolPurchase;
    private double totalDieselPurchase;
    private double xpPetrolSellTotal;
    private double powerDieselSellTotal;
    private double xpTotalPetrolPurchase;
    private double powerTotalDieselPurchase;
    private double totalOilPurchase;

    // Getters and Setters
    public double getTotalOilPurchase() {
        return totalOilPurchase;
    }

    public void setTotalOilPurchase(double totalOilPurchase) {
        this.totalOilPurchase = totalOilPurchase;
    }
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getPetrolSellTotal() {
        return petrolSellTotal;
    }

    public void setPetrolSellTotal(double petrolSellTotal) {
        this.petrolSellTotal = petrolSellTotal;
    }

    public double getDieselSellTotal() {
        return dieselSellTotal;
    }

    public void setDieselSellTotal(double dieselSellTotal) {
        this.dieselSellTotal = dieselSellTotal;
    }

    public double getOilSellTotal() {
        return oilSellTotal;
    }

    public void setOilSellTotal(double oilSellTotal) {
        this.oilSellTotal = oilSellTotal;
    }

    public double getKharchTotal() {
        return kharchTotal;
    }

    public void setKharchTotal(double kharchTotal) {
        this.kharchTotal = kharchTotal;
    }

    public double getAtmTotal() {
        return atmTotal;
    }

    public void setAtmTotal(double atmTotal) {
        this.atmTotal = atmTotal;
    }

    public double getJamaTotal() {
        return jamaTotal;
    }

    public void setJamaTotal(double jamaTotal) {
        this.jamaTotal = jamaTotal;
    }

    public double getBakiTotal() {
        return bakiTotal;
    }

    public void setBakiTotal(double bakiTotal) {
        this.bakiTotal = bakiTotal;
    }

    public double getTotalPetrolPurchase() {
        return totalPetrolPurchase;
    }

    public void setTotalPetrolPurchase(double totalPetrolPurchase) {
        this.totalPetrolPurchase = totalPetrolPurchase;
    }

    public double getTotalDieselPurchase() {
        return totalDieselPurchase;
    }

    public void setTotalDieselPurchase(double totalDieselPurchase) {
        this.totalDieselPurchase = totalDieselPurchase;
    }

    public double getXpPetrolSellTotal() {
        return xpPetrolSellTotal;
    }

    public void setXpPetrolSellTotal(double xpPetrolSellTotal) {
        this.xpPetrolSellTotal = xpPetrolSellTotal;
    }

    public double getPowerDieselSellTotal() {
        return powerDieselSellTotal;
    }

    public void setPowerDieselSellTotal(double powerDieselSellTotal) {
        this.powerDieselSellTotal = powerDieselSellTotal;
    }

    public double getXpTotalPetrolPurchase() {
        return xpTotalPetrolPurchase;
    }

    public void setXpTotalPetrolPurchase(double xpTotalPetrolPurchase) {
        this.xpTotalPetrolPurchase = xpTotalPetrolPurchase;
    }

    public double getPowerTotalDieselPurchase() {
        return powerTotalDieselPurchase;
    }

    public void setPowerTotalDieselPurchase(double powerTotalDieselPurchase) {
        this.powerTotalDieselPurchase = powerTotalDieselPurchase;
    }
}
