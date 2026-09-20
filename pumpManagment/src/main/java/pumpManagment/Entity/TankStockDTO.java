package pumpManagment.Entity;

public class TankStockDTO {
    private String fuelType;       // 'petrol', 'diesel', 'xppetrol', 'powerdiesel'
    private String label;          // 'Petrol', 'Diesel', 'XP Petrol', 'Power Diesel'
    private String tankName;       // 'Petrol Tank', etc.
    private double openingStock;
    private double purchaseQuantity;
    private double salesQuantity;
    private double testingQuantity;
    private double netSalesQuantity;
    private double gatt;
    private double currentStock;
    private double capacity;
    private double percentage;
    private double criticalLimit;  // in Litres (e.g. 3000.0)
    private double warningLimit;   // in Litres (e.g. 6000.0)
    private double minimumStock;   // for backwards compatibility
    private double alertLevel;     // for backwards compatibility
    private boolean isLowStock;
    private boolean isStockExceeded;
    private String validationError;
    private Double physicalStock;  // null if no dip reading today
    private String dipMm;          // null if no dip reading today
    private Double lossGain;       // physicalStock - currentStock
    private String status;         // 'NORMAL', 'WARNING', 'CRITICAL', 'EXCEEDED'
    private String statusLabel;    // 'NORMAL', 'Low Stock Warning', 'Low Stock / Critical', 'Stock Exceeds Capacity'

    public TankStockDTO() {
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getTankName() {
        return tankName;
    }

    public void setTankName(String tankName) {
        this.tankName = tankName;
    }

    public double getOpeningStock() {
        return openingStock;
    }

    public void setOpeningStock(double openingStock) {
        this.openingStock = openingStock;
    }

    public double getPurchaseQuantity() {
        return purchaseQuantity;
    }

    public void setPurchaseQuantity(double purchaseQuantity) {
        this.purchaseQuantity = purchaseQuantity;
    }

    public double getSalesQuantity() {
        return salesQuantity;
    }

    public void setSalesQuantity(double salesQuantity) {
        this.salesQuantity = salesQuantity;
    }

    public double getTestingQuantity() {
        return testingQuantity;
    }

    public void setTestingQuantity(double testingQuantity) {
        this.testingQuantity = testingQuantity;
    }

    public double getNetSalesQuantity() {
        return netSalesQuantity;
    }

    public void setNetSalesQuantity(double netSalesQuantity) {
        this.netSalesQuantity = netSalesQuantity;
    }

    public double getGatt() {
        return gatt;
    }

    public void setGatt(double gatt) {
        this.gatt = gatt;
    }

    public double getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(double currentStock) {
        this.currentStock = currentStock;
    }

    public double getCapacity() {
        return capacity;
    }

    public void setCapacity(double capacity) {
        this.capacity = capacity;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public double getCriticalLimit() {
        return criticalLimit;
    }

    public void setCriticalLimit(double criticalLimit) {
        this.criticalLimit = criticalLimit;
        this.alertLevel = criticalLimit;
    }

    public double getWarningLimit() {
        return warningLimit;
    }

    public void setWarningLimit(double warningLimit) {
        this.warningLimit = warningLimit;
        this.minimumStock = warningLimit;
    }

    public double getMinimumStock() {
        return minimumStock > 0 ? minimumStock : warningLimit;
    }

    public void setMinimumStock(double minimumStock) {
        this.minimumStock = minimumStock;
        if (this.warningLimit == 0) {
            this.warningLimit = minimumStock;
        }
    }

    public double getAlertLevel() {
        return alertLevel > 0 ? alertLevel : criticalLimit;
    }

    public void setAlertLevel(double alertLevel) {
        this.alertLevel = alertLevel;
        if (this.criticalLimit == 0) {
            this.criticalLimit = alertLevel;
        }
    }

    public boolean isLowStock() {
        return isLowStock;
    }

    public void setLowStock(boolean lowStock) {
        isLowStock = lowStock;
    }

    public boolean isStockExceeded() {
        return isStockExceeded;
    }

    public void setStockExceeded(boolean stockExceeded) {
        isStockExceeded = stockExceeded;
    }

    public String getValidationError() {
        return validationError;
    }

    public void setValidationError(String validationError) {
        this.validationError = validationError;
    }

    public Double getPhysicalStock() {
        return physicalStock;
    }

    public void setPhysicalStock(Double physicalStock) {
        this.physicalStock = physicalStock;
    }

    public String getDipMm() {
        return dipMm;
    }

    public void setDipMm(String dipMm) {
        this.dipMm = dipMm;
    }

    public Double getLossGain() {
        return lossGain;
    }

    public void setLossGain(Double lossGain) {
        this.lossGain = lossGain;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public void setStatusLabel(String statusLabel) {
        this.statusLabel = statusLabel;
    }
}
