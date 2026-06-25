package pumpManagment.Entity;

import javax.persistence.*;

@Entity
@Table(name = "expenseslist")
public class Expenses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "expenses_list")
    private String expensesList;

    @Column(name = "user_id")
    private String userId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getExpensesList() {
        return expensesList;
    }

    public void setExpensesList(String expensesList) {
        this.expensesList = expensesList;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}


