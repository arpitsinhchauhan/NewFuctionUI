package pumpManagment.Entity;

public class XPPetrolStockRequest {

        private String userId;
        private String date;
        private double xppetrolRemaining;

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

    public double getXppetrolRemaining() {
        return xppetrolRemaining;
    }

    public void setXppetrolRemaining(double xppetrolRemaining) {
        this.xppetrolRemaining = xppetrolRemaining;
    }
}
