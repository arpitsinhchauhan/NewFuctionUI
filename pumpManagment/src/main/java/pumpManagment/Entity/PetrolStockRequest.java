package pumpManagment.Entity;

public class PetrolStockRequest {
    private String userId;
    private String date;
    private double petrolRemaining;

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

    public double getPetrolRemaining() {
        return petrolRemaining;
    }

    public void setPetrolRemaining(double petrolRemaining) {
        this.petrolRemaining = petrolRemaining;
    }
}
