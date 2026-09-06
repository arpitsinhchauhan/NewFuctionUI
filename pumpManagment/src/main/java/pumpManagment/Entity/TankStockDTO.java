package pumpManagment.Entity;

public class TankStockDTO {
    private String fuelType;       // 'petrol', 'diesel', 'xppetrol', 'powerdiesel'
    private String label;          // 'Regular Petrol', 'Diesel', 'XP Petrol', 'Power Diesel'
    private String tankName;       // 'Tank 1', etc.
    private double openingStock;
    private double purchaseQuantity;
    private double salesQuantity;
    private double testingQuantity;
    private double netSalesQuantity;
    private double gatt;
    private double currentStock;
    private double capacity;
    private double percentage;
    private double minimumStock;
    private double alertLevel;
    private boolean isLowStock;
    private Double physicalStock;  // null if no dip reading today
    private String dipMm;          // null if no dip reading today
    private Double lossGain;       // physicalStock - currentStock
    private String status;         // 'Normal', 'Low', 'Critical'

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

    public double getMinimumStock() {
        return minimumStock;
    }

    public void setMinimumStock(double minimumStock) {
        this.minimumStock = minimumStock;
    }

    public double getAlertLevel() {
        return alertLevel;
    }

    public void setAlertLevel(double alertLevel) {
        this.alertLevel = alertLevel;
    }

    public boolean isLowStock() {
        return isLowStock;
    }

    public void setLowStock(boolean lowStock) {
        isLowStock = lowStock;
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
}
