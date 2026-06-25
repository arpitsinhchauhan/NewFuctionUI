package pumpManagment.Entity;

public class DieselStockRequest {

    private String userId;
    private String date;
    private double dieselRemaining;

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

    public double getDieselRemaining() {
        return dieselRemaining;
    }

    public void setDieselRemaining(double dieselRemaining) {
        this.dieselRemaining = dieselRemaining;
    }
}
