package pumpManagment.Entity;

public class TotalCaseRequest {
    private String userId;
    private String date;
    private double totalcase;

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

    public double getTotalcase() {
        return totalcase;
    }

    public void setTotalcase(double totalcase) {
        this.totalcase = totalcase;
    }
}
