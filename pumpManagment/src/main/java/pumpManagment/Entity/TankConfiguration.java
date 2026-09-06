package pumpManagment.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tank_configuration")
public class TankConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "fuel_type", nullable = false)
    private String fuelType; // 'petrol', 'diesel', 'xppetrol', 'powerdiesel'

    @Column(name = "tank_name", nullable = false)
    private String tankName;

    @Column(name = "capacity", nullable = false)
    private Double capacity;

    @Column(name = "min_stock_level")
    private Double minStockLevel;

    @Column(name = "alert_level")
    private Double alertLevel;

    public TankConfiguration() {
    }

    public TankConfiguration(String userId, String fuelType, String tankName, Double capacity, Double minStockLevel, Double alertLevel) {
        this.userId = userId;
        this.fuelType = fuelType;
        this.tankName = tankName;
        this.capacity = capacity;
        this.minStockLevel = minStockLevel;
        this.alertLevel = alertLevel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    public Double getCapacity() {
        return capacity;
    }

    public void setCapacity(Double capacity) {
        this.capacity = capacity;
    }

    public Double getMinStockLevel() {
        return minStockLevel;
    }

    public void setMinStockLevel(Double minStockLevel) {
        this.minStockLevel = minStockLevel;
    }

    public Double getAlertLevel() {
        return alertLevel;
    }

    public void setAlertLevel(Double alertLevel) {
        this.alertLevel = alertLevel;
    }
}
