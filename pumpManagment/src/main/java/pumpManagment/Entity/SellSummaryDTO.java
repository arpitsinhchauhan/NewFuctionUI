/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.Entity;

import java.util.List;

/**
 *
 * @author Dell
 */
public class SellSummaryDTO {

    private List<Object[]> purchaseSellSummary;
    private List<Object[]> petrolSellSummary;
    private List<Object[]> dieselSellSummary;
    private List<Object[]> oilSellSummary;

    private List<Object[]> kharchSellSummary;
    private List<Object[]> transactionSellSummary;
    private List<Object[]> jamaSummary;
    private List<Object[]> bakiSummary;
    private List<Object[]> loclcredit;

    public List<Object[]> getPurchaseSellSummary() {
        return purchaseSellSummary;
    }

    public void setPurchaseSellSummary(List<Object[]> purchaseSellSummary) {
        this.purchaseSellSummary = purchaseSellSummary;
    }

    public List<Object[]> getPetrolSellSummary() {
        return petrolSellSummary;
    }

    public void setPetrolSellSummary(List<Object[]> petrolSellSummary) {
        this.petrolSellSummary = petrolSellSummary;
    }

    public List<Object[]> getDieselSellSummary() {
        return dieselSellSummary;
    }

    public void setDieselSellSummary(List<Object[]> dieselSellSummary) {
        this.dieselSellSummary = dieselSellSummary;
    }

    public List<Object[]> getOilSellSummary() {
        return oilSellSummary;
    }

    public void setOilSellSummary(List<Object[]> oilSellSummary) {
        this.oilSellSummary = oilSellSummary;
    }

    public List<Object[]> getKharchSellSummary() {
        return kharchSellSummary;
    }

    public void setKharchSellSummary(List<Object[]> kharchSellSummary) {
        this.kharchSellSummary = kharchSellSummary;
    }

    public List<Object[]> getTransactionSellSummary() {
        return transactionSellSummary;
    }

    public void setTransactionSellSummary(List<Object[]> transactionSellSummary) {
        this.transactionSellSummary = transactionSellSummary;
    }
//
//    public List<Object[]> getjamaSummary() {
//        return jamaSummary;
//    }
//
//    public void setjamaSummary(List<Object[]> jamaSummary) {
//        this.jamaSummary = jamaSummary;
//    }

    public List<Object[]> getJamaSummary() {
        return jamaSummary;
    }

    public void setJamaSummary(List<Object[]> jamaSummary) {
        this.jamaSummary = jamaSummary;
    }

    public List<Object[]> getBakiSummary() {
        return bakiSummary;
    }

    public void setBakiSummary(List<Object[]> bakiSummary) {
        this.bakiSummary = bakiSummary;
    }

    public List<Object[]> getLoclcredit() {
        return loclcredit;
    }

    public void setLoclcredit(List<Object[]> loclcredit) {
        this.loclcredit = loclcredit;
    }
}
