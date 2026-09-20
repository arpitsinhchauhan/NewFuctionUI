package pumpManagment.Entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "tank_configuration")
public class TankConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pump_id")
    private Long pumpId;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "fuel_type", nullable = false)
    private String fuelType; // 'petrol', 'diesel', 'xppetrol', 'powerdiesel'

    @Column(name = "tank_name")
    private String tankName;

    @Column(name = "tank_capacity")
    private Double tankCapacity;

    @Column(name = "capacity")
    private Double capacity;

    @Column(name = "critical_limit")
    private Double criticalLimit;

    @Column(name = "alert_level")
    private Double alertLevel;

    @Column(name = "warning_limit")
    private Double warningLimit;

    @Column(name = "min_stock_level")
    private Double minStockLevel;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;

    public TankConfiguration() {
    }

    public TankConfiguration(Long pumpId, String fuelType, String tankName, Double tankCapacity, Double criticalLimit, Double warningLimit) {
        this.pumpId = pumpId;
        this.userId = pumpId != null ? String.valueOf(pumpId) : null;
        this.fuelType = fuelType;
        this.tankName = tankName;
        this.tankCapacity = tankCapacity;
        this.capacity = tankCapacity;
        this.criticalLimit = criticalLimit;
        this.alertLevel = criticalLimit;
        this.warningLimit = warningLimit;
        this.minStockLevel = warningLimit;
        this.active = true;
    }

    public TankConfiguration(String userId, String fuelType, String tankName, Double capacity, Double minStockLevel, Double alertLevel) {
        this.userId = userId;
        try {
            if (userId != null && !userId.trim().isEmpty()) {
                this.pumpId = Long.valueOf(userId.trim());
            }
        } catch (Exception ignored) {}
        this.fuelType = fuelType;
        this.tankName = tankName;
        this.capacity = capacity;
        this.tankCapacity = capacity;
        this.warningLimit = minStockLevel;
        this.minStockLevel = minStockLevel;
        this.criticalLimit = alertLevel;
        this.alertLevel = alertLevel;
        this.active = true;
    }

    @PrePersist
    protected void onCreate() {
        Date now = new Date();
        this.createdAt = now;
        this.updatedAt = now;
        syncFields();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
        syncFields();
    }

    private void syncFields() {
        if (this.tankCapacity != null && this.capacity == null) {
            this.capacity = this.tankCapacity;
        } else if (this.capacity != null && this.tankCapacity == null) {
            this.tankCapacity = this.capacity;
        }

        if (this.criticalLimit != null && this.alertLevel == null) {
            this.alertLevel = this.criticalLimit;
        } else if (this.alertLevel != null && this.criticalLimit == null) {
            this.criticalLimit = this.alertLevel;
        }

        if (this.warningLimit != null && this.minStockLevel == null) {
            this.minStockLevel = this.warningLimit;
        } else if (this.minStockLevel != null && this.warningLimit == null) {
            this.warningLimit = this.minStockLevel;
        }

        if (this.userId == null && this.pumpId != null) {
            this.userId = String.valueOf(this.pumpId);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPumpId() {
        return pumpId;
    }

    public void setPumpId(Long pumpId) {
        this.pumpId = pumpId;
        if (pumpId != null && this.userId == null) {
            this.userId = String.valueOf(pumpId);
        }
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
        try {
            if (this.pumpId == null && userId != null && !userId.trim().isEmpty()) {
                this.pumpId = Long.valueOf(userId.trim());
            }
        } catch (Exception ignored) {}
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public String getTankName() {
        return tankName;
    }

    public void setTankName(String tankName) {
        this.tankName = tankName;
    }

    public Double getTankCapacity() {
        return tankCapacity != null ? tankCapacity : capacity;
    }

    public void setTankCapacity(Double tankCapacity) {
        this.tankCapacity = tankCapacity;
        this.capacity = tankCapacity;
    }

    public Double getCapacity() {
        return getTankCapacity();
    }

    public void setCapacity(Double capacity) {
        setTankCapacity(capacity);
    }

    public Double getCriticalLimit() {
        return criticalLimit != null ? criticalLimit : alertLevel;
    }

    public void setCriticalLimit(Double criticalLimit) {
        this.criticalLimit = criticalLimit;
        this.alertLevel = criticalLimit;
    }

    public Double getAlertLevel() {
        return getCriticalLimit();
    }

    public void setAlertLevel(Double alertLevel) {
        setCriticalLimit(alertLevel);
    }

    public Double getWarningLimit() {
        return warningLimit != null ? warningLimit : minStockLevel;
    }

    public void setWarningLimit(Double warningLimit) {
        this.warningLimit = warningLimit;
        this.minStockLevel = warningLimit;
    }

    public Double getMinStockLevel() {
        return getWarningLimit();
    }

    public void setMinStockLevel(Double minStockLevel) {
        setWarningLimit(minStockLevel);
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
