package pumpManagment.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_reports")
public class DailyReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @Column(name = "pump_id", nullable = false)
    private Long pumpId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "report_date", nullable = false)
    private String reportDate;

    @Column(name = "report_time", nullable = false)
    private String reportTime;

    @Column(name = "shift", nullable = false)
    private String shift;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(name = "created_datetime", nullable = false)
    private LocalDateTime createdDatetime;

    @Column(name = "sales_amount")
    private Double salesAmount;

    @Column(name = "stock_details", columnDefinition = "TEXT")
    private String stockDetails;

    public Double getSalesAmount() {
        return salesAmount;
    }

    public void setSalesAmount(Double salesAmount) {
        this.salesAmount = salesAmount;
    }

    public String getStockDetails() {
        return stockDetails;
    }

    public void setStockDetails(String stockDetails) {
        this.stockDetails = stockDetails;
    }

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Long getPumpId() {
        return pumpId;
    }

    public void setPumpId(Long pumpId) {
        this.pumpId = pumpId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getReportDate() {
        return reportDate;
    }

    public void setReportDate(String reportDate) {
        this.reportDate = reportDate;
    }

    public String getReportTime() {
        return reportTime;
    }

    public void setReportTime(String reportTime) {
        this.reportTime = reportTime;
    }

    public String getShift() {
        return shift;
    }

    public void setShift(String shift) {
        this.shift = shift;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedDatetime() {
        return createdDatetime;
    }

    public void setCreatedDatetime(LocalDateTime createdDatetime) {
        this.createdDatetime = createdDatetime;
    }

    @Column(name = "employee_name")
    private String employeeName;

    @Column(name = "status")
    private String status = "Pending";

    @Column(name = "petrol_sales")
    private Double petrolSales;

    @Column(name = "diesel_sales")
    private Double dieselSales;

    @Column(name = "expenses")
    private Double expenses;

    @Column(name = "cash")
    private Double cash;

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getPetrolSales() {
        return petrolSales;
    }

    public void setPetrolSales(Double petrolSales) {
        this.petrolSales = petrolSales;
    }

    public Double getDieselSales() {
        return dieselSales;
    }

    public void setDieselSales(Double dieselSales) {
        this.dieselSales = dieselSales;
    }

    public Double getExpenses() {
        return expenses;
    }

    public void setExpenses(Double expenses) {
        this.expenses = expenses;
    }

    public Double getCash() {
        return cash;
    }

    public void setCash(Double cash) {
        this.cash = cash;
    }
}
