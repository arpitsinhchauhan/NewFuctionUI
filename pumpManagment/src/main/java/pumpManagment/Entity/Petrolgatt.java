package pumpManagment.Entity;

import javax.persistence.*;

@Entity
@Table(name = "petrolgatt")
public class Petrolgatt {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "petrolgatt")
    private double petrolgatt;
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

    public double getPetrolgatt() {
        return petrolgatt;
    }

    public void setPetrolgatt(double petrolgatt) {
        this.petrolgatt = petrolgatt;
    }

   

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
