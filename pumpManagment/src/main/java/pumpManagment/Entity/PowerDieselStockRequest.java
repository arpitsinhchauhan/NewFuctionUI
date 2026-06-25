package pumpManagment.Entity;

public class PowerDieselStockRequest {

    private String userId;
    private String date;
    private double powerdieselRemaining;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getPowerdieselRemaining() {
        return powerdieselRemaining;
    }

    public void setPowerdieselRemaining(double powerdieselRemaining) {
        this.powerdieselRemaining = powerdieselRemaining;
    }
}
