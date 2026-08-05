package pumpManagment.Entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "day_closing_audit_log")
public class DayClosingAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "business_date", nullable = false)
    private String businessDate;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "action", nullable = false)
    private String action; // DAY_CLOSED or DAY_REOPENED

    private String performedBy;
    private String performedRole;
    private LocalDateTime timestamp;

    private Double totalSales = 0.0;
    private Double totalExpenses = 0.0;
    private Double netCollection = 0.0;

    @Column(length = 1000)
    private String reason;

    private String ipAddress;

    public DayClosingAuditLog() {
        this.timestamp = LocalDateTime.now();
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

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public String getPerformedRole() {
        return performedRole;
    }

    public void setPerformedRole(String performedRole) {
        this.performedRole = performedRole;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Double getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(Double totalSales) {
        this.totalSales = totalSales;
    }

    public Double getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(Double totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public Double getNetCollection() {
        return netCollection;
    }

    public void setNetCollection(Double netCollection) {
        this.netCollection = netCollection;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
}
