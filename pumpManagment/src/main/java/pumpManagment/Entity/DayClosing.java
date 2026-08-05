package pumpManagment.Entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "day_closing")
public class DayClosing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "business_date", nullable = false)
    private String businessDate;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "status", nullable = false)
    private String status = "OPEN"; // OPEN or CLOSED

    private Double openingCash = 0.0;
    private Double cashCollection = 0.0;
    private Double upiCollection = 0.0;
    private Double cardCollection = 0.0;
    private Double creditSales = 0.0;
    private Double expenses = 0.0;
    private Double fuelSales = 0.0;
    private Double oilSales = 0.0;
    private Double totalSales = 0.0;
    private Double netCollection = 0.0;

    private Double realOpeningMeter = 0.0;
    private Double realClosingMeter = 0.0;
    private Double totalTesting = 0.0;
    private Double netSalesLtr = 0.0;

    private String closedBy;
    private LocalDateTime closedTime;

    private String reopenedBy;
    private LocalDateTime reopenedTime;

    @Column(length = 1000)
    private String reopenReason;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public DayClosing() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBusinessDate() {
        return businessDate;
    }

    public void setBusinessDate(String businessDate) {
        this.businessDate = businessDate;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getOpeningCash() {
        return openingCash;
    }

    public void setOpeningCash(Double openingCash) {
        this.openingCash = openingCash;
    }

    public Double getCashCollection() {
        return cashCollection;
    }

    public void setCashCollection(Double cashCollection) {
        this.cashCollection = cashCollection;
    }

    public Double getUpiCollection() {
        return upiCollection;
    }

    public void setUpiCollection(Double upiCollection) {
        this.upiCollection = upiCollection;
    }

    public Double getCardCollection() {
        return cardCollection;
    }

    public void setCardCollection(Double cardCollection) {
        this.cardCollection = cardCollection;
    }

    public Double getCreditSales() {
        return creditSales;
    }

    public void setCreditSales(Double creditSales) {
        this.creditSales = creditSales;
    }

    public Double getExpenses() {
        return expenses;
    }

    public void setExpenses(Double expenses) {
        this.expenses = expenses;
    }

    public Double getFuelSales() {
        return fuelSales;
    }

    public void setFuelSales(Double fuelSales) {
        this.fuelSales = fuelSales;
    }

    public Double getOilSales() {
        return oilSales;
    }

    public void setOilSales(Double oilSales) {
        this.oilSales = oilSales;
    }

    public Double getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(Double totalSales) {
        this.totalSales = totalSales;
    }

    public Double getNetCollection() {
        return netCollection;
    }

    public void setNetCollection(Double netCollection) {
        this.netCollection = netCollection;
    }

    public Double getRealOpeningMeter() {
        return realOpeningMeter;
    }

    public void setRealOpeningMeter(Double realOpeningMeter) {
        this.realOpeningMeter = realOpeningMeter;
    }

    public Double getRealClosingMeter() {
        return realClosingMeter;
    }

    public void setRealClosingMeter(Double realClosingMeter) {
        this.realClosingMeter = realClosingMeter;
    }

    public Double getTotalTesting() {
        return totalTesting;
    }

    public void setTotalTesting(Double totalTesting) {
        this.totalTesting = totalTesting;
    }

    public Double getNetSalesLtr() {
        return netSalesLtr;
    }

    public void setNetSalesLtr(Double netSalesLtr) {
        this.netSalesLtr = netSalesLtr;
    }

    public String getClosedBy() {
        return closedBy;
    }

    public void setClosedBy(String closedBy) {
        this.closedBy = closedBy;
    }

    public LocalDateTime getClosedTime() {
        return closedTime;
    }

    public void setClosedTime(LocalDateTime closedTime) {
        this.closedTime = closedTime;
    }

    public String getReopenedBy() {
        return reopenedBy;
    }

    public void setReopenedBy(String reopenedBy) {
        this.reopenedBy = reopenedBy;
    }

    public LocalDateTime getReopenedTime() {
        return reopenedTime;
    }

    public void setReopenedTime(LocalDateTime reopenedTime) {
        this.reopenedTime = reopenedTime;
    }

    public String getReopenReason() {
        return reopenReason;
    }

    public void setReopenReason(String reopenReason) {
        this.reopenReason = reopenReason;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }
}
