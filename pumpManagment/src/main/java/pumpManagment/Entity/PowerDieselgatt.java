package pumpManagment.Entity;

import javax.persistence.*;

@Entity
@Table(name = "powerdieselgatt")
public class PowerDieselgatt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "power_dieselgatt")
    private double powerDieselgatt;
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

    public double getPowerDieselgatt() {
        return powerDieselgatt;
    }

    public void setPowerDieselgatt(double powerDieselgatt) {
        this.powerDieselgatt = powerDieselgatt;
    }

   

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
