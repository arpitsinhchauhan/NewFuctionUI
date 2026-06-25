package pumpManagment.Entity;

import javax.persistence.*;

@Entity
@Table(name = "dieselgatt")
public class Dieselgatt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "dieselgatt")
    private double dieselgatt;
    @Column(name = "user_id")
    private String userId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getDieselgatt() {
        return dieselgatt;
    }

    public void setDieselgatt(double dieselgatt) {
        this.dieselgatt = dieselgatt;
    }

    

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
