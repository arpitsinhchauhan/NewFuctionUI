package pumpManagment.Entity;

import javax.persistence.*;

@Entity
@Table(name = "creditlist")
public class CreditList {
    @Id
    @GeneratedValue
    private Integer id;
    @Column(name = "credit_list")
    private String creditList;
    @Column(name = "user_id")
    private String userId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCreditList() {
        return creditList;
    }

    public void setCreditList(String creditList) {
        this.creditList = creditList;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}

