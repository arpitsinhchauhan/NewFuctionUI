package pumpManagment.Entity;

import java.util.List;

public class AtmSellRequest {

    private String date;
    private List<transaction> expenses;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<transaction> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<transaction> expenses) {
        this.expenses = expenses;
    }
}
